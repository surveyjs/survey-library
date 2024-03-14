import { _setIsTouch } from "survey-core";
import { registerMarkupTests } from "./helper";

registerMarkupTests(
  [
    {
      name: "Test Tagbox question markup",
      json: {
        questions: [
          {
            "type": "tagbox",
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
      removeIds: true,
      snapshot: "tagbox"
    },
    {
      name: "Test Tagbox question markup",
      json: {
        questions: [
          {
            "type": "tagbox",
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
      before: () => {
        _setIsTouch(true);
      },
      after: () => {
        _setIsTouch(false);
      },
      removeIds: true,
      snapshot: "tagbox-mobile"
    }, {
      name: "Test Tagbox question markup",
      json: {
        questions: [
          {
            "type": "tagbox",
            "name": "name",
            "title": "Question title",
            "choices": [
              "item1",
              "item2",
              "item3"
            ],
            defaultValue: "item1",
            titleLocation: "hidden"
          }
        ]
      },
      removeIds: true,
      snapshot: "tagbox-selected"
    }, {
      name: "Test Tagbox question markup Read only",
      json: {
        mode: "display",
        questions: [
          {
            "type": "tagbox",
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
      snapshot: "tagbox-readonly"
    }, {
      name: "Test Tagbox question markup Read only with value",
      json: {
        mode: "display",
        questions: [
          {
            "type": "tagbox",
            "name": "name",
            "title": "Question title",
            "defaultValue": ["item1", "item3"],
            "choices": [
              "item1",
              "item2",
              "item3"
            ],
            titleLocation: "hidden"
          }
        ]
      },
      snapshot: "tagbox-readonly-with-value"
    }, {
      name: "Test Tagbox question without clear button markup",
      json: {
        questions: [
          {
            "type": "tagbox",
            "name": "name",
            "title": "Question title",
            "allowClear": false,
            "choices": [
              "item1",
              "item2",
              "item3"
            ],
            titleLocation: "hidden"
          }
        ]
      },
      removeIds: true,
      snapshot: "tagbox-without-clear-button",
    },
    {
      name: "Test Tagbox question without textWrapEnabled",
      json: {
        questions: [
          {
            "type": "tagbox",
            "name": "name",
            "title": "Question title",
            "textWrapEnabled": false,
            "choices": [
              "item1",
              "item2",
              "item3"
            ],
            titleLocation: "hidden"
          }
        ]
      },
      removeIds: true,
      snapshot: "tagbox-without-textWrapEnabled"
    },
    {
      name: "Test Tagbox question searchEnabled false markup",
      json: {
        questions: [
          {
            "type": "tagbox",
            "name": "name",
            "title": "Question title",
            "searchEnabled": "false",
            "choices": [
              "item1",
              "item2",
              "item3"
            ],
            titleLocation: "hidden"
          }
        ]
      },
      removeIds: true,
      snapshot: "tagbox-without-search",
    },
  ]);