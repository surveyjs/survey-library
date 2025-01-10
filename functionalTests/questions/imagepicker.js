import { ClientFunction, fixture, Selector, test } from "testcafe";
import { frameworks, url, initSurvey, getSurveyResult, getQuestionValue, getQuestionJson, checkSurveyWithEmptyQuestion, urlV2 } from "../helper";
// eslint-disable-next-line no-undef
const assert = require("assert");
const title = "imagepicker";

const json = {
  questions: [
    {
      type: "imagepicker",
      name: "choosepicture",
      title: "What animal would you like to see first ?",
      isRequired: true,
      choices: [
        {
          value: "lion",
          imageLink:
            "https://surveyjs.io/Content/Images/examples/image-picker/lion.jpg"
        },
        {
          value: "giraffe",
          imageLink:
            "https://surveyjs.io/Content/Images/examples/image-picker/giraffe.jpg"
        },
        {
          value: "panda",
          imageLink:
            "https://surveyjs.io/Content/Images/examples/image-picker/panda.jpg"
        },
        {
          value: "camel",
          imageLink:
            "https://surveyjs.io/Content/Images/examples/image-picker/camel.jpg"
        }
      ]
    }
  ]
};

frameworks.forEach(framework => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async t => {
      await initSurvey(framework, json);
    }
  );

  test("check integrity", async t => {
    await t
      .hover("fieldset.sd-imagepicker .sd-imagepicker__item:nth-of-type(1)")
      .hover("fieldset.sd-imagepicker .sd-imagepicker__item:nth-of-type(2)")
      .hover("fieldset.sd-imagepicker .sd-imagepicker__item:nth-of-type(3)")
      .hover("fieldset.sd-imagepicker .sd-imagepicker__item:nth-of-type(4)");
  });

  test("choose empty", async t => {
    await checkSurveyWithEmptyQuestion(t);
  });

  test("choose value", async t => {
    let surveyResult;

    await t
      .click("fieldset.sd-imagepicker .sd-imagepicker__item:nth-of-type(2)")
      .click("input[value=Complete]");

    surveyResult = await getSurveyResult();
    assert.equal(surveyResult.choosepicture, "giraffe");
  });
  test("imagelink reactiveness", async t => {
    await t.expect(Selector(".sd-imagepicker__item").nth(0).find("img").exists).ok();
    await t.expect(Selector(".sd-imagepicker__no-image").exists).notOk();

    await ClientFunction(()=>{
      window.survey.getAllQuestions()[0].choices[0].imageLink = "custom_link";
    })();
    await t.expect(Selector(".sd-imagepicker__item").nth(0).find("img").exists).notOk();
    await t.expect(Selector(".sd-imagepicker__no-image").exists).ok();
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
    assert.equal(questionValue, undefined);

    var outerSelector = ".sd-question__title";
    var innerSelector = ".sv-string-editor";
    await t
      .click(outerSelector)
      .typeText(outerSelector + " " + innerSelector, newTitle, { replace: true })
      .click("body", { offsetX: 0, offsetY: 0 });

    questionValue = await getQuestionValue();
    assert.equal(questionValue, undefined);
    json = JSON.parse(await getQuestionJson());
    assert.equal(json.title, newTitle);
  });
});

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${urlV2}${framework}`.beforeEach(
    async (ctx) => {
      const json = {
        questions: [
          {
            "type": "imagepicker",
            "name": "imagepicker",
            "titleLocation": "hidden",
            "choices": [
              {
                "value": "lion",
                "imageLink": "https://surveyjs.io/Content/Images/examples/image-picker/lion.jpg",
                "text": "Lion"
              },
              {
                "value": "giraffe",
                "imageLink": "https://surveyjs.io/Content/Images/examples/image-picker/giraffe.jpg",
                "text": "Giraffe"
              }
            ],
            "readOnly": true,
            "defaultValue": "lion"
          }
        ]
      };
      await initSurvey(framework, json);
    }
  );

  test("readonly:keyboard disabled", async (t) => {
    await t.pressKey("tab").pressKey("right");
    const getValue = ClientFunction(()=>{
      return window["survey"].getAllQuestions()[0].value;
    });
    const value = await getValue();
    await t.expect(value).eql("lion", "value doesn't change");
  });
});