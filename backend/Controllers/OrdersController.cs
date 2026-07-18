using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RMS.Api.Data;
using RMS.Api.DTOs;
using RMS.Api.Models;

namespace RMS.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrdersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var orders = await _context.Orders
                .Include(o => o.Table)
                .Include(o => o.Waiter)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.MenuItem)
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync();

            return Ok(orders);
        }

        [HttpGet("kitchen")]
        [Authorize(Roles = "admin,manager,chef")]
        public async Task<IActionResult> GetKitchenQueue()
        {
            var orders = await _context.Orders
                .Include(o => o.Table)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.MenuItem)
                .Where(o => o.Status == "pending" || o.Status == "cooking" || o.Status == "ready")
                .OrderBy(o => o.CreatedAt)
                .ToListAsync();

            return Ok(orders);
        }

        [HttpPost]
        [Authorize(Roles = "admin,manager,waiter")]
        public async Task<IActionResult> Create([FromBody] OrderCreateDto dto)
        {
            var table = await _context.Tables.FindAsync(dto.TableId);
            if (table == null) return NotFound(new { message = "Table not found" });

            var waiterIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (waiterIdClaim == null) return Unauthorized();
            var waiterId = int.Parse(waiterIdClaim.Value);

            var order = new Order
            {
                TableId = dto.TableId,
                WaiterId = waiterId,
                Status = "pending",
                CreatedAt = DateTime.UtcNow,
                TotalAmount = 0
            };

            decimal total = 0;

            foreach (var itemDto in dto.Items)
            {
                var menuItem = await _context.MenuItems.FindAsync(itemDto.MenuItemId);
                if (menuItem == null) return NotFound(new { message = $"Menu item {itemDto.MenuItemId} not found" });

                var orderItem = new OrderItem
                {
                    MenuItemId = itemDto.MenuItemId,
                    Quantity = itemDto.Quantity,
                    Notes = itemDto.Notes
                };

                order.OrderItems.Add(orderItem);
                total += menuItem.Price * itemDto.Quantity;
            }

            order.TotalAmount = total;
            _context.Orders.Add(order);

            // Automatically update table status to occupied when order is placed
            table.Status = "occupied";

            await _context.SaveChangesAsync();

            return Ok(order);
        }

        [HttpPut("{id}/status")]
        [Authorize(Roles = "admin,manager,chef,waiter")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] string status)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound(new { message = "Order not found" });

            order.Status = status;
            await _context.SaveChangesAsync();
            return Ok(order);
        }
    }
}
