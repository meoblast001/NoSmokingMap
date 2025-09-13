using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using NoSmokingMap.Models;
using NoSmokingMap.Models.Database;
using NoSmokingMap.Services;
using NoSmokingMap.Settings;
using Npgsql;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddAntiforgery(options => options.HeaderName = "X-CSRF-TOKEN");

// Add services to the container.
builder.Services.AddControllersWithViews()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter(JsonNamingPolicy.CamelCase));
    });

builder.Services.Configure<OAuthSettings>(builder.Configuration.GetSection("OAuthSettings"));
builder.Services.AddSingleton(sp => sp.GetRequiredService<IOptions<OAuthSettings>>().Value);
builder.Services.Configure<OsmSettings>(builder.Configuration.GetSection("OsmSettings"));
builder.Services.AddSingleton(sp => sp.GetRequiredService<IOptions<OsmSettings>>().Value);
builder.Services.Configure<OverpassSettings>(builder.Configuration.GetSection("OverpassSettings"));
builder.Services.AddSingleton(sp => sp.GetRequiredService<IOptions<OverpassSettings>>().Value);
builder.Services.Configure<MapSettings>(builder.Configuration.GetSection("MapSettings"));
builder.Services.AddSingleton(sp => sp.GetRequiredService<IOptions<MapSettings>>().Value);

builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    var dataSourceBuilder = new NpgsqlDataSourceBuilder(builder.Configuration.GetConnectionString("ApplicationDatabase"));
    dataSourceBuilder.EnableDynamicJson();
    var jsonSerializerOptions = new JsonSerializerOptions();
    jsonSerializerOptions.Converters.Add(new JsonStringEnumConverter(JsonNamingPolicy.CamelCase));
    dataSourceBuilder.ConfigureJsonOptions(jsonSerializerOptions);
    options.UseNpgsql(dataSourceBuilder.Build());
});

builder.Services.AddSingleton<OsmAuthService>();
builder.Services.AddSingleton<OsmApiService>();
builder.Services.AddSingleton<OverpassApiService>();
builder.Services.AddSingleton<ElementUpdateService>();

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

app.MapStaticAssets();

app.MapControllers();
app.MapControllerRoute(name: "spa-index", pattern: "", defaults: new { controller = "Spa", action = "Index" });
app.MapControllerRoute(name: "spa-catch-all",
    pattern: "{*path:regex(^(?!api/).+$)}",
    defaults: new { controller = "Spa", action = "Index" });

var endpointDataSource = app.Services.GetRequiredService<EndpointDataSource>();

app.Run();
