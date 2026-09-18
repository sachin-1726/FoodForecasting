using Microsoft.EntityFrameworkCore;
using FoodForecastingAPI.Models;

namespace FoodForecastingAPI.Data
{
    public class FoodForecastingDbContext : DbContext
    {
        public FoodForecastingDbContext(
            DbContextOptions<FoodForecastingDbContext> options)
            : base(options)
        {
        }

        public DbSet<Meal> Meals { get; set; }

        public DbSet<Demand> Demands { get; set; }

        public DbSet<Production> Productions { get; set; }

        public DbSet<Consumption> Consumptions { get; set; }

        public DbSet<SurplusFood> SurplusFoods { get; set; }

        public DbSet<Redistribution> Redistributions { get; set; }
    }
}