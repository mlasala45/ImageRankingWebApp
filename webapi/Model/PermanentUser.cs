using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization.Formatters.Binary;
using System.Text;

namespace webapi;

public class PermanentUser : UserCommon
{
    //User Details

    public string Name { get; set; }
    public string Email { get; set; }

    public string GoogleSubjectNumber { get; set; }

    public PermanentUser() {
        OwnedDatasets = new int[0];
    }
}
