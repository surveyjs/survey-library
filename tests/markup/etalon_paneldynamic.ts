import { StylesManager } from "survey-core";
import { registerMarkupTests } from "./helper";

registerMarkupTests(
  [{
    name: "Test paneldynamic with old navigation (progressTop) markup",
    json: {
      questions: [
        {
          type: "paneldynamic",
          name: "pd",
          titleLocation: "hidden",
          renderMode: "progressTop",
          panelCount: 2,
        },
      ]
    },
    snapshot: "paneldynamic-progress-top-legacy-navigation",
  },
  {
    name: "Test paneldynamic (progressTop) markup",
    json: {
      questions: [
        {
          type: "paneldynamic",
          name: "pd",
          titleLocation: "hidden",
          renderMode: "progressTop",
          panelCount: 2,
        },
      ]
    },
    snapshot: "paneldynamic-progress-top",
    before: () => StylesManager.applyTheme("defaultV2"),
    after: () => StylesManager.applyTheme("default"),
  },
  {
    name: "Test paneldynamic with old navigation (progressBottom) markup",
    json: {
      questions: [
        {
          type: "paneldynamic",
          name: "pd",
          titleLocation: "hidden",
          renderMode: "progressBottom",
          panelCount: 2,
        },
      ]
    },
    snapshot: "paneldynamic-progress-bottom-legacy-navigation",
  },
  {
    name: "Test paneldynamic (progressBottom) markup",
    json: {
      questions: [
        {
          type: "paneldynamic",
          name: "pd",
          titleLocation: "hidden",
          renderMode: "progressBottom",
          panelCount: 2,
        },
      ]
    },
    snapshot: "paneldynamic-progress-bottom",
    before: () => StylesManager.applyTheme("defaultV2"),
    after: () => StylesManager.applyTheme("default"),
  },
  {
    name: "Test paneldynamic with old navigation (list) markup",
    json: {
      questions: [
        {
          type: "paneldynamic",
          name: "pd",
          titleLocation: "hidden",
          renderMode: "list",
          panelCount: 2,
        },
      ]
    },
    snapshot: "paneldynamic-list-legacy-navigation",
  },
  {
    name: "Test paneldynamic (list) markup",
    json: {
      questions: [
        {
          type: "paneldynamic",
          name: "pd",
          titleLocation: "hidden",
          renderMode: "list",
          panelCount: 2,
        },
      ]
    },
    snapshot: "paneldynamic-list",
    before: () => StylesManager.applyTheme("defaultV2"),
    after: () => StylesManager.applyTheme("default"),
  },
  {
    name: "Test paneldynamic (list) markup",
    json: {
      questions: [
        {
          type: "paneldynamic",
          name: "pd",
          titleLocation: "hidden",
          renderMode: "list",
          templateElements: [
            {
              "type": "text",
              "titleLocation": "hidden",
              "name": "q1"
            }
          ],
          panelCount: 1,
        },
      ]
    },
    event: "onAfterRenderPage",
    snapshot: "paneldynamic-remove-btn-action-bar",
    before: () => { StylesManager.applyTheme("defaultV2"); },
    initSurvey: survey => {
      survey.getAllQuestions()[0].panels[0].allowAdaptiveActions = false;
    },
    after: () => StylesManager.applyTheme("default"),
  },
  {
    name: "Test paneldynamic (list) markup",
    json: {
      questions: [
        {
          type: "paneldynamic",
          name: "pd",
          titleLocation: "hidden",
          renderMode: "list",
          panelRemoveButtonLocation: "right",
          templateElements: [
            {
              "type": "text",
              "titleLocation": "hidden",
              "name": "q1"
            }
          ],
          panelCount: 1,
        },
      ]
    },
    event: "onAfterRenderPage",
    snapshot: "paneldynamic-remove-btn-right",
    before: () => StylesManager.applyTheme("defaultV2"),
    after: () => StylesManager.applyTheme("default"),
  },
  ]
);