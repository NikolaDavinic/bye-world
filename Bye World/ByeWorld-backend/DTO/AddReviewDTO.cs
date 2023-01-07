namespace ByeWorld_backend.DTO
{
    public class AddReviewDTO
    {
        public string Description { get; set; } = string.Empty;
        public int Value { get; set; }
        public long CompanyId { get; set; }
    }
}
