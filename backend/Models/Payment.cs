using System;

namespace RMS.Api.Models
{
    public class Payment
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public Order? Order { get; set; }
        
        public int CashierId { get; set; }
        public User? Cashier { get; set; }
        
        public decimal Amount { get; set; }
        public string PaymentMethod { get; set; } = "card"; // cash, card, wallet
        public string Status { get; set; } = "pending"; // pending, completed
        public DateTime PaidAt { get; set; } = DateTime.UtcNow;
    }
}
