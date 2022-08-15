using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HikovagoAPI.Data;
using HikovagoAPI.Models;
using System.Net.Http.Headers;
using BrunoZell.ModelBinding;
using HikovagoAPI.Models.DTO;

namespace HikovagoAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MediasController : ControllerBase
    {
        private readonly HikovagoContext _context;

        public MediasController(HikovagoContext context)
        {
            _context = context;
        }

        [HttpPost("Hotel/{hotelId}"), DisableRequestSizeLimit]
        public IActionResult UploadHotelMedia(Guid hotelId,
        IList<IFormFile> files)
        {
            if (files != null)
            {
                if (files.Count > 0)
                {
                    foreach (var file in files)
                    {
                        //Getting FileName
                        var fileName = Path.GetFileNameWithoutExtension(file.FileName);
                        //Getting file Extension
                        var fileExtension = Path.GetExtension(file.FileName);

                        var data = new MemoryStream();
                        file.CopyTo(data);
                        var temp = new Media();
                        temp.Name = fileName;
                        temp.Type = fileExtension;
                        temp.Data = data.ToArray();
                        _context.Hotels.Find(hotelId).Medias.Add(temp);
                    }
                    _context.SaveChanges();

                    return Ok();

                }
                else
                {
                    return NoContent();
                }
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpGet("Hotel/{id}")]
        public async Task<ActionResult<ICollection<Media>>> GetHotelMedias(Guid id)
        {
            if (_context.Hotels == null)
            {
                return NotFound();
            }
            var hotel = _context.Hotels.Include(e => e.Medias).Single(e => e.Id == id);

            if (hotel == null)
            {
                return NotFound();
            }
            return await Task.Run(() => hotel.Medias.ToList());
        }

        [HttpPost("Room/{roomId}"), DisableRequestSizeLimit]
        public IActionResult UploadRoomMedia(Guid roomId,
        IList<IFormFile> files)
        {
            if (files != null || _context.Rooms.Find(roomId) == null)
            {
                if (files.Count > 0)
                {
                    foreach (var file in files)
                    {
                        //Getting FileName
                        var fileName = Path.GetFileNameWithoutExtension(file.FileName);
                        //Getting file Extension
                        var fileExtension = Path.GetExtension(file.FileName);

                        var data = new MemoryStream();
                        file.CopyTo(data);
                        var temp = new Media();
                        temp.Name = fileName;
                        temp.Type = fileExtension;
                        temp.Data = data.ToArray();
                        _context.Rooms.Find(roomId).Medias.Add(temp);
                    }
                    _context.SaveChanges();

                    return Ok();

                }
                else
                {
                    return NoContent();
                }
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpGet("Room/{id}")]
        public async Task<ActionResult<ICollection<Media>>> GetRoomMedias(Guid id)
        {
            if (_context.Rooms == null)
            {
                return NotFound();
            }
            var room = _context.Rooms.Include(e => e.Medias).Single(e => e.Id == id);

            if (room == null)
            {
                return NotFound();
            }
            return await Task.Run(() => room.Medias.ToList());
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Media>>> GetMedias()
        {
            if(_context == null)
            {
                return NotFound();
            }
            return await _context.Medias.ToListAsync();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMedia(Guid id)
        {
            if (_context.Medias == null)
            {
                return NotFound();
            }
            var media = await _context.Medias.FindAsync(id);
            if (media == null)
            {
                return NotFound();
            }

            _context.Medias.Remove(media);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("User/{userId}"), DisableRequestSizeLimit]
        public IActionResult UploadUserMedia(string userId,
        IList<IFormFile> files)
        {
            if (files != null || _context.Users.Find(userId) == null)
            {
                var user = _context.Users.Include(e=>e.Media).Single(e=>e.Id == userId);
                if (files.Count > 0)
                {
                    foreach (var file in files)
                    {
                        //Getting FileName
                        var fileName = Path.GetFileNameWithoutExtension(file.FileName);
                        //Getting file Extension
                        var fileExtension = Path.GetExtension(file.FileName);

                        var data = new MemoryStream();
                        file.CopyTo(data);
                        user.Media.Name = fileName;
                        user.Media.Type = fileExtension;
                        user.Media.Data = data.ToArray();
                    }
                    _context.SaveChanges();

                    return Ok();

                }
                else
                {
                    return NoContent();
                }
            }
            else
            {
                return BadRequest();
            }
        }

        // PUT: api/Users/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(Guid id, Media media)
        {
            if (id != media.Id)
            {
                return BadRequest();
            }

            _context.Entry(media).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MediaExists(id))
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

        private bool MediaExists(Guid id)
        {
            return (_context.Medias?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
