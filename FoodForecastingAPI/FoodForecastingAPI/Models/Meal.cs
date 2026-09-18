namespace FoodForecastingAPI.Models
{
    public class Meal
    {
        public int Id { get; set; }

        public string MealName { get; set; } = "";

        public string MealType { get; set; } = "";

        public int Quantity { get; set; }

        public string Status { get; set; } = "Available";
    }
}