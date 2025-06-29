using NoSmokingMap.Models.Overpass;

namespace NoSmokingMap.Models.Database;

public class PointOfInterestChangesDbo
{
    public required OverpassSmoking Smoking { get; set; }
}
