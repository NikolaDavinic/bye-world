namespace ByeWorld_backend.Models
{
    public class User
    {
        public long Id { get; set; }
        public string Name { get; set; } = String.Empty;
        public string Email { get; set; } = String.Empty;
        public string Phone{ get; set; } = String.Empty;
        public string ImageUrl { get; set; } = String.Empty;
        public string PasswordHash{ get; set; } = String.Empty;
        public string UserType{ get; set; } = String.Empty;
        public List<HasSkill> Skills { get; set; } = new List<HasSkill>();
    }
}
