import { describe, test, expect } from "vitest";

import { SurveyModel } from "../src/survey";
import { Cover } from "../src/header";
import { settings } from "../src/settings";
import { surveyCss } from "../src/defaultCss/defaultCss";

describe("Layout element models", () => {
  test("SurveyNavigationLayoutModel: creates two layout elements and places them by location", () => {
    const survey = new SurveyModel({
      elements: [{ type: "text", name: "q1" }]
    });

    const elements = survey.navigationLayoutModel.createLayoutElements();
    expect(elements.length).toBe(2);
    expect(elements.map(el => el.id)).toEqual(["buttons-navigation", "buttons-navigation-top"]);

    const bottomElement = elements.find(el => el.id === "buttons-navigation");
    const topElement = elements.find(el => el.id === "buttons-navigation-top");
    expect(bottomElement.component).toBe("sv-action-bar");
    expect(topElement.component).toBe("sv-action-bar");
    expect(bottomElement.getData()).toBe(survey.navigationBar);
    expect(topElement.getData()).toBe(survey.navigationBar);

    survey.showNavigationButtons = true;
    survey.navigationButtonsLocation = "bottom";
    expect(topElement.isInContainer("contentTop")).toBe(false);
    expect(bottomElement.isInContainer("contentBottom")).toBe(true);

    survey.navigationButtonsLocation = "top";
    expect(topElement.isInContainer("contentTop")).toBe(true);
    expect(bottomElement.isInContainer("contentBottom")).toBe(false);

    survey.navigationButtonsLocation = "topBottom";
    expect(topElement.isInContainer("contentTop")).toBe(true);
    expect(bottomElement.isInContainer("contentBottom")).toBe(true);

    survey.showNavigationButtons = false;
    expect(topElement.isInContainer("contentTop")).toBe(false);
    expect(bottomElement.isInContainer("contentBottom")).toBe(false);
  });

  test("SurveyProgressTextModel: returns all progress variants and picks active one", () => {
    const oldLegacyProgressBarView = settings.legacyProgressBarView;
    const oldCssType = surveyCss.currentType;
    settings.legacyProgressBarView = false;
    surveyCss.currentType = "default";

    try {
      const survey = new SurveyModel({
        showProgressBar: true,
        progressBarLocation: "top",
        progressBarType: "pages",
        pages: [
          {
            elements: [{ type: "text", name: "q1" }]
          },
          {
            elements: [{ type: "text", name: "q2" }]
          }
        ]
      });

      const elements = survey.progressTextModel.createLayoutElements();
      expect(elements.map(el => el.id)).toEqual([
        "progress-buttons",
        "progress-questions",
        "progress-pages",
        "progress-correctquestions",
        "progress-requiredquestions"
      ]);

      const buttonsElement = elements.find(el => el.id === "progress-buttons");
      const requiredQuestionsElement = elements.find(el => el.id === "progress-requiredquestions");

      expect(buttonsElement.component).toBe("sv-progress-buttons");
      expect(buttonsElement.isInContainer("center")).toBe(true);
      expect(buttonsElement.isInContainer("footer")).toBe(false);

      survey.progressBarType = "requiredQuestions";
      expect(requiredQuestionsElement.isInContainer("center")).toBe(true);
      expect(buttonsElement.isInContainer("center")).toBe(false);

      survey.doComplete();
      expect(requiredQuestionsElement.isInContainer("center")).toBe(false);
    } finally {
      settings.legacyProgressBarView = oldLegacyProgressBarView;
      surveyCss.currentType = oldCssType;
    }
  });

  test("TOCModel: layout element follows showTOC and tocLocation", () => {
    const survey = new SurveyModel({
      showTOC: true,
      tocLocation: "left",
      pages: [
        {
          elements: [{ type: "text", name: "q1" }]
        },
        {
          elements: [{ type: "text", name: "q2" }]
        }
      ]
    });

    const elements = survey.tocModel.createLayoutElements();
    expect(elements.length).toBe(1);
    const tocElement = elements[0];
    expect(tocElement.id).toBe("toc-navigation");
    expect(tocElement.component).toBe("sv-navigation-toc");
    expect(tocElement.getData()).toBe(survey.tocModel);

    expect(tocElement.isInContainer("left")).toBe(true);
    expect(tocElement.isInContainer("right")).toBe(false);

    survey.tocLocation = "both";
    expect(tocElement.isInContainer("left")).toBe(true);
    expect(tocElement.isInContainer("right")).toBe(true);

    survey.showTOC = false;
    expect(tocElement.isInContainer("left")).toBe(false);
    expect(tocElement.isInContainer("right")).toBe(false);
  });

  test("SurveyTimerModel: layout element placement respects timer location and display mode", () => {
    const survey = new SurveyModel({
      showTimer: true,
      timerLocation: "top",
      pages: [
        {
          elements: [{ type: "text", name: "q1" }]
        }
      ]
    });

    const elements = survey.timerModel.createLayoutElements();
    expect(elements.length).toBe(1);

    const timerElement = elements[0];
    expect(timerElement.id).toBe("timerpanel");
    expect(timerElement.component).toBe("sv-timerpanel");
    expect(timerElement.template).toBe("survey-timerpanel");
    expect(timerElement.getData()).toBe(survey.timerModel);

    expect(timerElement.isInContainer("header")).toBe(true);
    expect(timerElement.isInContainer("footer")).toBe(false);

    survey.timerLocation = "bottom";
    expect(timerElement.isInContainer("header")).toBe(false);
    expect(timerElement.isInContainer("footer")).toBe(true);

    survey.readOnly = true;
    expect(timerElement.isInContainer("header")).toBe(false);
    expect(timerElement.isInContainer("footer")).toBe(false);
  });

  test("Cover: layout element switches container when TOC is visible and no background", () => {
    const survey = new SurveyModel({
      headerView: "advanced",
      pages: [
        {
          elements: [{ type: "text", name: "q1" }]
        }
      ]
    });

    const cover = new Cover();
    cover.survey = survey;
    const elements = cover.createLayoutElements();
    expect(elements.length).toBe(1);

    const headerElement = elements[0];
    expect(headerElement.id).toBe("advanced-header");
    expect(headerElement.component).toBe("sv-header");
    expect(headerElement.container).toBe("header");

    expect(headerElement.isInContainer("header")).toBe(true);
    expect(headerElement.isInContainer("contentTop")).toBe(false);

    survey.showTOC = true;
    cover.backgroundColor = "transparent";
    cover.backgroundImage = "";
    expect(headerElement.isInContainer("header")).toBe(false);
    expect(headerElement.isInContainer("contentTop")).toBe(true);

    cover.backgroundColor = "#ff0000";
    expect(headerElement.isInContainer("header")).toBe(true);
    expect(headerElement.isInContainer("contentTop")).toBe(false);

    survey.showTOC = false;
    survey.doComplete();
    expect(headerElement.isInContainer("header")).toBe(false);
    survey.showHeaderOnCompletePage = true;
    expect(headerElement.isInContainer("header")).toBe(true);
  });
});
