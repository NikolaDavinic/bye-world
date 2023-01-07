namespace ByeWorld_backend.Models
{
    public class Review
    {
        public long Id { get; set; }
        public string Description { get; set; } = string.Empty;
        public int Value { get; set; }
        public DateTime Date { get; set; } = DateTime.UtcNow;
        public Company? Company { get; set; } = null;
        public User? User { get; set; } = null;
    }
}
