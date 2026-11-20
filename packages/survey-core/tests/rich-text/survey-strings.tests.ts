import { describe, expect, test } from "vitest";
import { LocalizableString } from "../../src/localizablestring";
import { PageModel } from "../../src/page";
import { PanelModel } from "../../src/panel";
import { Serializer } from "../../src/jsonobject";
import { QuestionTextModel } from "../../src/question_text";
import { SurveyModel } from "../../src/survey";
import { RichText } from "../../src/plugins/rich-text/index";

const stringsJson = {
  title: "Rich text <strong>demo</strong>",
  description: "<p>Survey description with <em>italic</em> text.</p><p>Second paragraph.</p>",
  elements: [
    {
      type: "text", name: "s1",
      title: "Title with <em>italic</em>, <strong>bold</strong>, <s>strike</s> and <a href=\"https://surveyjs.io\">a link</a>",
      description: "<p>Line one<br>Line two</p><ul><li>item one</li><li>item two</li></ul>"
    },
    {
      type: "radiogroup", name: "s2", title: "Plain title",
      choices: [
        { value: "bold", text: "<strong>Bold</strong> choice" },
        { value: "plain", text: "Plain choice" },
        { value: "markdown", text: "Markdown **is not** rendered" },
        { value: "tom", text: "Tom & Jerry" }
      ]
    },
    { type: "text", name: "s3", title: "Raw <b>html</b> and <script>alert(1)</script>" },
    { type: "text", name: "s4", title: "<a href=\"javascript:alert(1)\">js link</a>" },
    { type: "text", name: "s5", title: "Table", description: "<table><tr><td>a</td><td>b</td></tr><tr><td>1</td><td>2</td></tr></table>" },
    { type: "text", name: "s6", title: "<ul><li>a list</li><li>in a title</li></ul>" },
    { type: "text", name: "s7", title: "Styled string", description: "<p style=\"color:red\">Red</p><table><tr><td>cell</td></tr></table>" },
    { type: "text", name: "s8", title: "Plain multi-line description", description: "Plain line one\nPlain line two" }
  ]
};

function htmlOf(loc: LocalizableString): string {
  return loc.hasHtml ? loc.html : loc.renderedHtml;
}

// The same opt-in the creator example uses. Question description stays "text".
function withRichTypes(run: () => void): void {
  const questionTitle = Serializer.findProperty("question", "title");
  const surveyDescription = Serializer.findProperty("survey", "description");
  const pageDescription = Serializer.findProperty("page", "description");
  const choiceText = Serializer.findProperty("itemvalue", "text");
  const previous = [questionTitle.type, surveyDescription.type, pageDescription.type, choiceText.type];
  questionTitle.type = "inlinehtml";
  surveyDescription.type = "html";
  pageDescription.type = "html";
  choiceText.type = "inlinehtml";
  try {
    run();
  } finally {
    questionTitle.type = previous[0];
    surveyDescription.type = previous[1];
    pageDescription.type = previous[2];
    choiceText.type = previous[3];
  }
}

describe("survey strings", () => {
  test("loading the plugin does not render strings as HTML", () => {
    const survey = new SurveyModel(stringsJson);
    const title = survey.getQuestionByName("s1").locTitle;
    expect(title.hasHtml).toBe(false);
    expect(title.renderedHtml).toContain("<em>italic</em>");
    expect(RichText.renderStringHandler).toBeTypeOf("function");
  });

  test("the built-in handler renders html as a block and inlinehtml as one line", () => {
    withRichTypes(() => {
      const survey = new SurveyModel(stringsJson);
      survey.onTextMarkdown.add(RichText.renderStringHandler);

      expect(survey.locTitle.hasHtml).toBe(false);
      expect(survey.locTitle.renderedHtml).toContain("<strong>demo</strong>");
      expect(survey.locDescription.html).toBe("<p>Survey description with <em>italic</em> text.</p><p>Second paragraph.</p>");

      const s1 = survey.getQuestionByName("s1");
      expect(s1.locTitle.html).toContain("<strong>bold</strong>");
      expect(s1.locTitle.html).toContain("target=\"_blank\"");
      expect(s1.locTitle.html).toContain("rel=\"noopener noreferrer\"");
      expect(s1.locDescription.hasHtml).toBe(false);
      expect(s1.locDescription.renderedHtml).toContain("<ul>");

      const s6 = survey.getQuestionByName("s6");
      expect(s6.locTitle.html).toBe("a list<br>in a title");

      const s2 = survey.getQuestionByName("s2") as any;
      expect(s2.choices[0].value).toBe("bold");
      expect(s2.choices[0].locText.html).toBe("<strong>Bold</strong> choice");
      expect(s2.choices[2].locText.hasHtml).toBe(false);
      expect(s2.choices[2].locText.renderedHtml).toBe("Markdown **is not** rendered");
      expect(s2.choices[3].locText.hasHtml).toBe(false);
      expect(s2.choices[3].locText.renderedHtml).toBe("Tom & Jerry");
    });
  });

  test("plain text and a plain multi-line description", () => {
    const survey = new SurveyModel(stringsJson);
    const s8 = survey.getQuestionByName("s8");
    expect(s8.locDescription.hasHtml).toBe(false);
    expect(s8.locDescription.renderedHtml).toBe("Plain line one\nPlain line two");

    survey.onTextMarkdown.add(RichText.renderStringHandler);
    survey.locStrsChanged();
    expect(s8.locDescription.hasHtml).toBe(false);
    expect(s8.locDescription.renderedHtml).toBe("Plain line one\nPlain line two");
    expect(survey.getQuestionByName("s2").locTitle.hasHtml).toBe(false);
    expect(htmlOf(survey.getQuestionByName("s2").locTitle)).toBe("Plain title");
  });

  test("removing the handler restores the plain path", () => {
    withRichTypes(() => {
      const survey = new SurveyModel(stringsJson);
      survey.onTextMarkdown.add(RichText.renderStringHandler);
      expect(survey.getQuestionByName("s6").locTitle.hasHtml).toBe(true);
      survey.onTextMarkdown.remove(RichText.renderStringHandler);
      survey.locStrsChanged();
      const title = survey.getQuestionByName("s6").locTitle;
      expect(title.hasHtml).toBe(false);
      expect(title.renderedHtml).toContain("<ul>");
    });
  });

  test("disallowed markup is dropped on display and does not run", () => {
    withRichTypes(() => {
      const survey = new SurveyModel(stringsJson);
      survey.onTextMarkdown.add(RichText.renderStringHandler);
      const s3 = survey.getQuestionByName("s3").locTitle.html;
      expect(s3).toBe("Raw <strong>html</strong> and");
      expect(s3).not.toContain("script");
      expect(survey.getQuestionByName("s4").locTitle.html).toBe("js link");
      expect(survey.getQuestionByName("s5").locDescription.hasHtml).toBe(false);

      survey.description = "<table><tr><td>a</td><td>b</td></tr><tr><td>1</td><td>2</td></tr></table>";
      expect(survey.locDescription.html).toBe("<p>a</p><p>b</p><p>1</p><p>2</p>");
      survey.description = "<p style=\"color:red\">Red</p><table><tr><td>cell</td></tr></table>";
      const styled = survey.locDescription.html;
      expect(styled).not.toContain("style");
      expect(styled).not.toContain("color");
      expect(styled).toContain("Red");
      expect(styled).toContain("cell");
    });
  });

  test("a customer can sanitize some strings and pass the rest through", () => {
    withRichTypes(() => {
      const survey = new SurveyModel(stringsJson);
      survey.onTextMarkdown.add((sender, options) => {
        if (options.name === "title") options.html = "[handler] " + RichText.sanitizeHtml(options.text, { inline: true });
        else RichText.renderStringHandler(sender, options);
      });
      const s1 = survey.getQuestionByName("s1");
      expect(s1.locTitle.html.indexOf("[handler] ")).toBe(0);
      expect(s1.locTitle.html).toContain("<strong>bold</strong>");
      expect(s1.locDescription.hasHtml).toBe(false);
      expect(s1.locDescription.renderedHtml).toContain("<ul>");
    });
  });

  test("a pass-through handler is left alone", () => {
    const survey = new SurveyModel(stringsJson);
    survey.onTextMarkdown.add((sender, options) => {
      options.html = options.text;
    });
    const description = survey.getQuestionByName("s7").locDescription.html;
    expect(description).toContain("color:red");
    expect(description).toContain("<table>");
  });

  test("a string that does not use markdown is untouched", () => {
    const survey = new SurveyModel({
      elements: [{ type: "text", name: "q", isRequired: true, requiredErrorText: "<b>need</b> this" }]
    });
    survey.onTextMarkdown.add(RichText.renderStringHandler);
    const question = survey.getQuestionByName("q");
    expect(question.locRequiredErrorText.useMarkdown).toBeFalsy();
    expect(question.locRequiredErrorText.hasHtml).toBe(false);
    expect(question.locRequiredErrorText.renderedHtml).toBe("<b>need</b> this");
  });

  test("the facade has none of the removed converter names", () => {
    const names = [
      "textMarkdownHandler", "htmlToMarkdownHandler", "valueToHtml", "htmlToValue",
      "markdownToHtml", "htmlToMarkdown", "isLossless", "getUnsupportedMarkdown", "registerFormat", "getFormat"
    ];
    for (let i = 0; i < names.length; i++) {
      expect((RichText as any)[names[i]], names[i]).toBeUndefined();
    }
  });
});

describe("edit mode follows the serializer type", () => {
  test("html stays a block and inlinehtml flattens it, text stays plain", () => {
    withRichTypes(() => {
      const question = new QuestionTextModel("q");
      question.title = "<div>one</div><div>two</div>";
      const survey = new SurveyModel();
      survey.addNewPage("p");
      survey.pages[0].addElement(question);
      survey.onTextMarkdown.add(RichText.renderStringHandler);
      expect(question.locTitle.html).toBe("one<br>two");

      survey.description = "<div>one</div><div>two</div>";
      expect(survey.locDescription.html).toBe("<p>one</p><p>two</p>");
      expect(survey.locTitle.hasHtml).toBe(false);

      const page = new PageModel("page");
      expect(RichText.getStringEditMode(page, "description", page.locDescription)).toBe("block");
      expect(RichText.getStringEditMode(page, "title", page.locTitle)).toBe("none");
      const panel = new PanelModel("panel");
      expect(RichText.getStringEditMode(panel, "description", panel.locDescription)).toBe("none");
      expect(Serializer.findProperty("comment", "allowRichText")).toBeFalsy();
    });
  });
});
