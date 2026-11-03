import { settings } from "../../src/settings";
import { IRichTextContext, IRichTextProvider } from "../../src/rich-text-provider";
import { Question } from "../../src/question";
import { SurveyModel } from "../../src/survey";

import { afterEach, describe, expect, test } from "vitest";

function installProvider(toHtml?: (source: string, context: IRichTextContext) => string): { calls: IRichTextContext[] } {
  const calls: IRichTextContext[] = [];
  const provider: IRichTextProvider = {
    defaultFormat: "markdown",
    toHtml: (source, context) => {
      calls.push(context);
      if (toHtml) return toHtml(source, context);
      return source.indexOf("*") < 0 ? "" : "<b>" + source + "</b>";
    },
    toSource: () => "",
    getEditMode: () => "none",
    isLossless: () => true,
    attachEditor: () => ({ toolbar: <any>undefined, getSource: () => "", detach: () => {} })
  };
  settings.richText = provider;
  return { calls };
}

describe("settings.richText rendering", () => {
  afterEach(() => {
    settings.richText = undefined;
  });

  test("no provider and no handler leaves titles as plain text", () => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q", title: "**bold**" }] });
    const question = survey.getQuestionByName("q");
    expect(question.locTitle.hasHtml).toBe(false);
    expect(question.locTitle.renderedHtml).toBe("**bold**");
  });

  test("an existing handler wins when no provider is set", () => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q", title: "**bold**" }] });
    survey.onTextMarkdown.add((_sender, options) => {
      options.html = "[handler] " + options.text;
    });
    expect(survey.getQuestionByName("q").locTitle.renderedHtml).toBe("[handler] **bold**");
  });

  test("a provider with stringFormat plain does not render, and a handler still wins", () => {
    const installed = installProvider();
    const survey = new SurveyModel({
      stringFormat: "plain",
      elements: [{ type: "text", name: "q", title: "**bold**" }]
    });
    const question = survey.getQuestionByName("q");
    expect(question.locTitle.renderedHtml).toBe("**bold**");
    expect(installed.calls.length).toBe(0);
    survey.onTextMarkdown.add((_sender, options) => {
      expect(options.html).toBeNull();
      options.html = "[handler] " + options.text;
    });
    expect(question.locTitle.renderedHtml).toBe("[handler] **bold**");
    expect(installed.calls.length).toBe(0);
  });

  test("a provider renders markdown titles when there is no handler", () => {
    installProvider();
    const survey = new SurveyModel({
      stringFormat: "markdown",
      elements: [{ type: "text", name: "q", title: "Please **read**" }]
    });
    const question = survey.getQuestionByName("q");
    expect(question.locTitle.hasHtml).toBe(true);
    expect(question.locTitle.renderedHtml).toBe("<b>Please **read**</b>");
  });

  test("plain text from the provider keeps the plain rendering path", () => {
    installProvider();
    const survey = new SurveyModel({
      stringFormat: "markdown",
      elements: [{ type: "text", name: "q", title: "Plain title" }]
    });
    const question = survey.getQuestionByName("q");
    expect(question.locTitle.hasHtml).toBe(false);
    expect(question.locTitle.renderedHtml).toBe("Plain title");
  });

  test("a handler that assigns options.html wins over the provider", () => {
    installProvider();
    const survey = new SurveyModel({
      stringFormat: "markdown",
      elements: [{ type: "text", name: "q", title: "**bold**" }]
    });
    survey.onTextMarkdown.add((_sender, options) => {
      options.html = "[handler] " + options.text;
    });
    expect(survey.getQuestionByName("q").locTitle.renderedHtml).toBe("[handler] **bold**");
  });

  test("a conditional handler covers its strings and the provider covers the rest", () => {
    installProvider();
    const survey = new SurveyModel({
      stringFormat: "markdown",
      elements: [{
        type: "text",
        name: "q",
        title: "**title**",
        description: "**description**"
      }]
    });
    survey.onTextMarkdown.add((_sender, options) => {
      if (options.name === "title") options.html = "[handler] " + options.text;
    });
    const question = survey.getQuestionByName("q");
    expect(question.locTitle.renderedHtml).toBe("[handler] **title**");
    expect(question.locDescription.renderedHtml).toBe("<b>**description**</b>");
  });

  test("a handler can post-process the provider html", () => {
    installProvider();
    const survey = new SurveyModel({
      stringFormat: "markdown",
      elements: [{ type: "text", name: "q", title: "**bold**" }]
    });
    survey.onTextMarkdown.add((_sender, options) => {
      options.html = "[post] " + options.html;
    });
    expect(survey.getQuestionByName("q").locTitle.renderedHtml).toBe("[post] <b>**bold**</b>");
  });

  test("stringFormat html is passed to the provider", () => {
    const installed = installProvider((_source, context) => "<i>" + context.format + "</i>");
    const survey = new SurveyModel({
      stringFormat: "html",
      elements: [{ type: "text", name: "q", title: "<b>x</b>" }]
    });
    expect(survey.getQuestionByName("q").locTitle.renderedHtml).toBe("<i>html</i>");
    expect(installed.calls[0].format).toBe("html");
    expect(installed.calls[0].name).toBe("title");
  });

  test("strings without markdown are not converted", () => {
    const installed = installProvider();
    const survey = new SurveyModel({
      stringFormat: "markdown",
      elements: [{ type: "text", name: "q", isRequired: true, requiredErrorText: "**required**" }]
    });
    const question = <Question>survey.getQuestionByName("q");
    expect(question.locRequiredErrorText.hasHtml).toBe(false);
    expect(question.locRequiredErrorText.renderedHtml).toBe("**required**");
    expect(installed.calls.length).toBe(0);
  });

  test("adding a handler and changing stringFormat drop the cached html", () => {
    installProvider();
    const survey = new SurveyModel({
      stringFormat: "markdown",
      elements: [{ type: "text", name: "q", title: "**bold**" }]
    });
    const title = survey.getQuestionByName("q").locTitle;
    expect(title.renderedHtml).toBe("<b>**bold**</b>");
    const handler = (_sender: SurveyModel, options: any) => {
      options.html = "handled";
    };
    survey.onTextMarkdown.add(handler);
    expect(title.renderedHtml).toBe("handled");
    survey.onTextMarkdown.remove(handler);
    expect(title.renderedHtml).toBe("<b>**bold**</b>");
    survey.stringFormat = "plain";
    expect(title.hasHtml).toBe(false);
    expect(title.renderedHtml).toBe("**bold**");
    survey.stringFormat = "markdown";
    expect(title.renderedHtml).toBe("<b>**bold**</b>");
  });
});
