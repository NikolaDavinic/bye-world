using ByeWorld_backend.Models;

namespace ByeWorld_backend.DTO
{
    public class SkillDTO
    {
        public string Name { get; set; } = string.Empty;
        public string Proficiency { get; set; } = string.Empty;
    }
    public class AddListingDTO
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public List<SkillDTO> Requirements { get; set; } = new List<SkillDTO>();
        public DateTime PostingDate { get; set; } = DateTime.Now;
        public DateTime ClosingDate { get; set; } = DateTime.MaxValue;
        public int CompanyId { get; set; }
        public string CityName { get; set; } = string.Empty;  
    }
}
