using System.Text;
using System.Text.Encodings.Web;
using System.Text.Json;
using System.Text.Json.Serialization;
using NoSmokingMap.Models.Overpass;

namespace NoSmokingMap.Models;

public class OverpassModel : IDisposable
{
    private readonly HttpClient httpClient;
    private readonly UrlEncoder urlEncoder;

    private string overpassQuery = @"<osm-script output=""json"" output-config="""" timeout=""25"">
  <query into=""searchArea"" type=""area"">
    <id-query type=""area"" ref=""3600062422"" into=""searchArea""/>
  </query>
  <union into=""_"">
    <query into=""_"" type=""nwr"">
      <has-kv k=""smoking"" modv="""" v=""no""/>
      <has-kv k=""amenity"" modv="""" v=""bar""/>
      <area-query from=""searchArea""/>
    </query>
    <query into=""_"" type=""nwr"">
      <has-kv k=""smoking"" modv="""" v=""isolated""/>
      <has-kv k=""amenity"" modv="""" v=""bar""/>
      <area-query from=""searchArea""/>
    </query>
    <query into=""_"" type=""nwr"">
      <has-kv k=""smoking"" modv="""" v=""outside""/>
      <has-kv k=""amenity"" modv="""" v=""bar""/>
      <area-query from=""searchArea""/>
    </query>
  </union>
  <print e="""" from=""_"" geometry=""full"" ids=""yes"" limit="""" mode=""body"" n="""" order=""id"" s="""" w=""""/>
</osm-script>
";

    public OverpassModel()
    {
        httpClient = new HttpClient()
        {
            BaseAddress = new Uri("https://overpass-api.de/")
        };
        urlEncoder = UrlEncoder.Default;
    }

    public void Dispose()
    {
        httpClient.Dispose();
    }

    public async Task<OverpassResponse?> FetchResultsAsync()
    {
        using var requestContent = new StringContent("data=" + urlEncoder.Encode(overpassQuery), Encoding.UTF8);
        var response = await httpClient.PostAsync("/api/interpreter", requestContent);
        var json = await response.Content.ReadAsStringAsync();

        var options = new JsonSerializerOptions()
        {
          PropertyNameCaseInsensitive = true,
          Converters = { new JsonStringEnumConverter(JsonNamingPolicy.SnakeCaseLower) }
        };
        return JsonSerializer.Deserialize<OverpassResponse>(json, options);
    }
}