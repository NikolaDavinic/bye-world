using ByeWorld_backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Neo4jClient;
using StackExchange.Redis;

namespace ByeWorld_backend.Controllers
{
    [ApiController]
    [Route("Listing")]
    public class ListingController : ControllerBase
    {
        private readonly IConnectionMultiplexer _redis;
        private readonly IBoltGraphClient _neo4j;

        public ListingController(IConnectionMultiplexer redis, IBoltGraphClient neo4j)
        {
            _redis = redis;
            _neo4j = neo4j;
        }
        
        [HttpGet]
        public async Task<ActionResult> GetAllListing()
        {
            var listings = await _neo4j.Cypher.Match("(n:Listing)")
                                               .Return(n => n.As<Listing>()).ResultsAsync;
            return Ok(listings);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetListingById(int id)
        {
            var listing = await _neo4j.Cypher.Match("(l:Listing)")
                                             .Where((Listing l) => l.ID == id)
                                             .Return(l => l.As<Listing>()).ResultsAsync;
            return Ok(listing.LastOrDefault());
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateListingById(int id, [FromBody]Listing listing)
        {
            await _neo4j.Cypher.Match("(l:Listing)")
                               .Where((Listing l) => l.ID == id)
                               .Set("l = $listing")
                               .WithParam("listing", listing)
                               .ExecuteWithoutResultsAsync();

            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteListingById(int id)
        {
            await _neo4j.Cypher.Match("(l:Listing)")
                               .Where((Listing l) => l.ID == id)
                               .Delete("l")
                               .ExecuteWithoutResultsAsync();
            return Ok();
        }

        [HttpPost]
        public async Task<ActionResult> CreateListing([FromBody] Listing listing)
        {

            var newListing = new Listing
            {
                ID=listing.ID,
                ClosingDate=listing.ClosingDate,
                PostingDate=listing.PostingDate,
                Description=listing.Description,
                Title=listing.Title
            };

            //await _neo4j.Cypher
            //    .Create("(listing:Listing $newListing)")
            //    .WithParam("newListing", newListing)
            //    .ExecuteWithoutResultsAsync();
            //var retVal = await _neo4j.Cypher
            //    .Create("(listing:Listing $newListing)")
            //    .WithParam("newListing", newListing)
            //    .Return(listing => listing.As<Listing>()).Limit(1)
            //    .ResultsAsync;
            await _neo4j.Cypher
                .Match("(c:City)")
                .Where((City c) => c.Id == listing.City.Id)
                .Create("(c)-[:HAS_LISTING]->(:Listing $listing)")
                .WithParam("listing", newListing)
                .ExecuteWithoutResultsAsync();
            return Ok();
        }
    }
}
