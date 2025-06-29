using System.ComponentModel.DataAnnotations.Schema;
using NoSmokingMap.Models.Overpass;

namespace NoSmokingMap.Models.Database;

public class PointOfInterestEditSuggestionDbo
{
    public int Id { get; set; }
    public required long ElementId { get; set; }
    public required OverpassElementType ElementType { get; set; }
    [Column("Changes", TypeName = "jsonb")] public required PointOfInterestChangesDbo Changes { get; set; }
    public required string Comment { get; set; }
    public DateTime CreatedOn { get; set; }
}
