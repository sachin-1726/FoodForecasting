using FoodForecastingAPI.Data;
using FoodForecastingAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FoodForecastingAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ForecastsController : ControllerBase
    {
        private readonly FoodForecastingDbContext _context;

        public ForecastsController(
            FoodForecastingDbContext context)
        {
            _context = context;
        }

        // GET: api/Forecasts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Demand>>> GetForecasts()
        {
            var forecasts = await _context.Demands
                .OrderByDescending(d => d.DemandDate)
                .ToListAsync();

            return forecasts;
        }

        // GET: api/Forecasts/generate?mealType=Breakfast
        [HttpGet("generate")]
        public async Task<ActionResult<ForecastResult>> GenerateForecast(
            [FromQuery] string mealType)
        {
            if (string.IsNullOrWhiteSpace(mealType))
            {
                return BadRequest(
                    "Meal type is required."
                );
            }

            var previousDemands = await _context.Demands
                .Where(d => d.MealType == mealType)
                .OrderByDescending(d => d.DemandDate)
                .Take(3)
                .ToListAsync();

            if (previousDemands.Count == 0)
            {
                return NotFound(
                    $"No previous demand data found for {mealType}."
                );
            }

            double averageDemand =
                previousDemands.Average(
                    d => d.ExpectedPeople
                );

            int forecastedPeople =
                (int)Math.Round(averageDemand);

            int recommendedProduction =
                (int)Math.Ceiling(
                    forecastedPeople * 1.05
                );

            var result = new ForecastResult
            {
                MealType = mealType,

                ForecastDate =
                    DateTime.Today.AddDays(1),

                PreviousRecordCount =
                    previousDemands.Count,

                AverageDemand =
                    Math.Round(averageDemand, 2),

                ForecastedPeople =
                    forecastedPeople,

                RecommendedProduction =
                    recommendedProduction,

                Message =
                    $"Forecast generated using the latest " +
                    $"{previousDemands.Count} demand records."
            };

            return Ok(result);
        }

        // GET: api/Forecasts/5
        [HttpGet("{id:int}")]
        public async Task<ActionResult<Demand>> GetForecast(
            int id)
        {
            var forecast =
                await _context.Demands.FindAsync(id);

            if (forecast == null)
            {
                return NotFound();
            }

            return forecast;
        }

        // POST: api/Forecasts
        [HttpPost]
        public async Task<ActionResult<Demand>> CreateForecast(
            Demand demand)
        {
            if (demand.ExpectedPeople <= 0)
            {
                return BadRequest(
                    "Expected people must be greater than 0."
                );
            }

            if (string.IsNullOrWhiteSpace(demand.MealType))
            {
                return BadRequest(
                    "Meal type is required."
                );
            }

            if (demand.DemandDate == default)
            {
                return BadRequest(
                    "Demand date is required."
                );
            }

            _context.Demands.Add(demand);

            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetForecast),
                new
                {
                    id = demand.Id
                },
                demand
            );
        }

        // DELETE: api/Forecasts/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteForecast(
            int id)
        {
            var forecast =
                await _context.Demands.FindAsync(id);

            if (forecast == null)
            {
                return NotFound();
            }

            _context.Demands.Remove(forecast);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}