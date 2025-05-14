using NoSmokingMap.Models.Overpass;

namespace NoSmokingMap.Models;

public class LocationViewModel
{
    public long Id { get; private set; }

    public string Name { get; private set; } = string.Empty;

    public double Lat { get; private set; }

    public double Lon { get; private set; }

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
            Name = element.Tags.Name,
            Lat = location.Value.Latitude,
            Lon = location.Value.Longitude,
            Smoking = element.Tags.Smoking?.ToString()
        };
    }
}