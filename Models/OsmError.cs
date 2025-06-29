namespace NoSmokingMap.Models;

public class OsmError
{
    public required string Type { get; set; }
    public required string Message { get; set; }

    public static OsmError ErrorUnauthorized => new OsmError { Type = "unauthorized", Message = "Must login" };
    public static OsmError ErrorParameterFormat(string parameterName) =>
        new OsmError { Type = "parameter-format", Message = $"Parameter format wrong [{parameterName}]" };
    public static OsmError ErrorOsmApi(string subMessage) =>
        new OsmError { Type = "osm-api", Message = $"OSM error :: {subMessage}" };
}
