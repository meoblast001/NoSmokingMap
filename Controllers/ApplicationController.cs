using System.Net.Mime;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc;
using NoSmokingMap.Settings;

namespace NoSmokingMap.Controllers;

[ApiController]
[Route("[controller]")]
[Produces(MediaTypeNames.Application.Json)]
public class ApplicationController : Controller
{
    private class ManifestIconData
    {
        [JsonPropertyName("src")]
        public required string Src { get; set; }

        [JsonPropertyName("sizes")]
        public required string Sizes { get; set; }

        [JsonPropertyName("type")]
        public required string Type { get; set; }
    }

    private class ManifestData
    {
        [JsonPropertyName("short_name")]
        public required string ShortName { get; set; }

        [JsonPropertyName("name")]
        public required string Name { get; set; }

        [JsonPropertyName("icons")]
        public required ManifestIconData[] Icons { get; set; }

        [JsonPropertyName("start_url")]
        public required string StartUrl { get; set; }

        [JsonPropertyName("display")]
        public required string Display { get; set; }

        [JsonPropertyName("theme_color")]
        public required string ThemeColor { get; set; }

        [JsonPropertyName("background_color")]
        public required string BackgroundColor { get; set; }
    }

    private readonly MapSettings mapSettings;

    public ApplicationController(MapSettings mapSettings)
    {
        this.mapSettings = mapSettings;
    }

    [Route("manifest.webmanifest")]
    public IActionResult Manifest()
    {
        var manifestData = new ManifestData()
        {
            ShortName = mapSettings.ApplicationTitle,
            Name = mapSettings.ApplicationTitle,
            Icons = [
                new ManifestIconData()
                {
                    Src = "/favicon-192x192.png",
                    Sizes = "192x192",
                    Type = "image/png"
                },
                new ManifestIconData()
                {
                    Src = "/favicon-96x96.png",
                    Sizes = "96x96",
                    Type = "image/png"
                }
            ],
            StartUrl = "/",
            Display = "standalone",
            ThemeColor = "#000000",
            BackgroundColor = "#ffffff"
        };
        Response.ContentType = "application/manifest+json";
        return Json(manifestData);
    }
}
