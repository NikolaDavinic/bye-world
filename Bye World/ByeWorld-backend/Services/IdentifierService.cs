using Microsoft.AspNetCore.Mvc;
using Neo4jClient;
using StackExchange.Redis;

namespace ByeWorld_backend.Services
{
    public class IdentifierService : IIdentifierService
    {
        private readonly IConnectionMultiplexer _redis;
        private readonly IBoltGraphClient _neo4j;
        public IdentifierService(IConnectionMultiplexer redis, IBoltGraphClient neo4j)
        {
            _redis = redis;
            _neo4j = neo4j;
        }

        public async Task<long> IdNext(string node)
        {
            var db = _redis.GetDatabase();

            long value = await db.StringIncrementAsync($"identifier:{node.ToLower()}");

            // vrednost resetovana - memorija redisa potencijalno ociscena
            if (value == 1)
            {
                var query = _neo4j.Cypher
                    .Match($"(n:{node})")
                    .Where("n.Id IS NOT NULL")
                    .Return<long>("n.Id")
                    .OrderByDescending("n.Id")
                    .Limit(1);

                var dbMaxId = (await query.ResultsAsync).FirstOrDefault();

                if (dbMaxId != 0)
                {
                    value = await db.StringIncrementAsync($"identifier:{node.ToLower()}", dbMaxId + 1);
                }
            }

            return value;
        }
        
        public async Task<long> CompanyNext()
        {
            return await IdNext("Company");
        }

        public async Task<long> UserNext()
        {
            return await IdNext("User");
        }
        public async Task<long> ListingNext()
        {
            return await IdNext("Listing");
        }
    }
}
