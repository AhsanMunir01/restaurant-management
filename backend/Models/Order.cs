using System;
using System.Collections.Generic;

namespace RMS.Api.Models
{
    public class Order
    {
        public int Id { get; set; }
        public int TableId { get; set; }
        public Table? Table { get; set; }
        
        public int WaiterId { get; set; }
        public User? Waiter { get; set; }
        
        public string Status { get; set; } = "pending"; // pending, cooking, ready, served, paid, cancelled
        public decimal TotalAmount { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public List<OrderItem> OrderItems { get; set; } = new();
    }
}
