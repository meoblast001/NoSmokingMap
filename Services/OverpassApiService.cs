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
    private const int RetryDelayMiliseconds = 1000;

    private readonly OverpassSettings overpassSettings;
    private readonly ILogger<OverpassApiService> logger;
    private readonly HttpClient httpClient;
    private readonly UrlEncoder urlEncoder;

    public class PoiKeySearch
    {
        public class PoiKeySubSearch
        {
            public required IReadOnlyDictionary<string, string> IntersectionSearch { get; set; }
        }

        public required IEnumerable<PoiKeySubSearch> UnionSearch { get; set; }
    }

    public OverpassApiService(OverpassSettings overpassSettings, ILogger<OverpassApiService> logger)
    {
        this.overpassSettings = overpassSettings;
        this.logger = logger;
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

    public async Task<OverpassElement[]> FetchPointsOfInterest(PoiKeySearch keySearch, int attempts = 1)
    {
        var overpassQueryBuilder = new OverpassQueryBuilder(timeout: 200)
            .SetSearchAreaReference(overpassSettings.SearchAreaReference);
        foreach (var subSearch in keySearch.UnionSearch)
            overpassQueryBuilder.AppendSearchByTags(subSearch.IntersectionSearch);
        var overpassQuery = overpassQueryBuilder.Build();

        using var requestContent = new StringContent("data=" + urlEncoder.Encode(overpassQuery), Encoding.UTF8);
        var response = await httpClient.PostAsync("/api/interpreter", requestContent);

        if (response.StatusCode != System.Net.HttpStatusCode.OK)
        {
            logger.LogError("Could not load points of interest: Status: {StatusCode}, Body: {Body}",
                response.StatusCode, await response.Content.ReadAsStringAsync());
            if (attempts > 1)
            {
                await Task.Delay(RetryDelayMiliseconds);
                return await FetchPointsOfInterest(keySearch, attempts - 1);
            }
            throw new Exception("Exhausted all attempts to load points of interest.");
        }


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
