using NoSmokingMap.Models.Overpass;
using NoSmokingMap.Services;
using NoSmokingMap.Utilities;

namespace NoSmokingMap.Models;

public class OverpassModel
{
    private const int FetchPoiAttempts = 3;

    private readonly OverpassApiService overpassApiService;
    private readonly OverpassApiService.PoiKeySearch poiKeySearch;

    private OverpassElement[] allAmenities;
    private Dictionary<OverpassSmoking, OverpassElement[]> amenitiesBySmoking;
    private DateTime? lastQueryTime = null;

    public OverpassModel(OverpassApiService overpassApiService)
    {
        this.overpassApiService = overpassApiService;

        poiKeySearch = new OverpassApiService.PoiKeySearch
        {
            UnionSearch =
            [
                new OverpassApiService.PoiKeySearch.PoiKeySubSearch
                {
                    IntersectionSearch = new Dictionary<string, string> { { "amenity", "bar" } }
                },
                new OverpassApiService.PoiKeySearch.PoiKeySubSearch
                {
                    IntersectionSearch = new Dictionary<string, string> { { "amenity", "pub" } }
                },
                new OverpassApiService.PoiKeySearch.PoiKeySubSearch
                {
                    IntersectionSearch = new Dictionary<string, string> { { "bar", "yes" } }
                }
            ]
        };

        allAmenities = [];
        amenitiesBySmoking = new Dictionary<OverpassSmoking, OverpassElement[]>();
    }

    public async Task Update()
    {
        if (lastQueryTime == null || DateTime.UtcNow > lastQueryTime.Value.AddDays(1))
        {
            allAmenities = await overpassApiService.FetchPointsOfInterest(poiKeySearch, FetchPoiAttempts);
            GroupAllAmenitiesBySmoking();
            lastQueryTime = DateTime.UtcNow;
        }
    }

    public IEnumerable<OverpassElement> GetAmenitiesBySmoking(OverpassSmoking smokingType)
    {
        return amenitiesBySmoking.TryGetValue(smokingType, out var amenities)
            ? amenities
            : Enumerable.Empty<OverpassElement>();
    }

    public IEnumerable<OverpassElement> GetAmenitiesByKeywords(string searchText)
    {
        var keywords = searchText.Split(" ", StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
        var matchingAmenities = allAmenities
            .Where(amenity => amenity.Tags.Name != null && keywords.All(
                keyword => amenity.Tags.Name.Contains(keyword, StringComparison.InvariantCultureIgnoreCase)));
        return matchingAmenities;
    }

    public IEnumerable<OverpassElement> GetAmenitiesWithinDistance(Geocoordinates userPosition, double limitMeters)
    {
        return allAmenities
            .SelectMany<OverpassElement, (OverpassElement amenity, Geocoordinates geocoord)>(amenity =>
            {
                var geocoord = amenity.GetLocation();
                return geocoord != null
                    ? EnumerableUtils.Yield((amenity, geocoord: (Geocoordinates) geocoord))
                    : Enumerable.Empty<(OverpassElement, Geocoordinates)>();
            })
            .WhereInDistanceLimit(locatedAmenity => locatedAmenity.geocoord, userPosition, limitMeters)
            .Select(locatedAmenity => locatedAmenity.amenity);
    }

    private void GroupAllAmenitiesBySmoking()
    {
        amenitiesBySmoking = allAmenities.Where(amenity => amenity.Tags.Smoking.HasValue)
            .GroupBy(amenity => amenity.Tags.Smoking ?? default)
            .ToDictionary(
                group => group.Key,
                group => group.ToArray());
    }
}
