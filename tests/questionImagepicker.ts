import { SurveyModel } from "../src/survey";
import { QuestionImagePickerModel } from "../src/question_imagepicker";

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
