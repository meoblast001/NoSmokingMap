namespace NoSmokingMap.Settings;

public class MapSettings
{
    public struct Coordinates
    {
        public required float X { get; set; }
        public required float Y { get; set; }
    }

    public required Coordinates Center { get; set; }
}
