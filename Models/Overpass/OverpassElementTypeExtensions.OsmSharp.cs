using OsmSharp;

namespace NoSmokingMap.Models.Overpass;

public static class OverpassElementTypeExtensions
{
    public static OsmGeoType ToOsmGeoType(this OverpassElementType elementType)
    {
        return elementType switch
        {
            OverpassElementType.Node => OsmGeoType.Node,
            OverpassElementType.Way => OsmGeoType.Way,
            OverpassElementType.Relation => OsmGeoType.Relation,
            _ => throw new ArgumentException("Unknown element type")
        };
    }
}
