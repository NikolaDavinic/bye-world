using Neo4jClient;
using Neo4jClient.Cypher;
using Newtonsoft.Json;
using StackExchange.Redis;
//using System.Text.Json;

namespace ByeWorld_backend.Services
{
    public class CachingService : ICachingService
    {
        private readonly IConnectionMultiplexer _redis;
        private readonly IBoltGraphClient _neo4j;
        public CachingService(IConnectionMultiplexer redis, IBoltGraphClient neo4j)
        {
            _redis = redis;
            _neo4j = neo4j;
        }

        public async Task<IEnumerable<T>?> QueryCacheInParallel<T>(ICypherFluentQuery<T> neoQuery, string redisKey, TimeSpan? expiry = null)
        {
            var tokenSource = new CancellationTokenSource();
            var ct = tokenSource.Token;

            var db = _redis.GetDatabase();

            Task<RedisValue> redisTask = db.StringGetAsync(redisKey);

            Task<IEnumerable<T>> neo4jTask = Task.Run(async () => await neoQuery.ResultsAsync, ct);

            if ((await Task.WhenAny(redisTask, neo4jTask)) == redisTask)
            {
                var redisValue = (await redisTask).ToString();
                if (!string.IsNullOrEmpty(redisValue))
                {
                    tokenSource.Cancel();
                    return JsonConvert.DeserializeObject<List<T>>(redisValue);
                }
            }

            var value = await neo4jTask;

            if (value != null && value.Any())
            {
                _ = db.StringSetAsync(redisKey, JsonConvert.SerializeObject(value), expiry: expiry ?? TimeSpan.FromHours(1));
            }

            return value;
        }

        public async Task<IEnumerable<T>?> QueryCache<T>(ICypherFluentQuery<T> neoQuery, string redisKey, TimeSpan? expiry = null)
        {
            var db = _redis.GetDatabase();

            var redisValue = (await db.StringGetAsync(redisKey)).ToString();

            if (!string.IsNullOrEmpty(redisValue))
            {
                return JsonConvert.DeserializeObject<IEnumerable<T>>(redisValue);
            }

            var result = await neoQuery.ResultsAsync;

            if (result != null && result.Any())
            {
                _ = db.StringSetAsync(redisKey, JsonConvert.SerializeObject(result), expiry: expiry ?? TimeSpan.FromHours(1));
            }

            return result;
        }
    }
}
