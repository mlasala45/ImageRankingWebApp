using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Numerics;
using System.Text;
using System.Xml.Linq;

namespace webapi.Controllers;

[ApiController]
[Route("[controller]")]
public class DebugModeController : ControllerBase
{
    private readonly ILogger<DebugModeController> _logger;

    public DebugModeController(ILogger<DebugModeController> logger)
    {
        _logger = logger;
    }

    [HttpPost("SafeShutdown")]
    public IActionResult SafeShutdown()
    {
        using (var context = new AppDatabaseContext())
        {
            DatabaseUtility.ForceWALCheckpoint(context);
        }
        Environment.Exit(0);

        return new OkResult();
    }

    [HttpPost("DropDatasetsAll")]
    public IActionResult DropDatasetsAll()
    {
        using (var context = new AppDatabaseContext())
        {
            context.Datasets.ExecuteDelete();
            context.OnlineDatasetImageStores.ExecuteDelete();
            context.RankingChoices.ExecuteDelete();
            context.SaveChanges();
        }

        return new OkResult();
    }
}