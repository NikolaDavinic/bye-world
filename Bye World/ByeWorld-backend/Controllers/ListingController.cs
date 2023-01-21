using ByeWorld_backend.DTO;
using ByeWorld_backend.Models;
using ByeWorld_backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ViewEngines;
using Neo4jClient;
using Neo4jClient.Cypher;
using Neo4jClient.Extensions;
using Newtonsoft.Json;
using StackExchange.Redis;
using System.Collections;
using System.Runtime.InteropServices;
//using System.Text.Json;

namespace ByeWorld_backend.Controllers
{
    [ApiController]
    [Route("listing")]
    public class ListingController : ControllerBase
    {
        private readonly IConnectionMultiplexer _redis;
        private readonly IBoltGraphClient _neo4j;
        private readonly IIdentifierService _ids;
        private readonly ICachingService _cache;
        private readonly ILogger<ListingController> _logger;
        public ListingController(
            IConnectionMultiplexer redis, 
            IBoltGraphClient neo4j, 
            IIdentifierService ids,
            ICachingService cache,
            ILogger<ListingController> logger)
        {
            _redis = redis;
            _neo4j = neo4j;
            _ids = ids;
            _cache = cache;
            _logger = logger;
        }


        [HttpGet("filter")]
        public async Task<ActionResult> GetAllListings([FromQuery] string? keyword, [FromQuery]string? city, 
                [FromQuery]string? position, [FromQuery] string? seniority, [FromQuery] int? take, [FromQuery] bool sortNewest = true, [FromQuery] bool includeExpired = false)
        {
            var userId = long.Parse(HttpContext.User.Claims.FirstOrDefault(c => c.Type.Equals("Id"))?.Value ?? "-1");

            var query = _neo4j.Cypher
                .OptionalMatch("(s:Skill)-[reqs:REQUIRES]-(l:Listing)-[r]-(c:City)")
                .OptionalMatch("(l)-[:HAS_LISTING]-(co:Company)")
                .Where((Listing l) => true);
            if (!includeExpired)
            {
                query = query.AndWhere((Listing l) => l.ClosingDate < DateTime.Now);
            }
            if (!String.IsNullOrEmpty(keyword))
            {
                query=query.AndWhere((Listing l) => l.Title.Contains(keyword));
            }
            if (!String.IsNullOrEmpty(city))
            {
                query=query.AndWhere((Listing l,City c) => c.Name.Contains(city));
            }
            //TODO: CONTAINS ili = kod pretragu, kad trazis za java da li da vrati i javascript??????
            if (!String.IsNullOrEmpty(position))
             {
                query = query.AndWhere($"toLower(s.Name) CONTAINS toLower('{position}')");
            }
            if (!String.IsNullOrEmpty(seniority))
                query = query.AndWhere($"toLower(reqs.Proficiency) CONTAINS toLower('{seniority}')");

            query = query
                .OptionalMatch("(u:User)-[hf:HAS_FAVORITE]-(l)")
                .Where((User u) => u.Id == userId);

            //TODO: Napravi DTO?
            var retVal = query.Return((l, c, s, co, hf) => new
            {
                Id = l.As<Listing>().Id,
                Title = l.As<Listing>().Title,
                Description = l.As<Listing>().Description,
                CityName = c.As<City>().Name,
                ClosingDate = l.As<Listing>().ClosingDate,
                PostingDate = l.As<Listing>().PostingDate,
                Requirements = s.CollectAs<Skill>(),
                CompanyName = co.As<Company>().Name,
                CompanyLogoUrl = co.As<Company>().LogoUrl,
                CompanyId= co.As<Company>().Id,
                IsFavorite = Return.As<bool>("CASE hf WHEN hf THEN TRUE ELSE FALSE END")
            });
            if (sortNewest)
            {
                retVal = retVal.OrderBy("l.PostingDate DESC");
            }
            else
                retVal = retVal.OrderBy("l.ClosingDate ASC");

            var result = await retVal.Limit(take).ResultsAsync;

            return Ok(result);
        }

        [Authorize]
        [HttpGet("related")]
        public async Task<ActionResult> GetRelatedListingsForUser()
        {
            var uid = long.Parse(HttpContext.User.Claims.FirstOrDefault(c => c.Type.Equals("Id"))?.Value ?? "-1");

            var query = _neo4j.Cypher
                .Match("(u:User)")
                .Where((User u) => u.Id==uid)
                .OptionalMatch("(u)-[:HAS_FAVORITE]-(fav:Listing)")
                .OptionalMatch("(fav)--(:Company)--(lfc:Listing)")
                .OptionalMatch("(fav)--(:Skill)--(lfs:Listing)")
                .OptionalMatch("(u)--(:Skill)--(lus:Listing)")
                .With("collect(lfc)+collect(lfs)+collect(lus) as nodes")
                .Unwind("nodes", "lr")
                .With("distinct lr as rc")
                .OptionalMatch("(rc)-[]-(s:Skill)")
                .OptionalMatch("(rc)-[]-(c:City)")
                .OptionalMatch("(rc)-[]-(co:Company)");

            var result = query.Return((rc, c, s, co) => new
            {
                rc.As<Listing>().Id,
                rc.As<Listing>().Title,
                rc.As<Listing>().Description,
                rc.As<Listing>().PostingDate,
                rc.As<Listing>().ClosingDate,
                c.As<City>().Name,
                Requirements = s.CollectAs<Skill>(),
                CompanyName = co.As<Company>().Name,
                CompanyLogoUrl = co.As<Company>().LogoUrl,
                CompanyId = co.As<Company>().Id,
            }).OrderBy("rand()").Limit(3);

            _logger.LogInformation(result.Query.DebugQueryText);

            return Ok(await result.ResultsAsync);
        }

        [HttpGet("favorites/{userId}")]
        public async Task<ActionResult> GetFavoriteListingsForUser(int userId)
        {
            var uid = long.Parse(HttpContext.User.Claims.FirstOrDefault(c => c.Type.Equals("Id"))?.Value ?? "-1");

            var query = _neo4j.Cypher
                .Match("(u:User)-[:HAS_FAVORITE]->(l:Listing)")
                .Where((User u) => u.Id == userId)
                .OptionalMatch("(l)-[]-(s:Skill)")
                .OptionalMatch("(l)-[]-(c:City)")
                .OptionalMatch("(l)-[]-(co:Company)");

            if (uid == -1)
            {
                var qr = query.Return((l, c, s, co) => new
                {
                    l.As<Listing>().Id,
                    l.As<Listing>().Title,
                    l.As<Listing>().Description,
                    CityName = c.As<City>().Name,
                    l.As<Listing>().ClosingDate,
                    l.As<Listing>().PostingDate,
                    Requirements = s.CollectAs<Skill>(),
                    CompanyName = co.As<Company>().Name,
                    CompanyLogoUrl = co.As<Company>().LogoUrl,
                    CompanyId = co.As<Company>().Id
                });

                var resultNoUser = await _cache.QueryCache(qr, $"user:favorites:{userId}", expiry: TimeSpan.FromMinutes(15));

                if (resultNoUser == null)
                {
                    return Ok(new ArrayList());
                }

                return Ok(resultNoUser);
            }

            query = query
                .OptionalMatch("(u:User)-[hf:HAS_FAVORITE]-(l)")
                .Where((User u) => u.Id == uid);

            var result = await query.Return((l, c, s, co, hf) => new
            {
                l.As<Listing>().Id,
                l.As<Listing>().Title,
                l.As<Listing>().Description,
                c.As<City>().Name,
                l.As<Listing>().ClosingDate,
                l.As<Listing>().PostingDate,
                Requirements = s.CollectAs<Skill>(),
                CompanyName = co.As<Company>().Name,
                CompanyLogoUrl = co.As<Company>().LogoUrl,
                CompanyId = co.As<Company>().Id,
                IsFavorite = Return.As<bool>("CASE hf WHEN hf THEN TRUE ELSE FALSE END")
            }).ResultsAsync;

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetListingById(int id)
        {
            var userId = long.Parse(HttpContext.User.Claims.FirstOrDefault(c => c.Type.Equals("Id"))?.Value ?? "-1");

            var db = _redis.GetDatabase();

            var query = _neo4j.Cypher.Match("(l:Listing)")
                   .Match("(l)-[lc:LOCATED_IN]->(c:City)")
                   .Match("(cm:Company)-[cl:HAS_LISTING]->(l)")
                   .Match("(l)-[:REQUIRES]->(s:Skill)")
                   .Where((Listing l, Company cm, City c, Skill s) => l.Id == id)
                   .OptionalMatch("(u)-[hf:HAS_FAVORITE]-(l)")
                   .Where((User u) => u.Id == userId)
                   .Return((l, cm, c, s) => new
                   {
                       Listing=l.As<Listing>(),
                       Company=cm.As<Company>(),
                       City=c.As<City>(),
                       Skill=s.CollectAs<Skill>(),
                       IsFavorite = Return.As<bool>("CASE hf WHEN hf THEN TRUE ELSE FALSE END")
                   });

            var result = (await query.ResultsAsync).Select(r => new
            {
                Company = new
                {
                    r.Company.Id,
                    r.Company.Name,
                    r.Company.LogoUrl,
                    r.Company.Email
                },
                City = new
                {
                    r.City.Id,
                    r.City.Name
                },
                r.Skill,
                r.Listing.Id,
                r.Listing.ClosingDate,
                r.Listing.Title,
                r.Listing.Description,
                r.Listing.PostingDate,
                r.IsFavorite
            }).FirstOrDefault();

            if (result != null)
            {
                db.SortedSetIncrement($"listings:leaderboard:{DateTime.Now.ToString("ddMMyyyy")}", result.Id, 1);
            }

            return Ok(result);
        }

        [HttpGet("toplistings")]
        public async Task<ActionResult> GetTopListings()
        {
            var db = _redis.GetDatabase();

            var ids = 
                (await db.SortedSetRangeByRankAsync($"listings:leaderboard:{DateTime.Now.ToString("ddMMyyyy")}", start: 0, stop: 5, Order.Descending))
                .Select(id => int.Parse(id.ToString()))
                .ToList();

            var query = _neo4j.Cypher
                .Match("(l:Listing)")
                .Where("l.Id IN $ids")
                .WithParam("ids", ids)
                .OptionalMatch("(l)-[]-(s:Skill)")
                .OptionalMatch("(l)-[]-(c:City)")
                .OptionalMatch("(l)-[]-(co:Company)")
                .Return((l, c, co, s) => new
                {
                    CityName = c.As<City>().Name,
                    l.As<Listing>().Id,
                    l.As<Listing>().Title,
                    l.As<Listing>().Description,
                    l.As<Listing>().ClosingDate,
                    l.As<Listing>().PostingDate,
                    co.As<Company>().LogoUrl,
                    Requirements = s.CollectAs<Skill>(),
                    CompanyName = co.As<Company>().Name,
                    CompanyId = co.As<Company>().Id,
                });

            return Ok(await query.ResultsAsync);
        }

        [HttpGet("company/{id}")]
        public async Task<ActionResult> GetCompanyListings(int id)
        {

            var userId = long.Parse(HttpContext.User.Claims.FirstOrDefault(c => c.Type.Equals("Id"))?.Value ?? "-1");

            var query = _neo4j.Cypher
                .Match("(s:Skill)-[reqs:REQUIRES]-(l:Listing)-[r]-(c:City)")
                .Match("(l)-[:HAS_LISTING]-(co:Company)")
                .Where((Company co) => co.Id == id);

            var result = query
                .OptionalMatch("(u)-[hf:HAS_FAVORITE]-(l)")
                .Where((User u) => u.Id == userId)
                .Return((l, c, s, co, hf) => new {
                    City = c.As<City>(),
                    l.As<Listing>().Id,
                    l.As<Listing>().Title,
                    l.As<Listing>().Description,
                    l.As<Listing>().ClosingDate,
                    l.As<Listing>().PostingDate,
                    Requirements = s.CollectAs<Skill>(),
                    Company = co.As<Company>(),
                    IsFavorite = Return.As<bool>("CASE hf WHEN hf THEN TRUE ELSE FALSE END")
                });

            return Ok(await result.ResultsAsync);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateListingById(int id, [FromBody]Listing listing)
        {
            await _neo4j.Cypher.Match("(l:Listing)")
                               .Where((Listing l) => l.Id == id)
                               .Set("l = $listing")
                               .WithParam("listing", listing)
                               .ExecuteWithoutResultsAsync();

            return Ok();
        }

        [Authorize]
        [HttpPut("favorite/{id}")]
        public async Task<ActionResult> ToggleFavorite(int id)
        {
            var userId = int.Parse(HttpContext.User.Claims.FirstOrDefault(c => c.Type.Equals("Id"))?.Value ?? "0");

            var iquery = _neo4j.Cypher
                .Match("(u:User)-[rel:HAS_FAVORITE]-(l:Listing)")
                .Where((User u, Listing l) => u.Id == userId && l.Id == id);

            var res = await iquery
                .Return(rel => new { count = rel.Count() })
                .ResultsAsync;

            if (res.First().count != 0)
            {
                await iquery
                    .Delete("rel")
                    .ExecuteWithoutResultsAsync();
            } else
            {
                await _neo4j.Cypher
                    .Match("(u:User)", "(l:Listing)")
                    .Where((User u, Listing l) => u.Id == userId && l.Id == id)
                    .Merge("(u)-[rel:HAS_FAVORITE]-(l)")
                    .ExecuteWithoutResultsAsync();
            }

            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteListingById(int id)
        {
            await _neo4j.Cypher.Match("(l:Listing)")
                               .Where((Listing l) => l.Id == id)
                               .Delete("l")
                               .ExecuteWithoutResultsAsync();
            return Ok();
        }

        [HttpPost("add")]
        public async Task<ActionResult> CreateListing([FromBody] AddListingDTO listing)
        {
            var db = _redis.GetDatabase();

            long lid = await _ids.ListingNext();
            var newListing = new Listing
            {
                Id=lid,
                ClosingDate=listing.ClosingDate,
                PostingDate=listing.PostingDate,
                Description=listing.Description,
                Title=listing.Title
            };
            var cityNode = await _neo4j.Cypher
                .Match("(c:City)")
                .Where((City c) => c.Name == listing.CityName)
                .Return(c => c.As<City>())
                .ResultsAsync;

            if(cityNode.Count()==0)
            {
                long cityId = await _ids.CityNext();
                cityNode = await _neo4j.Cypher
                    .Create("(c:City $newCity)")
                    .WithParam("newCity", new City { Id = cityId, Name = listing.CityName })
                    .Return(c => c.As<City>())
                    .ResultsAsync;
            }

            var companyNode = await _neo4j.Cypher
                .Match("(c:Company)")
                .Where((Company c) => c.Id == listing.CompanyId)
                .Return(c => c.As<Company>())
                .ResultsAsync;


            String skillsName = string.Empty;
            listing.Requirements.ForEach(req => skillsName +="'"+ req.Name + "', ");
            skillsName = skillsName.Substring(0,skillsName.Length - 2);
            var skillNodes = await _neo4j.Cypher
                    .Match("(s:Skill)")
                    .Where($"s.Name IN [{skillsName}]")
                    .Return(s => s.As<Skill>())
                    .ResultsAsync;

            if(skillNodes.Count()!=listing.Requirements.Count())
            {
                foreach (var req in listing.Requirements)
                {
                    if (!skillNodes.Any(skillNode=>skillNode.Name==req.Name))
                    {
                        long skillId = await _ids.SkillNext();
                        skillNodes = skillNodes.Concat(await _neo4j.Cypher
                            .Create("(s:Skill $newSkill)")
                            .WithParam("newSkill", new Skill { Id = skillId, Name = req.Name })
                            .Return(s => s.As<Skill>())
                            .ResultsAsync);
                    }
                }
            }


            var query = _neo4j.Cypher
               .Match("(c:Company)")
               .Where((Company c) => c.Id == listing.CompanyId)
               .Match("(ci:City)")
               .Where((City ci) => ci.Name == listing.CityName)
               .Create("(l:Listing $newListing)<-[:HAS_LISTING]-(c)")
               .Create("(l)-[:LOCATED_IN]->(ci)")
               .WithParam("newListing", newListing);

            for (int i = 0; i < listing.Requirements.Count; i++)
            {
                //long skillID = await _ids.SkillNext();
                //query = query.Create($"(l)-[:REQUIRES {{Proficiency: $prof{i}}}]->(c{i}: Skill $newSkill{i})")
                //        .WithParam($"prof{i}", listing.Requirements[i].Proficiency)
                //        .WithParam($"newSkill{i}", new Skill { Name = listing.Requirements[i].Name, Id = 0/*Id = skillID*/ });
                query = query
                            .With($"l as l,ci as ci, c as c")
                            .Match($"(c{i}: Skill)")
                            .Where($"c{i}.Name='{listing.Requirements[i].Name}'")
                            .Create($"(l)-[:REQUIRES {{Proficiency: $prof{i}}}]->(c{i})")
                            .WithParam($"prof{i}", listing.Requirements[i].Proficiency);
            }
            var retVal=await query.Return((c, ci, l) => new
             {
                Id = l.As<Listing>().Id,
                Title = l.As<Listing>().Title,
                Description = l.As<Listing>().Description,
                CityName = ci.As<City>().Name,
                ClosingDate = l.As<Listing>().ClosingDate,
                PostingDate = l.As<Listing>().PostingDate,
                //Requirements = s.CollectAs<Skill>(),
                CompanyName = c.As<Company>().Name,
                CompanyLogoUrl = c.As<Company>().LogoUrl,
                CompanyId = c.As<Company>().Id,
            }).ResultsAsync;

            if (retVal.Count() == 0)
                return BadRequest("Dodavanje listinga neuspesno");

            var res = retVal.FirstOrDefault();

            var toredis = await _neo4j.Cypher
                .Match("(l:Listing)")
                .Where((Listing l) => l.Id == res.Id)
                .OptionalMatch("(l)-[]-(s:Skill)")
                .OptionalMatch("(l)-[]-(c:City)")
                .OptionalMatch("(l)-[]-(co:Company)")
                .Return((l, c, co, s) => new 
                {
                    l.As<Listing>().Id,
                    l.As<Listing>().Title,
                    l.As<Listing>().Description,
                    l.As<Listing>().ClosingDate,
                    l.As<Listing>().PostingDate,
                    CityName = c.As<City>().Name,
                    CompanyId = co.As<Company>().Id,
                    CompanyName = co.As<Company>().Name,
                    Requirements = s.CollectAs<Skill>(),
                    CompanyLogoUrl = co.As<Company>().LogoUrl,
                }).ResultsAsync;

            var newListings = db.ListRange("listing:newest");

            if(newListings.Count() > 3)
            {
                await db.ListRightPopAsync("listing:newest");
            }

            await db.ListLeftPushAsync("listing:newest", JsonConvert.SerializeObject(toredis.Single()));

            DateTime firstDayOfMonth = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1);

            foreach (var req in listing.Requirements)
            {
                await db.SortedSetIncrementAsync($"skills:leaderboard:{firstDayOfMonth.ToString("ddMMyyyy")}", req.Name, 1);
            }

            return Ok(retVal);
        }

        [HttpGet("similarlistings/{id}")]
        public async Task<ActionResult> getfirstthreesimilarlistings(int id)
        {
            var query = _neo4j.Cypher
                .Match("(l:Listing)-[*2]-(lr:Listing)")
                .Where("l.Id = $id AND NOT (l)-[:HAS_FAVORITE]-(lr)")
                .WithParam("id",id)
                .With("DISTINCT lr AS lr")
                .OptionalMatch("(lr)-[:LOCATED_IN]-(c:City)")
                .OptionalMatch("(lr)-[:HAS_LISTING]-(ic:Company)")
                .OptionalMatch("(lr)-[:REQUIRES]-(s:Skill)")
                .Return((lr, ic, c, s) => new 
                {
                    Id = lr.As<Listing>().Id,
                    Title = lr.As<Listing>().Title,
                    Description = lr.As<Listing>().Description,
                    CityName = c.As<City>().Name,
                    ClosingDate = lr.As<Listing>().ClosingDate,
                    PostingDate = lr.As<Listing>().PostingDate,
                    Requirements = s.CollectAs<Skill>(),
                    CompanyName = ic.As<Company>().Name,
                    CompanyLogoUrl = ic.As<Company>().LogoUrl,
                    CompanyId = ic.As<Company>().Id,
                })
                .Limit(3);
                
            //var result = (await query.ResultsAsync).Select(r => new
            //{
            //    Company = new
            //    {
            //        Id = r.Company.Id,
            //        Name = r.Company.Name,
            //        LogoUrl = r.Company.LogoUrl
            //    },
            //    City = new
            //    {
            //        Id = r.City.Id,
            //        Name = r.City.Name
            //    },
            //    r.Skill,
            //    r.Listing.Id,
            //    r.Listing.ClosingDate,
            //    r.Listing.Title,
            //    r.Listing.Description,
            //    r.Listing.PostingDate
            //});


            return Ok(await query.ResultsAsync);
        }

        [HttpGet("newestlistings")]
        public async Task<ActionResult> GetNewestListings()
        {
            var db = _redis.GetDatabase();

            var newestListings = db.ListRange("listing:newest", 0, 2).ToStringArray();

            var des = new ArrayList();
            foreach (var listing in newestListings)
            {
                if (!string.IsNullOrEmpty(listing))
                {
                    des.Add(JsonConvert.DeserializeObject<ListingDTO>(listing));
                }
            }

            return Ok(des);
        }

        [HttpGet("listingscount")]
        public async Task<ActionResult> ListingsCount()
        {
            var query = await _neo4j.Cypher
                .Match("(l:Listing)")
                .Return(l => l.Count())
                .ResultsAsync;

            return Ok(query.Single());
        }
    }
}
