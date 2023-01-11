namespace ByeWorld_backend.DTO
{
    public class UpdateReviewDTO
    {
        public long Id { get; set; } = 0;
        public string Description { get; set; } = string.Empty;
        public int Value { get; set; }
    }
}
