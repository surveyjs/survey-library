import { registerMarkupTest } from "./helper";
registerMarkupTest(
  {
    name: "Test question title with html markup",
    json: {
      showQuestionNumbers: "on",
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
      showQuestionNumbers: "on",
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

    initSurvey: survey => survey.hasErrors(),
    event: "onAfterRenderPage"
  },
);
registerMarkupTest(
  {
    name: "Test question with errors below v2 markup",
    json: {
      showQuestionNumbers: "on",
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

  },
);
registerMarkupTest(
  {
    name: "Test question with indent",
    json: {
      showQuestionNumbers: "on",
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

  },
);