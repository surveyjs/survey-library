import { frameworks, url, initSurvey } from "../helper";
import { Selector, ClientFunction, fixture, test } from "testcafe";
const title = "page";

frameworks.forEach(framework => {
  fixture`${framework} ${title}`
    .page`${url}${framework}`.beforeEach(async t => {});

  const setSurveyInDesignMode = ClientFunction(() => {
    window["survey"].setDesignMode(true);
    window["survey"].render();
  });

  const addPageDescriptionClass = ClientFunction(
    () => (window["Survey"].defaultStandardCss.page.description = "sv_page_description")
  );

  test("page title", async t => {
    var json = {
      pages: [
        {
          title: "Page title",
          questions: [
            {
              titleLocation: "hidden",
              type: "text",
              name: "simple text"
            }
          ]
        }
      ]
    };

    await initSurvey(framework, json);
    await t.expect(Selector(".sv_page_title").exists).ok();

    await setSurveyInDesignMode();
    await t.expect(Selector(".sv_page_title").exists).ok();
  });

  test("page description", async t => {
    await addPageDescriptionClass();
    var json = {
      pages: [
        {
          description: "Page description",
          questions: [
            {
              titleLocation: "hidden",
              type: "text",
              name: "simple text"
            }
          ]
        }
      ]
    };

    await initSurvey(framework, json);

    await t.expect(Selector(".sv_page_description").exists).ok();
    await setSurveyInDesignMode();
    await t.expect(Selector(".sv_page_description").exists).ok();
  });

  test("page title empty", async t => {
    var json = {
      pages: [
        {
          title: "",
          questions: [
            {
              titleLocation: "hidden",
              type: "text",
              name: "simple text"
            }
          ]
        }
      ]
    };

    await initSurvey(framework, json);

    await t.expect(Selector(".sv_page_title").exists).notOk();
    await setSurveyInDesignMode();
    await t.expect(Selector(".sv_page_title").exists).ok();
  });

  test("page description empty", async t => {
    await addPageDescriptionClass();
    var json = {
      pages: [
        {
          description: "",
          questions: [
            {
              titleLocation: "hidden",
              type: "text",
              name: "simple text"
            }
          ]
        }
      ]
    };

    await initSurvey(framework, json);

    await t.expect(Selector(".sv_page_description").exists).notOk();
    await setSurveyInDesignMode();
    await t.expect(Selector(".sv_page_description").exists).ok();
  });
  test("render page description on changig locale when description is empty for default locale", async t => {
    var json = {
      pages: [
        {
          description: {
            de: "Page description"
          },
          questions: [
            {
              titleLocation: "hidden",
              type: "text",
              name: "simple text"
            }
          ]
        }
      ]
    };

    await initSurvey(framework, json);
    const changeLocale = ClientFunction(
      () => (window["survey"].locale = "de")
    );
    const descSelector = Selector("span").withText("Page description");
    await t.expect(descSelector.exists).notOk();
    await changeLocale();
    await t.expect(descSelector.exists).ok();
  });
});
