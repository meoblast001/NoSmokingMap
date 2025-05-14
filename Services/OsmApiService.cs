using System.Net.Http.Headers;
using NoSmokingMap.Models;
using NoSmokingMap.Settings;

namespace NoSmokingMap.Services;

public class OsmApiService
{
    private readonly HttpClient osmHttpClient;

    public OsmApiService(OsmSettings osmSettings)
    {
        osmHttpClient = new HttpClient()
        {
            BaseAddress = new Uri(osmSettings.BaseUri)
        };
    }

    private static void ConfigureAuthorization(HttpRequestMessage request, OsmAccessToken accessToken)
    {
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken.AccessToken);
    }

    public async Task<string> GetUserDetailsAsync(OsmAccessToken accessToken)
    {
        var request = new HttpRequestMessage(HttpMethod.Get, "/api/0.6/user/details");
        ConfigureAuthorization(request, accessToken);
        var response = await osmHttpClient.SendAsync(request);
        return await response.Content.ReadAsStringAsync();
    }
}