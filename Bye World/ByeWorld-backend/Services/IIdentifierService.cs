
namespace ByeWorld_backend.Services
{
    public interface IIdentifierService
    {
        Task<long> CompanyNext();
        Task<long> IdNext(string node);
        Task<long> ListingNext();
        Task<long> ReviewNext();
        Task<long> UserNext();
    }
}