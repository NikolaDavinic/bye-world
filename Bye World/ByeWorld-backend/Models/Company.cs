namespace ByeWorld_backend.Models
{
    public class Company
    {
        public long ID { get; set; }
        public string Name { get; set; }= String.Empty;
        public string Description { get; set; } = String.Empty;
        public string LogoUrl { get; set; } = String.Empty;
        public string Phone { get; set; } = String.Empty;
        public string Email { get; set; } = String.Empty;
        public long VAT { get; set; }
        public string Adress{ get; set; } = String.Empty;
        public List<Listing> Listings { get; set; } = new List<Listing>();
        public List<Review> Reviews { get; set; } = new List<Review>();

    }
}
