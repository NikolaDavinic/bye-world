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
        private readonly ICachingService _cache;
        public ReviewController(
            IConnectionMultiplexer redis, 
            IBoltGraphClient neo4j, 
            IIdentifierService ids,
            ICachingService cache)
        {
            _cache = cache;
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
                })
                .Limit(10);

            var result = await _cache.QueryCache(query, $"company:reviews:{id}", expiry: TimeSpan.FromMinutes(30));

            var returnVal = result?.Select(r => new
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
                r.Review.Id,
                r.Review.Date,
                r.Review.Value,
                r.Review.Description
            });

            return Ok(returnVal);
        }

        [Authorize]
        [HttpPut]
        public async Task<IActionResult> UpdateReview([FromBody] UpdateReviewDTO rw)
        {
            var userId = int.Parse(HttpContext.User.Claims.FirstOrDefault(c => c.Type.Equals("Id"))?.Value ?? "0");

            var result = (await _neo4j.Cypher
                .Match("(r:Review)-[]-(u:User)")
                .Where((Review r, User u) => r.Id == rw.Id && u.Id == userId)
                .Set("r.Value = $value")
                .Set("r.Description = $desc")
                .WithParam("value", rw.Value)
                .WithParam("desc", rw.Description)
                .With("r as r")
                .OptionalMatch("(r)-[]-(c:Company)")
                .Return((r, c) => new {
                    Review = r.As<Review>(),
                    CompanyId = c.As<Company>().Id
                })
                .ResultsAsync)
                .FirstOrDefault();

            if (result?.Review != null)
            {
                var db = _redis.GetDatabase();
                _ = db.KeyDeleteAsync($"company:reviews:{result?.CompanyId}");
                return Ok(result?.Review);
            } else
            {
                return BadRequest("Update failed");
            }
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteReview(int id)
        {
            var userId = int.Parse(HttpContext.User.Claims.FirstOrDefault(c => c.Type.Equals("Id"))?.Value ?? "-1");

            var result = (await _neo4j.Cypher
                .Match("(r:Review)-[]-(u:User)")
                .Where((Review r, User u) => r.Id == id && u.Id == userId)
                .OptionalMatch("(r)-[]-(c:Company)")
                .DetachDelete("r")
                .Return((r, c) => new { 
                    Review = r.As<Review>(),
                    CompanyId = c.As<Company>().Id 
                })
                .ResultsAsync).FirstOrDefault();

            if (result?.Review != null)
            {
                var db = _redis.GetDatabase();
                _ = db.KeyDeleteAsync($"company:reviews:{result?.CompanyId}");
                return Ok("Review deleted");
            } else
            {
                return BadRequest("Unsuccessful deletion");
            }
        }
        
        [HttpGet("user/{id}")]
        public async Task<IActionResult> GetUserReviews(int id)
        {
            var query = _neo4j.Cypher
                .Match("(u:User)-[]-(r:Review)")
                .Where((User u) => u.Id == id)
                .OptionalMatch("(r)-[]-(c:Company)")
                .Return((r, c, u) => new
                {
                    User = u.As<User>(),
                    Review = r.As<Review>(),
                    CompanyName = c.As<Company>().Name,
                    CompanyId = c.As<Company>().Id
                })
                .OrderByDescending("r.Date");

            var result = (await query.ResultsAsync).Select(r => new 
            {
                User = new 
                {
                    r.User.Id,
                    r.User.Name,
                    r.User.ImageUrl
                },
                r.Review.Id,
                r.Review.Date,
                r.Review.Description,
                r.Review.Value,
                Company = new 
                {
                    Id = r.CompanyId,
                    Name = r.CompanyName
                }
            });

            return Ok(result);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> AddReview([FromBody] AddReviewDTO rw)
        {
            long userId = Int32.Parse(HttpContext.User.Claims.FirstOrDefault(x => x.Type.Equals("Id"))?.Value ?? "0");

            var db = _redis.GetDatabase();
            _ = db.KeyDeleteAsync($"company:reviews:{rw.CompanyId}");

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
                r.Review.Id,
                r.Review.Date,
                r.Review.Value,
                r.Review.Description
            }).FirstOrDefault();

            return Ok(returnVal);
        }
    }
}
