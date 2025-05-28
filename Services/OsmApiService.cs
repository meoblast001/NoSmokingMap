using System.Net.Http.Headers;
using System.Xml;
using System.Xml.Serialization;
using NoSmokingMap.Models;
using NoSmokingMap.Settings;
using OsmSharp;
using OsmSharp.API;
using OsmSharp.Changesets;
using OsmSharp.Tags;

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

    public async Task<OsmGeo?> GetElementByIdAsync(OsmAccessToken accessToken, OsmGeoType geoType, long elementId)
    {
        var geoTypeUrlString = GeoTypeToUrlString(geoType);
        if (geoTypeUrlString == null)
            return null;

        var request = new HttpRequestMessage(HttpMethod.Get, $"/api/0.6/{geoTypeUrlString}/{elementId}");
        var response = await osmHttpClient.SendAsync(request);
        var osm = xmlSerializer.Deserialize(await response.Content.ReadAsStreamAsync()) as Osm;
        if (osm == null)
            return null;

        return FirstElementOfGeoTypeOrDefault(geoType, osm);
    }

    public async Task<long> CreateChangeset(OsmAccessToken accessToken)
    {
        var osmModel = new Osm()
        {
            Changesets = new Changeset[]
            {
                new Changeset()
                {
                    Tags = new TagsCollection()
                    {
                        new Tag() { Key = "created_by", Value = "NoSmokingMap" },
                        new Tag() { Key = "comment", Value = "Updating smoking status" }
                    }
                }
            }
        };

        var osmDocument = new StringWriter();
        var xmlWriterSettings = new XmlWriterSettings() { OmitXmlDeclaration = true };
        var xmlWriter = XmlWriter.Create(osmDocument, xmlWriterSettings);
        xmlSerializer.Serialize(xmlWriter, osmModel);

        var request = new HttpRequestMessage(HttpMethod.Put, "/api/0.6/changeset/create")
        {
            Content = new StringContent(osmDocument.ToString())
        };
        ConfigureAuthorization(request, accessToken);
        var response = await osmHttpClient.SendAsync(request);
        return long.Parse(await response.Content.ReadAsStringAsync());
    }

    public async Task<bool> CloseChangeset(OsmAccessToken accessToken, long changesetId)
    {
        var request = new HttpRequestMessage(HttpMethod.Put, $"/api/0.6/changeset/{changesetId}/close");
        ConfigureAuthorization(request, accessToken);
        var response = await osmHttpClient.SendAsync(request);
        return response.StatusCode == System.Net.HttpStatusCode.OK;
    }

    public async Task<bool> UpdateElementByIdAsync(OsmAccessToken accessToken, OsmGeoType geoType, long elementId,
        OsmGeo element)
    {
        var geoTypeUrlString = GeoTypeToUrlString(geoType);
        if (geoTypeUrlString == null)
            return false;

        var osmModel = new Osm()
        {
            Nodes = geoType == OsmGeoType.Node ? new Node[] { element as Node } : new Node[0],
            Ways = geoType == OsmGeoType.Way ? new Way[] { element as Way } : new Way[0],
            Relations = geoType == OsmGeoType.Relation ? new Relation[] { element as Relation } : new Relation[0]
        };

        var osmDocument = new StringWriter();
        var xmlWriterSettings = new XmlWriterSettings() { OmitXmlDeclaration = true };
        var xmlWriter = XmlWriter.Create(osmDocument, xmlWriterSettings);
        xmlSerializer.Serialize(xmlWriter, osmModel);

        var request = new HttpRequestMessage(HttpMethod.Put, $"/api/0.6/{geoTypeUrlString}/{elementId}")
        {
            Content = new StringContent(osmDocument.ToString())
        };
        ConfigureAuthorization(request, accessToken);
        var response = await osmHttpClient.SendAsync(request);
        return response.StatusCode == System.Net.HttpStatusCode.OK;
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

    private OsmGeo? FirstElementOfGeoTypeOrDefault(OsmGeoType geoType, Osm osm)
    {
        return geoType switch
        {
            OsmGeoType.Node => osm.Nodes.FirstOrDefault(),
            OsmGeoType.Way => osm.Ways.FirstOrDefault(),
            OsmGeoType.Relation => osm.Relations.FirstOrDefault(),
            _ => throw new Exception("Unknown geotype")
        };
    }
}
