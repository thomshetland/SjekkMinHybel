using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var postgresConnectionString = builder.Configuration.GetConnectionString("PostgreSQLConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(postgresConnectionString));
builder.Services.AddDatabaseDeveloperPageExceptionFilter();


// IdentityRole
builder.Services.AddDefaultIdentity<ApplicationUser>(options => options.SignIn.RequireConfirmedAccount = true)
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>();
builder.Services.AddControllersWithViews();

// Add CORS services
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        builder => builder.WithOrigins("http://localhost:3000") // Adjust the URL to match your React app's URL
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials());
});

// Add Cookie to store User Auth

// Add Cookie to store User Auth
builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.HttpOnly = true;
    options.ExpireTimeSpan = TimeSpan.FromMinutes(60); // Set the cookie to expire in 60 minutes
    options.LoginPath = "/api/account/login"; // Your login path
    options.LogoutPath = "/api/account/logout"; // Your logout path
    options.SlidingExpiration = true; // Resets the expiration time if more than half the time has passed
    // More options can be set as needed
});

var app = builder.Build();

var logger = app.Services.GetRequiredService<ILogger<Program>>();

using (var services = app.Services.CreateScope())
{
    try
    {
        var db = services.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var um = services.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var rm = services.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        ApplicationDbInitializer.Initialize(db, um, rm).Wait(); // Again, consider using async/await here
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "An error occurred while initializing the database");
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseMigrationsEndPoint();
}
else
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

// Use CORS policy
app.UseCors("AllowReactApp");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");
app.MapRazorPages();

app.Run();