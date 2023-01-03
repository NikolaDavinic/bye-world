﻿using ByeWorld_backend.DTO;
using ByeWorld_backend.Models;
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

        [HttpPost]
        public async Task<ActionResult> AddCompany([FromBody] AddCompanyDTO company)
        {
            //var claims = HttpContext.User.Claims;
            //var userId = claims.Where(c => c.Type == "Id").FirstOrDefault()?.Value;
            //var role = claims.Where(c => c.Type == ClaimTypes.Role).FirstOrDefault()?.Value;

            //if (role == null || role != "Company")
            //{
            //    return Unauthorized("User not authorized");
            //}

            //await _neo4j.Cypher.Create("(u:Company $company)")
            //                   .WithParam("company", new Company
            //                   {
            //                       Address = company.Address,
            //                       Description = company.Description,
            //                       Id = 1,
            //                       Email = company.Email,
            //                       Name = company.Name,
            //                       LogoUrl = company.LogoUrl,
            //                       Phone = company.Phone,
            //                   })
            //                   .Return(c => c.As<Company>())
            //                   .ResultsAsync;

            //await _neo4j.Cypher
            //    .Match("(c:User)")
            //    .Where((User u) => u.Id == userId)
            //    .Create("(c)-[:ADDED]->(:Company $company)")
            //    .WithParam("company", new Listing { ID = 2, Title = "Full Stack Developer" })
            //    .ExecuteWithoutResultsAsync();

            return Ok();
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
