using NoSmokingMap.Models.Overpass;
using OsmSharp;

namespace NoSmokingMap.Models;

public class LocationViewModel
{
    public long Id { get; private set; }

    public string Type { get; private set; } = string.Empty;

    public string Name { get; private set; } = string.Empty;

    public double? Lat { get; private set; }

    public double? Lon { get; private set; }

    public string? Smoking { get; private set; }

    public static LocationViewModel? TryCreate(OverpassElement element)
    {
        if (element.Tags.Name == null)
            return null;

        var location = element.GetLocation();
        if (!location.HasValue)
            return null;

        return new LocationViewModel()
        {
            Id = element.Id,
            Type = element.Type.ToString().ToLowerInvariant(),
            Name = element.Tags.Name,
            Lat = location.Value.Latitude,
            Lon = location.Value.Longitude,
            Smoking = element.Tags.Smoking?.ToString()
        };
    }

    /// <remark>
    /// Does not include geocoordinates in location.
    /// </remark>
    public static LocationViewModel? TryCreate(OsmGeo osmGeo)
    {
        if (!osmGeo.Id.HasValue)
            return null;

        if (!osmGeo.Tags.TryGetValue("name", out var name))
            return null;

        return new LocationViewModel()
        {
            Id = osmGeo.Id.Value,
            Type = osmGeo.Type.ToString().ToLowerInvariant(),
            Name = name,
            Smoking = osmGeo.Tags.TryGetValue("smoking", out var smoking) ? smoking : null
        };
    }
}
