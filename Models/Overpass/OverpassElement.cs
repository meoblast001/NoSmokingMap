using System.Text.Json.Serialization;
using MessagePack;

namespace NoSmokingMap.Models.Overpass;

[MessagePackObject]
public class OverpassElement
{
    [JsonRequired]
    [Key("id")]
    public required long Id { get; set; }

    [JsonRequired]
    [Key("type")]
    public required OverpassElementType Type { get; set; }

    [MessagePackObject]
    public class OverpassTags
    {
        [Key("name")]
        public string? Name { get; set; }

        [Key("smoking")]
        public OverpassSmoking? Smoking { get; set; }

        [JsonPropertyName("addr:street")]
        [Key("addr:street")]
        public string Street { get; set; } = string.Empty;

        [JsonPropertyName("addr:housenumber")]
        [Key("addr:housenumber")]
        public string Housenumber { get; set; } = string.Empty;
    }

    [JsonRequired]
    [Key("tags")]
    public required OverpassTags Tags { get; set; }

    [Key("lat")]
    public float? Lat { get; set; }

    [Key("lon")]
    public float? Lon { get; set; }

    [MessagePackObject]
    public class OverpassBounds
    {
        [Key("minlat")]
        public float Minlat { get; set; }
        [Key("minlon")]
        public float Minlon { get; set; }
        [Key("maxlat")]
        public float Maxlat { get; set; }
        [Key("maxlon")]
        public float Maxlon { get; set; }
    }

    [Key("bounds")]
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
