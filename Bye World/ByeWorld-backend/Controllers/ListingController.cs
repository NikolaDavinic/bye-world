using ByeWorld_backend.DTO;
using ByeWorld_backend.Models;
using ByeWorld_backend.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ViewEngines;
using Neo4jClient;
using Neo4jClient.Extensions;
using StackExchange.Redis;
using System.Collections;

namespace ByeWorld_backend.Controllers
{
    [ApiController]
    [Route("listing")]
    public class ListingController : ControllerBase
    {
        private readonly IConnectionMultiplexer _redis;
        private readonly IBoltGraphClient _neo4j;
        private readonly IIdentifierService _ids;
        public ListingController(IConnectionMultiplexer redis, IBoltGraphClient neo4j, IIdentifierService ids)
        {
            _redis = redis;
            _neo4j = neo4j;
            _ids = ids;
        }


        [HttpGet("filter")]
        public async Task<ActionResult> GetAllListings([FromQuery] string? keyword, [FromQuery]string? city, [FromQuery]string? position, [FromQuery] string? seniority, [FromQuery] bool sortNewest=true)
        {

            //var listings = await _neo4j.Cypher.Match("(n:Listing)")
            //                                  .Return(n => n.As<Listing>()).ResultsAsync;
            var query = _neo4j.Cypher.Match("(s:Skill)-[reqs:REQUIRES]-(l:Listing)-[r]-(c:City)").Match("(l)-[:HAS_LISTING]-(co:Company)").Where((Listing l) => true);

            if (!String.IsNullOrEmpty(keyword))
            {
                query=query.AndWhere((Listing l) => l.Title.Contains(keyword));
            }
            if (!String.IsNullOrEmpty(city))
            {
                query=query.AndWhere((Listing l,City c) => c.Name.Contains(city));
            }
            //TODO: CONTAINS ili = kod pretragu, kad trazis za java da li da vrati i javascript??????
            if (!String.IsNullOrEmpty(position))
             {
                query = query.AndWhere($"toLower(s.Name) CONTAINS toLower('{position}')");
            }
            if (!String.IsNullOrEmpty(seniority))
                query = query.AndWhere($"toLower(reqs.Proficiency) CONTAINS toLower('{seniority}')");

            //TODO: Pravi DTO isti za back i front za formiranje liste listinga
            var retVal = query.Return((l,c,s,co) => new /*Listing*/{ 
                Title=l.As<Listing>().Title,
                City=c.As<City>(),
                Description = l.As<Listing>().Description,
                ClosingDate= l.As<Listing>().ClosingDate,
                PostingDate = l.As<Listing>().PostingDate,
                Id=l.As<Listing>().Id,
                Requirements=s.CollectAs<Skill>(),
                Company =co.As<Company>()
            });
            if (sortNewest)
            {
                retVal = retVal.OrderBy("l.PostingDate DESC");
            }
            else
                retVal = retVal.OrderBy("l.ClosingDate ASC");
            return Ok(await retVal.ResultsAsync);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetListingById(int id)
        {
            var listing = await _neo4j.Cypher.Match("(l:Listing)")
                                             .Where((Listing l) => l.Id == id)
                                             .Return(l => l.As<Listing>()).ResultsAsync;
            return Ok(listing.LastOrDefault());
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateListingById(int id, [FromBody]Listing listing)
        {
            await _neo4j.Cypher.Match("(l:Listing)")
                               .Where((Listing l) => l.Id == id)
                               .Set("l = $listing")
                               .WithParam("listing", listing)
                               .ExecuteWithoutResultsAsync();

            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteListingById(int id)
        {
            await _neo4j.Cypher.Match("(l:Listing)")
                               .Where((Listing l) => l.Id == id)
                               .Delete("l")
                               .ExecuteWithoutResultsAsync();
            return Ok();
        }

        [HttpPost("add")]
        public async Task<ActionResult> CreateListing([FromBody] AddListingDTO listing)
        {
            long lid = await _ids.ListingNext();
            var newListing = new Listing
            {
                Id=lid,
                ClosingDate=listing.ClosingDate,
                PostingDate=listing.PostingDate,
                Description=listing.Description,
                Title=listing.Title
            };
            var cityNode = await _neo4j.Cypher
                .Match("(c:City)")
                .Where((City c) => c.Name == listing.CityName)
                .Return(c => c.As<City>())
                .ResultsAsync;

            if(cityNode.Count()==0)
            {
                long cityId = await _ids.CityNext();
                cityNode = await _neo4j.Cypher
                    .Create("(c:City $newCity)")
                    .WithParam("newCity", new City { Id = cityId, Name = listing.CityName })
                    .Return(c => c.As<City>())
                    .ResultsAsync;
            }

            var companyNode = await _neo4j.Cypher
                .Match("(c:Company)")
                .Where((Company c) => c.Id == listing.CompanyId)
                .Return(c => c.As<Company>())
                .ResultsAsync;


            String skillsName = string.Empty;
            listing.Requirements.ForEach(req => skillsName +="'"+ req.Name + "', ");
            skillsName = skillsName.Substring(0,skillsName.Length - 2);
            var skillNodes = await _neo4j.Cypher
                    .Match("(s:Skill)")
                    .Where($"s.Name IN [{skillsName}]")
                    .Return(s => s.As<Skill>())
                    .ResultsAsync;

            if(skillNodes.Count()!=listing.Requirements.Count())
            {
                foreach (var req in listing.Requirements)
                {
                    if (!skillNodes.Any(skillNode=>skillNode.Name==req.Name))
                    {
                        //long skillId = await _ids.SkillNext();
                        skillNodes = skillNodes.Concat(await _neo4j.Cypher
                            .Create("(s:Skill $newSkill)")
                            .WithParam("newSkill", new Skill { Id = 0, Name = req.Name })
                            .Return(s => s.As<Skill>())
                            .ResultsAsync);
                    }
                }
            }


            var query = _neo4j.Cypher
               .Match("(c:Company)")
               .Where((Company c) => c.Id == listing.CompanyId)
               .Match("(ci:City)")
               .Where((City ci) => ci.Name == listing.CityName)
               .Create("(l:Listing $newListing)<-[:HAS_LISTING]-(c)")
               .Create("(l)-[:LOCATED_IN]->(ci)")
               .WithParam("newListing", newListing);

            //TODO: Sredi ID samo
            for (int i = 0; i < listing.Requirements.Count; i++)
            {
                query = query.Create($"(l)-[:REQUIRES {{Proficiency: $prof{i}}}]->(c{i}: Skill $newSkill{i})")
                        .WithParam($"prof{i}", listing.Requirements[i].Proficiency)
                        .WithParam($"newSkill{i}", new Skill { Name = listing.Requirements[i].Name, Id = 0 });
            }
            var retVal=await query.Return((c, ci, l) => new
             {
                 Listing = l.As<Listing>(),
                 Id=l.As<Listing>().Id,
                 Company = c.As<Company>(),
                 CityName = ci.As<City>().Name
             }).ResultsAsync;
            if (retVal.Count() == 0)
                return BadRequest("Dodavanje listinga neuspesno");

            return Ok(retVal);
        }

        [HttpGet("getfirstthreesimilarlistings")]
        public async Task<ActionResult> GetFirstThreeSimilarListings([FromBody] SimilarListingDTO l)
        {

            //var SimilarByCompany = _neo4j.Cypher
            //    .Match("(l:Listing)")
            //    .Where("l.Company = $query")
            //    .WithParam("query",l.Company)
            //    .Return(l => l.As<Listing>()).Limit(2);

            //var SimilarByCity = _neo4j.Cypher
            //    .Match("(l:Listing)")
            //    .Where("l.City = $query")
            //    .WithParam("query", l.City)
            //    .Return(l => l.As<Listing>()).Limit(1);

            ////var SimilarByRequirements = _neo4j.Cypher
            ////    .Match("(l:Listing)")
            ////    .Return(l => l.As<Listing>());

            //var rez = new ArrayList();
            //rez.Add(SimilarByCity);
            //rez.Add(SimilarByCompany);

            //return Ok(rez);

            var AllListings = await _neo4j.Cypher
                .Match("(l:Listing)-[]->(r:RequirementSkill)")
                .Return(l => l.As<Listing>())
                .ResultsAsync;
            List<Listing> result = new List<Listing>();
            foreach(var el in AllListings)
            {
                if(el.Requirements.Count()==l.Requirements.Count())
                {
                    int brojac = 0;
                    foreach(var r in el.Requirements)
                    {
                        //if(String.Compare(r?.Skill?.Name, l?.Requirements[brojac]?.Skill?.Name))
                        //{

                        //}
                    }
                    if (brojac == l.Requirements.Count())
                    {
                        result.Add(el);
                    }
                }
            }
            return Ok();
        }
    }
}
