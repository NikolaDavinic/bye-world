using ByeWorld_backend.Models;
using Microsoft.AspNetCore.Mvc;
using Neo4jClient;
using StackExchange.Redis;

namespace ByeWorld_backend.Controllers
{
    [ApiController]
    [Route("user")]
    public class UserController : ControllerBase
    {
        private readonly IConnectionMultiplexer _redis;
        private readonly IBoltGraphClient _neo4j;
        public UserController(IConnectionMultiplexer redis, IBoltGraphClient neo4j)
        {
            _redis = redis;
            _neo4j = neo4j;
        }

        [HttpGet("login")]
        public async Task<IActionResult> Login()
        {
            var db = _redis.GetDatabase();
            await db.StringSetAsync("user", "stefan");

            var result = _neo4j.Cypher.Match(@"(n:Actor)").Return((n) => n.As<Actor>()).Limit(5);
            
            return Ok(await result.ResultsAsync);
        }
    }
}
