import { registerMarkupTest } from "./helper";

registerMarkupTest(
  // #region Text question
  {
    name: "Test Text question markup",
    json: {
      questions: [
        {
          name: "name",
          type: "text",
          title: "Question title",
          titleLocation: "hidden"
        }
      ]
    },
    snapshot: "text",
  });
registerMarkupTest(
  {
    name: "Test Text (text update mode) question markup",
    json: {
      questions: [
        {
          name: "name",
          type: "text",
          title: "Question title",
          titleLocation: "hidden"
        }
      ],
      textUpdateMode: "onTyping"
    },
    snapshot: "text-typing",
  });
registerMarkupTest({
  name: "Test Text readonly question markup",
  json: {
    questions: [
      {
        name: "name",
        type: "text",
        title: "Question title",
        titleLocation: "hidden"
      }
    ],
    mode: "display"
  },
  snapshot: "text-readonly",
});
registerMarkupTest({
  name: "Test Text readonly DIV question markup",
  json: {
    questions: [
      {
        name: "name",
        type: "text",
        defaultValue: "test",
        title: "Question title",
        titleLocation: "hidden"
      }
    ],
    mode: "display",
  },
  before: (opt: any) => opt.settings.readOnlyTextRenderMode = "div",
  after: (opt: any) => opt.settings.readOnlyTextRenderMode = "input",
  snapshot: "text-div",
});
registerMarkupTest({
  name: "Test Text Date question markup",
  json: {
    questions: [
      {
        name: "birthdate",
        type: "text",
        inputType: "date",
        title: "Question title",
        isRequired: true,
        autoComplete: "bdate",
        titleLocation: "hidden"
      }
    ],
  },
  snapshot: "text-date",
});
registerMarkupTest({
  name: "Test Text Email question markup",
  json: {
    questions: [
      {
        name: "email",
        type: "text",
        inputType: "email",
        title: "Your e-mail:",
        placeHolder: "jon.snow@nightwatch.org",
        isRequired: true,
        autoComplete: "email",
        validators: [
          {
            type: "email"
          }
        ],
        titleLocation: "hidden"
      }
    ],
  },
  snapshot: "text-email",
});
registerMarkupTest({
  name: "Test Text Data list markup",
  json: {

    questions: [
      {
        type: "text",
        name: "q1",
        dataList: ["abc", "def", "ghk"],
        titleLocation: "hidden"
      }
    ],
  },
  snapshot: "text-datalist",
});
