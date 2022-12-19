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
  ]
);

