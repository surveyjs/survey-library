import { Serializer } from "../../src/jsonobject";
import { RendererFactory } from "../../src/rendererFactory";
import { QuestionCommentModel } from "../../src/question_comment";
import { QuestionMatrixDropdownModel } from "../../src/question_matrixdropdown";
import { settings } from "../../src/settings";
import { SurveyModel } from "../../src/survey";

import { afterEach, describe, expect, test } from "vitest";

class CommentChild extends QuestionCommentModel {
  public getType(): string {
    return "commentchild";
  }
}

describe("comment allowRichText", () => {
  afterEach(() => {
    if (RendererFactory.Instance.getRenderer("comment", "richtext") !== "default") {
      RendererFactory.Instance.unregisterRenderer("comment", "richtext");
    }
    if (RendererFactory.Instance.getRenderer("question", "view") !== "default") {
      RendererFactory.Instance.unregisterRenderer("question", "view");
    }
  });

  test("allowRichText defaults to false and is not serialized", () => {
    const question = new QuestionCommentModel("c");
    expect(question.allowRichText).toBe(false);
    expect(question.toJSON().allowRichText).toBeUndefined();
    const survey = new SurveyModel({ elements: [{ type: "comment", name: "plain" }] });
    expect(survey.toJSON().pages[0].elements[0].allowRichText).toBeUndefined();
  });

  test("allowRichText survives a load/save round trip and textFormat is gone", () => {
    expect(Serializer.findProperty("comment", "textFormat")).toBeFalsy();
    const survey = new SurveyModel({
      elements: [
        { type: "comment", name: "c_md", allowRichText: true },
        { type: "comment", name: "plain" }
      ]
    });
    const json = survey.toJSON();
    expect(json.pages[0].elements[0].allowRichText).toBe(true);
    expect(json.pages[0].elements[1].allowRichText).toBeUndefined();
    const loaded = new SurveyModel(json);
    expect(loaded.getQuestionByName("c_md").allowRichText).toBe(true);
    expect(loaded.getQuestionByName("plain").allowRichText).toBe(false);
    expect(loaded.toJSON().pages[0].elements[1].allowRichText).toBeUndefined();
  });

  test("the survey has no stringFormat and settings has no richText slot", () => {
    expect(Serializer.findProperty("survey", "stringFormat")).toBeFalsy();
    expect(settings).not.toHaveProperty("richText");
  });

  test("allowRichText stays invisible without the plugin", () => {
    expect(Serializer.findProperty("comment", "allowRichText").visible).toBe(false);
  });

  test("getSurveyHtmlToMarkdown returns null until a handler assigns text", () => {
    const survey = new SurveyModel({ elements: [{ type: "comment", name: "c", allowRichText: true }] });
    const question = survey.getQuestionByName("c");
    expect(survey.getSurveyHtmlToMarkdown(question, "<b>a</b>", "value")).toBeNull();
    let seen: { element: any, name: string, html: string };
    survey.onHtmlToMarkdown.add((_sender, options) => {
      seen = { element: options.element, name: options.name, html: options.html };
      options.text = "md";
    });
    expect(survey.getSurveyHtmlToMarkdown(question, "<b>a</b>", "value")).toBe("md");
    expect(seen.element).toBe(question);
    expect(seen.name).toBe("value");
    expect(seen.html).toBe("<b>a</b>");
  });

  test("adding an onHtmlToMarkdown handler does not refresh strings", () => {
    const survey = new SurveyModel();
    let calls = 0;
    survey.locStrsChanged = () => { calls++; };
    survey.onHtmlToMarkdown.add(() => {});
    expect(calls).toBe(0);
    survey.onTextMarkdown.add(() => {});
    expect(calls).toBe(1);
  });

  test("getComponentName stays on the default textarea until a rich renderer is registered", () => {
    const survey = new SurveyModel({ elements: [{ type: "comment", name: "c", allowRichText: true }] });
    const question = <QuestionCommentModel>survey.getQuestionByName("c");
    expect(question.getComponentName()).toBe(new QuestionCommentModel("other").getComponentName());
    RendererFactory.Instance.registerRenderer("comment", "richtext", "sv-rich-text-comment");
    expect(question.getComponentName()).toBe("sv-rich-text-comment");
    question.allowRichText = false;
    expect(question.getComponentName()).not.toBe("sv-rich-text-comment");
  });

  test("an inheriting comment class uses the comment rich renderer", () => {
    const question = new CommentChild("c");
    question.allowRichText = true;
    RendererFactory.Instance.registerRenderer("comment", "richtext", "sv-rich-text-comment");
    expect(question.getType()).toBe("commentchild");
    expect(question.getComponentName()).toBe("sv-rich-text-comment");
  });

  test("a matrix comment cell uses allowRichText and the rich renderer", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "matrixdropdown",
        name: "m1",
        columns: [{ name: "notes", cellType: "comment", allowRichText: true }],
        rows: ["Row 1"]
      }]
    });
    const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("m1");
    const cell = <QuestionCommentModel>matrix.visibleRows[0].cells[0].question;
    expect(cell.getType()).toBe("comment");
    expect(cell.allowRichText).toBe(true);
    expect(cell.getComponentName()).toBe(new QuestionCommentModel("other").getComponentName());
    RendererFactory.Instance.registerRenderer("comment", "richtext", "sv-rich-text-comment");
    expect(cell.getComponentName()).toBe("sv-rich-text-comment");
    const json = survey.toJSON();
    expect(json.pages[0].elements[0].columns[0].allowRichText).toBe(true);
  });

  test("display mode uses the rich component when allowRichText is set", () => {
    const survey = new SurveyModel({
      readOnlyMode: "view",
      elements: [{ type: "comment", name: "c", allowRichText: true }]
    });
    survey.mode = "display";
    const question = <QuestionCommentModel>survey.getQuestionByName("c");
    RendererFactory.Instance.registerRenderer("question", "view", "sv-question-view");
    expect(question.isViewMode).toBe(true);
    expect(question.getComponentName()).toBe("sv-question-view");
    RendererFactory.Instance.registerRenderer("comment", "richtext", "sv-rich-text-comment");
    expect(question.getComponentName()).toBe("sv-rich-text-comment");
    question.allowRichText = false;
    expect(question.getComponentName()).toBe("sv-question-view");
  });

  test("richTextConverter is not serialized and replaces the answer converter", async () => {
    const rich = await import("../../src/plugins/rich-text/index");
    expect(Serializer.findProperty("comment", "allowRichText").visible).toBe(true);
    const survey = new SurveyModel({ elements: [{ type: "comment", name: "c", allowRichText: true }] });
    const question = <QuestionCommentModel>survey.getQuestionByName("c");
    question.value = "hello";
    const converter = {
      toHtml: () => "<b>custom</b>",
      toSource: () => "from-converter"
    };
    (question as any).richTextConverter = converter;
    expect(question.toJSON().richTextConverter).toBeUndefined();
    expect(question.toJSON().richTextEditMode).toBeUndefined();
    expect(question.toJSON().richTextToolbarVisibility).toBeUndefined();
    expect(question.toJSON().richTextDisableBold).toBeUndefined();
    const host = document.createElement("div");
    document.body.appendChild(host);
    const editor = new rich.RichTextEditorModel({
      getValue: () => question.value || "",
      setValue: (value: string) => { question.value = value; },
      isInputTextUpdate: false,
      acceptCarriageReturn: true,
      converter: converter,
      owner: question
    });
    expect(editor.canEditRich).toBe(true);
    editor.attach(host);
    expect(host.innerHTML).toBe("<b>custom</b>");
    expect(editor.getReadOnlyHtml("x")).toBe("<b>custom</b>");
    host.innerHTML = "<strong>z</strong>";
    host.dispatchEvent(new InputEvent("input", { bubbles: true }));
    host.dispatchEvent(new FocusEvent("blur"));
    expect(question.value).toBe("from-converter");
    editor.detach();
    host.remove();
  });
});
