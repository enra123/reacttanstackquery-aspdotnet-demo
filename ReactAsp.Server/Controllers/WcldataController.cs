using Microsoft.AspNetCore.Mvc;
using AngleSharp;
using PuppeteerSharp;
using reactdotnet.Server.Models;
using System.Text.Json;
using AngleSharp.Html.Dom;
using AngleSharp.Dom;

namespace ReactAsp.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WclscrapeController : ControllerBase
    {

        private readonly IBrowsingContext _browsingContext;
        private readonly ILogger<WclscrapeController> _logger;

        public WclscrapeController(IBrowsingContext browsingContext, ILogger<WclscrapeController> logger)
        {
            _browsingContext = browsingContext;
            _logger = logger;
        }

        [HttpGet(Name = "GetWcldata")]
        public async Task<IEnumerable<Wcldata>> Get(string url)
        {
            var results = new List<Wcldata>();

            // Download the browser executable
            await new BrowserFetcher().DownloadAsync();

            // Browser execution configs
            var launchOptions = new LaunchOptions
            {
                Headless = true, // run browser in headless mode
            };

            // Open a new page in the controlled browser
            using (var browser = await Puppeteer.LaunchAsync(launchOptions))
            using (var page = await browser.NewPageAsync())
            {
                // Visit the target page
                await page.GoToAsync(url, new NavigationOptions { Timeout = 50000 });

                // Wait for configured seconds for the products to load
                await page.WaitForSelectorAsync("img.death-event-ability-icon");

                // Get the fully rendered content after JavaScript rendering
                var contentAfterRender = await page.GetContentAsync();

                // Create a new browsing context with AngleSharp
                var context = BrowsingContext.New(Configuration.Default);

                // Open a document with the rendered HTML content
                var document = await context.OpenAsync(req => req.Content(contentAfterRender));

                // Select required HTML elements
                var productElements = document.QuerySelectorAll("table.events-table tr");

                var key = 0;

                foreach (var productElement in productElements)
                {
                    var time = productElement.QuerySelector("td.main-table-number");
                    var ability = productElement.QuerySelector("td.event-ability-cell");

                    if (time == null || ability == null) continue;

                    var anchor = ability.QuerySelector< IHtmlAnchorElement>("a");
                    var img = ability.QuerySelector<IHtmlImageElement>("img");
                    var m = 1;
                    var seconds = 0;
                    foreach (var t in time.TextContent.Split('.').First().Split(':').Reverse())
                    {
                        seconds += Int32.Parse(t) * m;
                        m *= 60;
                    }

                        var wcldata = new Wcldata
                    {
                        Key = key++,
                        Time = seconds,
                        AbilityId = anchor.Href.Split('=').Last(),
                        AbilityName = anchor.TextContent,
                        ImgUrl = img.Source,
                    }; 

                    results.Add(wcldata);
                }
            }

            return results;
        }

    }
}