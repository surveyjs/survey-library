import { SurveyModel } from "../src/survey";
import { QuestionImagePickerModel } from "../src/question_imagepicker";
import { defaultV2Css } from "../src/defaultCss/defaultV2Css";

export default QUnit.module("imagepicker");

QUnit.test("Add choices in runtime", function(assert) {
  let survey = new SurveyModel({});
  let page = survey.addNewPage();
  let question = <QuestionImagePickerModel>page.addNewQuestion("imagepicker");

  let choicesJSON = [
    {
      value: "giraffe",
      imageLink: "link1",
    },
    {
      value: "item2",
      imageLink: "link2",
    },
  ];
  question.choices = choicesJSON;

  assert.equal(question.choices.length, 2, "2 choices");
  assert.equal(
    question.choices[0].getType(),
    "imageitemvalue",
    "choice type is imageitemvalue"
  );
  assert.equal(
    question.choices[1].imageLink,
    "link2",
    "choice imageLink value"
  );
});

QUnit.test("Localized imageLink", function(assert) {
  let survey = new SurveyModel({});
  let page = survey.addNewPage();
  let question = <QuestionImagePickerModel>page.addNewQuestion("imagepicker");

  let choicesJSON = [
    {
      value: "giraffe",
      imageLink: {
        default: "link1",
        de: "link1de",
      },
    },
    {
      value: "item2",
      imageLink: {
        default: "link2",
        de: "link2de",
      },
    },
  ];
  question.choices = choicesJSON;

  assert.equal(question.choices.length, 2, "2 choices");
  assert.equal(
    question.choices[1].imageLink,
    "link2",
    "choice imageLink default langiage value"
  );

  survey.locale = "de";
  assert.equal(
    question.choices[1].imageLink,
    "link2de",
    "choice imageLink DE langiage value"
  );
  survey.locale = "";
});

QUnit.test("check dependency getItemClass method on colCount", function(
  assert
) {
  let survey = new SurveyModel({});
  let page = survey.addNewPage();
  let question = <QuestionImagePickerModel>page.addNewQuestion("imagepicker");
  question.choices = [{ value: "item1" }, { value: "item2" }];
  const item = question.visibleChoices[0];
  assert.equal(
    question.getItemClass(item),
    "sv_q_imgsel sv_q_imagepicker_inline"
  );
  question.colCount = 1;
  assert.equal(question.getItemClass(item), "sv_q_imgsel sv-q-col-1");
  question.colCount = 2;
  assert.equal(question.getItemClass(item), "sv_q_imgsel sv-q-col-2");
});
QUnit.test("check process responsiveness for imagepicker", function(
  assert
) {
  let survey = new SurveyModel({});
  survey.css = defaultV2Css;
  let page = survey.addNewPage();
  let question = <QuestionImagePickerModel>page.addNewQuestion("imagepicker");
  question.choices = [{ value: "item1" }, { value: "item2" }, { value: "item3" }, { value: "item4" }];
  question.choices[0]["aspectRatio"] = question.choices[1]["aspectRatio"] = question.choices[2]["aspectRatio"] = 2;
  question.choices[3]["aspectRatio"] = 3;
  question["gapBetweenItems"] = 16;
  question.imageMinWidth = 100;
  question.imageMaxWidth = 200;
  question.imageMinHeight = 50;
  question.imageMaxHeight = 100;
  question["processResponsiveness"](0, 332 + 1);
  assert.equal(question.renderedImageWidth, "100px");
  assert.equal(question.renderedImageHeight, "50px");

  question["processResponsiveness"](0, 548 + 1);
  assert.equal(question.renderedImageWidth, "125px");
  assert.equal(question.renderedImageHeight, "62.5px");

  question["processResponsiveness"](0, 900);
  assert.equal(question.renderedImageWidth, "200px");
  assert.equal(question.renderedImageHeight, "100px");

});
