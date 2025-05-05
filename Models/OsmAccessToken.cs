using System.Text.Json.Serialization;

namespace NoSmokingMap.Models;

public class OsmAccessToken
{
    [JsonRequired, JsonPropertyName("access_token")]
    public required string AccessToken { get; set; }

    [JsonRequired, JsonPropertyName("token_type")]
    public required string TokenType { get; set; }

    [JsonRequired, JsonPropertyName("created_at")]
    public required int CreatedAt { get; set; }
}