import { registerMarkupTests } from "./helper";

registerMarkupTests([
  {
    name: "Test checkbox shortcut key badges",
    json: {
      showChoiceShortcutKeys: true,
      elements: [
        {
          type: "checkbox",
          name: "name",
          title: "Question title",
          choices: [
            "item1",
            { value: "item2", enableIf: "false" },
            "item3"
          ],
          titleLocation: "hidden"
        }
      ]
    },
    snapshot: "checkbox-shortcut-keys",
    removeIds: true
  },
  {
    name: "Test radiogroup shortcut key badges",
    json: {
      showChoiceShortcutKeys: true,
      elements: [
        {
          type: "radiogroup",
          name: "name",
          title: "Question title",
          choices: ["item1", "item2", "item3"],
          titleLocation: "hidden"
        }
      ]
    },
    snapshot: "radiogroup-shortcut-keys",
    removeIds: true
  },
  {
    name: "Test imagepicker shortcut key badges",
    json: {
      showChoiceShortcutKeys: true,
      elements: [
        {
          type: "imagepicker",
          name: "question1",
          choices: [
            { value: "item1", imageLink: "#item1.jpg" },
            { value: "item2", imageLink: "#item2.jpg" }
          ],
          titleLocation: "hidden"
        }
      ]
    },
    initSurvey: (survey) => {
      const question = survey.getAllQuestions()[0];
      question.choices[0].onErrorHandler = function () { this.contentNotLoaded = false; };
      question.choices[1].onErrorHandler = function () { this.contentNotLoaded = false; };
    },
    snapshot: "imagepicker-shortcut-keys",
    removeIds: true
  }
]);
