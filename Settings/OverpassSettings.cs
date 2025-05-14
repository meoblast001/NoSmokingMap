namespace NoSmokingMap.Settings;

public class OverpassSettings
{
    public required string BaseUri { get; set; }
    public required string SearchAreaReference { get; set; }
    public required int GeolocationMaxDistanceMeters { get; set; }
}