namespace NoSmokingMap.Models;

public class SuggestionsPaginationViewModel
{
    public required SuggestionViewModel[] Suggestions { get; set; }
    public required int TotalEntries { get; set; }
}
