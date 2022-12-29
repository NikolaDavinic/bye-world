namespace ByeWorld_backend.Models
{
    public class HasSkill
    {
        public User? User { get; set; }
        public Skill? Skill { get; set; }
        public string Proficiency { get; set; } = string.Empty;
    }
}
