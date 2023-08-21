using API.Data;
using API.Interfaces;
using API.Services;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
        {
            //string sqlConnectionString = config.GetConnectionString("DatingApp:SqlDb");
            string sqlConnectionString = config["ConnectionStrings:DatingApp:SqlDb"];

            services.AddDbContext<DataContext>(opt =>
            {
                /*
                Replace SQLite integration in favor of SQLServer instance in Azure
                opt.UseSqlite(config.GetConnectionString("DefaultConnection")); 
                */
                opt.UseSqlServer(sqlConnectionString, opt => opt.EnableRetryOnFailure());
            });
            

            services.AddCors();
            services.AddScoped<ITokenService, TokenService>();

            return services;
        }
    }
}
