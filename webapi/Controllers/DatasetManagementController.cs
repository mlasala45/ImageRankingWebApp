using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.Extensions.Primitives;
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

    private EntityEntry InitializeDataset(AppDatabaseContext dbContext, string datasetName, string[] imageNames, bool isLocal)
    {
        var dataset = new ImageDataset();
        dataset.Name = datasetName;
        dataset.ImageNames = imageNames;
        dataset.TimeCreated = DateTime.UtcNow;
        dataset.AuthorUID = HttpContext.Session.GetString("UserId")!;
        dataset.IsAuthorGuest = HttpContext.Session.GetBool("IsUserGuest");
        dataset.AreImagesStoredInDatabase = !isLocal;

        var userStr = dataset.AuthorUID + (dataset.IsAuthorGuest ? " (Guest)" : "");
        var typeStr = isLocal ? "local" : "online";
        Console.WriteLine($"[{userStr}] Created a new {typeStr} dataset named '{dataset.Name}' with {dataset.ImageNames.Length} entries.");

        var entry = dbContext.Entry(dataset);

        dbContext.Datasets.Add(dataset);
        dbContext.SaveChanges();

        DatabaseUtility.ForceWALCheckpoint(dbContext);

        var pk = entry.CurrentValues.GetValue<int>("UID");
        HttpContext.Session.SetInt32("ActiveDataset", pk);

        var userId = HttpContext.Session.GetString("UserId");
        var userIsGuest = HttpContext.Session.GetBool("IsUserGuest");
        UserCommon userData = userIsGuest ? dbContext.GuestUsers.Find(userId) : dbContext.PermanentUsers.Find(userId);
        var list = new List<int>(userData.OwnedDatasets);
        list.Add(pk);
        userData.OwnedDatasets = list.ToArray();

        dbContext.SaveChanges();
        DatabaseUtility.ForceWALCheckpoint(dbContext);

        return entry;
    }

    [HttpPost("CreateLocalDataset")]
    public IActionResult CreateDataset([FromBody] CreateDatasetRequest requestBody)
    {
        Console.WriteLine("Throwaway Debug message to prompt file change");
        //var str = "Received Create Database Request. Names: ";
        //foreach (var line in body) str += "\n" + line;
        //Console.WriteLine(str);

        if (requestBody.ImageNames.Length < 2)
        {
            return new BadRequestResult();
        }

        using (var dbContext = new AppDatabaseContext())
        {
            var datasetEntry = InitializeDataset(dbContext, requestBody.Name, requestBody.ImageNames, true);

            var pk = datasetEntry.CurrentValues.GetValue<int>("UID");
            return new JsonResult(new { datasetKey = pk });
        }
    }

    [HttpPost("CreateOnlineDataset")]
    public IActionResult CreateOnlineDataset()
    {
        string datasetName;
        {
            StringValues sv;
            Request.Form.TryGetValue("DatasetName", out sv);
            datasetName = sv[0];
        }

        var numImages = Request.Form.Files.Count;
        OnlineDatasetImageStore imageStore = new();
        imageStore.Blobs = new byte[numImages][];

        int i = 0;
        var imageNames = new string[numImages];
        foreach (var formFile in Request.Form.Files)
        {
            imageNames[i] = formFile.FileName;
            using (MemoryStream memoryStream = new MemoryStream())
            {
                formFile.CopyTo(memoryStream);
                imageStore.Blobs[i] = memoryStream.ToArray();
            }
            i++;
        }

        using (var dbContext = new AppDatabaseContext())
        {
            var datasetEntry = InitializeDataset(dbContext, datasetName, imageNames, false);

            var pk = datasetEntry.CurrentValues.GetValue<int>("UID");

            imageStore.AssociatedDataset = pk;
            dbContext.OnlineDatasetImageStores.Add(imageStore);

            dbContext.SaveChanges();

            return new JsonResult(new { datasetKey = pk });
        }
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
    /// Also currently not used by anything
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
            if (Session.GetBool("IsUserGuest"))
            {
                var userId = Session.GetString("UserId");
                var userData = context.GuestUsers.Find(userId);
                var ownedDatasets = context.Datasets.Where(e => userData.OwnedDatasets.Contains(e.UID)).ToList();
                foreach (var dataset in ownedDatasets)
                {
                    var responseEntry = new DatasetsListResponseEntry();
                    responseEntry.IsLocalToClient = true;
                    responseEntry.Name = dataset.Name;
                    responseEntry.NumImages = dataset.ImageNames.Length;
                    responseEntry.DatasetKey = dataset.UID;

                    list.Add(responseEntry);
                }
            }
        }
        list.Sort((a, b) => a.Name.CompareTo(b.Name));
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
        public int DatasetKey { get; set; }
        public int NumImages { get; set; }
        public bool IsLocalToClient { get; set; }
    }
}
