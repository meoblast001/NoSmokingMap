namespace NoSmokingMap.Services.OpenStreetMap;

public class OsmApiException : Exception
{
    public OsmApiException(string? message) : base(message)
    {
    }
}
