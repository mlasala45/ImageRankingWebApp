using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Numerics;
using System.Xml.Linq;

namespace webapi.Controllers;

[ApiController]
[Route("[controller]")]
public class CreateDatasetController : ControllerBase
{
    private readonly ILogger<CreateDatasetController> _logger;

    public CreateDatasetController(ILogger<CreateDatasetController> logger)
    {
        _logger = logger;
    }

    [HttpPost]
    public IActionResult CreateDataset([FromBody] string[] body)
    {
        //var str = "Received Create Database Request. Names: ";
        //foreach (var line in body) str += "\n" + line;
        //Console.WriteLine(str);
        var name = HttpContext.Connection.Id;
        Console.WriteLine($"[{name}] Created a new local dataset with {body.Length} entries.");

        var dataset = new UserDataset();
        dataset.ImageNames = body;

        using (var context = new AppDatabaseContext())
        {
            //DatabaseUtility.GuaranteeWALAutoCheckpoint(context);

            context.Datasets.Add(dataset);
            context.SaveChanges();

            DatabaseUtility.ForceWALCheckpoint(context);
        }

        return new OkResult();
    }

    [HttpGet]
    public IActionResult GetDataset()
    {
        var activeDatasetBytes = HttpContext.Session.Get("ActiveDataset")!;

        using (var context = new AppDatabaseContext())
        {
            //context.Datasets.Add(dataset);
            //await context.SaveChangesAsync();
        }
        return new JsonResult(
            UserDataset.JsonFromBytes(activeDatasetBytes));
    }
}
