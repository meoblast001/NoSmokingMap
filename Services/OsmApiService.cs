using System.Globalization;
using System.Net;
using System.Net.Http.Headers;
using System.Xml;
using System.Xml.Serialization;
using NoSmokingMap.Models;
using NoSmokingMap.Services.OpenStreetMap;
using NoSmokingMap.Settings;
using OsmSharp;
using OsmSharp.API;
using OsmSharp.Changesets;

namespace NoSmokingMap.Services;

public class OsmApiService
{
    private readonly HttpClient osmHttpClient;
    private readonly XmlSerializer xmlSerializer;

    public OsmApiService(OsmSettings osmSettings)
    {
        osmHttpClient = new HttpClient()
        {
            BaseAddress = new Uri(osmSettings.BaseUri)
        };
        xmlSerializer = new XmlSerializer(typeof(Osm));
    }

    private static void ConfigureAuthorization(HttpRequestMessage request, OsmAccessToken accessToken)
    {
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken.AccessToken);
    }

    public async Task<User?> GetUserDetailsAsync(OsmAccessToken accessToken)
    {
        var request = new HttpRequestMessage(HttpMethod.Get, "/api/0.6/user/details");
        ConfigureAuthorization(request, accessToken);
        var response = await osmHttpClient.SendAsync(request);
        var osm = xmlSerializer.Deserialize(await response.Content.ReadAsStreamAsync()) as Osm;
        return osm?.User;
    }

    public async Task<OsmGeo> ReadElementByIdAsync(OsmGeoType geoType, long elementId)
    {
        var geoTypeUrlString = GeoTypeToUrlString(geoType);

        var request = new HttpRequestMessage(HttpMethod.Get, $"/api/0.6/{geoTypeUrlString}/{elementId}");
        var response = await osmHttpClient.SendAsync(request);

        switch (response.StatusCode)
        {
            case HttpStatusCode.OK:
                var osm = xmlSerializer.Deserialize(await response.Content.ReadAsStreamAsync()) as Osm;
                if (osm == null)
                    throw new OsmApiException("[Read Element] OSM response could not be parsed");

                var result = ElementsOfGeoType(geoType, osm).FirstOrDefault();
                if (result == null)
                    throw new OsmApiException("[Read Element] No element returned");

                return result;
            case HttpStatusCode.NotFound:
                throw new OsmApiException($"[Read Element] Element not found, ID {elementId}");
            case HttpStatusCode.Gone:
                throw new OsmApiException("[Read Element] Element deleted");
            default:
                throw new OsmApiException($"[Read Element] Unknown OSM error [Status: {response.StatusCode}]");
        }
    }

    public async Task<List<OsmGeo>> ReadElementsByIdsAsync(IEnumerable<(OsmGeoType geoType, long elementId)> query)
    {
        var queryGroups = query.GroupBy(elementQuery => elementQuery.geoType)
            .Select(grouping => (geoType: grouping.Key, elementIds: grouping.Select(value => value.elementId)));

        var results = new List<OsmGeo>();

        foreach (var queryGroup in queryGroups)
        {
            var groupResults = await ReadElementsByIdsAsync(queryGroup.geoType, queryGroup.elementIds);
            results.AddRange(groupResults);
        }

        return results;
    }

    private async Task<IEnumerable<OsmGeo>> ReadElementsByIdsAsync(OsmGeoType geoType, IEnumerable<long> elementIds)
    {
        var geoTypeUrlString = GeoTypeToPluralUrlString(geoType);
        var elementsUrlString = string.Join(',',
            elementIds.Select(elementId => elementId.ToString(CultureInfo.InvariantCulture)));

        var request = new HttpRequestMessage(HttpMethod.Get,
            $"/api/0.6/{geoTypeUrlString}?{geoTypeUrlString}={elementsUrlString}");
        var response = await osmHttpClient.SendAsync(request);

        switch (response.StatusCode)
        {
            case HttpStatusCode.OK:
                var osm = xmlSerializer.Deserialize(await response.Content.ReadAsStreamAsync()) as Osm;
                if (osm == null)
                    throw new OsmApiException($"[Read Elements / {geoType}] OSM response could not be parsed");

                return ElementsOfGeoType(geoType, osm);
            case HttpStatusCode.NotFound:
                throw new OsmApiException($"[Read Elements / {geoType}] Elements not found, IDs {elementsUrlString}");
            case HttpStatusCode.RequestUriTooLong:
                throw new OsmApiException($"[Read Elements / {geoType}] Request too long");
            default:
                throw new OsmApiException(
                    $"[Read Elements / {geoType}] Unknown OSM error [Status: {response.StatusCode}]");
        }
    }

    public async Task<long> CreateChangeset(OsmAccessToken accessToken, Changeset changeset)
    {
        var osmRequestModel = new Osm() { Changesets = [changeset] };
        var osmRequestXml = SerializeOsmToXml(osmRequestModel);

        var request = new HttpRequestMessage(HttpMethod.Put, "/api/0.6/changeset/create")
        {
            Content = new StringContent(osmRequestXml)
        };
        ConfigureAuthorization(request, accessToken);
        var response = await osmHttpClient.SendAsync(request);

        switch (response.StatusCode)
        {
            case HttpStatusCode.OK:
                var changsetIdString = await response.Content.ReadAsStringAsync();
                if (!long.TryParse(changsetIdString, out long changesetId))
                    throw new OsmApiException(
                        $"[Create Changeset] Could not parse changeset ID \"{changsetIdString}\"");

                return changesetId;
            case HttpStatusCode.BadRequest:
                throw new OsmApiException("[Create Changeset] OSM endpoint could not parse XML request");
            default:
                throw new OsmApiException($"[Create Changeset] Unknown OSM error [Status: {response.StatusCode}]");
        }
    }

    public async Task CloseChangeset(OsmAccessToken accessToken, long changesetId)
    {
        var request = new HttpRequestMessage(HttpMethod.Put, $"/api/0.6/changeset/{changesetId}/close");
        ConfigureAuthorization(request, accessToken);
        var response = await osmHttpClient.SendAsync(request);

        switch (response.StatusCode)
        {
            case HttpStatusCode.OK:
                return;
            case HttpStatusCode.NotFound:
                throw new OsmApiException($"[Close Changeset] Changeset not found, ID \"{changesetId}\"");
            case HttpStatusCode.Conflict:
                throw new OsmApiException($"[Close Changeset] Changeset already closed, ID \"{changesetId}\"");
            default:
                throw new OsmApiException($"[Close Changeset] Unknown OSM error [Status: {response.StatusCode}]");
        }
    }

    public async Task UpdateElementByIdAsync(OsmAccessToken accessToken, OsmGeo element)
    {
        var geoTypeUrlString = GeoTypeToUrlString(element.Type);

        var osmRequestModel = new Osm()
        {
            Nodes = element is Node node ? [node] : Array.Empty<Node>(),
            Ways = element is Way way ? [way] : Array.Empty<Way>(),
            Relations = element is Relation relation ? [relation] : Array.Empty<Relation>()
        };
        var osmRequestXml = SerializeOsmToXml(osmRequestModel);

        var request = new HttpRequestMessage(HttpMethod.Put, $"/api/0.6/{geoTypeUrlString}/{element.Id}")
        {
            Content = new StringContent(osmRequestXml)
        };
        ConfigureAuthorization(request, accessToken);
        var response = await osmHttpClient.SendAsync(request);

        switch (response.StatusCode)
        {
            case HttpStatusCode.OK:
                return;
            case HttpStatusCode.BadRequest:
                throw new OsmApiException("[Update Element] OSM endpoint could not parse XML request");
            case HttpStatusCode.Conflict:
                throw new OsmApiException($"[Update Element] Element conflicted or changeset already closed, "
                    + $"Element ID \"{element.Id}\", Changeset ID \"{element.ChangeSetId}\"");
            case HttpStatusCode.NotFound:
                throw new OsmApiException($"[Update Element] Element not found, ID {element.Id}");
            case HttpStatusCode.PreconditionFailed:
                throw new OsmApiException("[Update Element] Element dependencies invalid");
            case HttpStatusCode.TooManyRequests:
                throw new OsmApiException("[Update Element] Rate limiting");
            default:
                throw new OsmApiException($"[Update Element] Unknown OSM error [Status: {response.StatusCode}]");
        }
    }

    private string SerializeOsmToXml(Osm osmModel)
    {
        var osmDocument = new StringWriter();
        var xmlWriterSettings = new XmlWriterSettings() { OmitXmlDeclaration = true };
        var xmlWriter = XmlWriter.Create(osmDocument, xmlWriterSettings);
        xmlSerializer.Serialize(xmlWriter, osmModel);
        return osmDocument.ToString();
    }

    private string GeoTypeToUrlString(OsmGeoType geoType)
    {
        return geoType switch
        {
            OsmGeoType.Node => "node",
            OsmGeoType.Way => "way",
            OsmGeoType.Relation => "relation",
            _ => throw new Exception("Unknown geotype")
        };
    }

    private string GeoTypeToPluralUrlString(OsmGeoType geoType)
    {
        return geoType switch
        {
            OsmGeoType.Node => "nodes",
            OsmGeoType.Way => "ways",
            OsmGeoType.Relation => "relations",
            _ => throw new Exception("Unknown geotype")
        };
    }

    private OsmGeo[] ElementsOfGeoType(OsmGeoType geoType, Osm osm)
    {
        return geoType switch
        {
            OsmGeoType.Node => osm.Nodes,
            OsmGeoType.Way => osm.Ways,
            OsmGeoType.Relation => osm.Relations,
            _ => throw new Exception("Unknown geotype")
        };
    }
}
