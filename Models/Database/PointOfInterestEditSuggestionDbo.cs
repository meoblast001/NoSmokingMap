using System.ComponentModel.DataAnnotations.Schema;

namespace NoSmokingMap.Models.Database;

public class PointOfInterestEditSuggestionDbo
{
    public int Id { get; set; }
    public required long ElementId { get; set; }
    public required string ElementType { get; set; }
    [Column(TypeName = "jsonb")] public required string Changes { get; set; }
    public required string Comment { get; set; }
    public DateTime CreatedOn { get; set; }
}
