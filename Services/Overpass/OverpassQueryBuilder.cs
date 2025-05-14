using System.Globalization;
using System.Xml;

namespace NoSmokingMap.Services.Overpass;

public class OverpassQueryBuilder
{
    private const string SearchAreaKey = "searchArea";
    private const string ResultSetKey = "_";

    private readonly XmlDocument xmlDocument;
    private readonly XmlElement rootElement;
    private XmlElement? areaQueryElement;
    private XmlElement? amenityQueryElement;
    bool built = false;

    public OverpassQueryBuilder(int timeout)
    {
        xmlDocument = new XmlDocument();

        rootElement = xmlDocument.CreateElement("osm-script");
        rootElement.SetAttribute("output", "json");
        rootElement.SetAttribute("output-config", string.Empty);
        rootElement.SetAttribute("timeout", timeout.ToString(CultureInfo.InvariantCulture));
        xmlDocument.AppendChild(rootElement);
    }

    public OverpassQueryBuilder SetSearchAreaReference(string areaReference)
    {
        if (areaQueryElement != null)
            throw new InvalidOperationException("Search area already set");

        areaQueryElement = xmlDocument.CreateElement("query");
        areaQueryElement.SetAttribute("into", SearchAreaKey);
        areaQueryElement.SetAttribute("type", "area");
        rootElement.PrependChild(areaQueryElement);

        var idQueryElement = xmlDocument.CreateElement("id-query");
        idQueryElement.SetAttribute("type", "area");
        idQueryElement.SetAttribute("ref", areaReference);
        idQueryElement.SetAttribute("into", SearchAreaKey);
        areaQueryElement.AppendChild(idQueryElement);

        return this;
    }

    public OverpassQueryBuilder SearchAmenityType(string amenityType)
    {
        if (amenityQueryElement != null)
            throw new InvalidOperationException("Amenity search already set");

        amenityQueryElement = xmlDocument.CreateElement("query");
        amenityQueryElement.SetAttribute("into", ResultSetKey);
        amenityQueryElement.SetAttribute("type", "nwr");
        rootElement.AppendChild(amenityQueryElement);

        var hasKvAmenityElement = xmlDocument.CreateElement("has-kv");
        hasKvAmenityElement.SetAttribute("k", "amenity");
        hasKvAmenityElement.SetAttribute("v", amenityType);
        amenityQueryElement.AppendChild(hasKvAmenityElement);

        var areaQueryElement = xmlDocument.CreateElement("area-query");
        areaQueryElement.SetAttribute("from", SearchAreaKey);
        amenityQueryElement.AppendChild(areaQueryElement);

        return this;
    }

    public string Build()
    {
        if (!built)
        {
            var printElement = xmlDocument.CreateElement("print");
            printElement.SetAttribute("from", ResultSetKey);
            printElement.SetAttribute("ids", "yes");
            printElement.SetAttribute("geometry", "full");
            rootElement.AppendChild(printElement);

            built = true;
        }

        return xmlDocument.OuterXml;
    }
}