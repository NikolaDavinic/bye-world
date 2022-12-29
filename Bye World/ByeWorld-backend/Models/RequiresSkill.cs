namespace ByeWorld_backend.Models
{
    public class RequiresSkill
    {
        public Listing? Listing{ get; set; }
        public Skill? Skill { get; set; }
        public string Proficiency { get; set; } = string.Empty;
    }
}
