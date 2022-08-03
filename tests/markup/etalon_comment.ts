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
    before: () => settings.readOnlyCommentRenderMode = "div",
    after: () => settings.readOnlyCommentRenderMode = "textarea",
    snapshot: "comment-div",
  },
  ]
);