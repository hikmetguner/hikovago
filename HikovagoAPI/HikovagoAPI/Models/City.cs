using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace HikovagoAPI.Models
{
    public class City
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }

        [Required]
        [StringLength(50)]
        public string Name { get; set; } = String.Empty;

        [Required]
        public Guid CountryId { get; set; }

        [JsonIgnore]
        public virtual Country? Country { get; set; }
        [JsonIgnore]
        public virtual ICollection<County>? Counties { get; set; }
        [JsonIgnore]

        public virtual ICollection<Hotel>? Hotels { get; set; }
    }
}
