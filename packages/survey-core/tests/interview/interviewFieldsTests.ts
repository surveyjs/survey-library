// @vitest-environment node
// A container filled as an object is what an agent talks to, and an agent runs on a server: nothing
// here needs a DOM.
import { createInterview, InterviewErrorCodes } from "survey-core/interview";
import type { IInterview } from "survey-core/interview";
import { ComponentCollection, SurveyModel, settings, surveyLocalization } from "survey-core";

import { afterEach, describe, expect, test } from "vitest";

function lines(...text: Array<string>): string {
  return text.join("\n") + "\n";
}

function block(...text: Array<string>): string {
  return lines(...text).trim();
}

const customComponents: Array<string> = [];
afterEach(() => {
  while(customComponents.length > 0) {
    ComponentCollection.Instance.remove(customComponents.pop());
  }
  settings.commentSuffix = "-Comment";
});

function addAddressComponent(): void {
  ComponentCollection.Instance.add(<any>{
    name: "addresscmp",
    elementsJSON: [
      { type: "text", name: "street", title: "Street" },
      { type: "text", name: "city", title: "City" },
    ],
  });
  customComponents.push("addresscmp");
}

// The transcript of the README: a contact multiple text and a satisfaction matrix, driven by the
// loop an integrator writes.
async function runAgentLoop(interview: IInterview, agent: (document: string) => any): Promise<number> {
  let result = await interview.answerAll(agent(interview.describeAll()));
  let previous = "";
  let turns = 1;
  while(result.current) {
    if (result.describe === previous) break;
    previous = result.describe;
    result = await interview.answerAll(agent(result.describe));
    turns++;
    if (turns > 20) throw new Error("the loop did not terminate");
  }
  return turns;
}

describe("interview fixed-shape containers in batch mode (issue #11818)", () => {
  test("A multiple text is one record with its editors as fields", async () => {
    const iv = await createInterview({
      elements: [
        { type: "multipletext", name: "contact", title: "Contact", items: [
          { name: "email", title: "Email", inputType: "email", isRequired: true },
          { name: "phone", title: "Phone" },
        ] },
      ],
    });
    await iv.answerAll({ contact: { email: "ann@example" } });
    expect(iv.describeAll()).toContain(block(
      "  - name: contact",
      "    type: multipletext",
      "    title: Contact",
      "    required: false",
      "    fields:",
      "      - name: email",
      "        type: text",
      "        title: Email",
      "        required: true",
      "        inputType: email",
      "        value: ann@example",
      "        error: Please enter a valid e-mail address.",
      "      - name: phone",
      "        type: text",
      "        title: Phone",
      "        required: false"
    ));
  });

  test("A matrix dropdown is two levels, because its value has two", async () => {
    const iv = await createInterview({
      elements: [
        { type: "matrixdropdown", name: "matrix", title: "Matrix",
          columns: [{ name: "column1", title: "Rating", cellType: "dropdown", choices: ["low", "high"] }],
          rows: [{ value: "row1", text: "First row" }, { value: "row2", text: "Second row" }] },
      ],
    });
    expect(iv.describeAll()).toContain(block(
      "  - name: matrix",
      "    type: matrixdropdown",
      "    title: Matrix",
      "    required: false",
      "    rows:",
      "      - name: row1",
      "        title: First row",
      "        fields:",
      "          - name: column1",
      "            type: dropdown",
      "            title: Rating",
      "            required: false",
      "            choices:",
      "              - value: low",
      "              - value: high",
      "      - name: row2",
      "        title: Second row",
      "        fields:",
      "          - name: column1",
      "            type: dropdown",
      "            title: Rating",
      "            required: false",
      "            choices:",
      "              - value: low",
      "              - value: high"
    ));
  });

  test("A single-choice matrix reports one field per row, the columns as its choices", async () => {
    const iv = await createInterview({
      elements: [
        { type: "matrix", name: "satisfaction", title: "Satisfaction", isAllRowRequired: true,
          rows: [{ value: "price", text: "Price" }], columns: ["bad", "good"] },
        { type: "matrix", name: "multi", cellType: "checkbox", rows: ["r1"], columns: ["c1", "c2"] },
      ],
    });
    const document = iv.describeAll();
    // The fields are flat, because the value of a single-choice matrix is: { row: column }.
    expect(document).toContain(block(
      "    fields:",
      "      - name: price",
      "        type: radiogroup",
      "        title: Price",
      "        required: true",
      "        choices:",
      "          - value: bad",
      "          - value: good"
    ));
    // isAllRowRequired reaches the field as its own "required"; a multi-select matrix synthesizes a
    // checkbox and its value is an array.
    expect(document).toContain(block(
      "      - name: r1",
      "        type: checkbox"
    ));
  });

  test("A composite lists its content questions, and the describer's items is gone from the record", async () => {
    addAddressComponent();
    const iv = await createInterview({
      elements: [{ type: "addresscmp", name: "address", title: "Address" }],
    });
    const document = iv.describeAll();
    expect(document).toContain(block(
      "  - name: address",
      "    type: composite",
      "    title: Address",
      "    required: false",
      "    fields:",
      "      - name: street",
      "        type: text",
      "        title: Street",
      "        required: false",
      "      - name: city",
      "        type: text",
      "        title: City",
      "        required: false"
    ));
    // The one "items:" in the document is the document's own key; the record carries "fields".
    expect(document.split("items:").length - 1,
      "\"fields\" took the place of the describer's \"items\"").toBe(1);
  });

  test("The describer's items is what a single-mode record keeps when nesting is off", async () => {
    const survey = new SurveyModel({
      elements: [
        { type: "multipletext", name: "contact", title: "Contact",
          items: [{ name: "email", title: "Email" }] },
      ],
    });
    // The host folds the container back into one input holding the whole object. Single mode then
    // describes it with the describer's own "items"; batch mode is untouched and still works per
    // field, because it reads the structure and not the mode.
    survey.onCheckSingleInputPerPageMode.add((sender, options) => { options.enabled = false; });
    const iv = await createInterview(survey);
    expect(iv.describe()).toContain(block(
      "  items:",
      "    - name: email"
    ));
    expect(iv.describeAll()).toContain(block(
      "    fields:",
      "      - name: email"
    ));
    const res = await iv.answerAll({ contact: { email: "a@b.c" } });
    expect(res.errors).toEqual([]);
    expect(iv.data).toEqual({ contact: { email: "a@b.c" } });
  });

  test("What the survey hid is not a row and not a field", async () => {
    const iv = await createInterview({
      elements: [
        { type: "text", name: "mode" },
        { type: "matrixdropdown", name: "matrix", rowsVisibleIf: "{item} = 'row1' or {mode} = 'all'",
          columns: [
            { name: "always", title: "Always" },
            { name: "sometimes", title: "Sometimes", visibleIf: "{mode} = 'all'" },
          ],
          rows: ["row1", "row2"] },
      ],
    });
    const document = iv.describeAll();
    expect(document).toContain("      - name: row1");
    expect(document, "rowsVisibleIf hid it").not.toContain("      - name: row2");
    expect(document).toContain("          - name: always");
    expect(document, "a column hidden by visibleIf is not a field").not.toContain("- name: sometimes");
    // A key for either of them names something the survey knows and is not asking for.
    const res = await iv.answerAll({ matrix: { row2: { always: "x" }, row1: { sometimes: "y" } } });
    expect(res.errors.map(error => ({ name: error.name, code: error.code }))).toEqual([
      { name: "matrix.row1.sometimes", code: InterviewErrorCodes.notAskable },
      { name: "matrix.row2", code: InterviewErrorCodes.notAskable },
    ]);
    expect(iv.data).toEqual({});
  });

  test("The detail panel of every row is part of the row, and a container in it is filled", async () => {
    const iv = await createInterview({
      elements: [
        { type: "matrixdropdown", name: "matrix", columns: [{ name: "col", title: "Col" }],
          rows: ["row1"], detailPanelMode: "underRow",
          detailElements: [
            { type: "text", name: "note", title: "Note" },
            { type: "multipletext", name: "inner", items: [{ name: "a" }] },
          ] },
      ],
    });
    // Nothing opened the panel: the interview created it in createInterview, before anything read it.
    const document = iv.describeAll();
    expect(document).toContain("          - name: note");
    // A container inside a container is described where it sits, the way a root container is.
    expect(document).toContain(block(
      "          - name: inner",
      "            type: multipletext",
      "            title: inner",
      "            required: false",
      "            fields:",
      "              - name: a",
      "                type: text",
      "                title: a",
      "                required: false"
    ));
    const res = await iv.answerAll({ matrix: { row1: { note: "seen", inner: { a: "1" } } } });
    expect(res.errors).toEqual([]);
    expect(iv.data).toEqual({ matrix: { row1: { note: "seen", inner: { a: "1" } } } });
  });

  test("A container nested in a composite is described in place and filled", async () => {
    ComponentCollection.Instance.add(<any>{
      name: "nestedcmp",
      elementsJSON: [
        { type: "text", name: "plain", title: "Plain" },
        { type: "paneldynamic", name: "list", panelCount: 0, templateElements: [{ type: "text", name: "x" }] },
      ],
    });
    customComponents.push("nestedcmp");
    const iv = await createInterview({ elements: [{ type: "nestedcmp", name: "cmp" }] });
    const document = iv.describeAll();
    expect(document).toContain(block(
      "      - name: list",
      "        type: paneldynamic",
      "        title: list",
      "        required: false",
      "        template:",
      "          - name: x",
      "            type: text",
      "            title: x",
      "            required: false",
      "        canAdd: true"
    ));
    expect(document.split("reason: batch").length - 1).toBe(0);
    const res = await iv.answerAll({ cmp: { plain: "p", list: [{ x: "1" }, { x: "2" }] } });
    expect(res.errors).toEqual([]);
    expect(iv.data).toEqual({ cmp: { plain: "p", list: [{ x: "1" }, { x: "2" }] } });
    expect(iv.getAnswerSchema().properties.cmp, "answered and valid: nothing left to send").toBeUndefined();
  });

  test("The transcript of the README, through the loop", async () => {
    const iv = await createInterview({
      title: "Feedback",
      elements: [
        { type: "multipletext", name: "contact", title: "Contact",
          items: [{ name: "email", title: "Email", inputType: "email", isRequired: true }] },
        { type: "matrix", name: "satisfaction", title: "Satisfaction", isAllRowRequired: true,
          rows: [{ value: "price", text: "Price" }, { value: "speed", text: "Speed" }],
          columns: ["bad", "good"] },
      ],
    });
    let turn = 0;
    const turns = await runAgentLoop(iv, () => {
      turn++;
      // The first turn sends an invalid address and one of the two rows; the second fixes both.
      return turn === 1
        ? { contact: { email: "ann@" }, satisfaction: { price: "good" } }
        : { contact: { email: "ann@example.com" }, satisfaction: { speed: "bad" } };
    });
    expect(turns).toBe(2);
    expect(iv.describeAll()).toContain("items: []");
    const done = await iv.complete();
    expect(done.completed).toBe(true);
    expect(done.data).toEqual({
      contact: { email: "ann@example.com" },
      satisfaction: { price: "good", speed: "bad" },
    });
  });

  test("A patch writes what it names and leaves the rest alone", async () => {
    const iv = await createInterview({
      elements: [
        { type: "multipletext", name: "contact", items: [{ name: "email" }, { name: "phone" }] },
      ],
    });
    await iv.answerAll({ contact: { email: "a@b.c", phone: "123" } });
    expect((await iv.answerAll({ contact: { email: "x@y.z" } })).errors).toEqual([]);
    expect(iv.data).toEqual({ contact: { email: "x@y.z", phone: "123" } });
    // A field is cleared by sending null for that field, and by nothing else.
    await iv.answerAll({ contact: { phone: null } });
    expect(iv.data).toEqual({ contact: { email: "x@y.z" } });
    await iv.answerAll({ contact: null });
    await iv.answerAll({ contact: {} });
    expect(iv.data, "the interview never clears what it was not told to clear")
      .toEqual({ contact: { email: "x@y.z" } });
  });

  test("The keys of an object are written in field order", async () => {
    ComponentCollection.Instance.add(<any>{
      name: "addresscmp",
      elementsJSON: [
        { type: "text", name: "street", title: "Street" },
        { type: "text", name: "city", title: "City", validators: [
          { type: "expression", expression: "{composite.street} notempty", text: "Street first" },
        ] },
      ],
    });
    customComponents.push("addresscmp");
    const iv = await createInterview({ elements: [{ type: "addresscmp", name: "address" }] });
    // The object carries city first, and street is the earlier field: an expression validator that
    // reads the street sees it, because the keys are written in the container's order and not in the
    // object's.
    const res = await iv.answerAll({ address: { city: "Bonn", street: "Main St 1" } });
    expect(res.errors).toEqual([]);
    expect(iv.data).toEqual({ address: { street: "Main St 1", city: "Bonn" } });
  });

  test("A field an earlier key of the same object revealed is written in the same call", async () => {
    ComponentCollection.Instance.add(<any>{
      name: "addresscmp",
      elementsJSON: [
        { type: "text", name: "country", title: "Country" },
        { type: "text", name: "state", title: "State", visibleIf: "{composite.country} = 'US'" },
      ],
    });
    customComponents.push("addresscmp");
    const iv = await createInterview({ elements: [{ type: "addresscmp", name: "address" }] });
    const res = await iv.answerAll({ address: { country: "US", state: "CA" } });
    expect(res.errors).toEqual([]);
    expect(res.becameVisible).toEqual(["address.state"]);
    expect(iv.data).toEqual({ address: { country: "US", state: "CA" } });
  });

  test("A matrix dropdown is written row by row", async () => {
    const iv = await createInterview({
      elements: [
        { type: "matrixdropdown", name: "matrix",
          columns: [{ name: "column1", cellType: "dropdown", choices: ["low", "high"] }],
          rows: ["row1", "row2"] },
      ],
    });
    const res = await iv.answerAll({ matrix: { row1: { column1: "low" } } });
    expect(res.errors).toEqual([]);
    // The shape the model itself stores: the row, then the column.
    expect(iv.data).toEqual({ matrix: { row1: { column1: "low" } } });
    const bad = await iv.answerAll({ matrix: { row3: { column1: "low" }, row2: "low" } });
    expect(bad.errors.map(error => ({ name: error.name, code: error.code }))).toEqual([
      { name: "matrix.row2", code: InterviewErrorCodes.badRecord },
      { name: "matrix.row3", code: InterviewErrorCodes.unknownQuestion },
    ]);
    expect(iv.data).toEqual({ matrix: { row1: { column1: "low" } } });
  });

  test("A cell is checked against the choices an earlier key of the same batch left it", async () => {
    const json = {
      elements: [
        { type: "matrixdropdown", name: "matrix",
          columns: [
            { name: "column1", cellType: "dropdown", choices: ["low", "high"] },
            { name: "column2", cellType: "dropdown", choices: ["a", "b"],
              choicesVisibleIf: "{row.column1} = 'low' or {item} = 'b'" },
          ],
          rows: ["row1"] },
      ],
    };
    const open = await createInterview(json);
    // column1 is the earlier field, so "low" is written first and "a" is a choice by the time
    // column2 is checked.
    expect((await open.answerAll({ matrix: { row1: { column2: "a", column1: "low" } } })).errors).toEqual([]);
    expect(open.data).toEqual({ matrix: { row1: { column1: "low", column2: "a" } } });

    const closed = await createInterview(json);
    const res = await closed.answerAll({ matrix: { row1: { column1: "high", column2: "a" } } });
    expect(res.errors.length).toBe(1);
    expect(res.errors[0].code).toBe(InterviewErrorCodes.notAChoice);
    expect(res.errors[0].name).toBe("matrix.row1.column2");
    // One bad field skips that field; the rest of the object is written.
    expect(closed.data).toEqual({ matrix: { row1: { column1: "high" } } });
  });

  test("A single-choice matrix takes the column value per row", async () => {
    const iv = await createInterview({
      elements: [
        { type: "matrix", name: "satisfaction", rows: ["price"], columns: ["bad", "good"] },
        { type: "matrix", name: "multi", cellType: "checkbox", rows: ["r1"], columns: ["c1", "c2"] },
      ],
    });
    expect((await iv.answerAll({ satisfaction: { price: "good" } })).errors).toEqual([]);
    expect(iv.data.satisfaction).toEqual({ price: "good" });
    const bad = await iv.answerAll({ satisfaction: { price: "excellent" } });
    expect(bad.errors[0].code).toBe(InterviewErrorCodes.notAChoice);
    expect(bad.errors[0].name).toBe("satisfaction.price");
    expect(iv.data.satisfaction).toEqual({ price: "good" });
    // A row of a multi-select matrix is a checkbox, so a scalar is wrapped, as it is for a root.
    await iv.answerAll({ multi: { r1: "c1" } });
    expect(iv.data.multi).toEqual({ r1: ["c1"] });
  });

  test("A value that is not an object is refused whole, and one bad key is refused alone", async () => {
    addAddressComponent();
    const iv = await createInterview({
      elements: [
        { type: "multipletext", name: "contact", items: [{ name: "email" }, { name: "phone" }] },
        { type: "addresscmp", name: "address" },
      ],
    });
    const res = await iv.answerAll({ contact: "x", address: { fax: "1", street: "Main St 1" } });
    expect(res.errors.map(error => ({ name: error.name, code: error.code }))).toEqual([
      { name: "contact", code: InterviewErrorCodes.badRecord },
      { name: "address.fax", code: InterviewErrorCodes.unknownQuestion },
    ]);
    expect(res.errors[1].message).toContain("\"street\", \"city\"");
    // Nothing of the refused key reached the model; the other key of the same object was written.
    expect(iv.data).toEqual({ address: { street: "Main St 1" } });
    // The comment suffix belongs to a field, never to the container key.
    const comment = await iv.answerAll({ "contact-Comment": "note" });
    expect(comment.errors[0].code).toBe(InterviewErrorCodes.unknownQuestion);
  });

  test("A comment key inside an object writes the comment", async () => {
    ComponentCollection.Instance.add(<any>{
      name: "petcmp",
      elementsJSON: [{ type: "dropdown", name: "pet", choices: ["Dog"], showOtherItem: true }],
    });
    customComponents.push("petcmp");
    const iv = await createInterview({ elements: [{ type: "petcmp", name: "who" }] });
    const res = await iv.answerAll({ who: { pet: "other", "pet-Comment": "Ferret" } });
    expect(res.errors).toEqual([]);
    expect(iv.data.who).toEqual({ pet: "other", "pet-Comment": "Ferret" });
  });

  test("A disabled field and a field hidden by visibleIf are listed and refused", async () => {
    ComponentCollection.Instance.add(<any>{
      name: "gatedcmp",
      elementsJSON: [
        { type: "text", name: "gate", title: "Gate" },
        { type: "text", name: "off", title: "Off", enableIf: "{composite.gate} = 'open'" },
        { type: "text", name: "gone", title: "Gone", visibleIf: "{composite.gate} = 'open'" },
      ],
    });
    customComponents.push("gatedcmp");
    const iv = await createInterview({ elements: [{ type: "gatedcmp", name: "cmp" }] });
    // "off" and "Off" are quoted: a YAML parser would read them back as the boolean false.
    expect(iv.describeAll()).toContain(block(
      "      - name: \"off\"",
      "        type: text",
      "        title: \"Off\"",
      "        required: false",
      "        disabled: true"
    ));
    const res = await iv.answerAll({ cmp: { off: "x", gone: "y" } });
    expect(res.errors.map(error => ({ name: error.name, code: error.code }))).toEqual([
      { name: "cmp.off", code: InterviewErrorCodes.notAskable },
      { name: "cmp.gone", code: InterviewErrorCodes.notAskable },
    ]);
    expect(res.errors[0].message).toContain("enableIf");
    expect(res.errors[1].message).toContain("no longer being asked");
    expect(iv.data).toEqual({});
  });

  test("A field's errors are its own, and the container's errors are the container's", async () => {
    const iv = await createInterview({
      elements: [
        { type: "multipletext", name: "contact",
          items: [{ name: "email", inputType: "email" }] },
        { type: "matrix", name: "satisfaction", isAllRowRequired: true,
          rows: ["price", "speed"], columns: ["bad", "good"] },
      ],
    });
    const res = await iv.answerAll({ contact: { email: "nope" }, satisfaction: { price: "good" } });
    expect(res.errors).toEqual([
      { name: "contact.email", message: "Please enter a valid e-mail address." },
      { name: "satisfaction", message: "Response required: answer questions in all rows." },
    ]);
    const document = iv.describeAll();
    expect(document).toContain("        error: Please enter a valid e-mail address.");
    expect(document).toContain("    error: \"Response required: answer questions in all rows.\"");
    const done = await iv.complete();
    expect(done.completed).toBe(false);
    // The second row is an item of its own and it is empty and required; the container's own error
    // is reported next to it, under the container's address, and by complete() alone.
    expect(done.errors.map(error => error.name))
      .toEqual(["contact.email", "satisfaction.speed", "satisfaction"]);
  });

  test("A required container left empty is listed and reported at completion", async () => {
    const iv = await createInterview({
      elements: [
        { type: "multipletext", name: "contact", isRequired: true, items: [{ name: "email" }] },
      ],
    });
    expect(iv.describeAll()).toContain(block(
      "  - name: contact",
      "    type: multipletext",
      "    title: contact",
      "    required: true"
    ));
    const done = await iv.complete();
    expect(done.completed).toBe(false);
    expect(done.errors.map(error => error.name)).toEqual(["contact"]);
  });

  test("EachRowUniqueError is the matrix's own error", async () => {
    const iv = await createInterview({
      elements: [
        { type: "matrix", name: "satisfaction", eachRowUnique: true,
          rows: ["price", "speed"], columns: ["bad", "good"] },
      ],
    });
    const res = await iv.answerAll({ satisfaction: { price: "good", speed: "good" } });
    expect(res.errors).toEqual([
      { name: "satisfaction", message: "Each row must have a unique value." },
    ]);
    // Every field is answered, and the container is listed all the same: it is not valid.
    expect(iv.describeAll()).toContain("  - name: satisfaction");
  });

  test("A container that is answered and valid is not listed, and current says so", async () => {
    const iv = await createInterview({
      elements: [
        { type: "multipletext", name: "contact", items: [{ name: "email" }, { name: "phone" }] },
      ],
    });
    const res = await iv.answerAll({ contact: { email: "a@b.c" } });
    // The phone is empty and optional, so the container is answered and valid and drops out - while
    // single mode still stands on that empty item. current in batch is the first writable item of
    // the document, which is why the loop ends here and does not spin.
    expect(res.describe).toContain("items: []");
    expect(res.current).toBe(null);
    expect(iv.current().name, "single mode has not moved past the empty item").toBe("contact.phone");
  });

  test("current in batch is the first writable item of items", async () => {
    const iv = await createInterview({
      elements: [
        { type: "file", name: "photo" },
        { type: "text", name: "q1" },
        { type: "text", name: "q2" },
      ],
    });
    const res = await iv.answerAll({});
    expect(res.describe).toContain("  - name: photo");
    expect(res.current.name, "an unsupported item is listed and never current").toBe("q1");
    // A skipped item is listed in batch mode, and it is current there: skipping is a gesture of a
    // conversation with a person and an agent has none.
    await iv.answer("q1", "one");
    await iv.skip();
    expect(iv.current()).toBe(null);
    expect((await iv.answerAll({})).current.name).toBe("q2");
  });

  test("The dynamic containers are records now, and a single custom component is still plain", async () => {
    ComponentCollection.Instance.add(<any>{ name: "shortcmp", questionJSON: { type: "text", title: "Short" } });
    customComponents.push("shortcmp");
    const iv = await createInterview({
      elements: [
        { type: "paneldynamic", name: "meds", templateElements: [{ type: "text", name: "dose" }] },
        { type: "matrixdynamic", name: "rows", columns: [{ name: "col" }] },
        { type: "shortcmp", name: "short" },
      ],
    });
    const document = iv.describeAll();
    // Nothing is refused at the top level any more: the two dynamic containers are filled as records
    // (tier 08), the fixed-shape ones as objects, and "reason: batch" is left for a container below
    // the depth ceiling (tier 09).
    expect(document.split("reason: batch").length - 1).toBe(0);
    expect(document).toContain("    canAdd: true");
    // A single custom component does not override collectNestedQuestionsCore, so it holds no nested
    // question and is a plain item, before this tier and after it.
    expect(document).toContain(block(
      "  - name: short",
      "    type: text",
      "    title: short",
      "    required: false"
    ));
    expect((await iv.answerAll({ short: "x" })).errors).toEqual([]);
    expect(iv.data.short).toBe("x");
  });

  test("A container with nothing to fill says so with an empty fields list", async () => {
    const iv = await createInterview({
      elements: [
        { type: "text", name: "q1" },
        // Turned off as a whole: the enableIf makes every editor read-only with it.
        { type: "multipletext", name: "contact", enableIf: "{q1} = 'open'", items: [{ name: "email" }] },
        // An authoring mistake, and still one object with a fixed set of keys - there is no plain
        // value an agent could send for it either.
        { type: "multipletext", name: "empty", items: [] },
      ],
    });
    const document = iv.describeAll();
    expect(document).toContain(block(
      "  - name: contact",
      "    type: multipletext",
      "    title: contact",
      "    required: false",
      "    disabled: true",
      "    fields: []"
    ));
    expect(document).toContain(block(
      "  - name: empty",
      "    type: multipletext",
      "    title: empty",
      "    required: false",
      "    fields: []"
    ));
    const res = await iv.answerAll({ contact: { email: "a@b.c" }, empty: { a: "1" } });
    expect(res.errors.map(error => ({ name: error.name, code: error.code }))).toEqual([
      { name: "contact", code: InterviewErrorCodes.notAskable },
      { name: "empty.a", code: InterviewErrorCodes.unknownQuestion },
    ]);
  });

  test("Field titles and error texts are localized, and the schema description is not", async () => {
    const survey = new SurveyModel({
      locale: "de",
      elements: [
        { type: "multipletext", name: "contact",
          items: [{ name: "email", title: { de: "E-Mail" }, inputType: "email", isRequired: true }] },
        { type: "matrixdropdown", name: "matrix", columns: [{ name: "col" }],
          rows: [{ value: "row1", text: { de: "Erste Zeile" } }] },
      ],
    });
    const iv = await createInterview(survey);
    const res = await iv.answerAll({ contact: { email: "nope" } });
    expect(res.errors[0].message).toBe((<any>surveyLocalization.locales["de"]).invalidEmail);
    const document = iv.describeAll();
    expect(document).toContain("        title: E-Mail");
    expect(document).toContain("      - name: row1");
    expect(document).toContain("        title: Erste Zeile");
    expect(iv.getAnswerSchema().properties.matrix.description)
      .toBe("An object of rows, each an object of fields. Send only the fields to change; the " +
        "others are left as they are.");
  });
});
