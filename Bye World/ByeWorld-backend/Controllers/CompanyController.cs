using ByeWorld_backend.DTO;
using ByeWorld_backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Neo4jClient;
using StackExchange.Redis;
using System.Security.Claims;

namespace ByeWorld_backend.Controllers
{
    [Route("company")]
    [ApiController]
    public class CompanyController : ControllerBase
    {
        private readonly IConnectionMultiplexer _redis;
        private readonly IBoltGraphClient _neo4j;
        public CompanyController(IConnectionMultiplexer redis, IBoltGraphClient neo4j)
        {
            _redis = redis;
            _neo4j = neo4j;
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult> AddCompany([FromBody] AddCompanyDTO company)
        {
            var claims = HttpContext.User.Claims;

            var userId = Int32.Parse(claims.Where(c => c.Type == "Id").FirstOrDefault()?.Value ?? "0");
            var role = claims.Where(c => c.Type == ClaimTypes.Role).FirstOrDefault()?.Value;

            var newCompany = await _neo4j.Cypher
                .Match("(u:User)")
                .Where((User u) => u.Id == userId)
                .Create("(u)-[:HAS]->(c:Company $newcompany)")
                .WithParam("newcompany", new Company
                {
                    //Id = 1,
                    Address = company.Address,
                    Description = company.Description,
                    Email = company.Email,
                    Name = company.Name
                })
                .Return(c => c.As<Company>())
                .ResultsAsync;

            return Ok(newCompany.First());

        }

        [HttpPost("addcompanytest")]
        public async Task<ActionResult> AddCompnyTest([FromBody]Company company)
        {
            await _neo4j.Cypher.Create("(c:Company $company)")
                               .WithParam("company", company)
                               //{
                               //    Address = company.Address,
                               //    Description = company.Description,
                               //    Id = 1,
                               //    Email = company.Email,
                               //    Name = company.Name,
                               //    LogoUrl = company.LogoUrl,
                               //    Phone = company.Phone,
                               //})
                               .ExecuteWithoutResultsAsync();
            return Ok("Company is added!");
        }

        [HttpGet("getallcompanies")]
        public async Task<ActionResult> GetAllCompanies()
        {
            var countries = await _neo4j.Cypher.Match("(c:Company)")
                                               .Return(c => c.As<Company>()).ResultsAsync;
            return Ok(countries);
        }

        [HttpGet("filter")]
        public async Task<ActionResult> FilterCompnay([FromQuery] string filter)
        {
            if(string.IsNullOrEmpty(filter))
            {
                var companies2 = await _neo4j.Cypher.Match("(c:Company)")
                                                   .Return(c => c.As<Company>()).ResultsAsync;
                return Ok(companies2);
            }

            var companies = await _neo4j.Cypher.Match("(c:Company)")
                                                .Where((Company c) => c.Name.Contains(filter) || c.Address.Contains(filter))
                                                .Return(c => c.As<Company>()).ResultsAsync;

            return Ok(companies);
        }
    }
}
