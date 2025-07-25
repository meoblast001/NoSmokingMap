using Microsoft.AspNetCore.Mvc;
using NoSmokingMap.Settings;

namespace NoSmokingMap.Controllers;

public class SpaController : Controller
{
    private readonly MapSettings mapSettings;

    public SpaController(MapSettings mapSettings)
    {
        this.mapSettings = mapSettings;
    }

    public IActionResult Index()
    {
        ViewBag.DefaultCoordinates = new float[] { mapSettings.Center.X, mapSettings.Center.Y };
        return View();
    }
}
