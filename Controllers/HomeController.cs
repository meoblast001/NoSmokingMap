using System.Diagnostics;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using NoSmokingMap.Models;

namespace NoSmokingMap.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> logger;
    private readonly OverpassModel overpassModel;

    public HomeController(ILogger<HomeController> logger, OverpassModel overpassModel)
    {
        this.logger = logger;
        this.overpassModel = overpassModel;
    }

    public async Task<IActionResult> Index()
    {
        var content = await overpassModel.FetchResultsAsync();
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

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
