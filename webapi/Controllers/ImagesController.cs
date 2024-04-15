using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MimeDetective;
using Newtonsoft.Json;
using System.Numerics;
using System.Text;
using System.Xml.Linq;

namespace webapi.Controllers;

[ApiController]
[Route("[controller]")]
public class ImagesController : ControllerBase
{
    private readonly ILogger<DebugModeController> _logger;

    public ImagesController(ILogger<DebugModeController> logger)
    {
        _logger = logger;
    }

    public bool DoesUserHaveAccessAuthority(int datasetKey)
    {
        var activeDatasetPk = HttpContext.Session.GetInt32("ActiveDataset")!;
        return activeDatasetPk == datasetKey;
    }

    [HttpGet("GetImage")]
    public IActionResult GetImage(int datasetKey, string imageKey)
    {
        if(!DoesUserHaveAccessAuthority(datasetKey))
        {
            return Forbid();
        }
        using (var context = new AppDatabaseContext())
        {
            var dataset = context.Datasets.Where(d => d.UID == datasetKey).First();
            if(!dataset.ImageNames.Contains(imageKey))
            {
                return new NotFoundResult();
            }
            if (!dataset.AreImagesStoredInDatabase) return new StatusCodeResult(400); //Invalid Operation

            var imageIndex = Array.IndexOf(dataset.ImageNames, imageKey);
            var imageStore = context.OnlineDatasetImageStores.Where(e => e.AssociatedDataset == datasetKey).First();
            var blob = imageStore.Blobs[imageIndex];

            var mimeType = MimeDetectorUtil.InspectBlob(ref blob);
            //TODO: Block unauthorized file types
            return File(blob, mimeType);
        }
    }
}