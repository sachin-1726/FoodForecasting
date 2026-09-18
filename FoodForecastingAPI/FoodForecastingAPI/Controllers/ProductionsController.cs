using FoodForecastingAPI.Data;
using FoodForecastingAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FoodForecastingAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductionsController : ControllerBase
    {
        private readonly FoodForecastingDbContext _context;

        public ProductionsController(
            FoodForecastingDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Production>>> GetProductions()
        {
            return await _context.Productions
                .OrderByDescending(p => p.ProductionDate)
                .ToListAsync();
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<Production>> GetProduction(
            int id)
        {
            var production =
                await _context.Productions.FindAsync(id);

            if (production == null)
            {
                return NotFound();
            }

            return production;
        }

        [HttpPost]
        public async Task<ActionResult<Production>> CreateProduction(
            Production production)
        {
            if (production.ProductionDate == default)
            {
                return BadRequest(
                    "Production date is required."
                );
            }

            if (string.IsNullOrWhiteSpace(
                production.MealType))
            {
                return BadRequest(
                    "Meal type is required."
                );
            }

            if (string.IsNullOrWhiteSpace(
                production.MealName))
            {
                return BadRequest(
                    "Meal name is required."
                );
            }

            if (production.QuantityProduced <= 0)
            {
                return BadRequest(
                    "Quantity produced must be greater than 0."
                );
            }

            _context.Productions.Add(production);

            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetProduction),
                new { id = production.Id },
                production
            );
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteProduction(
            int id)
        {
            var production =
                await _context.Productions.FindAsync(id);

            if (production == null)
            {
                return NotFound();
            }

            _context.Productions.Remove(
                production
            );

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}