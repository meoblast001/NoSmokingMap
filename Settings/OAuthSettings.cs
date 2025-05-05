namespace NoSmokingMap.Settings;

public class OAuthSettings
{
    public required string BaseUri { get; set; }
    public required string AuthorizeEndpoint { get; set; }
    public required string AccessTokenEndpoint { get; set; }
    public required string ClientId { get; set; }
    public required string ClientSecret { get; set; }
    public required string RedirectUri { get; set; }
}