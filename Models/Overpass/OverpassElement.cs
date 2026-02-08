using System.Text.Json.Serialization;
using MessagePack;

namespace NoSmokingMap.Models.Overpass;

[MessagePackObject]
public class OverpassElement
{
    [JsonRequired]
    [Key(0)]
    public required long Id { get; set; }

    [JsonRequired]
    [Key(1)]
    public required OverpassElementType Type { get; set; }

    [MessagePackObject]
    public class OverpassTags
    {
        [Key(0)]
        public string? Name { get; set; }

        [Key(1)]
        public OverpassSmoking? Smoking { get; set; }

        [JsonPropertyName("addr:street")]
        [Key(2)]
        public string Street { get; set; } = string.Empty;

        [JsonPropertyName("addr:housenumber")]
        [Key(3)]
        public string Housenumber { get; set; } = string.Empty;
    }

    [JsonRequired]
    [Key(2)]
    public required OverpassTags Tags { get; set; }

    [Key(3)]
    public float? Lat { get; set; }

    [Key(4)]
    public float? Lon { get; set; }

    [MessagePackObject]
    public class OverpassBounds
    {
        [Key(0)]
        public float Minlat { get; set; }
        [Key(1)]
        public float Minlon { get; set; }
        [Key(2)]
        public float Maxlat { get; set; }
        [Key(3)]
        public float Maxlon { get; set; }
    }

    [Key(5)]
    public OverpassBounds? Bounds { get; set; }

    public Geocoordinates? GetLocation()
    {
        if (Lat.HasValue && Lon.HasValue)
        {
            return new Geocoordinates(Lat.Value, Lon.Value);
        }
        else if (Bounds != null)
        {
            var lat = Bounds.Minlat + (Bounds.Maxlat - Bounds.Minlat) / 2f;
            var lon = Bounds.Minlon + (Bounds.Maxlon - Bounds.Minlon) / 2f;
            return new Geocoordinates(lat, lon);
        }
        else
            return null;
    }
}
