using Microsoft.AspNetCore.Mvc;
using NoSmokingMap.Services;

namespace NoSmokingMap.Controllers;

public class OsmAuthController : Controller
{
    private readonly OsmAuthService osmAuthService;

    public OsmAuthController(OsmAuthService osmAuthService)
    {
        this.osmAuthService = osmAuthService;
    }

    public IActionResult Login()
    {
        return Redirect(osmAuthService.GetRedirectLoginUrl().AbsoluteUri);
    }

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