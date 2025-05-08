using Microsoft.AspNetCore.Mvc;
using NoSmokingMap.Models;
using NoSmokingMap.Services;

namespace NoSmokingMap.Controllers;

public class OsmController : Controller
{
    private readonly OsmApiService osmApiService;

    public OsmController(OsmApiService osmApiService)
    {
        this.osmApiService = osmApiService;
    }

    public async Task<IActionResult> OsmUserDetails()
    {
        OsmAccessToken? accessToken = OsmAuthService.GetAccessToken(Request.Cookies);
        if (accessToken == null)
        {
            return Content("Must login");
        }

        return Content(await osmApiService.GetUserDetailsAsync(accessToken));
    }
}
