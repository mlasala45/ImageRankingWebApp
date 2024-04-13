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

    //User Details

    public string Name { get; set; }
    public string Email { get; set; }

    public string GoogleSubjectNumber { get; set; }

    //Dates

    public DateTime DateCreated { get; set; }
    public DateTime DateLastSignedIn { get; set; }

    //User-Owned Data

    public int[] OwnedDatasets { get; set; }

    public PermanentUser() {
        OwnedDatasets = new int[0];
    }
}
