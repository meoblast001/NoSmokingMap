using NoSmokingMap.Models.Database;
using NoSmokingMap.Models.Overpass;

namespace NoSmokingMap.Models;

public class SuggestionViewModel
{
    public required int Id { get; set; }
    public required OverpassSmoking NewSmoking { get; set; }
    public required string Comment { get; set; }

    public LocationViewModel? Location { get; set; }

    public static SuggestionViewModel? Create(PointOfInterestEditSuggestionDbo dbo)
    {
        if (dbo.Changes == null)
            return null;
        return new SuggestionViewModel()
        {
            Id = dbo.Id,
            NewSmoking = dbo.Changes.Smoking,
            Comment = dbo.Comment
        };
    }
}
