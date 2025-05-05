using NoSmokingMap.Models.Overpass;

namespace NoSmokingMap.Models;

public class LocationViewModel
{
    public string Name { get; private set; } = string.Empty;

    public float Lat { get; private set; }

    public float Lon { get; private set; }

    public static LocationViewModel? TryCreate(OverpassElement element)
    {
        if (element.Tags.Name == null)
            return null;    

        var location = element.GetLocation();
        if (!location.HasValue)
            return null;

        return new LocationViewModel()
        {
            Name = element.Tags.Name,
            Lat = location.Value.lat,
            Lon = location.Value.lon
        };
    }
}