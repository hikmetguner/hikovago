namespace HikovagoAPI.Models.DTO
{
    public class FilterDTO
    {
        public Guid? countryId { get; set; }
        public Guid? cityId { get; set; }
        public Guid? countyId { get; set; }
        public int? stars { get; set; }
        public string? sortBy { get; set; }
        public string? direction { get; set; }
        public string? search { get; set; }

    }
}
