import { registerMarkupTests } from "./helper";

registerMarkupTests(
  [
    {
      name: "Test ranking markup",
      json: {
        elements: [
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
        elements: [
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
        elements: [
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
        elements: [
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
        elements: [
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
    {
      name: "Ranking selectToRankEnabled selectToRankSwapAreas",
      json: {
        elements: [
          {
            "type": "ranking",
            "name": "name",
            "selectToRankEnabled": true,
            "selectToRankSwapAreas": true,
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
      snapshot: "ranking-selectToRankEnabled-SwapAreas",
    },
  ]
);