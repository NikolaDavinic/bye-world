using ByeWorld_backend.DTO;
using ByeWorld_backend.Models;
using ByeWorld_backend.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Neo4jClient;
using StackExchange.Redis;
using System.Linq;
using System.Net.Mail;
using System.Net;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;


namespace ByeWorld_backend.Controllers
{
    [ApiController]
    [Route("user")]
    public class UserController : ControllerBase
    {
        private readonly IConnectionMultiplexer _redis;
        private readonly IBoltGraphClient _neo4j;
        private readonly IIdentifierService _ids;
        public UserController(IConnectionMultiplexer redis, IBoltGraphClient neo4j, IIdentifierService ids)
        {
            _redis = redis;
            _neo4j = neo4j;
            _ids = ids;
        }

        [HttpPost("signup")]
        public async Task<ActionResult> SignUp([FromBody] UserRegisterDTO u)
        {
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(u.Password);
            var nameStrings = u.Name.Split(" ");
            string generatedImage = $"https://ui-avatars.com/api/?background=311b92&color=fff&name={nameStrings.First()}+{nameStrings.Last()}&rounded=true";
            var newUser = new User
            {
                Id = await _ids.UserNext(),
                Name = u.Name,
                Email = u.Email,
                PasswordHash = hashedPassword,
                Phone = u.Phone,
                Role = u.Role,
                ImageUrl = generatedImage
            };

            var testEmail = await _neo4j.Cypher
                .Match("(us:User)")
                .Where((User us) => us.Email == u.Email)
                .Return(us => us.As<User>()).ResultsAsync;

            if (testEmail.Any())
            {
                return BadRequest("This email address is already in use, please enter new email!");
            }

            //await _neo4j.Cypher.Create("(u:User $user)")
            //                   .WithParam("user", newUser)
            //                   .ExecuteWithoutResultsAsync();
            //TODO: Email verification using redis

            //var tokenGenerated = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            //string strToken = Convert.ToBase64String(Guid.NewGuid().ToByteArray());
            byte[] tokenBytes = Guid.NewGuid().ToByteArray();
            //byte[] tokenGeneratedBytes = Encoding.UTF8.GetBytes(tokenBytes);
            var codeEncoded = WebEncoders.Base64UrlEncode(tokenBytes);
            var confirmationLink = Url.Action("VerifyUserEmail", "user", new { codeEncoded, email = u.Email }, Request.Scheme);

            String poruka;
            poruka = $"Welcome {u.Name},\n\nPlease confirm your account registered on Bye World with this email adress on link down below.\n" +
                confirmationLink + "\n\nWelcome to Bye World!";
            SmtpClient Client = new SmtpClient()
            {
                Host = "smtp.outlook.com",
                Port = 587,
                EnableSsl = true,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential()
                {
                    UserName = "***REMOVED***",
                    Password = "***REMOVED***"
                }
            };
            MailAddress fromMail = new MailAddress("***REMOVED***", "ByeWorld");
            MailAddress toMail = new MailAddress(u.Email, u.Name);
            MailMessage message = new MailMessage()
            {
                From = fromMail,
                Subject = "Confirm your Bye World account",
                Body = poruka
            };

            message.To.Add(toMail);
            await Client.SendMailAsync(message);
            //Storing email:key in redis for later verification
            var db = _redis.GetDatabase();
            await db.StringSetAsync(u.Email, codeEncoded, expiry: TimeSpan.FromMinutes(30));
            await _neo4j.Cypher.Create("(u:User $user)")
                   .WithParam("user", newUser)
                   .ExecuteWithoutResultsAsync();

            return Ok("User added succesful!");
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("VerifyUserEmail")]
        public async Task<ActionResult> VerifyUserEmail([FromQuery] String codeEncoded, [FromQuery] String email)
        {
            if (String.IsNullOrEmpty(codeEncoded))
                return BadRequest("Invalid verification code");

            var result = await _neo4j.Cypher
                .Match("(u:User)")
                .Where((User u) => u.Email == email)
                .Return(u => u.As<User>())
                .ResultsAsync;

            var user = result.FirstOrDefault();
            if (user == null)
                return BadRequest("No user account with given adress");

            if (user.EmailConfirmed)
                return BadRequest("Account already confirmed");

            var codeDecodedBytes = WebEncoders.Base64UrlDecode(codeEncoded);
            var codeDecoded = Encoding.UTF8.GetString(codeDecodedBytes);

            var db = _redis.GetDatabase();
            String? confirmationCode = db.StringGet(email);
            if (confirmationCode == null)
                return BadRequest("Error verifying user account, try again later!");

            if (confirmationCode == codeEncoded)
            {
                await _neo4j.Cypher
                    .Match("(u:User)")
                    .Where((User u) => u.Email == email)
                    .Set("u.EmailConfirmed = true")
                    .Return(u => u.As<User>())
                    .ExecuteWithoutResultsAsync();
                return Ok("Account confirmed");
                //return Redirect("https://localhost:3000/");
            }

            return BadRequest("Error verifying user account, try again later!");
        }
        [HttpPost("signin")]
        public async Task<ActionResult> SignIn([FromBody] UserLoginDTO creds)
        {
            var result = await _neo4j.Cypher
                .Match("(u:User)")
                .Where((User u) => u.Email == creds.Email)
                .Return(u => u.As<User>())
                .ResultsAsync;

            var user = result.FirstOrDefault();

            if (user == null ||
                BCrypt.Net.BCrypt.Verify(creds.Password, user.PasswordHash) == false)
            {
                return NotFound("User with given email or password does not exist");
            }

            var db = _redis.GetDatabase();

            string sessionId = new PasswordGenerator.Password(
                includeLowercase: true,
                includeUppercase: true,
                passwordLength: 50,
                includeSpecial: false,
                includeNumeric: false).Next();

            db.StringSet($"sessions:{sessionId}", JsonSerializer.Serialize(user), expiry: TimeSpan.FromHours(2));
            db.SetAdd("users:authenticated", user.Id);
            db.StringSet($"users:last_active:{user.Id}", DateTime.Now.ToUniversalTime().AddHours(1).ToString(), expiry: TimeSpan.FromHours(2));

            return Ok(new
            {
                Session = new
                {
                    Id = sessionId,
                    Expires = DateTime.Now.ToLocalTime() + TimeSpan.FromHours(2)
                },
                User = user
            });
        }

        [Authorize]
        [HttpPut("signout")]
        public async Task<ActionResult> UserSignOut()
        {
            var claims = HttpContext.User.Claims;
            var sessionId = claims.Where(c => c.Type == "SessionId").FirstOrDefault()?.Value;
            var userId = claims.FirstOrDefault(c => c.Type.Equals("Id"))?.Value;

            var db = _redis.GetDatabase();

            await db.KeyDeleteAsync(sessionId);
            await db.KeyDeleteAsync($"users:last_active:{userId}");
            await db.SetRemoveAsync("users:authenticated", userId);

            return Ok("Signed out successfully");
        }

        [HttpGet("authcount")]
        public async Task<ActionResult> AuthenticatedUsersCount()
        {
            var db = _redis.GetDatabase();

            var count = 0;

            var authenticatedUsers = (await db.SetMembersAsync("users:authenticated")).ToList();
            foreach (var userId in authenticatedUsers)
            {
                var timeActive = (await db.StringGetAsync($"users:last_active:{userId}")).ToString();

                if (timeActive == null)
                {
                    await db.SetRemoveAsync("users:authenticated", userId);
                    continue;
                }

                var timeActiveDt = DateTime.ParseExact(timeActive, "ddMMyyyyHHmmss", null);
                if (DateTime.Now - timeActiveDt <= TimeSpan.FromMinutes(5))
                {
                    count++;
                }
            }

            return Ok(count);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(long id)
        {
            var userId = long.Parse(HttpContext.User.Claims.FirstOrDefault(c => c.Type.Equals("Id"))?.Value ?? "-1");

            var baseQuery = _neo4j.Cypher
                .Match("(u:User)")
                .Where((User u) => u.Id == id)
                .OptionalMatch("(c:Company)<-[:HAS_COMPANY]-(u)")
                .OptionalMatch("(r:Review)-[]-(u)");

            //if (userId != id)
            //{
            //    var qresult = await baseQuery
            //        .Return((u, c, r) => new
            //        {
            //            u.As<User>().Id,
            //            u.As<User>().Role,
            //            u.As<User>().Name,
            //            u.As<User>().Email,
            //            u.As<User>().ImageUrl,
            //            CompaniesCount = c.CountDistinct(),
            //            ReviewsCount = r.CountDistinct()
            //        })
            //        .Limit(1)
            //        .ResultsAsync;

            //    if (!qresult.Any())
            //    {
            //        return NotFound("404 User doesn't exist or error occured");
            //    }

            //    return Ok(qresult.First());
            //} else
            {
                var qresult = await baseQuery
                    .OptionalMatch("(u)-[:HAS_FAVORITE]-(l:Listing)")
                    .Return((u, c, l, r) => new
                    {
                        u.As<User>().Id,
                        u.As<User>().CV,
                        u.As<User>().Role,
                        u.As<User>().Name,
                        u.As<User>().Email,
                        u.As<User>().ImageUrl,
                        CompaniesCount = c.CountDistinct(),
                        FavListingsCount = l.CountDistinct(),
                        ReviewsCount = r.CountDistinct()
                    })
                    .Limit(1)
                    .ResultsAsync;

                if (!qresult.Any())
                {
                    return NotFound("404 User doesn't exist or error occured");
                }

                return Ok(qresult.First());
            }
        }


        [HttpGet("login/{id}")]
        public async Task<IActionResult> Login(int id)
        {
            var db = _redis.GetDatabase();

            db.StringSet("sessions:8283848238423884238", JsonSerializer.Serialize(new User
            {
                Id = 5,
                Email = "bann",
                Name = "Stefan",
                Role = "User"
            }));
            // PQOWPQPWPQWP
            var userEmail = HttpContext.User.FindFirstValue(ClaimTypes.Email);

            var tokenSource = new CancellationTokenSource();
            var cancellationToken = tokenSource.Token;

            Task<RedisValue> redisTask = db.StringGetAsync($"user:{id}");

            Task<IEnumerable<User>> neo4jTask = _neo4j.Cypher
                .Match(@"(n:User)")
                .Where("n.Id = $id")
                .WithParam("id", id)
                .Return((n) => n.As<User>())
                .Limit(1)
                .ResultsAsync;

            if ((await Task.WhenAny(redisTask, neo4jTask)) == redisTask)
            {
                var redisValue = (await redisTask).ToString();
                if (!String.IsNullOrEmpty(redisValue))
                {
                    tokenSource.Cancel();
                    //Console.WriteLine("redis");
                    return Ok(JsonSerializer.Deserialize<User>(redisValue));
                }
            }

            var value = (await neo4jTask).First();

            if (value != null)
            {
                _ = db.StringSetAsync($"user:{value.Id}", JsonSerializer.Serialize<User?>(value));
            }

            //Console.WriteLine("neo4j");
            return Ok(value);
        }
    }
}
