import { Action } from "../src/actions/action";
import { PageModel } from "../src/page";
import { SurveyModel } from "../src/survey";
import { ServerValidateQuestionsEvent } from "../src/survey-events-api";
import { TOCModel, createTOCListModel, getTocRootCss } from "../src/surveyToc";

import { describe, test, expect } from "vitest";
describe("TOC", () => {
  test("follow nav buttons", () => {
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

    expect("page1", "Page 1 is current").toLooseEqual(tocListModel.selectedItem.id);
    survey.nextPage();
    expect("page2", "Page 2 is current after navigation").toLooseEqual(tocListModel.selectedItem.id);
  });

  test("root CSS", () => {
    let survey: SurveyModel = new SurveyModel({});

    let tocRootCss = getTocRootCss(survey);
    expect("sv_progress-toc sv_progress-toc--left sv_progress-toc--sticky", "toc left css").toLooseEqual(tocRootCss);

    survey.tocLocation = "right";
    tocRootCss = getTocRootCss(survey);
    expect("sv_progress-toc sv_progress-toc--right sv_progress-toc--sticky", "toc right css").toLooseEqual(tocRootCss);

    TOCModel.StickyPosition = false;
    survey.tocLocation = "left";

    tocRootCss = getTocRootCss(survey);
    expect("sv_progress-toc sv_progress-toc--left", "toc left css").toLooseEqual(tocRootCss);

    survey.tocLocation = "right";
    tocRootCss = getTocRootCss(survey);
    expect("sv_progress-toc sv_progress-toc--right", "toc right css").toLooseEqual(tocRootCss);

    TOCModel.StickyPosition = true;
  });

  test("pages visibility", () => {
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

    expect(tocListModel.visibleItems.length, "All pages are visible").toLooseEqual(3);
    expect(tocListModel.visibleItems[0].id, "Page 1 is visible").toLooseEqual(survey.pages[0].name);
    survey.pages[0].visible = false;
    expect(tocListModel.visibleItems.length, "only 2 pages are visible").toLooseEqual(2);
    expect(tocListModel.visibleItems[0].id, "Page 1 is invisible, page 2 is the first").toLooseEqual(survey.pages[1].name);
  });

  test("pages visibility, do not include start page into TOC, bug #6192", () => {
    let json: any = {
      "firstPageIsStartPage": true,
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

    expect(tocListModel.visibleItems.length, "First page is not visible").toLooseEqual(2);
    expect(tocListModel.visibleItems[0].id, "Page 1 is invisible, page 2 is the first").toLooseEqual(survey.pages[1].name);
    survey.firstPageIsStartPage = false;
    expect(tocListModel.visibleItems.length, "First page is visible").toLooseEqual(3);
    expect(tocListModel.visibleItems[0].id, "Page 1 is visible, page 1 is the first").toLooseEqual(survey.pages[0].name);
  });

  test("pages navigation with start page, bug #6327", () => {
    let json: any = {
      "firstPageIsStartPage": true,
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

    expect(tocListModel.visibleItems.length, "First page is not visible").toLooseEqual(3);
    expect(survey.currentPage.name, "Current page is 2").toLooseEqual("page2");
    tocListModel.visibleItems[1].action();
    expect(survey.currentPage.name, "Current page is 3").toLooseEqual("page3");
  });

  test("questionsOnPageMode singlePage", () => {
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
    const survey: SurveyModel = new SurveyModel(json);
    const tocListModel = createTOCListModel(survey);
    const page = survey.currentPage;
    expect(page.elements.length, "There are two elements in the root").toLooseEqual(3);
    expect(tocListModel.visibleItems.length, "3 items is TOC").toLooseEqual(3);
    expect(tocListModel.visibleItems[0].id, "Page 1").toLooseEqual(page.elements[0].name);
    expect(tocListModel.visibleItems[1].id, "Page 2").toLooseEqual(page.elements[1].name);
    expect(tocListModel.visibleItems[2].id, "Page 3").toLooseEqual(page.elements[2].name);
  });

  test("questionsOnPageMode singlePage selectedItem tracks focused question", () => {
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
    const survey: SurveyModel = new SurveyModel(json);
    const tocListModel = createTOCListModel(survey);
    expect(tocListModel.visibleItems.length, "3 items is TOC").toLooseEqual(3);
    expect(tocListModel.selectedItem.id, "first page is active").toLooseEqual("page1");
    survey.getQuestionByName("question3").focusIn();
    expect(tocListModel.selectedItem.id, "3rd page is active after question3 focused").toLooseEqual("page3");
  });

  test("respects markup", () => {
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

    expect(survey.pages[2].locTitle.textOrHtml, "survey.pages[2]").toLooseEqual("markup Page 3");

    expect(tocListModel.visibleItems.length, "2 items is TOC").toLooseEqual(4);
    expect(tocListModel.visibleItems[0].locTitle.textOrHtml, "Page 1 = locTitle").toLooseEqual("markup Text with <strong>strong text</strong>");
    expect(tocListModel.visibleItems[1].locTitle.textOrHtml, "Page 2 - nav title").toLooseEqual("markup Text with <em>emphasys text</em>");
    expect(tocListModel.visibleItems[2].locTitle.textOrHtml, "Page 3").toLooseEqual("markup Page 3");
    expect(tocListModel.visibleItems[3].locTitle.textOrHtml, "Page 4").toLooseEqual("page4");
  });

  test("shouldn't affect page title", () => {
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
    expect(page.locTitle.textOrHtml, "Page 1 title").toLooseEqual("Page 1 title");
    expect(page.locNavigationTitle.textOrHtml, "Page 1 - nav title").toLooseEqual("Text with <em>emphasys text</em>");

    const tocListModel = createTOCListModel(survey);
    expect(page.locNavigationTitle.textOrHtml, "Page 1 - nav title").toLooseEqual("Text with <em>emphasys text</em>");
    expect(tocListModel.visibleItems.length, "2 items is TOC").toLooseEqual(1);
    expect(tocListModel.visibleItems[0].locTitle.textOrHtml, "Page 1 - nav title in TOC").toLooseEqual("Text with <em>emphasys text</em>");
    expect(page.locTitle.textOrHtml, "Page 1 title").toLooseEqual("Page 1 title");
  });

  test("shouldn't show search", () => {
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
    expect(tocListModel.searchEnabled, "Search in TOC should be disabled").toLooseEqual(false);
  });

  test("survey.tryNavigateToPage", () => {
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
    expect(survey.currentPageNo, "currentPageNo #1").toLooseEqual(0);
    expect(survey.tryNavigateToPage(survey.pages[3]), "navigate #1").toLooseEqual(false);
    expect(survey.currentPageNo, "currentPageNo #2").toLooseEqual(1);
    expect(survey.tryNavigateToPage(survey.pages[2]), "navigate #2").toLooseEqual(false);
    expect(survey.currentPageNo, "currentPageNo #3").toLooseEqual(1);
    expect(survey.tryNavigateToPage(survey.pages[0]), "navigate #3").toLooseEqual(true);
    expect(survey.currentPageNo, "currentPageNo #4").toLooseEqual(0);
    survey.setValue("question2", "val2");
    expect(survey.tryNavigateToPage(survey.pages[3]), "navigate #4").toLooseEqual(false);
    expect(survey.currentPageNo, "currentPageNo #4").toLooseEqual(2);
    expect(survey.tryNavigateToPage(survey.pages[0]), "navigate #5").toLooseEqual(true);
    expect(survey.currentPageNo, "currentPageNo #5").toLooseEqual(0);
    survey.setValue("question3", "val3");
    expect(survey.tryNavigateToPage(survey.pages[3]), "navigate #6").toLooseEqual(true);
    expect(survey.currentPageNo, "currentPageNo #6").toLooseEqual(3);
    expect(pages, "Check onCurrentPageChanged").toEqualValues(["page2", "page1", "page3", "page1", "page4"]);

    survey.clear();
    expect(survey.currentPageNo, "currentPageNo #7").toLooseEqual(0);
    expect(survey.tryNavigateToPage(survey.pages[3]), "navigate #7").toLooseEqual(false);
    survey.checkErrorsMode = "onComplete";
    expect(survey.tryNavigateToPage(survey.pages[3]), "navigate #8").toLooseEqual(true);
    expect(survey.currentPageNo, "currentPageNo #9").toLooseEqual(3);
  });

  test("should be created for survey with no current page", () => {
    let json: any = { "logoPosition": "right", "pages": [{ "name": "page1", "elements": [{ "type": "panel", "name": "panel1", "width": "1180px" }] }] };
    const survey: SurveyModel = new SurveyModel(json);
    expect(survey.pages.length).toLooseEqual(1);
    expect(survey.currentPageNo).toLooseEqual(-1);
    const tocListModel = createTOCListModel(survey);
    expect(!!tocListModel, "TOC model should be created").toBeTruthy();
  });

  test("updateStickyTOCSize", () => {
    TOCModel.StickyPosition = true;
    const survey: SurveyModel = new SurveyModel({});
    survey.headerView = "basic";
    const tocModel = new TOCModel(survey);
    const rootElementWithTitle = document.createElement("div");

    rootElementWithTitle.innerHTML = `<div class="sv-scroll__scroller">
                                      <div class="sv_custom_header"></div>
                                      <div class="sd-container-modern">
                                        <div class="sd-title sd-container-modern__title"></div>
                                        <div class="sv-components-row">
                                          <div class="sv-components-column">
                                            <div class="sv_progress-toc sv_progress-toc--left sv_progress-toc--sticky"></div>
                                          </div>
                                          <div class="sv-components-column">
                                          </div>
                                        </div>
                                      </div>
                                    </div>`;
    const titleElement = rootElementWithTitle.querySelector(".sd-title") as HTMLDivElement;
    titleElement.getBoundingClientRect = () => ({
      height: 40,
    } as any);
    const tocRootElement = rootElementWithTitle.querySelector(".sv_progress-toc") as HTMLDivElement;
    expect(tocRootElement.style.height, "No height set").toLooseEqual("");

    const scrollElement = rootElementWithTitle.querySelector(".sv-scroll__scroller") as HTMLDivElement;
    let _scrollTop = 0;
    Object.defineProperty(scrollElement, "scrollTop", {
      get: function() {
        return _scrollTop;
      },
      set: function(value) {
        _scrollTop = value;
      },
      configurable: true // to be able to change this word
    });

    const mockRootEl: any = {
      querySelector: s => rootElementWithTitle.querySelector(s),
      getBoundingClientRect: () => ({
        height: 200,
      }),
      scrollTop: 0,
      style: {}
    };

    tocModel.updateStickyTOCSize(mockRootEl);
    expect(tocRootElement.style.height, "Height updated").toLooseEqual("159px");

    scrollElement.scrollTop = 60;
    tocModel.updateStickyTOCSize(mockRootEl);
    expect(tocRootElement.style.height, "Height updated to full container").toLooseEqual("199px");

    scrollElement.scrollTop = 20;
    tocModel.updateStickyTOCSize(mockRootEl);
    expect(tocRootElement.style.height, "Height updated to half title").toLooseEqual("179px");
  });

  test("update toc list model on add new page and add new question", () => {
    let json: any = { "pages": [{ "name": "page1", "elements": [{ "type": "text", "name": "q1" }] }] };
    const survey: SurveyModel = new SurveyModel(json);
    expect(survey.pages.length).toLooseEqual(1);
    expect(survey.currentPageNo).toLooseEqual(0);
    const tocListModel = createTOCListModel(survey);

    expect(tocListModel.actions.length).toLooseEqual(1);
    expect(tocListModel.actions[0].visible).toLooseEqual(true);
    expect(tocListModel.actions[0].title).toLooseEqual("page1");

    const newPage = survey.addNewPage("newpage");

    expect(tocListModel.actions.length).toLooseEqual(2);
    expect(tocListModel.actions[0].visible).toLooseEqual(true);
    expect(tocListModel.actions[1].visible).toLooseEqual(false);
    expect(tocListModel.actions[1].title).toLooseEqual("newpage");

    newPage.title = "New Page";

    expect(tocListModel.actions.length).toLooseEqual(2);
    expect(tocListModel.actions[0].visible).toLooseEqual(true);
    expect(tocListModel.actions[1].visible).toLooseEqual(false);
    expect(tocListModel.actions[1].title).toLooseEqual("New Page");

    newPage.addNewQuestion("text", "q2");

    expect(tocListModel.actions.length).toLooseEqual(2);
    expect(tocListModel.actions[0].visible).toLooseEqual(true);
    expect(tocListModel.actions[0].title).toLooseEqual("page1");
    expect(tocListModel.actions[1].visible).toLooseEqual(true);
    expect(tocListModel.actions[1].title).toLooseEqual("New Page");
  });

  test("TOC navigation shows page numbers", () => {
    const survey = new SurveyModel({
      showTOC: true,
      showPageNumbers: true,
      pages: [{
        name: "page1",
        elements: [
          { type: "text", name: "q1" },
        ]
      }]
    });
    const tocListModel = createTOCListModel(survey);
    expect(tocListModel.actions.length).toLooseEqual(1);
    expect(tocListModel.actions[0].visible).toLooseEqual(true);
    expect(tocListModel.actions[0].title).toLooseEqual("1. page1");
  });

  test("survey.tryNavigateToPage respects validationAllowSwitchPages and validationAllowComplete", () => {
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
              "isRequired": true,
              "requiredErrorText": "You SSN must be a 9-digit number.",
              "validators": [
                {
                  "type": "regex",
                  "text": "Your SSN must be a 9-digit number",
                  "regex": "^(?!0{3})(?!6{3})[0-8]\\d{2}-?(?!0{2})\\d{2}-?(?!0{4})\\d{4}$"
                }
              ],
              "maxLength": 9
            }
          ]
        },
        {
          "name": "page3",
          "elements": [
            {
              "type": "text",
              "name": "question3",
            }
          ]
        },
      ]
    };
    const survey = new SurveyModel(json);
    expect(survey.validationAllowSwitchPages).toLooseEqual(false);
    expect(survey.validationAllowComplete).toLooseEqual(false);
    expect(survey.currentPageNo, "currentPageNo #1").toLooseEqual(0);
    expect(survey.tryNavigateToPage(survey.pages[2]), "navigate #1").toLooseEqual(false);
    expect(survey.currentPageNo, "currentPageNo #2").toLooseEqual(1);
    expect(survey.tryNavigateToPage(survey.pages[0]), "navigate #2").toLooseEqual(true);
    expect(survey.currentPageNo, "currentPageNo #1").toLooseEqual(0);
    expect(survey.tryNavigateToPage(survey.pages[1]), "navigate #3").toLooseEqual(true);
    expect(survey.currentPageNo, "currentPageNo #1").toLooseEqual(1);

    survey.validationAllowSwitchPages = true;
    expect(survey.validationAllowSwitchPages).toLooseEqual(true);
    expect(survey.validationAllowComplete).toLooseEqual(false);
    expect(survey.tryNavigateToPage(survey.pages[2]), "navigate #4").toLooseEqual(true);
    expect(survey.currentPageNo, "currentPageNo #3").toLooseEqual(2);
    expect(survey.tryNavigateToPage(survey.pages[0]), "navigate #5").toLooseEqual(true);
    expect(survey.currentPageNo, "currentPageNo #1").toLooseEqual(0);
    expect(survey.tryNavigateToPage(survey.pages[1]), "navigate #6").toLooseEqual(true);
    expect(survey.currentPageNo, "currentPageNo #2").toLooseEqual(1);

    survey.validationAllowComplete = true;
    expect(survey.validationAllowSwitchPages).toLooseEqual(true);
    expect(survey.validationAllowComplete).toLooseEqual(true);
    expect(survey.tryNavigateToPage(survey.pages[2]), "navigate #7").toLooseEqual(true);
    expect(survey.currentPageNo, "currentPageNo #3").toLooseEqual(2);
    expect(survey.tryNavigateToPage(survey.pages[0]), "navigate #8").toLooseEqual(true);
    expect(survey.currentPageNo, "currentPageNo #1").toLooseEqual(0);
    expect(survey.tryNavigateToPage(survey.pages[1]), "navigate #9").toLooseEqual(true);
    expect(survey.currentPageNo, "currentPageNo #2").toLooseEqual(1);
  });
  test("survey.tryNavigateToPage & survey.onValidatePage, Bug#9241", () => {
    let json: any = {
      "pages": [
        {
          "name": "page1",
          "elements": [
            {
              "type": "text",
              "name": "question1",
              "isRequired": true
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
        }
      ]
    };
    const survey = new SurveyModel(json);
    const logs = new Array<string>();
    survey.onValidatePage.add((sender, options) => {
      logs.push(options.page.name);
    });
    expect(survey.tryNavigateToPage(survey.pages[1]), "try #1").toLooseEqual(false);
    expect(logs, "logs #1").toEqualValues(["page1"]);
    survey.setValue("question1", "val1");
    expect(survey.tryNavigateToPage(survey.pages[1]), "try #2").toLooseEqual(true);
    expect(logs, "logs #2").toEqualValues(["page1", "page1"]);
    expect(survey.tryNavigateToPage(survey.pages[0]), "try #3").toLooseEqual(true);
    expect(logs, "logs #3").toEqualValues(["page1", "page1"]);
    expect(survey.tryNavigateToPage(survey.pages[2]), "try #4").toLooseEqual(false);
    expect(survey.currentPageNo, "currentPageNo #4").toLooseEqual(1);
    expect(logs, "logs #4").toEqualValues(["page1", "page1", "page1"]);
    expect(survey.tryNavigateToPage(survey.pages[1]), "try #5").toLooseEqual(false);
    expect(logs, "logs #5").toEqualValues(["page1", "page1", "page1"]);
    expect(survey.tryNavigateToPage(survey.pages[2]), "try #6").toLooseEqual(false);
    expect(logs, "logs #6").toEqualValues(["page1", "page1", "page1", "page2"]);
    survey.setValue("question2", "val2");
    expect(survey.tryNavigateToPage(survey.pages[2]), "try #7").toLooseEqual(true);
    expect(logs, "logs #7").toEqualValues(["page1", "page1", "page1", "page2", "page2"]);
    expect(survey.tryNavigateToPage(survey.pages[0]), "try #8").toLooseEqual(true);
    expect(logs, "logs #8").toEqualValues(["page1", "page1", "page1", "page2", "page2"]);
  });
  test("survey.tryNavigateToPage & survey.validationEnabled = false, Bug#9363", () => {
    let json: any = {
      "pages": [
        {
          "name": "page1",
          "elements": [
            {
              "type": "text",
              "name": "question1",
              "isRequired": true
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
        }
      ]
    };
    const survey = new SurveyModel(json);
    const logs = new Array<string>();
    expect(survey.tryNavigateToPage(survey.pages[1]), "try #1").toLooseEqual(false);
    survey.validationEnabled = false;
    expect(survey.tryNavigateToPage(survey.pages[1]), "try #2").toLooseEqual(true);
  });
  test("The survey.onServerValidateQuestions function is not invoked when a user navigates between pages using the progress bar #9332", () => {
    const survey = new SurveyModel({
      "pages": [
        {
          "name": "page1",
          "elements": [
            {
              "type": "text",
              "name": "question1",
              "isRequired": true
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
        }
      ]
    });
    let opt: ServerValidateQuestionsEvent = <any>undefined;
    let counter = 0;
    survey.onServerValidateQuestions.add(function (sender, options) {
      opt = options;
      counter++;
    });

    expect(survey.tryNavigateToPage(survey.pages[1]), "try #1").toLooseEqual(false);
    expect(survey.currentPageNo, "currentPageNo #1").toLooseEqual(0);
    expect(counter, "server validation counter, try #1").toLooseEqual(0);
    survey.setValue("question1", 101);

    expect(survey.tryNavigateToPage(survey.pages[1]), "try #2").toLooseEqual(false);
    expect(counter, "server validation counter, try #2").toLooseEqual(1);
    opt.errors["question1"] = "Error";
    opt.complete();
    expect(survey.currentPageNo, "currentPageNo #2").toLooseEqual(0);

    expect(survey.tryNavigateToPage(survey.pages[1]), "try #3").toLooseEqual(false);
    expect(counter, "server validation counter, try #3").toLooseEqual(2);
    expect(survey.currentPageNo, "currentPageNo #3.1").toLooseEqual(0);
    opt.complete();
    expect(survey.currentPageNo, "currentPageNo #3.2").toLooseEqual(1);
    expect(survey.tryNavigateToPage(survey.pages[0]), "try #4").toLooseEqual(true);
    expect(counter, "server validation counter, try #4").toLooseEqual(2);
    expect(survey.currentPageNo, "currentPageNo #4").toLooseEqual(0);
  });

  test("pages visibility from visibleIf", () => {
    let json: any = {
      "pages": [
        {
          "name": "page1",
          "elements": [
            {
              "type": "text",
              "name": "question1"
            },
          ]
        },
        {
          "name": "page2",
          "visibleIf": "{question1} notempty",
          "elements": [
            {
              "type": "text",
              "name": "question3",
            }
          ]
        }
      ],
      "showTOC": true
    };
    let survey: SurveyModel = new SurveyModel(json);
    let tocListModel = createTOCListModel(survey);

    expect(tocListModel.visibleItems.length, "One page is visible").toLooseEqual(1);
    expect(tocListModel.visibleItems[0].id, "Page 1 is visible in TOC").toLooseEqual(survey.pages[0].name);
    survey.data = {
      question1: "val1"
    };
    expect(tocListModel.visibleItems.length, "All pages are visible").toLooseEqual(2);
    expect(tocListModel.visibleItems[0].id, "Page 1 is visible in TOC").toLooseEqual(survey.pages[0].name);
    expect(tocListModel.visibleItems[1].id, "Page 2 is visible in TOC").toLooseEqual(survey.pages[1].name);
  });
  test("pages visibility on value changed", () => {
    let json: any = {
      "pages": [
        {
          "name": "page1",
          "elements": [
            {
              "type": "text",
              "name": "question1"
            },
            {
              "type": "text",
              "name": "question2"
            }
          ]
        },
        {
          "name": "page2",
          "visibleIf": "{question1} notempty",
          "elements": [
            {
              "type": "text",
              "name": "question3",
              "visibleIf": "{question2} notempty"
            }
          ]
        }
      ],
      "showTOC": true
    };
    let survey: SurveyModel = new SurveyModel(json);
    let tocListModel = createTOCListModel(survey);

    expect(tocListModel.visibleItems.length, "One page is visible").toLooseEqual(1);
    expect(tocListModel.visibleItems[0].id, "Page 1 is visible in TOC").toLooseEqual(survey.pages[0].name);
    survey.data = {
      question1: "val1",
    };
    expect(tocListModel.visibleItems.length, "One page is visible - page2 is empty").toLooseEqual(1);
    expect(tocListModel.visibleItems[0].id, "Page 1 is visible in TOC - page2 is empty").toLooseEqual(survey.pages[0].name);
    survey.data = {
      question1: "val1",
      question2: "val2"
    };
    expect(tocListModel.visibleItems.length, "All pages are visible").toLooseEqual(2);
    expect(tocListModel.visibleItems[0].id, "Page 1 is visible in TOC").toLooseEqual(survey.pages[0].name);
    expect(tocListModel.visibleItems[1].id, "Page 2 is visible in TOC").toLooseEqual(survey.pages[1].name);
  });

  test("navigate to page in single page mode", () => {
    let json: any = {
      "questionsOnPageMode": "singlePage",
      "pages": [
        {
          "name": "page1",
          "elements": [{ "type": "html", }]
        },
        {
          "name": "page2",
          "elements": [{ "type": "text", "name": "question2" }]
        },
        {
          "name": "page3",
          "elements": [{ "type": "text", "name": "question3" }
          ]
        },
        {
          "name": "page4",
          "elements": [{ "type": "text", "name": "question4" }]
        }
      ]
    };
    let survey: SurveyModel = new SurveyModel(json);
    let focus3rdPageCounter = 0;
    survey.pages[2].focusFirstQuestion = () => focus3rdPageCounter++;
    let tocListModel = createTOCListModel(survey);

    expect(tocListModel.visibleItems.length).toLooseEqual(4);
    expect(survey.currentPage.name).toLooseEqual("single-page");
    expect(focus3rdPageCounter).toLooseEqual(0);
    tocListModel.visibleItems[2].action();
    expect(survey.currentPage.name).toLooseEqual("single-page");
    expect(focus3rdPageCounter).toLooseEqual(1);
  });
  test("update TOC pages on survey loaded from JSON", () => {
    let json: any = {
      "pages": [
        {
          "name": "page1",
          "elements": [
            {
              "type": "text",
              "name": "question1"
            },
          ]
        },
        {
          "name": "page2",
          "elements": [
            {
              "type": "text",
              "name": "question3",
            }
          ]
        }
      ],
      "showTOC": true
    };
    let survey: SurveyModel = new SurveyModel({});
    let tocListModel = createTOCListModel(survey);

    expect(tocListModel.visibleItems.length, "No TOC items in empty survey").toLooseEqual(0);
    survey.fromJSON(json);
    expect(tocListModel.visibleItems.length, "Two pages are visible in TOC").toLooseEqual(2);
    expect(tocListModel.visibleItems[0].id, "Page 1 is visible in TOC").toLooseEqual(survey.pages[0].name);
    expect(tocListModel.visibleItems[1].id, "Page 2 is visible in TOC").toLooseEqual(survey.pages[1].name);
    expect(tocListModel.actions.length, "Two pages are visible in TOC actions").toLooseEqual(2);
    expect(tocListModel.actions[0].title, "Page 1 is visible in TOC actions").toLooseEqual(survey.pages[0].name);
    expect(tocListModel.actions[1].title, "Page 2 is visible in TOC actions").toLooseEqual(survey.pages[1].name);
  });
});
