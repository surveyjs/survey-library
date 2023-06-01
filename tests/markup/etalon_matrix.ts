import { registerMarkupTests } from "./helper";
import { StylesManager } from "survey-core";

registerMarkupTests(
  [
    {
      name: "Test matrix question (modern) markup",
      json: {
        "elements": [
          {
            "type": "matrix",
            "name": "matrix",
            "titleLocation": "hidden",
            "columns": [
              {
                "value": "col_1",
              }, {
                "value": "col_2",
              },
            ],
            "rows": [
              {
                "value": "row_1",
              }, {
                "value": "row_2",
              },
            ]
          }
        ]
      },
      before: () => StylesManager.applyTheme("modern"),
      after: () => StylesManager.applyTheme("default"),
      snapshot: "matrix-modern",
      excludePlatform: "Vue"
    },
    {
      name: "Test matrix question markup",
      json: {
        "elements": [
          {
            "type": "matrix",
            "name": "matrix",
            "titleLocation": "hidden",
            "columns": [
              {
                "value": "col_1",
              }, {
                "value": "col_2",
              },
            ],
            "rows": [
              {
                "value": "row_1",
              }, {
                "value": "row_2",
              },
            ]
          }
        ]
      },
      before: () => StylesManager.applyTheme("defaultV2"),
      after: () => StylesManager.applyTheme("default"),
      snapshot: "matrix-v2",
      excludePlatform: "Vue"
    },
    {
      name: "Test matrix question in mobile mode markup",
      json: {
        "elements": [
          {
            "type": "matrix",
            "name": "matrix",
            "titleLocation": "hidden",
            "columns": [
              {
                "value": "col_1",
              }, {
                "value": "col_2",
              },
            ],
            "rows": [
              {
                "value": "row_1",
              }, {
                "value": "row_2",
              },
            ]
          }
        ]
      },
      before: () => StylesManager.applyTheme("defaultV2"),
      after: () => StylesManager.applyTheme("default"),
      initSurvey: survey => survey.setIsMobile(true),
      snapshot: "matrix-mobile-v2",
      excludePlatform: "Vue"
    },
    {
      name: "Test matrix question row title and column width",
      json: {
        "elements": [
          {
            "type": "matrix",
            "name": "matrix",
            "titleLocation": "hidden",
            "rowTitleWidth": "100px",
            "columnMinWidth": "20px",
            "columns": [
              {
                "value": "col_1",
              }, {
                "value": "col_2",
              },
            ],
            "rows": [
              {
                "value": "row_1",
              }, {
                "value": "row_2",
              },
            ]
          }
        ]
      },
      snapshot: "matrix-widths",
      excludePlatform: "Vue"
    },
    {
      name: "Test matrix empty rows markup",
      json: {
        "elements": [
          {
            "type": "matrix",
            "name": "matrix",
            "titleLocation": "hidden",
            "columns": [
              {
                "value": "col_1",
              }, {
                "value": "col_2",
              },
            ],
          }
        ]
      },
      snapshot: "matrix-empty",
    },
    {
      name: "Matrix with cellType text (aria-label a11y check)",
      json: {
        "elements": [{
          "type": "matrixdropdown",
          "name": "B-Q13",
          "titleLocation": "hidden",
          "columns": [
            {
              "name": "Number of people",
              "cellType": "text",
              "inputType": "number",
              "min": 0,
              "defaultValue": 0
            }
          ],
          "rows": [
            { "value": "Age 0-4", "text": "Age 0-4" },
            { "value": "Age 5-11", "text": "Age 5-11" },
            { "value": "Age 12-15", "text": "Age 12-15" },
            { "value": "Age 16+", "text": "Age 16+" }
          ]
        }]
      },
      snapshot: "martix-celltype-text-a11y"
    },
  ]
);

