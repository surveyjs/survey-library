import {
  frameworks,
  url,
  setOptions,
  initSurvey,
  getSurveyResult
} from "../settings";
import { Selector, ClientFunction } from "testcafe";
const assert = require("assert");
const title = `matrixdropdown`;

const json = {
  questions: [
    {
      type: "matrixdropdown",
      name: "frameworksRate",
      title: "Please tells us your opinion about JavaScript MVVM frameworks",
      choices: ["Excelent", "Good", "Average", "Fair", "Poor"],
      columns: [
        {
          name: "using",
          title: "Do you use it?",
          choices: ["Yes", "No"],
          cellType: "radiogroup"
        },
        {
          name: "experience",
          title: "How long do you use it?",
          choices: [
            { value: 5, text: "3-5 years" },
            { value: 2, text: "1-2 years" },
            {
              value: 1,
              text: "less than a year"
            }
          ]
        },
        {
          name: "strength",
          title: "What is main strength?",
          choices: ["Easy", "Compact", "Fast", "Powerfull"],
          cellType: "checkbox"
        },
        {
          name: "knowledge",
          title: "Please describe your experience",
          cellType: "text"
        },
        { name: "rate", title: "Please rate the framework itself" }
      ],
      rows: [
        { value: "angularv1", text: "angularjs v1.x" },
        { value: "angularv2", text: "angularjs v2" },
        { value: "knockoutjs" },
        { value: "reactjs" }
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

  test(`choose several values`, async t => {
    let surveyResult;
    const baseSelectorFunc = function(strings, ...values) {
      return `tbody > tr:nth-child(${values[0]}) > td:nth-child(${values[1]})`;
    };

    // answer for row 1
    await t
      .click(`${baseSelectorFunc`${1}${2}`} input[value=Yes]`)
      .click(`${baseSelectorFunc`${1}${3}`} select`)
      .click(`${baseSelectorFunc`${1}${3}`} select option[value="2"]`)
      .click(`${baseSelectorFunc`${1}${4}`} div:nth-child(4) label input`)
      .typeText(
        `${baseSelectorFunc`${1}${5}`} input`,
        `why hello world so hard`
      )
      .click(`${baseSelectorFunc`${1}${6}`} select`)
      .click(`${baseSelectorFunc`${1}${6}`} select option[value="Excelent"]`);

    // answer for row 3
    await t
      .click(`${baseSelectorFunc`${3}${2}`} input[value=No]`)
      .click(`${baseSelectorFunc`${3}${3}`} select`)
      .click(`${baseSelectorFunc`${3}${3}`} select option[value="5"]`)
      .click(`${baseSelectorFunc`${3}${4}`} div:nth-child(2) label input`)
      .click(`${baseSelectorFunc`${3}${4}`} div:nth-child(5) label input`)
      .typeText(`${baseSelectorFunc`${3}${5}`} input`, `it is not 2016`)
      .click(`${baseSelectorFunc`${3}${6}`} select`)
      .click(`${baseSelectorFunc`${3}${6}`} select option[value="Good"]`);

    await t.click(`input[value=Complete]`);

    surveyResult = await getSurveyResult();

    assert.deepEqual(surveyResult.frameworksRate.angularv1, {
      using: "Yes",
      knowledge: "why hello world so hard",
      rate: "Excelent",
      strength: ["Fast"],
      experience: "2"
    });

    assert.deepEqual(surveyResult.frameworksRate.knockoutjs, {
      knowledge: "it is not 2016",
      rate: "Good",
      strength: ["Easy", "Powerfull"],
      experience: "5",
      using: "No"
    });
  });
});
