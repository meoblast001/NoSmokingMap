using System.Text.Json;
using System.Text.Json.Serialization;

namespace NoSmokingMap.Utilities;

public class SafeEnumConverterFactory : JsonConverterFactory
{
    public class SafeEnumConverter<T> : JsonConverter<T> where T : struct, Enum
    {
        public override T Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            string? enumString = reader.GetString();
            if (Enum.TryParse(enumString, ignoreCase: true, out T result))
                return result;

            return default;
        }

        public override void Write(Utf8JsonWriter writer, T value, JsonSerializerOptions options)
        {
            writer.WriteStringValue(value.ToString());
        }
    }

    public override bool CanConvert(Type typeToConvert)
    {
        return typeToConvert.IsEnum;
    }

    public override JsonConverter? CreateConverter(Type typeToConvert, JsonSerializerOptions options)
    {
        Type converterType = typeof(SafeEnumConverter<>).MakeGenericType(typeToConvert);
        return (JsonConverter?) Activator.CreateInstance(converterType);
    }
}