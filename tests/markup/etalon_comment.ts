import { registerMarkupTests } from "./helper";

registerMarkupTests(
  [{
    name: "Test Comment question markup",
    json: {
      questions: [
        {
          name: "name",
          type: "comment",
          title: "Question title",
          placeHolder: "placeholder text",
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
          placeHolder: "placeholder text",
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
          placeHolder: "placeholder text",
          defaultValue: "val",
          titleLocation: "hidden"
        }
      ]
    },
    before: (settings: any) => settings.readOnlyCommentRenderMode = "div",
    after: (settings: any) => settings.readOnlyCommentRenderMode = "textarea",
    snapshot: "comment-div",
  },
  ]
);