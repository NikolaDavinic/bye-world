using ByeWorld_backend.DTO;
using Neo4jClient;
using StackExchange.Redis;
using System.Text.Json;

namespace ByeWorld_backend.Services
{
    public class RedisQueueService : IHostedService
    {
        private readonly CancellationTokenSource _tokenSource;
        private readonly IConnectionMultiplexer _redis;
        private readonly IUserService _user;
        private readonly ILogger<RedisQueueService> _logger;
        public RedisQueueService(
            IConnectionMultiplexer redis,
            ILogger<RedisQueueService> loger,
            IUserService user
            )
        {
            _user = user;
            _redis = redis;
            _logger = loger;
            _tokenSource = new CancellationTokenSource();
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("redis msg queue listener started");

            _redis.GetSubscriber(_tokenSource.Token).Subscribe("cv:upload", (channel, message) =>
            {
                if (string.IsNullOrEmpty(message))
                {
                    return;
                }
                
                var msgdes = JsonSerializer.Deserialize<CVUploadMQDTO>(message.ToString());


                if (msgdes == null)
                {
                    return;
                }

                _logger.LogInformation($"{message}");
                _logger.LogInformation($"cv msg received {msgdes.UserId} {msgdes.Path}");

                _user.SetUserCV(msgdes.UserId, msgdes.Path);
            });

            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            //_logger.LogInformation("");

            _tokenSource.Cancel();

            return Task.CompletedTask;
        }
    }
}
