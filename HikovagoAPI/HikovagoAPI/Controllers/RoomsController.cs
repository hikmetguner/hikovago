using Microsoft.AspNetCore.Http;
using HikovagoAPI.Data;
using HikovagoAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HikovagoAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomsController : ControllerBase
    {
        private readonly HikovagoContext _context;

        public RoomsController(HikovagoContext context)
        {
            _context = context;
        }

        // GET: api/Rooms
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Room>>> GetRooms()
        {
            if (_context.Rooms == null)
            {
                return NotFound();
            }
            return await _context.Rooms.Include(e => e.Medias).ToListAsync();
        }

        // GET: api/Rooms/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Room>> GetRoom(Guid id)
        {
            if (_context.Rooms == null)
            {
                return NotFound();
            }
            var room = await _context.Rooms.Include(e => e.Medias).SingleAsync(e => e.Id == id);

            if (room == null)
            {
                return NotFound();
            }

            return room;
        }

        // GET: api/Rooms/User/5
        [HttpGet("User/{id}")]
        public async Task<ActionResult<IEnumerable<Room>>> GetRoomByUser(string id)
        {
            if (_context.Rooms == null)
            {
                return NotFound();
            }
            var hotel = _context.Hotels.Where(e => e.OwnerId == id).Select(e => e.Id);
            var rooms = await _context.Rooms.Include(e => e.Medias).Where(
                e => hotel.Contains(e.HotelId)).ToListAsync();

            if (rooms == null)
            {
                return NotFound();
            }

            return rooms;
        }

        // PUT: api/Rooms/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRoom(Guid id, Room room)
        {
            if (id != room.Id)
            {
                return BadRequest();
            }

            _context.Entry(room).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RoomExists(id))
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
        public async Task<ActionResult<Room>> PostRooms(Room room)
        {
            if (_context.Rooms == null)
            {
                return Problem("Entity set 'HikovagoContext.Rooms'  is null.");
            }
            _context.Rooms.Add(room);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetRoom", new { id = room.Id }, room);
        }

        // DELETE: api/Rooms/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRoom(Guid id)
        {
            if (_context.Rooms == null)
            {
                return NotFound();
            }
            var room = await _context.Rooms.Include(e => e.Medias).SingleAsync(e => e.Id == id);
            if (room == null)
            {
                return NotFound();
            }

            foreach (var media in room.Medias)
            {
                _context.Medias.Remove(media);
            }

            _context.Rooms.Remove(room);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool RoomExists(Guid id)
        {
            return (_context.Rooms?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
