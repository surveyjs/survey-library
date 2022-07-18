import { StylesManager } from "survey-core";
import { registerMarkupTest } from "./helper";

registerMarkupTest(
  {
    name: "Test question with errors above v2",
    json: {
      questions: [
        {
          isRequired: true,
          name: "name",
          type: "text",
          title: "Question title",
        }
      ]
    },
    snapshot: "question-errors-v2-top",
    before: (opt) => StylesManager.applyTheme("defaultV2"),
    after: (opt) => StylesManager.applyTheme("default"),
    initSurvey: survey => survey.hasErrors(),
    event: "onAfterRenderPage"
  },
);
registerMarkupTest(
  {
    name: "Test question with errors below v2 markup",
    json: {
      questions: [
        {
          isRequired: true,
          name: "name",
          type: "text",
          title: "Question title",
        }
      ],
      questionErrorLocation: "bottom"
    },
    snapshot: "question-errors-v2-bottom",
    before: (opt) => StylesManager.applyTheme("defaultV2"),
    after: (opt) => StylesManager.applyTheme("default"),
    initSurvey: survey => survey.hasErrors(),
    event: "onAfterRenderPage"
  },
);