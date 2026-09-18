namespace FoodForecastingAPI.Models
{
    public class SurplusFood
    {
        public int Id { get; set; }

        public DateTime SurplusDate { get; set; }

        public string MealType { get; set; } = "";

        public string MealName { get; set; } = "";

        public int ProducedQuantity { get; set; }

        public int ConsumedQuantity { get; set; }

        public int SurplusQuantity { get; set; }

        public string Status { get; set; } = "Available";
    }
}