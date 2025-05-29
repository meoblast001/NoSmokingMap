using OsmSharp.Changesets;
using OsmSharp.Tags;

namespace NoSmokingMap.Services.OpenStreetMap;

public static class OsmChangesetFactory
{
    public static Changeset Create(string comment)
    {
        return new Changeset()
        {
            Tags = new TagsCollection()
            {
                new Tag() { Key = "created_by", Value = "NoSmokingMap" },
                new Tag() { Key = "comment", Value = comment }
            }
        };
    }
}
