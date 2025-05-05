using Microsoft.Extensions.Options;
using NoSmokingMap.Models;
using NoSmokingMap.Services;
using NoSmokingMap.Settings;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

builder.Services.Configure<OAuthSettings>(builder.Configuration.GetSection("OAuthSettings"));
builder.Services.AddSingleton(sp => sp.GetRequiredService<IOptions<OAuthSettings>>().Value);
builder.Services.Configure<OsmApiSettings>(builder.Configuration.GetSection("OsmApiSettings"));
builder.Services.AddSingleton(sp => sp.GetRequiredService<IOptions<OsmApiSettings>>().Value);

builder.Services.AddSingleton<OsmAuthService>();
builder.Services.AddSingleton<OsmApiService>();

builder.Services.AddSingleton<OverpassModel>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseRouting();

app.UseAuthorization();

app.MapStaticAssets();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}")
    .WithStaticAssets();


app.Run();
