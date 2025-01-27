import { registerMarkupTests } from "./helper";
import { settings } from "survey-core";

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

      snapshot: "matrixdropdown"
    },
    {
      name: "Test matrixdropdown readonly",
      json: {
        elements: [
          {
            titleLocation: "hidden",
            readOnly: true,
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
      },

      snapshot: "matrixdropdown-readonly"
    },
    {
      name: "Test matrixdropdown disabled",
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
      initSurvey: (survey) => survey.setDesignMode(true),
      snapshot: "matrixdropdown-disabled"
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
      initSurvey(survey) {
        survey.setIsMobile(true);
      },
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
      initSurvey(survey) {
        survey.tryComplete();
      },
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
      initSurvey(survey) {
        survey.tryComplete();
      },
      snapshot: "matrixdropdown-cell-errors-bottom"
    },
    {
      name: "Test matrixdropdown with hidden question - mobile",
      json: {
        "elements": [
          {
            "type": "matrixdropdown",
            "name": "matrix",
            titleLocation: "hidden",
            "columns": [
              {
                "name": "col1",
                cellType: "text"
              },
              {
                "name": "col1",
                cellType: "text",
                "visibleIf": "{row.col1} = '1'"
              },
            ],
            "rows": [
              "row1",
              "row2"
            ]
          }
        ]
      },
      initSurvey(survey) {
        survey.data = { matrix: { row1: { col1: 1 } } };
        survey.setIsMobile(true);
      },
      snapshot: "matrixdropdown-hidden-question-mobile"
    },
  ],
);

