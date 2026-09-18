namespace FoodForecastingAPI.Models
{
    public class Demand
    {
        public int Id { get; set; }

        public DateTime DemandDate { get; set; }

        public string MealType { get; set; } = "";

        public int ExpectedPeople { get; set; }
    }
}