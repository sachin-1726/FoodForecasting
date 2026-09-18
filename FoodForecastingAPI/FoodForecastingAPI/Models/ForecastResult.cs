namespace FoodForecastingAPI.Models
{
    public class ForecastResult
    {
        public string MealType { get; set; } = "";

        public DateTime ForecastDate { get; set; }

        public int PreviousRecordCount { get; set; }

        public double AverageDemand { get; set; }

        public int ForecastedPeople { get; set; }

        public int RecommendedProduction { get; set; }

        public string Message { get; set; } = "";
    }
}