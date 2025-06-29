using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using NoSmokingMap.Models.Overpass;

namespace NoSmokingMap.Models.Database;

public class ApplicationDbContext : DbContext
{
    public DbSet<PointOfInterestEditSuggestionDbo> PoiEditSuggestions { get; set; }

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<PointOfInterestEditSuggestionDbo>().Property(dbo => dbo.CreatedOn)
            .HasDefaultValueSql("CURRENT_TIMESTAMP AT TIME ZONE 'UTC'");
        modelBuilder.Entity<PointOfInterestEditSuggestionDbo>().Property(dbo => dbo.ElementType)
            .HasConversion(new EnumToStringConverter<OverpassElementType>());
    }
}
