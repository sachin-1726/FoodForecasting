using FoodForecastingAPI.Data;
using FoodForecastingAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FoodForecastingAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SurplusFoodsController : ControllerBase
    {
        private readonly FoodForecastingDbContext _context;

        public SurplusFoodsController(
            FoodForecastingDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SurplusFood>>> GetSurplusFoods()
        {
            return await _context.SurplusFoods
                .OrderByDescending(s => s.SurplusDate)
                .ToListAsync();
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<SurplusFood>> GetSurplusFood(
            int id)
        {
            var surplusFood =
                await _context.SurplusFoods.FindAsync(id);

            if (surplusFood == null)
            {
                return NotFound();
            }

            return surplusFood;
        }

        [HttpPost]
        public async Task<ActionResult<SurplusFood>> CreateSurplusFood(
            SurplusFood surplusFood)
        {
            if (surplusFood.SurplusDate == default)
            {
                return BadRequest(
                    "Surplus date is required."
                );
            }

            if (string.IsNullOrWhiteSpace(
                surplusFood.MealName))
            {
                return BadRequest(
                    "Meal name is required."
                );
            }

            if (string.IsNullOrWhiteSpace(
                surplusFood.MealType))
            {
                return BadRequest(
                    "Meal type is required."
                );
            }

            if (surplusFood.ProducedQuantity <= 0)
            {
                return BadRequest(
                    "Produced quantity must be greater than 0."
                );
            }

            if (surplusFood.ConsumedQuantity < 0)
            {
                return BadRequest(
                    "Consumed quantity cannot be negative."
                );
            }

            if (
                surplusFood.ConsumedQuantity >
                surplusFood.ProducedQuantity
            )
            {
                return BadRequest(
                    "Consumed quantity cannot be greater than produced quantity."
                );
            }

            surplusFood.SurplusQuantity =
                surplusFood.ProducedQuantity -
                surplusFood.ConsumedQuantity;

            if (surplusFood.SurplusQuantity <= 0)
            {
                surplusFood.SurplusQuantity = 0;
                surplusFood.Status = "No Surplus";
            }
            else
            {
                surplusFood.Status = "Available";
            }

            _context.SurplusFoods.Add(surplusFood);

            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetSurplusFood),
                new { id = surplusFood.Id },
                surplusFood
            );
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteSurplusFood(
            int id)
        {
            var surplusFood =
                await _context.SurplusFoods.FindAsync(id);

            if (surplusFood == null)
            {
                return NotFound();
            }

            _context.SurplusFoods.Remove(surplusFood);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}