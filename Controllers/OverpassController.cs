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
        await overpassModel.Update();

        var content = overpassModel.GetAmenitiesBySmoking(Models.Overpass.OverpassSmoking.No)
            .Union(overpassModel.GetAmenitiesBySmoking(Models.Overpass.OverpassSmoking.Isolated))
            .Union(overpassModel.GetAmenitiesBySmoking(Models.Overpass.OverpassSmoking.Outside));

        var overpassData = content.Select(LocationViewModel.TryCreate)
            .Where(element => element != null)
            .ToArray();
        return Json(overpassData);
    }

    public async Task<IActionResult> SearchLocationsTerms(string searchTerms)
    {
        await overpassModel.Update();

        var content = overpassModel.GetAmenitiesByKeywords(searchTerms);

        var overpassData = content.Select(LocationViewModel.TryCreate)
            .Where(element => element != null)
            .ToArray();
        return Json(overpassData);
    }

    public IActionResult SearchLocationsGeoposition(double lat, double lon)
    {
        Console.WriteLine($"Searching locations by geoposition: {lat}, {lon}");
        return Json(null);
    }
}