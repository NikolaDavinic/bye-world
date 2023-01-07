using ByeWorld_backend.DTO;
using ByeWorld_backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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

        public ListingController(IConnectionMultiplexer redis, IBoltGraphClient neo4j)
        {
            _redis = redis;
            _neo4j = neo4j;
        }
        
        [HttpGet("filter")]
        public async Task<ActionResult> GetAllListings([FromQuery] string? keyword, [FromQuery]string? city, [FromQuery]string? position, [FromQuery] string? seniority, [FromQuery] bool sortNewest=true)
        {

            //var listings = await _neo4j.Cypher.Match("(n:Listing)")
            //                                  .Return(n => n.As<Listing>()).ResultsAsync;
            var query = _neo4j.Cypher.Match("(l:Listing)-[r]-(c:City)").Where((Listing l)=>true);
            if (!String.IsNullOrEmpty(keyword))
            {
                query=query.AndWhere((Listing l) => l.Title.Contains(keyword));
            }
            if (!String.IsNullOrEmpty(city))
            {
                query=query.AndWhere((Listing l,City c) => c.Name.Contains(city));
            }
            //TODO: Add filtering based on listing requirements
            if (!String.IsNullOrEmpty(position))
             {
                if (!String.IsNullOrEmpty(seniority))
                    query=query.AndWhere((Listing l) => l.Requirements.Any(req => req.Skill.Name.Contains(position) && req.Proficiency.Contains(seniority)));
                else
                    query = query.AndWhere((Listing l) => l.Requirements.Any(req => req.Skill.Name.Contains(position)));
            }

            var retVal = query.Return((l,c) => new Listing{ 
                Title=l.As<Listing>().Title,
                City=c.As<City>(),
                Description = l.As<Listing>().Description,
                ClosingDate= l.As<Listing>().ClosingDate,
                PostingDate = l.As<Listing>().PostingDate,
                Id=l.As<Listing>().Id,
                //TODO:Ubaci i company
                //TODO:Ubaci i skill-ove

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

            var newListing = new Listing
            {
                //TODO: Fix new listing ID
                Id=55,
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
                cityNode = await _neo4j.Cypher
                    .Create("(c:City $newCity)")
                    .WithParam("newCity", new City { Id = 55, Name = listing.CityName })
                    .Return(c => c.As<City>())
                    .ResultsAsync;
            }

            var companyNode = await _neo4j.Cypher
                .Match("(c:Company)")
                .Where((Company c) => c.Id == listing.CompanyId)
                .Return(c => c.As<Company>())
                .ResultsAsync;

            List<Skill> requiredSkills = new List<Skill>();

            List<String> skillNames = new List<String>();
            listing.Requirements.ForEach(req => skillNames.Add(req.Name));

            var skillNodes = await _neo4j.Cypher
                    .Match("(s:Skill)")
                    .Where((Skill s) => skillNames.Contains(s.Name))
                    .Return(s => s.As<Skill>())
                    .ResultsAsync;


            //var city = await _neo4j.Cypher
            //     .Match("(c:City)")
            //     .Where((City c) => c.Name == listing.CityName)
            //     .Return(c => c.As<City>())
            //     .Union()
            //     .Create("(c:City $city)")
            //     .WithParam("city", new City { Name = listing.CityName, Id = 55})
            //     .Return(c => c.As<City>())
            //     .ResultsAsync;
            //var retCity = city.FirstOrDefault();
            //var city = await _neo4j.Cypher
            //     .Merge("(c:City)")
            //     .Where((City c) => c.Name == listing.CityName)
            //     .OnCreate()
            //     .Set("c = {newCity}")
            //     .WithParam("newCity", new City { Name = listing.CityName, Id = 55 })
            //     .Return(c => c.As<City>())
            //     .ResultsAsync;
            //var retCity = city.FirstOrDefault();
            //var cityNode = await _neo4j.Cypher
            //    .Match("(c:City)")
            //    .Where((City c) => c.Name == listing.CityName)
            //    //.Return(c => c.As<City>())
            //    .create
            //    .Merge("(newC:City {name: $cityName})")
            //    .WithParam("cityName",listing.CityName)
            //    .Return(newC => newC.As<City>())
            //    .ResultsAsync;


            //await _neo4j.Cypher
            //    .Match("(c:City)")
            //    .Where((City c) => c.Id == listing.CityName.Id)
            //    .Create("(c)-[:HAS_LISTING]->(:Listing $listing)")
            //    .WithParam("listing", newListing)
            //    .ExecuteWithoutResultsAsync();
            return Ok(cityNode);
        }

        [HttpGet("getfirstthreesimilarlistings")]
        public async Task<ActionResult> GetFirstThreeSimilarListings([FromBody]Listing l)
        {

            var SimilarByCompany = _neo4j.Cypher
                .Match("(l:Listing)")
                .Where("l.Company = $query")
                .WithParam("query",l.Company)
                .Return(l => l.As<Listing>()).Limit(2);

            var SimilarByCity = _neo4j.Cypher
                .Match("(l:Listing)")
                .Where("l.City = $query")
                .WithParam("query", l.City)
                .Return(l => l.As<Listing>()).Limit(1);

            //var SimilarByRequirements = _neo4j.Cypher
            //    .Match("(l:Listing)")
            //    .Return(l => l.As<Listing>());

            var rez = new ArrayList();
            rez.Add(SimilarByCity);
            rez.Add(SimilarByCompany);

            return Ok(rez);
        }
    }
}
