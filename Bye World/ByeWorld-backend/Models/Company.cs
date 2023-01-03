using System.Text.Json.Serialization;

namespace ByeWorld_backend.Models
{
    public class Company
    {
        public long Id { get; set; }
        public string Name { get; set; }= String.Empty;
        public string Description { get; set; } = String.Empty;
        public string LogoUrl { get; set; } = String.Empty;
        public string Email { get; set; } = String.Empty;
        public string Address{ get; set; } = String.Empty;
        public string VAT { get; set; } = String.Empty;
        public List<Listing> Listings { get; set; } = new List<Listing>();
        public List<Review> Reviews { get; set; } = new List<Review>();
        public User? User { get; set; } = null;
    }
}
