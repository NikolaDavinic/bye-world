namespace ByeWorld_backend.Services
{
    public interface IRedisQueueService
    {
        void Start();
        void Stop();
    }
}