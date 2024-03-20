using Microsoft.AspNetCore.Mvc;
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
}