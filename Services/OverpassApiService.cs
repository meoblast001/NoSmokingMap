using System.Text;
using System.Text.Encodings.Web;
using System.Text.Json;
using NoSmokingMap.Models.Overpass;
using NoSmokingMap.Services.Overpass;
using NoSmokingMap.Settings;
using NoSmokingMap.Utilities;

namespace NoSmokingMap.Services;

public class OverpassApiService : IDisposable
{
    private readonly OverpassSettings overpassSettings;
    private readonly HttpClient httpClient;
    private readonly UrlEncoder urlEncoder;

    public OverpassApiService(OverpassSettings overpassSettings)
    {
        this.overpassSettings = overpassSettings;
        httpClient = new HttpClient()
        {
            BaseAddress = new Uri(overpassSettings.BaseUri)
        };
        urlEncoder = UrlEncoder.Default;
    }

    public void Dispose()
    {
        httpClient.Dispose();
    }

    public async Task<OverpassElement[]> FetchAmenities(string amenityType)
    {
        var overpassQuery = new OverpassQueryBuilder(200)
            .SetSearchAreaReference(overpassSettings.SearchAreaReference)
            .SearchAmenityType(amenityType)
            .Build();

        using var requestContent = new StringContent("data=" + urlEncoder.Encode(overpassQuery), Encoding.UTF8);
        var response = await httpClient.PostAsync("/api/interpreter", requestContent);
        var json = await response.Content.ReadAsStringAsync();

        var options = new JsonSerializerOptions()
        {
          PropertyNameCaseInsensitive = true,
          Converters = { new SafeEnumConverterFactory() }
        };
        var jsonResponse = JsonSerializer.Deserialize<OverpassResponse>(json, options);

        if (jsonResponse == null)
            return [];

        return jsonResponse.Elements;
    }
}