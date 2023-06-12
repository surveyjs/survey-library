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
      name: "Ranking selectToRank empty",
      json: {
        questions: [
          {
            "type": "ranking",
            "name": "name",
            "selectToRank": true,
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
      snapshot: "ranking-selecttorank-empty",
    },
    {
      name: "Ranking selectToRank selectToRankAlign Vertical",
      json: {
        questions: [
          {
            "type": "ranking",
            "name": "name",
            "selectToRank": true,
            "selectToRankAlign": "vertical",
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
      snapshot: "ranking-selecttorank-vertical",
    },
  ]
);