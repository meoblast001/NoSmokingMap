namespace NoSmokingMap.Utilities;

public static class EnumerableUtils
{
    public static IEnumerable<T> Yield<T>(T value)
    {
        yield return value;
    }
}
