using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace HikovagoAPI.Models
{
    public class Comment
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }

        [Required]
        public string UserId { get; set; } = null!;

        [Required]
        public Guid HotelId { get; set; }

        [StringLength(120)]
        public string Title { get; set; } = null!;

        [StringLength(500)]
        public string? Text { get; set; }
        public int rating { get; set; } = 0;
        public DateTime DateCreated { get; set; } = DateTime.UtcNow;

        [JsonIgnore]
        public virtual User? User { get; set; }
        [JsonIgnore]
        public virtual Hotel? Hotel { get; set; }
    }
}
