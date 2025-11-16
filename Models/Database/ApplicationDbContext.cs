using System.Text.Json;
using Microsoft.AspNetCore.DataProtection.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using NoSmokingMap.Models.Overpass;

namespace NoSmokingMap.Models.Database;

public class ApplicationDbContext : DbContext, IDataProtectionKeyContext
{
    public DbSet<DataProtectionKey> DataProtectionKeys { get; set; }
    public DbSet<PointOfInterestEditSuggestionDbo> PoiEditSuggestions { get; set; }

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<PointOfInterestEditSuggestionDbo>().Property(dbo => dbo.CreatedOn)
            .HasDefaultValueSql("CURRENT_TIMESTAMP");
        modelBuilder.Entity<PointOfInterestEditSuggestionDbo>().Property(dbo => dbo.ElementType)
            .HasConversion(new EnumToStringConverter<OverpassElementType>());

        var jsonSerializerOptions = new JsonSerializerOptions() { PropertyNameCaseInsensitive = true };
        var changesValueConverter = new ValueConverter<PointOfInterestChangesDbo?, string>(
            dbo => JsonSerializer.Serialize(dbo, jsonSerializerOptions),
            json => JsonSerializer.Deserialize<PointOfInterestChangesDbo>(json, jsonSerializerOptions));
        modelBuilder.Entity<PointOfInterestEditSuggestionDbo>().Property(dbo => dbo.Changes)
            .HasConversion(changesValueConverter)
            .IsRequired();
    }
}
