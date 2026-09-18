namespace FoodForecastingAPI.Models
{
    public class Production
    {
        public int Id { get; set; }

        public DateTime ProductionDate { get; set; }

        public string MealType { get; set; } = "";

        public string MealName { get; set; } = "";

        public int QuantityProduced { get; set; }

        public string Status { get; set; } = "Produced";
    }
}