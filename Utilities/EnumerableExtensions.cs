namespace NoSmokingMap.Utilities;

public static class EnumerableExtensions
{
    public static IEnumerable<T> WhereNotNull<T>(this IEnumerable<T?> subject)
    {
        return subject.Where(x => x != null).Cast<T>();
    }
}
