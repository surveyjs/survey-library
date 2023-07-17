import { registerMarkupTests } from "./helper";
import { settings } from "survey-core";

registerMarkupTests(
  [{
    name: "Test Comment question markup",
    json: {
      questions: [
        {
          name: "name",
          type: "comment",
          title: "Question title",
          placeholder: "placeholder text",
          titleLocation: "hidden"
        }
      ]
    },
    snapshot: "comment",
  },
  {
    name: "Test Comment question Read-only markup",
    json: {
      mode: "display",
      questions: [
        {
          name: "name",
          type: "comment",
          title: "Question title",
          placeholder: "placeholder text",
          titleLocation: "hidden"
        }
      ]
    },
    snapshot: "comment-readonly",
  },
  {
    name: "Test Comment question Read-only DIV markup",
    json: {
      mode: "display",
      questions: [
        {
          name: "name",
          type: "comment",
          title: "Question title",
          placeholder: "placeholder text",
          defaultValue: "val",
          titleLocation: "hidden"
        }
      ]
    },
    before: () => settings.readOnly.commentRenderMode = "div",
    after: () => settings.readOnly.commentRenderMode = "textarea",
    snapshot: "comment-div",
  },
  {
    name: "Test Comment question allowResize is false",
    json: {
      questions: [
        {
          name: "name",
          type: "comment",
          title: "Question title",
          placeholder: "placeholder text",
          allowResize: false,
          titleLocation: "hidden"
        }
      ]
    },
    snapshot: "comment-allowResize",
  },
  {
    name: "Test Survey allowResizeComment is false",
    json: {
      allowResizeComment: false,
      pages: [
        {
          name: "page1",
          elements: [{
            type: "radiogroup",
            name: "name",
            defaultValue: "other",
            showOtherItem: true,
            titleLocation: "hidden",
            choices: [
              "Item 1",
              "Item 2",
              "Item 3"
            ],
          }],
        },
      ],
    },
    snapshot: "comment-into-question-allowResize",
  },
  ]
);