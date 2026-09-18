using FoodForecastingAPI.Data;
using FoodForecastingAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FoodForecastingAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ConsumptionsController : ControllerBase
    {
        private readonly FoodForecastingDbContext _context;

        public ConsumptionsController(
            FoodForecastingDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Consumption>>> GetConsumptions()
        {
            return await _context.Consumptions
                .OrderByDescending(c => c.ConsumptionDate)
                .ToListAsync();
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<Consumption>> GetConsumption(
            int id)
        {
            var consumption =
                await _context.Consumptions.FindAsync(id);

            if (consumption == null)
            {
                return NotFound();
            }

            return consumption;
        }

        [HttpPost]
        public async Task<ActionResult<Consumption>> CreateConsumption(
            Consumption consumption)
        {
            if (consumption.QuantityConsumed <= 0)
            {
                return BadRequest(
                    "Quantity consumed must be greater than 0."
                );
            }

            if (string.IsNullOrWhiteSpace(consumption.MealName))
            {
                return BadRequest(
                    "Meal name is required."
                );
            }

            if (string.IsNullOrWhiteSpace(consumption.MealType))
            {
                return BadRequest(
                    "Meal type is required."
                );
            }

            if (consumption.ConsumptionDate == default)
            {
                return BadRequest(
                    "Consumption date is required."
                );
            }

            var production = await _context.Productions
                .Where(p =>
                    p.ProductionDate.Date ==
                    consumption.ConsumptionDate.Date &&
                    p.MealType == consumption.MealType &&
                    p.MealName == consumption.MealName)
                .OrderByDescending(p => p.Id)
                .FirstOrDefaultAsync();

            if (production == null)
            {
                return BadRequest(
                    "No production record found for this date, meal type and meal name."
                );
            }

            var alreadyConsumed = await _context.Consumptions
                .Where(c =>
                    c.ConsumptionDate.Date ==
                    consumption.ConsumptionDate.Date &&
                    c.MealType == consumption.MealType &&
                    c.MealName == consumption.MealName)
                .SumAsync(c => (int?)c.QuantityConsumed) ?? 0;

            var remainingQuantity =
                production.QuantityProduced -
                alreadyConsumed;

            if (consumption.QuantityConsumed >
                remainingQuantity)
            {
                return BadRequest(
                    $"Consumption quantity cannot exceed remaining production quantity ({remainingQuantity})."
                );
            }

            _context.Consumptions.Add(consumption);

            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetConsumption),
                new { id = consumption.Id },
                consumption
            );
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteConsumption(
            int id)
        {
            var consumption =
                await _context.Consumptions.FindAsync(id);

            if (consumption == null)
            {
                return NotFound();
            }

            _context.Consumptions.Remove(consumption);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}