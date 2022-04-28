import { Selector, ClientFunction } from "testcafe";
import { createScreenshotsComparer } from "devextreme-screenshot-comparer";
import { url, screenshotComparerOptions, frameworks, initSurvey, url_test, explicitErrorHandler, checkElementScreenshot } from "../../helper";

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
    await explicitErrorHandler();
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
  test("Check invisible panel when showInvisibleElements: true", async (t) => {
    await t.resizeWindow(1920, 1080);
    await initSurvey(framework, {
      questions: [
        {
          type: "panel",
          name: "delivery_details",
          title: "Please, specify the delivery details.",
          width: "708px",
          visible: false,
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
    await ClientFunction(()=>{ (<any>window).survey.showInvisibleElements = true; })();
    await ClientFunction(()=>{ document.body.focus(); })();
    await takeScreenshot("panel-invisible.png", panelRoot, screenshotComparerOptions);
    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });

  test("Check panel in row", async (t) => {
    await t.resizeWindow(1920, 1080);
    await initSurvey(framework, {
      "elements": [
        {
          type: "html",
          name: "question0",
          html: "HTML1",
          title: "Question title",
          titleLocation: "hidden"
        },
        {
          type: "panel",
          name: "name",
          showQuestionNumbers: "off",
          startWithNewLine: false,
          elements: [
            {
              type: "html",
              name: "question1",
              html: "HTML2",
              title: "Question title",
              titleLocation: "hidden"
            }
          ]
        }
      ]
    });
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const rowRoot = Selector(".sd-row");
    await ClientFunction(()=>{ (<any>window).survey.showInvisibleElements = true; })();
    await ClientFunction(()=>{ document.body.focus(); })();
    await takeScreenshot("panel-in-row.png", rowRoot, screenshotComparerOptions);
    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });

  test("Check panel with actions", async(t) => {
    await t.resizeWindow(1920, 1080);
    await initSurvey(framework, {
      "elements": [
        {
          type: "text",
          name: "question1",
          title: "Question title",
        }
      ]
    });
    await t.typeText(Selector(".sd-input"), "This is my answer");
    await ClientFunction(()=>{
      document.body.focus();
      (<any>window).survey.showPreview();
    })();
    const panelRoot = Selector(".sd-panel");
    await checkElementScreenshot("panel-with-actions.png", panelRoot, t);
  });
});