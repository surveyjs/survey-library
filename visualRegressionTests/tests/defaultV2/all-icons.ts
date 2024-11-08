import { Selector, ClientFunction } from "testcafe";
import { url, frameworks, initSurvey, url_test, takeElementScreenshot, wrapVisualTest } from "../../helper";

const title = "All Icons Screenshot";

fixture`${title}`.page`${url}`;

const applyTheme = ClientFunction(theme => {
  (<any>window).Survey.StylesManager.applyTheme(theme);
});

const theme = "defaultV2";

frameworks.forEach(framework => {
  fixture`${framework} ${title} ${theme}`
    .page`${url_test}${theme}/${framework}`
    .beforeEach(async t => {
      await applyTheme(theme);
    });

  test.skip("Check all icons", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);

      await initSurvey(framework, {
        pages: [{
          name: "page1",
          elements: [{
            type: "text",
            name: "question1"
          }]
        }]
      });

      await ClientFunction(() => {
        const svgContainer = document.createElement("div");
        svgContainer.id = "svgCointainer";
        document.body.appendChild(svgContainer);
        document.getElementById("surveyElement")!.style.display = "none";

        const svgCointainer = document.getElementById("svgCointainer");
        const symbols = document.getElementById("sv-icon-holder-global-container")!.querySelectorAll("symbol");

        function createSvg(id) {
          const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
          svg.classList.add("sv-svg-icon");
          svg.style.width = "48px";
          svg.style.height = "48px";

          const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
          svgCointainer!.appendChild(svg);
          svg.appendChild(use);
          use.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", `#${id}`);
        }

        symbols.forEach((symbol) => {
          createSvg(symbol.id);
        });
      })();

      await takeElementScreenshot("all-icons.png", Selector("#svgCointainer"), t, comparer);
    });
  });
});