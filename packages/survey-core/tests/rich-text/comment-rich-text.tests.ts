import { afterEach, describe, expect, test } from "vitest";
import { Question } from "../../src/question";
import { QuestionCommentModel } from "../../src/question_comment";
import { QuestionMatrixDropdownModel } from "../../src/question_matrixdropdown";
import { RendererFactory } from "../../src/rendererFactory";
import { Serializer } from "../../src/jsonobject";
import { settings } from "../../src/settings";
import { SurveyModel } from "../../src/survey";
import { QuestionRichTextModel } from "../../src/plugins/rich-text/question";
import "../../src/plugins/rich-text/index";

const RICH_RENDERER = "sv-rich-text";
const VIEW_RENDERER = "sv-comment-view";

afterEach(() => {
  RendererFactory.Instance.registerRenderer("richtext", "default", RICH_RENDERER, true);
});

describe("the richtext question", () => {
  test("static toolbar mode is the default and is not serialized", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "comment", name: "plain" },
        { type: "richtext", name: "rich" },
        { type: "richtext", name: "hidden", richTextToolbarMode: "none" },
        { type: "richtext", name: "focus", richTextToolbarMode: "onFocus" },
        { type: "richtext", name: "selection", richTextToolbarMode: "onSelection" },
        { type: "richtext", name: "fixed", richTextToolbarMode: "static" }
      ]
    });
    const rich = <QuestionRichTextModel>survey.getQuestionByName("rich");
    expect(rich).toBeInstanceOf(QuestionRichTextModel);
    expect(rich.getType()).toBe("richtext");
    expect(rich.richTextToolbarMode).toBe("static");
    expect(rich.resizeStyle).toBe("vertical");
    expect((<QuestionCommentModel>survey.getQuestionByName("plain")).getType()).toBe("comment");

    const elements = survey.toJSON().pages[0].elements;
    const jsonOf = (name: string) => elements.filter((el: any) => el.name === name)[0];
    expect(jsonOf("plain").type).toBe("comment");
    expect(jsonOf("plain").allowRichText).toBeUndefined();
    expect(jsonOf("rich").type).toBe("richtext");
    expect(jsonOf("rich").richTextToolbarMode).toBeUndefined();
    expect(jsonOf("rich").allowRichText).toBeUndefined();
    expect(jsonOf("hidden").richTextToolbarMode).toBe("none");
    expect(jsonOf("focus").richTextToolbarMode).toBe("onFocus");
    expect(jsonOf("selection").richTextToolbarMode).toBe("onSelection");
    expect(jsonOf("fixed").richTextToolbarMode).toBeUndefined();
    expect(JSON.stringify(survey.toJSON())).not.toContain("allowRichText");
    expect(JSON.stringify(survey.toJSON())).not.toContain("textFormat");

    const restored = new SurveyModel(survey.toJSON());
    expect((<QuestionRichTextModel>restored.getQuestionByName("rich")).richTextToolbarMode).toBe("static");
    expect((<QuestionRichTextModel>restored.getQuestionByName("hidden")).richTextToolbarMode).toBe("none");
    expect((<QuestionRichTextModel>restored.getQuestionByName("focus")).richTextToolbarMode).toBe("onFocus");
    expect((<QuestionRichTextModel>restored.getQuestionByName("selection")).richTextToolbarMode).toBe("onSelection");

    const prop = Serializer.findProperty("richtext", "richTextToolbarMode");
    expect(prop.choices.map((choice: any) => choice.value !== undefined ? choice.value : choice)).toEqual(["none", "onFocus", "onSelection", "static"]);
    expect(Serializer.findProperty("comment", "allowRichText")).toBeFalsy();
    expect(Serializer.findProperty("comment", "richTextToolbarMode")).toBeFalsy();
  });

  test("class names come from the question and the grip resizes vertically", () => {
    const survey = new SurveyModel({ elements: [{ type: "richtext", name: "c" }] });
    const question = <QuestionRichTextModel>survey.getQuestionByName("c");
    expect(question.cssClasses.root).toContain("sd-comment");
    expect(question.cssClasses.control).toContain("sd-comment__input");
    expect(question.cssClasses.editor).toBe("sd-rich-text");
    expect(question.cssClasses.area).toBe("sd-rich-text__area");
    expect(question.cssClasses.display).toBe("sd-rich-text__content");
    expect(question.cssClasses.toolbar).toBe("sd-rich-text__toolbar");
    expect(question.cssClasses.footer).toContain("sd-action-bar");
    expect(question.cssClasses.toolbarStatic).toBe("sd-rich-text--toolbar-static");
    expect(question.cssClasses.grip).toContain("sd-comment__grip");
    expect(question.cssClasses.grip).toContain("sd-rich-text__grip");
    question.allowResize = false;
    expect(question.resizeStyle).toBe("none");
  });

  test("rich-text properties and events from the previous design are not part of core", () => {
    ["allowRichText", "richTextEditMode", "richTextToolbarVisibility", "richTextDisableBold", "richTextConverter", "textFormat"]
      .forEach(name => {
        expect(Serializer.findProperty("comment", name), name).toBeFalsy();
        expect(Serializer.findProperty("richtext", name), name).toBeFalsy();
      });
    expect(Serializer.findProperty("survey", "textFormat")).toBeFalsy();
    const survey = new SurveyModel();
    expect((<any>survey).onHtmlToMarkdown).toBeUndefined();
    expect(typeof (<any>survey).getSurveyHtmlToMarkdown).toBe("undefined");
    expect((<any>settings).richText).toBeUndefined();
    expect(Object.prototype.hasOwnProperty.call(settings, "richText")).toBe(false);
  });
});

describe("getComponentName", () => {
  test("without a registered renderer the question uses the comment component", () => {
    const registered = RendererFactory.Instance.getRenderer("richtext", "default");
    RendererFactory.Instance.unregisterRenderer("richtext", "default");
    try {
      const question = new QuestionRichTextModel("c");
      expect(question.getComponentName()).toBe("comment");
    } finally {
      if (registered !== "default") RendererFactory.Instance.registerRenderer("richtext", "default", registered, true);
    }
  });

  test("a richtext question and a matrix cell use the rich renderer", () => {
    const question = new QuestionRichTextModel("c");
    expect(question.getComponentName()).toBe(RICH_RENDERER);

    const matrix = new QuestionMatrixDropdownModel("m");
    matrix.fromJSON({
      type: "matrixdropdown",
      name: "m",
      columns: [{ name: "notes", cellType: "richtext" }],
      rows: ["Row 1"]
    });
    const cell = <QuestionRichTextModel>matrix.visibleRows[0].cells[0].question;
    expect(cell).toBeInstanceOf(QuestionRichTextModel);
    expect(cell.getType()).toBe("richtext");
    expect(cell.getComponentName()).toBe(RICH_RENDERER);
  });

  test("display and view mode keep the rich renderer, ahead of the view-mode fallback", () => {
    RendererFactory.Instance.registerRenderer("richtext", "view", VIEW_RENDERER);
    const survey = new SurveyModel({
      elements: [{ type: "richtext", name: "c" }]
    });
    const question = <QuestionRichTextModel>survey.getQuestionByName("c");

    survey.mode = "display";
    expect(question.getComponentName()).toBe(RICH_RENDERER);

    survey.readOnlyMode = "view";
    expect(question.isViewMode).toBe(true);
    expect(question.getComponentName()).toBe(RICH_RENDERER);
    RendererFactory.Instance.unregisterRenderer("richtext", "view");
  });
});

describe("a richtext question does not change today's text path", () => {
  test("typed markup and a stored HTML default stay literal text", () => {
    const stored = "<p style=\"color:red\">Red</p><table><tr><td>cell</td></tr></table>";
    const survey = new SurveyModel({
      elements: [
        { type: "richtext", name: "c_md" },
        { type: "richtext", name: "c_unsupported", defaultValue: stored },
        { type: "text", name: "s3", title: "Raw <b>html</b> and <script>alert(1)</script>" }
      ]
    });
    const rich = <QuestionRichTextModel>survey.getQuestionByName("c_md");
    rich.value = "<b>x</b>";
    expect(rich.value).toBe("<b>x</b>");
    expect(survey.data.c_md).toBe("<b>x</b>");

    const unsupported = <QuestionRichTextModel>survey.getQuestionByName("c_unsupported");
    expect(unsupported.value).toBe(stored);

    const title = survey.getQuestionByName("s3").locTitle;
    expect(title.hasHtml).toBe(false);
    expect(title.renderedHtml).toBe("Raw <b>html</b> and <script>alert(1)</script>");

    const json = survey.toJSON();
    const elements = json.pages[0].elements;
    expect(elements.filter((el: any) => el.name === "c_md")[0].type).toBe("richtext");
    expect(elements.filter((el: any) => el.name === "c_unsupported")[0].defaultValue).toBe(stored);
    expect(JSON.stringify(json)).not.toContain("textFormat");
    expect(JSON.stringify(json)).not.toContain("allowRichText");
  });

  test("onTextMarkdown is never called with name value for a richtext question", () => {
    const survey = new SurveyModel({
      elements: [{ type: "richtext", name: "c", title: "Rich answer" }]
    });
    const names: Array<string> = [];
    survey.onTextMarkdown.add((sender, options) => {
      names.push(options.name);
    });
    const question = <Question>survey.getQuestionByName("c");
    question.value = "<b>ok</b>";
    expect(question.locTitle.renderedHtml).toBe("Rich answer");
    expect(names).not.toContain("value");

    names.splice(0, names.length);
    survey.mode = "display";
    expect(question.locTitle.renderedHtml).toBe("Rich answer");
    expect(String(question.displayValue)).toBe("<b>ok</b>");
    expect(names).not.toContain("value");
  });
});
