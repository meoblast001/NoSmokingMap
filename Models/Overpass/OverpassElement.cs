using System.Text.Json.Serialization;

namespace NoSmokingMap.Models.Overpass;

public class OverpassElement
{
    [JsonRequired]
    public required string Type { get; set; }

    [JsonRequired]
    public required Dictionary<string, string> Tags { get; set; }

    public bool TryGetTag(string tagName, out string tagValue)
    {
        tagValue = string.Empty;
        return Tags != null && Tags.TryGetValue(tagName, out tagValue);
    }
}