using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization.Formatters.Binary;
using System.Text;

namespace webapi;

public abstract class UserCommon
{
    [Key]
    public string UID { get; set; }

    public int[] OwnedDatasets { get; set; }

    public DateTime DateCreated { get; set; }
    public DateTime DateLastSignedIn { get; set; }
}
