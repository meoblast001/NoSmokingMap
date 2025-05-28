namespace NoSmokingMap.Models.Overpass;

public static class OverpassSmokingExtensions
{
    public static string ToOsmTagString(this OverpassSmoking overpassSmoking)
    {
        return overpassSmoking switch
        {
            OverpassSmoking.No => "no",
            OverpassSmoking.Yes => "yes",
            OverpassSmoking.Dedicated => "dedicated",
            OverpassSmoking.Separated => "separated",
            OverpassSmoking.Isolated => "isolated",
            OverpassSmoking.Outside => "outside",
            _ => throw new ArgumentException("Unknown smoking tag")
        };
    }
}
