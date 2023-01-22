namespace ByeWorld_backend.DTO
{
    public class UpdateCompanyDTO
    {
        public long Id { get; set; }
        public string  Name { get; set; }
        public string Description { get; set; }
        public string LogoUrl { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
        public string VAT { get; set; }
    }
}
