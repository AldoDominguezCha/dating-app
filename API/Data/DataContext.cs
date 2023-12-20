using API.Entities;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel;

namespace API.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        protected override void ConfigureConventions(ModelConfigurationBuilder builder)
        {
            builder.Properties<DateOnly>()
                .HaveConversion<DateOnlyConverter>()
                .HaveColumnType("date");
        }


        public DbSet<AppUser> Users { get; set; }
    }
}