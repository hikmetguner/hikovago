using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace HikovagoAPI.Models
{
    public class Media
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }
        [Required]
        [StringLength(50)]
        public string Name { get; set; } = String.Empty;

        [Required]
        public string Type { get; set; } = null!;
        [Required]
        public byte[] Data { get; set; } = null!;
        public DateTime DateUploaded { get; set; } = DateTime.UtcNow;

        [JsonIgnore]
        public virtual User? User { get; set; }
        [JsonIgnore]
        public virtual Attribute? Attribute { get; set; }
        [JsonIgnore]
        public virtual ICollection<Hotel>? Hotels { get; set; }
        [JsonIgnore]
        public virtual ICollection<Room>? Rooms { get; set; }
    }
}
