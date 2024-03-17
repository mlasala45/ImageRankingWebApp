using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization.Formatters.Binary;
using System.Text;


public class RankingChoice
{
    [Key]
    public string UID { get; set; }

    public int datasetKey;
    public string user;

    public int promptLeftIndex;
    public int promptRightIndex;
    public int choice;

    public DateTime TimeStamp { get; set; }

    public RankingChoice()
    {
    }
}
