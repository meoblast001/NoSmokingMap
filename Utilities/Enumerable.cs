namespace NoSmokingMap.Utilities;

public static class Enumerable
{
    public static IEnumerable<T> Yield<T>(T value)
    {
        yield return value;
    }
}
