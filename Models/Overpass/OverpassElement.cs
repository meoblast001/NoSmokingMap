using System.Text.Json.Serialization;

namespace NoSmokingMap.Models.Overpass;

public class OverpassElement
{
    [JsonRequired]
    public required long Id { get; set; }

    [JsonRequired]
    public required string Type { get; set; }

    public class OverpassTags
    {
        public string? Name { get; set; }

        public OverpassSmoking? Smoking { get; set; }

        [JsonPropertyName("addr:street")]
        public string Street { get; set; } = string.Empty;

        [JsonPropertyName("addr:housenumber")]
        public string Housenumber { get; set; } = string.Empty;
    }

    [JsonRequired]
    public required OverpassTags Tags { get; set; }

    public float? Lat { get; set; }

    public float? Lon { get; set; }

    public class OverpassBounds
    {
        public float Minlat { get; set; }
        public float Minlon { get; set; }
        public float Maxlat { get; set; }
        public float Maxlon { get; set; }
    }

    public OverpassBounds? Bounds { get; set; }

    public (float lat, float lon)? GetLocation()
    {
        if (Lat.HasValue && Lon.HasValue)
        {
            return (Lat.Value, Lon.Value);
        }
        else if (Bounds != null)
        {
            var lat = Bounds.Minlat + (Bounds.Maxlat - Bounds.Minlat) / 2f;
            var lon = Bounds.Minlon + (Bounds.Maxlon - Bounds.Minlon) / 2f;
            return (lat, lon);
        }
        else
            return null;
    }
}