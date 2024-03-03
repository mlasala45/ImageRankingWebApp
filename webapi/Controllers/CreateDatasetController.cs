using Microsoft.AspNetCore.Mvc;
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
        dataset.imageNames = body;

        HttpContext.Session.Set("ActiveDataset", dataset.ToBytes());

        return new OkResult();
    }

    [HttpGet]
    public IActionResult GetDataset()
    {
        var activeDatasetBytes = HttpContext.Session.Get("ActiveDataset")!;
        return new JsonResult(
            UserDataset.JsonFromBytes(activeDatasetBytes));
    }
}
