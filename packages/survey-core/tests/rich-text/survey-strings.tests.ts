import { settings } from "../../src/settings";
import { Serializer } from "../../src/jsonobject";
import { Question } from "../../src/question";
import { QuestionCommentModel } from "../../src/question_comment";
import { SurveyModel } from "../../src/survey";
import { DomDocumentHelper } from "../../src/global_variables_utils";
import { RichText } from "../../src/plugins/rich-text/index";

import { describe, expect, test } from "vitest";

describe("survey strings through handlers", () => {
  test("the plugin without a handler leaves titles as plain text", () => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q", title: "**bold**" }] });
    const question = survey.getQuestionByName("q");
    expect(question.locTitle.hasHtml).toBe(false);
    expect(question.locTitle.renderedHtml).toBe("**bold**");
  });

  test("textMarkdownHandler renders titles inline and descriptions as blocks", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "text",
        name: "q",
        title: "- not a list",
        description: "- item one"
      }]
    });
    survey.onTextMarkdown.add(RichText.textMarkdownHandler);
    const question = survey.getQuestionByName("q");
    expect(question.locTitle.renderedHtml).toBe("- not a list");
    expect(question.locTitle.hasHtml).toBe(false);
    expect(question.locDescription.renderedHtml).toBe("<ul><li>item one</li></ul>");
    expect(question.locDescription.hasHtml).toBe(true);
  });

  test("plain strings keep the plain rendering path", () => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q", title: "Plain title" }] });
    survey.onTextMarkdown.add(RichText.textMarkdownHandler);
    const question = survey.getQuestionByName("q");
    expect(question.locTitle.hasHtml).toBe(false);
    expect(question.locTitle.renderedHtml).toBe("Plain title");
  });

  test("strings without markdown are not converted", () => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q", isRequired: true, requiredErrorText: "**required**" }] });
    let calls = 0;
    survey.onTextMarkdown.add(() => { calls++; });
    const question = <Question>survey.getQuestionByName("q");
    expect(question.locRequiredErrorText.hasHtml).toBe(false);
    expect(question.locRequiredErrorText.renderedHtml).toBe("**required**");
    expect(calls).toBe(0);
  });

  test("a conditional handler converts only the strings it handles", () => {
    const survey = new SurveyModel({
      elements: [{ type: "text", name: "q", title: "**title**", description: "**description**" }]
    });
    survey.onTextMarkdown.add((_sender, options) => {
      if (options.name !== "title") return;
      const html = RichText.markdownToHtml(options.text, { inline: true });
      options.html = "[handler] " + html;
    });
    const question = survey.getQuestionByName("q");
    expect(question.locTitle.renderedHtml).toBe("[handler] <strong>title</strong>");
    expect(question.locDescription.hasHtml).toBe(false);
    expect(question.locDescription.renderedHtml).toBe("**description**");
  });

  test("a pass-through handler is not rewritten by the plugin", () => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q", title: "**bold**" }] });
    survey.onTextMarkdown.add((_sender, options) => {
      expect(options.html).toBeNull();
      options.html = options.text;
    });
    expect(survey.getQuestionByName("q").locTitle.renderedHtml).toBe("**bold**");
  });

  test("markdownToHtml honours an explicit inline flag and defaults to inline", () => {
    expect(RichText.markdownToHtml("- item", { inline: true })).toBe("");
    expect(RichText.markdownToHtml("- item", { inline: false })).toBe("<ul><li>item</li></ul>");
    expect(RichText.markdownToHtml("- item")).toBe("");
    expect(RichText.markdownToHtml("**a**")).toBe("<strong>a</strong>");
    expect(RichText.markdownToHtml("plain")).toBe("");
  });

  test("htmlToMarkdown converts a string, empty html and html without a DOM", () => {
    expect(RichText.htmlToMarkdown("<b>a</b>")).toBe("**a**");
    expect(RichText.htmlToMarkdown("")).toBe("");
    const options = { html: "<b>a</b>", text: <string>null };
    RichText.htmlToMarkdownHandler(null, options);
    expect(options.text).toBe("**a**");
    const empty = { html: "", text: <string>null };
    RichText.htmlToMarkdownHandler(null, empty);
    expect(empty.text).toBe("");
    const original = DomDocumentHelper.isAvailable;
    DomDocumentHelper.isAvailable = () => false;
    try {
      expect(RichText.htmlToMarkdown("<b>a</b>")).toBe("<b>a</b>");
    } finally {
      DomDocumentHelper.isAvailable = original;
    }
  });

  test("a customer handler renders its own html and registerFormat is gone", () => {
    expect(RichText.registerFormat).toBeUndefined();
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q", title: "**a**" }] });
    survey.onTextMarkdown.add((_sender, options) => { options.html = "<i>" + options.text + "</i>"; });
    expect(survey.getQuestionByName("q").locTitle.renderedHtml).toBe("<i>**a**</i>");
  });

  test("a comment answer is inline only when it does not accept a carriage return", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "comment", name: "block", allowRichText: true },
        { type: "comment", name: "inline", allowRichText: true, acceptCarriageReturn: false }
      ]
    });
    const block = <QuestionCommentModel>survey.getQuestionByName("block");
    const inline = <QuestionCommentModel>survey.getQuestionByName("inline");
    expect(RichText.markdownToHtml("- item", { element: block, name: "value" })).toBe("<ul><li>item</li></ul>");
    expect(RichText.markdownToHtml("- item", { element: inline, name: "value" })).toBe("");
  });

  test("findUnsupported checks survey strings as markdown", () => {
    const survey = new SurveyModel({
      elements: [{ type: "text", name: "s5", description: "| a | b |\n|---|---|\n| 1 | 2 |" }]
    });
    expect(RichText.findUnsupported(survey).map(hit => hit.name)).toContain("description");
  });

  test("settings has no richText slot", () => {
    expect(settings).not.toHaveProperty("richText");
    expect(Serializer.findProperty("survey", "stringFormat")).toBeFalsy();
  });
});
