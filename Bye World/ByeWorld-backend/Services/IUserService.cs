
namespace ByeWorld_backend.Services
{
    public interface IUserService
    {
        Task<string?> SetUserCV(long userId, string path);
    }
}