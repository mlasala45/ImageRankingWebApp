using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Numerics;
using System.Text;
using System.Xml.Linq;

namespace webapi.Controllers;

[ApiController]
[Route("[controller]")]
public class ChoicesController : ControllerBase
{
    private readonly ILogger<ChoicesController> _logger;

    public ChoicesController(ILogger<ChoicesController> logger)
    {
        _logger = logger;
    }

    UserDataset GetDatasetLocal()
    {
        var activeDatasetPk = HttpContext.Session.GetInt32("ActiveDataset")!;

        using (var context = new AppDatabaseContext())
        {
            var dataset = context.Datasets.Find(activeDatasetPk);
            return dataset;
        }
    }

    [HttpGet("GetNextChoice")]
    public IActionResult GetNextChoice()
    {
        var dataset = GetDatasetLocal();
        var firstChoice = Random.Shared.Next(0, dataset.ImageNames.Length);
        var secondChoice = Random.Shared.Next(0, dataset.ImageNames.Length - 1);
        if (secondChoice >= firstChoice) secondChoice++;

        var name = HttpContext.Connection.Id;
        //Console.WriteLine($"[{name}]: GetNextChoice ({firstChoice},{secondChoice})");

        return new JsonResult(new
        {
            left = dataset.ImageNames[firstChoice],
            right = dataset.ImageNames[secondChoice]
        });
    }

    [HttpPost("ReportChoice")]
    public IActionResult ReportChoice([FromBody] ChoiceReport choiceReport)
    {
        UserChoices userChoices;
        if(HttpContext.Session.Keys.Contains("UserChoices"))
        {
            userChoices = UserChoices.FromBytes(HttpContext.Session.Get("UserChoices"));
        }
        else
        {
            userChoices = new UserChoices();
            userChoices.userUID = HttpContext.Connection.Id;
        }

        userChoices.choices.Add(choiceReport);
        Console.WriteLine($"[{userChoices.userUID}]: ReportChoice (choice={choiceReport.compareCode})");

        HttpContext.Session.Set("UserChoices", userChoices.ToBytes());

        return new OkResult();
    }
}

public class ChoiceReport
{
    public int compareCode { get; set; }
    public string left { get; set; }
    public string right { get; set; }
}

public class UserChoices
{
    public string userUID;
    public List<ChoiceReport> choices = new();

    public byte[] ToBytes()
    {
        var json = JsonConvert.SerializeObject(this);
        return ASCIIEncoding.ASCII.GetBytes(json);
    }

    public static UserChoices FromBytes(byte[] bytes)
    {
        var json = JsonFromBytes(bytes);
        return JsonConvert.DeserializeObject<UserChoices>(json);
    }

    public static string JsonFromBytes(byte[] bytes)
    {
        return ASCIIEncoding.ASCII.GetString(bytes);
    }
}