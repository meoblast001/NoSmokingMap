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
        return new SuggestionViewModel()
        {
            ElementId = dbo.ElementId,
            ElementType = dbo.ElementType,
            SmokingStatus = dbo.Changes.Smoking,
            Comment = dbo.Comment
        };
    }
}
