import { settings } from "../../src/settings";
import { StylesManager } from "../../src/stylesmanager";
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
    name: "Test Panel - start with new line",
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
    before: (opt: any) => opt.StylesManager.applyTheme("defaultV2"),
    after: (opt: any) => opt.StylesManager.applyTheme("default"),
    event: "onAfterRenderPanel",
    snapshot: "panel-swnl-v2",
  });

registerMarkupTest(
  {
    name: "Test Page - start with new line with panel",
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
    before: (opt: any) => opt.StylesManager.applyTheme("defaultV2"),
    after: (opt: any) => opt.StylesManager.applyTheme("default"),
    event: "onAfterRenderPage",
    snapshot: "panel-page-swnl-v2",
  });

registerMarkupTest(
  {
    name: "Test Page - start with new line",
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
          type: "html",
          name: "question1",
          html: "HTML2",
          title: "Question title",
          titleLocation: "hidden",
          startWithNewLine: false
        }
      ]
    },
    before: (opt: any) => opt.StylesManager.applyTheme("defaultV2"),
    after: (opt: any) => opt.StylesManager.applyTheme("default"),
    event: "onAfterRenderPage",
    snapshot: "page-swnl-v2",
  });

/*
// tests below are commented because Vue title-content requires wrapping div
registerMarkupTest(
  {
    name: "Test Page - start with new line with panel and titles",
    json: {
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
    before: (opt: any) => opt.StylesManager.applyTheme("defaultV2"),
    after: (opt: any) => opt.StylesManager.applyTheme("default"),
    event: "onAfterRenderPage",
    snapshot: "panel-page-swnl-title-v2",
  });

registerMarkupTest(
  {
    name: "Test Page - Text and Title",
    json: {
      "elements": [
        {
          type: "text",
          name: "question0",
          title: "Question title"
        }
      ]
    },
    before: (opt: any) => opt.StylesManager.applyTheme("defaultV2"),
    after: (opt: any) => opt.StylesManager.applyTheme("default"),
    event: "onAfterRenderPage",
    snapshot: "page-title-v2",
  });

registerMarkupTest(
  {
    name: "Test Page - start with new line Title",
    json: {
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
    before: (opt: any) => opt.StylesManager.applyTheme("defaultV2"),
    after: (opt: any) => opt.StylesManager.applyTheme("default"),
    event: "onAfterRenderPage",
    snapshot: "page-swnl-title-v2",
  });
*/
