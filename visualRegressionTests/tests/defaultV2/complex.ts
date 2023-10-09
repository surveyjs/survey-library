import { Selector, ClientFunction } from "testcafe";
import { url, frameworks, initSurvey, url_test, wrapVisualTest, takeElementScreenshot } from "../../helper";

const title = "Complex Screenshot";

fixture`${title}`.page`${url}`.beforeEach(async (t) => {

});

const applyTheme = ClientFunction(theme => {
  (<any>window).Survey.StylesManager.applyTheme(theme);
});

const theme = "defaultV2";

const json = {
  showQuestionNumbers: "off",
  width: "900px",
  questions: [
    {
      type: "Paneldynamic",
      title: "My Order",
      name: "order",
      renderMode: "progressBottom",
      templateTitle: "{panel.itemName}",
      panelRemoveText: "Remove Item",
      panelCount: 5,
      minWidth: "708px",
      maxWidth: "708px",
      width: "708px",
      templateElements: [
        {
          type: "text",
          name: "itemName",
          title: "Item Name",
          defaultValue: "Converse Chuck Taylor"
        },
        {
          type: "text",
          name: "count",
          title: "Count",
          defaultValue: "1",
          startWithNewLine: false,
        },
        {
          type: "panel",
          name: "shipping",
          title: "Shipping",
          elements: [
            {
              type: "radiogroup",
              name: "delivery",
              title: "Delivery",
              choices: ["DHL", "Pony Express", "FedEx"],
              defaultValue: "FedEx"
            },
            {
              type: "boolean",
              name: "fast",
              title: "Would you like to get the order as fast as it possible?",
              defaultValue: true
            },
            {
              type: "matrix",
              name: "best_delivery",
              title: "What’s the best delivery time for you?",
              "columns": ["Morning", "Afternoon", "Evening"],
              "rows": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
              defaultValue: {
                "Monday": "Afternoon",
                "Tuesday": "Afternoon",
                "Wednesday": "Morning",
                "Thursday": "Morning",
                "Friday": "Evening"
              }
            }
          ]
        },
        {
          type: "panel",
          name: "blilling",
          title: "Billing",
          state: "collapsed",
          elements: [{ "type": "text", name: "dummy" }]
        }
      ]
    }
  ]
};

frameworks.forEach(framework => {
  fixture`${framework} ${title} ${theme}`
    .page`${url_test}${theme}/${framework}`.beforeEach(async t => {
    await applyTheme(theme);
  });
  test("Check complex question", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1800);
      await ClientFunction(() => { (window as any).Survey.surveyLocalization.locales.en.panelDynamicProgressText = "{0} of {1}"; })();
      await initSurvey(framework, json);
      await ClientFunction(() => {
        const panel = (window as any).survey.getQuestionByName("order");
        panel.currentIndex = 4;
      })();

      const questionRoot = Selector(".sd-question");
      await takeElementScreenshot("complex-question.png", questionRoot, t, comparer);
    });
  });
});

