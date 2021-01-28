import { SurveyModel } from "../src/survey";
import { SurveyProgressButtonsModel } from "../src/surveyProgressButtons";

export default QUnit.module("SurveyProgressButtons");

QUnit.test("SurveyProgressButtonsModel list elements", function(assert) {
  let json: any = {
    "pages": [
     {
      "name": "page1",
      "elements": [
       {
        "type": "text",
        "name": "question1"
       }
      ]
     },
     {
      "name": "page2",
      "elements": [
       {
        "type": "text",
        "name": "question2"
       }
      ]
     },
     {
      "name": "page3",
      "elements": [
       {
        "type": "text",
        "name": "question3"
       }
      ]
     }
    ]
   };
  let survey: SurveyModel = new SurveyModel(json);
  let progress: SurveyProgressButtonsModel = new SurveyProgressButtonsModel(survey);
  assert.equal(progress.getListElementCss(0),
    survey.css.progressButtonsListElementCurrent,
    "1) Page 1 style is current");
  assert.equal(progress.getListElementCss(1),
    "", "1) Page 2 style is empty");
  assert.equal(progress.getListElementCss(2),
    "", "1) Page 3 style is empty");

  progress.clickListElement(2);
  assert.equal(progress.getListElementCss(0),
    survey.css.progressButtonsListElementPassed,
    "2) Page 1 style is passed");
  assert.equal(progress.getListElementCss(1),
    survey.css.progressButtonsListElementPassed,
    "2) Page 2 style is passed");
  assert.equal(progress.getListElementCss(2),
    survey.css.progressButtonsListElementCurrent,
    "2) Page 3 style is current");

  progress.clickListElement(0);
  assert.equal(progress.getListElementCss(0),
    survey.css.progressButtonsListElementPassed + " " +
      survey.css.progressButtonsListElementCurrent,
    "3) Page 1 style is passed and current");
  assert.equal(progress.getListElementCss(1),
    survey.css.progressButtonsListElementPassed,
    "3) Page 2 style is passed");
  assert.equal(progress.getListElementCss(2),
    "", "3) Page 3 style is empty");
});
QUnit.test("SurveyProgressButtonsModel list elements non clickable", function(assert) {
  let json: any = {
    "pages": [
     {
      "name": "page1",
      "elements": [
       {
        "type": "text",
        "name": "question1"
       }
      ]
     },
     {
      "name": "page2",
      "elements": [
       {
        "type": "text",
        "name": "question2"
       }
      ]
     },
     {
      "name": "page3",
      "elements": [
       {
        "type": "text",
        "name": "question3"
       }
      ]
     }
    ]
   };
  let survey: SurveyModel = new SurveyModel(json);
  survey.onServerValidateQuestions.add((_: any, options: any) => options.complete());
  let progress: SurveyProgressButtonsModel = new SurveyProgressButtonsModel(survey);
  assert.equal(progress.getListElementCss(0),
    survey.css.progressButtonsListElementCurrent,
    "1) Page 1 style is current");
  assert.equal(progress.getListElementCss(1),
    "", "1) Page 2 style is empty");
  assert.equal(progress.getListElementCss(2),
    survey.css.progressButtonsListElementNonClickable,
    "1) Page 3 style is non clickable");
});