namespace FoodForecastingAPI.Models
{
    public class Redistribution
    {
        public int Id { get; set; }

        public DateTime RedistributionDate { get; set; }

        public string MealName { get; set; } = "";

        public int Quantity { get; set; }

        public string Destination { get; set; } = "";

        public string ReceiverName { get; set; } = "";

        public string Status { get; set; } = "Distributed";
    }
}