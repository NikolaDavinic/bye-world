namespace ByeWorld_backend.Models
{
    public class City
    {
        public long Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public Listing? Listing { get; set; }
        
    }
}
