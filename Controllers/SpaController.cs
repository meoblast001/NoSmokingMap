using Microsoft.AspNetCore.Mvc;

namespace NoSmokingMap.Controllers;

public class SpaController : Controller
{
    public IActionResult Index()
    {
        return View();
    }
}
