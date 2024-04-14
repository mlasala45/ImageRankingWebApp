using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization.Formatters.Binary;
using System.Text;

public class ImageDataset
{
    [Key]
    public int UID { get; set; }

    public string Name { get; set; }
    public string[] ImageNames { get; set; }

    public DateTime TimeCreated { get; set; }
    public string AuthorUID { get; set; }
    public bool IsAuthorGuest { get; set; }
    public bool AreImagesStoredInDatabase { get; set; }

    public ImageDataset()
    {
        ImageNames = new string[0];
    }

    public byte[] ToBytes()
    {
        var json = JsonConvert.SerializeObject(this);
        return Encoding.ASCII.GetBytes(json);
    }

    public static ImageDataset FromBytes(byte[] bytes)
    {
        var json = JsonFromBytes(bytes);
        return JsonConvert.DeserializeObject<ImageDataset>(json);
    }

    public static string JsonFromBytes(byte[] bytes)
    {
        return Encoding.ASCII.GetString(bytes);
    }
}
