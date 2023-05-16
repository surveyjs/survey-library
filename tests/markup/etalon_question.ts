import { StylesManager } from "survey-core";
import { registerMarkupTest } from "./helper";
registerMarkupTest(
  {
    name: "Test question title with html markup",
    json: {
      questions: [
        {
          name: "name",
          type: "text",
          descriptionLocation: "hidden",
          title: "<span style='font-size:12px'><strong><span style='font-family:Comic Sans MS,cursive'><span style='color:#f1c40f'>HI</span></span></strong></span>",
        }
      ]
    },
    snapshot: "question-title-with-html",
    before: () => StylesManager.applyTheme("defaultV2"),
    after: () => StylesManager.applyTheme("default"),
    initSurvey: survey => survey.onTextMarkdown.add(function (survey, options) {
      let str = options.text;
      options.html = str;
    }),
  },
);
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
registerMarkupTest(
  {
    name: "Test question with indent",
    json: {
      questions: [
        {
          name: "name",
          type: "text",
          indent: 1
        }
      ],
    },
    snapshot: "question-with-indent",
    event: "onAfterRenderPage",
    initSurvey: (survey) => {
      survey.getAllQuestions()[0].rightIndent = 1;
    },
    before: () => StylesManager.applyTheme("defaultV2"),
    after: () => StylesManager.applyTheme("default"),
  },
);