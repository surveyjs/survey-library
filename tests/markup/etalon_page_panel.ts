import { registerMarkupTest } from "./helper";

registerMarkupTest(
  {
    name: "Test Panel empty",
    json: {
      "elements": [
        {
          type: "panel",
          name: "name",
          showQuestionNumbers: "off",
          elements: [
            {
              type: "html",
              name: "question1",
              html: "HTML content here",
              title: "Question title",
              titleLocation: "hidden"
            },
            {
              "type": "image",
              "name": "banner",
              "imageLink": "https://surveyjs.io/Content/Images/examples/image-picker/lion.jpg",
              "imageWidth": "500px",
              "imageHeight": "300px"
            }
          ]
        }
      ]
    },
    event: "onAfterRenderPanel",
    snapshot: "panel",
  });

registerMarkupTest(
  {
    name: "Test Panel text",
    json: {
      elements: [
        {
          type: "panel",
          name: "name",
          titleLocation: "hidden",
          showQuestionNumbers: "off",
          elements: [
            {
              "type": "text",
              "skip_name": "question1",
              titleLocation: "hidden",
            }
          ]
        }
      ]
    },
    event: "onAfterRenderPanel",
    snapshot: "panel-text",
  });

registerMarkupTest(
  {
    name: "Test Panel - panel start with new line",
    json: {
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

    event: "onAfterRenderPanel",
    snapshot: "panel-swnl-v2",
  });

registerMarkupTest(
  {
    name: "Test Page - start with new line with panel",
    json: {
      gridLayoutEnabled: false,
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
    snapshot: "panel-page-swnl-v2",
  });

registerMarkupTest(
  {
    name: "Test Page - start with new line",
    json: {
      gridLayoutEnabled: false,
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
    snapshot: "page-swnl-v2",
  });

registerMarkupTest(
  {
    name: "Test Page - start with new line with panel and titles",
    json: {
      gridLayoutEnabled: false,
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
    snapshot: "panel-page-swnl-title-v2",
  });
registerMarkupTest(
  {
    name: "Test Page - Text and Title",
    json: {
      showQuestionNumbers: "on",
      "elements": [
        {
          type: "text",
          name: "question0",
          title: "Question title"
        }
      ]
    },

    event: "onAfterRenderPage",
    snapshot: "page-title-v2",
  });

registerMarkupTest(
  {
    name: "Test Page - start with new line Title",
    json: {
      gridLayoutEnabled: false,
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
    snapshot: "page-swnl-title-v2",
  });

registerMarkupTest({
  name: "Test Page - questionTitleWidth",
  json: {
    showQuestionNumbers: "on",
    "pages": [
      {
        "name": "page1",
        "questionTitleLocation": "left",
        "questionTitleWidth": "500px",
        "elements": [
          {
            "type": "text",
            "name": "name",
            "title": "Employee name:",
          }
        ]
      }]
  },

  event: "onAfterRenderPage",
  snapshot: "page-questionTitleWidth",
});

registerMarkupTest(
  {
    name: "Test Panel - Panel/Questions titles and descriptions",
    json: {
      "elements": [
        {
          type: "panel",
          name: "name",
          title: "panel_title",
          description: "panel_description",
          showQuestionNumbers: "off",
          startWithNewLine: false,
          elements: [
            {
              type: "text",
              name: "question1",
              title: "Question title",
              description: "Question description"
            }
          ]
        }
      ]
    },

    event: "onAfterRenderPage",
    snapshot: "panel-question-headers",
  }
);
registerMarkupTest(
  {
    name: "Test Panel - Required panel's title",
    json: {
      "elements": [
        {
          type: "panel",
          name: "name",
          isRequired: true,
          title: "panel_title",
          showQuestionNumbers: "off",
          startWithNewLine: false,
          elements: [
            {
              type: "text",
              name: "question1",
              titleLocation: "hidden",
            }
          ]
        }
      ]
    },

    event: "onAfterRenderPage",
    snapshot: "panel-required-header",
  }
);
registerMarkupTest(
  {
    name: "Test Panel - Panel title with number",
    json: {
      showQuestionNumbers: "on",
      "elements": [
        {
          type: "panel",
          name: "name",
          title: "panel_title",
          showNumber: true,
          startWithNewLine: false,
          elements: [
            {
              type: "html",
              name: "question1",
              description: "<div></div>"
            }
          ]
        }
      ]
    },

    event: "onAfterRenderPanel",
    snapshot: "panel-number",
  });