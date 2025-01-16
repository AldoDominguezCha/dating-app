using API.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddDbContext<DataContext>(options => {
    options.UseSqlite(builder.Configuration.GetSection("ConnectionStrings")["DefaultDBConnection"]);
});
// Register allowed origins for CORS
builder.Services.AddCors(options => {
    options.AddPolicy("AllowSpecificOrigins", policy =>
    {
        policy.WithOrigins(["http://localhost:4200", "https://localhost:4200"])  // Specify allowed origins
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors("AllowSpecificOrigins");

// Configure the HTTP request pipeline.
app.MapControllers();

app.Run();
