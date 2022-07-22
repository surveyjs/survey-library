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
      snapshot: "tagbox"
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
      snapshot: "tagbox-without-clear-button",
    },
  ]);