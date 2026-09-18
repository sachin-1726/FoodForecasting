namespace FoodForecastingAPI.Models
{
    public class Consumption
    {
        public int Id { get; set; }

        public DateTime ConsumptionDate { get; set; }

        public string MealType { get; set; } = "";

        public string MealName { get; set; } = "";

        public int QuantityConsumed { get; set; }

        public string Status { get; set; } = "Consumed";
    }
}