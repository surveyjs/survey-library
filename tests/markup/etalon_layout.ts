import { registerMarkupTest } from "./helper";

registerMarkupTest(
  {
    name: "Layout mode - start with new line with panel",
    json: {
      gridLayoutEnabled: true,
      "elements": [
        {
          type: "html",
          name: "question0",
          html: "HTML1",
          title: "Question title",
          titleLocation: "hidden"
        },
        {
          type: "panel",
          name: "name",
          showQuestionNumbers: "off",
          startWithNewLine: false,
          elements: [
            {
              type: "html",
              name: "question1",
              html: "HTML2",
              title: "Question title",
              titleLocation: "hidden"
            }
          ]
        }
      ]
    },

    event: "onAfterRenderPage",
    snapshot: "layout-panel-page-swnl-v2",
  });

registerMarkupTest(
  {
    name: "Layout mode - start with new line",
    json: {
      gridLayoutEnabled: true,
      "elements": [
        {
          type: "html",
          name: "question0",
          html: "HTML1",
          title: "Question title",
          titleLocation: "hidden"
        },
        {
          type: "html",
          name: "question1",
          html: "HTML2",
          title: "Question title",
          titleLocation: "hidden",
          startWithNewLine: false
        }
      ]
    },

    event: "onAfterRenderPage",
    snapshot: "layout-page-swnl-v2",
  });

registerMarkupTest(
  {
    name: "Layout mode - start with new line with panel and titles",
    json: {
      gridLayoutEnabled: true,
      showQuestionNumbers: "on",
      "elements": [
        {
          type: "text",
          name: "question0",
          title: "Question title",
        },
        {
          type: "panel",
          name: "name",
          showQuestionNumbers: "off",
          startWithNewLine: false,
          elements: [
            {
              type: "text",
              name: "question1",
              title: "Question title",
            }
          ]
        }
      ]
    },

    event: "onAfterRenderPage",
    snapshot: "layout-panel-page-swnl-title-v2",
  });

registerMarkupTest(
  {
    name: "Layout mode - start with new line Title",
    json: {
      gridLayoutEnabled: true,
      showQuestionNumbers: "on",
      "elements": [
        {
          type: "text",
          name: "question0",
          title: "Question title"
        },
        {
          type: "text",
          name: "question1",
          title: "Question title",
          startWithNewLine: false
        }
      ]
    },

    event: "onAfterRenderPage",
    snapshot: "layout-page-swnl-title-v2",
  });