namespace ByeWorld_backend.DTO
{
    public class AddCompanyDTO
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? LogoUrl { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string VAT { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
    }
}
