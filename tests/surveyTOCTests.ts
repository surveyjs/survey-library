import { Action } from "../src/actions/action";
import { PageModel } from "../src/page";
import { SurveyModel } from "../src/survey";
import { createTOCListModel, getTocRootCss } from "../src/surveyToc";

export default QUnit.module("TOC");

QUnit.test("TOC follow nav buttons", function (assert) {
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

QUnit.test("TOC root CSS", function (assert) {
  let survey: SurveyModel = new SurveyModel({});

  let tocRootCss = getTocRootCss(survey);
  assert.equal("sv_progress-toc sv_progress-toc--left", tocRootCss, "toc left css");

  survey.tocLocation = "right";
  tocRootCss = getTocRootCss(survey);
  assert.equal("sv_progress-toc sv_progress-toc--right", tocRootCss, "toc right css");
});

QUnit.test("TOC pages visibility", function (assert) {
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

QUnit.test("TOC pages visibility, do not include start page into TOC, bug #6192", function (assert) {
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

QUnit.test("TOC pages navigation with start page, bug #6327", function (assert) {
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

QUnit.test("TOC questionsOnPageMode singlePage", function (assert) {
  let json: any = {
    "questionsOnPageMode": "singlePage",
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
      }
    ]
  };
  let survey: SurveyModel = new SurveyModel(json);
  let tocListModel = createTOCListModel(survey);

  assert.equal(tocListModel.visibleItems.length, 3, "3 items is TOC");
  assert.equal(tocListModel.visibleItems[0].id, survey.pages[0].elements[0].name, "Page 1");
  assert.equal(tocListModel.visibleItems[1].id, survey.pages[0].elements[1].name, "Page 2");
  assert.equal(tocListModel.visibleItems[2].id, survey.pages[0].elements[2].name, "Page 3");
});

QUnit.test("TOC respects markup", function (assert) {
  let json: any = {
    "pages": [
      {
        "name": "page1",
        "title": "Text with <strong>strong text</strong>",
        "elements": [
          {
            "type": "html",
          }
        ]
      },
      {
        "name": "page2",
        "navigationTitle": "Text with <em>emphasys text</em>",
        "elements": [
          {
            "type": "text",
            "name": "question2"
          }
        ]
      },
      {
        "name": "page3",
        "title": "Page 3",
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
  survey.onTextMarkdown.add(function (survey, options) {
    options.html = "markup " + options.text;
  });
  let tocListModel = createTOCListModel(survey);

  assert.equal(survey.pages[2].locTitle.textOrHtml, "markup Page 3", "survey.pages[2]");

  assert.equal(tocListModel.visibleItems.length, 4, "2 items is TOC");
  assert.equal(tocListModel.visibleItems[0].locTitle.textOrHtml, "markup Text with <strong>strong text</strong>", "Page 1 = locTitle");
  assert.equal(tocListModel.visibleItems[1].locTitle.textOrHtml, "markup Text with <em>emphasys text</em>", "Page 2 - nav title");
  assert.equal(tocListModel.visibleItems[2].locTitle.textOrHtml, "markup Page 3", "Page 3");
  assert.equal(tocListModel.visibleItems[3].locTitle.textOrHtml, "page4", "Page 4");
});

QUnit.test("TOC shouldn't affect page title", function (assert) {
  let json: any = {
    "pages": [
      {
        "name": "page1",
        "title": "Page 1 title",
        "navigationTitle": "Text with <em>emphasys text</em>",
        "elements": [
          {
            "type": "text",
            "name": "question2"
          }
        ]
      },
    ]
  };
  const survey: SurveyModel = new SurveyModel(json);

  const page = survey.pages[0];
  assert.equal(page.locTitle.textOrHtml, "Page 1 title", "Page 1 title");
  assert.equal(page.locNavigationTitle.textOrHtml, "Text with <em>emphasys text</em>", "Page 1 - nav title");

  const tocListModel = createTOCListModel(survey);
  assert.equal(page.locNavigationTitle.textOrHtml, "Text with <em>emphasys text</em>", "Page 1 - nav title");
  assert.equal(tocListModel.visibleItems.length, 1, "2 items is TOC");
  assert.equal(tocListModel.visibleItems[0].locTitle.textOrHtml, "Text with <em>emphasys text</em>", "Page 1 - nav title in TOC");
  assert.equal(page.locTitle.textOrHtml, "Page 1 title", "Page 1 title");
});

QUnit.test("TOC shouldn't show search", function (assert) {
  let json: any = {
    "pages": [
      {
        "name": "page1",
        "elements": [
          {
            "type": "text",
            "name": "question2"
          }
        ]
      },
    ]
  };
  const survey: SurveyModel = new SurveyModel(json);
  const tocListModel = createTOCListModel(survey);
  assert.equal(tocListModel.searchEnabled, false, "Search in TOC should be disabled");
});
QUnit.test("survey.tryNavigateToPage", function (assert) {
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
            "name": "question2",
            "isRequired": true
          }
        ]
      },
      {
        "name": "page3",
        "elements": [
          {
            "type": "text",
            "name": "question3",
            "isRequired": true
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
  const survey = new SurveyModel(json);
  const pages = new Array<string>();
  survey.onCurrentPageChanged.add((sender, options) => {
    pages.push(options.newCurrentPage.name);
  });
  assert.equal(survey.currentPageNo, 0, "currentPageNo #1");
  assert.equal(survey.tryNavigateToPage(survey.pages[3]), false, "navigate #1");
  assert.equal(survey.currentPageNo, 1, "currentPageNo #2");
  assert.equal(survey.tryNavigateToPage(survey.pages[2]), false, "navigate #2");
  assert.equal(survey.currentPageNo, 1, "currentPageNo #3");
  assert.equal(survey.tryNavigateToPage(survey.pages[0]), true, "navigate #3");
  assert.equal(survey.currentPageNo, 0, "currentPageNo #4");
  survey.setValue("question2", "val2");
  assert.equal(survey.tryNavigateToPage(survey.pages[3]), false, "navigate #4");
  assert.equal(survey.currentPageNo, 2, "currentPageNo #4");
  assert.equal(survey.tryNavigateToPage(survey.pages[0]), true, "navigate #5");
  assert.equal(survey.currentPageNo, 0, "currentPageNo #5");
  survey.setValue("question3", "val3");
  assert.equal(survey.tryNavigateToPage(survey.pages[3]), true, "navigate #6");
  assert.equal(survey.currentPageNo, 3, "currentPageNo #6");
  assert.deepEqual(pages, ["page2", "page1", "page3", "page1", "page4"], "Check onCurrentPageChanged");

  survey.clear();
  assert.equal(survey.currentPageNo, 0, "currentPageNo #7");
  assert.equal(survey.tryNavigateToPage(survey.pages[3]), false, "navigate #7");
  survey.checkErrorsMode = "onComplete";
  assert.equal(survey.tryNavigateToPage(survey.pages[3]), true, "navigate #8");
  assert.equal(survey.currentPageNo, 3, "currentPageNo #9");
});
QUnit.test("TOC should be created for survey with no current page", function (assert) {
  let json: any = { "logoPosition": "right", "pages": [{ "name": "page1", "elements": [{ "type": "panel", "name": "panel1", "width": "1180px" }] }] };
  const survey: SurveyModel = new SurveyModel(json);
  assert.equal(survey.pages.length, 1);
  assert.equal(survey.currentPageNo, -1);
  const tocListModel = createTOCListModel(survey);
  assert.ok(!!tocListModel, "TOC model should be created");
});
