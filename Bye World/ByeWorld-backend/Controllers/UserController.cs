using ByeWorld_backend.DTO;
using ByeWorld_backend.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.AspNetCore.Mvc;
using Neo4jClient;
using StackExchange.Redis;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text.Json;


namespace ByeWorld_backend.Controllers
{
    [ApiController]
    [Route("user")]
    public class UserController : ControllerBase
    {
        private readonly IConnectionMultiplexer _redis;
        private readonly IBoltGraphClient _neo4j;
        public UserController(IConnectionMultiplexer redis, IBoltGraphClient neo4j)
        {
            _redis = redis;
            _neo4j = neo4j;
        }

        //ureadjeno je da se ispita da li postoji korisnik sa ovim email-om, ako postoji onda se ne dodaje
        [HttpPost("signup")]
        //[Route("/signup")]
        public async Task<ActionResult> SignUp([FromBody] UserRegisterDTO u)
        {
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(u.Password);

            var newUser = new User { 
                Id = 1,
                Name=u.Name,
                Email = u.Email,
                PasswordHash = hashedPassword,
                Phone = u.Phone,
                Role = "User"
            };

            var testEmail = await _neo4j.Cypher.Match("(us:User)")
                                               .Where((User us) => us.Email == u.Email)
                                               .Return(us => us.As<User>()).ResultsAsync;
            if(testEmail.Any())
            {
                return BadRequest("This email address is already in use, please enter new email!");
            }

            await _neo4j.Cypher.Create("(u:User $user)")
                               .WithParam("user", newUser)
                               .ExecuteWithoutResultsAsync();

            return Ok("User added succesful!");
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

            await SignInUser(user);

            return Ok("");
        }

        [Authorize]
        [HttpGet("login/{id}")]
        public async Task<IActionResult> Login(int id)
        {
            var userEmail = HttpContext.User.FindFirstValue(ClaimTypes.Email);

            var tokenSource = new CancellationTokenSource();
            var cancellationToken = tokenSource.Token;

            var db = _redis.GetDatabase();

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

        protected async Task SignInUser(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Email, user.Email),
                new Claim("Id", user.Id.ToString()),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var claimsIdentity = new ClaimsIdentity(
              claims, CookieAuthenticationDefaults.AuthenticationScheme);
            
            await HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(claimsIdentity));
        }
    }
}

