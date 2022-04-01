import { frameworks, url, initSurvey } from "../helper";
import { ClientFunction, fixture, test } from "testcafe";
// eslint-disable-next-line no-undef
const assert = require("assert");
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

  const isPageTitleExists = ClientFunction(
    () => !!document.querySelector(".sv_page_title")
  );

  const isDescriptionExists = ClientFunction(
    () => !!document.querySelector(".sv_page_description")
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
    assert.equal(await isPageTitleExists(), true);

    await setSurveyInDesignMode();
    assert.equal(await isPageTitleExists(), true);
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

    assert.equal(await isDescriptionExists(), true);
    await setSurveyInDesignMode();
    assert.equal(await isDescriptionExists(), true);
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

    assert.equal(await isPageTitleExists(), false);
    await setSurveyInDesignMode();
    assert.equal(await isPageTitleExists(), true);
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

    assert.equal(await isDescriptionExists(), false);
    await setSurveyInDesignMode();
    assert.equal(await isDescriptionExists(), true);
  });
});
