import { test, expect } from "@playwright/test";
import { compareScreenshot, frameworks, initSurvey, resetFocusToBody, url } from "../e2e/helper";

const title = "All Icons Screenshot";

frameworks.forEach(framework => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("Check all icons", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });

      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        pages: [{
          name: "page1",
          elements: [{
            type: "text",
            name: "question1"
          }]
        }]
      });

      await page.evaluate(() => {
        const svgContainer = document.createElement("div");
        svgContainer.id = "svgCointainer";
        document.body.appendChild(svgContainer);
        // eslint-disable-next-line surveyjs/eslint-plugin-i18n/allowed-in-shadow-dom
        const surveyElement = document.querySelector("#surveyElement");
        if (!!surveyElement) {
          surveyElement.style.display = "none";
        }

        const svgCointainer = (window as any).survey.rootElement.getRootNode().getElementById("svgCointainer");
        const globalContainer = (window as any).survey.rootElement.getRootNode().getElementById("sv-icon-holder-global-container");
        let symbolsPseudoArray;
        if (!!globalContainer) {
          symbolsPseudoArray = globalContainer.querySelectorAll("symbol");
        }
        let symbols:HTMLElement[] = [];
        symbolsPseudoArray.forEach((symbol) => {
          symbols.push(symbol);
        });
        symbols.sort((a, b)=>{ return a.id > b.id ? 1 : -1; });

        function createSvg(id) {
          const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
          svg.classList.add("sv-svg-icon");
          svg.style.width = "48px";
          svg.style.height = "48px";

          const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
          if (!!svgCointainer) {
            svgCointainer.appendChild(svg);
          }
          svg.appendChild(use);
          use.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", `#${id}`);
        }

        symbols.forEach((symbol) => {
          createSvg(symbol.id);
        });
      });

      await compareScreenshot(page, page.locator("#svgCointainer"), "all-icons.png");
    });
  });
});