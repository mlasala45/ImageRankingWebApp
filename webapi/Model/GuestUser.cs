using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization.Formatters.Binary;
using System.Text;

namespace webapi;

public class GuestUser : UserCommon
{
    public GuestUser()
    {
        OwnedDatasets = new int[0];
    }
}
