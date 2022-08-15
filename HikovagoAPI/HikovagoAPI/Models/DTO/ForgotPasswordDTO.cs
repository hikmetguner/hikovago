using System.ComponentModel.DataAnnotations;

namespace HikovagoAPI.Models.DTO
{
    public class ForgotPasswordDTO
    {
        [Required]
        [EmailAddress]
        public string? Email { get; set; }
        [Required]
        public string? ClientURI { get; set; }
    }
}
