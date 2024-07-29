import { frameworks, url, initSurvey, getSurveyResult, getQuestionValue, getQuestionJson, urlV2, applyTheme } from "../helper";
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

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${urlV2}${framework}`.beforeEach(
    async (ctx) => {
      await applyTheme("defaultV2");
    }
  );

  test("readonly", async (t) => {
    const json = {
      questions: [
        {
          type: "rating",
          name: "satisfaction",
          readOnly: true,
          defaultValue: "3",
          title: "How satisfied are you with the Product?",
          mininumRateDescription: "Not Satisfied",
          maximumRateDescription: "Completely satisfied"
        }
      ]
    };
    await initSurvey(framework, json);

    const label1 = Selector("label").withText("1");
    const label3 = Selector("label").withText("3");
    await t.click(label1);
    await t.expect(label1.hasClass("sd-rating__item--selected")).eql(false);
    await t.expect(label3.hasClass("sd-rating__item--selected")).eql(true);
  });

  test("readonly:keyboard disabled", async (t) => {
    const json = {
      questions: [
        {
          type: "rating",
          name: "satisfaction",
          readOnly: true,
          defaultValue: "3",
          title: "How satisfied are you with the Product?",
          mininumRateDescription: "Not Satisfied",
          maximumRateDescription: "Completely satisfied"
        }
      ]
    };
    await initSurvey(framework, json);

    await t.pressKey("tab").pressKey("right");
    const getValue = ClientFunction(()=>{
      return window["survey"].getAllQuestions()[0].value;
    });
    const value = await getValue();
    await t.expect(value).eql(3, "value doesn't change");
  });

  test("Do not scroll the window if question has a large title text", async (t) => {
    await t.resizeWindow(375, 667);
    await initSurvey(framework, {
      "pages": [
        {
          "name": "page1",
          "title": "Product Concept",
          "description": "Di bagian ini Anda akan diperkenalkan dengan konsep aplikasi yang ingin kami bangun. Segala masukan yang Anda berikan dalam pertanyaan-pertanyaan di bawah akan sangat berharga bagi kami untuk memenuhi kebutuhan berjualan online Anda, maka mohon jawab pertanyaan berikut dengan seksama ",
          "elements": [
            {
              "type": "rating",
              "name": "pertanyaan6",
              "title": "Pada skala berikut, di mana  berarti sangat tidak puas dan  berarti sangat puas, bagaimana Anda menilai kemampuan kepemimpinan proyek dari software engineer dalam tim Anda? Pertimbangkan beberapa faktor berikut dalam penilaian Anda: perencanaan proyek yang efektif, koordinasi yang baik dengan anggota tim, kemampuan dalam menyelesaikan masalah yang muncul selama proyek, serta keterampilan komunikasi yang jelas dengan pemangku kepentingan. Jika memungkinkan, tambahkan komentar atau saran untuk perbaikan.",
              "description": "<p><em>(Ilustrasi diatas adalah contoh display website yang dapat Anda bangun sendiri melalui aplikasi ini)</em></p>",
              "rateType": "smileys",
              "autoGenerate": false,
              "rateValues": [
                1,
                2,
                3,
                4,
                5
              ],
            },
            {
              "type": "comment",
              "name": "pertanyaan9",
              "title": "Dalam pandangan Anda, bagaimana Anda menilai kemampuan kepemimpinan proyek dari software engineer dalam tim Anda? Mohon berikan penilaian berdasarkan beberapa faktor seperti kemampuan perencanaan proyek, koordinasi dengan anggota tim, kemampuan menyelesaikan masalah yang muncul selama proyek berlangsung, serta keterampilan komunikasi dengan pemangku kepentingan. Selain itu, silakan berikan contoh konkret dari pengalaman Anda dan saran spesifik yang dapat membantu meningkatkan efektivitas kepemimpinan mereka di masa depan.",
              "isRequired": true,
              "autoGrow": true
            },
          ]
        }
      ]
    });

    const getWindowScrollY = ClientFunction(() => { return window.scrollY; });

    let scrollY = await getWindowScrollY();
    await t
      .expect(scrollY).eql(0)
      .scroll(0, 650);

    scrollY = await getWindowScrollY();
    await t
      .expect(scrollY).within(649, 672)
      .click(Selector(".sd-dropdown"));

    scrollY = await getWindowScrollY();
    await t.expect(scrollY).within(649, 672);

    await t.click(Selector(".sd-dropdown"));
    scrollY = await getWindowScrollY();
    await t.expect(scrollY).within(649, 672);

    await t.resizeWindow(1920, 1080);
  });
});