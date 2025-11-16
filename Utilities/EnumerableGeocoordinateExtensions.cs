using NoSmokingMap.Models;

namespace NoSmokingMap.Utilities;

public static class EnumerableGeocoordinateExtensions
{
    public static IEnumerable<T> WhereInDistanceLimit<T>(this IEnumerable<T> input,
        Func<T, Geocoordinates> geocoordGetter, Geocoordinates target, double distanceLimit)
    {
        return input.Select(val => (val, geocoord: geocoordGetter(val)))
            .OrderBy(locatedValue => locatedValue.geocoord.EuclidianDistance(target))
            .TakeWhile(locatedValue => locatedValue.geocoord.MeterDistance(target) < distanceLimit)
            .Select(locatedValue => locatedValue.val);
    }
}
