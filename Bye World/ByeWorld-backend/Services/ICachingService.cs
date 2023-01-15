using Neo4jClient.Cypher;

namespace ByeWorld_backend.Services
{
    public interface ICachingService
    {
        Task<IEnumerable<T>?> QueryCache<T>(ICypherFluentQuery<T> neoQuery, string redisKey, TimeSpan? expiry = null);
        Task<IEnumerable<T>?> QueryCacheInParallel<T>(ICypherFluentQuery<T> neoQuery, string redisKey, TimeSpan? expiry = null);
    }
}