import { registerMarkupTests } from "./helper";

registerMarkupTests(
  [
    {
      name: "Test Dropdown question markup",
      json: {
        questions: [
          {
            "type": "dropdown",
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
      snapshot: "dropdown"
    },
    {
      name: "Test Dropdown question markup Show options caption false",
      json: {
        questions: [
          {
            "type": "dropdown",
            "name": "name",
            "title": "Question title",
            "showOptionsCaption": false,
            "choices": [
              "item1",
              "item2",
              "item3"
            ],
            titleLocation: "hidden"
          }
        ]
      },
      snapshot: "dropdown-show"
    },
    {
      name: "Test Dropdown question markup Other option",
      json: {
        questions: [
          {
            "type": "dropdown",
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
      snapshot: "dropdown-other"
    },
    {
      name: "Test Dropdown question markup Read only",
      json: {
        mode: "display",
        questions: [
          {
            "type": "dropdown",
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
      snapshot: "dropdown-readonly"
    },
    {
      name: "Test Dropdown question Readonly selected",
      json: {
        mode: "display",
        questions: [
          {
            "type": "dropdown",
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
      snapshot: "dropdown-readonly-selected"
    },
    {
      name: "Test Dropdown Select question markup",
      json: {
        questions: [
          {
            "type": "dropdown",
            "name": "name",
            "title": "Question title",
            "choices": [
              "item1",
              "item2",
              "item3"
            ],
            titleLocation: "hidden",
            renderAs: "select"
          }
        ]
      },
      snapshot: "dropdown-select",
    },
    {
      name: "Test Dropdown Select question with clear button markup",
      json: {
        questions: [
          {
            "type": "dropdown",
            "name": "name",
            "title": "Question title",
            "choices": [
              "item1",
              "item2",
              "item3"
            ],
            titleLocation: "hidden",
            defaultValue: "item1",
            showClearButton: true,
            renderAs: "select"
          }
        ]
      },
      snapshot: "dropdown-select-clear-button",
    },
  ]
);