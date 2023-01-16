using ByeWorld_backend.DTO;
using ByeWorld_backend.Models;
using ByeWorld_backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Neo4jClient;
using StackExchange.Redis;

namespace ByeWorld_backend.Controllers
{
    [ApiController]
    [Route("skill")]
    public class SkillController : ControllerBase
    {
        private readonly IConnectionMultiplexer _redis;
        private readonly IBoltGraphClient _neo4j;
        private readonly IIdentifierService _ids;
        public SkillController(IConnectionMultiplexer redis, IBoltGraphClient neo4j, IIdentifierService ids)
        {
            _redis = redis;
            _neo4j = neo4j;
            _ids = ids;
        }
        //[Authorize] TODO:Ukljuci autorizaciju
        [HttpGet("/myskills")]
        public async Task<ActionResult> GetUserSkills()
        {
            var claims = HttpContext.User.Claims;

            var userId = Int32.Parse(claims.Where(c => c.Type == "Id").FirstOrDefault()?.Value ?? "0");

            var query = _neo4j.Cypher.Match("(s:Skill)-[h:HAS_SKILL]-(u:User)")
                                             .Where((Skill s, User u, HasSkill h) => u.Id == userId)
                                             .Return((s, u, h) => new
                                             {
                                                 HasSkill = h.As<HasSkill>(),
                                                 Skill = s.As<Skill>()
                                             });

            var result = (await query.ResultsAsync).Select(r => new SkillDTO
            {
                Name=r.Skill.Name,
                Proficiency=r.HasSkill.Proficiency
            });

            return Ok(result);
        }

        //Prosledjujemo samo izmenjene i nove skillove korisnika
        //[Authorize] TODO:Ukljuci autorizaciju
        //TODO: Dodaj izmenu postojecih senioriteta skillova i promeni na PUT
        [HttpPost("add")]
        public async Task<ActionResult> AddUserSkills([FromBody] List<SkillDTO> skills)
        {
            var claims = HttpContext.User.Claims;

            var userId = Int32.Parse(claims.Where(c => c.Type == "Id").FirstOrDefault()?.Value ?? "0");
            //TODO: testing with hardcoded userId
            userId = 9;

            String skillsName = string.Empty;

            skills.ForEach(req => skillsName += "'" + req.Name + "', ");
            skillsName = skillsName.Substring(0, skillsName.Length - 2);
            var skillNodes = await _neo4j.Cypher
                    .Match("(s:Skill)")
                    .Where($"s.Name IN [{skillsName}]")
                    .Return(s => s.As<Skill>())
                    .ResultsAsync;

            //Ukoliko postoje skill-ovi koje trazimo a ne postoje bazi, dodajemo ih
            //TODO:id za novi skill?? problem sa kasnijom pretragom, isto i u ListingController
            if (skillNodes.Count() != skills.Count())
            {
                foreach (var skill in skills)
                {
                    if (!skillNodes.Any(skillNode => skillNode.Name == skill.Name))
                    {
                        //long skillId = await _ids.SkillNext();
                        skillNodes = skillNodes.Concat(await _neo4j.Cypher
                            .Create("(s:Skill $newSkill)")
                            .WithParam("newSkill", new Skill { Id = 0, Name = skill.Name })
                            .Return(s => s.As<Skill>())
                            .ResultsAsync);
                    }
                }
            }


            //var query = _neo4j.Cypher
            //   .Match("(c:Company)")
            //   .Where((Company c) => c.Id == listing.CompanyId)
            //   .Match("(ci:City)")
            //   .Where((City ci) => ci.Name == listing.CityName)
            //   .Create("(l:Listing $newListing)<-[:HAS_LISTING]-(c)")
            //   .Create("(l)-[:LOCATED_IN]->(ci)")
            //   .WithParam("newListing", newListing);

            var query = _neo4j.Cypher
                .Match("(u:User)")
                .Where((User u) => u.Id == userId);

            //TODO: Sredi ID samo
            for (int i = 0; i < skills.Count; i++)
            {
                //long skillID = await _ids.SkillNext();
                query = query.Create($"(u)-[h{i}:HAS_SKILL {{Proficiency: $prof{i}}}]->(c{i}: Skill $newSkill{i})")
                        .WithParam($"prof{i}", skills[i].Proficiency)
                        //TODO: Zameni withParam sa Where da bi koristio validan ID
                        .WithParam($"newSkill{i}", new Skill { Name = skills[i].Name, Id = 0 });
            }
            await query.ExecuteWithoutResultsAsync();
            //var retVal = await query.Return((s, h) => new SkillDTO
            //{
            //    Name = s.As<Skill>().Name,
            //    Proficiency = h.As<HasSkill>().Proficiency,
            //}).ResultsAsync;
            //if (retVal.Count() == 0)
            //return BadRequest("Dodavanje listinga neuspesno");

            return Ok();
        }

    }
}
