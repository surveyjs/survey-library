import { registerMarkupTests } from "./helper";

registerMarkupTests(
  [
    {
      name: "Test ranking markup",
      json: {
        questions: [
          {
            "type": "ranking",
            "name": "name",
            "title": "Question title",
            "choices": [
              "item1",
              "item2",
              "item3"
            ],
            titleLocation: "hidden"
          }
        ]
      },
      snapshot: "ranking",
    },
    {
      name: "Test ranking with values markup",
      json: {
        questions: [
          {
            "type": "ranking",
            "name": "name",
            "title": "Question title",
            "choices": [
              "item1",
              "item2",
              "item3"
            ],
            "defaultValue": [
              "item1",
              "item2",
              "item3"
            ],
            titleLocation: "hidden"
          }
        ]
      },
      snapshot: "ranking-values",
    },
    {
      name: "Test ranking markup design mode",
      json: {
        questions: [
          {
            "type": "ranking",
            "name": "name",
            "title": "Question title",
            "choices": [
              "item1",
              "item2",
              "item3"
            ],
            titleLocation: "hidden"
          }
        ]
      },
      initSurvey: survey => survey.setDesignMode(true),
      snapshot: "ranking-design",
    },
    {
      name: "Ranking selectToRankEnabled empty",
      json: {
        questions: [
          {
            "type": "ranking",
            "name": "name",
            "selectToRankEnabled": true,
            "title": "Question title",
            "choices": [
              "item1",
              "item2",
              "item3"
            ],
            titleLocation: "hidden"
          }
        ]
      },
      snapshot: "ranking-selectToRankEnabled-empty",
    },
    {
      name: "Ranking selectToRankEnabled selectToRankAreasLayout Vertical",
      json: {
        questions: [
          {
            "type": "ranking",
            "name": "name",
            "selectToRankEnabled": true,
            "selectToRankAreasLayout": "vertical",
            "title": "Question title",
            "choices": [
              "item1",
              "item2",
              "item3"
            ],
            titleLocation: "hidden"
          }
        ]
      },
      snapshot: "ranking-selectToRankEnabled-vertical",
    },
  ]
);