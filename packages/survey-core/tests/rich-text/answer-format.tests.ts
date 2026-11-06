import { QuestionCommentModel } from "../../src/question_comment";
import { canEditRichAnswer, createAnswerConverter } from "../../src/plugins/rich-text/answer-format";
import { RichText, RichTextEditorModel } from "../../src/plugins/rich-text/index";
import { SurveyModel } from "../../src/survey";

import { describe, expect, test } from "vitest";

const block = { inline: false };

function questionIn(survey: SurveyModel): QuestionCommentModel {
  return <QuestionCommentModel>survey.getQuestionByName("c");
}

describe("answer converter", () => {
  test("toHtml goes through onTextMarkdown and escapes plain text", () => {
    const survey = new SurveyModel({ elements: [{ type: "comment", name: "c", allowRichText: true }] });
    const question = questionIn(survey);
    let seenName = "";
    survey.onTextMarkdown.add((_sender, options) => {
      seenName = options.name;
      expect(options.element).toBe(question);
      if (options.text.indexOf("**") < 0) return;
      options.html = "<b>" + options.text + "</b><script>alert(1)</script>";
    });
    const converter = createAnswerConverter(question);
    expect(converter.toHtml("**a**", block)).toBe("<strong>**a**</strong>");
    expect(seenName).toBe("value");
    expect(converter.toHtml("a < b\nc", block)).toBe("a &lt; b<br>c");
  });

  test("a pass-through handler is sanitized", () => {
    const survey = new SurveyModel({ elements: [{ type: "comment", name: "c", allowRichText: true }] });
    survey.onTextMarkdown.add((_sender, options) => { options.html = options.text; });
    const converter = createAnswerConverter(questionIn(survey));
    const source = "<img src=x onerror=alert(1)><b>ok</b><script>alert(2)</script><a href=\"javascript:alert(1)\">x</a>";
    const html = converter.toHtml(source, block);
    expect(html.indexOf("onerror")).toBe(-1);
    expect(html.indexOf("script")).toBe(-1);
    expect(html.indexOf("javascript")).toBe(-1);
    expect(html.indexOf("<strong>ok</strong>")).toBeGreaterThan(-1);
  });

  test("toSource goes through onHtmlToMarkdown", () => {
    const survey = new SurveyModel({ elements: [{ type: "comment", name: "c", allowRichText: true }] });
    const question = questionIn(survey);
    survey.onHtmlToMarkdown.add((_sender, options) => {
      expect(options.element).toBe(question);
      expect(options.name).toBe("value");
      options.text = "from-html:" + options.html;
    });
    const root = document.createElement("div");
    root.innerHTML = "<b>a</b>";
    expect(createAnswerConverter(question).toSource(root, block)).toBe("from-html:<b>a</b>");
  });

  test("checkLossless follows the handler output", () => {
    const plain = new SurveyModel({ elements: [{ type: "comment", name: "c", allowRichText: true }] });
    plain.onTextMarkdown.add(RichText.textMarkdownHandler);
    plain.onHtmlToMarkdown.add(RichText.htmlToMarkdownHandler);
    const plainQuestion = questionIn(plain);
    expect(createAnswerConverter(plainQuestion).checkLossless("hello", block)).toBe(true);
    expect(createAnswerConverter(plainQuestion).checkLossless("[a](https://surveyjs.io)", block)).toBe(true);

    const styled = new SurveyModel({ elements: [{ type: "comment", name: "c", allowRichText: true }] });
    styled.onTextMarkdown.add((_sender, options) => { options.html = "<p style=\"color:red\">" + options.text + "</p>"; });
    styled.onHtmlToMarkdown.add(RichText.htmlToMarkdownHandler);
    expect(createAnswerConverter(questionIn(styled)).checkLossless("Red", block)).toBe(false);

    const table = new SurveyModel({ elements: [{ type: "comment", name: "c", allowRichText: true }] });
    table.onTextMarkdown.add((_sender, options) => { options.html = "<table><tr><td>" + options.text + "</td></tr></table>"; });
    table.onHtmlToMarkdown.add((_sender, options) => { options.text = options.html; });
    expect(createAnswerConverter(questionIn(table)).checkLossless("a", block)).toBe(false);

    const broken = new SurveyModel({ elements: [{ type: "comment", name: "c", allowRichText: true }] });
    broken.onTextMarkdown.add((_sender, options) => { options.html = "<b>" + options.text + "</b>"; });
    broken.onHtmlToMarkdown.add((_sender, options) => { options.text = "x"; });
    expect(createAnswerConverter(questionIn(broken)).checkLossless("a", block)).toBe(false);
  });

  test("canEditRich needs both handlers and an editable question", () => {
    const detached = new QuestionCommentModel("c");
    detached.allowRichText = true;
    expect(canEditRichAnswer(detached)).toBe(false);

    const survey = new SurveyModel({ elements: [{ type: "comment", name: "c", allowRichText: true }] });
    const question = questionIn(survey);
    expect(canEditRichAnswer(question)).toBe(false);
    survey.onTextMarkdown.add(RichText.textMarkdownHandler);
    expect(canEditRichAnswer(question)).toBe(false);
    survey.onHtmlToMarkdown.add((_sender, options) => { if (options.name !== "value") options.text = "x"; });
    expect(canEditRichAnswer(question)).toBe(false);
    survey.onHtmlToMarkdown.clear();
    survey.onHtmlToMarkdown.add(RichText.htmlToMarkdownHandler);
    expect(canEditRichAnswer(question)).toBe(true);
    question.readOnly = true;
    expect(canEditRichAnswer(question)).toBe(false);
  });

  test("richTextConverter replaces the answer converter and skips the probe", () => {
    const survey = new SurveyModel({ elements: [{ type: "comment", name: "c", allowRichText: true }] });
    const question = questionIn(survey);
    const converter = { toHtml: () => "<b>custom</b>", toSource: () => "src", lossless: true };
    (question as any).richTextConverter = converter;
    const editor = new RichTextEditorModel({
      getValue: () => "",
      setValue: () => {},
      isInputTextUpdate: false,
      acceptCarriageReturn: true,
      converter: converter,
      owner: question
    });
    expect(editor.canEditRich).toBe(true);
    expect(editor.getReadOnlyHtml("x")).toBe("<b>custom</b>");
  });
});
