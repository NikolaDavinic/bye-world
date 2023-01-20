using System.Text.Json.Serialization;

namespace ByeWorld_backend.Models
{
    public class User
    {
        public long Id { get; set; }
        public string Name { get; set; } = String.Empty;
        public string Email { get; set; } = String.Empty;
        public string Phone { get; set; } = String.Empty;
        public string ImageUrl { get; set; } = String.Empty;
        [JsonIgnore]
        public string PasswordHash{ get; set; } = String.Empty;
        public string Role { get; set; } = "User";
        public List<HasSkill> Skills { get; set; } = new List<HasSkill>();
        public string CV { get; set; } = String.Empty;
    }
}
