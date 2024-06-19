import { Action } from "../src/actions/action";
import { PageModel } from "../src/page";
import { SurveyModel } from "../src/survey";
import { TOCModel, createTOCListModel, getTocRootCss } from "../src/surveyToc";

export default QUnit.module("TOC");

QUnit.test("follow nav buttons", function (assert) {
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

QUnit.test("root CSS", function (assert) {
  let survey: SurveyModel = new SurveyModel({});

  let tocRootCss = getTocRootCss(survey);
  assert.equal("sv_progress-toc sv_progress-toc--left sv_progress-toc--sticky", tocRootCss, "toc left css");

  survey.tocLocation = "right";
  tocRootCss = getTocRootCss(survey);
  assert.equal("sv_progress-toc sv_progress-toc--right sv_progress-toc--sticky", tocRootCss, "toc right css");

  TOCModel.StickyPosition = false;
  survey.tocLocation = "left";

  tocRootCss = getTocRootCss(survey);
  assert.equal("sv_progress-toc sv_progress-toc--left", tocRootCss, "toc left css");

  survey.tocLocation = "right";
  tocRootCss = getTocRootCss(survey);
  assert.equal("sv_progress-toc sv_progress-toc--right", tocRootCss, "toc right css");

  TOCModel.StickyPosition = true;
});

QUnit.test("pages visibility", function (assert) {
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

QUnit.test("pages visibility, do not include start page into TOC, bug #6192", function (assert) {
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

QUnit.test("pages navigation with start page, bug #6327", function (assert) {
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

QUnit.test("questionsOnPageMode singlePage", function (assert) {
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

QUnit.test("respects markup", function (assert) {
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

QUnit.test("shouldn't affect page title", function (assert) {
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

QUnit.test("shouldn't show search", function (assert) {
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

QUnit.test("should be created for survey with no current page", function (assert) {
  let json: any = { "logoPosition": "right", "pages": [{ "name": "page1", "elements": [{ "type": "panel", "name": "panel1", "width": "1180px" }] }] };
  const survey: SurveyModel = new SurveyModel(json);
  assert.equal(survey.pages.length, 1);
  assert.equal(survey.currentPageNo, -1);
  const tocListModel = createTOCListModel(survey);
  assert.ok(!!tocListModel, "TOC model should be created");
});

QUnit.test("updateStickyTOCSize", function (assert) {
  TOCModel.StickyPosition = true;
  const survey: SurveyModel = new SurveyModel({});
  const tocModel = new TOCModel(survey);
  const rootElementWithTitle = document.createElement("div");

  rootElementWithTitle.innerHTML = `<div class="sv_custom_header"></div>
                                    <div class="sd-container-modern">
                                      <div class="sd-title sd-container-modern__title"></div>
                                      <div class="sv-components-row">
                                        <div class="sv-components-column">
                                          <div class="sv_progress-toc sv_progress-toc--left sv_progress-toc--sticky"></div>
                                        </div>
                                        <div class="sv-components-column">
                                        </div>
                                      </div>
                                    </div>`;
  const titleElement = rootElementWithTitle.querySelector(".sd-title") as HTMLDivElement;
  titleElement.getBoundingClientRect = () => ({
    height: 40,
  } as any);
  const tocRootElement = rootElementWithTitle.querySelector(".sv_progress-toc") as HTMLDivElement;
  assert.equal(tocRootElement.style.height, "", "No height set");

  const mockRootEl: any = {
    querySelector: s => rootElementWithTitle.querySelector(s),
    getBoundingClientRect: () => ({
      height: 200,
    }),
    scrollTop: 0,
    style: {}
  };
  tocModel.updateStickyTOCSize(mockRootEl);
  assert.equal(tocRootElement.style.height, "159px", "Height updated");

  mockRootEl.scrollTop = 60;
  tocModel.updateStickyTOCSize(mockRootEl);
  assert.equal(tocRootElement.style.height, "199px", "Height updated to full container");

  mockRootEl.scrollTop = 20;
  tocModel.updateStickyTOCSize(mockRootEl);
  assert.equal(tocRootElement.style.height, "179px", "Height updated to half title");
});
