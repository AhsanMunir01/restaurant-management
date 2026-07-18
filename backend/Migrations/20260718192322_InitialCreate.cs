using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "InventoryItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ItemName = table.Column<string>(type: "text", nullable: false),
                    Quantity = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    Unit = table.Column<string>(type: "text", nullable: false),
                    ReorderLevel = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InventoryItems", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MenuItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Price = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    Category = table.Column<string>(type: "text", nullable: false),
                    ImageUrl = table.Column<string>(type: "text", nullable: false),
                    IsAvailable = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MenuItems", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Tables",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TableNumber = table.Column<string>(type: "text", nullable: false),
                    Capacity = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tables", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Username = table.Column<string>(type: "text", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false),
                    PasswordHash = table.Column<string>(type: "text", nullable: false),
                    Role = table.Column<string>(type: "text", nullable: false),
                    FullName = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Orders",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TableId = table.Column<int>(type: "integer", nullable: false),
                    WaiterId = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    TotalAmount = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Orders", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Orders_Tables_TableId",
                        column: x => x.TableId,
                        principalTable: "Tables",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Orders_Users_WaiterId",
                        column: x => x.WaiterId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "OrderItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    OrderId = table.Column<int>(type: "integer", nullable: false),
                    MenuItemId = table.Column<int>(type: "integer", nullable: false),
                    Quantity = table.Column<int>(type: "integer", nullable: false),
                    Notes = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OrderItems_MenuItems_MenuItemId",
                        column: x => x.MenuItemId,
                        principalTable: "MenuItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OrderItems_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Payments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    OrderId = table.Column<int>(type: "integer", nullable: false),
                    CashierId = table.Column<int>(type: "integer", nullable: false),
                    Amount = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    PaymentMethod = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    PaidAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Payments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Payments_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Payments_Users_CashierId",
                        column: x => x.CashierId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "InventoryItems",
                columns: new[] { "Id", "ItemName", "Quantity", "ReorderLevel", "Unit" },
                values: new object[,]
                {
                    { 1, "Prime Ribeye Beef Cut", 25.50m, 10.00m, "kg" },
                    { 2, "White Truffle Oil", 5.00m, 2.00m, "liters" },
                    { 3, "Arborio Rice", 30.00m, 10.00m, "kg" },
                    { 4, "Brioche Buns", 120.00m, 40.00m, "pcs" },
                    { 5, "Angus Ground Beef", 40.00m, 15.00m, "kg" },
                    { 6, "Belgian Dark Chocolate", 15.00m, 5.00m, "kg" },
                    { 7, "Vanilla Bean Gelato", 12.00m, 4.00m, "liters" },
                    { 8, "Calamari Rings", 18.00m, 8.00m, "kg" }
                });

            migrationBuilder.InsertData(
                table: "MenuItems",
                columns: new[] { "Id", "Category", "Description", "ImageUrl", "IsAvailable", "Name", "Price" },
                values: new object[,]
                {
                    { 1, "Main", "Prime ribeye grilled to perfection, basted with homemade garlic butter and served with roasted baby potatoes.", "", true, "Ribeye Steak with Garlic Butter", 32.00m },
                    { 2, "Main", "Creamy arborio rice loaded with wild forest mushrooms, fresh herbs, parmesan cheese, and drizzled with white truffle oil.", "", true, "Truffle Mushroom Risotto", 22.00m },
                    { 3, "Main", "Angus beef patty with smoked cheddar, caramelized onions, heirloom tomato, and truffle aioli on a toasted brioche bun.", "", true, "Signature Bistro Burger", 18.00m },
                    { 4, "Dessert", "Decadent dark chocolate cake with a molten liquid center, dusted with powdered sugar and served with premium vanilla bean gelato.", "", true, "Lava Cake with Vanilla Gelato", 10.00m },
                    { 5, "Appetizer", "Lightly battered, fried calamari rings served with house-made citrus-herb aioli and fresh lemon wedges.", "", true, "Crispy Calamari", 14.50m },
                    { 6, "Drink", "Refreshing blend of fresh lemon juice, pressed ginger juice, elderflower syrup, and club soda over crushed ice.", "", true, "Bistro Mocktail / Lemon Ginger Fizz", 7.50m }
                });

            migrationBuilder.InsertData(
                table: "Tables",
                columns: new[] { "Id", "Capacity", "Status", "TableNumber" },
                values: new object[,]
                {
                    { 1, 4, "occupied", "T-01" },
                    { 2, 2, "idle", "T-02" },
                    { 3, 6, "idle", "T-03" },
                    { 4, 4, "occupied", "T-04" },
                    { 5, 2, "dirty", "T-05" },
                    { 6, 8, "reserved", "T-06" },
                    { 7, 4, "occupied", "T-07" },
                    { 8, 4, "idle", "T-08" },
                    { 9, 2, "idle", "T-09" },
                    { 10, 6, "idle", "T-10" },
                    { 11, 4, "idle", "T-11" },
                    { 12, 2, "occupied", "T-12" },
                    { 13, 6, "idle", "T-13" },
                    { 14, 4, "idle", "T-14" },
                    { 15, 8, "idle", "T-15" }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Email", "FullName", "PasswordHash", "Role", "Username" },
                values: new object[,]
                {
                    { 1, "admin@rms.com", "System Admin", "$2a$11$WJan.OEkaKtqj9Gd/C2hI.egmJavGTq/SD5IlqFp3Wa4z3ym1cj7a", "admin", "admin" },
                    { 2, "manager@rms.com", "Sarah Connor (Manager)", "$2a$11$BJvrMwAZgYbQbc5NIYUaOuX4B.uRjNH1yD852ddwkjEqzBa8t8AOe", "manager", "manager" },
                    { 3, "chef@rms.com", "Chef Gordon (Kitchen Head)", "$2a$11$/mNbghiXJFzIYSCPxaloSOAhX.txGljlRRm8nj8gCd/EXH5zR.5I.", "chef", "chef" },
                    { 4, "waiter@rms.com", "John Doe (Waiter)", "$2a$11$KjYrO.fwHaXh6MVLllAkDej6VbkuvVpmuv0Ry19ivJP8xLm0igjDa", "waiter", "waiter" },
                    { 5, "cashier@rms.com", "Jane Smith (Cashier)", "$2a$11$L64WC0j5E14q/re28Ky/b.InJjCX7a6JsqluqZMO/SwbWLty3sn2K", "cashier", "cashier" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_MenuItemId",
                table: "OrderItems",
                column: "MenuItemId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_OrderId",
                table: "OrderItems",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_TableId",
                table: "Orders",
                column: "TableId");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_WaiterId",
                table: "Orders",
                column: "WaiterId");

            migrationBuilder.CreateIndex(
                name: "IX_Payments_CashierId",
                table: "Payments",
                column: "CashierId");

            migrationBuilder.CreateIndex(
                name: "IX_Payments_OrderId",
                table: "Payments",
                column: "OrderId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "InventoryItems");

            migrationBuilder.DropTable(
                name: "OrderItems");

            migrationBuilder.DropTable(
                name: "Payments");

            migrationBuilder.DropTable(
                name: "MenuItems");

            migrationBuilder.DropTable(
                name: "Orders");

            migrationBuilder.DropTable(
                name: "Tables");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
