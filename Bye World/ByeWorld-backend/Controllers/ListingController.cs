using ByeWorld_backend.DTO;
using ByeWorld_backend.Models;
using ByeWorld_backend.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ViewEngines;
using Neo4jClient;
using Neo4jClient.Cypher;
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
        public async Task<ActionResult> GetAllListings([FromQuery] string? keyword, [FromQuery]string? city, 
                [FromQuery]string? position, [FromQuery] string? seniority, [FromQuery] int? take, [FromQuery] bool sortNewest = true)
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

            //TODO: Napravi DTO?
            var retVal = query.Return((l, c, s, co) => new
            {
                Id = l.As<Listing>().Id,
                Title = l.As<Listing>().Title,
                Description = l.As<Listing>().Description,
                CityName = c.As<City>().Name,
                ClosingDate = l.As<Listing>().ClosingDate,
                PostingDate = l.As<Listing>().PostingDate,
                Requirements = s.CollectAs<Skill>(),
                CompanyName = co.As<Company>().Name,
                CompanyLogoUrl = co.As<Company>().LogoUrl,
                CompanyId= co.As<Company>().Id,
            });
            if (sortNewest)
            {
                retVal = retVal.OrderBy("l.PostingDate DESC");
            }
            else
                retVal = retVal.OrderBy("l.ClosingDate ASC");
            return Ok(await retVal.Limit(take).ResultsAsync);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetListingById(int id)
        {
            var db = _redis.GetDatabase();

            var query = _neo4j.Cypher.Match("(l:Listing)")
                                             .Where((Listing l) => l.Id == id)
                                             .Return(l => l.As<Listing>());

            var result = (await query.ResultsAsync).FirstOrDefault();

            if (result != null)
            {
                string keyDate = DateTime.Now.Date.ToShortDateString();
                db.SortedSetIncrement($"listings:leaderboard:{keyDate}", result.Id, 1);
            }

            return Ok(result);
        }

        [HttpGet("toplistings")]
        public async Task<ActionResult> GetTopListings()
        {
            var db = _redis.GetDatabase();

            string keyDate = DateTime.Now.Date.ToShortDateString();
            var ids = (await db.SortedSetRangeByRankAsync($"listings:leaderboard:{keyDate}", start: 0, stop: 5, Order.Descending))
                .Select(id => int.Parse(id.ToString()))
                .ToList();

            var query = _neo4j.Cypher
                .Match("(l:Listing)")
                .Where("l.Id IN $ids")
                .WithParam("ids", ids)
                .Return(l => l.As<Listing>());

            return Ok(await query.ResultsAsync);
        }

        [HttpGet("company/{id}")]
        public async Task<ActionResult> GetCompanyListings(int id)
        {
            //MATCH(l: Listing) -[listedby: HAS_LISTING] - (c: Company)
            //MATCH(l) -[req: REQUIRES]->(s: Skill)
            //MATCH(l) -[loc: LOCATED_IN]->(city: City)
            //WHERE c.Id <> 13 RETURN l, loc, c, [req.Proficiency, s] as requirement,city, listedby

            var query = _neo4j.Cypher
                .Match("(s:Skill)-[reqs:REQUIRES]-(l:Listing)-[r]-(c:City)")
                .Match("(l)-[:HAS_LISTING]-(co:Company)")
                .Where((Company co) => co.Id == id)
                .Return((l, c, s, co) => new {
                    Title = l.As<Listing>().Title,
                    City = c.As<City>(),
                    Description = l.As<Listing>().Description,
                    ClosingDate = l.As<Listing>().ClosingDate,
                    PostingDate = l.As<Listing>().PostingDate,
                    Id = l.As<Listing>().Id,
                    Requirements = s.CollectAs<Skill>(),
                    Company = co.As<Company>()
                });

            return Ok(await query.ResultsAsync);
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

        [HttpGet("similarlistings/{id}/{city}/{companyName}")]
        public async Task<ActionResult> getfirstthreesimilarlistings(int id, string? city, string? companyName)
        {
            var query = _neo4j.Cypher
                .Match("(l:Listing)-->(s:Skill)<--(lr:Listing), (l:Listing)-[:LOCATED_IN]->(c:City), (ic:Company)-[:HAS_LISTING]->(l:Listing)")
                .Where((Listing l, City c, Company ic) => l.Id == id && (c.Name == city || ic.Name == companyName))
                .With("distinct(lr) as reccs")
                .Return(reccs => reccs.As<Listing>())
                .Limit(3);

            
            return Ok(await query.ResultsAsync);
        }
    }
}
