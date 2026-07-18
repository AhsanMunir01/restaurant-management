namespace RMS.Api.Models
{
    public class Table
    {
        public int Id { get; set; }
        public string TableNumber { get; set; } = string.Empty;
        public int Capacity { get; set; }
        public string Status { get; set; } = "idle"; // idle, occupied, dirty, reserved
    }
}
