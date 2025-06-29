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
    private readonly ILogger<OsmController> logger;

    public OsmController(OsmApiService osmApiService, ILogger<OsmController> logger)
    {
        this.osmApiService = osmApiService;
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
            var osmElement = await osmApiService.ReadElementByIdAsync(model.ElementType.ToOsmGeoType(), elementIdNum);

            var changeset = OsmChangesetFactory.Create($"Updating smoking status. User comment: {model.Comment}");
            long changesetId = await osmApiService.CreateChangeset(accessToken, changeset);

            osmElement.ChangeSetId = changesetId;
            osmElement.Tags["smoking"] = model.SmokingStatus.ToOsmTagString();

            await osmApiService.UpdateElementByIdAsync(accessToken, osmElement);

            await osmApiService.CloseChangeset(accessToken, changesetId);

            return Ok();
        }
        catch (OsmApiException ex)
        {
            logger.LogError(ex, "OSM API error");
            return StatusCode(500, OsmError.ErrorOsmApi(ex.Message));
        }
    }
}
