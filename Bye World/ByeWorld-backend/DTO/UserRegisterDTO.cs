using System.ComponentModel.DataAnnotations;

namespace ByeWorld_backend.DTO
{
    public class UserRegisterDTO
    {
        public String Name { get; set; } = String.Empty;
        public String Email { get; set; } = String.Empty;
        public String Phone { get; set; } = String.Empty;
        public String Password { get; set; } = String.Empty;
        public String? UserType { get; set; }
    }
}
