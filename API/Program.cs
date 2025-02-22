using API.Extensions;
using Azure.Identity;

var builder = WebApplication.CreateBuilder(args);

// Keep only the console logger provider
builder.Logging.ClearProviders().AddConsole();

//ILogger logger = builder.Services.BuildServiceProvider().GetRequiredService<ILogger<Program>>();

// Add services to the container.
builder.Configuration.AddKeyVaultToApp(builder.Environment.IsDevelopment());
builder.Services.AddApplicationServices(builder.Configuration, ((IWebHostEnvironment)builder.Environment));
builder.Services.AddIdentityServices(builder.Configuration);

var app = builder.Build();

app.UseCors("AllowSpecificOrigins");

app.UseAuthentication();
app.UseAuthorization();

// Configure the HTTP request pipeline.
app.MapControllers();

app.Run();
