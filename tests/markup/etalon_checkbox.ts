import { StylesManager } from "../../src/stylesmanager";
import { registerMarkupTests } from "./helper";

registerMarkupTests(
  [
    {
      name: "Test checkbox question markup",
      json: {
        questions: [
          {
            "type": "checkbox",
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
      snapshot: "checkbox",
    },
    {
      name: "Test checkbox question markup Other option",
      json: {
        questions: [
          {
            "type": "checkbox",
            "name": "name",
            "title": "Question title",
            "choices": [
              "item1",
              "item2",
              "item3"
            ],
            "hasOther": true,
            "defaultValue": "other",
            "otherText": "Other (describe)",
            titleLocation: "hidden"
          }
        ]
      },
      snapshot: "checkbox-other",
    },
    {
      name: "Test checkbox question markup Read only",
      json: {
        mode: "display",
        questions: [
          {
            "type": "checkbox",
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
      snapshot: "checkbox-readonly",
    },
    {
      name: "Test checkbox question Readonly selected",
      json: {
        mode: "display",
        questions: [
          {
            "type": "checkbox",
            "name": "name",
            "title": "Question title",
            "choices": [
              "item1",
              "item2",
              "item3"
            ],
            "defaultValue": "item1",
            titleLocation: "hidden"
          }
        ]
      },
      snapshot: "checkbox-readonly-selected",
    },
    {
      name: "Test checkbox V2 theme",
      json: {
        questions: [
          {
            "type": "checkbox",
            "name": "name",
            "title": "Question title",
            "choices": [
              "item1",
              "item2"
            ],
            titleLocation: "hidden"
          }
        ]
      },
      before: () => StylesManager.applyTheme("defaultV2"),
      after: () => StylesManager.applyTheme("default"),
      snapshot: "checkbox-v2",
    },
    {
      name: "Test checkbox modern theme",
      json: {
        questions: [
          {
            "type": "checkbox",
            "name": "name",
            "title": "Question title",
            "choices": [
              "item1",
              "item2"
            ],
            titleLocation: "hidden"
          }
        ]
      },
      before: () => StylesManager.applyTheme("modern"),
      after: () => StylesManager.applyTheme("default"),
      snapshot: "checkbox-modern",
    },
    {
      name: "Test checkbox columns",
      json: {
        questions: [
          {
            "type": "checkbox",
            "name": "name",
            "title": "Question title",
            "showClearButton": true,
            "colCount": 2,
            "choices": [
              "item1",
              "item2"
            ],
            titleLocation: "hidden"
          }
        ]
      },
      snapshot: "checkbox-columns",
    },
  ]
);