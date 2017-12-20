import {
  frameworks,
  url,
  setOptions,
  initSurvey,
  addExternalDependencies,
  getSurveyResult
} from "../settings";
import { Selector, ClientFunction } from "testcafe";
const assert = require("assert");
const title = `imagepicker`;

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
  fixture`${framework} ${title}`
    .page`${url}${framework}/customWidget.html`.beforeEach(async ctx => {
    await initSurvey(framework, json, "bootstrap");
  });

  test(`check integrity`, async t => {
    await t
      .hover(`li:nth-child(1) .image_picker_image`)
      .hover(`li:nth-child(2) .image_picker_image`)
      .hover(`li:nth-child(3) .image_picker_image`)
      .hover(`li:nth-child(4) .image_picker_image`);
  });

  test(`choose empty`, async t => {
    const getPosition = ClientFunction(() =>
      document.documentElement.innerHTML.indexOf("Please answer the question")
    );
    let position;
    let surveyResult;

    await t.click(`input[value=Complete]`);

    position = await getPosition();
    assert.notEqual(position, -1);

    surveyResult = await getSurveyResult();
    assert.equal(typeof surveyResult, `undefined`);
  });

  test(`choose value`, async t => {
    let surveyResult;

    await t
      .click(`li:nth-child(2) .image_picker_image`)
      .click(`input[value=Complete]`);

    surveyResult = await getSurveyResult();
    assert.equal(surveyResult.choosepicture, "giraffe");
  });
});
