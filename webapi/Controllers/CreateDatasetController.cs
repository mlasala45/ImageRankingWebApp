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
    public IActionResult CreateDataset([FromBody] CreateDatasetRequest requestBody)
    {
        //var str = "Received Create Database Request. Names: ";
        //foreach (var line in body) str += "\n" + line;
        //Console.WriteLine(str);

        var dataset = new UserDataset();
        dataset.Name = requestBody.Name;
        dataset.ImageNames = requestBody.ImageNames;
        dataset.TimeCreated = DateTime.Now;
        dataset.AuthorConnectionID = HttpContext.Connection.Id;

        Console.WriteLine($"[{dataset.AuthorConnectionID}] Created a new local dataset named '{dataset.Name}' with {dataset.ImageNames.Length} entries.");

        using (var context = new AppDatabaseContext())
        {
            //DatabaseUtility.GuaranteeWALAutoCheckpoint(context);

            var entry = context.Entry(dataset);

            context.Datasets.Add(dataset);
            context.SaveChanges();

            DatabaseUtility.ForceWALCheckpoint(context);

            var pk = entry.CurrentValues.GetValue<int>("UID");
            HttpContext.Session.SetInt32("ActiveDataset", pk);
        }

        return new OkResult();
    }

    /// <summary>
    /// Returns the entire entry for the active dataset, as JSON. Possible security concern?
    /// </summary>
    /// <returns></returns>
    [HttpGet]
    public IActionResult GetDataset()
    {
        var activeDatasetPk = HttpContext.Session.GetInt32("ActiveDataset")!;

        using (var context = new AppDatabaseContext())
        {
            var dataset = context.Datasets.Find(activeDatasetPk);
            return new JsonResult(
                dataset);
        }
    }

    [Serializable]
    public class CreateDatasetRequest
    {
        public string Name { get; set; }
        public string[] ImageNames { get; set; }
    }
}
