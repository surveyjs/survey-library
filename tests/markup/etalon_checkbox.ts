import { StylesManager } from "survey-core";
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
      name: "Test checkbox question markup Other option with maxOthersLength",
      json: {
        "maxOthersLength": 15,
        questions: [
          {
            "type": "checkbox",
            "name": "name",
            "hasOther": true,
            "defaultValue": "other",
            "otherText": "Other (describe)",
            titleLocation: "hidden"
          }
        ]
      },
      snapshot: "checkbox-other-maxlength",
    },
    {
      name: "Test checkbox question markup Other option (defaultV2)",
      json: {
        questions: [
          {
            "type": "checkbox",
            "name": "name",
            "choices": [
              "item1",
            ],
            "hasOther": true,
            "defaultValue": "other",
            "otherText": "Other (describe)",
            titleLocation: "hidden"
          }
        ]
      },
      before() {
        StylesManager.applyTheme("defaultV2");
      },
      after() {
        StylesManager.applyTheme("default");
      },
      snapshot: "checkbox-other-V2",
    },
    {
      name: "Test checkbox question markup with comment (defaultV2)",
      json: {
        questions: [
          {
            "type": "checkbox",
            "name": "name",
            "choices": [
              "item1",
            ],
            "hasComment": true,
            "commentText": "Other (describe)",
            titleLocation: "hidden"
          }
        ]
      },
      before() {
        StylesManager.applyTheme("defaultV2");
      },
      after() {
        StylesManager.applyTheme("default");
      },
      snapshot: "checkbox-comment-V2",
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
    {
      name: "Test checkbox columns in mobile mode",
      json: {
        questions: [
          {
            "type": "checkbox",
            "name": "name",
            "title": "Question title",
            "showClearButton": true,
            "colCount": 2,
            "isMobile": true,
            "choices": [
              "item1",
              "item2",
              "item3"
            ],
            titleLocation: "hidden"
          }
        ]
      },
      snapshot: "checkbox-columns-mobile",
      initSurvey: survey => survey.setIsMobile(true),
    },
    {
      name: "Test checkbox columns with header and footer",
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
            hasSelectAll: true,
            hasNone: true,
            hasOther: true,
            titleLocation: "hidden",
            separateSpecialChoices: true
          }
        ]
      },
      snapshot: "checkbox-columns-head-foot",
    },
    {
      name: "Test checkbox columns with no header and footer",
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
            hasSelectAll: true,
            hasNone: true,
            hasOther: true,
            separateSpecialChoices: false,
            titleLocation: "hidden"
          }
        ]
      },
      snapshot: "checkbox-columns-no-head-foot",
    },
    {
      name: "Test checkbox row layout with no header and footer",
      json: {
        questions: [
          {
            "type": "checkbox",
            "name": "name",
            "title": "Question title",
            "showClearButton": true,
            "colCount": 0,
            "choices": [
              "item1",
              "item2"
            ],
            hasSelectAll: true,
            hasNone: true,
            hasOther: true,
            separateSpecialChoices: false,
            titleLocation: "hidden"
          }
        ]
      },
      snapshot: "checkbox-row-no-head-foot",
    },
    {
      name: "Test checkbox row layout with header and footer",
      json: {
        questions: [
          {
            "type": "checkbox",
            "name": "name",
            "title": "Question title",
            "showClearButton": true,
            "colCount": 0,
            "choices": [
              "item1",
              "item2"
            ],
            hasSelectAll: true,
            hasNone: true,
            hasOther: true,
            separateSpecialChoices: true,
            titleLocation: "hidden"
          }
        ]
      },
      snapshot: "checkbox-row-head-foot",
    },
  ]
);