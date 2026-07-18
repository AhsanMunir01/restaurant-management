using System.Collections.Generic;

namespace RMS.Api.DTOs
{
    public class OrderItemCreateDto
    {
        public int MenuItemId { get; set; }
        public int Quantity { get; set; }
        public string Notes { get; set; } = string.Empty;
    }

    public class OrderCreateDto
    {
        public int TableId { get; set; }
        public List<OrderItemCreateDto> Items { get; set; } = new();
    }
}
