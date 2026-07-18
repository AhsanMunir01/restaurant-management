using System;
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
    public class PaymentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PaymentsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var payments = await _context.Payments
                .Include(p => p.Order)
                .Include(p => p.Cashier)
                .ToListAsync();

            return Ok(payments);
        }

        [HttpPost]
        [Authorize(Roles = "admin,manager,cashier")]
        public async Task<IActionResult> Create([FromBody] PaymentCreateDto dto)
        {
            var order = await _context.Orders.FindAsync(dto.OrderId);
            if (order == null) return NotFound(new { message = "Order not found" });

            if (order.Status == "paid")
            {
                return BadRequest(new { message = "Order is already paid" });
            }

            var cashierIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (cashierIdClaim == null) return Unauthorized();
            var cashierId = int.Parse(cashierIdClaim.Value);

            var payment = new Payment
            {
                OrderId = dto.OrderId,
                CashierId = cashierId,
                Amount = order.TotalAmount,
                PaymentMethod = dto.PaymentMethod,
                Status = "completed",
                PaidAt = DateTime.UtcNow
            };

            _context.Payments.Add(payment);

            // Update order status to paid
            order.Status = "paid";

            // Mark table as dirty (requires cleaning before next seating)
            var table = await _context.Tables.FindAsync(order.TableId);
            if (table != null)
            {
                table.Status = "dirty";
            }

            await _context.SaveChangesAsync();

            return Ok(payment);
        }
    }
}
