namespace NoSmokingMap.Models;

public struct Geocoordinates
{
    public double Latitude { get; set; }
    public double Longitude { get; set; }

    public Geocoordinates(double lat, double lon)
    {
        Latitude = lat;
        Longitude = lon;
    }

    public double MeterDistance(Geocoordinates other)
    {
        // Haversine Distance.

        const double EarthRadiusMeters = 6371.0 * 1000.0;
        const double Deg2Rad = Math.PI / 180.0;

        var dLat = (other.Latitude - Latitude) * Deg2Rad;
        var dLon = (other.Longitude - Longitude) * Deg2Rad;

        var a = Math.Pow(Math.Sin(dLat / 2.0), 2.0)
            + Math.Cos(Latitude * Deg2Rad)
            * Math.Cos(other.Latitude * Deg2Rad)
            * Math.Pow(Math.Sin(dLon / 2.0), 2.0);
        var c = 2.0 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1.0 - a));

        return EarthRadiusMeters * c;
    }
}
