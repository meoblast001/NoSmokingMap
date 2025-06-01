using System.Globalization;
using System.Xml;

namespace NoSmokingMap.Services.Overpass;

public class OverpassQueryBuilder
{
    private const string SearchAreaKey = "searchArea";
    private const string ResultSetKey = "_";

    private readonly XmlDocument xmlDocument;
    private readonly XmlElement rootElement;
    private readonly XmlElement unionQueryElement;
    private XmlElement? areaQueryElement;
    bool built = false;

    public OverpassQueryBuilder(int timeout)
    {
        xmlDocument = new XmlDocument();

        rootElement = xmlDocument.CreateElement("osm-script");
        rootElement.SetAttribute("output", "json");
        rootElement.SetAttribute("output-config", string.Empty);
        rootElement.SetAttribute("timeout", timeout.ToString(CultureInfo.InvariantCulture));
        xmlDocument.AppendChild(rootElement);

        unionQueryElement = xmlDocument.CreateElement("union");
        unionQueryElement.SetAttribute("into", ResultSetKey);
        rootElement.AppendChild(unionQueryElement);
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

    public OverpassQueryBuilder AppendSearchByTags(IEnumerable<KeyValuePair<string, string>> intersectionKvTags)
    {
        var queryElement = xmlDocument.CreateElement("query");
        queryElement.SetAttribute("into", ResultSetKey);
        queryElement.SetAttribute("type", "nwr");
        unionQueryElement.AppendChild(queryElement);

        foreach (var kv in intersectionKvTags)
        {
            var hasKvElement = xmlDocument.CreateElement("has-kv");
            hasKvElement.SetAttribute("k", kv.Key);
            hasKvElement.SetAttribute("v", kv.Value);
            queryElement.AppendChild(hasKvElement);
        }

        var areaQueryElement = xmlDocument.CreateElement("area-query");
        areaQueryElement.SetAttribute("from", SearchAreaKey);
        queryElement.AppendChild(areaQueryElement);

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
