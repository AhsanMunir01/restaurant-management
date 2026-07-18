namespace RMS.Api.Models
{
    public class InventoryItem
    {
        public int Id { get; set; }
        public string ItemName { get; set; } = string.Empty;
        public decimal Quantity { get; set; }
        public string Unit { get; set; } = "kg"; // kg, liters, pcs, packs
        public decimal ReorderLevel { get; set; }
    }
}
