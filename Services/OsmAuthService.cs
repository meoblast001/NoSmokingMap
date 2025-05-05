using System.Text.Encodings.Web;
using System.Text.Json;
using NoSmokingMap.Models;
using NoSmokingMap.Settings;

namespace NoSmokingMap.Services;

public class OsmAuthService : IDisposable
{
    private const string AccessTokenCookieKey = "auth_token";
    private const string Scope = "read_prefs%20write_api";

    private readonly OAuthSettings oAuthSettings;
    private readonly HttpClient oAuthHttpClient;
    private readonly UrlEncoder urlEncoder;

    public OsmAuthService(OAuthSettings oAuthSettings)
    {
        this.oAuthSettings = oAuthSettings;

        oAuthHttpClient = new HttpClient()
        {
            BaseAddress = new Uri(oAuthSettings.BaseUri)
        };

        urlEncoder = UrlEncoder.Default;
    }

    public void Dispose()
    {
        oAuthHttpClient.Dispose();
    }

    public Uri GetRedirectLoginUrl()
    {
        var queryString = "?response_type=code"
            + $"&client_id={urlEncoder.Encode(oAuthSettings.ClientId)}"
            + $"&redirect_uri={urlEncoder.Encode(oAuthSettings.RedirectUri)}"
            + $"&scope={Scope}";
        return new Uri(new Uri(oAuthSettings.BaseUri), oAuthSettings.AuthorizeEndpoint + queryString);
    }

    public async Task<string?> RequestAccessToken(string applicationCode)
    {
        var formData = new Dictionary<string, string>()
        {
            { "grant_type", "authorization_code" },
            { "code", applicationCode },
            { "redirect_uri", oAuthSettings.RedirectUri },
            { "client_id", oAuthSettings.ClientId },
            { "client_secret", oAuthSettings.ClientSecret }
        };
        var response = await oAuthHttpClient.PostAsync(oAuthSettings.AccessTokenEndpoint,
            new FormUrlEncodedContent(formData));

        if (response.StatusCode == System.Net.HttpStatusCode.OK)
        {
            return await response.Content.ReadAsStringAsync();
        }

        return null;
    }

    public static OsmAccessToken? GetAccessToken(IRequestCookieCollection cookies)
    {
        if (cookies.TryGetValue(AccessTokenCookieKey, out string? cookieValue) && cookieValue != null)
        {
            return JsonSerializer.Deserialize<OsmAccessToken>(cookieValue);
        }

        return null;
    }

    public static void SetAccessToken(IResponseCookies cookies, string accessToken)
    {
        cookies.Append(AccessTokenCookieKey, accessToken);
    }
}