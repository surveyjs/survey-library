// @vitest-environment node
// The records the documents are rendered from are plain data, and this file is what says so. A host
// that wants a JSON representation next to the YAML one gets it for free -
// JSON.stringify(interview.current()) - and that only holds while nothing on the way to a record is
// a live model object, a function or a cycle. Both halves are pinned here: the round trip, which is
// what a host does, and a walk that names any leaf JSON cannot carry as itself.
import { createInterview } from "survey-core/interview";
import type { IInterviewItem } from "survey-core/interview";
import { ComponentCollection, SurveyModel } from "survey-core";
import { load } from "js-yaml";

import { afterEach, describe, expect, test } from "vitest";

function roundTrip(value: any): any {
  return JSON.parse(JSON.stringify(value));
}

// Every leaf that is not a JSON scalar, a plain object or an array, plus functions and cycles. A
// value that appears twice is not a cycle - JSON.stringify writes it twice and parses it back as two
// - so the ancestors are tracked and not everything already seen.
function findAlien(value: any, path?: string, ancestors?: Array<any>): Array<string> {
  const at = path || "$";
  const stack = ancestors || [];
  if (value === null || value === undefined) return [];
  const type = typeof value;
  if (type === "string" || type === "number" || type === "boolean") return [];
  if (type !== "object") return [at + ": " + type];
  if (stack.indexOf(value) >= 0) return [at + ": circular"];
  const next = stack.concat([value]);
  if (Array.isArray(value)) {
    let res: Array<string> = [];
    value.forEach((item, index) => { res = res.concat(findAlien(item, at + "[" + index + "]", next)); });
    return res;
  }
  const owner = !!value.constructor ? value.constructor.name : "";
  if (owner !== "Object") return [at + ": " + (owner || "no prototype")];
  let res: Array<string> = [];
  Object.keys(value).forEach(key => { res = res.concat(findAlien(value[key], at + "." + key, next)); });
  return res;
}

// The document a call rendered, read back with a real parser. The heading is Markdown and the block
// is the document; the interview never writes anything else.
function yamlBody(document: string): any {
  const open = "```yaml\n";
  const start = document.indexOf(open) + open.length;
  return load(document.substring(start, document.lastIndexOf("```")));
}

// The one key of a record the renderer leaves out: it is API, not text (README, "Document format").
// Everything else has to match, at every level a container nests.
function stripValueType(record: any): any {
  if (Array.isArray(record)) return record.map(stripValueType);
  if (!record || typeof record !== "object") return record;
  const res: any = {};
  Object.keys(record).forEach(key => {
    if (key === "valueType") return;
    res[key] = stripValueType(record[key]);
  });
  return res;
}

// The document as the fenced block carries it: JSON, minus the internal key, minus the title - which
// is the Markdown heading above the block and not a key of it.
function renderedBody(document: any): any {
  const res = stripValueType(roundTrip(document));
  delete res.title;
  return res;
}

function headingOf(text: string): string {
  return text.substring(0, text.indexOf("\n"));
}

function expectIsJson(value: any): void {
  expect(findAlien(value), "a record must hold nothing but plain data").toEqual([]);
  expect(roundTrip(value), "and must survive a round trip unchanged").toEqual(value);
}

const richJson = {
  title: "Everything",
  elements: [
    { type: "dropdown", name: "petType", title: "What kind?", description: "Pick one",
      isRequired: true, choices: ["Dog", "Cat"], showOtherItem: true },
    { type: "text", name: "petAge", title: "Age", inputType: "number", min: 0, max: 40 },
    { type: "rating", name: "score", title: "Score", rateMin: 1, rateMax: 3,
      minRateDescription: "Bad", maxRateDescription: "Good" },
    { type: "text", name: "born", title: "Born", inputType: "date", min: "2020-01-01" },
    { type: "text", name: "phone", title: "Phone", maskType: "pattern",
      maskSettings: { pattern: "+9 (999) 999" } },
    { type: "checkbox", name: "pets", title: "Pets", choices: ["Dog", "Cat"], maxSelectedChoices: 2 },
    { type: "file", name: "photo", title: "Photo" },
  ],
};

const customComponents: Array<string> = [];
afterEach(() => {
  while(customComponents.length > 0) {
    ComponentCollection.Instance.remove(customComponents.pop());
  }
});

describe("interview records as JSON (issue #11818)", () => {
  test("Every item a single-mode conversation hands out is JSON already", async () => {
    const iv = await createInterview(richJson);
    const answers: Array<Array<any>> = [
      ["petType", { value: "other", comment: "Ferret" }],
      ["petAge", 4],
      ["score", 2],
      ["born", "2024-01-02"],
      ["phone", "+1 (234) 567"],
      ["pets", ["Dog"]],
    ];
    const seen: Array<IInterviewItem> = [];
    for (let i = 0; i < answers.length; i++) {
      const current = iv.current();
      if (!!current) seen.push(current);
      const result = await iv.answer(answers[i][0], answers[i][1]);
      if (!!result.current) seen.push(result.current);
    }
    // choices with "other", a comment, rateValues with their descriptions, an input type, numeric
    // bounds, a mask and an array with a maximum: every shape the record can take.
    expect(seen.length).toBeGreaterThan(answers.length);
    seen.forEach(item => expectIsJson(item));
    expect(seen.some(item => !!item.choices && item.choices.some(choice => choice.other === true))).toBe(true);
    expect(seen.some(item => !!item.rateValues && !!item.minRateDescription)).toBe(true);
    expect(seen.some(item => !!item.constraints && !!item.constraints.mask)).toBe(true);
  });

  test("A summary step is JSON already, entries and all", async () => {
    const iv = await createInterview({
      elements: [{ type: "paneldynamic", name: "meds", title: "Medications",
        templateElements: [{ type: "text", name: "dose" }] }],
    });
    // An empty container: the "no entries" line and the add caption.
    expectIsJson(iv.current());
    expect(iv.current().summary.canAdd).toBe(true);
    await iv.answer({ action: "add" });
    const result = await iv.answer("10mg");
    // A container with an entry: the list with its index, title and remove flag.
    expect(result.current.summary.entries.length).toBe(1);
    expectIsJson(result.current);
  });

  test("A batch container item is JSON already, with its fields and its rows", async () => {
    ComponentCollection.Instance.add(<any>{
      name: "addressc",
      elementsJSON: [{ type: "text", name: "street", title: "Street" }],
    });
    customComponents.push("addressc");
    const iv = await createInterview({
      elements: [
        { type: "multipletext", name: "contact", title: "Contact",
          items: [{ name: "email", title: "Email", inputType: "email" }, { name: "when", inputType: "date" }] },
        { type: "matrixdropdown", name: "matrix", title: "Matrix",
          columns: [{ name: "column1", cellType: "dropdown", choices: ["low", "high"] }],
          rows: [{ value: "row1", text: "First row" }] },
        { type: "matrix", name: "grid", rows: ["price"], columns: ["bad", "good"] },
        { type: "addressc", name: "address" },
      ],
    });
    // A bad address, so the container stays listed and carries a value and an error on its field.
    const result = await iv.answerAll({ contact: { email: "nope" } });
    expect(yamlBody(result.describe).items.length).toBe(4);
    expectIsJson(result.current);
    expect(result.current.fields[0].value).toBe("nope");
    expect(typeof result.current.fields[0].error).toBe("string");

    // A date field: the model normalizes the value to a string, so the record stays JSON even for
    // the one type whose value has a native object form.
    const fixed = await iv.answerAll({ contact: { email: "ann@example.com", when: new Date(Date.UTC(2024, 0, 2)) } });
    // The matrix dropdown is the first writable item now: two levels of records, and both plain.
    expect(fixed.current.name).toBe("matrix");
    expectIsJson(fixed.current);
    expect(fixed.current.rows[0].fields[0].choices.length).toBe(2);
    expect(typeof iv.data.contact.when).toBe("string");
  });

  test("A result, a completion result, the schema and the tool definitions are JSON already", async () => {
    const iv = await createInterview(richJson);
    const result = await iv.answerAll({ petType: "Dog", petAge: 4 });
    expectIsJson(result);
    expectIsJson(iv.getAnswerSchema());
    // Two of the three tools share one inputSchema object. JSON.stringify writes it twice, so the
    // round trip is still exact - it is a shared reference and not a cycle.
    expectIsJson(iv.getTools());
    expectIsJson(iv.getTools({ prefix: "pets_" }));
    const done = await iv.complete();
    expectIsJson(done);
    expect(done.completed).toBe(true);
  });

  test("The JSON of an item and the YAML of the same document carry the same record", async () => {
    const iv = await createInterview(richJson);
    await iv.answer("petType", "Dog");
    // Single mode: the "current" section of the block is the item, minus the one internal key.
    expect(yamlBody(iv.describe()).current).toEqual(stripValueType(roundTrip(iv.current())));

    const batch = await createInterview({
      elements: [
        { type: "multipletext", name: "contact", items: [{ name: "email", inputType: "email" }] },
        { type: "matrixdropdown", name: "matrix", columns: [{ name: "col" }],
          rows: [{ value: "row1", text: "First row" }] },
      ],
    });
    const result = await batch.answerAll({ contact: { email: "nope" } });
    // Batch mode: the first item of the block is the record "current" hands the host, nested fields
    // and rows included. A container is exactly as readable as a plain question.
    expect(yamlBody(result.describe).items[0]).toEqual(stripValueType(roundTrip(result.current)));
    expect(yamlBody(batch.describeAll()).items.length).toBe(2);
  });

  test("The document a host reads and the document the YAML was rendered from are one object", async () => {
    const iv = await createInterview(richJson);
    await iv.answer("petType", "Dog");
    const single = iv.getSingleDocument();
    expectIsJson(single);
    // The text is a pure function of this object, so the two can never disagree: the block is the
    // document minus the key that is API and not text, and the title is the heading above it.
    expect(yamlBody(iv.describe())).toEqual(renderedBody(single));
    expect(headingOf(iv.describe())).toBe("# " + single.title);
    expect(single.current.name).toBe("petAge");
    expect(single.answered).toEqual({ petType: "Dog" });
    expect(single.progress).toEqual({ answered: 1, remainingRequired: 0 });
    // A bare read reports on no call, so it carries neither changes nor errors.
    expect(single.changes).toBe(undefined);
    expect(single.errors).toBe(undefined);

    const batch = iv.getBatchDocument();
    expectIsJson(batch);
    expect(yamlBody(iv.describeAll())).toEqual(renderedBody(batch));
    // Every item as a record, the ones an agent cannot fill included: the file has no other
    // accessor - it is never current, in either mode.
    expect(batch.items.map(item => item.name)).toEqual(["petAge", "score", "born", "phone", "pets", "photo"]);
    expect(batch.items[5].unsupported).toBe(true);
    expect(batch.current).toBe(undefined);
  });

  test("The batch document holds the container records a document renders", async () => {
    const iv = await createInterview({
      elements: [
        { type: "multipletext", name: "contact", items: [{ name: "email", inputType: "email" }] },
        { type: "matrixdropdown", name: "matrix", columns: [{ name: "col" }],
          rows: [{ value: "row1", text: "First row" }] },
        { type: "paneldynamic", name: "meds", templateElements: [{ type: "text", name: "dose" }] },
      ],
    });
    await iv.answerAll({ contact: { email: "nope" } });
    const document = iv.getBatchDocument();
    expectIsJson(document);
    expect(yamlBody(iv.describeAll())).toEqual(renderedBody(document));
    expect(document.items[0].fields[0].error).toBe("Please enter a valid e-mail address.");
    expect(document.items[1].rows[0].name).toBe("row1");
    expect(document.items[2].reason).toBe("batch");
  });

  test("Completion hands back the model's own data, which is the host's and not a record", async () => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "born", inputType: "date" }] });
    // Nothing the interview builds can hold a value JSON has no literal for: the records carry
    // strings, numbers, booleans and plain objects, and a date a question owns is normalized to an
    // ISO string by the model itself. "data" is the one field that is not a record - it is
    // survey.data, the host's own object - so whatever the host assigned is what comes back.
    survey.setValue("born", new Date(Date.UTC(2024, 0, 2)));
    const iv = await createInterview(survey);
    const done = await iv.complete();
    expect(done.completed).toBe(true);
    expect(done.data.born instanceof Date).toBe(true);
    expect(findAlien(done.data)).toEqual(["$.born: Date"]);
    // It still serializes - JSON.stringify writes a Date as its ISO string - it just does not come
    // back as a Date. Everything the interview itself produced is plain.
    expect(roundTrip(done.data).born).toBe("2024-01-02T00:00:00.000Z");
    expect(findAlien(done.errors)).toEqual([]);
    expect(findAlien(done.completedHtml)).toEqual([]);
  });
});
