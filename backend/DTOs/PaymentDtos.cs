namespace RMS.Api.DTOs
{
    public class PaymentCreateDto
    {
        public int OrderId { get; set; }
        public string PaymentMethod { get; set; } = "card"; // cash, card, wallet
    }
}
