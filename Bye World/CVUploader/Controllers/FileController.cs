using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StackExchange.Redis;
using System.Text.Json;

namespace CVUploader.Controllers
{
    [ApiController]
    [Route("file")]
    public class FileController : ControllerBase
    {
        private readonly ILogger<FileController> _logger;
        private readonly IConnectionMultiplexer _redis;
        public FileController(ILogger<FileController> logger, IConnectionMultiplexer redis)
        {
            _logger = logger;
            _redis = redis;
        }

        [Authorize]
        [HttpPost("upload")]
        public async Task<IActionResult> UploadCV(IFormFile cv)
        {
            try
            {
                var uid = long.Parse(HttpContext.User.Claims.FirstOrDefault(c => c.Type.Equals("Id"))?.Value ?? "-1");

                _logger.LogInformation($"cv uploaded uid {uid}");

                string path = Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot\cvs");

                if (!Directory.Exists(path))
                {
                    Directory.CreateDirectory(path);
                }

                string fileName = new PasswordGenerator.Password(
                     includeLowercase: true,
                     includeUppercase: true,
                     passwordLength: 30,
                     includeSpecial: false,
                     includeNumeric: false).Next();

                var newFileName = Path.GetFileNameWithoutExtension(cv.FileName) + "." + fileName + Path.GetExtension(cv.FileName);
                var filePath = Path.Combine(path, newFileName);

                using var stream = new FileStream(filePath, FileMode.Create);
                await cv.CopyToAsync(stream);

                var db = _redis.GetDatabase();

                await db.PublishAsync("cv:upload",
                    JsonSerializer.Serialize(new { Path = $"https:/localhost:7017/cvs/{newFileName}", UserId = uid }));

                _logger.LogInformation($"redis msg published {uid}");

                return Ok("cv uploaded");
            } catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        } 
    }
}