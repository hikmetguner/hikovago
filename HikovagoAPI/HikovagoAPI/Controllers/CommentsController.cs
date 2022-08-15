using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using HikovagoAPI.Data;
using HikovagoAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace HikovagoAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentsController : ControllerBase
    {
        private readonly HikovagoContext _context;

        public CommentsController(HikovagoContext context)
        {
            _context = context;
        }

        // GET: api/Comments
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Comment>>> GetComments()
        {
            if (_context.Rooms == null)
            {
                return NotFound();
            }
            return await _context.Comments.ToListAsync();
        }

        // GET: api/Comments/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Comment>> GetComment(Guid id)
        {
            if (_context.Comments == null)
            {
                return NotFound();
            }
            var comment = await _context.Comments.FindAsync(id);

            if (comment == null)
            {
                return NotFound();
            }

            return comment;
        }

        // GET: api/Comments/5
        [HttpGet("User/{id}")]
        public async Task<ActionResult<IEnumerable<Comment>>> GetCommentsByUser(string id)
        {
            if (_context.Comments == null)
            {
                return NotFound();
            }
            var comments = await _context.Comments.Where(e => e.UserId == id).ToListAsync();

            if (comments == null)
            {
                return NotFound();
            }

            return comments;
        }

        // GET: api/Comments/5
        [HttpGet("Hotel/{id}")]
        public async Task<ActionResult<IEnumerable<Comment>>> GetCommentsByHotel(Guid id)
        {
            if (_context.Comments == null)
            {
                return NotFound();
            }
            var comments = await _context.Comments.Where(e => e.HotelId == id).ToListAsync();

            if (comments == null)
            {
                return NotFound();
            }

            return comments;
        }

        // PUT: api/Rooms/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutComment(Guid id, Comment comment)
        {
            if (id != comment.Id)
            {
                return BadRequest();
            }

            _context.Entry(comment).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CommentExists(id))
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
        public async Task<ActionResult<Comment>> PostComment(Comment comment)
        {
            if (_context.Comments == null)
            {
                return Problem("Entity set 'HikovagoContext.Comments'  is null.");
            }
            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetComment", new { id = comment.Id }, comment);
        }

        // DELETE: api/Comments/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteComment(Guid id)
        {
            if (_context.Comments == null)
            {
                return NotFound();
            }
            var comment = await _context.Comments.FindAsync(id);
            if (comment == null)
            {
                return NotFound();
            }

            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CommentExists(Guid id)
        {
            return (_context.Comments?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
