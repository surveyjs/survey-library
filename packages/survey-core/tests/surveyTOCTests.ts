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

    expect("page1", "Page 1 is current").toBe(tocListModel.selectedItem.id);
    survey.nextPage();
    expect("page2", "Page 2 is current after navigation").toBe(tocListModel.selectedItem.id);
  });

  test("root CSS", () => {
    let survey: SurveyModel = new SurveyModel({});

    let tocRootCss = getTocRootCss(survey);
    expect("sv_progress-toc sv_progress-toc--left sv_progress-toc--sticky", "toc left css").toBe(tocRootCss);

    survey.tocLocation = "right";
    tocRootCss = getTocRootCss(survey);
    expect("sv_progress-toc sv_progress-toc--right sv_progress-toc--sticky", "toc right css").toBe(tocRootCss);

    TOCModel.StickyPosition = false;
    survey.tocLocation = "left";

    tocRootCss = getTocRootCss(survey);
    expect("sv_progress-toc sv_progress-toc--left", "toc left css").toBe(tocRootCss);

    survey.tocLocation = "right";
    tocRootCss = getTocRootCss(survey);
    expect("sv_progress-toc sv_progress-toc--right", "toc right css").toBe(tocRootCss);

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

    expect(tocListModel.visibleItems.length, "All pages are visible").toBe(3);
    expect(tocListModel.visibleItems[0].id, "Page 1 is visible").toBe(survey.pages[0].name);
    survey.pages[0].visible = false;
    expect(tocListModel.visibleItems.length, "only 2 pages are visible").toBe(2);
    expect(tocListModel.visibleItems[0].id, "Page 1 is invisible, page 2 is the first").toBe(survey.pages[1].name);
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

    expect(tocListModel.visibleItems.length, "First page is not visible").toBe(2);
    expect(tocListModel.visibleItems[0].id, "Page 1 is invisible, page 2 is the first").toBe(survey.pages[1].name);
    survey.firstPageIsStartPage = false;
    expect(tocListModel.visibleItems.length, "First page is visible").toBe(3);
    expect(tocListModel.visibleItems[0].id, "Page 1 is visible, page 1 is the first").toBe(survey.pages[0].name);
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

    expect(tocListModel.visibleItems.length, "First page is not visible").toBe(3);
    expect(survey.currentPage.name, "Current page is 2").toBe("page2");
    tocListModel.visibleItems[1].action();
    expect(survey.currentPage.name, "Current page is 3").toBe("page3");
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
    expect(page.elements.length, "There are two elements in the root").toBe(3);
    expect(tocListModel.visibleItems.length, "3 items is TOC").toBe(3);
    expect(tocListModel.visibleItems[0].id, "Page 1").toBe(page.elements[0].name);
    expect(tocListModel.visibleItems[1].id, "Page 2").toBe(page.elements[1].name);
    expect(tocListModel.visibleItems[2].id, "Page 3").toBe(page.elements[2].name);
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
    expect(tocListModel.visibleItems.length, "3 items is TOC").toBe(3);
    expect(tocListModel.selectedItem.id, "first page is active").toBe("page1");
    survey.getQuestionByName("question3").focusIn();
    expect(tocListModel.selectedItem.id, "3rd page is active after question3 focused").toBe("page3");
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

    expect(survey.pages[2].locTitle.textOrHtml, "survey.pages[2]").toBe("markup Page 3");

    expect(tocListModel.visibleItems.length, "2 items is TOC").toBe(4);
    expect(tocListModel.visibleItems[0].locTitle.textOrHtml, "Page 1 = locTitle").toBe("markup Text with <strong>strong text</strong>");
    expect(tocListModel.visibleItems[1].locTitle.textOrHtml, "Page 2 - nav title").toBe("markup Text with <em>emphasys text</em>");
    expect(tocListModel.visibleItems[2].locTitle.textOrHtml, "Page 3").toBe("markup Page 3");
    expect(tocListModel.visibleItems[3].locTitle.textOrHtml, "Page 4").toBe("page4");
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
    expect(page.locTitle.textOrHtml, "Page 1 title").toBe("Page 1 title");
    expect(page.locNavigationTitle.textOrHtml, "Page 1 - nav title").toBe("Text with <em>emphasys text</em>");

    const tocListModel = createTOCListModel(survey);
    expect(page.locNavigationTitle.textOrHtml, "Page 1 - nav title").toBe("Text with <em>emphasys text</em>");
    expect(tocListModel.visibleItems.length, "2 items is TOC").toBe(1);
    expect(tocListModel.visibleItems[0].locTitle.textOrHtml, "Page 1 - nav title in TOC").toBe("Text with <em>emphasys text</em>");
    expect(page.locTitle.textOrHtml, "Page 1 title").toBe("Page 1 title");
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
    expect(tocListModel.searchEnabled, "Search in TOC should be disabled").toBe(false);
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
    expect(survey.currentPageNo, "currentPageNo #1").toBe(0);
    expect(survey.tryNavigateToPage(survey.pages[3]), "navigate #1").toBe(false);
    expect(survey.currentPageNo, "currentPageNo #2").toBe(1);
    expect(survey.tryNavigateToPage(survey.pages[2]), "navigate #2").toBe(false);
    expect(survey.currentPageNo, "currentPageNo #3").toBe(1);
    expect(survey.tryNavigateToPage(survey.pages[0]), "navigate #3").toBe(true);
    expect(survey.currentPageNo, "currentPageNo #4").toBe(0);
    survey.setValue("question2", "val2");
    expect(survey.tryNavigateToPage(survey.pages[3]), "navigate #4").toBe(false);
    expect(survey.currentPageNo, "currentPageNo #4").toBe(2);
    expect(survey.tryNavigateToPage(survey.pages[0]), "navigate #5").toBe(true);
    expect(survey.currentPageNo, "currentPageNo #5").toBe(0);
    survey.setValue("question3", "val3");
    expect(survey.tryNavigateToPage(survey.pages[3]), "navigate #6").toBe(true);
    expect(survey.currentPageNo, "currentPageNo #6").toBe(3);
    expect(pages, "Check onCurrentPageChanged").toEqual(["page2", "page1", "page3", "page1", "page4"]);

    survey.clear();
    expect(survey.currentPageNo, "currentPageNo #7").toBe(0);
    expect(survey.tryNavigateToPage(survey.pages[3]), "navigate #7").toBe(false);
    survey.checkErrorsMode = "onComplete";
    expect(survey.tryNavigateToPage(survey.pages[3]), "navigate #8").toBe(true);
    expect(survey.currentPageNo, "currentPageNo #9").toBe(3);
  });

  test("should be created for survey with no current page", () => {
    let json: any = { "logoPosition": "right", "pages": [{ "name": "page1", "elements": [{ "type": "panel", "name": "panel1", "width": "1180px" }] }] };
    const survey: SurveyModel = new SurveyModel(json);
    expect(survey.pages.length).toBe(1);
    expect(survey.currentPageNo).toBe(-1);
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
    expect(tocRootElement.style.height, "No height set").toBe("");

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
    expect(tocRootElement.style.height, "Height updated").toBe("159px");

    scrollElement.scrollTop = 60;
    tocModel.updateStickyTOCSize(mockRootEl);
    expect(tocRootElement.style.height, "Height updated to full container").toBe("199px");

    scrollElement.scrollTop = 20;
    tocModel.updateStickyTOCSize(mockRootEl);
    expect(tocRootElement.style.height, "Height updated to half title").toBe("179px");
  });

  test("update toc list model on add new page and add new question", () => {
    let json: any = { "pages": [{ "name": "page1", "elements": [{ "type": "text", "name": "q1" }] }] };
    const survey: SurveyModel = new SurveyModel(json);
    expect(survey.pages.length).toBe(1);
    expect(survey.currentPageNo).toBe(0);
    const tocListModel = createTOCListModel(survey);

    expect(tocListModel.actions.length).toBe(1);
    expect(tocListModel.actions[0].visible).toBe(true);
    expect(tocListModel.actions[0].title).toBe("page1");

    const newPage = survey.addNewPage("newpage");

    expect(tocListModel.actions.length).toBe(2);
    expect(tocListModel.actions[0].visible).toBe(true);
    expect(tocListModel.actions[1].visible).toBe(false);
    expect(tocListModel.actions[1].title).toBe("newpage");

    newPage.title = "New Page";

    expect(tocListModel.actions.length).toBe(2);
    expect(tocListModel.actions[0].visible).toBe(true);
    expect(tocListModel.actions[1].visible).toBe(false);
    expect(tocListModel.actions[1].title).toBe("New Page");

    newPage.addNewQuestion("text", "q2");

    expect(tocListModel.actions.length).toBe(2);
    expect(tocListModel.actions[0].visible).toBe(true);
    expect(tocListModel.actions[0].title).toBe("page1");
    expect(tocListModel.actions[1].visible).toBe(true);
    expect(tocListModel.actions[1].title).toBe("New Page");
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
    expect(tocListModel.actions.length).toBe(1);
    expect(tocListModel.actions[0].visible).toBe(true);
    expect(tocListModel.actions[0].title).toBe("1. page1");
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
    expect(survey.validationAllowSwitchPages).toBe(false);
    expect(survey.validationAllowComplete).toBe(false);
    expect(survey.currentPageNo, "currentPageNo #1").toBe(0);
    expect(survey.tryNavigateToPage(survey.pages[2]), "navigate #1").toBe(false);
    expect(survey.currentPageNo, "currentPageNo #2").toBe(1);
    expect(survey.tryNavigateToPage(survey.pages[0]), "navigate #2").toBe(true);
    expect(survey.currentPageNo, "currentPageNo #1").toBe(0);
    expect(survey.tryNavigateToPage(survey.pages[1]), "navigate #3").toBe(true);
    expect(survey.currentPageNo, "currentPageNo #1").toBe(1);

    survey.validationAllowSwitchPages = true;
    expect(survey.validationAllowSwitchPages).toBe(true);
    expect(survey.validationAllowComplete).toBe(false);
    expect(survey.tryNavigateToPage(survey.pages[2]), "navigate #4").toBe(true);
    expect(survey.currentPageNo, "currentPageNo #3").toBe(2);
    expect(survey.tryNavigateToPage(survey.pages[0]), "navigate #5").toBe(true);
    expect(survey.currentPageNo, "currentPageNo #1").toBe(0);
    expect(survey.tryNavigateToPage(survey.pages[1]), "navigate #6").toBe(true);
    expect(survey.currentPageNo, "currentPageNo #2").toBe(1);

    survey.validationAllowComplete = true;
    expect(survey.validationAllowSwitchPages).toBe(true);
    expect(survey.validationAllowComplete).toBe(true);
    expect(survey.tryNavigateToPage(survey.pages[2]), "navigate #7").toBe(true);
    expect(survey.currentPageNo, "currentPageNo #3").toBe(2);
    expect(survey.tryNavigateToPage(survey.pages[0]), "navigate #8").toBe(true);
    expect(survey.currentPageNo, "currentPageNo #1").toBe(0);
    expect(survey.tryNavigateToPage(survey.pages[1]), "navigate #9").toBe(true);
    expect(survey.currentPageNo, "currentPageNo #2").toBe(1);
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
    expect(survey.tryNavigateToPage(survey.pages[1]), "try #1").toBe(false);
    expect(logs, "logs #1").toEqual(["page1"]);
    survey.setValue("question1", "val1");
    expect(survey.tryNavigateToPage(survey.pages[1]), "try #2").toBe(true);
    expect(logs, "logs #2").toEqual(["page1", "page1"]);
    expect(survey.tryNavigateToPage(survey.pages[0]), "try #3").toBe(true);
    expect(logs, "logs #3").toEqual(["page1", "page1"]);
    expect(survey.tryNavigateToPage(survey.pages[2]), "try #4").toBe(false);
    expect(survey.currentPageNo, "currentPageNo #4").toBe(1);
    expect(logs, "logs #4").toEqual(["page1", "page1", "page1"]);
    expect(survey.tryNavigateToPage(survey.pages[1]), "try #5").toBe(false);
    expect(logs, "logs #5").toEqual(["page1", "page1", "page1"]);
    expect(survey.tryNavigateToPage(survey.pages[2]), "try #6").toBe(false);
    expect(logs, "logs #6").toEqual(["page1", "page1", "page1", "page2"]);
    survey.setValue("question2", "val2");
    expect(survey.tryNavigateToPage(survey.pages[2]), "try #7").toBe(true);
    expect(logs, "logs #7").toEqual(["page1", "page1", "page1", "page2", "page2"]);
    expect(survey.tryNavigateToPage(survey.pages[0]), "try #8").toBe(true);
    expect(logs, "logs #8").toEqual(["page1", "page1", "page1", "page2", "page2"]);
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
    expect(survey.tryNavigateToPage(survey.pages[1]), "try #1").toBe(false);
    survey.validationEnabled = false;
    expect(survey.tryNavigateToPage(survey.pages[1]), "try #2").toBe(true);
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

    expect(survey.tryNavigateToPage(survey.pages[1]), "try #1").toBe(false);
    expect(survey.currentPageNo, "currentPageNo #1").toBe(0);
    expect(counter, "server validation counter, try #1").toBe(0);
    survey.setValue("question1", 101);

    expect(survey.tryNavigateToPage(survey.pages[1]), "try #2").toBe(false);
    expect(counter, "server validation counter, try #2").toBe(1);
    opt.errors["question1"] = "Error";
    opt.complete();
    expect(survey.currentPageNo, "currentPageNo #2").toBe(0);

    expect(survey.tryNavigateToPage(survey.pages[1]), "try #3").toBe(false);
    expect(counter, "server validation counter, try #3").toBe(2);
    expect(survey.currentPageNo, "currentPageNo #3.1").toBe(0);
    opt.complete();
    expect(survey.currentPageNo, "currentPageNo #3.2").toBe(1);
    expect(survey.tryNavigateToPage(survey.pages[0]), "try #4").toBe(true);
    expect(counter, "server validation counter, try #4").toBe(2);
    expect(survey.currentPageNo, "currentPageNo #4").toBe(0);
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

    expect(tocListModel.visibleItems.length, "One page is visible").toBe(1);
    expect(tocListModel.visibleItems[0].id, "Page 1 is visible in TOC").toBe(survey.pages[0].name);
    survey.data = {
      question1: "val1"
    };
    expect(tocListModel.visibleItems.length, "All pages are visible").toBe(2);
    expect(tocListModel.visibleItems[0].id, "Page 1 is visible in TOC").toBe(survey.pages[0].name);
    expect(tocListModel.visibleItems[1].id, "Page 2 is visible in TOC").toBe(survey.pages[1].name);
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

    expect(tocListModel.visibleItems.length, "One page is visible").toBe(1);
    expect(tocListModel.visibleItems[0].id, "Page 1 is visible in TOC").toBe(survey.pages[0].name);
    survey.data = {
      question1: "val1",
    };
    expect(tocListModel.visibleItems.length, "One page is visible - page2 is empty").toBe(1);
    expect(tocListModel.visibleItems[0].id, "Page 1 is visible in TOC - page2 is empty").toBe(survey.pages[0].name);
    survey.data = {
      question1: "val1",
      question2: "val2"
    };
    expect(tocListModel.visibleItems.length, "All pages are visible").toBe(2);
    expect(tocListModel.visibleItems[0].id, "Page 1 is visible in TOC").toBe(survey.pages[0].name);
    expect(tocListModel.visibleItems[1].id, "Page 2 is visible in TOC").toBe(survey.pages[1].name);
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

    expect(tocListModel.visibleItems.length).toBe(4);
    expect(survey.currentPage.name).toBe("single-page");
    expect(focus3rdPageCounter).toBe(0);
    tocListModel.visibleItems[2].action();
    expect(survey.currentPage.name).toBe("single-page");
    expect(focus3rdPageCounter).toBe(1);
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

    expect(tocListModel.visibleItems.length, "No TOC items in empty survey").toBe(0);
    survey.fromJSON(json);
    expect(tocListModel.visibleItems.length, "Two pages are visible in TOC").toBe(2);
    expect(tocListModel.visibleItems[0].id, "Page 1 is visible in TOC").toBe(survey.pages[0].name);
    expect(tocListModel.visibleItems[1].id, "Page 2 is visible in TOC").toBe(survey.pages[1].name);
    expect(tocListModel.actions.length, "Two pages are visible in TOC actions").toBe(2);
    expect(tocListModel.actions[0].title, "Page 1 is visible in TOC actions").toBe(survey.pages[0].name);
    expect(tocListModel.actions[1].title, "Page 2 is visible in TOC actions").toBe(survey.pages[1].name);
  });
  test("navigate to page in single page mode with collapsed panels", () => {
    let json: any = {
      "questionsOnPageMode": "singlePage",
      "showTOC": true,
      "pages": [
        {
          "name": "page1",
          "elements": [
            {
              "type": "panel",
              "name": "panel1",
              "title": "Panel 1",
              "state": "collapsed",
              "elements": [
                { "type": "text", "name": "question1" },
                { "type": "text", "name": "question2" }
              ]
            }
          ]
        },
        {
          "name": "page2",
          "elements": [
            {
              "type": "panel",
              "name": "panel2",
              "title": "Panel 2",
              "state": "collapsed",
              "elements": [
                { "type": "text", "name": "question3" },
                { "type": "text", "name": "question4" }
              ]
            }
          ]
        },
        {
          "name": "page3",
          "elements": [
            {
              "type": "panel",
              "name": "panel3",
              "title": "Panel 3",
              "state": "collapsed",
              "elements": [
                { "type": "text", "name": "question5" },
                { "type": "text", "name": "question6" }
              ]
            }
          ]
        }
      ]
    };
    const survey = new SurveyModel(json);
    const tocListModel = createTOCListModel(survey);
    const page = survey.currentPage;

    expect(tocListModel.visibleItems.length, "3 items in TOC").toBe(3);
    expect(page.name).toBe("single-page");

    const panel2 = survey.getPanelByName("panel2");
    expect(panel2.isCollapsed, "panel2 is collapsed before navigation").toBe(true);

    tocListModel.visibleItems[1].action();

    expect(panel2.isCollapsed, "panel2 is expanded after navigation").toBe(false);
  });
});
