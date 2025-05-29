using System.Net.Mime;
using Microsoft.AspNetCore.Mvc;
using NoSmokingMap.Models;
using NoSmokingMap.Settings;

namespace NoSmokingMap.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces(MediaTypeNames.Application.Json)]
public class OverpassController : Controller
{
    private readonly OverpassModel overpassModel;
    private readonly OverpassSettings overpassSettings;

    public OverpassController(OverpassModel overpassModel, OverpassSettings overpassSettings)
    {
        this.overpassModel = overpassModel;
        this.overpassSettings = overpassSettings;
    }

    [Route("locations")]
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

    [Route("locations_by_terms")]
    public async Task<IActionResult> SearchLocationsTerms(string searchTerms)
    {
        await overpassModel.Update();

        var content = overpassModel.GetAmenitiesByKeywords(searchTerms);

        var overpassData = content.Select(LocationViewModel.TryCreate)
            .Where(element => element != null)
            .ToArray();
        return Json(overpassData);
    }

    [Route("locations_by_geoposition")]
    public async Task<IActionResult> SearchLocationsGeoposition(double lat, double lon)
    {
        await overpassModel.Update();

        var geocoordinates = new Geocoordinates(lat, lon);
        var content = overpassModel.GetAmenitiesWithinDistance(geocoordinates,
            overpassSettings.GeolocationMaxDistanceMeters);

        var overpassData = content.Select(LocationViewModel.TryCreate)
            .Where(element => element != null)
            .ToArray();
        return Json(overpassData);
    }
}
