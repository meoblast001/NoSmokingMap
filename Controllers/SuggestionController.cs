using System.Net.Mime;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using NoSmokingMap.Models.Database;
using NoSmokingMap.Models.Overpass;

namespace NoSmokingMap.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces(MediaTypeNames.Application.Json)]
public class SuggestionController : Controller
{
    ApplicationDbContext dbContext;

    public SuggestionController(ApplicationDbContext dbContext)
    {
        this.dbContext = dbContext;
    }

    public class SubmitRequestParams
    {
        public required string ElementId { get; set; }
        public required OverpassElementType ElementType { get; set; }
        public required OverpassSmoking SmokingStatus { get; set; }
        public required string Comment { get; set; }
    }

    [Route("submit")]
    [HttpPost]
    public async Task<ActionResult> Submit([FromBody] SubmitRequestParams requestParams)
    {
        if (!long.TryParse(requestParams.ElementId, out long elementIdNum))
        {
            return BadRequest();
        }

        var poiChanges = new PointOfInterestChanges()
        {
            Smoking = requestParams.SmokingStatus.ToString()
        };
        var poiEditSuggestion = new PointOfInterestEditSuggestionDbo()
        {
            ElementId = elementIdNum,
            ElementType = requestParams.ElementType.ToString(),
            Changes = JsonSerializer.Serialize(poiChanges),
            Comment = requestParams.Comment
        };
        dbContext.PoiEditSuggestions.Add(poiEditSuggestion);
        await dbContext.SaveChangesAsync();

        return Ok();
    }
}
