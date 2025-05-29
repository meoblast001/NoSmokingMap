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
    private class OsmError
    {
        public required string Type { get; set; }
        public required string Message { get; set; }

        public static OsmError ErrorUnauthorized => new OsmError { Type = "unauthorized", Message = "Must login" };
        public static OsmError ErrorParameterFormat(string parameterName) =>
            new OsmError { Type = "parameter-format", Message = $"Parameter format wrong [{parameterName}]" };
        public static OsmError ErrorOsmApi(string subMessage) =>
            new OsmError { Type = "osm-api", Message = $"OSM error :: {subMessage}" };
    }

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

    [Route("update_smoking")]
    public async Task<IActionResult> UpdateSmoking(string elementId, OverpassElementType elementType,
        OverpassSmoking smokingStatus, string comment)
    {
        OsmAccessToken? accessToken = OsmAuthService.GetAccessToken(Request.Cookies);
        if (accessToken == null)
        {
            return Unauthorized(OsmError.ErrorUnauthorized);
        }

        if (!long.TryParse(elementId, out long elementIdNum))
        {
            return BadRequest(OsmError.ErrorParameterFormat(nameof(elementId)));
        }

        try
        {
            var osmElement = await osmApiService.GetElementByIdAsync(elementType.ToOsmGeoType(), elementIdNum);

            var changeset = OsmChangesetFactory.Create($"Updating smoking status. User comment: {comment}");
            long changesetId = await osmApiService.CreateChangeset(accessToken, changeset);

            osmElement.ChangeSetId = changesetId;
            osmElement.Tags["smoking"] = smokingStatus.ToOsmTagString();

            await osmApiService.UpdateElementByIdAsync(accessToken, osmElement);

            await osmApiService.CloseChangeset(accessToken, changesetId);
        }
        catch (OsmApiException ex)
        {
            logger.LogError(ex, "OSM API error");
            return StatusCode(500, OsmError.ErrorOsmApi(ex.Message));
        }

        return Ok();
    }
}
