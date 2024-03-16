using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization.Formatters.Binary;
using System.Text;

namespace webapi;

public class PermanentUser
{
    [Key]
    public int UID { get; set; }

    public string Name { get; set; }

    public DateTime DateCreated { get; set; }
}
