using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FoodForecastingAPI.Migrations
{
    /// <inheritdoc />
    public partial class UpdateSurplusFood : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "QuantityProduced",
                table: "SurplusFoods",
                newName: "ProducedQuantity");

            migrationBuilder.RenameColumn(
                name: "QuantityConsumed",
                table: "SurplusFoods",
                newName: "ConsumedQuantity");

            migrationBuilder.RenameColumn(
                name: "Date",
                table: "SurplusFoods",
                newName: "SurplusDate");

            migrationBuilder.AddColumn<string>(
                name: "MealType",
                table: "SurplusFoods",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MealType",
                table: "SurplusFoods");

            migrationBuilder.RenameColumn(
                name: "SurplusDate",
                table: "SurplusFoods",
                newName: "Date");

            migrationBuilder.RenameColumn(
                name: "ProducedQuantity",
                table: "SurplusFoods",
                newName: "QuantityProduced");

            migrationBuilder.RenameColumn(
                name: "ConsumedQuantity",
                table: "SurplusFoods",
                newName: "QuantityConsumed");
        }
    }
}
