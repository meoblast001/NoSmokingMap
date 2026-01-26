using MessagePack;
using NoSmokingMap.Models.Caching;
using NoSmokingMap.Settings;

namespace NoSmokingMap.Services;

public class AmenityCacheService
{
    public DateTime ExpiresAt => LastUpdatedAt.Add(cacheValidity);
    private DateTime LastUpdatedAt { get; set; } = DateTime.MinValue;

    private readonly string cacheFilePath;
    private readonly TimeSpan cacheValidity;
    private readonly ILogger<AmenityCacheService> logger;

    public AmenityCacheService(OverpassSettings overpassSettings, ILogger<AmenityCacheService> logger)
    {
        cacheFilePath = overpassSettings.CacheFilePath;
        cacheValidity = TimeSpan.FromMinutes(overpassSettings.CacheValidityMinutes);
        this.logger = logger;
    }

    public void DetermineExpiration()
    {
        LastUpdatedAt = File.GetLastWriteTimeUtc(cacheFilePath);
    }

    public async Task<AmenityCacheDto?> TryReadCache()
    {
        try
        {
            if (!File.Exists(cacheFilePath))
            {
                return null;
            }

            LastUpdatedAt = File.GetLastWriteTimeUtc(cacheFilePath);

            using var cacheFile = File.OpenRead(cacheFilePath);
            var envelope = await MessagePackSerializer.DeserializeAsync<AmenityCacheEnvelopeDto>(cacheFile);
            return envelope.TryDeserializeData(out var amenityCache) ? amenityCache : null;
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Failed to read cache");
            return null;
        }
    }

    public async Task<bool> TryWriteCache(AmenityCacheDto amenityCache)
    {
        try
        {
            var envelope = new AmenityCacheEnvelopeDto(amenityCache);
            using var cacheFile = File.OpenWrite(cacheFilePath);
            await MessagePackSerializer.SerializeAsync(cacheFile, envelope);
            
            LastUpdatedAt = DateTime.UtcNow;

            return true;
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Could not write cache");
            return false;
        }
    }
}
