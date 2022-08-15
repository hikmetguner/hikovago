using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HikovagoAPI.Data;
using HikovagoAPI.Models;

namespace HikovagoAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CountiesController : ControllerBase
    {
        private readonly HikovagoContext _context;

        public CountiesController(HikovagoContext context)
        {
            _context = context;
        }

        // GET: api/Counties
        [HttpGet]
        public async Task<ActionResult<IEnumerable<County>>> GetCounties()
        {
            if (_context.Counties == null)
            {
                return NotFound();
            }
            return await _context.Counties.ToListAsync();
        }

        // GET: api/Counties/Count
        [HttpGet("Count")]
        public async Task<ActionResult<int>> GetCountiesCount()
        {
            if (_context.Counties == null)
            {
                return NotFound();
            }
            return await _context.Counties.CountAsync();
        }


        // GET: api/Counties/Page
        [HttpGet("Page")]
        public async Task<ActionResult<IEnumerable<County>>> getCitiesPage(int page, int pageSize, bool asc, string? sortBy, string? search)
        {
            IQueryable<County> query = _context.Counties;
            IQueryable<City> cityQuery = _context.Cities;
            switch (sortBy)
            {
                case "id":
                    if (asc) query = query.OrderBy(c => c.Id);
                    else query = query.OrderByDescending(c => c.Id);
                    break;
                case "name":
                    if (asc) query = query.OrderBy(c => c.Name);
                    else query = query.OrderByDescending(c => c.Name);
                    break;
                case "city":
                    if (asc)
                    {
                        var jointQuery = from co in query
                                         join ci in cityQuery
                                         on co.Id equals ci.Id
                                         orderby ci.Name ascending
                                         select new County
                                         {
                                             Id = co.Id,
                                             Name = co.Name,
                                             CityId = co.Id
                                         };
                        query = jointQuery;

                    }
                    else
                    {
                        var jointQuery = from co in query
                                         join ci in cityQuery
                                         on co.Id equals ci.Id
                                         orderby ci.Name ascending
                                         select new County
                                         {
                                             Id = co.Id,
                                             Name = co.Name,
                                             CityId = co.Id
                                         };
                        query = jointQuery;
                    }
                    break;
            }
            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(c => c.Name.StartsWith(search));
            }
            return await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
        }

        // GET: api/Counties/5
        [HttpGet("{id}")]
        public async Task<ActionResult<County>> GetCounty(Guid id)
        {
            if (_context.Counties == null)
            {
                return NotFound();
            }
            var county = await _context.Counties.FindAsync(id);

            if (county == null)
            {
                return NotFound();
            }

            return county;
        }

        // GET: api/Counties/5
        [HttpGet("By/{cityId}")]
        public async Task<ActionResult<IEnumerable<County>>> GetCountiesByCity(Guid cityId)
        {
            if (_context.Counties == null)
            {
                return NotFound();
            }
            var counties = _context.Counties.Where(e => e.CityId == cityId);

            if (counties == null)
            {
                return NotFound();
            }

            return await counties.ToListAsync();
        }

        // PUT: api/Counties/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCounty(Guid id, County county)
        {
            if (id != county.Id)
            {
                return BadRequest();
            }

            _context.Entry(county).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CountyExists(id))
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

        // POST: api/Counties
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<County>> PostCounty(County county)
        {
            if (_context.Counties == null)
            {
                return Problem("Entity set 'HikovagoContext.Counties'  is null.");
            }
            _context.Counties.Add(county);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCounty", new { id = county.Id }, county);
        }

        // DELETE: api/Counties/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCounty(Guid id)
        {
            if (_context.Counties == null)
            {
                return NotFound();
            }
            var county = await _context.Counties.FindAsync(id);
            if (county == null)
            {
                return NotFound();
            }

            _context.Counties.Remove(county);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CountyExists(Guid id)
        {
            return (_context.Counties?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
