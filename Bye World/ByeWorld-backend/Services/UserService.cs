using ByeWorld_backend.Models;
using Neo4jClient;
using StackExchange.Redis;
using System.Text.Json;

namespace ByeWorld_backend.Services
{
    public class UserService : IUserService
    {
        private readonly IConnectionMultiplexer _redis;
        private readonly IBoltGraphClient _neo4j;
        public UserService(IConnectionMultiplexer redis, IBoltGraphClient neo4j)
        {
            _redis = redis;
            _neo4j = neo4j;
        }

        public async Task<string?> SetUserCV(long userId, string path)
        {
            var query = _neo4j.Cypher
                .Match("(u:User)")
                .Where((User u) => u.Id == userId)
                .Set("u.CV = $path")
                .WithParam("path", path)
                .Return(u => u.As<User>().CV);

            var result = await query.ResultsAsync;

            return result.FirstOrDefault();
        }
    }
}
