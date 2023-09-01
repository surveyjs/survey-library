import { registerMarkupTests } from "./helper";
import { StylesManager } from "survey-core";

registerMarkupTests(
  [
    {
      name: "Test matrixdropdown",
      json: {
        elements: [
          {
            titleLocation: "hidden",
            cellType: "text",
            "type": "matrixdropdown",
            "name": "m",
            "columns": ["Col 1", "Col 2"],
            "rows": [
              "Row 1",
              "Row 2"
            ]
          }
        ]
      }
      ,

      before: () => StylesManager.applyTheme("defaultV2"),
      after: () => StylesManager.applyTheme("default"),
      snapshot: "matrixdropdown"
    },
    {
      name: "Test matrixdropdown vertical",
      json: {
        elements: [
          {
            titleLocation: "hidden",
            type: "matrixdropdown",
            name: "m",
            cellType: "text",
            columnLayout: "vertical",
            "columns": ["Col 1", "Col 2"],
            "rows": [
              "Row 1",
              "Row 2"
            ]
          }
        ]
      },

      before: () => StylesManager.applyTheme("defaultV2"),
      after: () => StylesManager.applyTheme("default"),
      snapshot: "matrixdropdown-vertical"
    },
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
      name: "Test matrixdropdown with showInMultipleColumns - mobile",
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
      initSurvey(survey) {
        survey.setIsMobile(true);
      },
      after: () => StylesManager.applyTheme("default"),
      snapshot: "matrixdynamic-show-in-multiple-columns-mobile"
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
    },
  ]
);

