using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace HikovagoAPI.Models
{
    public class Attribute
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }

        [Required]
        public string Name { get; set; } = null!;

        [Required]
        public Guid IconId { get; set; }

        [JsonIgnore]         
        public virtual Media? Icon { get; set; }

        [JsonIgnore]
        public virtual ICollection<Hotel>? Hotels { get; set; }

        [JsonIgnore]
        public virtual ICollection<Room>? Rooms { get; set; }

    }
}
