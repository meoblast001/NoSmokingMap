using Microsoft.AspNetCore.Mvc;
using NoSmokingMap.Services;

namespace NoSmokingMap.Controllers;

[Route("osm_auth")]
public class OsmAuthController : Controller
{
    private readonly OsmAuthService osmAuthService;

    public OsmAuthController(OsmAuthService osmAuthService)
    {
        this.osmAuthService = osmAuthService;
    }

    [Route("login")]
    public IActionResult Login()
    {
        return Redirect(osmAuthService.GetRedirectLoginUrl().AbsoluteUri);
    }

    [Route("post_auth")]
    public async Task<IActionResult> PostAuth(string code)
    {
        var accessToken = await osmAuthService.RequestAccessToken(code);
        if (accessToken != null)
        {
            OsmAuthService.SetAccessToken(Response.Cookies, accessToken);
        }

        return Redirect("/");
    }
}
