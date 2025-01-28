using API.Data;
using API.Interfaces;
using API.Services;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config, IWebHostEnvironment appHost)
        {
            services.AddControllers();

            services.AddDbContext<DataContext>(options => {
                //options.UseSqlite(config.GetSection("ConnectionStrings")["DefaultDBConnection"]);
                options.UseSqlite($"Data Source={appHost.ContentRootPath}/dating.db");
            });
            // Register allowed origins for CORS
            services.AddCors(options => {
                options.AddPolicy("AllowSpecificOrigins", policy =>
                {
                    policy.WithOrigins(["http://localhost:4200", "https://localhost:4200"])  // Specify allowed origins
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                });
            });

            // Every request context will receive a new instance of the token service
            services.AddScoped<ITokenService, TokenService>();

            return services;
        }
    }
}
