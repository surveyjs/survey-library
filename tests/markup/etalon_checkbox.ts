import { settings } from "survey-core";
import { registerMarkupTests } from "./helper";

registerMarkupTests(
  [
    {
      name: "Test checkbox question markup",
      json: {
        elements: [
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
        elements: [
          {
            "type": "checkbox",
            "name": "name",
            "title": "Question title",
            "choices": [
              "item1",
              "item2",
              "item3"
            ],
            "showOtherItem": true,
            "defaultValue": "other",
            "otherText": "Other (describe)",
            titleLocation: "hidden"
          }
        ]
      },
      snapshot: "checkbox-other",
      removeIds: true
    },
    {
      name: "Test checkbox question markup Other option with maxCommentLength",
      json: {
        "maxOthersLength": 15,
        elements: [
          {
            "type": "checkbox",
            "name": "name",
            "showOtherItem": true,
            "defaultValue": "other",
            "otherText": "Other (describe)",
            titleLocation: "hidden"
          }
        ]
      },
      snapshot: "checkbox-other-maxlength",
      removeIds: true
    },
    {
      name: "Test checkbox question markup Other option (defaultV2)",
      json: {
        elements: [
          {
            "type": "checkbox",
            "name": "name",
            "choices": [
              "item1",
            ],
            "showOtherItem": true,
            "defaultValue": "other",
            "otherText": "Other (describe)",
            titleLocation: "hidden"
          }
        ]
      },
      snapshot: "checkbox-other-V2",
      removeIds: true
    },
    {
      name: "Test checkbox question markup with comment (defaultV2)",
      json: {
        elements: [
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

      },
      after() {

      },
      snapshot: "checkbox-comment-V2",
    },
    {
      name: "Test checkbox question markup Read only",
      json: {
        mode: "display",
        elements: [
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
      name: "Test radiogroup question markup Disabled",
      json: {
        elements: [
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
      initSurvey: (survey) => survey.setDesignMode(true),
      snapshot: "checkbox-disabled",
    },
    {
      name: "Test checkbox question Readonly selected",
      json: {
        mode: "display",
        elements: [
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
        elements: [
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

      snapshot: "checkbox-v2",
    },
    {
      name: "Test checkbox modern theme",
      json: {
        elements: [
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
      snapshot: "checkbox-modern",
    },
    {
      name: "Test checkbox columns",
      json: {
        elements: [
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
        elements: [
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
        elements: [
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
            showNoneItem: true,
            showOtherItem: true,
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
        elements: [
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
            showNoneItem: true,
            showOtherItem: true,
            separateSpecialChoices: false,
            titleLocation: "hidden"
          }
        ]
      },
      snapshot: "checkbox-columns-no-head-foot",
      before: () => { settings.itemFlowDirection = "row"; },
      after: () => { settings.itemFlowDirection = "column"; }
    },
    {
      name: "Test checkbox row layout with no header and footer",
      json: {
        elements: [
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
            showNoneItem: true,
            showOtherItem: true,
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
        elements: [
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
            showNoneItem: true,
            showOtherItem: true,
            separateSpecialChoices: true,
            titleLocation: "hidden"
          }
        ]
      },
      snapshot: "checkbox-row-head-foot",
    },
    {
      name: "Test checkbox vs mutliple comments",
      json: {
        elements: [
          {
            "type": "checkbox",
            "name": "name",
            "choices": [{ value: "item1", showCommentArea: true }, { value: "item2", showCommentArea: true }],
            showOtherItem: true,
            defaultValue: ["item1", "item2"],
            titleLocation: "hidden"
          }
        ]
      },
      snapshot: "checkbox-multiple-comments",
      removeIds: true
    },
  ]
);