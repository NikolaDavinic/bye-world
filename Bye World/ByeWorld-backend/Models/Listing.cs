namespace ByeWorld_backend.Models
{
    public class Listing
    {
        public long Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public List<RequiresSkill> Requirements { get; set; } = new List<RequiresSkill>();
        public DateTime PostingDate { get; set; } = DateTime.UtcNow;
        public DateTime ClosingDate { get; set; } = DateTime.MaxValue;
        public Company? Company{ get; set; }
        public City? City { get; set; }
    }
}
