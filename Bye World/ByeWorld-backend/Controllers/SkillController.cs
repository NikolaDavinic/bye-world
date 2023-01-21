using ByeWorld_backend.DTO;
using ByeWorld_backend.Models;
using ByeWorld_backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Neo4jClient;
using StackExchange.Redis;
using System.Linq;

namespace ByeWorld_backend.Controllers
{
    [ApiController()]
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
        [HttpGet("myskills")]
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

        //[Authorize] TODO:Ukljuci autorizaciju
        [HttpPut("edit")]
        public async Task<ActionResult> EditUserSkills([FromBody] List<SkillDTO> skills)
        {
            var claims = HttpContext.User.Claims;

            var userId = Int32.Parse(claims.Where(c => c.Type == "Id").FirstOrDefault()?.Value ?? "0");

            String skillsName = string.Empty;

            skills.ForEach(req => skillsName += "'" + req.Name + "', ");
            skillsName = skillsName.Substring(0, skillsName.Length - 2);
            var skillsInDatabase = await _neo4j.Cypher
                    .Match("(s:Skill)")
                    .Where($"s.Name IN [{skillsName}]")
                    .Return(s => s.As<Skill>())
                    .ResultsAsync;

            //removing users existing skills
            await _neo4j.Cypher
                .Match("(u:User)-[h:HAS_SKILL]-(s:Skill)")
                .Where((User u) => u.Id == userId)
                .DetachDelete("h")
                .ExecuteWithoutResultsAsync();

            //Ukoliko ima skill-ova koje trazimo a ne postoje bazi, dodajemo ih
            //TODO:id za novi skill?? problem sa kasnijom pretragom, isto i u ListingController
            var addQuery = _neo4j.Cypher
                        .Match("(u:User)")
                        .Where((User u) => u.Id == userId);

            foreach (var skill in skills)
            {
                //Skill ne postoji u bazi
                if (!skillsInDatabase.Any(s=>s.Name==skill.Name))
                {
                    long skillId = await _ids.SkillNext();
                addQuery = addQuery
                        .Create($"(s{skill.Name}:Skill $newSkill{skill.Name})")
                        .WithParam($"newSkill{skill.Name}", new Skill { Id = skillId, Name = skill.Name })
                        .Create($"(u)-[h{skill.Name}:HAS_SKILL {{Proficiency: $prof{skill.Name}}}]->(s{skill.Name})")
                        .WithParam($"prof{skill.Name}", skill.Proficiency);
                }
                else
                //Skill postoji u bazi
                {
                    addQuery = addQuery.With("u as u")
                            .Match($"(c{skill.Name}: Skill)")
                            .Where($"c{skill.Name}.Name='{skill.Name}'")
                            .Create($"(u)-[h{skill.Name}:HAS_SKILL {{Proficiency: $prof{skill.Name}}}]->(c{skill.Name})")
                            .WithParam($"prof{skill.Name}", skill.Proficiency);
                }
            }
            await addQuery.ExecuteWithoutResultsAsync();
            return Ok();
        }
        [HttpGet("topskills")]
        public async Task<ActionResult> GetTopSkills()
        {
            var db = _redis.GetDatabase();

            var skills =
                (await db.SortedSetRangeByRankAsync($"skills:leaderboard:{DateTime.Now.ToString("ddMMyyyy")}", start: 0, stop: 5, Order.Descending))
                .Select(name=>name.ToString())
                .ToList();

            return Ok(skills);
        }

    }
}
