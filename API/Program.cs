using API.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddDbContext<DataContext>(opt =>
{
    opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});
builder.Services.AddCors();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseCors(opt => {
    string[] allowedOrigins = new string[] { @"https://localhost:54613" };
    opt.AllowAnyHeader().AllowAnyMethod().WithOrigins(allowedOrigins);
});
app.MapControllers();

app.Run();