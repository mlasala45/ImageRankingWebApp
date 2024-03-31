using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.Data;
using System.Numerics;
using System.Text;
using System.Xml.Linq;

namespace webapi.Controllers;

[ApiController]
[Route("[controller]")]
public class RankingController : ControllerBase
{
    private readonly ILogger<RankingController> _logger;

    public RankingController(ILogger<RankingController> logger)
    {
        _logger = logger;
    }

    private float CalulcateNaiveCertainty(uint numChoices, uint datasetSize)
    {
        return 1f - MathF.Pow(0.05f, numChoices / (float) datasetSize);
    }

    [HttpGet("GetDatasetRankings")]
    public IActionResult GetDatasetRankings(bool all=true, int num_per_page = 50, int page = 0)
    {
        if(!all) return new BadRequestResult();

        var Session = HttpContext.Session;
        var userId = Session.GetString("UserId")!;

        var activeDatasetPk = HttpContext.Session.GetInt32("ActiveDataset")!;

        using (var context = new AppDatabaseContext())
        {
            var dataset = context.Datasets.Find(activeDatasetPk);

            var response = new DatasetRankingsResponse();
            response.rankings = new SingleImageRankingResponse[dataset.ImageNames.Length];
            response.num_total = dataset.ImageNames.Length;
            response.num_per_page = response.num_total;
            response.page = 0;

            //Naive Ranking Algorithm

            var choices = context.RankingChoices
                .Where(e => e.datasetKey == activeDatasetPk)
                .ToList()!;

            var numLesser = new uint[dataset.ImageNames.Length];
            var numGreater = new uint[dataset.ImageNames.Length];
            foreach (var choiceData in choices)
            {
                if(choiceData.choice == 0) continue;
                var lesser = choiceData.promptLeftIndex;
                var greater = choiceData.promptRightIndex;
                if(choiceData.choice == 1)
                {
                    (lesser,greater) = (greater,lesser);
                }
                numLesser[greater]++;
                numGreater[lesser]++;
            }

            var list = new List<SingleImageRankingResponse>(dataset.ImageNames.Length);
            for (int i = 0; i < dataset.ImageNames.Length; i++)
            {
                var entry = new SingleImageRankingResponse(dataset.ImageNames[i]);
                var numChoices = numLesser[i] + numGreater[i];
                entry.Ranking = numChoices == 0 ? 0.5f : numLesser[i] / (float)(numChoices);
                entry.Certainty = CalulcateNaiveCertainty(numChoices, (uint)dataset.ImageNames.Length);

                list.Add(entry);
            }
            list.Sort((a,b) => -a.Certainty.CompareTo(b.Certainty)); //Sort descending
            response.rankings = list.ToArray();
            for (int i = 0; i < response.rankings.Length; i++) response.rankings[i].Id = i;

            return new JsonResult(response);
        }
    }
}

public class SingleImageRankingResponse
{
    public int Id { get; set; }
    public string ImageName { get; set; }
    public float Ranking { get; set; }
    public float Certainty { get; set; }

    public SingleImageRankingResponse(string imageName)
    {
        this.ImageName = imageName;
    }
}

public class DatasetRankingsResponse
{
    public SingleImageRankingResponse[] rankings { get; set; }
    public int num_total { get; set; }
    public int num_per_page { get; set; }
    public int page { get; set; }
}