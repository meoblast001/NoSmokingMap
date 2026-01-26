namespace NoSmokingMap.Settings;

public class OverpassSettings
{
    public required string BaseUri { get; set; }
    public required string SearchAreaReference { get; set; }
    public required int GeolocationMaxDistanceMeters { get; set; }
    public required string CacheFilePath { get; set; }
    public required int CacheValidityMinutes { get; set; }
}
