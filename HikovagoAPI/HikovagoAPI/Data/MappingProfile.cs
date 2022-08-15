using HikovagoAPI.Models;
using HikovagoAPI.Models.DTO;
using AutoMapper;

namespace HikovagoAPI.Data
{
    public class MappingProfile:Profile
    {
        public MappingProfile()
        {
            CreateMap<RegistrationDTO, User>()
            .ForMember(u => u.UserName, opt => opt.MapFrom(x => x.Email));
        }
        
    }
}
