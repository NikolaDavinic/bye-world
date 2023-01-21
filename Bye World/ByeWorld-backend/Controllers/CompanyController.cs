using ByeWorld_backend.DTO;
using ByeWorld_backend.Models;
using ByeWorld_backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Neo4jClient;
using Neo4jClient.Cypher;
using StackExchange.Redis;
using System.Security.Claims;
using System.Text.RegularExpressions;

namespace ByeWorld_backend.Controllers
{
    [Route("company")]
    [ApiController]
    public class CompanyController : ControllerBase
    {
        private readonly IConnectionMultiplexer _redis;
        private readonly IBoltGraphClient _neo4j;
        private readonly IIdentifierService _ids;
        private readonly ICachingService _cache;
        private readonly ILogger<CompanyController> _logger;
        public CompanyController(
            ILogger<CompanyController> logger,
            IConnectionMultiplexer redis, 
            IBoltGraphClient neo4j, 
            IIdentifierService ids, 
            ICachingService cache)
        {
            _redis = redis;
            _neo4j = neo4j;
            _ids = ids;
            _cache = cache;
            _logger = logger;
        }

        [Authorize(Roles = "Company")]
        [HttpPost]
        public async Task<ActionResult> AddCompany([FromBody] AddCompanyDTO company)
        {
            var claims = HttpContext.User.Claims;

            var userId = Int32.Parse(claims.Where(c => c.Type == "Id").FirstOrDefault()?.Value ?? "0");
            var role = claims.Where(c => c.Type == ClaimTypes.Role).FirstOrDefault()?.Value;

            var cid = await _ids.CompanyNext();

            var newCompany = await _neo4j.Cypher
                .Match("(u:User)")
                .Where((User u) => u.Id == userId)
                .Create("(u)-[:HAS_COMPANY]->(c:Company $newcompany)")
                .WithParam("newcompany", new Company
                {
                    Id = cid,
                    Address = company.Address,
                    Description = company.Description,
                    Email = company.Email,
                    Name = company.Name
                })
                .Return((u, c) => c.As<Company>())
                .ResultsAsync;

            return Ok(newCompany.First());

        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserCompanies(int userId)
        {
            var query = _neo4j.Cypher
                .Match("(u:User)-[:HAS_COMPANY]-(c:Company)")
                .Where((User u) => u.Id == userId)
                .OptionalMatch("(c)-[]-(r:Review)")
                .OptionalMatch("(c)-[]-(l:Listing)")
                .Return((c, r, l) => new {
                    Company = c.As<Company>(),
                    ReviewsCount = r.CountDistinct(),
                    AvgReview = Return.As<double>("avg(r.Value)"),
                    ListingsCount = l.CountDistinct()
                })
                .Limit(10);

            var retval = (await query.ResultsAsync).Select((r) => new
            {
                r.Company.Address,
                r.Company.Email,
                r.Company.Id,
                r.Company.LogoUrl,
                r.Company.Name,
                r.Company.VAT,
                r.Company.Description,
                r.ReviewsCount,
                r.AvgReview,
                r.ListingsCount
            });

            return Ok(retval);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetCompany(int id)
        {
            var query = _neo4j.Cypher
                .Match("(c:Company)")
                .Where((Company c) => c.Id == id)
                .OptionalMatch("(c)-[:HAS_REVIEW]-(r: Review)")
                .Return((c, r) => new {
                    Company = c.As<Company>(),
                    ReviewsCount = r.CountDistinct(),
                    AvgReview = Return.As<double>("avg(r.Value)")
                })
                .Limit(1);

            var result = await _cache.QueryCacheInParallel(query, $"companies:{id}");

            if (result == null)
            {
                return Ok(null);
            }

            var company = result.Select((r) => new 
            {
                r.Company.Address,
                r.Company.Email,
                r.Company.Id,
                r.Company.LogoUrl,
                r.Company.Name,
                r.Company.VAT,
                r.Company.Description,
                r.ReviewsCount,
                r.AvgReview
            }).FirstOrDefault();

            return Ok(company);
        }

        [HttpGet("filter")]
        public async Task<ActionResult> FilterCompany([FromQuery] string? filter)
        {
            var query = _neo4j.Cypher
                .Match("(c:Company)")
                .Where("c.Name =~ $query")
                .OrWhere("c.Address =~ $query")
                .WithParam("query", $"(?i).*{filter ?? ""}.*")
                .OptionalMatch("(c)-[]-(r:Review)")
                .OptionalMatch("(c)-[]-(l:Listing)")
                .With("DISTINCT r as r, l, c")
                .Return((c, r, l) => new {
                    Company = c.As<Company>(),
                    ReviewsCount = r.CountDistinct(),
                    AvgReview = Return.As<double>("avg(r.Value)"),
                    ListingsCount = l.CountDistinct()
                })
                .Limit(10);

            if (string.IsNullOrEmpty(filter))
            {
                var resultDefault = await _cache.QueryCache(query, "companies:default", expiry: TimeSpan.FromMinutes(30));

                if (resultDefault == null)
                {
                    return NotFound();
                }

                return Ok(resultDefault.Select((r) => new
                {
                    r.Company.Address,
                    r.Company.Email,
                    r.Company.Id,
                    r.Company.LogoUrl,
                    r.Company.Name,
                    r.Company.VAT,
                    r.Company.Description,
                    r.ReviewsCount,
                    r.AvgReview,
                    r.ListingsCount
                }));
            }

            var result = await query.ResultsAsync;

            var retval = result.Select((r) => new
            {
                r.Company.Address,
                r.Company.Email,
                r.Company.Id,
                r.Company.LogoUrl,
                r.Company.Name,
                r.Company.VAT,
                r.Company.Description,
                r.ReviewsCount,
                r.AvgReview,
                r.ListingsCount
            });

            return Ok(retval);
        }

        //[HttpGet("getUserCompanies/{id}")]
        //public async Task<ActionResult> GetUserCompanies(int id)
        //{
        //    var query = _neo4j.Cypher
        //        .Match("(u:User)-[:HAS_COMPANY]-(c:Company)")
        //        .Where((User u) => u.Id == id)
        //        .Return((c) => new
        //        {
        //            Companies=c.CollectAs<Company>()
        //        });

        //    var result = (await query.ResultsAsync).FirstOrDefault();

        //    return Ok(result);
        //}

        [HttpGet("companiescount")]
        public async Task<ActionResult> CompaniesCount()
        {
            var query = _neo4j.Cypher
                .Match("(c:Company)")
                .Return(c => c.Count());

            var result = await _cache.QueryCache(query, "companies:count", expiry: TimeSpan.FromMinutes(15));

            return Ok(result?.Single() ?? 0);
        }
    }
}
