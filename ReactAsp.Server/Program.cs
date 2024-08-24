using IdentityCoreDapper.Factory;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using reactdotnet.Server.Models;
using System.Security.Claims;
using System.Text.Json;

namespace ReactAsp.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // DB connection
            var connectionString = builder.Configuration.GetConnectionString("ApplicationDbContextConnection") ?? throw new InvalidOperationException("Connection string 'ApplicationDbContextConnection' not found.");
            builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(connectionString));

            builder.Services.AddAuthorization();
            builder.Services.AddIdentityApiEndpoints<Users>()
                .AddEntityFrameworkStores<ApplicationDbContext>();

            // Add services to the container.
            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // override password rule
            builder.Services.Configure<IdentityOptions>(options =>
            {
                options.Password.RequireDigit = false;
                options.Password.RequireLowercase = false;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                options.Password.RequiredLength = 8;
                options.Password.RequiredUniqueChars = 0;
            });

            // Add Custom User field('Permissions') to ClaimsPrincipal
            builder.Services.AddScoped<IUserClaimsPrincipalFactory<Users>, AppClaimsPrincipalFactory>();

            var app = builder.Build();

            app.UseDefaultFiles();
            app.UseStaticFiles();
            // Add prefix 'api' to default endpoints 
            app.MapGroup("/api").MapIdentityApi<Users>();

            // logout
            app.MapPost("/api/logout", async (SignInManager<Users> signInManager) =>
            {
                await signInManager.SignOutAsync();
                return Results.Ok();

            }).RequireAuthorization();

            // endpoint for auth check
            app.MapGet("/api/profile", (ClaimsPrincipal user) =>
            {
                var email = user.FindFirstValue(ClaimTypes.Email); // get the user's email from the claim
                var permissions = JsonSerializer.Deserialize<List<string>>(user.FindFirst("Permissions").Value);
                return Results.Json(new { Email = email, permissions }); ; // return the email as a plain text response
            }).RequireAuthorization();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();

            app.MapControllers();

            app.MapFallbackToFile("/index.html");

            app.Run();
        }
    }
}
