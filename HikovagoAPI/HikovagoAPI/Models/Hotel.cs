using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace HikovagoAPI.Models
{
    public class Hotel
    {
        public Hotel()
        {
            this.Attributes = new HashSet<Attribute>();
            this.Medias = new HashSet<Media>();
        }

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }

        [Required]
        public string OwnerId { get; set; } = null!;

        [Required]
        [StringLength(255)]
        public string Name { get; set; } = null!;

        [Required]
        public Guid CountryId { get; set; }
        [Required]
        public Guid CityId { get; set; }
        [Required]
        public Guid CountyId { get; set; }
        [Required]
        [StringLength(255)]
        public string Address { get; set; } = null!;

        [Required]
        [StringLength(255)]
        public string Cellphone { get; set; } = null!;

        [Required]
        [StringLength(2000)]
        public string Description { get; set; } = null!;

        public int Star { get; set; } = 0;
        public int Views { get; set; } = 0;
        public int UserScore { get; set; } = 0;

        [JsonIgnore]
        public virtual User? Owner { get; set; }

        public virtual Country? Country { get; set; }
        public virtual City? City { get; set; }
        public virtual County? County { get; set; }

        public virtual ICollection<Media>? Medias { get; set; }
        public virtual ICollection<Room>? Rooms { get; set; }
        public virtual ICollection<Attribute>? Attributes { get; set; }
        public virtual ICollection<Comment>? Comments { get; set; }
    }
}
