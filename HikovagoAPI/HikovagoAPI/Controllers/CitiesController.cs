using System;
using System.Collections.Generic;
using System.Linq.Expressions;
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
    public class CitiesController : ControllerBase
    {
        private readonly HikovagoContext _context;

        public CitiesController(HikovagoContext context)
        {
            _context = context;
        }


        // GET: api/Cities
        [HttpGet]
        public async Task<ActionResult<IEnumerable<City>>> GetCities()
        {
            if (_context.Cities == null)
            {
                return NotFound();
            }
            return await _context.Cities.ToListAsync();
        }

        // GET: api/Cities
        [HttpGet("Count")]
        public async Task<ActionResult<int>> GetCitiesCount()
        {
            if (_context.Cities == null)
            {
                return NotFound();
            }
            return await _context.Cities.CountAsync();
        }

        [HttpGet("By/{countryId}")]
        public async Task<ActionResult<IEnumerable<City>>> getCitiesByCountry(Guid countryId)
        {
            if (_context.Cities == null)
            {
                return NotFound();
            }
            var cities = _context.Cities.Where(e => e.CountryId == countryId);

            if (cities == null)
            {
                return NotFound();
            }

            return await cities.ToListAsync();
        }

        // GET: api/Cities
        [HttpGet("Page")]
        public async Task<ActionResult<IEnumerable<City>>> getCitiesPage(int page, int pageSize, bool asc, string? sortBy, string? search)
        {
            IQueryable<City> query = _context.Cities;
            IQueryable<Country> countryQuery = _context.Countries;
            switch (sortBy)
            {
                case "id":
                    if (asc) query = query.OrderBy(c => c.Id);
                    else query = query.OrderByDescending(c => c.Id);
                    break;
                case "cityName":
                    if (asc) query = query.OrderBy(c => c.Name);
                    else query = query.OrderByDescending(c => c.Name);
                    break;
                case "countryName":
                    if (asc)
                    {
                        var jointQuery = from ci in query
                                         join co in countryQuery
                                         on ci.Id equals co.Id
                                         orderby co.Name ascending
                                         select new City
                                         {
                                             Id = ci.Id,
                                             Name = ci.Name,
                                             CountryId = ci.Id
                                         };
                        query = jointQuery;

                    }
                    else
                    {
                        var jointQuery = from ci in query
                                         join co in countryQuery
                                         on ci.Id equals co.Id
                                         orderby co.Name descending
                                         select new City
                                         {
                                             Id = ci.Id,
                                             Name = ci.Name,
                                             CountryId = ci.Id
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

        // GET: api/Cities/5
        [HttpGet("{id}")]
        public async Task<ActionResult<City>> GetCity(Guid id)
        {
            if (_context.Cities == null)
            {
                return NotFound();
            }
            var city = await _context.Cities.FindAsync(id);

            if (city == null)
            {
                return NotFound();
            }

            return city;
        }

        // PUT: api/Cities/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCity(Guid id, City city)
        {
            if (id != city.Id)
            {
                return BadRequest();
            }

            _context.Entry(city).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CityExists(id))
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

        // POST: api/Cities
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<City>> PostCity(City city)
        {
            if (_context.Cities == null)
            {
                return Problem("Entity set 'HikovagoContext.Cities'  is null.");
            }
            _context.Cities.Add(city);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCity", new { id = city.Id }, city);
        }

        // DELETE: api/Cities/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCity(Guid id)
        {
            if (_context.Cities == null)
            {
                return NotFound();
            }
            var city = await _context.Cities.FindAsync(id);
            if (city == null)
            {
                return NotFound();
            }

            _context.Cities.Remove(city);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CityExists(Guid id)
        {
            return (_context.Cities?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
