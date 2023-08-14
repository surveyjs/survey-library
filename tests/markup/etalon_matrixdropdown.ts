import { registerMarkupTests } from "./helper";
import { StylesManager } from "survey-core";

registerMarkupTests(
  [
    {
      name: "Test matrixdropdown with showInMultipleColumns",
      json: {
        elements: [
          {
            titleLocation: "hidden",
            type: "matrixdropdown",
            name: "matrix",
            rows: ["row1"],
            columns: [
              {
                "name": "col1",
                "cellType": "radiogroup",
                "showInMultipleColumns": true,
                "isRequired": true,
                "choices": [
                  "Item 1",
                ]
              },
              {
                "name": "col2",
                "cellType": "checkbox",
                "showInMultipleColumns": true,
                "isRequired": true,
                "choices": [
                  "Item 1",
                  "Item 2",
                ]
              }
            ]
          },
        ],
      },
      before: () => StylesManager.applyTheme("defaultV2"),
      after: () => StylesManager.applyTheme("default"),
      snapshot: "matrixdynamic-show-in-multiple-columns"
    },
    {
      name: "Test matrixdropdown errors top",
      json: {
        elements: [
          {
            titleLocation: "hidden",
            type: "matrixdropdown",
            name: "matrix",
            rows: ["row1"],
            columns: [
              {
                cellType: "text",
                isRequired: true,
                "name": "col1",
              },
            ]
          },
        ],
      },
      before: () => StylesManager.applyTheme("defaultV2"),
      initSurvey(survey) {
        survey.completeLastPage();
      },
      after: () => StylesManager.applyTheme("default"),
      snapshot: "matrixdropdown-cell-errors-top"
    },
    {
      name: "Test matrixdropdown errors top",
      json: {
        questionErrorLocation: "bottom",
        elements: [
          {
            titleLocation: "hidden",
            type: "matrixdropdown",
            name: "matrix",
            rows: ["row1"],
            columns: [
              {
                cellType: "text",
                isRequired: true,
                "name": "col1",
              },
            ]
          },
        ],
      },
      before: () => StylesManager.applyTheme("defaultV2"),
      initSurvey(survey) {
        survey.completeLastPage();
      },
      after: () => StylesManager.applyTheme("default"),
      snapshot: "matrixdropdown-cell-errors-bottom"
    }
  ]
);

