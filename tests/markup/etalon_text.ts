import { settings } from "survey-core";
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
  before: () => settings.readOnlyTextRenderMode = "div",
  after: () => settings.readOnlyTextRenderMode = "input",
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
        autocomplete: "bdate",
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
        placeholder: "jon.snow@nightwatch.org",
        isRequired: true,
        autocomplete: "email",
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
registerMarkupTest({
  name: "Test Text numeric mask type markup",
  json: {

    questions: [
      {
        type: "text",
        name: "q1",
        maskType: "numeric",
        titleLocation: "hidden"
      }
    ],
  },
  snapshot: "text-masktype-numeric",
});
