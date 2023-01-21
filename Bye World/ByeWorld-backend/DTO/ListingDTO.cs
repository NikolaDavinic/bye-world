using ByeWorld_backend.Models;

namespace ByeWorld_backend.DTO
{
    public class ListingDTO
    {
        public long Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime PostingDate { get; set; } = DateTime.Now;
        public DateTime ClosingDate { get; set; } = DateTime.MaxValue;
        public List<Skill> Requirements { get; set; } = new List<Skill>();
        public int CompanyId { get; set; }
        public string CityName { get; set; } = string.Empty;
        public string CompanyName { get; set; } = string.Empty;
        public string CompanyLogoUrl { get; set; } = string.Empty;
    }
}
