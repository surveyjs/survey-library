import { frameworks, url, initSurvey, getQuestionValue, getPanelJson } from "../helper";
import { Selector, ClientFunction, fixture, test } from "testcafe";
// eslint-disable-next-line no-undef
const assert = require("assert");
const title = "panel";

var json = {
  pages: [
    {
      name: "page1",
      elements: [
        {
          type: "comment",
          name: "question1",
        },
        {
          type: "panel",
          title: "Panel 1",
          state: "expanded",
          elements: [
            {
              type: "checkbox",
              choices: [
                {
                  value: "1",
                  text: "first item",
                },
                {
                  value: "2",
                  text: "second item",
                },
                {
                  value: "3",
                  text: "third item",
                },
              ],
              name: "question2",
            },
            {
              type: "panel",
              elements: [
                {
                  type: "dropdown",
                  choices: [
                    {
                      value: "1",
                      text: "first item",
                    },
                    {
                      value: "2",
                      text: "second item",
                    },
                    {
                      value: "3",
                      text: "third item",
                    },
                  ],
                  name: "question3",
                },
                {
                  type: "rating",
                  name: "question4",
                },
              ],
              innerIndent: 1,
              name: "panel2",
            },
          ],
          innerIndent: 1,
          name: "panel1",
        },
        {
          type: "panel",
          name: "panel2",
          state: "collapsed",
          elements: [
            { type: "text", name: "q1" }
          ]
        }
      ],
    },
  ],
};

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async (t) => {
      await initSurvey(framework, json);
    }
  );

  test("titles and margins", async (t) => {
    const getTitle1 = Selector("div").withText("question1").with({
      visibilityCheck: true,
      timeout: 1000,
    });
    const getTitle2 = Selector("div").withText("question2").with({
      visibilityCheck: true,
      timeout: 1000,
    });
    const getTitle3 = Selector("div").withText("question3").with({
      visibilityCheck: true,
      timeout: 1000,
    });
    const getTitle4 = Selector("div").withText("question4").with({
      visibilityCheck: true,
      timeout: 1000,
    });

    const getPanelsCountByMargin = ClientFunction(
      () => document.querySelectorAll('div[style*="padding-left: 20px"]').length
    );

    assert(await getTitle1());
    assert(await getTitle2());
    assert(await getTitle3());
    assert(await getTitle4());

    assert.equal(await getPanelsCountByMargin(), 2);
  });

  test("expand collapse title", async (t) => {
    const panelTitle = Selector("div").withAttribute("id", /ariaTitle$/).withText("Panel 1");
    const contentItem = Selector("[data-name='question2']");

    assert.equal(await contentItem.visible, true);
    await t.click(panelTitle);
    await t.wait(1000);
    assert.equal(await contentItem.visible, false);
  });
  test("expand collapse title by name", async (t) => {
    const panelTitle = Selector("div.sd-title").withAttribute("id", /ariaTitle$/).withText("panel2");
    const contentItem = Selector("[data-name='q1']");

    assert.equal(await contentItem.visible, false);
    await t.click(panelTitle);
    assert.equal(await contentItem.visible, true);
  });

  test("panel description reactivity", async (t) => {
    await ClientFunction(() => {
      window["survey"].getAllPanels()[0].description = "desc1";
    })();
    await t
      .expect(Selector(".sd-panel__description").withText("desc1").visible).ok();
  });
});

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async (t) => {
      await initSurvey(framework, json, undefined, true);
    }
  );

  test("click on panel title state editable", async (t) => {
    var newTitle = "MyText";
    var questionValue = await getQuestionValue();
    assert.equal(questionValue, undefined);

    var outerSelector = ".sd-panel__title";
    var innerSelector = ".sv-string-editor";
    await t
      .click(outerSelector)
      .typeText(outerSelector + " " + innerSelector, newTitle, { replace: true })
      .click("body", { offsetX: 0, offsetY: 0 });

    questionValue = await getQuestionValue();
    assert.equal(questionValue, undefined);
    var json = JSON.parse(await getPanelJson());
    assert.equal(json.title, newTitle);
  });
});

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async (t) => {
      await initSurvey(framework, { elements: [{ type: "text", name: "q1" }] }, undefined, true);
    }
  );

  test("Show content for collapsed panel in designer", async (t) => {
    const updateSurvey = ClientFunction(() => {
      window.survey.setDesignMode(true);
      window.survey.fromJSON({
        elements: [
          {
            "type": "panel",
            "name": "panel1",
            "elements": [
              {
                "type": "text",
                "name": "question1"
              }
            ],
            "state": "collapsed"
          }
        ]
      });
    });
    await t
      .expect(Selector("span").withText("question1").visible).notOk();
    await updateSurvey();
    await t
      .expect(Selector("span").withText("question1").visible).ok();
  });
});

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async (t) => {
      await initSurvey(framework, { elements: [{ type: "panel", name: "panel", elements: [{ type: "text", name: "q1" }] }] });
    }
  );

  test("Check panel title reactivity", async (t) => {
    const setTitle = ClientFunction((title) => {
      window.survey.getAllPanels()[0].title = title;
    });
    const titleSelector = Selector(".sd-panel__title");
    await t.expect(titleSelector.exists).notOk();
    await setTitle("panel title");
    await t.expect(titleSelector.exists).ok().expect(titleSelector.find(".sv-string-viewer").innerText).eql("panel title");
    await setTitle("");
    await t.expect(titleSelector.exists).notOk();
  });
});
