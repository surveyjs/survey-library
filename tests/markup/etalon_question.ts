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
    before: () => StylesManager.applyTheme("defaultV2"),
    after: () => StylesManager.applyTheme("default"),
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
    before: () => StylesManager.applyTheme("defaultV2"),
    after: () => StylesManager.applyTheme("default"),
    initSurvey: survey => survey.hasErrors(),
    event: "onAfterRenderPage"
  },
);
registerMarkupTest(
  {
    name: "Test question with description under input",
    json: {
      questions: [
        {
          name: "name",
          type: "text",
          description: "Under input",
          descriptionLocation: "underInput",
          titleLocation: "hidden"
        }
      ],
      questionErrorLocation: "bottom"
    },
    snapshot: "question-description-under-input",
    before: () => StylesManager.applyTheme("defaultV2"),
    after: () => StylesManager.applyTheme("default"),
  },
);