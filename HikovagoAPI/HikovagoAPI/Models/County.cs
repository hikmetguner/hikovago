using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace HikovagoAPI.Models
{
    public class County
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }

        [Required]
        [StringLength(50)]
        public string Name { get; set; } = String.Empty;

        [Required]
        public Guid CityId { get; set; }

        [JsonIgnore]
        public virtual City? City { get; set; }
        [JsonIgnore]
        public virtual ICollection<Hotel>? Hotels { get; set; }
    }
}
