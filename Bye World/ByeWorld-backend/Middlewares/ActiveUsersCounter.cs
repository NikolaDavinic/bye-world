using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using StackExchange.Redis;
using System.Threading.Tasks;

namespace ByeWorld_backend.Middlewares
{
    public class ActiveUsersCounter
    {
        private readonly RequestDelegate _next;
        private readonly IConnectionMultiplexer _redis;
        public ActiveUsersCounter(RequestDelegate next, IConnectionMultiplexer redis)
        {
            _next = next;
            _redis = redis;
        }

        public Task Invoke(HttpContext httpContext)
        {
            var userId = httpContext.User.Claims.FirstOrDefault(x => x.Type.Equals("Id"))?.Value;

            if (userId != null)
            {
                var db = _redis.GetDatabase();
                db.StringSet($"users:last_active:{userId}", DateTime.Now.ToString(), keepTtl: true);
            }

            return _next(httpContext);
        }
    }
}
