import { Selector, ClientFunction } from "testcafe";
import { createScreenshotsComparer } from "devextreme-screenshot-comparer";
import { url, screenshotComparerOptions, frameworks, initSurvey, url_test } from "../../helper";

const title = "Panel Screenshot";

fixture`${title}`.page`${url}`.beforeEach(async (t) => {

});

const applyTheme = ClientFunction(theme => {
  (<any>window).Survey.StylesManager.applyTheme(theme);
});

const theme = "defaultV2";

frameworks.forEach(framework => {
  fixture`${framework} ${title} ${theme}`
    .page`${url_test}${theme}/${framework}.html`.beforeEach(async t => {
    await applyTheme(theme);
  });
  test("Check oridinary panel", async (t) => {
    await t.resizeWindow(1920, 1080);
    await initSurvey(framework, {
      questions: [
        {
          type: "panel",
          name: "delivery_details",
          title: "Please, specify the delivery details.",
          width: "708px",
          elements: [
            {
              type: "radiogroup",
              name: "delivery_agent",
              title: "Delivery agent",
              choices: ["DHL", "Pony Express", "FedEx"]
            },
            {
              type: "boolean",
              name: "delivery_speed",
              title: "Do you like to get the order as fast as it possible?"
            }
          ]
        },
      ]
    });
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const panelRoot = Selector(".sd-panel");
    await takeScreenshot("panel.png", panelRoot, screenshotComparerOptions);
    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
  test("Check panel expand/collapse", async (t) => {
    await t.resizeWindow(1920, 1080);
    await initSurvey(framework, {
      questions: [
        {
          type: "panel",
          name: "delivery_details",
          title: "Please, specify the delivery details.",
          width: "708px",
          state: "collapsed",
          elements: [
            {
              type: "radiogroup",
              name: "delivery_agent",
              title: "Delivery agent",
              choices: ["DHL", "Pony Express", "FedEx"]
            },
            {
              type: "boolean",
              name: "delivery_speed",
              title: "Do you like to get the order as fast as it possible?"
            }
          ]
        },
      ]
    });
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const panelRoot = Selector(".sd-panel");
    await takeScreenshot("panel-collapse.png", panelRoot, screenshotComparerOptions);
    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
    await t.click(panelRoot.find(".sd-panel__title"));
    await takeScreenshot("panel-expand.png", panelRoot, screenshotComparerOptions);
    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});