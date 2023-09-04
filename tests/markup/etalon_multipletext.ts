import { registerMarkupTests } from "./helper";
import { StylesManager } from "survey-core";

registerMarkupTests(
  [
    {
      name: "Test mutlipletext question markup",
      json: {
        questions: [
          {
            type: "multipletext",
            name: "multipletext",
            title: "Multipletext",
            titleLocation: "hidden",
            colCount: 2,
            items: [
              {
                name: "item1",
                title: "Text 1"
              },
              {
                name: "item2",
                title: "Text 2"
              },
              {
                name: "item3",
                title: "Text 3"
              },
              {
                name: "item4",
                title: "Text 4"
              },
            ],
          },
        ]
      },
      snapshot: "multipletext",
    },
    {
      name: "Test mutlipletext question markup error top",
      json: {
        questions: [
          {
            type: "multipletext",
            name: "multipletext",
            title: "Multipletext",
            titleLocation: "hidden",
            colCount: 2,
            items: [
              {
                name: "item1",
                isRequired: true,
                title: "Text 1"
              },
            ],
          },
        ]
      },
      before: () => StylesManager.applyTheme("defaultV2"),
      initSurvey(survey) {
        survey.completeLastPage();
      },
      after: () => StylesManager.applyTheme("default"),
      snapshot: "multipletext-error-top-v2",
    },
    {
      name: "Test mutlipletext question markup error bottom",
      json: {
        questions: [
          {
            type: "multipletext",
            name: "multipletext",
            title: "Multipletext",
            itemErrorLocation: "bottom",
            titleLocation: "hidden",
            colCount: 2,
            items: [
              {
                name: "item1",
                isRequired: true,
                title: "Text 1"
              },
            ],
          },
        ]
      },
      before: () => StylesManager.applyTheme("defaultV2"),
      initSurvey(survey) {
        survey.completeLastPage();
      },
      after: () => StylesManager.applyTheme("default"),
      snapshot: "multipletext-error-bottom-v2",
    },
  ]
);

