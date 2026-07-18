using Microsoft.EntityFrameworkCore;
using RMS.Api.Models;
using BCrypt.Net;

namespace RMS.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Table> Tables { get; set; } = null!;
        public DbSet<MenuItem> MenuItems { get; set; } = null!;
        public DbSet<Order> Orders { get; set; } = null!;
        public DbSet<OrderItem> OrderItems { get; set; } = null!;
        public DbSet<Payment> Payments { get; set; } = null!;
        public DbSet<InventoryItem> InventoryItems { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure decimal precision
            modelBuilder.Entity<MenuItem>()
                .Property(m => m.Price)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Order>()
                .Property(o => o.TotalAmount)
                .HasPrecision(18, 2);

            modelBuilder.Entity<Payment>()
                .Property(p => p.Amount)
                .HasPrecision(18, 2);

            modelBuilder.Entity<InventoryItem>()
                .Property(i => i.Quantity)
                .HasPrecision(18, 2);

            modelBuilder.Entity<InventoryItem>()
                .Property(i => i.ReorderLevel)
                .HasPrecision(18, 2);

            // Seed Users with hashed passwords
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    Username = "admin",
                    Email = "admin@rms.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
                    Role = "admin",
                    FullName = "System Admin"
                },
                new User
                {
                    Id = 2,
                    Username = "manager",
                    Email = "manager@rms.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("manager123"),
                    Role = "manager",
                    FullName = "Sarah Connor (Manager)"
                },
                new User
                {
                    Id = 3,
                    Username = "chef",
                    Email = "chef@rms.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("chef123"),
                    Role = "chef",
                    FullName = "Chef Gordon (Kitchen Head)"
                },
                new User
                {
                    Id = 4,
                    Username = "waiter",
                    Email = "waiter@rms.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("waiter123"),
                    Role = "waiter",
                    FullName = "John Doe (Waiter)"
                },
                new User
                {
                    Id = 5,
                    Username = "cashier",
                    Email = "cashier@rms.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("cashier123"),
                    Role = "cashier",
                    FullName = "Jane Smith (Cashier)"
                }
            );

            // Seed Tables
            modelBuilder.Entity<Table>().HasData(
                new Table { Id = 1, TableNumber = "T-01", Capacity = 4, Status = "occupied" },
                new Table { Id = 2, TableNumber = "T-02", Capacity = 2, Status = "idle" },
                new Table { Id = 3, TableNumber = "T-03", Capacity = 6, Status = "idle" },
                new Table { Id = 4, TableNumber = "T-04", Capacity = 4, Status = "occupied" },
                new Table { Id = 5, TableNumber = "T-05", Capacity = 2, Status = "dirty" },
                new Table { Id = 6, TableNumber = "T-06", Capacity = 8, Status = "reserved" },
                new Table { Id = 7, TableNumber = "T-07", Capacity = 4, Status = "occupied" },
                new Table { Id = 8, TableNumber = "T-08", Capacity = 4, Status = "idle" },
                new Table { Id = 9, TableNumber = "T-09", Capacity = 2, Status = "idle" },
                new Table { Id = 10, TableNumber = "T-10", Capacity = 6, Status = "idle" },
                new Table { Id = 11, TableNumber = "T-11", Capacity = 4, Status = "idle" },
                new Table { Id = 12, TableNumber = "T-12", Capacity = 2, Status = "occupied" },
                new Table { Id = 13, TableNumber = "T-13", Capacity = 6, Status = "idle" },
                new Table { Id = 14, TableNumber = "T-14", Capacity = 4, Status = "idle" },
                new Table { Id = 15, TableNumber = "T-15", Capacity = 8, Status = "idle" }
            );

            // Seed MenuItems
            modelBuilder.Entity<MenuItem>().HasData(
                new MenuItem
                {
                    Id = 1,
                    Name = "Ribeye Steak with Garlic Butter",
                    Description = "Prime ribeye grilled to perfection, basted with homemade garlic butter and served with roasted baby potatoes.",
                    Price = 32.00m,
                    Category = "Main",
                    ImageUrl = "",
                    IsAvailable = true
                },
                new MenuItem
                {
                    Id = 2,
                    Name = "Truffle Mushroom Risotto",
                    Description = "Creamy arborio rice loaded with wild forest mushrooms, fresh herbs, parmesan cheese, and drizzled with white truffle oil.",
                    Price = 22.00m,
                    Category = "Main",
                    ImageUrl = "",
                    IsAvailable = true
                },
                new MenuItem
                {
                    Id = 3,
                    Name = "Signature Bistro Burger",
                    Description = "Angus beef patty with smoked cheddar, caramelized onions, heirloom tomato, and truffle aioli on a toasted brioche bun.",
                    Price = 18.00m,
                    Category = "Main",
                    ImageUrl = "",
                    IsAvailable = true
                },
                new MenuItem
                {
                    Id = 4,
                    Name = "Lava Cake with Vanilla Gelato",
                    Description = "Decadent dark chocolate cake with a molten liquid center, dusted with powdered sugar and served with premium vanilla bean gelato.",
                    Price = 10.00m,
                    Category = "Dessert",
                    ImageUrl = "",
                    IsAvailable = true
                },
                new MenuItem
                {
                    Id = 5,
                    Name = "Crispy Calamari",
                    Description = "Lightly battered, fried calamari rings served with house-made citrus-herb aioli and fresh lemon wedges.",
                    Price = 14.50m,
                    Category = "Appetizer",
                    ImageUrl = "",
                    IsAvailable = true
                },
                new MenuItem
                {
                    Id = 6,
                    Name = "Bistro Mocktail / Lemon Ginger Fizz",
                    Description = "Refreshing blend of fresh lemon juice, pressed ginger juice, elderflower syrup, and club soda over crushed ice.",
                    Price = 7.50m,
                    Category = "Drink",
                    ImageUrl = "",
                    IsAvailable = true
                }
            );

            // Seed InventoryItems
            modelBuilder.Entity<InventoryItem>().HasData(
                new InventoryItem { Id = 1, ItemName = "Prime Ribeye Beef Cut", Quantity = 25.50m, Unit = "kg", ReorderLevel = 10.00m },
                new InventoryItem { Id = 2, ItemName = "White Truffle Oil", Quantity = 5.00m, Unit = "liters", ReorderLevel = 2.00m },
                new InventoryItem { Id = 3, ItemName = "Arborio Rice", Quantity = 30.00m, Unit = "kg", ReorderLevel = 10.00m },
                new InventoryItem { Id = 4, ItemName = "Brioche Buns", Quantity = 120.00m, Unit = "pcs", ReorderLevel = 40.00m },
                new InventoryItem { Id = 5, ItemName = "Angus Ground Beef", Quantity = 40.00m, Unit = "kg", ReorderLevel = 15.00m },
                new InventoryItem { Id = 6, ItemName = "Belgian Dark Chocolate", Quantity = 15.00m, Unit = "kg", ReorderLevel = 5.00m },
                new InventoryItem { Id = 7, ItemName = "Vanilla Bean Gelato", Quantity = 12.00m, Unit = "liters", ReorderLevel = 4.00m },
                new InventoryItem { Id = 8, ItemName = "Calamari Rings", Quantity = 18.00m, Unit = "kg", ReorderLevel = 8.00m }
            );
        }
    }
}
