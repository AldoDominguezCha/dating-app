using API.Data;
using API.Extensions;
using API.Interfaces;
using API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseCors(opt => {
    string[] allowedOrigins = new string[] { @"https://localhost:4200" };
    opt.AllowAnyHeader().AllowAnyMethod().WithOrigins(allowedOrigins);
});
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();