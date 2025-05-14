using NoSmokingMap.Models.Overpass;
using NoSmokingMap.Services;

namespace NoSmokingMap.Models;

public class OverpassModel
{
    private readonly OverpassApiService overpassApiService;

    private OverpassElement[] allAmenities;
    private Dictionary<OverpassSmoking, OverpassElement[]> amenitiesBySmoking;
    private DateTime? lastQueryTime = null;

    public OverpassModel(OverpassApiService overpassApiService)
    {
        this.overpassApiService = overpassApiService;

        allAmenities = [];
        amenitiesBySmoking = new Dictionary<OverpassSmoking, OverpassElement[]>();
    }

    public async Task Update()
    {
        if (lastQueryTime == null || DateTime.UtcNow > lastQueryTime.Value.AddDays(1))
        {
            allAmenities = await overpassApiService.FetchAmenities("bar");
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

    private void GroupAllAmenitiesBySmoking()
    {
        amenitiesBySmoking = allAmenities.Where(amenity => amenity.Tags.Smoking.HasValue)
            .GroupBy(amenity => amenity.Tags.Smoking ?? default)
            .ToDictionary(
                group => group.Key,
                group => group.ToArray());
    }
}