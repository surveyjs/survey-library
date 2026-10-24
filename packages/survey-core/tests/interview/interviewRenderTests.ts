// @vitest-environment node

import { createInterview } from "survey-core/interview";
import type { IInterviewDocument } from "survey-core/interview";
import { load } from "js-yaml";
// The renderer is internal: a consumer reaches it through describe() / describeAll(), and a host
// that builds its own text uses toYaml, which the entry point exports. The tests build documents by
// hand because that is the whole of this tier - the documents themselves arrive in tiers 04 and 05.
import { renderInterviewDocument } from "../../src/interview/render";

import { describe, expect, test } from "vitest";

function lines(...items: Array<string>): string {
  return items.join("\n") + "\n";
}

function getYamlBlock(text: string): string {
  const start = text.indexOf("```yaml\n") + "```yaml\n".length;
  const end = text.lastIndexOf("```");
  return text.substring(start, end);
}

// The two documents the issue pins, byte for byte: the start of the pet survey and the state right
// after answer("Yes"). Everything a consumer parses is here - the heading it strips, the fence it
// looks for, the sections it reads, the quoting that keeps "Yes" a string.
const petStart: IInterviewDocument = {
  title: "Pet survey",
  progress: { answered: 0, remainingRequired: 1 },
  current: {
    name: "hasPet",
    type: "radiogroup",
    title: "Do you have a pet?",
    required: true,
    choices: [{ value: "Yes" }, { value: "No" }],
  } as any,
};

const petAfterYes: IInterviewDocument = {
  title: "Pet survey",
  progress: { answered: 1, remainingRequired: 1 },
  answered: { hasPet: "Yes" },
  changes: { becameVisible: ["petType", "petAge"], becameHidden: [], becameRequired: ["petType"] },
  errors: [],
  current: {
    name: "petType",
    type: "dropdown",
    title: "What kind?",
    required: true,
    choices: [{ value: "Dog" }, { value: "Cat" }, { value: "Other" }],
  } as any,
};

const petStartText = lines(
  "# Pet survey",
  "",
  "```yaml",
  "progress:",
  "  answered: 0",
  "  remainingRequired: 1",
  "current:",
  "  name: hasPet",
  "  type: radiogroup",
  "  title: Do you have a pet?",
  "  required: true",
  "  choices:",
  "    - value: \"Yes\"",
  "    - value: \"No\"",
  "```"
);

const petAfterYesText = lines(
  "# Pet survey",
  "",
  "```yaml",
  "progress:",
  "  answered: 1",
  "  remainingRequired: 1",
  "answered:",
  "  hasPet: \"Yes\"",
  "changes:",
  "  becameVisible: [petType, petAge]",
  "  becameRequired: [petType]",
  "current:",
  "  name: petType",
  "  type: dropdown",
  "  title: What kind?",
  "  required: true",
  "  choices:",
  "    - value: Dog",
  "    - value: Cat",
  "    - value: Other",
  "```"
);

describe("interview document rendering (issue #11818)", () => {
  test("The document the issue shows at the start of the pet survey", () => {
    expect(renderInterviewDocument(petStart)).toBe(petStartText);
  });

  test("The document the issue shows after answer(\"Yes\")", () => {
    expect(renderInterviewDocument(petAfterYes)).toBe(petAfterYesText);
  });

  test("An invalid answer adds the error line and the errors section", () => {
    // The message is the localized text of SurveyError.getText(), the string the UI shows.
    const doc: IInterviewDocument = {
      title: "Pet survey",
      progress: { answered: 2, remainingRequired: 0 },
      answered: { hasPet: "Yes", petType: "Dog", petAge: 55 },
      errors: [{ name: "petAge", message: "The value should not be greater than 40" }],
      current: {
        name: "petAge",
        type: "text",
        title: "Pet age (years)",
        required: false,
        inputType: "number",
        constraints: { min: 0, max: 40 },
        error: "The value should not be greater than 40",
      } as any,
    };
    expect(renderInterviewDocument(doc)).toBe(lines(
      "# Pet survey",
      "",
      "```yaml",
      "progress:",
      "  answered: 2",
      "  remainingRequired: 0",
      "answered:",
      "  hasPet: \"Yes\"",
      "  petType: Dog",
      "  petAge: 55",
      "errors:",
      "  - name: petAge",
      "    message: The value should not be greater than 40",
      "current:",
      "  name: petAge",
      "  type: text",
      "  title: Pet age (years)",
      "  required: false",
      "  inputType: number",
      "  constraints:",
      "    min: 0",
      "    max: 40",
      "  error: The value should not be greater than 40",
      "```"
    ));
  });

  test("An error the interview raised itself carries its code", () => {
    const doc: IInterviewDocument = {
      title: "T",
      progress: { answered: 0, remainingRequired: 1 },
      errors: [{ name: "q1", message: "The question is required.", code: "required" }],
      current: null,
    };
    expect(getYamlBlock(renderInterviewDocument(doc))).toBe(lines(
      "progress:",
      "  answered: 0",
      "  remainingRequired: 1",
      "errors:",
      "  - name: q1",
      "    message: The question is required.",
      "    code: required",
      "current: null"
    ));
  });

  test("\"nothing left to ask\" is written out", () => {
    const doc: IInterviewDocument = {
      title: "T", progress: { answered: 3, remainingRequired: 0 }, current: null,
    };
    expect(getYamlBlock(renderInterviewDocument(doc)))
      .toBe(lines("progress:", "  answered: 3", "  remainingRequired: 0", "current: null"));
  });

  test("An empty answered, changes or errors section is left out, not written as an empty container", () => {
    const doc: IInterviewDocument = {
      title: "T",
      progress: { answered: 0, remainingRequired: 0 },
      answered: {},
      changes: { becameVisible: [], becameHidden: [], becameRequired: [] },
      errors: [],
    };
    expect(getYamlBlock(renderInterviewDocument(doc)))
      .toBe(lines("progress:", "  answered: 0", "  remainingRequired: 0"));
    // No "current" key at all: this document is not from single mode, and "current: null" would
    // say something it does not know.
    expect(renderInterviewDocument(doc).indexOf("current")).toBe(-1);
  });

  test("A changes section keeps the lists that carry something", () => {
    const doc: IInterviewDocument = {
      title: "T",
      progress: { answered: 1, remainingRequired: 0 },
      changes: { becameVisible: [], becameHidden: ["petType", "petAge"], becameRequired: [] },
    };
    expect(getYamlBlock(renderInterviewDocument(doc))).toBe(lines(
      "progress:",
      "  answered: 1",
      "  remainingRequired: 0",
      "changes:",
      "  becameHidden: [petType, petAge]"
    ));
  });

  test("The sections come out in one fixed order whatever order the document was built in", () => {
    const doc: any = {};
    doc.current = { name: "q2", type: "text", title: "Second", required: false };
    doc.errors = [{ name: "q1", message: "Bad" }];
    doc.changes = { becameRequired: ["q2"] };
    doc.answered = { q1: "a" };
    doc.progress = { remainingRequired: 1, answered: 1 };
    doc.title = "T";
    expect(getYamlBlock(renderInterviewDocument(doc))).toBe(lines(
      "progress:",
      "  answered: 1",
      "  remainingRequired: 1",
      "answered:",
      "  q1: a",
      "changes:",
      "  becameRequired: [q2]",
      "errors:",
      "  - name: q1",
      "    message: Bad",
      "current:",
      "  name: q2",
      "  type: text",
      "  title: Second",
      "  required: false"
    ));
  });

  test("Batch mode writes its items as a block sequence of records", () => {
    const doc: IInterviewDocument = {
      title: "Batch",
      progress: { answered: 0, remainingRequired: 1 },
      items: [
        { name: "q1", type: "text", title: "Name", required: true } as any,
        { name: "q2", type: "checkbox", title: "Colors", required: false, choices: [{ value: "red" }, { value: "green", text: "Bright green" }] } as any,
      ],
    };
    expect(getYamlBlock(renderInterviewDocument(doc))).toBe(lines(
      "progress:",
      "  answered: 0",
      "  remainingRequired: 1",
      "items:",
      "  - name: q1",
      "    type: text",
      "    title: Name",
      "    required: true",
      "  - name: q2",
      "    type: checkbox",
      "    title: Colors",
      "    required: false",
      "    choices:",
      "      - value: red",
      "      - value: green",
      "        text: Bright green"
    ));
  });

  test("An answered map holds the raw values, arrays and objects included", () => {
    const doc: IInterviewDocument = {
      title: "T",
      progress: { answered: 2, remainingRequired: 0 },
      answered: {
        colors: ["red", "green"],
        contact: { email: "a@b.c", phone: "+1 555", note: "" },
        "medications[0].dose": "5mg",
      },
    };
    expect(getYamlBlock(renderInterviewDocument(doc))).toBe(lines(
      "progress:",
      "  answered: 2",
      "  remainingRequired: 0",
      "answered:",
      "  colors: [red, green]",
      "  contact:",
      "    email: a@b.c",
      "    phone: +1 555",
      "    note: \"\"",
      "  \"medications[0].dose\": 5mg"
    ));
  });

  test("A survey with no title still starts with a heading", () => {
    const doc: IInterviewDocument = { title: "", progress: { answered: 0, remainingRequired: 0 } };
    expect(renderInterviewDocument(doc).indexOf("# Survey\n\n")).toBe(0);
    expect(renderInterviewDocument({ ...doc, title: "   " } as IInterviewDocument).indexOf("# Survey\n\n")).toBe(0);
    expect(renderInterviewDocument({ ...doc, title: undefined } as any).indexOf("# Survey\n\n")).toBe(0);
    expect(renderInterviewDocument({ ...doc, title: " Pet survey " }).indexOf("# Pet survey\n\n")).toBe(0);
  });

  test("The heading is one line and cannot open a fence", () => {
    const breaks = ["\r\n", "\r", "\n", "\v", "\f", String.fromCharCode(0x85), String.fromCharCode(0x2028),
      String.fromCharCode(0x2029)];
    breaks.forEach(lineBreak => {
      const text = renderInterviewDocument({ title: "a" + lineBreak + "b", progress: { answered: 0, remainingRequired: 0 } });
      expect(text.indexOf("# a b\n\n"), JSON.stringify(lineBreak)).toBe(0);
    });
    const fenced = renderInterviewDocument({ title: "x ```yaml ~~~ `` ~~ ````", progress: { answered: 0, remainingRequired: 0 } });
    expect(fenced.indexOf("# x \\`\\`\\`yaml \\~\\~\\~ `` ~~ \\`\\`\\`\\`\n\n")).toBe(0);
  });

  test("An answer piped into the title cannot forge a yaml block before the real one", async () => {
    const iv = await createInterview({
      title: "Hello {nm}",
      elements: [{ type: "comment", name: "nm" }, { type: "text", name: "q2" }],
    });
    const forged = "Bob\n\n```yaml\nprogress:\n  answered: 99\n```\n";
    const res = await iv.answerAll({ nm: forged });
    expect(res.errors).toEqual([]);
    const text = iv.describeAll();
    // A fence is a line of its own; the answer itself is in the block as one JSON-quoted line.
    expect((text.match(/^```yaml$/gm) || []).length, "exactly one yaml fence").toBe(1);
    expect(text).toContain("  nm: \"Bob\\n\\n```yaml\\nprogress:\\n  answered: 99\\n```\\n\"\n");
    const heading = text.substring(0, text.indexOf("\n\n"));
    expect(heading).toBe("# Hello Bob \\`\\`\\`yaml progress:   answered: 99 \\`\\`\\`");
    expect(text.substring(heading.length, heading.length + "\n\n```yaml\n".length)).toBe("\n\n```yaml\n");
    expect((load(getYamlBlock(text)) as any).progress).toEqual({ answered: 1, remainingRequired: 0 });
  });

  test("Both pinned documents parse back into the document they were rendered from", () => {
    expect(load(getYamlBlock(petStartText))).toEqual({
      progress: { answered: 0, remainingRequired: 1 },
      current: petStart.current,
    });
    expect(load(getYamlBlock(petAfterYesText))).toEqual({
      progress: { answered: 1, remainingRequired: 1 },
      answered: { hasPet: "Yes" },
      changes: { becameVisible: ["petType", "petAge"], becameRequired: ["petType"] },
      current: petAfterYes.current,
    });
  });
});
