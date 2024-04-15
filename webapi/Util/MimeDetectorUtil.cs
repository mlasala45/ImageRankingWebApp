using MimeDetective;

public static class MimeDetectorUtil
{
    public static ContentInspector Inspector = new ContentInspectorBuilder()
    {
        Definitions = MimeDetective.Definitions.Default.All()
    }.Build();

    public static string InspectBlob(ref byte[] blob)
    {
        var matches = Inspector.Inspect(blob).ByMimeType();
        if (matches.Length == 0) return null;
        var matchGroup = matches[0];
        return matchGroup.MimeType;
    }
}