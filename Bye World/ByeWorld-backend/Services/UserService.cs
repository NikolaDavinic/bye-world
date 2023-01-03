using ByeWorld_backend.Models;
using Neo4jClient;
using StackExchange.Redis;
using System.Text.Json;

namespace ByeWorld_backend.Services
{
    public class UserService
    {
        private readonly IConnectionMultiplexer _redis;
        private readonly IBoltGraphClient _neo4j;
        public UserService(IConnectionMultiplexer redis, IBoltGraphClient neo4j)
        {
            _redis = redis;
            _neo4j = neo4j;
        }

        public async Task<User?> GetUserById(long id)
        {
            var tokenSource = new CancellationTokenSource();
            var cancellationToken = tokenSource.Token;

            var db = _redis.GetDatabase();

            Task<RedisValue> redisTask = db.StringGetAsync($"user:{id}");

            Task<IEnumerable<User>> neo4jTask = _neo4j.Cypher
                .Match("(n:User)")
                .Where("n.Id = $id")
                .WithParam("id", id)
                .Return((n) => n.As<User>())
                .Limit(1)
                .ResultsAsync;

            if ((await Task.WhenAny(redisTask, neo4jTask)) == redisTask)
            {
                var redisValue = (await redisTask).ToString();
                if (!string.IsNullOrEmpty(redisValue))
                {
                    tokenSource.Cancel();
                    return JsonSerializer.Deserialize<User>(redisValue);
                }
            }

            var value = (await neo4jTask).First();

            if (value != null)
            {
                _ = db.StringSetAsync($"user:{value.Id}", JsonSerializer.Serialize<User?>(value));
            }

            return value;
        }
    }
}
