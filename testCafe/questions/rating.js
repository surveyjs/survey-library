import { frameworks, url, initSurvey, getSurveyResult, getQuestionValue, getQuestionJson } from "../helper";
import { Selector, ClientFunction, fixture, test } from "testcafe";
// eslint-disable-next-line no-undef
const assert = require("assert");
const title = "rating";

const json = {
  questions: [
    {
      type: "rating",
      name: "satisfaction",
      title: "How satisfied are you with the Product?",
      mininumRateDescription: "Not Satisfied",
      maximumRateDescription: "Completely satisfied"
    }
  ]
};

frameworks.forEach(framework => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async t => {
      await initSurvey(framework, json);
    }
  );

  test("description exists", async t => {
    await t
      .expect(Selector(".sv-string-viewer").withText("Not Satisfied").visible).ok()
      .expect(Selector(".sv-string-viewer").withText("Completely satisfied").visible).ok();
  });

  test("choose value", async t => {
    const label3 = Selector("label").withText("3");
    let surveyResult;

    await t.click(label3).click("input[value=Complete]");

    surveyResult = await getSurveyResult();

    await t.expect(surveyResult).eql({
      satisfaction: 3
    });
  });
});

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async (t) => {
      await initSurvey(framework, json, undefined, true);
    }
  );

  test("click on question title state editable", async (t) => {
    var newTitle = "MyText";
    var json = JSON.parse(await getQuestionJson());
    assert.equal(await getQuestionValue(), null);

    var outerSelector = ".sv_q_title";
    var innerSelector = ".sv-string-editor";
    await t
      .click(outerSelector)
      .typeText(outerSelector + " " + innerSelector, newTitle, { replace: true })
      .click("body", { offsetX: 0, offsetY: 0 });

    assert.equal(await getQuestionValue(), null);
    json =JSON.parse(await getQuestionJson());
    assert.equal(json.title, newTitle);
  });

  test("click on min label in intermediate state editable", async (t) => {
    var newMinText = "MyText";
    var json = JSON.parse(await getQuestionJson());
    var maxText = json.maxRateDescription;
    assert.equal(await getQuestionValue(), null);

    var outerSelector = ".sv_q_rating .sv_q_rating_min_text";
    var innerSelector = ".sv-string-editor";
    await t
      .click(outerSelector)
      .selectEditableContent(outerSelector + " " + innerSelector, outerSelector + " " + innerSelector)
      .typeText(outerSelector + " " + innerSelector, newMinText)
      .click("body", { offsetX: 0, offsetY: 0 });

    assert.equal(await getQuestionValue(), null);
    json =JSON.parse(await getQuestionJson());
    assert.equal(json.minRateDescription, newMinText);
    assert.equal(json.maxRateDescription, maxText);
  });

  test("click on max label in intermediate state editable", async (t) => {
    var newMaxText = "MyText";
    var json = JSON.parse(await getQuestionJson());
    var minText = json.minRateDescription;
    assert.equal(await getQuestionValue(), null);

    var outerSelector = ".sv_q_rating .sv_q_rating_max_text";
    var innerSelector = ".sv-string-editor";
    await t
      .click(outerSelector)
      .selectEditableContent(outerSelector + " " + innerSelector, outerSelector + " " + innerSelector)
      .typeText(outerSelector + " " + innerSelector, newMaxText)
      .click("body", { offsetX: 0, offsetY: 0 });

    assert.equal(await getQuestionValue(), null);
    json =JSON.parse(await getQuestionJson());
    assert.equal(json.minRateDescription, minText);
    assert.equal(json.maxRateDescription, newMaxText);
  });

  test("Check rating question with many items to dropdown", async (t) => {
    await t.resizeWindow(1920, 1080);

    await ClientFunction(() => {
      window.addEventListener("error", e => {
        if (e.message === "ResizeObserver loop completed with undelivered notifications." ||
          e.message === "ResizeObserver loop limit exceeded") {
          e.stopImmediatePropagation();
        }
      });
    })();

    await initSurvey(framework, {
      showQuestionNumbers: "off",
      questions: [
        {
          type: "rating",
          name: "satisfaction",
          title: "Rating",
          rateMax: 30,
          width: "708px"
        }
      ]
    });
    await t.expect(Selector(".sd-question select").visible).ok;
  });

  var jsonR = {
    questions: [
      {
        "type": "rating",
        "name": "q1"
      },
    ],
  };
  frameworks.forEach((framework) => {
    fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
      async (t) => {
        await initSurvey(framework, jsonR);
      }
    );
  });
  test("check fixed width observability", async (t) => {
    await t.expect(Selector(".sv_q_rating_item").withText("1").visible).ok();
    await t.expect(Selector(".sv_q_rating_item").withText("1").classNames).contains("sv_q_rating_item_fixed");
    await ClientFunction(() => { window["survey"].getQuestionByName("q1").renderedRateItems[1].locText.text = "a"; })();
    await t.expect(Selector(".sv_q_rating_item").withText("a").classNames).notContains("sv_q_rating_item_fixed");
    await ClientFunction(() => { window["survey"].getQuestionByName("q1").renderedRateItems[2].locText.text = "b"; })();
    await t.expect(Selector(".sv_q_rating_item").withText("b").classNames).notContains("sv_q_rating_item_fixed");
  });

  const jsonStars = {
    questions: [
      {
        type: "rating",
        name: "satisfaction",
        rateType: "stars",
        title: "How satisfied are you with the Product?",
        mininumRateDescription: "Not Satisfied",
        maximumRateDescription: "Completely satisfied"
      }
    ]
  };

  frameworks.forEach(framework => {
    fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
      async t => {
        await initSurvey(framework, jsonStars);
      }
    );

    test("choose star value", async t => {
      const label3 = Selector("label .sv-star").nth(2);
      let surveyResult;
      await t.click(label3).click("input[value=Complete]");

      surveyResult = await getSurveyResult();

      await t.expect(surveyResult).eql({
        satisfaction: 3
      });
    });
  });

  const jsonSmileys = {
    questions: [
      {
        type: "rating",
        name: "satisfaction",
        rateType: "smileys",
        title: "How satisfied are you with the Product?",
        mininumRateDescription: "Not Satisfied",
        maximumRateDescription: "Completely satisfied"
      }
    ]
  };

  frameworks.forEach(framework => {
    fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
      async t => {
        await initSurvey(framework, jsonSmileys);
      }
    );

    test("choose smiley value", async t => {
      const label3 = Selector("label .sv-svg-icon").nth(2);
      let surveyResult;

      await t.click(label3).click("input[value=Complete]");
      surveyResult = await getSurveyResult();

      await t.expect(surveyResult).eql({
        satisfaction: 3
      });
    });
  });
  frameworks.forEach(framework => {
    fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
      async t => {
        await initSurvey(framework, {
          "logoPosition": "right",
          "pages": [
            {
              "name": "page1",
              "elements": [
                {
                  "type": "matrixdropdown",
                  "name": "question1",
                  "columns": [
                    {
                      "name": "col1",
                      "cellType": "rating",
                      "rateType": "stars"
                    },
                  ],
                  "choices": [
                    1,
                    2,
                    3,
                    4,
                    5
                  ],
                  "rows": [
                    "row1",
                    "row2"
                  ]
                }
              ]
            }
          ]
        });
      }
    );

    test("check keynavigation inside matrixdropdown", async t => {
      await t
        .pressKey("tab")
        .pressKey("right")
        .pressKey("tab")
        .pressKey("right")
        .pressKey("right");

      await t.click("input[value=Complete]");
      const surveyResult = await getSurveyResult();

      await t.expect(surveyResult).eql({
        question1: {
          row1: { col1: 2 },
          row2: { col1: 3 }
        }
      });
    });
  });
});