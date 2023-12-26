import { Selector, ClientFunction } from "testcafe";
import { url, frameworks, initSurvey, url_test, wrapVisualTest, takeElementScreenshot, resetFocusToBody } from "../../helper";

const title = "Multipletext Screenshot";

fixture`${title}`.page`${url}`.beforeEach(async (t) => {

});

const applyTheme = ClientFunction(theme => {
  (<any>window).Survey.StylesManager.applyTheme(theme);
});

const theme = "defaultV2";

frameworks.forEach(framework => {
  fixture`${framework} ${title} ${theme}`
    .page`${url_test}${theme}/${framework}`.beforeEach(async t => {
    await applyTheme(theme);
  });
  test("Check multipletext question", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        width: "900px",
        questions: [
          {
            type: "multipletext",
            name: "q1",
            minWidth: "768px",
            maxWidth: "768px",
            width: "768px",
            title: "Personal Information",
            items: [
              {
                name: "item1",
                title: "Full Name"
              },
              {
                name: "item2",
                title: "Email Address"
              },
              {
                name: "item3",
                title: "ID"
              },
            ]
          },
        ]
      });

      const questionRoot = Selector(".sd-question");
      await takeElementScreenshot("mutlipletext.png", questionRoot, t, comparer);
      await t.click("input.sd-input");
      await takeElementScreenshot("mutlipletext-focus.png", questionRoot, t, comparer);
    });
  });
  test("Check multipletext question error", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        widthMode: "responsive",
        questions: [
          {
            type: "multipletext",
            name: "q1",
            minWidth: "1000px",
            maxWidth: "1000px",
            width: "1000px",
            colCount: 2,
            title: "Personal Information",
            items: [
              {
                name: "item1",
                isRequired: true,
                title: "Full Name"
              },
              {
                name: "item2",
                title: "Email Address"
              },
              {
                name: "item3",
                isRequired: true,
                title: "ID"
              },
            ]
          },
        ]
      });

      const questionRoot = Selector(".sd-question");
      await t.click(".sd-navigation__complete-btn");
      await resetFocusToBody();
      await takeElementScreenshot("mutlipletext-error-top.png", questionRoot, t, comparer);
      await ClientFunction(() => { (window as any).survey.getAllQuestions()[0].itemErrorLocation = "bottom"; })();
      await resetFocusToBody();
      await takeElementScreenshot("mutlipletext-error-bottom.png", questionRoot, t, comparer);
    });
  });
  test("Check multipletext itemTitleWidth", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        width: "900px",
        questions: [
          {
            type: "multipletext",
            name: "q1",
            itemTitleWidth: "400px",
            items: [
              {
                name: "item1",
                title: "A very long first item title"
              },
              {
                name: "item2",
                title: "A medium long title"
              },
              {
                name: "item3",
                title: "Short title"
              },
            ]
          },
        ]
      });

      const questionRoot = Selector(".sd-question");
      await takeElementScreenshot("mutlipletext-titlewidth.png", questionRoot, t, comparer);
    });
  });
});