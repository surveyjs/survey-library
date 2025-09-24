import { registerMarkupTests } from "./helper";

registerMarkupTests(
  [
    {
      name: "Test matrixdynamic question (default) markup",
      json: {
        "elements": [
          {
            "type": "matrixdynamic",
            "titleLocation": "hidden",
            "name": "question1",
            "columns": [
              {
                "name": "Column 1"
              },
              {
                "name": "Column 2"
              },
              {
                "name": "Column 3"
              }
            ],
            "choices": [
              1,
              2,
              3,
              4,
              5
            ]
          }
        ]
      },
      snapshot: "matrixdynamic-default"
    },
    {
      name: "Test matrixdynamic question (defaultV2) markup",
      json: {
        "elements": [
          {
            "type": "matrixdynamic",
            "titleLocation": "hidden",
            "name": "question1",
            "columns": [
              {
                "name": "Column 1"
              },
              {
                "name": "Column 2"
              },
              {
                "name": "Column 3"
              }
            ],
            "choices": [
              1,
              2,
              3,
              4,
              5
            ]
          }
        ]
      },

      snapshot: "matrixdynamic-defaultV2"
    },
    {
      name: "Test matrixdynamic question (defaultV2) markup with totals",
      json: {
        "elements": [
          {
            "type": "matrixdynamic",
            "titleLocation": "hidden",
            "name": "question1",
            "columns": [
              {
                "name": "Column 1",
                "totalType": "count",
                "totalFormat": "Count: {0}",
              }
            ]
          }
        ]
      },
      removeIds: true,
      snapshot: "matrixdynamic-totals"
    },
    {
      name: "Test matrixdynamic addRow icon",
      json: {
        "elements": [
          {
            "type": "matrixdynamic",
            "titleLocation": "hidden",
            "name": "matrix",
            "cellType": "text",
            "columns": [
              {
                "name": "Column 1"
              }
            ]
          }
        ]
      },
      snapshot: "matrixdynamic-add-row-icon",
      isCorrectEvent: (options) => {
        return options.question.name == "matrix";
      },
      initSurvey: (survey) => {
        survey.css.matrixdynamic.iconAddId = "#icon-test";
      }
    },
    {
      name: "Test matrixdynamic question with detail panel",
      json: {
        "elements": [
          {
            "type": "matrixdynamic",
            "name": "matrix",
            "titleLocation": "hidden",
            "columns": [
              {
                "name": "q1",
                "html": "test",
                "cellType": "html",
              },
            ],
            "detailElements": [
              {
                "type": "html",
                "html": "test",
                "name": "detail-question",
              },
            ],
            "detailPanelMode": "underRowSingle",
            "rowCount": 2,
          }
        ],
      },
      snapshot: "matrixdynamic-detail",
      isCorrectEvent: (options) => {
        return options.question.name == "matrix";
      },
      initSurvey: (survey) => {
        survey.getQuestionByName("matrix").visibleRows[0].showHideDetailPanelClick();
      },
      initSurveyAfterIdSetup: (survey) => {
        survey.getQuestionByName("matrix").visibleRows[0].showHideDetailPanelClick();
      }
    }
  ]
);

