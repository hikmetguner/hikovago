using HikovagoAPI.Data;
using HikovagoAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HikovagoAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly HikovagoContext _context;

        public UsersController(HikovagoContext context)
        {
            _context = context;
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            if (_context.Countries == null)
            {
                return NotFound();
            }
            return await _context.Users.Include(e=>e.Media).ToListAsync();
        }

        // GET: api/Users/Count
        [HttpGet("Count")]
        public async Task<ActionResult<int>> GetusersCount()
        {
            if (_context.Countries == null)
            {
                return NotFound();
            }
            return await _context.Countries.CountAsync();
        }


        // GET: api/Users
        [HttpGet("Email/{email}")]
        public async Task<ActionResult<User>> GetUserByEmail(string email)
        {
            if(_context.Users == null)
            {
                return NotFound();
            }
            return await _context.Users.Include(e => e.Media).SingleAsync(e => e.UserName == email);
        }


        // GET: api/Users/{guid}
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(string id)
        {
            if (_context.Countries == null)
            {
                return NotFound();
            }
            var country = await _context.Users.Include(e => e.Media).SingleAsync(e=> e.Id == id);

            if (country == null)
            {
                return NotFound();
            }

            return country;
        }

        // PUT: api/Users/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(string id, User user)
        {
            if (id != user.Id)
            {
                return BadRequest();
            }

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
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

        // DELETE: api/Countries/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            if (_context.Countries == null)
            {
                return NotFound();
            }
            var user = await _context.Users.Include(e => e.Media).SingleAsync(e => e.Id == id);
            if (user == null)
            {
                return NotFound();
            }
            _context.Medias.Remove(user.Media);
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok();
        }

        private bool UserExists(string id)
        {
            return (_context.Users?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
