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

describe("comment textFormat", () => {
  afterEach(() => {
    if (RendererFactory.Instance.getRenderer("comment", "richtext") !== "default") {
      RendererFactory.Instance.unregisterRenderer("comment", "richtext");
    }
    if (RendererFactory.Instance.getRenderer("question", "view") !== "default") {
      RendererFactory.Instance.unregisterRenderer("question", "view");
    }
  });

  test("textFormat defaults to plain and is not serialized", () => {
    const question = new QuestionCommentModel("c");
    expect(question.textFormat).toBe("plain");
    expect(question.toJSON().textFormat).toBeUndefined();
    const survey = new SurveyModel({ elements: [{ type: "comment", name: "plain" }] });
    expect(survey.toJSON().pages[0].elements[0].textFormat).toBeUndefined();
  });

  test("a non-default textFormat survives a load/save round trip", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "comment", name: "c_md", textFormat: "markdown" },
        { type: "comment", name: "c_html", textFormat: "html" },
        { type: "comment", name: "plain" }
      ]
    });
    const json = survey.toJSON();
    expect(json.pages[0].elements[0].textFormat).toBe("markdown");
    expect(json.pages[0].elements[1].textFormat).toBe("html");
    expect(json.pages[0].elements[2].textFormat).toBeUndefined();
    const loaded = new SurveyModel(json);
    expect(loaded.getQuestionByName("c_md").textFormat).toBe("markdown");
    expect(loaded.getQuestionByName("c_html").textFormat).toBe("html");
    expect(loaded.getQuestionByName("plain").textFormat).toBe("plain");
    expect(loaded.toJSON().pages[0].elements[2].textFormat).toBeUndefined();
  });

  test("the survey has no stringFormat and settings has no richText slot", () => {
    expect(Serializer.findProperty("survey", "stringFormat")).toBeFalsy();
    expect(settings).not.toHaveProperty("richText");
  });

  test("textFormat stays invisible without the plugin", () => {
    expect(Serializer.findProperty("comment", "textFormat").visible).toBe(false);
  });

  test("getComponentName stays on the default textarea until a rich renderer is registered", () => {
    const survey = new SurveyModel({ elements: [{ type: "comment", name: "c", textFormat: "markdown" }] });
    const question = <QuestionCommentModel>survey.getQuestionByName("c");
    expect(question.getComponentName()).toBe(new QuestionCommentModel("other").getComponentName());
    RendererFactory.Instance.registerRenderer("comment", "richtext", "sv-rich-text-comment");
    expect(question.getComponentName()).toBe("sv-rich-text-comment");
    question.textFormat = "plain";
    expect(question.getComponentName()).not.toBe("sv-rich-text-comment");
  });

  test("an inheriting comment class uses the comment rich renderer", () => {
    const question = new CommentChild("c");
    question.textFormat = "markdown";
    RendererFactory.Instance.registerRenderer("comment", "richtext", "sv-rich-text-comment");
    expect(question.getType()).toBe("commentchild");
    expect(question.getComponentName()).toBe("sv-rich-text-comment");
  });

  test("a matrix comment cell uses textFormat and the rich renderer", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "matrixdropdown",
        name: "m1",
        columns: [{ name: "notes", cellType: "comment", textFormat: "markdown" }],
        rows: ["Row 1"]
      }]
    });
    const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("m1");
    const cell = <QuestionCommentModel>matrix.visibleRows[0].cells[0].question;
    expect(cell.getType()).toBe("comment");
    expect(cell.textFormat).toBe("markdown");
    expect(cell.getComponentName()).toBe(new QuestionCommentModel("other").getComponentName());
    RendererFactory.Instance.registerRenderer("comment", "richtext", "sv-rich-text-comment");
    expect(cell.getComponentName()).toBe("sv-rich-text-comment");
    const json = survey.toJSON();
    expect(json.pages[0].elements[0].columns[0].textFormat).toBe("markdown");
  });

  test("display mode uses the rich component when textFormat is not plain", () => {
    const survey = new SurveyModel({
      readOnlyMode: "view",
      elements: [{ type: "comment", name: "c", textFormat: "markdown" }]
    });
    survey.mode = "display";
    const question = <QuestionCommentModel>survey.getQuestionByName("c");
    RendererFactory.Instance.registerRenderer("question", "view", "sv-question-view");
    expect(question.isViewMode).toBe(true);
    expect(question.getComponentName()).toBe("sv-question-view");
    RendererFactory.Instance.registerRenderer("comment", "richtext", "sv-rich-text-comment");
    expect(question.getComponentName()).toBe("sv-rich-text-comment");
    question.textFormat = "plain";
    expect(question.getComponentName()).toBe("sv-question-view");
  });

  test("richTextConverter is not serialized and replaces the format converter", async () => {
    const rich = await import("../../src/plugins/rich-text/index");
    const survey = new SurveyModel({ elements: [{ type: "comment", name: "c", textFormat: "markdown" }] });
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
    const host = document.createElement("div");
    document.body.appendChild(host);
    const editor = new rich.RichTextEditorModel({
      getValue: () => question.value || "",
      setValue: (value: string) => { question.value = value; },
      isInputTextUpdate: false,
      acceptCarriageReturn: true,
      mode: "block",
      format: "markdown",
      converter: converter,
      owner: question
    });
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
