using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;
using Newtonsoft.Json;
using StackExchange.Redis;
using System.Net.Http.Headers;
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
                string finalPath = string.Empty;
                _logger.LogInformation($"cv uploaded uid {uid}");

                //UPLOAD CV TEST
                ByteArrayContent fileContent;
                using (var memoryStream = new MemoryStream())
                {
                    await cv.CopyToAsync(memoryStream);
                    fileContent = new ByteArrayContent(memoryStream.ToArray());
                }
                fileContent.Headers.ContentType = System.Net.Http.Headers.MediaTypeHeaderValue.Parse("application/pdf");
                var client = new HttpClient();
                var response = await client.PostAsync("https://www.filestackapi.com/api/store/S3?key=***REMOVED***", fileContent);
                var responseBody = await response.Content.ReadAsStringAsync();
                //
                dynamic json = JsonConvert.DeserializeObject(responseBody);
                string url = json.url;

                if (url.Length > 0)
                {
                    finalPath = url;
                }
                else //Redundancy upload to server instead of file upload API
                {
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
                    finalPath= $"https:/localhost:7017/cvs/{newFileName}";
                }

                var db = _redis.GetDatabase();

                await db.PublishAsync("cv:upload",
                    System.Text.Json.JsonSerializer.Serialize(new { Path = finalPath, UserId = uid }));

                _logger.LogInformation($"redis msg published {uid}");

                return Ok("cv uploaded");
                
            } catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        } 
    }
}