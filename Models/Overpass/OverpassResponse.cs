using System.Text.Json.Serialization;

namespace NoSmokingMap.Models.Overpass;

public class OverpassResponse
{
    [JsonRequired]
    public required OverpassElement[] Elements { get; set; }
}