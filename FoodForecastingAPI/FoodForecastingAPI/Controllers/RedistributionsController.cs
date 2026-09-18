using FoodForecastingAPI.Data;
using FoodForecastingAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FoodForecastingAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RedistributionsController : ControllerBase
    {
        private readonly FoodForecastingDbContext _context;

        public RedistributionsController(
            FoodForecastingDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Redistribution>>> GetRedistributions()
        {
            return await _context.Redistributions
                .OrderByDescending(r => r.RedistributionDate)
                .ToListAsync();
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<Redistribution>> GetRedistribution(
            int id)
        {
            var redistribution =
                await _context.Redistributions.FindAsync(id);

            if (redistribution == null)
            {
                return NotFound();
            }

            return redistribution;
        }

        [HttpPost]
        public async Task<ActionResult<Redistribution>> CreateRedistribution(
            Redistribution redistribution)
        {
            if (redistribution.Quantity <= 0)
            {
                return BadRequest(
                    "Quantity must be greater than 0."
                );
            }

            if (string.IsNullOrWhiteSpace(
                redistribution.MealName))
            {
                return BadRequest(
                    "Meal name is required."
                );
            }

            if (string.IsNullOrWhiteSpace(
                redistribution.Destination))
            {
                return BadRequest(
                    "Destination is required."
                );
            }

            if (string.IsNullOrWhiteSpace(
                redistribution.ReceiverName))
            {
                return BadRequest(
                    "Receiver name is required."
                );
            }

            if (redistribution.RedistributionDate == default)
            {
                return BadRequest(
                    "Redistribution date is required."
                );
            }

            var totalSurplus =
                await _context.SurplusFoods
                    .Where(s =>
                        s.MealName == redistribution.MealName &&
                        s.Status == "Available")
                    .SumAsync(
                        s => (int?)s.SurplusQuantity
                    ) ?? 0;

            var alreadyRedistributed =
                await _context.Redistributions
                    .Where(r =>
                        r.MealName == redistribution.MealName &&
                        r.Status != "Cancelled")
                    .SumAsync(
                        r => (int?)r.Quantity
                    ) ?? 0;

            var remainingSurplus =
                totalSurplus -
                alreadyRedistributed;

            if (redistribution.Quantity >
                remainingSurplus)
            {
                return BadRequest(
                    $"Redistribution quantity cannot exceed available surplus. Remaining surplus: {remainingSurplus}."
                );
            }

            _context.Redistributions.Add(
                redistribution
            );

            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetRedistribution),
                new { id = redistribution.Id },
                redistribution
            );
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteRedistribution(
            int id)
        {
            var redistribution =
                await _context.Redistributions.FindAsync(id);

            if (redistribution == null)
            {
                return NotFound();
            }

            _context.Redistributions.Remove(
                redistribution
            );

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
} 