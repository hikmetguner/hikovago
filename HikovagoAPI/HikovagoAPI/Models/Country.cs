using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace HikovagoAPI.Models
{
    public class Country
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }

        [Required]
        [StringLength(50)]
        public string Name { get; set; } = String.Empty;

        [JsonIgnore]
        public virtual ICollection<City>? Cities { get; set; }
        [JsonIgnore]
        public virtual ICollection<Hotel>? Hotels { get; set; }
    }
}
