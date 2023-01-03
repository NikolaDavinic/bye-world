﻿using ByeWorld_backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Neo4jClient;
using StackExchange.Redis;

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
        
        [HttpGet("Listings")]
        public async Task<ActionResult> GetAllListings([FromQuery] string? keyword, [FromQuery]string? city, [FromQuery]string? position, [FromQuery] string? seniority)
        {

            //var listings = await _neo4j.Cypher.Match("(n:Listing)")
            //                                  .Return(n => n.As<Listing>()).ResultsAsync;
            var listings = _neo4j.Cypher.Match("(l:Listing)-[r]-(c:City)").Where((Listing l)=>true);
            if (!String.IsNullOrEmpty(keyword))
            {
                listings=listings.AndWhere((Listing l) => l.Title.ToLower().Contains(keyword.ToLower()));
            }
            if (!String.IsNullOrEmpty(city))
            {
                listings=listings.AndWhere((Listing l,City c) => c.Name.ToLower().Contains(city.ToLower()));
            }
            if (!String.IsNullOrEmpty(position))
            {
                if (!String.IsNullOrEmpty(seniority))
                    listings=listings.AndWhere((Listing l) => l.Requirements.Any(req => req.Skill.Name.Contains(position) && req.Proficiency.Contains(seniority)));
                else
                    listings=listings.AndWhere((Listing l) => l.Requirements.Any(req => req.Skill.Name.Contains(position)));
            }

            var retVal = listings.Return((l,c) => new Listing{ 
                Title=l.As<Listing>().Title,
                City=c.As<City>(),
                Description = l.As<Listing>().Description,
                ClosingDate= l.As<Listing>().ClosingDate,
                PostingDate = l.As<Listing>().PostingDate,
                Id=l.As<Listing>().Id,
                //TODO:Ubaci i company
            });
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

        [HttpPost]
        public async Task<ActionResult> CreateListing([FromBody] Listing listing)
        {

            var newListing = new Listing
            {
                Id=listing.Id,
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
