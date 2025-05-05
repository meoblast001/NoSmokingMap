using System.Diagnostics;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using NoSmokingMap.Models;
using NoSmokingMap.Services;

namespace NoSmokingMap.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> logger;
    private readonly OverpassModel overpassModel;
    private readonly OsmApiService osmApiService;

    public HomeController(ILogger<HomeController> logger, OverpassModel overpassModel, OsmApiService osmApiService)
    {
        this.logger = logger;
        this.overpassModel = overpassModel;
        this.osmApiService = osmApiService;
    }

    public async Task<IActionResult> Index()
    {
        var content = await overpassModel.FetchResultsAsync();
        if (content == null)
        {
            return Error();
        }
        var overpassData = content.Elements.Select(LocationViewModel.TryCreate)
            .Where(element => element != null)
            .ToArray();
        ViewBag.Overpass = overpassData;
        ViewBag.OverpassJson = JsonSerializer.Serialize(overpassData);
        return View();
    }

    public IActionResult Privacy()
    {   
        return View();
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

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
