using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HikovagoAPI.Data;
using HikovagoAPI.Models;
using Microsoft.AspNetCore.Authorization;

namespace HikovagoAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CountriesController : ControllerBase
    {
        private readonly HikovagoContext _context;

        public CountriesController(HikovagoContext context)
        {
            _context = context;
        }

        // GET: api/Countries
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Country>>> GetCountries()
        {
            if (_context.Countries == null)
            {
                return NotFound();
            }
            return await _context.Countries.ToListAsync();
        }

        // GET: api/Countries/Count
        [HttpGet("Count")]
        public async Task<ActionResult<int>> GetCountriesCount()
        {
            if (_context.Countries == null)
            {
                return NotFound();
            }
            return await _context.Countries.CountAsync();
        }


        // GET: api/Cities
        [HttpGet("Page")]
        public async Task<ActionResult<IEnumerable<Country>>> getCountriesPage(int page, int pageSize, bool asc, string? sortBy, string? search)
        {
            IQueryable<Country> query = _context.Countries;
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
            }
            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(c => c.Name.StartsWith(search));
            }
            return await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
        }


        // GET: api/Countries/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Country>> GetCountry(Guid id)
        {
            if (_context.Countries == null)
            {
                return NotFound();
            }
            var country = await _context.Countries.FindAsync(id);

            if (country == null)
            {
                return NotFound();
            }

            return country;
        }

        // PUT: api/Countries/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCountry(Guid id, Country country)
        {
            if (id != country.Id)
            {
                return BadRequest();
            }

            _context.Entry(country).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CountryExists(id))
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

        // POST: api/Countries
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Country>> PostCountry(Country country)
        {
            if (_context.Countries == null)
            {
                return Problem("Entity set 'HikovagoContext.Countries'  is null.");
            }
            _context.Countries.Add(country);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCountry", new { id = country.Id }, country);
        }

        // DELETE: api/Countries/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCountry(Guid id)
        {
            if (_context.Countries == null)
            {
                return NotFound();
            }
            var country = await _context.Countries.FindAsync(id);
            if (country == null)
            {
                return NotFound();
            }

            _context.Countries.Remove(country);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CountryExists(Guid id)
        {
            return (_context.Countries?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
