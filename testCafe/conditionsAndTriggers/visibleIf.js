import {
  frameworks,
  url,
  setOptions,
  initSurvey,
  getSurveyResult
} from "../settings";
import { Selector, ClientFunction } from "testcafe";
const assert = require("assert");
const title = `visibleIf`;

var json = {
  showQuestionNumbers: "off",
  questions: [
    {
      type: "radiogroup",
      name: "haveKids",
      title: "Do you have a kid(s)?",
      isRequired: true,
      choices: ["Yes", "No"],
      colCount: 0
    },
    {
      type: "dropdown",
      name: "kids",
      title: "How many kids do you have",
      visibleIf: "{haveKids}='Yes'",
      isRequired: true,
      choices: [1, 2, 3, 4, 5]
    },
    {
      type: "dropdown",
      name: "kid1Age",
      title: "The first kid age:",
      visibleIf: "{haveKids}='Yes' and {kids} >= 1",
      isRequired: true,
      choices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
    },
    {
      type: "dropdown",
      name: "kid2Age",
      title: "The second kid age:",
      visibleIf: "{haveKids}='Yes' and {kids} >= 2",
      isRequired: true,
      startWithNewLine: false,
      choices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
    },
    {
      type: "dropdown",
      name: "kid3Age",
      title: "The third kid age:",
      visibleIf: "{haveKids}='Yes' and {kids} >= 3",
      isRequired: true,
      startWithNewLine: false,
      choices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
    },
    {
      type: "dropdown",
      name: "kid4Age",
      title: "The fourth kid age:",
      visibleIf: "{haveKids}='Yes' and {kids} >= 4",
      isRequired: true,
      startWithNewLine: false,
      choices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
    },
    {
      type: "dropdown",
      name: "kid5Age",
      title: "The fifth kid age:",
      visibleIf: "{haveKids}='Yes' and {kids} >= 5",
      isRequired: true,
      startWithNewLine: false,
      choices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
    }
  ]
};

frameworks.forEach(framework => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async t => {
      await initSurvey(framework, json);
    }
  );

  test(`check visibility`, async t => {
    const getHeader = Selector(() => document.querySelectorAll(`h5`), {
      text: "* How many kids do you have"
    });
    const getSecondOption = Selector(
      index => document.querySelectorAll("option")[8]
    );
    const getSelectByIndex = Selector(
      index => document.querySelectorAll("select")[index],
      { visibilityCheck: true, timeout: 1000 }
    );
    let surveyResult;

    await t
      .click(`input[type=radio]`)
      .click(`select`)
      .click(`option[value="5"]`)
      .hover(getHeader)
      .hover(getSelectByIndex(5));

    await t.click(`select`).click(`option[value="1"]`);

    assert.equal(await getSelectByIndex(5), null);

    await t
      .click(getSelectByIndex(1))
      .click(await getSecondOption())
      .click(`input[value="Complete"]`);

    surveyResult = await getSurveyResult();
    assert.deepEqual(surveyResult, {
      haveKids: "Yes",
      kid1Age: "2",
      kids: "1"
    });
  });
});
