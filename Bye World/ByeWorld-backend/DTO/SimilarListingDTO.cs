using ByeWorld_backend.Models;

namespace ByeWorld_backend.DTO
{
    public class SimilarListingDTO
    {
        public City? City { get; set; }
        public Company? Company { get; set; }
        public List<RequiresSkill> Requirements { get; set; } = new List<RequiresSkill>();
    }
}
