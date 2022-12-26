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
        private readonly IGraphClient _neo4j;
        public UserController(IConnectionMultiplexer redis, IGraphClient neo4j)
        {
            _redis = redis;
            _neo4j = neo4j;
        }

        [HttpGet("login")]
        public async Task<IActionResult> Login()
        {
            var db = _redis.GetDatabase();
            await db.StringSetAsync("user", "stefan");

            //await _neo4j.Cypher.Match(@"(n)->[r]->(m)").Return((a) =>
            //{

            //});
            _neo4j.Cypher.Match();
            //return Ok(result);
            return Ok((string)(await db.StringGetAsync("user")));
        }
    }
}
