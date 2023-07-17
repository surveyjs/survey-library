import { SurveyModel } from "../src/survey";
import { createTOCListModel, getTocRootCss } from "../src/surveyToc";

export default QUnit.module("TOC");

QUnit.test("TOC follow nav buttons", function(assert) {
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
  let tocListModel = createTOCListModel(survey);

  assert.equal("page1", tocListModel.selectedItem.id, "Page 1 is current");
  survey.nextPage();
  assert.equal("page2", tocListModel.selectedItem.id, "Page 2 is current after navigation");
});

QUnit.test("TOC root CSS", function(assert) {
  let survey: SurveyModel = new SurveyModel({});

  let tocRootCss = getTocRootCss(survey);
  assert.equal("sv_progress-toc sv_progress-toc--left", tocRootCss, "toc left css");

  survey.tocLocation = "right";
  tocRootCss = getTocRootCss(survey);
  assert.equal("sv_progress-toc sv_progress-toc--right", tocRootCss, "toc right css");
});

QUnit.test("TOC pages visibility", function(assert) {
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
  let tocListModel = createTOCListModel(survey);

  assert.equal(tocListModel.visibleItems.length, 3, "All pages are visible");
  assert.equal(tocListModel.visibleItems[0].id, survey.pages[0].name, "Page 1 is visible");
  survey.pages[0].visible = false;
  assert.equal(tocListModel.visibleItems.length, 2, "only 2 pages are visible");
  assert.equal(tocListModel.visibleItems[0].id, survey.pages[1].name, "Page 1 is invisible, page 2 is the first");
});

QUnit.test("TOC pages visibility, do not include start page into TOC, bug #6192", function(assert) {
  let json: any = {
    "firstPageIsStarted": true,
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
  let tocListModel = createTOCListModel(survey);

  assert.equal(tocListModel.visibleItems.length, 2, "First page is not visible");
  assert.equal(tocListModel.visibleItems[0].id, survey.pages[1].name, "Page 1 is invisible, page 2 is the first");
  survey.firstPageIsStarted = false;
  assert.equal(tocListModel.visibleItems.length, 3, "First page is visible");
  assert.equal(tocListModel.visibleItems[0].id, survey.pages[0].name, "Page 1 is visible, page 1 is the first");
});

QUnit.test("TOC pages navigation with start page, bug #6327", function(assert) {
  let json: any = {
    "firstPageIsStarted": true,
    "pages": [
      {
        "name": "page1",
        "elements": [
          {
            "type": "html",
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
      },
      {
        "name": "page4",
        "elements": [
          {
            "type": "text",
            "name": "question4"
          }
        ]
      }
    ]
  };
  let survey: SurveyModel = new SurveyModel(json);
  let tocListModel = createTOCListModel(survey);

  assert.equal(tocListModel.visibleItems.length, 3, "First page is not visible");
  assert.equal(survey.currentPage.name, "page2", "Current page is 2");
  tocListModel.visibleItems[1].action();
  assert.equal(survey.currentPage.name, "page3", "Current page is 3");
});