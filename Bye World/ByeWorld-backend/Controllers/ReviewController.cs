using ByeWorld_backend.DTO;
using ByeWorld_backend.Models;
using ByeWorld_backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Neo4jClient;
using StackExchange.Redis;

namespace ByeWorld_backend.Controllers
{
    [ApiController]
    [Route("review")]
    public class ReviewController : ControllerBase
    {
        private readonly IConnectionMultiplexer _redis;
        private readonly IBoltGraphClient _neo4j;
        private readonly IIdentifierService _ids;
        public ReviewController(IConnectionMultiplexer redis, IBoltGraphClient neo4j, IIdentifierService ids)
        {
            _redis = redis;
            _neo4j = neo4j;
            _ids = ids;
        }

        [HttpGet("forcompany/{id}")]
        public async Task<IActionResult> CompanyReviews(long id)
        {
            var query = _neo4j.Cypher
                .Match("(c:Company)-[:HAS_REVIEW]->(r:Review)-[:LEFT_REVIEW]-(u:User)")
                .Where((Company c) => c.Id == id)
                .Return((u, c, r) => new
                {
                    Review = r.As<Review>(),
                    CompanyId = c.As<Company>().Id,
                    CompanyName = c.As<Company>().Name,
                    UserId = u.As<User>().Id,
                    UserName = u.As<User>().Name,
                    UserImageUrl = u.As<User>().ImageUrl
                });

            var returnVal = (await query.ResultsAsync).Select(r => new
            {
                Company = new
                {
                    Id = r.CompanyId,
                    Name = r.CompanyName
                },
                User = new
                {
                    Id = r.UserId,
                    Name = r.UserName,
                    ImageUrl = r.UserImageUrl
                },
                Id = r.Review.Id,
                Date = r.Review.Date,
                Value = r.Review.Value,
                Description = r.Review.Description
            });

            return Ok(returnVal);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> AddReview([FromBody] AddReviewDTO rw)
        {
            long userId = Int32.Parse(HttpContext.User.Claims.FirstOrDefault(x => x.Type.Equals("Id"))?.Value ?? "0");

            var review = new Review
            {
                Id = await _ids.ReviewNext(),
                Description = rw.Description,
                Value = rw.Value
            };

            var query = _neo4j.Cypher
                .Match("(u:User)")
                .Where((User u) => u.Id == userId)
                .Match("(c:Company)")
                .Where((Company c) => c.Id == rw.CompanyId)
                .Create("(r:Review $newreview)-[:LEFT_REVIEW]->(u)")
                .Create("(c)-[:HAS_REVIEW]->(r)")
                .WithParam("newreview", review)
                .Return((u, c, r) => new
                {
                    Review = r.As<Review>(),
                    CompanyId = c.As<Company>().Id,
                    CompanyName = c.As<Company>().Name,
                    UserId = u.As<User>().Id,
                    UserName = u.As<User>().Name,
                    UserImageUrl = u.As<User>().ImageUrl
                });

            var returnVal = (await query.ResultsAsync).Select(r => new 
            {
                Company = new 
                {
                    Id = r.CompanyId,
                    Name = r.CompanyName
                },
                User = new 
                {
                    Id = r.UserId,
                    Name = r.UserName,
                    ImageUrl = r.UserImageUrl
                },
                Id = r.Review.Id,
                Date = r.Review.Date,
                Value = r.Review.Value,
                Description = r.Review.Description
            }).First();

            return Ok(returnVal);
        }
    }
}
