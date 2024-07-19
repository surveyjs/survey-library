import { StylesManager } from "survey-core";
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
    before: () => StylesManager.applyTheme("defaultV2"),
    after: () => StylesManager.applyTheme("default"),
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
    before: () => StylesManager.applyTheme("defaultV2"),
    after: () => StylesManager.applyTheme("default"),
    event: "onAfterRenderPage",
    snapshot: "layout-page-swnl-v2",
  });

registerMarkupTest(
  {
    name: "Layout mode - start with new line with panel and titles",
    json: {
      gridLayoutEnabled: true,
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
    before: () => StylesManager.applyTheme("defaultV2"),
    after: () => StylesManager.applyTheme("default"),
    event: "onAfterRenderPage",
    snapshot: "layout-panel-page-swnl-title-v2",
  });

registerMarkupTest(
  {
    name: "Layout mode - start with new line Title",
    json: {
      gridLayoutEnabled: true,
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
    before: () => StylesManager.applyTheme("defaultV2"),
    after: () => StylesManager.applyTheme("default"),
    event: "onAfterRenderPage",
    snapshot: "layout-page-swnl-title-v2",
  });