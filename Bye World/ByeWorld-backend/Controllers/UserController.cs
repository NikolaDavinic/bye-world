using Microsoft.AspNetCore.Mvc;
using StackExchange.Redis;

namespace ByeWorld_backend.Controllers
{
    [ApiController]
    [Route("user")]
    public class UserController : ControllerBase
    {
        private readonly IConnectionMultiplexer _redis;
        public UserController(IConnectionMultiplexer redis)
        {
            _redis = redis;
        }

        [HttpGet("login")]
        public async Task<IActionResult> Login()
        {
            var db = _redis.GetDatabase();
            await db.StringSetAsync("user", "stefan");

            return Ok((string)(await db.StringGetAsync("user")));
        }
    }
}
