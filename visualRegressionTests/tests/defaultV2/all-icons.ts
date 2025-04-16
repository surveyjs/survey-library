import { Selector, ClientFunction } from "testcafe";
import { url, frameworks, initSurvey, takeElementScreenshot, wrapVisualTest } from "../../helper";

const title = "All Icons Screenshot";

fixture`${title}`.page`${url}`;

frameworks.forEach(framework => {
  fixture`${framework} ${title}`.page`${url}${framework}`;

  test.skip("Check all icons", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);

      await initSurvey(framework, {
        showQuestionNumbers: "on",
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
        const surveyElement = document.getElementById("surveyElement");
        if (!!surveyElement) {
          surveyElement.style.display = "none";
        }

        const svgCointainer = document.getElementById("svgCointainer");
        const globalContainer = document.getElementById("sv-icon-holder-global-container");
        let symbols;
        if (!!globalContainer) {
          symbols = globalContainer.querySelectorAll("symbol");
        }

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
      })();

      await takeElementScreenshot("all-icons.png", Selector("#svgCointainer"), t, comparer);
    });
  });
});