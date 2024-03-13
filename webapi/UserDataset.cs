using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization.Formatters.Binary;
using System.Text;

namespace webapi;

public class UserDataset
{
    [Key]
    public int UID { get; set; }
    public string[] ImageNames { get; set; }

    public UserDataset() {
        ImageNames = new string[0];
    }

    public byte[] ToBytes()
    {
        var json = JsonConvert.SerializeObject(this);
        return ASCIIEncoding.ASCII.GetBytes(json);
    }

    public static UserDataset FromBytes(byte[] bytes)
    {
        var json = JsonFromBytes(bytes);
        return JsonConvert.DeserializeObject<UserDataset>(json);
    }

    public static string JsonFromBytes(byte[] bytes)
    {
        return ASCIIEncoding.ASCII.GetString(bytes);
    }
}
