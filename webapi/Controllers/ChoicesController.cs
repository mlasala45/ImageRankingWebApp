using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Data;
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

    ImageDataset GetDatasetLocal()
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
            right = dataset.ImageNames[secondChoice],
            leftKey = firstChoice,
            rightKey = secondChoice
        });
    }

    [HttpPost("ReportChoice")]
    public IActionResult ReportChoice([FromBody] ChoiceReport choiceReport)
    {
        var Session = HttpContext.Session;

        RankingChoice choice = new();
        choice.TimeStamp = DateTime.Now;

        choice.datasetKey = Session.GetInt32("ActiveDataset")!.Value;
        choice.user = Session.GetString("UserId")!;

        choice.promptLeftIndex = choiceReport.leftKey;
        choice.promptRightIndex = choiceReport.rightKey;
        choice.choice = choiceReport.compareCode;

        using (var context = new AppDatabaseContext())
        {
            context.RankingChoices.Add(choice);
            context.SaveChanges();
        }

        return new OkResult();
    }

    [HttpGet("GetChoiceHistory")]
    public IActionResult GetChoiceHistory(int num_per_page = 50, int page = 0)
    {
        var Session = HttpContext.Session;
        var userId = Session.GetString("UserId")!;
        using (var context = new AppDatabaseContext())
        {
            var allUserChoicesQuery = context.RankingChoices.Where(e => e.user == userId);
            var userChoices = allUserChoicesQuery
                .OrderByDescending(e => e.TimeStamp)
                .Skip(num_per_page * page)
                .Take(num_per_page)
                .ToList();
            var response = new ChoiceHistoryResponse();
            response.choices = userChoices.ToArray();
            response.page = page;
            response.num_per_page = num_per_page;
            response.num_total = allUserChoicesQuery.Count();
            return new JsonResult(response);
        }
    }
}

public class ChoiceReport
{
    public int compareCode { get; set; }
    public int leftKey { get; set; }
    public int rightKey { get; set; }
}

public class ChoiceHistoryResponse
{
    public RankingChoice[] choices { get; set; }
    public int num_total { get; set; }
    public int num_per_page { get; set; }
    public int page { get; set; }
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