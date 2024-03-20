using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization.Formatters.Binary;
using System.Text;


public class RankingChoice
{
    [Key]
    public int UID { get; set; }

    public int datasetKey { get; set; }
    public string user { get; set; }

    public int promptLeftIndex { get; set; }
    public int promptRightIndex { get; set; }
    public int choice { get; set; }

    public DateTime TimeStamp { get; set; }

    public RankingChoice()
    {
    }
}
