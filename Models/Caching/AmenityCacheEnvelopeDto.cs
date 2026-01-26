using System.Diagnostics.CodeAnalysis;
using MessagePack;

namespace NoSmokingMap.Models.Caching;

[MessagePackObject]
public class AmenityCacheEnvelopeDto
{
    public const int CurrentVersion = 1;

    [Key(0)]
    public required int Version { get; set; } = default!;

    [Key(1)]
    public required byte[] Data { get; set; } = default!;

    public AmenityCacheEnvelopeDto()
    {
    }

    [SetsRequiredMembers]
    public AmenityCacheEnvelopeDto(AmenityCacheDto input)
    {
        Version = CurrentVersion;
        Data = MessagePackSerializer.Serialize(input);
    }

    public bool TryDeserializeData([NotNullWhen(true)] out AmenityCacheDto? output)
    {
        if (Version != CurrentVersion)
        {
            output = default;
            return false;
        }

        output = MessagePackSerializer.Deserialize<AmenityCacheDto>(Data);
        return true;
    }
}
