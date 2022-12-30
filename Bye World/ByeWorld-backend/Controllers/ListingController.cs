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
