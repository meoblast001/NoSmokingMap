using NoSmokingMap.Models;
using NoSmokingMap.Models.Overpass;
using NoSmokingMap.Services.OpenStreetMap;

namespace NoSmokingMap.Services;

public class ElementUpdateService
{
    private readonly OsmApiService osmApiService;

    public ElementUpdateService(OsmApiService osmApiService)
    {
        this.osmApiService = osmApiService;
    }

    public async Task UpdateSmoking(OsmAccessToken accessToken, long elementId, OverpassElementType elementType,
        OverpassSmoking smokingStatus, string comment)
    {
        var osmElement = await osmApiService.ReadElementByIdAsync(elementType.ToOsmGeoType(), elementId);

        var changeset = OsmChangesetFactory.Create($"Updating smoking status. User comment: {comment}");
        long changesetId = await osmApiService.CreateChangeset(accessToken, changeset);

        osmElement.ChangeSetId = changesetId;
        osmElement.Tags["smoking"] = smokingStatus.ToOsmTagString();

        await osmApiService.UpdateElementByIdAsync(accessToken, osmElement);

        await osmApiService.CloseChangeset(accessToken, changesetId);
    }
}
