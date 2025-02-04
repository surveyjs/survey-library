import { registerMarkupTests } from "./helper";
import { settings } from "survey-core";

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
      name: "Test mutlipletext readonly",
      json: {
        questions: [
          {
            type: "multipletext",
            name: "multipletext",
            title: "Multipletext",
            titleLocation: "hidden",
            readOnly: true,
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
      snapshot: "multipletext-readonly",
    },
    {
      name: "Test mutlipletext disabled",
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
      initSurvey: (survey) => survey.setDesignMode(true),
      snapshot: "multipletext-disabled",
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
      initSurvey(survey) {
        survey.tryComplete();
      },
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
      initSurvey(survey) {
        survey.tryComplete();
      },
      snapshot: "multipletext-error-bottom-v2",
    },
  ]
);

