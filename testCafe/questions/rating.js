import { frameworks, url, initSurvey, getSurveyResult, getQuestionValue, getQuestionJson } from "../settings";
import { Selector, ClientFunction } from "testcafe";
const assert = require("assert");
const title = `rating`;

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
  fixture`${framework} ${title}`.page`${url}${framework}.html`.beforeEach(
    async t => {
      await initSurvey(framework, json);
    }
  );

  test(`description exists`, async t => {
    const getPositionMin = ClientFunction(() =>
      document.documentElement.innerHTML.indexOf("Not Satisfied")
    );
    const getPositionMax = ClientFunction(() =>
      document.documentElement.innerHTML.indexOf("Completely satisfied")
    );
    const positionMin = await getPositionMin();
    const positionMax = await getPositionMax();

    assert.notEqual(positionMin, -1);
    assert.notEqual(positionMax, -1);
  });

  test(`choose value`, async t => {
    const label3 = Selector("label").withText("3");
    let surveyResult;

    await t.click(label3).click(`input[value=Complete]`);

    surveyResult = await getSurveyResult();

    assert.deepEqual(surveyResult, {
      satisfaction: "3"
    });
  });
});

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}.html`.beforeEach(
    async (t) => {
      await initSurvey(framework, json, undefined, true);
    }
  );

  test(`click on question title state editable`, async (t) => {
    var newTitle = 'MyText';
    var json = JSON.parse(await getQuestionJson());
    assert.equal(await getQuestionValue(), null);
  
    var outerSelector = `.sv_q_title`;
    var innerSelector = `.sv-string-editor`
    await t
      .click(outerSelector)
      .selectEditableContent(outerSelector + ` ` + innerSelector)
      .typeText(outerSelector + ` ` + innerSelector, newTitle)
      .click(`body`);

    assert.equal(await getQuestionValue(), null);
    var json = JSON.parse(await getQuestionJson());
    assert.equal(json.title, newTitle);
  });

  test(`click on min label in intermediate state editable`, async (t) => {
    var newMinText = 'MyText';
    var json = JSON.parse(await getQuestionJson());
    var maxText = json.maxRateDescription;
    assert.equal(await getQuestionValue(), null);
  
    var outerSelector = `.sv_q_rating .sv_q_rating_min_text`;
    var innerSelector = `.sv-string-editor`
    await t
      .click(outerSelector)
      .selectEditableContent(outerSelector + ` ` + innerSelector)
      .typeText(outerSelector + ` ` + innerSelector, newMinText)
      .click(`body`);

    assert.equal(await getQuestionValue(), null);
    var json = JSON.parse(await getQuestionJson());
    assert.equal(json.minRateDescription, newMinText);
    assert.equal(json.maxRateDescription, maxText);
    
  });  

  test(`click on max label in intermediate state editable`, async (t) => {
    var newMaxText = 'MyText';
    var json = JSON.parse(await getQuestionJson());
    var minText = json.minRateDescription;
    assert.equal(await getQuestionValue(), null);
  
    var outerSelector = `.sv_q_rating .sv_q_rating_max_text`;
    var innerSelector = `.sv-string-editor`
    await t
      .click(outerSelector)
      .selectEditableContent(outerSelector + ` ` + innerSelector)
      .typeText(outerSelector + ` ` + innerSelector, newMaxText)
      .click(`body`);

    assert.equal(await getQuestionValue(), null);
    var json = JSON.parse(await getQuestionJson());
    assert.equal(json.minRateDescription, minText);
    assert.equal(json.maxRateDescription, newMaxText);
  });

});
