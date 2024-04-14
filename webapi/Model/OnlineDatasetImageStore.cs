using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization.Formatters.Binary;
using System.Text;

public class OnlineDatasetImageStore
{
    [Key]
    public int AssociatedDataset { get; set; }
    public byte[][] Blobs { get; set; }
}
