
namespace ByeWorld_backend.Services
{
    public interface IIdentifierService
    {
        Task<long> IdNext(string node);
        Task<long> UserNext();
        Task<long> CompanyNext();
    }
}