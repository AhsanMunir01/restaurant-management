namespace RMS.Api.Models
{
    public class OrderItem
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        
        [System.Text.Json.Serialization.JsonIgnore]
        public Order? Order { get; set; }
        
        public int MenuItemId { get; set; }
        public MenuItem? MenuItem { get; set; }
        
        public int Quantity { get; set; }
        public string Notes { get; set; } = string.Empty;
    }
}
