using System.Net.Mime;
using Microsoft.AspNetCore.Mvc;
using NoSmokingMap.Models;
using NoSmokingMap.Models.Database;
using NoSmokingMap.Models.Overpass;
using NoSmokingMap.Services;
using NoSmokingMap.Services.OpenStreetMap;
using NoSmokingMap.Utilities;

namespace NoSmokingMap.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces(MediaTypeNames.Application.Json)]
public class SuggestionController : Controller
{
    private readonly ApplicationDbContext dbContext;
    private readonly OsmApiService osmApiService;
    private readonly ILogger<SuggestionController> logger;

    public SuggestionController(ApplicationDbContext dbContext, OsmApiService osmApiService,
        ILogger<SuggestionController> logger)
    {
        this.dbContext = dbContext;
        this.osmApiService = osmApiService;
        this.logger = logger;
    }

    [Route("list_all")]
    public async Task<IActionResult> ListAll(int offset, int limit)
    {
        var totalSuggestions = dbContext.PoiEditSuggestions.Count();
        var suggestions = dbContext.PoiEditSuggestions.Skip(offset).Take(limit)
            .AsEnumerable()
            .Select(dbo => (dbo, viewModel: SuggestionViewModel.Create(dbo)))
            .ToArray();

        try
        {
            var query = suggestions
                .Select(suggestion => (suggestion.dbo.ElementType.ToOsmGeoType(), suggestion.dbo.ElementId));
            var osmElements = await osmApiService.ReadElementsByIdsAsync(query);
            var locationViewModels = osmElements.Select(LocationViewModel.TryCreate)
                .WhereNotNull()
                .ToDictionary(model => model.Id);

            foreach (var suggestion in suggestions)
            {
                if (locationViewModels.TryGetValue(suggestion.dbo.ElementId, out var model))
                    suggestion.viewModel.Location = model;
            }
        }
        catch (OsmApiException ex)
        {
            logger.LogError(ex, "OSM API error");
            return StatusCode(500, OsmError.ErrorOsmApi(ex.Message));
        }

        var suggestionsPagination = new SuggestionsPaginationViewModel()
        {
            Suggestions = suggestions.Select(s => s.viewModel).ToArray(),
            TotalEntries = totalSuggestions
        };

        return Json(suggestionsPagination);
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
    public async Task<IActionResult> Submit([FromBody] SubmitRequestParams requestParams)
    {
        if (!long.TryParse(requestParams.ElementId, out long elementIdNum))
        {
            return BadRequest();
        }

        var poiChanges = new PointOfInterestChangesDbo()
        {
            Smoking = requestParams.SmokingStatus
        };
        var poiEditSuggestion = new PointOfInterestEditSuggestionDbo()
        {
            ElementId = elementIdNum,
            ElementType = requestParams.ElementType,
            Changes = poiChanges,
            Comment = requestParams.Comment
        };
        dbContext.PoiEditSuggestions.Add(poiEditSuggestion);
        await dbContext.SaveChangesAsync();

        return Ok();
    }
}
