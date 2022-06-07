import { Selector, ClientFunction } from "testcafe";
import { url, frameworks, initSurvey, url_test, checkElementScreenshot, explicitErrorHandler } from "../../helper";

const title = "Survey Screenshot";

fixture`${title}`.page`${url}`;

const applyTheme = ClientFunction(theme => {
  (<any>window).Survey.StylesManager.applyTheme(theme);
});

const theme = "defaultV2";

const json = {
  "title": "Minimum data reporting form – for suspected and probable cases of COVID-19",
  "pages": [{
    "name": "page1",
    "navigationTitle": "Sign In",
    "navigationDescription": "... to continue purchasing.",
    "elements": [
      {
        "name": "q1",
        type: "text"
      }
    ]
  }, {
    "name": "page2",
    "navigationTitle": "Shipping",
    "title": "Shipping",
    "navigationDescription": "Enter shipping information.",
    "elements": [
      {
        "type": "radiogroup",
        "name": "q1",
        "title": "Select a shipping method.",
        "choices": ["FedEx", "DHL", "USP", "In-Store Pickup"]
      },
    ]
  }, {
    "name": "page3",
    "navigationTitle": "Payment",
    "navigationDescription": "Select a payment method.",
    "elements": [
      {
        "name": "q1",
        type: "text"
      }
    ]
  }, {
    "name": "page4",
    "navigationTitle": "Gift Options",
    "navigationDescription": "Choose your gift.",
    "elements": [
      {
        "name": "q1",
        type: "text"
      }
    ]
  }, {
    "name": "page5",
    "navigationTitle": "Place Order",
    "navigationDescription": "Finish your purchasing.",
    "elements": [{
      "name": "q1",
      type: "text"
    }]
  }],
  "showProgressBar": "top",
  "progressBarType": "buttons"
};

frameworks.forEach(framework => {
  fixture`${framework} ${title} ${theme}`
    .page`${url_test}${theme}/${framework}.html`
    .beforeEach(async t => {
      await explicitErrorHandler();
      await applyTheme(theme);
    });

  test("Check survey title", async (t) => {
    await t.resizeWindow(800, 600);
    await initSurvey(framework, {
      title: "Survey Title",
      widthMode: "responsive",
      questions: [
        {
          type: "text",
          title: "Question title",
          name: "q1"
        }
      ]
    });
    await checkElementScreenshot("survey-title.png", Selector(".sd-title"), t);
    await ClientFunction(() => {
      (<any>window).survey.description = "descr";
    })();
    await checkElementScreenshot("survey-title-descr.png", Selector(".sd-title"), t);
    await checkElementScreenshot("survey-body.png", Selector(".sd-body"), t);
    await checkElementScreenshot("survey-with-title.png", Selector(".sd-container-modern"), t); // title
  });
  test("Check survey with progress top", async (t) => {
    await t.resizeWindow(1920, 1080);
    await initSurvey(framework, json);
    await ClientFunction(() => {
      (<any>window).survey.progressBarType = "pages";
      (<any>window).survey.currentPageNo = 1;
    })();
    await checkElementScreenshot("survey-progress-bar-top.png", Selector(".sd-container-modern"), t); // title + progress
  });
  test("Check survey with progress top buttons", async (t) => {
    await t.resizeWindow(1920, 1080);
    await initSurvey(framework, json);
    await t.click(Selector("li").nth(1));
    await checkElementScreenshot("survey-progress-bar-top-buttons.png", Selector(".sd-container-modern"), t);
  });
  test("Check survey with progress top buttons", async (t) => {
    await t.resizeWindow(1920, 1080);
    await initSurvey(framework, json);
    await ClientFunction(() => {
      (<any>window).survey.progressBarType = "pages";
      (<any>window).survey.currentPageNo = 1;
      (<any>window).survey.addNavigationItem({
        title: "Save",
        action: () => { }
      });
    })();
    await checkElementScreenshot("survey-custom-navigation.png", Selector(".sd-container-modern"), t);
  });
  test("Check survey without title and with progress", async (t) => {
    await t.resizeWindow(1920, 1080);
    await initSurvey(framework, {
      pages: [{
        name: "page1",
        elements: [
          {
            name: "q1",
            type: "text"
          }
        ]
      }],
      showProgressBar: "top"
    });
    await checkElementScreenshot("survey-without-tilte-and-with-progress.png", Selector(".sd-container-modern"), t); // progress
  });
  test("Check survey without title and progress", async (t) => {
    await t.resizeWindow(1920, 1080);
    await initSurvey(framework, {
      pages: [{
        name: "page1",
        elements: [
          {
            name: "q1",
            type: "text"
          }
        ]
      }]
    });
    await checkElementScreenshot("survey-without-tilte-and-progress.png", Selector(".sd-container-modern"), t); // without title and progress
  });
});