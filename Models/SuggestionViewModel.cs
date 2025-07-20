using NoSmokingMap.Models.Database;
using NoSmokingMap.Models.Overpass;

namespace NoSmokingMap.Models;

public class SuggestionViewModel
{
    public required OverpassSmoking NewSmoking { get; set; }
    public required string Comment { get; set; }

    public LocationViewModel? Location { get; set; }

    public static SuggestionViewModel Create(PointOfInterestEditSuggestionDbo dbo)
    {
        return new SuggestionViewModel()
        {
            NewSmoking = dbo.Changes.Smoking,
            Comment = dbo.Comment
        };
    }
}
