using Microsoft.AspNetCore.Identity;
using System.Text.Json.Serialization;

namespace HikovagoAPI.Models
{
    public class User : IdentityUser
    {
        public User()
        {
            Media = new Media();
            Media.Name = "default";
            Media.Type = ".png";
            Media.Data = new byte[] {12};
        }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }

        public Guid? MediaId { get; set; }
        public virtual Media? Media { get; set; }
        [JsonIgnore]
        public virtual ICollection<Hotel>? Hotels { get; set; }
        [JsonIgnore]
        public virtual ICollection<Comment>? Comments { get; set; }
    }
}
