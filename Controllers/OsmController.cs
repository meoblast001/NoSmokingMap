using System.Net.Mime;
using Microsoft.AspNetCore.Mvc;
using NoSmokingMap.Models;
using NoSmokingMap.Models.Overpass;
using NoSmokingMap.Services;

namespace NoSmokingMap.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces(MediaTypeNames.Application.Json)]
public class OsmController : Controller
{
    private readonly OsmApiService osmApiService;

    public OsmController(OsmApiService osmApiService)
    {
        this.osmApiService = osmApiService;
    }

    [Route("user_details")]
    public async Task<IActionResult> UserDetails()
    {
        OsmAccessToken? accessToken = OsmAuthService.GetAccessToken(Request.Cookies);
        if (accessToken == null)
        {
            return Content("Must login");
        }

        var userDetails = await osmApiService.GetUserDetailsAsync(accessToken);
        return Content(userDetails?.DisplayName ?? "None");
    }

    [Route("update_smoking")]
    public async Task<IActionResult> UpdateSmoking(string elementId, OverpassElementType elementType,
        OverpassSmoking smokingStatus)
    {
        OsmAccessToken? accessToken = OsmAuthService.GetAccessToken(Request.Cookies);
        if (accessToken == null)
        {
            return Content("Must login");
        }

        if (!long.TryParse(elementId, out long elementIdNum))
        {
            return Content("Not a number");
        }

        var osmGeo = await osmApiService.GetElementByIdAsync(accessToken, elementType.ToOsmGeoType(),
            elementIdNum);
        if (osmGeo == null)
        {
            return Content("No geo");
        }

        long changesetId = await osmApiService.CreateChangeset(accessToken);

        osmGeo.ChangeSetId = changesetId;
        osmGeo.Tags["smoking"] = smokingStatus.ToOsmTagString();

        bool success = await osmApiService.UpdateElementByIdAsync(accessToken, elementType.ToOsmGeoType(), elementIdNum,
            osmGeo);

        if (!success)
        {
            return Content("Failure");
        }

        success = await osmApiService.CloseChangeset(accessToken, changesetId);

        return Content(success.ToString());
    }
}
