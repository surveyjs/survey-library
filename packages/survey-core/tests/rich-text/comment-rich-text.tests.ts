import { afterEach, describe, expect, test } from "vitest";
import { Question } from "../../src/question";
import { QuestionCommentModel } from "../../src/question_comment";
import { QuestionMatrixDropdownModel } from "../../src/question_matrixdropdown";
import { RendererFactory } from "../../src/rendererFactory";
import { Serializer } from "../../src/jsonobject";
import { settings } from "../../src/settings";
import { SurveyModel } from "../../src/survey";

const RICH_RENDERER = "sv-rich-text-comment";
const VIEW_RENDERER = "sv-comment-view";

class InheritedCommentQuestion extends QuestionCommentModel {
  public getType(): string {
    return "inheritedcomment";
  }
}

let richRendererRegistered = false;

afterEach(() => {
  if (!richRendererRegistered) return;
  RendererFactory.Instance.unregisterRenderer("comment", "richtext");
  RendererFactory.Instance.unregisterRenderer("comment", "view");
  richRendererRegistered = false;
});

function registerRichRenderer(): void {
  RendererFactory.Instance.registerRenderer("comment", "richtext", RICH_RENDERER);
  richRendererRegistered = true;
}

describe("allowRichText on a comment question", () => {
  test("false is the default and is not serialized; true survives a load/save round trip", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "comment", name: "plain" },
        { type: "comment", name: "c_md", allowRichText: true }
      ]
    });
    const plain = <QuestionCommentModel>survey.getQuestionByName("plain");
    const rich = <QuestionCommentModel>survey.getQuestionByName("c_md");
    expect(plain.allowRichText).toBe(false);
    expect(rich.allowRichText).toBe(true);

    const json = survey.toJSON();
    expect(JSON.stringify(json)).not.toContain("textFormat");
    const elements = json.pages[0].elements;
    const plainJson = elements.filter((el: any) => el.name === "plain")[0];
    const richJson = elements.filter((el: any) => el.name === "c_md")[0];
    expect(plainJson.allowRichText).toBeUndefined();
    expect(richJson.allowRichText).toBe(true);

    const restored = new SurveyModel(json);
    expect((<QuestionCommentModel>restored.getQuestionByName("plain")).allowRichText).toBe(false);
    expect((<QuestionCommentModel>restored.getQuestionByName("c_md")).allowRichText).toBe(true);
    expect(restored.toJSON().pages[0].elements.filter((el: any) => el.name === "c_md")[0].allowRichText).toBe(true);
  });

  test("richTextToolbarMode defaults to onFocus and only a non-default value is serialized", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "comment", name: "plain", allowRichText: true },
        { type: "comment", name: "hidden", allowRichText: true, richTextToolbarMode: "none" },
        { type: "comment", name: "selection", allowRichText: true, richTextToolbarMode: "onSelection" },
        { type: "comment", name: "fixed", allowRichText: true, richTextToolbarMode: "static" }
      ]
    });
    const plain = <QuestionCommentModel>survey.getQuestionByName("plain");
    expect(plain.richTextToolbarMode).toBe("onFocus");
    const elements = survey.toJSON().pages[0].elements;
    const jsonOf = (name: string) => elements.filter((el: any) => el.name === name)[0];
    expect(jsonOf("plain").richTextToolbarMode).toBeUndefined();
    expect(jsonOf("hidden").richTextToolbarMode).toBe("none");
    expect(jsonOf("selection").richTextToolbarMode).toBe("onSelection");
    expect(jsonOf("fixed").richTextToolbarMode).toBe("static");

    const restored = new SurveyModel(survey.toJSON());
    expect((<QuestionCommentModel>restored.getQuestionByName("hidden")).richTextToolbarMode).toBe("none");
    expect((<QuestionCommentModel>restored.getQuestionByName("selection")).richTextToolbarMode).toBe("onSelection");

    const prop = Serializer.findProperty("comment", "richTextToolbarMode");
    expect(prop.choices.map((choice: any) => choice.value !== undefined ? choice.value : choice)).toEqual(["none", "onFocus", "onSelection", "static"]);
    expect(prop.visible).toBe(!!(globalThis as any).__surveyRichTextPlugin);
    expect(prop.visibleIf(plain)).toBe(true);
    plain.allowRichText = false;
    expect(prop.visibleIf(plain)).toBe(false);
  });

  test("the property stays hidden until a plugin shows it", () => {
    const prop = Serializer.findProperty("comment", "allowRichText");
    expect(prop).toBeTruthy();
    expect(prop.type).toBe("boolean");
    expect(prop.visible).toBe(!!(globalThis as any).__surveyRichTextPlugin);
  });

  test("rich-text properties and events from the previous design are not part of core", () => {
    ["richTextEditMode", "richTextToolbarVisibility", "richTextDisableBold", "richTextConverter", "textFormat"]
      .forEach(name => {
        expect(Serializer.findProperty("comment", name), name).toBeFalsy();
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
  test("without a registered renderer the comment stays the default component", () => {
    const question = new QuestionCommentModel("c");
    question.allowRichText = true;
    const plain = new QuestionCommentModel("plain");
    const registered = RendererFactory.Instance.getRenderer("comment", "richtext");
    if (registered !== "default") RendererFactory.Instance.unregisterRenderer("comment", "richtext");
    try {
      expect(question.getComponentName()).toBe(plain.getComponentName());
      expect(question.getComponentName()).toBe("default");
    } finally {
      if (registered !== "default") RendererFactory.Instance.registerRenderer("comment", "richtext", registered);
    }
  });

  test("a comment, a subclass and a matrix comment cell use the comment rich renderer", () => {
    registerRichRenderer();
    const comment = new QuestionCommentModel("c");
    comment.allowRichText = true;
    expect(comment.getComponentName()).toBe(RICH_RENDERER);

    const inherited = new InheritedCommentQuestion("child");
    inherited.allowRichText = true;
    expect(inherited.getType()).not.toBe("comment");
    expect(inherited.getComponentName()).toBe(RICH_RENDERER);

    const matrix = new QuestionMatrixDropdownModel("m");
    matrix.fromJSON({
      type: "matrixdropdown",
      name: "m",
      columns: [{ name: "notes", cellType: "comment", allowRichText: true }],
      rows: ["Row 1"]
    });
    const cell = <QuestionCommentModel>matrix.visibleRows[0].cells[0].question;
    expect(cell).toBeInstanceOf(QuestionCommentModel);
    expect(cell.getType()).toBe("comment");
    expect(cell.allowRichText).toBe(true);
    expect(cell.getComponentName()).toBe(RICH_RENDERER);
  });

  test("display and view mode keep the rich renderer, ahead of the view-mode fallback", () => {
    registerRichRenderer();
    RendererFactory.Instance.registerRenderer("comment", "view", VIEW_RENDERER);
    const survey = new SurveyModel({
      elements: [{ type: "comment", name: "c", allowRichText: true }]
    });
    const question = <QuestionCommentModel>survey.getQuestionByName("c");

    survey.mode = "display";
    expect(question.getComponentName()).toBe(RICH_RENDERER);

    survey.readOnlyMode = "view";
    expect(question.isViewMode).toBe(true);
    expect(question.getComponentName()).toBe(RICH_RENDERER);

    question.allowRichText = false;
    expect(question.getComponentName()).toBe(VIEW_RENDERER);
  });

  test("display mode without the renderer falls back to the ordinary component", () => {
    const survey = new SurveyModel({
      elements: [{ type: "comment", name: "c", allowRichText: true }]
    });
    const question = <QuestionCommentModel>survey.getQuestionByName("c");
    survey.mode = "display";
    survey.readOnlyMode = "view";
    expect(question.isViewMode).toBe(true);
    expect(question.getComponentName()).toBe("default");
  });
});

describe("a rich comment does not change today's text path", () => {
  test("typed markup and a stored HTML default stay literal text", () => {
    const stored = "<p style=\"color:red\">Red</p><table><tr><td>cell</td></tr></table>";
    const survey = new SurveyModel({
      elements: [
        { type: "comment", name: "c_md", allowRichText: true },
        { type: "comment", name: "c_unsupported", allowRichText: true, defaultValue: stored },
        { type: "text", name: "s3", title: "Raw <b>html</b> and <script>alert(1)</script>" }
      ]
    });
    const rich = <QuestionCommentModel>survey.getQuestionByName("c_md");
    rich.value = "<b>x</b>";
    expect(rich.value).toBe("<b>x</b>");
    expect(survey.data.c_md).toBe("<b>x</b>");

    const unsupported = <QuestionCommentModel>survey.getQuestionByName("c_unsupported");
    expect(unsupported.value).toBe(stored);

    const title = survey.getQuestionByName("s3").locTitle;
    expect(title.hasHtml).toBe(false);
    expect(title.renderedHtml).toBe("Raw <b>html</b> and <script>alert(1)</script>");

    const json = survey.toJSON();
    const elements = json.pages[0].elements;
    expect(elements.filter((el: any) => el.name === "c_md")[0].allowRichText).toBe(true);
    expect(elements.filter((el: any) => el.name === "c_unsupported")[0].defaultValue).toBe(stored);
    expect(JSON.stringify(json)).not.toContain("textFormat");
  });

  test("onTextMarkdown is never called with name value for a rich comment", () => {
    const survey = new SurveyModel({
      elements: [{ type: "comment", name: "c", title: "Rich answer", allowRichText: true }]
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
