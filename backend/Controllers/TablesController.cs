using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RMS.Api.Data;
using RMS.Api.Models;

namespace RMS.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TablesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TablesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var tables = await _context.Tables.ToListAsync();
            return Ok(tables);
        }

        [HttpPut("{id}/status")]
        [Authorize(Roles = "admin,manager,waiter")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] string status)
        {
            var table = await _context.Tables.FindAsync(id);
            if (table == null)
            {
                return NotFound(new { message = "Table not found" });
            }

            table.Status = status;
            await _context.SaveChangesAsync();
            return Ok(table);
        }
    }
}
