using FoodForecastingAPI.Data;
using FoodForecastingAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FoodForecastingAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DemandsController : ControllerBase
    {
        private readonly FoodForecastingDbContext _context;

        public DemandsController(FoodForecastingDbContext context)
        {
            _context = context;
        }

        // GET: api/Demands
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Demand>>> GetDemands()
        {
            return await _context.Demands.ToListAsync();
        }

        // GET: api/Demands/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Demand>> GetDemand(int id)
        {
            var demand = await _context.Demands.FindAsync(id);

            if (demand == null)
            {
                return NotFound();
            }

            return demand;
        }

        // POST: api/Demands
        [HttpPost]
        public async Task<ActionResult<Demand>> CreateDemand(Demand demand)
        {
            _context.Demands.Add(demand);

            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetDemand),
                new { id = demand.Id },
                demand
            );
        }

        // PUT: api/Demands/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDemand(
            int id,
            Demand demand)
        {
            if (id != demand.Id)
            {
                return BadRequest();
            }

            _context.Entry(demand).State = EntityState.Modified;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Demands/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDemand(int id)
        {
            var demand = await _context.Demands.FindAsync(id);

            if (demand == null)
            {
                return NotFound();
            }

            _context.Demands.Remove(demand);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}