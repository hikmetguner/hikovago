using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace HikovagoAPI.Models
{
    public class Room
    {

        public Room()
        {
            this.Attributes = new HashSet<Attribute>();
            Medias = new HashSet<Media>();
        }

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }

        [Required]
        public Guid HotelId { get; set; }

        [Required]
        [StringLength(50)]
        public string Name { get; set; } = String.Empty;

        [Required]
        public string Capacity { get; set; } = null!;

        [Required]
        public int Price { get; set; }

        [JsonIgnore]
        public virtual Hotel? Hotel { get; set; }
        public virtual ICollection<Media>? Medias { get; set; }
        public virtual ICollection<Attribute>? Attributes { get; set; } 
    }
}
