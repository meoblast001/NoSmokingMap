
using System.Diagnostics.CodeAnalysis;
using MessagePack;
using NoSmokingMap.Models.Overpass;

namespace NoSmokingMap.Models.Caching;

[MessagePackObject]
public class AmenityCacheDto
{
    [Key(0)]
    public required OverpassElement[] AllAmenities { get; set; }

    [SetsRequiredMembers]
    public AmenityCacheDto(OverpassElement[] allAmenities)
    {
        AllAmenities = allAmenities;
    }
}
