using Microsoft.AspNetCore.Mvc;
using NoSmokingMap.Settings;

namespace NoSmokingMap.Controllers;

public class SpaController : Controller
{
    private readonly MapSettings mapSettings;
    private readonly OsmSettings osmSettings;

    public SpaController(MapSettings mapSettings, OsmSettings osmSettings)
    {
        this.mapSettings = mapSettings;
        this.osmSettings = osmSettings;
    }

    public IActionResult Index()
    {
        ViewBag.ApplicationTitle = mapSettings.ApplicationTitle;
        ViewBag.DefaultCoordinates = new float[] { mapSettings.Center.X, mapSettings.Center.Y };
        ViewBag.OsmRegistrationUri = osmSettings.RegistrationUri;
        return View();
    }
}
