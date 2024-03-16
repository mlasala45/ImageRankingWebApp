using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Numerics;
using System.Xml.Linq;

namespace webapi.Controllers;

[ApiController]
[Route("[controller]")]
public class DatasetManagementController : ControllerBase
{
    private readonly ILogger<DatasetManagementController> _logger;

    public DatasetManagementController(ILogger<DatasetManagementController> logger)
    {
        _logger = logger;
    }

    [HttpPost("CreateDataset")]
    public IActionResult CreateDataset([FromBody] CreateDatasetRequest requestBody)
    {
        //var str = "Received Create Database Request. Names: ";
        //foreach (var line in body) str += "\n" + line;
        //Console.WriteLine(str);

        var dataset = new ImageDataset();
        dataset.Name = requestBody.Name;
        dataset.ImageNames = requestBody.ImageNames;
        dataset.TimeCreated = DateTime.Now;
        dataset.AuthorUID = HttpContext.Session.GetString("UserId")!;
        dataset.IsAuthorGuest = HttpContext.Session.GetBool("IsUserGuest");

        var userStr = dataset.AuthorUID + (dataset.IsAuthorGuest ? " (Guest)" : "");
        Console.WriteLine($"[{userStr}] Created a new local dataset named '{dataset.Name}' with {dataset.ImageNames.Length} entries.");

        using (var context = new AppDatabaseContext())
        {
            var entry = context.Entry(dataset);

            context.Datasets.Add(dataset);
            context.SaveChanges();

            DatabaseUtility.ForceWALCheckpoint(context);

            var pk = entry.CurrentValues.GetValue<int>("UID");
            HttpContext.Session.SetInt32("ActiveDataset", pk);

            var userData = context.GuestUsers.Find(HttpContext.Session.GetString("UserId"));
            var list = new List<int>(userData.OwnedDatasets);
            list.Add(pk);
            userData.OwnedDatasets = list.ToArray();

            context.SaveChanges();
            DatabaseUtility.ForceWALCheckpoint(context);
        }

        return new OkResult();
    }


    [HttpPost("SetActiveDataset")]
    public IActionResult SetActiveDataset(int id)
    {
        var datasetPk = id;
        using (var context = new AppDatabaseContext())
        {
            if (context.Datasets.Count(e => e.UID == datasetPk) == 0)
            {
                //The dataset does not exist. Don't tell the user that.
                return new ForbidResult();
            }

            //TODO: Check if the user is permitted to access this dataset
        }

        HttpContext.Session.SetInt32("ActiveDataset", datasetPk);
        return new OkResult();
    }

    /// <summary>
    /// Returns the entire entry for the active dataset, as JSON. Possible security concern?
    /// </summary>
    /// <returns></returns>
    [HttpGet("GetDataset")]
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

    [HttpGet("GetPersonalDatasetsList")]
    public IActionResult GetPersonalDatasetsList()
    {
        var Session = HttpContext.Session;

        var list = new List<DatasetsListResponseEntry>();
        using (var context = new AppDatabaseContext())
        {
            if(Session.GetBool("IsUserGuest"))
            {
                var userId = Session.GetString("UserId");
                var userData = context.GuestUsers.Find(userId);
                var ownedDatasets = context.Datasets.Where(e => userData.OwnedDatasets.Contains(e.UID)).ToList();
                foreach(var dataset in ownedDatasets)
                {
                    var responseEntry = new DatasetsListResponseEntry();
                    responseEntry.IsLocalToClient = true;
                    responseEntry.Name = dataset.Name;
                    responseEntry.NumImages = dataset.ImageNames.Length;
                    responseEntry.UID = dataset.UID;

                    list.Add(responseEntry);
                }
            }
        }
        list.Sort((a,b) =>  a.Name.CompareTo(b.Name));
        return new JsonResult(list);
    }

    [Serializable]
    public class CreateDatasetRequest
    {
        public string Name { get; set; }
        public string[] ImageNames { get; set; }
    }

    [Serializable]
    public class DatasetsListResponseEntry
    {
        public string Name { get; set; }
        public int UID { get; set; }
        public int NumImages { get; set; }
        public bool IsLocalToClient { get; set; }
}
}
