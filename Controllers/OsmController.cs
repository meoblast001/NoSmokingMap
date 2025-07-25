using System.Net.Mime;
using Microsoft.AspNetCore.Mvc;
using NoSmokingMap.Models;
using NoSmokingMap.Models.Overpass;
using NoSmokingMap.Services;
using NoSmokingMap.Services.OpenStreetMap;

namespace NoSmokingMap.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces(MediaTypeNames.Application.Json)]
public class OsmController : Controller
{
    private readonly OsmApiService osmApiService;
    private readonly ElementUpdateService elementUpdateService;
    private readonly ILogger<OsmController> logger;

    public OsmController(OsmApiService osmApiService, ElementUpdateService elementUpdateService,
        ILogger<OsmController> logger)
    {
        this.osmApiService = osmApiService;
        this.elementUpdateService = elementUpdateService;
        this.logger = logger;
    }

    // Primarily used to test authentication.
    [Route("user_details")]
    public async Task<IActionResult> UserDetails()
    {
        OsmAccessToken? accessToken = OsmAuthService.GetAccessToken(Request.Cookies);
        if (accessToken == null)
        {
            return Unauthorized(OsmError.ErrorUnauthorized);
        }

        var userDetails = await osmApiService.GetUserDetailsAsync(accessToken);
        return Content(userDetails?.DisplayName ?? "None");
    }

    [Route("element")]
    public async Task<IActionResult> ReadElement(string elementId, OverpassElementType elementType)
    {
        if (!long.TryParse(elementId, out long elementIdNum))
        {
            return BadRequest(OsmError.ErrorParameterFormat(nameof(elementId)));
        }

        try
        {
            var osmElement = await osmApiService.ReadElementByIdAsync(elementType.ToOsmGeoType(), elementIdNum);
            var locationViewModel = LocationViewModel.TryCreate(osmElement);
            return Json(locationViewModel);
        }
        catch (OsmApiException ex)
        {
            logger.LogError(ex, "OSM API error");
            return StatusCode(500, OsmError.ErrorOsmApi(ex.Message));
        }
    }

    public class UpdateSmokingRequestParams
    {
        public required string ElementId { get; set; }
        public required OverpassElementType ElementType { get; set; }
        public required OverpassSmoking SmokingStatus { get; set; }
        public required string Comment { get; set; }
    }

    [Route("update_smoking")]
    [HttpPost]
    public async Task<IActionResult> UpdateSmoking([FromBody] UpdateSmokingRequestParams model)
    {
        OsmAccessToken? accessToken = OsmAuthService.GetAccessToken(Request.Cookies);
        if (accessToken == null)
        {
            return Unauthorized(OsmError.ErrorUnauthorized);
        }

        if (!long.TryParse(model.ElementId, out long elementIdNum))
        {
            return BadRequest(OsmError.ErrorParameterFormat(nameof(model.ElementId)));
        }

        try
        {
            await elementUpdateService.UpdateSmoking(accessToken, elementIdNum, model.ElementType, model.SmokingStatus,
                model.Comment);
            return Ok();
        }
        catch (OsmApiException ex)
        {
            logger.LogError(ex, "OSM API error");
            return StatusCode(500, OsmError.ErrorOsmApi(ex.Message));
        }
    }
}
