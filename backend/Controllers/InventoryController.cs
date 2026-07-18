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
    public class InventoryController : ControllerBase
    {
        private readonly AppDbContext _context;

        public InventoryController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var inventory = await _context.InventoryItems.ToListAsync();
            return Ok(inventory);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin,manager")]
        public async Task<IActionResult> Update(int id, [FromBody] decimal quantity)
        {
            var item = await _context.InventoryItems.FindAsync(id);
            if (item == null) return NotFound(new { message = "Inventory item not found" });

            item.Quantity = quantity;
            await _context.SaveChangesAsync();
            return Ok(item);
        }
    }
}
