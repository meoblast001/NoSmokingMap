using System.Text.Json;
using NoSmokingMap.Models.Database;
using NoSmokingMap.Models.Overpass;

namespace NoSmokingMap.Models;

public class SuggestionViewModel
{
    public required long ElementId { get; set; }
    public required OverpassElementType ElementType { get; set; }
    public required OverpassSmoking SmokingStatus { get; set; }
    public required string Comment { get; set; }

    public LocationViewModel? Location { get; set; }

    public static SuggestionViewModel Create(PointOfInterestEditSuggestionDbo dbo)
    {
        var changes = JsonSerializer.Deserialize<PointOfInterestChanges>(dbo.Changes);
        return new SuggestionViewModel()
        {
            ElementId = dbo.ElementId,
            ElementType = Enum.Parse<OverpassElementType>(dbo.ElementType),
            SmokingStatus = Enum.Parse<OverpassSmoking>(changes.Smoking),
            Comment = dbo.Comment
        };
    }
}
