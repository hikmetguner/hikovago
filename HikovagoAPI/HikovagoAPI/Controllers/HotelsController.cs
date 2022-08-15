using HikovagoAPI.Data;
using HikovagoAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HikovagoAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HotelsController : ControllerBase
    {
        private readonly HikovagoContext _context;

        public HotelsController(HikovagoContext context)
        {
            _context = context;
        }

        // GET: api/Hotels
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Hotel>>> GetHotels()
        {
          if (_context.Hotels == null)
          {
              return NotFound();
          }
            return await _context.Hotels.Include(e => e.Medias).ToListAsync();
        }

        [HttpGet("Filter")]
        public async Task<ActionResult<IEnumerable<Hotel>>> GetHotelsPaged(Guid? countryId, Guid? cityId, Guid? countyId, int? stars, string? sortBy, string? direction, string? search, int page)
        {
            IQueryable<Hotel> query = _context.Hotels.Include(e => e.Medias).Include(e => e.Rooms).ThenInclude(e => e.Medias).Include(e => e.Comments);
            if(countryId != null)
            {
                query = query.Where(e => e.CountryId == countryId);
            }
            if (cityId != null)
            {
                query = query.Where(e => e.CityId == cityId);
            }
            if (countyId != null)
            {
                query = query.Where(e => e.CountyId == countyId);
            }
            if (stars != null)
            {
                query = query.Where(e => e.Star >= stars);
            }
            if (search != null)
            {
                query = query.Where(e => e.Name.Contains(search));
            }
            switch (sortBy)
            {
                case "name":
                    if(direction == "desc")
                    {
                        query = query.OrderByDescending(e => e.Name);
                    }
                    else
                    {
                        query = query.OrderBy(e => e.Name);
                    }
                    break;
                case "stars":
                    if (direction == "desc")
                    {
                        query = query.OrderByDescending(e => e.Star);
                    }
                    else
                    {
                        query = query.OrderBy(e => e.Star);
                    }
                    break;
            }

            return await query.Skip(page * 3).Take(3).ToListAsync();
        }

        // GET: api/Hotels/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Hotel>> GetHotel(Guid id)
        {
          if (_context.Hotels == null)
          {
              return NotFound();
          }
            var hotel = await _context.Hotels.Include(e => e.Medias).Include(e=>e.Rooms).ThenInclude(e => e.Medias).Include(e => e.Comments).SingleAsync(e => e.Id == id);

            if (hotel == null)
            {
                return NotFound();
            }

            return hotel;
        }

        // GET: api/Hotels/User/id
        [HttpGet("User/{id}")]
        public async Task<ActionResult<IEnumerable<Hotel>>> GetHotelsByUser(string id)
        {
            if (_context.Hotels == null)
            {
                return NotFound();
            }
            var hotel = await _context.Hotels.Include(e => e.Medias).Include(e => e.Rooms).Where(e => e.OwnerId == id).ToListAsync();

            if (hotel == null)
            {
                return NotFound();
            }

            return hotel;
        }

        // PUT: api/Hotels/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutHotel(Guid id, Hotel hotel)
        {
            if (id != hotel.Id)
            {
                return BadRequest();
            }

            _context.Entry(hotel).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!HotelExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Hotels
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Hotel>> PostHotel(Hotel hotel)
        {
          if (_context.Hotels == null)
          {
              return Problem("Entity set 'HikovagoContext.Hotels'  is null.");
          }
            _context.Hotels.Add(hotel);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetHotel", new { id = hotel.Id }, hotel);
        }

        // DELETE: api/Hotels/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHotel(Guid id)
        {
            if (_context.Hotels == null)
            {
                return NotFound();
            }
            var hotel = await _context.Hotels.Include(e => e.Medias).SingleAsync(e => e.Id == id);
            if (hotel == null)
            {
                return NotFound();
            }

            foreach (var media in hotel.Medias)
            {
                _context.Medias.Remove(media);
            }

            _context.Hotels.Remove(hotel);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool HotelExists(Guid id)
        {
            return (_context.Hotels?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
