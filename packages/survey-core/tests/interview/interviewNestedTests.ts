// @vitest-environment node
// Dynamic panels, matrices, multiple text and composites, one input at a time - in Node, like the
// rest of the module.
import { createInterview, InterviewErrorCodes } from "survey-core/interview";
import type { IInterview } from "survey-core/interview";
import { ComponentCollection, SurveyModel, settings } from "survey-core";

import { afterEach, describe, expect, test } from "vitest";

// The dynamic panel of the issue: two questions per entry, the first required, and a templateTitle
// that pipes the entry's own answer so that the summary lists "Aspirin" and not "Panel 1".
function medicationsJson(extra?: any): any {
  return {
    title: "Health check",
    elements: [Object.assign({
      type: "paneldynamic", name: "medications", title: "Medications", templateTitle: "{panel.name}",
      panelCount: 0,
      templateElements: [
        { type: "text", name: "name", title: "Name", isRequired: true },
        { type: "text", name: "dose", title: "Dose" },
      ],
    }, extra || {})],
  };
}

function lines(...text: Array<string>): string {
  return text.join("\n") + "\n";
}

// add, then the two questions of the new entry.
async function addEntry(iv: IInterview, name: string, dose: string): Promise<void> {
  await iv.answer({ action: "add" });
  await iv.answer(name);
  await iv.answer(dose);
}

const registeredComponents: Array<string> = [];
function registerComponent(json: any): void {
  ComponentCollection.Instance.add(json);
  registeredComponents.push(json.name);
}

afterEach(() => {
  while(registeredComponents.length > 0) {
    ComponentCollection.Instance.remove(registeredComponents.pop());
  }
});

describe("interview nested inputs (issue #11818)", () => {
  test("A dynamic panel, end to end: summary, add, fill, done", async () => {
    const iv = await createInterview(medicationsJson());
    // An empty container is asked for through its summary step, exactly as the mode shows it: the
    // question's own "no entries" line and its own add caption, nothing the interview wrote.
    expect(iv.describe()).toBe(lines(
      "# Health check",
      "",
      "```yaml",
      "progress:",
      "  answered: 0",
      "  remainingRequired: 0",
      "current:",
      "  name: medications",
      "  type: paneldynamic",
      "  title: Medications",
      "  required: false",
      "  summary:",
      "    noEntriesText: \"No entries yet.\\nClick the button below to add a new entry.\"",
      "    canAdd: true",
      "    addText: Add new",
      "```"
    ));

    let result = await iv.answer({ action: "add" });
    expect(result.errors).toEqual([]);
    expect(result.becameVisible).toEqual(["medications[0].name", "medications[0].dose"]);
    expect(result.becameRequired).toEqual(["medications[0].name"]);
    expect(result.current.name).toBe("medications[0].name");
    // The model follows: a UI on the same model shows the question the interview is asking for.
    expect(iv.survey.currentSingleQuestion.name).toBe("medications");
    expect(iv.survey.currentSingleQuestion.singleInputQuestion.name).toBe("name");
    // A freshly added entry is empty by definition, and nobody has been asked for it yet.
    expect(result.current.error).toBe(undefined);

    await iv.answer("Aspirin");
    result = await iv.answer("10mg");
    // Back on the summary, with the entry titled by the piped templateTitle.
    expect(result.current.name).toBe("medications");
    expect(result.current.summary).toEqual({
      entries: [{ index: 0, title: "Aspirin", canRemove: true }],
      canAdd: true,
      addText: "Add new",
    });

    await addEntry(iv, "Ibuprofen", "20mg");
    expect(iv.current().summary.entries).toEqual([
      { index: 0, title: "Aspirin", canRemove: true },
      { index: 1, title: "Ibuprofen", canRemove: true },
    ]);

    result = await iv.answer({ action: "done" });
    expect(result.errors).toEqual([]);
    expect(result.current).toBe(null);
    const document = iv.describe();
    // The container's whole value under its own address, once the step counts as answered; the
    // nested inputs stay listed under theirs.
    expect(document).toContain("  medications:");
    expect(document).toContain("    - name: Aspirin");
    expect(document).toContain("  \"medications[0].name\": Aspirin");
    const completed = await iv.complete();
    expect(completed.completed).toBe(true);
    expect(completed.data).toEqual({
      medications: [{ name: "Aspirin", dose: "10mg" }, { name: "Ibuprofen", dose: "20mg" }],
    });
  });

  test("An entry that is added and never filled keeps the container unanswered", async () => {
    const iv = await createInterview(medicationsJson());
    await iv.answer({ action: "add" });
    // "done" while the required question of the new entry is empty: the summary counts as answered,
    // and complete() is where the unanswered required input becomes an error.
    const result = await iv.answer({ action: "done" });
    expect(result.current.name).toBe("medications[0].name");
    const completed = await iv.complete();
    expect(completed.completed).toBe(false);
    expect(completed.errors).toEqual([{ name: "medications[0].name", message: "Response required." }]);
  });

  test("remove: the entry goes, the addresses after it shift, the old ones are reported hidden", async () => {
    const iv = await createInterview(medicationsJson());
    await addEntry(iv, "Aspirin", "10mg");
    await addEntry(iv, "Ibuprofen", "20mg");
    const result = await iv.answer({ action: "remove", index: 0 });
    expect(result.errors).toEqual([]);
    // The entries after the removed one move down, so the highest addresses are the ones that stop
    // existing; the remaining entry is reported at [0], where it now is.
    expect(result.becameHidden).toEqual(["medications[1].name", "medications[1].dose"]);
    expect(result.becameVisible).toEqual([]);
    expect(result.current.summary.entries).toEqual([{ index: 0, title: "Ibuprofen", canRemove: true }]);
    expect(iv.data).toEqual({ medications: [{ name: "Ibuprofen", dose: "20mg" }] });
    expect(result.describe).toContain("  \"medications[0].name\": Ibuprofen");
  });

  test("A populated entry with confirmDelete is removed without a prompt", async () => {
    // settings.confirmActionAsync is deliberately left untouched: removePanelUI would hand the entry
    // to a dialog nobody answers in Node, and the test would hang instead of failing.
    const iv = await createInterview(medicationsJson({ confirmDelete: true }));
    await addEntry(iv, "Aspirin", "10mg");
    const result = await iv.answer({ action: "remove", index: 0 });
    expect(result.errors).toEqual([]);
    expect(iv.data).toEqual({});
    expect(settings.confirmActionAsync).toBeTypeOf("function");
  });

  test("edit: the entry becomes current even though it is answered, and the rule resumes after it", async () => {
    const iv = await createInterview(medicationsJson());
    await addEntry(iv, "Aspirin", "10mg");
    await addEntry(iv, "Ibuprofen", "20mg");
    const result = await iv.answer({ action: "edit", index: 0 });
    expect(result.current.name).toBe("medications[0].name");
    // It stays current for the reads that follow, or the next answer(value) would land on the
    // summary step the rule would have picked.
    expect(iv.current().name).toBe("medications[0].name");
    expect(iv.survey.currentSingleQuestion.singleInputQuestion.name).toBe("name");
    const written = await iv.answer("Paracetamol");
    // The rule takes over again: everything else is answered and valid, so the summary is next.
    expect(written.current.name).toBe("medications");
    expect(iv.data.medications[0]).toEqual({ name: "Paracetamol", dose: "10mg" });
  });

  test("cannotAdd at maxPanelCount, cannotRemove with allowRemovePanel false", async () => {
    const full = await createInterview(medicationsJson({ maxPanelCount: 1 }));
    await addEntry(full, "Aspirin", "10mg");
    expect(full.current().summary).toEqual({
      entries: [{ index: 0, title: "Aspirin", canRemove: true }],
      canAdd: false,
    });
    const added = await full.answer({ action: "add" });
    expect(added.errors.length).toBe(1);
    expect(added.errors[0].code).toBe(InterviewErrorCodes.cannotAdd);
    expect(full.data.medications.length).toBe(1);

    const fixed = await createInterview(medicationsJson({ allowRemovePanel: false, panelCount: 1 }));
    await fixed.answer("Aspirin");
    await fixed.answer("10mg");
    expect(fixed.current().summary.entries).toEqual([{ index: 0, title: "Aspirin", canRemove: false }]);
    const removed = await fixed.answer({ action: "remove", index: 0 });
    expect(removed.errors.length).toBe(1);
    expect(removed.errors[0].code).toBe(InterviewErrorCodes.cannotRemove);
    expect(fixed.data.medications.length).toBe(1);
  });

  test("A summary step takes an action, and only one it offers", async () => {
    const iv = await createInterview(medicationsJson({ panelCount: 1 }));
    await iv.answer("Aspirin");
    await iv.answer("10mg");
    expect(iv.current().name).toBe("medications");
    const cases = [
      ["a value", "Aspirin"],
      ["an unknown action", { action: "nope" }],
      ["a missing index", { action: "remove" }],
      ["an out-of-range index", { action: "edit", index: 3 }],
    ];
    for (let i = 0; i < cases.length; i++) {
      const result = await iv.answer(cases[i][1]);
      expect(result.errors.length, <string>cases[i][0]).toBe(1);
      expect(result.errors[0].code, <string>cases[i][0]).toBe(InterviewErrorCodes.badAction);
      // Nothing was done: the same step is still current and the data is untouched.
      expect(result.current.name, <string>cases[i][0]).toBe("medications");
    }
    expect(iv.data).toEqual({ medications: [{ name: "Aspirin", dose: "10mg" }] });
    // And the reverse: an action object where a value belongs.
    const wrong = await iv.answer("medications[0].dose", { action: "add" });
    expect(wrong.errors[0].code).toBe(InterviewErrorCodes.badAction);
  });

  test("A required container with no entries is current, invalid, and reported by complete()", async () => {
    const iv = await createInterview(medicationsJson({ isRequired: true }));
    expect(iv.current().name).toBe("medications");
    expect(iv.current().required).toBe(true);
    // "done" does not finish it: the model's own rule says a required container with no entries is
    // invalid, and an invalid step stays current.
    const done = await iv.answer({ action: "done" });
    expect(done.current.name).toBe("medications");
    const completed = await iv.complete();
    expect(completed.completed).toBe(false);
    expect(completed.errors).toEqual([{ name: "medications", message: "Response required." }]);
  });

  test("A duplicated key is reported under the entry that carries it", async () => {
    const iv = await createInterview(medicationsJson({ keyName: "name" }));
    await addEntry(iv, "Aspirin", "10mg");
    await addEntry(iv, "Aspirin", "20mg");
    const completed = await iv.complete();
    expect(completed.completed).toBe(false);
    // KeyDuplicationError is put on the question that holds the key, not on the container, so it is
    // reported at that question's address - where a consumer can ask for a different value.
    expect(completed.errors).toEqual([
      { name: "medications[1].name", message: "This value should be unique." },
    ]);
  });

  test("A minimum row count is reported under the container itself", async () => {
    const iv = await createInterview({
      elements: [{ type: "matrixdynamic", name: "items", rowCount: 2, minRowCount: 2, isRequired: true,
        columns: [{ name: "sku", cellType: "text" }] }],
    });
    await iv.answer("A-1");
    await iv.skip();
    expect(iv.current().name).toBe("items");
    const completed = await iv.complete();
    expect(completed.completed).toBe(false);
    expect(completed.errors.length).toBe(1);
    expect(completed.errors[0].name).toBe("items");
    // The container's summary step is current and carries the error the model wrote on it - a
    // MinRowCountError belongs to the matrix, not to any one cell.
    expect(iv.current().name).toBe("items");
    expect(iv.current().error).toBe(completed.errors[0].message);
  });

  test("A visibleIf inside the template reports the indexed address", async () => {
    const iv = await createInterview({
      elements: [{ type: "paneldynamic", name: "medications", panelCount: 1, templateElements: [
        { type: "boolean", name: "hasSideEffects", title: "Side effects?" },
        { type: "text", name: "sideEffects", visibleIf: "{panel.hasSideEffects} = true" },
      ] }],
    });
    expect(iv.current().name).toBe("medications[0].hasSideEffects");
    const result = await iv.answer(true);
    expect(result.becameVisible).toEqual(["medications[0].sideEffects"]);
    expect(result.current.name).toBe("medications[0].sideEffects");
  });

  test("A complete and valid entry is still reachable by address, and the model follows", async () => {
    const iv = await createInterview(medicationsJson());
    await addEntry(iv, "Aspirin", "10mg");
    await addEntry(iv, "Ibuprofen", "20mg");
    // The mode's own navigation list drops a panel that is complete and valid; the inventory does
    // not, so the address still answers.
    const result = await iv.answer("medications[0].dose", "15mg");
    expect(result.errors).toEqual([]);
    expect(iv.data.medications[0].dose).toBe("15mg");
    expect(iv.survey.currentSingleQuestion.name).toBe("medications");
  });

  test("readOnly and enableIf on a template question, per entry", async () => {
    const iv = await createInterview({
      elements: [{ type: "paneldynamic", name: "medications", panelCount: 2, templateElements: [
        { type: "text", name: "name" },
        { type: "text", name: "note", readOnly: true },
        { type: "text", name: "dose", enableIf: "{panel.name} notempty" },
      ] }],
    });
    // Read-only by property: not an item at all, in either entry.
    const addresses: Array<string> = [];
    for (let guard = 0; guard < 10; guard++) {
      const current = iv.current();
      if (!current) break;
      addresses.push(current.name);
      await iv.skip();
    }
    expect(addresses.indexOf("medications[0].note")).toBe(-1);
    expect(addresses.indexOf("medications[1].note")).toBe(-1);
    // The enableIf question is off while the name of its own entry is empty, so it is never current;
    // answering the name of entry 0 turns entry 0's on and leaves entry 1's off.
    expect(addresses.indexOf("medications[0].dose")).toBe(-1);
    const fresh = await createInterview({
      elements: [{ type: "paneldynamic", name: "medications", panelCount: 2, templateElements: [
        { type: "text", name: "name" },
        { type: "text", name: "dose", enableIf: "{panel.name} notempty" },
      ] }],
    });
    const result = await fresh.answer("Aspirin");
    expect(result.current.name).toBe("medications[0].dose");
    const disabled = await fresh.answer("medications[1].dose", "20mg");
    expect(disabled.errors[0].code).toBe(InterviewErrorCodes.notAskable);
  });

  test("A dynamic matrix: the same flow on rows, with the model's row titles", async () => {
    const iv = await createInterview({
      elements: [{ type: "matrixdynamic", name: "items", title: "Items", rowCount: 1,
        columns: [{ name: "sku", cellType: "text", title: "SKU" },
          { name: "qty", cellType: "text", inputType: "number", title: "Qty" }] }],
    });
    expect(iv.current().name).toBe("items[0].sku");
    expect(iv.current().entry).toBe("Row 1");
    await iv.answer("A-1");
    let result = await iv.answer(2);
    expect(result.current.name).toBe("items");
    expect(result.current.summary).toEqual({
      entries: [{ index: 0, title: "Row 1", canRemove: true }],
      canAdd: true,
      addText: "Add Row",
    });
    result = await iv.answer({ action: "add" });
    expect(result.becameVisible).toEqual(["items[1].sku", "items[1].qty"]);
    expect(result.current.name).toBe("items[1].sku");
    expect(result.current.entry).toBe("Row 2");
    await iv.answer("A-2");
    await iv.answer(3);
    result = await iv.answer({ action: "remove", index: 0 });
    expect(result.errors).toEqual([]);
    expect(iv.data).toEqual({ items: [{ sku: "A-2", qty: 3 }] });
  });

  test("singleInputTitleTemplate renames the entries", async () => {
    const iv = await createInterview({
      elements: [{ type: "matrixdynamic", name: "items", rowCount: 1,
        singleInputTitleTemplate: "Item {rowIndex}: {row.sku}",
        columns: [{ name: "sku", cellType: "text" }] }],
    });
    const result = await iv.answer("A-1");
    expect(result.current.summary.entries).toEqual([
      { index: 0, title: "Item 1: A-1", canRemove: true },
    ]);
  });

  test("A matrix dropdown: a cell per row, no summary step", async () => {
    const iv = await createInterview({
      elements: [
        { type: "dropdown", name: "region", choices: ["east", "west"] },
        { type: "matrixdropdown", name: "matrix", title: "Matrix", rows: ["row1", "row2"],
          columns: [{ name: "column1", cellType: "dropdown", choicesFromQuestion: "region" }] },
      ],
    });
    await iv.answer("east");
    const item = iv.current();
    expect(item.name).toBe("matrix.row1.column1");
    expect(item.entry).toBe("row1");
    // The cell's choices are read off the live model, so choicesFromQuestion is already applied.
    expect(item.choices.map((choice: any) => choice.value)).toEqual(["east", "west"]);
    const result = await iv.answer("east");
    expect(result.current.name).toBe("matrix.row2.column1");
    await iv.answer("west");
    // No summary step: a matrix dropdown has a fixed set of rows and nothing to add or remove.
    expect(iv.current()).toBe(null);
    expect(iv.data.matrix).toEqual({ row1: { column1: "east" }, row2: { column1: "west" } });
  });

  test("A single-choice matrix: one item per row, the columns as its choices", async () => {
    const iv = await createInterview({
      elements: [{ type: "matrix", name: "satisfaction", title: "Satisfaction", eachRowRequired: true,
        rows: [{ value: "price", text: "Price" }, { value: "quality", text: "Quality" }],
        columns: ["low", "high"] }],
    });
    const item = iv.current();
    expect(item.name).toBe("satisfaction.price");
    expect(item.type).toBe("radiogroup");
    expect(item.title).toBe("Price");
    expect(item.required).toBe(true);
    expect(item.choices.map((choice: any) => choice.value)).toEqual(["low", "high"]);
    const result = await iv.answer("low");
    expect(result.errors).toEqual([]);
    // Writing the synthesized question writes the row: if this ever stops working the fix belongs to
    // the model, not here.
    expect(iv.data.satisfaction).toEqual({ price: "low" });
    expect(result.current.name).toBe("satisfaction.quality");
    const wrong = await iv.answer("middle");
    expect(wrong.errors[0].code).toBe(InterviewErrorCodes.notAChoice);
    await iv.answer("high");
    expect(iv.data.satisfaction).toEqual({ price: "low", quality: "high" });
    expect((await iv.complete()).completed).toBe(true);
  });

  test("A single-choice matrix that is left half empty is reported under the matrix", async () => {
    const iv = await createInterview({
      elements: [{ type: "matrix", name: "satisfaction", isAllRowRequired: true,
        rows: ["price", "quality"], columns: ["low", "high"] }],
    });
    await iv.answer("low");
    await iv.skip();
    const completed = await iv.complete();
    expect(completed.completed).toBe(false);
    // The container's own error: its rows are items, the matrix itself is not, so nothing else would
    // have carried it.
    expect(completed.errors.some(error => error.name === "satisfaction")).toBe(true);
  });

  test("A multiple text and a composite: one item per part", async () => {
    registerComponent({
      name: "addressbox", title: "Address",
      elementsJSON: [
        { type: "text", name: "street", title: "Street", isRequired: true },
        { type: "text", name: "city", title: "City" },
      ],
    });
    const iv = await createInterview({
      elements: [
        { type: "multipletext", name: "contact", title: "Contact",
          items: [{ name: "email", title: "Email", inputType: "email" }, { name: "phone", title: "Phone" }] },
        { type: "addressbox", name: "address" },
      ],
    });
    const item = iv.current();
    expect(item.name).toBe("contact.email");
    expect(item.title).toBe("Email");
    expect(item.inputType).toBe("email");
    // No entry breadcrumb: a multiple text has no entries to be in.
    expect(item.entry).toBe(undefined);
    await iv.answer("a@b.com");
    expect(iv.current().name).toBe("contact.phone");
    await iv.answer("555");
    const street = iv.current();
    expect(street.name).toBe("address.street");
    expect(street.required).toBe(true);
    await iv.answer("Main 1");
    await iv.answer("Springfield");
    expect(iv.current()).toBe(null);
    expect(iv.data).toEqual({
      contact: { email: "a@b.com", phone: "555" },
      address: { street: "Main 1", city: "Springfield" },
    });
  });

  test("onCheckSingleInputPerPageMode: the container is one input and takes the whole array", async () => {
    const survey = new SurveyModel(medicationsJson({ panelCount: 1 }));
    survey.onCheckSingleInputPerPageMode.add((sender, options) => {
      if (options.question.name === "medications") options.enabled = false;
    });
    const iv = await createInterview(survey);
    const item = iv.current();
    expect(item.name).toBe("medications");
    expect(item.valueType).toBe("array");
    // Not a summary step: there is nothing to add or remove one entry at a time any more.
    expect(item.summary).toBe(undefined);
    const result = await iv.answer([{ name: "Aspirin", dose: "10mg" }]);
    expect(result.errors).toEqual([]);
    expect(iv.data).toEqual({ medications: [{ name: "Aspirin", dose: "10mg" }] });
    expect(result.current).toBe(null);
  });

  test("onGetLoopQuestions: a nested question the host drops is not an item", async () => {
    const survey = new SurveyModel(medicationsJson({ panelCount: 1 }));
    survey.onGetLoopQuestions.add((sender, options) => {
      for (let i = options.nestedQuestions.length - 1; i >= 0; i--) {
        if (options.nestedQuestions[i].name === "dose") options.nestedQuestions.splice(i, 1);
      }
    });
    const iv = await createInterview(survey);
    expect(iv.current().name).toBe("medications[0].name");
    const result = await iv.answer("Aspirin");
    expect(result.current.name).toBe("medications");
    const dropped = await iv.answer("medications[0].dose", "10mg");
    expect(dropped.errors[0].code).toBe(InterviewErrorCodes.unknownQuestion);
  });

  test("A container inside a container has its own summary step, at its own address", async () => {
    const iv = await createInterview({
      elements: [{ type: "paneldynamic", name: "orders", panelCount: 1, templateElements: [
        { type: "text", name: "ref", title: "Reference" },
        { type: "matrixdynamic", name: "items", rowCount: 1, columns: [{ name: "sku", cellType: "text" }] },
      ] }],
    });
    await iv.answer("PO-1");
    await iv.answer("A-1");
    // The inner matrix's own summary, reached through the panel it lives in.
    const inner = iv.current();
    expect(inner.name).toBe("orders[0].items");
    expect(inner.summary.entries).toEqual([{ index: 0, title: "Row 1", canRemove: true }]);
    const added = await iv.answer({ action: "add" });
    expect(added.becameVisible).toEqual(["orders[0].items[1].sku"]);
    expect(added.current.name).toBe("orders[0].items[1].sku");
    await iv.answer("A-2");
    // Done with the inner list, then done with the outer one.
    let result = await iv.answer({ action: "done" });
    expect(result.current.name).toBe("orders");
    result = await iv.answer({ action: "done" });
    expect(result.current).toBe(null);
    expect(iv.data).toEqual({
      orders: [{ ref: "PO-1", items: [{ sku: "A-1" }, { sku: "A-2" }] }],
    });
  });

  test("Batch mode fills the container as records, and an address is not a batch key", async () => {
    const iv = await createInterview(medicationsJson({ panelCount: 1 }));
    const document = iv.describeAll();
    expect(document).toContain("  - name: medications");
    expect(document).toContain("    entries:");
    // A record addresses a field by its own name, so no address of the inventory is a key of a batch.
    expect(document).not.toContain("medications[0].name");
    const result = await iv.answerAll({ "medications[0].name": "Aspirin" });
    expect(result.errors[0].code).toBe(InterviewErrorCodes.unknownQuestion);
    expect(Object.keys(iv.getAnswerSchema().properties)).toEqual(["medications"]);
    // The single-mode addresses are untouched by any of it.
    expect((await iv.answer("medications[0].name", "Aspirin")).errors).toEqual([]);
    expect(iv.data).toEqual({ medications: [{ name: "Aspirin" }] });
  });

  test("A nested matrix's summary step shows the rows a batch write added", async () => {
    const iv = await createInterview({
      elements: [{
        type: "paneldynamic", name: "orders", panelCount: 1, templateElements: [
          { type: "matrixdynamic", name: "items", rowCount: 0, columns: [{ name: "sku", cellType: "text" }] },
        ],
      }],
    });
    const res = await iv.answerAll({ orders: [{ items: [{ sku: "A-1" }, { sku: "A-2" }] }] });
    expect(res.errors).toEqual([]);
    // Both rows are answered, so the single-mode rule stands on the inner list's own summary step,
    // which lists what the batch added.
    const current = iv.current();
    expect(current.name).toBe("orders[0].items");
    expect(current.summary.entries.map(entry => entry.index)).toEqual([0, 1]);
  });

  test("The document of a nested input: quoted address, entry, and the summary shape", async () => {
    const iv = await createInterview(medicationsJson({ panelCount: 1 }));
    await iv.answer("Aspirin");
    expect(iv.describe()).toBe(lines(
      "# Health check",
      "",
      "```yaml",
      "progress:",
      "  answered: 1",
      "  remainingRequired: 0",
      "answered:",
      "  \"medications[0].name\": Aspirin",
      "current:",
      "  name: medications[0].dose",
      "  type: text",
      "  title: Dose",
      "  required: false",
      "  entry: Aspirin",
      "```"
    ));
    await iv.answer("10mg");
    expect(iv.describe()).toBe(lines(
      "# Health check",
      "",
      "```yaml",
      "progress:",
      "  answered: 2",
      "  remainingRequired: 0",
      "answered:",
      "  \"medications[0].name\": Aspirin",
      "  \"medications[0].dose\": 10mg",
      "current:",
      "  name: medications",
      "  type: paneldynamic",
      "  title: Medications",
      "  required: false",
      "  summary:",
      "    entries:",
      "      - index: 0",
      "        title: Aspirin",
      "        canRemove: true",
      "    canAdd: true",
      "    addText: Add new",
      "```"
    ));
  });
});
