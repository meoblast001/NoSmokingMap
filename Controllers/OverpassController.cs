using Microsoft.AspNetCore.Mvc;
using NoSmokingMap.Models;

namespace NoSmokingMap.Controllers;

public class OverpassController : Controller
{
    private readonly OverpassModel overpassModel;

    public OverpassController(OverpassModel overpassModel)
    {
        this.overpassModel = overpassModel;
    }

    public async Task<IActionResult> Locations()
    {
        var content = await overpassModel.FetchResultsAsync();
        if (content == null)
        {
            return Json(null);
        }

        var overpassData = content.Elements.Select(LocationViewModel.TryCreate)
            .Where(element => element != null)
            .ToArray();
        return Json(overpassData);
    }

    public IActionResult SearchLocationsTerms(string searchTerms)
    {
        Console.WriteLine($"Searching locations by terms: {searchTerms}");
        return Json(null);
    }

    public IActionResult SearchLocationsGeoposition(double lat, double lon)
    {
        Console.WriteLine($"Searching locations by geoposition: {lat}, {lon}");
        return Json(null);
    }
}