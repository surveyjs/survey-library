import { frameworks, url, url_test, setOptions, initSurvey, getSurveyResult, getQuestionValue, getQuestionJson, checkSurveyWithEmptyQuestion, applyTheme, getData } from "../helper";
import { Selector, ClientFunction, fixture, test } from "testcafe";
// eslint-disable-next-line no-undef
const assert = require("assert");
const title = "checkboxes";

const json = {
  elements: [
    {
      type: "checkbox",
      name: "car",
      title: "What car are you driving?",
      isRequired: true,
      colCount: 4,
      hasOther: true,
      hasNone: true,
      choices: [
        "Unknown",
        "Ford",
        "Vauxhall",
        "Volkswagen",
        "Nissan",
        "Audi",
        "Mercedes-Benz",
        "BMW",
        "Peugeot",
        "Toyota",
        "Citroen",
      ],
    },
  ],
};

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async (ctx) => {
      await initSurvey(framework, json);
    }
  );

  test("choose empty", async (t) => {
    await checkSurveyWithEmptyQuestion(t);
  });

  test("choose none", async (t) => {
    let surveyResult;

    await t
      .click(Selector(".sv_q_checkbox_control_label").withText("Nissan"))
      .click(Selector(".sv_q_checkbox_control_label").withText("Audi"))
      .click(Selector(".sv_q_checkbox_control_label").withText("Vauxhall"))
      .click(Selector(".sv_q_checkbox_control_label").withText("None"))
      .click("input[value=Complete]");

    surveyResult = await getSurveyResult();
    await t.expect(surveyResult.car).eql(["none"]);
  });

  test("choose value", async (t) => {
    let surveyResult;

    await t
      .click(Selector(".sv_q_checkbox_control_label").withText("Nissan"))
      .click("input[value=Complete]");

    surveyResult = await getSurveyResult();
    assert.equal(surveyResult.car, "Nissan");
  });

  test("choose several values", async (t) => {
    let surveyResult;

    await t
      .click(Selector(".sv_q_checkbox_control_label").withText("BMW"))
      .click(Selector(".sv_q_checkbox_control_label").withText("Nissan"))
      .click("input[value=Complete]");

    surveyResult = await getSurveyResult();
    await t.expect(surveyResult.car).eql(["BMW", "Nissan"]);
  });

  test("change column count", async (t) => {
    const getClassName = ClientFunction(
      () => document.querySelector("div[id*=sq_1] fieldset .sv_q_select_column").className
    );

    let className = await getClassName();

    assert.notEqual(className.indexOf("sv-q-column-4"), -1);

    await setOptions("car", { colCount: 1 });
    const getClassNameOneCol = ClientFunction(
      () => document.querySelector("div[id*=sq_1] fieldset > .sv_q_checkbox").className
    );
    className = await getClassNameOneCol();
    assert.notEqual(className.indexOf("sv-q-col-1"), -1);

    await setOptions("car", { colCount: 2 });

    className = await getClassName();
    assert.notEqual(className.indexOf("sv-q-column-2"), -1);
  });

  test("change choices order", async (t) => {
    const getChoicesCount = ClientFunction(
      () =>
        document.querySelectorAll(
          "div[id*=sq_1] fieldset .sv_q_checkbox_control_item"
        ).length
    );
    const getFirst = Selector(
      "div[id*=sq_1] .sv_q_select_column:nth-child(1) .sv-string-viewer"
    ).nth(0);
    const getSecond = Selector(
      "div[id*=sq_1] .sv_q_select_column:nth-child(2) .sv-string-viewer"
    ).nth(0);

    let rnd_count = 0;
    let first, second, first_2;
    let choicesCount = await getChoicesCount();

    // asc
    await setOptions("car", { choicesOrder: "asc" });
    first = await getFirst();
    second = await getSecond();
    assert.equal(first.textContent.trim(), "Audi");
    assert.equal(second.textContent.trim(), "BMW");

    // desc
    await setOptions("car", { choicesOrder: "desc" });
    first = await getFirst();
    second = await getSecond();
    assert.equal(first.textContent.trim(), "Volkswagen");
    assert.equal(second.textContent.trim(), "Vauxhall");

    // rnd
    if (choicesCount === 1) {
      assert(false, "need to more than one choices");
    }

    for (let i = 0; i < 15; i++) {
      await setOptions("car", { choicesOrder: "asc" });
      await setOptions("car", { choicesOrder: "random" });
      first_2 = await getFirst();

      if (first.textContent.trim() !== first_2.textContent.trim()) {
        rnd_count++;
      }

      first = first_2;

      if (rnd_count >= 4) {
        break;
      }
    }

    assert(rnd_count >= 4); // because of 'none', 'asc', 'desc' and if 4 it is really rnd
  });

  test("check integrity", async (t) => {
    let i;
    const getChoicesCount = ClientFunction(
      () =>
        document.querySelectorAll(
          "div[id*=sq_1] fieldset .sv_q_checkbox_control_item"
        ).length
    );
    const getChoicesExistence = ClientFunction(() => {
      var choices = [
        "None",
        "Ford",
        "Vauxhall",
        "Volkswagen",
        "Nissan",
        "Audi",
        "Mercedes-Benz",
        "BMW",
        "Peugeot",
        "Toyota",
        "Citroen",
        "Other (describe)",
      ];
      var result;
      for (var i = 0; i < choices.length; i++) {
        if (document.documentElement.innerHTML.indexOf(choices[i]) === -1)
          return false;
      }
      return true;
    });
    let choicesCount, choicesExistence;
    let checkIntegrity = async () => {
      choicesCount = await getChoicesCount();
      assert.equal(choicesCount, 13);
      choicesExistence = await getChoicesExistence();
      assert(choicesExistence);
    };

    await setOptions("car", { choicesOrder: "asc" });
    await checkIntegrity();

    await setOptions("car", { choicesOrder: "desc" });
    await checkIntegrity();

    await setOptions("car", { choicesOrder: "random" });
    await checkIntegrity();
  });

  test("show \"other\" choice", async (t) => {
    await setOptions("car", { hasOther: true });
    await t.expect(Selector(".sv-string-viewer").withText("Other").visible).ok();
  });

  test("check \"other\" choice doesn't change order", async (t) => {
    const getOtherChoice = Selector(
      () =>
        document.querySelectorAll(
          "div[id*=sq_1] fieldset .sv_q_select_column:nth-child(1) div:nth-of-type(4)"
        )[0]
    );
    let otherChoice;

    await setOptions("car", { hasOther: true });
    await setOptions("car", { choicesOrder: "desc" });
    otherChoice = await getOtherChoice();
    assert.equal(otherChoice.textContent.trim(), "Other (describe)");
  });

  test("choose other", async (t) => {
    const getOtherInput = Selector(
      () => document.querySelectorAll("textarea")[0]
    );
    let surveyResult;

    await setOptions("car", { hasOther: true });
    await t
      .click(Selector("span").withText("Other (describe)"))
      .typeText(getOtherInput, "Zaporozec")
      .click("input[value=Complete]");

    surveyResult = await getSurveyResult();
    assert.equal(surveyResult.car, "other");
    assert.equal(surveyResult["car-Comment"], "Zaporozec");
  });
  test("choose other and storeOthersAsComment=false", async (t) => {
    const setSurveyOptions = ClientFunction(() => {
      window["survey"].storeOthersAsComment = false;
    });
    const getOtherInput = Selector(
      () => document.querySelectorAll("textarea")[0]
    );
    let surveyResult;
    await setSurveyOptions();
    await setOptions("car", { hasOther: true });
    await t
      .click(Selector("span").withText("Other (describe)"))
      .typeText(getOtherInput, "New_Producer")
      .click("input[value=Complete]");

    surveyResult = await getSurveyResult();
    assert.equal(surveyResult.car, "New_Producer");
  });
  test("choose other and \"textUpdateMode\": \"onTyping\"", async (t) => {
    const setSurveyOptions = ClientFunction(() => {
      window["survey"].textUpdateMode = "onTyping";
    });
    const getOtherInput = Selector(
      () => document.querySelectorAll("textarea")[0]
    );
    let surveyResult;
    await setSurveyOptions();

    await setOptions("car", { hasOther: true });
    await t
      .click(Selector("span").withText("Other (describe)"))
      .click(getOtherInput)
      .pressKey("C o m m e n t")
      .click("input[value=Complete]");

    surveyResult = await getSurveyResult();
    assert.equal(surveyResult.car, "other");
    assert.equal(surveyResult["car-Comment"], "Comment");
  });

  test("trim other", async (t) => {
    const getOtherInput = Selector(
      () => document.querySelectorAll("textarea")[0]
    );
    let surveyResult;

    await setOptions("car", { hasOther: true });
    await t
      .click(Selector("span").withText("Other (describe)"))
      .typeText(getOtherInput, "     ");
    await t.pressKey("shift+tab")
      .pressKey("tab")
      .typeText(getOtherInput, "ab  ");
    await t.pressKey("shift+tab")
      .pressKey("tab")
      .typeText(getOtherInput, "cd  ");

    await t.click("input[value=Complete]");

    surveyResult = await getSurveyResult();
    assert.equal(surveyResult.car, "other");
    assert.equal(surveyResult["car-Comment"], "abcd");
  });

  test("checked class", async (t) => {
    const isCheckedClassExistsByIndex = ClientFunction((index) =>
      document
        .querySelector(
          `fieldset .sv_q_select_column:nth-child(3) div:nth-of-type(${index})`
        )
        .classList.contains("checked")
    );

    assert.equal(await isCheckedClassExistsByIndex(2), false);
    assert.equal(await isCheckedClassExistsByIndex(3), false);

    await t
      .click(
        "fieldset .sv_q_select_column:nth-child(3) div:nth-of-type(2) label input"
      )
      .click(
        "fieldset .sv_q_select_column:nth-child(3) div:nth-of-type(3) label input"
      );

    assert.equal(await isCheckedClassExistsByIndex(2), true);
    assert.equal(await isCheckedClassExistsByIndex(3), true);
  });

  test("Check that selectAll item is checked after loading data - https://surveyjs.answerdesk.io/internal/ticket/details/T4979", async (t) => {
    const enableHasSelectAll = ClientFunction(() => {
      window["survey"].getAllQuestions()[0].hasSelectAll = true;
    });
    const isSelectAllChecked = ClientFunction(() => {
      return document.querySelector(
        "fieldset .sv_q_select_column:nth-of-type(1) div:nth-of-type(1) input"
      ).checked;
    });
    const surveyData = {
      car: [
        "Unknown",
        "Ford",
        "Vauxhall",
        "Volkswagen",
        "Nissan",
        "Audi",
        "Mercedes-Benz",
        "BMW",
        "Peugeot",
        "Toyota",
        "Citroen",
      ],
    };
    const setData = ClientFunction(() => {
      window["survey"].data = {
        car: [
          "Unknown",
          "Ford",
          "Vauxhall",
          "Volkswagen",
          "Nissan",
          "Audi",
          "Mercedes-Benz",
          "BMW",
          "Peugeot",
          "Toyota",
          "Citroen",
        ],
      };
    });
    await enableHasSelectAll();
    await setData();
    assert.equal(await isSelectAllChecked(), true);
    await t.click(Selector("span").withText("Select All"));
    assert.deepEqual(await getData(), {});
    await t.click(Selector("span").withText("Select All"));
    assert.deepEqual(await getData(), surveyData);
  });
  test("showOtherItem&showCommentArea", async (t) => {
    const getOtherInput = Selector(
      () => document.querySelectorAll("textarea")[0]
    );
    const getCommentInput = Selector(
      () => document.querySelectorAll("textarea")[1]
    );
    let surveyResult;

    await setOptions("car", { showOtherItem: true, showCommentArea: true, commentText: "Comment on question", otherText: "Other text" });
    await t
      .click(Selector("span").withText("Other text"))
      .typeText(getOtherInput, " ")
      .selectText(getOtherInput)
      .pressKey("delete")
      .typeText(getOtherInput, "Audi")
      .selectText(getOtherInput)
      .pressKey("delete")
      .typeText(getOtherInput, "Other value")
      .typeText(getCommentInput, "Comment value")
      .click("input[value=Complete]");

    surveyResult = await getSurveyResult();
    assert.equal(surveyResult.car, "Other value");
    assert.equal(surveyResult["car-Comment"], "Comment value");
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
    var questionValue = await getQuestionValue();
    assert.equal(questionValue.length, 0);

    var outerSelector = ".sv_q_title";
    var innerSelector = ".sv-string-editor";
    await t
      .click(outerSelector)
      .typeText(outerSelector + " " + innerSelector, newTitle, { replace: true })
      .click("body", { offsetX: 0, offsetY: 0 });

    questionValue = await getQuestionValue();
    assert.equal(questionValue.length, 0);
    json = JSON.parse(await getQuestionJson());
    assert.equal(json.title, newTitle);
  });

  test("click on checkbox title state editable", async (t) => {
    var newTitle = "MyText";
    var json = JSON.parse(await getQuestionJson());
    var questionValue = await getQuestionValue();
    assert.equal(questionValue.length, 0);

    var outerSelector = ".sv_q_checkbox_control_label";
    var innerSelector = ".sv-string-editor";
    await t
      .click(outerSelector)
      .typeText(outerSelector + " " + innerSelector, newTitle, { replace: true })
      .click("body", { offsetX: 0, offsetY: 0 });

    questionValue = await getQuestionValue();
    assert.equal(questionValue.length, 0);
    json = JSON.parse(await getQuestionJson());
    assert.equal(json.choices[0].text, newTitle);
  });
  test("check other comment is focused after other item is selected ", async (t) => {
    await ClientFunction(() => { window["survey"].setDesignMode(false); })();
    await t.click("input[value='other']").expect(Selector("textarea").focused).ok();
  });
});
frameworks.forEach((framework) => {
  const themeName = "defaultV2";
  fixture`${framework} ${title}`
    .page`${url_test}${themeName}/${framework}`
    .beforeEach(async (t) => {
      await applyTheme(themeName);
      await initSurvey(framework, json);
    });
  test("maxSelectedChoices", async (t) => {
    const setSurveyOptions = ClientFunction(() => {
      window["survey"].questionsOnPageMode = "questionPerPage";
      window["survey"].getAllQuestions()[0].maxSelectedChoices = 2;
    });
    await setSurveyOptions();
    await t
      .click(Selector(".sd-item__control-label").withText("Nissan"))
      .click(Selector(".sd-item__control-label").withText("Audi"))
      .click(Selector(".sd-item__control-label").withText("Ford"))
      .click(Selector(".sd-item__control-label").withText("Audi"))
      .click(Selector(".sd-item__control-label").withText("BMW"))
      .click("input[value=Complete]");

    const surveyResult = await getSurveyResult();
    await t.expect(surveyResult.car).eql(["Nissan", "BMW"]);
  });
});
frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(async t => {
    await t.resizeWindow(800, 600);
  });
  test("maxSelectedChoices in matrix with showInMultipleColumns", async (t) => {
    await initSurvey(framework, {
      "elements": [
        {
          "type": "matrixdropdown",
          "name": "q1",
          "columns": [
            {
              "name": "col1",
              "cellType": "checkbox",
              "showInMultipleColumns": true,
              "choices": ["a", "b", "c", "d", "e"],
              "maxSelectedChoices": 2
            }
          ],
          "rows": ["row1"]
        }
      ]
    });
    const checks = Selector("input[type='checkbox'");
    await t
      .click(checks.nth(0))
      .click(checks.nth(1))
      .click(checks.nth(2))
      .click(checks.nth(3))
      .click(checks.nth(4))
      .click("input[value=Complete]");
    const surveyResult = await getSurveyResult();
    await t.expect(surveyResult.q1.row1.col1).eql(["a", "b"]);
  });
});