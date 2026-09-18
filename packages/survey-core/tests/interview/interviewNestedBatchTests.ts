// @vitest-environment node
// Containers nested inside containers, in batch mode: an entry's record describes a nested container
// the way the root document describes one, and a record an agent sends carries the nested
// container's own value form, at any depth. An agent runs on a server; nothing here needs a DOM.
import { createInterview, InterviewErrorCodes } from "survey-core/interview";
import type { IInterview, IInterviewItem } from "survey-core/interview";
import { ComponentCollection, SurveyModel, surveyLocalization } from "survey-core";
import type { ISurveyWebRequest, ISurveyWebResponse } from "survey-core";
import { MAX_NESTING_DEPTH, getAddress, parseAddress } from "../../src/interview/interview-address";
import { ensureDetailPanels } from "../../src/interview/interview-detail";
import { getBatchEntries } from "../../src/interview/interview-batch";
import { getInterviewInputs } from "../../src/interview/interview-items";

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
});

// The cell type is set on each column rather than on the matrix: a panel of a dynamic panel is a copy
// of the template's JSON, and a matrix-level cellType comes out of that copy after the columns, which
// leaves the columns' template questions of the default type and drops their type-specific
// properties (inputType, min) - a survey-core serialization matter, not the interview's.
const SKU = { name: "sku", title: "SKU", isRequired: true, cellType: "text" };
const QTY = { name: "qty", title: "Quantity", cellType: "text", inputType: "number", min: 1 };
const NOTES = {
  type: "paneldynamic", name: "notes", title: "Notes", panelCount: 0,
  templateElements: [{ type: "text", name: "text", title: "Note" }],
};

// The matrix of the README: a dynamic matrix of items, whose detail panel holds a dynamic panel of
// notes.
function itemsMatrix(extra?: any, columns?: Array<any>): any {
  return Object.assign({
    type: "matrixdynamic", name: "items", title: "Items", isRequired: true, minRowCount: 1, rowCount: 1,
    columns: columns || [SKU],
    detailPanelMode: "underRow", detailElements: [NOTES],
  }, extra || {});
}

// A dynamic panel of orders whose template holds a reference and the matrix of items.
function ordersJson(extra?: any, template?: Array<any>): any {
  return {
    title: "Orders",
    elements: [Object.assign({
      type: "paneldynamic", name: "orders", title: "Orders", panelCount: 1,
      templateElements: template || [{ type: "text", name: "ref", title: "Reference" }, itemsMatrix()],
    }, extra || {})],
  };
}

function withQty(itemsExtra?: any, ordersExtra?: any): any {
  return ordersJson(ordersExtra, [
    { type: "text", name: "ref", title: "Reference" },
    itemsMatrix(itemsExtra, [SKU, QTY]),
  ]);
}

// The record of a root, listed or not: a document leaves out what is answered and valid, and a test
// that reads the shape of such a record reads it where the document is built from.
function rootRecord(iv: IInterview, name: string): IInterviewItem {
  const entries = getBatchEntries(iv.survey, getInterviewInputs(iv.survey));
  return entries.filter(entry => entry.address === name)[0].item;
}

// The record a document holds for a field, walked down by name and position:
// recordOf(item, "entries", 0, "items", "entries", 1, "sku").
function recordOf(item: IInterviewItem, ...path: Array<string | number>): any {
  let current: any = item;
  for (let i = 0; i < path.length; i++) {
    const step = path[i];
    if (typeof step === "number") {
      current = current[step];
      continue;
    }
    if (step === "entries" || step === "template" || step === "fields" || step === "rows") {
      current = current[step];
      continue;
    }
    const list: Array<any> = Array.isArray(current) ? current : current.fields;
    current = list.filter(record => record.name === step)[0];
  }
  return current;
}

// The loop an integrator writes, driven by a scripted agent (README, "The loop").
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

describe("interview nested containers in batch mode (issue #11818)", () => {
  test("The document: a nested matrix, and a dynamic panel in its detail panel", async () => {
    const survey = new SurveyModel(ordersJson());
    // Everything below is answered and valid, which would take "orders" out of the document; an error
    // of the container's own keeps it listed, and lands after the record's last key.
    survey.onValidateQuestion.add((_, options) => {
      if (options.name === "orders") options.error = "Check the orders";
    });
    const iv = await createInterview(survey);
    await iv.answerAll({ orders: [{ ref: "PO-1", items: [{ sku: "A-1" }] }] });
    const document = iv.describeAll();
    expect(document).toContain(block(
      "items:",
      "  - name: orders",
      "    type: paneldynamic",
      "    title: Orders",
      "    required: false",
      "    entries:",
      "      - index: 0",
      "        canRemove: true",
      "        fields:",
      "          - name: ref",
      "            type: text",
      "            title: Reference",
      "            required: false",
      "            value: PO-1",
      "          - name: items",
      "            type: matrixdynamic",
      "            title: Items",
      "            required: true",
      "            constraints:",
      "              minCount: 1",
      "            entries:",
      "              - index: 0",
      // The model's own permission: one row and a minimum of one offers no remove.
      "                canRemove: false",
      "                fields:",
      "                  - name: sku",
      "                    type: text",
      "                    title: SKU",
      "                    required: true",
      "                    value: A-1",
      "                  - name: notes",
      "                    type: paneldynamic",
      "                    title: Notes",
      "                    required: false",
      "                    template:",
      "                      - name: text",
      "                        type: text",
      "                        title: Note",
      "                        required: false",
      "                    canAdd: true",
      "            template:",
      "              - name: sku",
      "                type: text",
      "                title: SKU",
      "                required: true",
      "              - name: notes",
      "                type: paneldynamic",
      "                title: Notes",
      "                required: false",
      "                template:",
      "                  - name: text",
      "                    type: text",
      "                    title: Note",
      "                    required: false",
      "                canAdd: true",
      "            canAdd: true",
      "    template:",
      "      - name: ref",
      "        type: text",
      "        title: Reference",
      "        required: false",
      "      - name: items",
      "        type: matrixdynamic",
      "        title: Items",
      "        required: true",
      "        constraints:",
      "          minCount: 1",
      "        template:",
      "          - name: sku",
      "            type: text",
      "            title: SKU",
      "            required: true",
      "          - name: notes",
      "            type: paneldynamic",
      "            title: Notes",
      "            required: false",
      "            template:",
      "              - name: text",
      "                type: text",
      "                title: Note",
      "                required: false",
      "            canAdd: true",
      "        canAdd: true",
      "    canAdd: true",
      "    error: Check the orders"
    ));
    // No breadcrumb anywhere - the position says which entry - and nothing refused for its nesting.
    expect(document).not.toContain("entry:");
    expect(document.split("reason: batch").length - 1).toBe(0);
  });

  test("Every kind of container nests: a multiple text, a dynamic panel in a composite, a matrix dropdown in a detail panel", async () => {
    ComponentCollection.Instance.add(<any>{
      name: "shipping",
      elementsJSON: [
        { type: "text", name: "city", title: "City" },
        { type: "paneldynamic", name: "stops", title: "Stops", panelCount: 1,
          templateElements: [{ type: "text", name: "place", title: "Place" }] },
      ],
    });
    customComponents.push("shipping");
    const iv = await createInterview({
      elements: [
        { type: "paneldynamic", name: "people", title: "People", panelCount: 1, templateElements: [
          { type: "multipletext", name: "contact", title: "Contact", items: [{ name: "email", title: "Email" }] },
        ] },
        { type: "shipping", name: "ship", title: "Shipping" },
        { type: "matrixdynamic", name: "lines", title: "Lines", rowCount: 1, cellType: "text",
          columns: [{ name: "code", title: "Code" }], detailPanelMode: "underRow",
          detailElements: [{ type: "matrixdropdown", name: "sizes", title: "Sizes", cellType: "text",
            columns: [{ name: "count", title: "Count" }], rows: [{ value: "s", text: "Small" }] }] },
      ],
    });
    const people = rootRecord(iv, "people");
    // The multiple text is an object of fields in the entry, and a declared one in the template.
    expect(recordOf(people, "entries", 0, "contact").fields.map(field => field.name)).toEqual(["email"]);
    expect(recordOf(people, "template", "contact").fields.map(field => field.name)).toEqual(["email"]);
    // The dynamic panel of the composite is a list of records among the composite's fields.
    const stops = recordOf(rootRecord(iv, "ship"), "stops");
    expect(stops.entries.length).toBe(1);
    expect(stops.template.map(field => field.name)).toEqual(["place"]);
    expect(stops.canAdd).toBe(true);
    // The matrix dropdown of the detail panel is two levels, rows then cells, in the row's fields.
    expect(recordOf(rootRecord(iv, "lines"), "entries", 0, "sizes").rows).toEqual([
      { name: "s", title: "Small", fields: [{ name: "count", type: "text", title: "Count", required: false,
        valueType: "string" }] },
    ]);
    expect(iv.describeAll().split("reason: batch").length - 1).toBe(0);
    const res = await iv.answerAll({
      people: [{ contact: { email: "a@b.c" } }],
      ship: { city: "Bonn", stops: [{ place: "Koeln" }, { place: "Mainz" }] },
      lines: [{ code: "X", sizes: { s: { count: "2" } } }],
    });
    expect(res.errors).toEqual([]);
    expect(iv.data).toEqual({
      people: [{ contact: { email: "a@b.c" } }],
      ship: { city: "Bonn", stops: [{ place: "Koeln" }, { place: "Mainz" }] },
      lines: [{ code: "X", sizes: { s: { count: "2" } } }],
    });
  });

  test("A nested container's own errors are on its record and under its address", async () => {
    // A required nested dynamic panel that loses its last entry to a write of the call.
    const panel = await createInterview(ordersJson(undefined, [
      { type: "text", name: "ref", title: "Reference" },
      Object.assign({}, NOTES, { isRequired: true, panelCount: 1 }),
    ]));
    const removed = await panel.answerAll({ orders: [{ notes: [null] }] });
    expect(removed.errors.map(error => error.name)).toEqual(["orders[0].notes"]);
    expect(removed.errors[0].code).toBeUndefined();
    expect(recordOf(rootRecord(panel, "orders"), "entries", 0, "notes").error)
      .toBe(removed.errors[0].message);

    // MinRowCountError: a required nested matrix with fewer rows that hold a value than its minimum.
    const matrix = await createInterview(withQty({ rowCount: 2, minRowCount: 2 }));
    const res = await matrix.answerAll({ orders: [{ items: [{ sku: "A-1" }] }] });
    const own = res.errors.filter(error => error.name === "orders[0].items");
    expect(own.length).toBe(1);
    const record = recordOf(rootRecord(matrix, "orders"), "entries", 0, "items");
    expect(record.error).toBe(own[0].message);
    expect(matrix.describeAll().split("reason: batch").length - 1).toBe(0);
  });

  test("Detail panels: the questions of every visible row, from the first document on", async () => {
    const survey = new SurveyModel({
      elements: [
        { type: "matrixdynamic", name: "items", rowCount: 2, cellType: "text", columns: [{ name: "sku" }],
          detailPanelMode: "underRow",
          detailElements: [{ type: "text", name: "note", title: "Note" }, NOTES] },
      ],
    });
    const matrix: any = survey.getQuestionByName("items");
    // The host excludes the second row: it gets no panel from the interview either.
    matrix.onHasDetailPanelCallback = (row: any) => row.rowIndex !== 2;
    const iv = await createInterview(survey);
    // No detailPanelShowOnAdding, no UI and no validation: the interview created the panel of the
    // first row in createInterview, before anything read the model.
    const record = rootRecord(iv, "items");
    expect(record.entries[0].fields.map(field => field.name)).toEqual(["sku", "note", "notes"]);
    expect(record.entries[1].fields.map(field => field.name)).toEqual(["sku"]);
    // A new row takes the detail questions too, after the columns.
    expect(record.template.map(field => field.name)).toEqual(["sku", "note", "notes"]);
    // The price of creating the panel through the model's public gesture: the row is expanded.
    expect(matrix.visibleRows[0].isDetailPanelShowing).toBe(true);
    expect(matrix.visibleRows[1].detailPanel).toBeFalsy();
  });

  test("Detail panels in single mode: a detail question is an item from the first current() on", async () => {
    const iv = await createInterview({
      elements: [
        { type: "matrixdynamic", name: "items", rowCount: 1, cellType: "text", columns: [{ name: "sku" }],
          detailPanelMode: "underRow",
          detailElements: [{ type: "text", name: "note", title: "Note" }, NOTES] },
      ],
    });
    expect(iv.current().name).toBe("items[0].sku");
    const sku = await iv.answer("A-1");
    expect(sku.current.name).toBe("items[0].note");
    const note = await iv.answer("fragile");
    // The nested dynamic panel of the detail panel has its summary step at its own address.
    expect(note.current.name).toBe("items[0].notes");
    expect(note.current.summary.canAdd).toBe(true);
  });

  test("Reads create nothing: a revealed row gets its panel from the next write", async () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "mode" },
        { type: "matrixdropdown", name: "matrix", rows: ["r1", "r2"], cellType: "text",
          rowsVisibleIf: "{item} = 'r1' or {mode} = 'all'", columns: [{ name: "col" }],
          detailPanelMode: "underRow", detailElements: [{ type: "text", name: "note" }] },
      ],
    });
    const matrix: any = survey.getQuestionByName("matrix");
    let created = 0;
    matrix.onCreateDetailPanelCallback = () => { created++; };
    const iv = await createInterview(survey);
    created = 0;
    // Past the interview, straight on the model: nothing of the interview has run since.
    survey.setValue("mode", "all");
    const rowFields = (): Array<string> =>
      recordOf(rootRecord(iv, "matrix"), "rows", 1).fields.map(field => field.name);
    iv.current();
    iv.describe();
    iv.describeAll();
    iv.getAnswerSchema();
    expect(rowFields()).toEqual(["col"]);
    const row = matrix.visibleRows.filter(item => item.rowName === "r2")[0];
    expect(row.detailPanel).toBeFalsy();
    expect(created).toBe(0);
    // Any write settles, and the settle creates what the reveal left without a panel.
    await iv.answer("mode", "all");
    expect(created).toBe(1);
    expect(rowFields()).toEqual(["col", "note"]);
  });

  test("Choices a created detail panel loads are drained by the call that created it", async () => {
    const createSurvey = (): SurveyModel => {
      const survey = new SurveyModel();
      survey.webProvider = {
        sendRequest: (request: ISurveyWebRequest, onResponse: (response: ISurveyWebResponse) => void): void => {
          setTimeout(() => onResponse({ status: 200, response: ["Berlin", "Paris"] }), 10);
        },
      };
      survey.fromJSON({
        elements: [
          { type: "text", name: "mode" },
          { type: "matrixdropdown", name: "matrix", rows: ["r1", "r2"], cellType: "text",
            rowsVisibleIf: "{item} = 'r1' or {mode} = 'all'", columns: [{ name: "col" }],
            detailPanelMode: "underRow",
            detailElements: [{ type: "dropdown", name: "city", choicesByUrl: { url: "https://example.com/cities" } }] },
          { type: "matrixdynamic", name: "items", rowCount: 0, cellType: "text", columns: [{ name: "sku", isRequired: true }],
            detailPanelMode: "underRow",
            detailElements: [{ type: "dropdown", name: "town", choicesByUrl: { url: "https://example.com/towns" } }] },
        ],
      });
      return survey;
    };
    const survey = createSurvey();
    const iv = await createInterview(survey);
    // The write that revealed the row.
    await iv.answer("mode", "all");
    expect(survey.getRunningAsyncOperations()).toEqual([]);
    const city = recordOf(rootRecord(iv, "matrix"), "rows", 1, "city");
    expect(city.choices.map(choice => choice.value)).toEqual(["Berlin", "Paris"]);
    // The batch that added the row.
    const added = await iv.answerAll({ items: [{}] });
    expect(survey.getRunningAsyncOperations()).toEqual([]);
    expect(added.describe).toContain(block(
      "    entries:",
      "      - index: 0",
      "        canRemove: true",
      "        fields:",
      "          - name: sku",
      "            type: text",
      "            title: sku",
      "            required: true",
      "          - name: town",
      "            type: dropdown",
      "            title: town",
      "            required: false",
      "            choices:",
      "              - value: Berlin",
      "              - value: Paris"
    ));

    // timeout 0: the same call does not wait, and says what the model holds at that instant.
    const eager = createSurvey();
    const fast = await createInterview(eager, { timeout: 0 });
    await fast.answer("mode", "all");
    const unloaded = recordOf(rootRecord(fast, "matrix"), "rows", 1, "city");
    expect(!unloaded.choices || unloaded.choices.length === 0).toBe(true);
  });

  test("A row a record adds takes its detail fields in the same record", async () => {
    const iv = await createInterview({
      elements: [
        { type: "matrixdynamic", name: "items", rowCount: 0, cellType: "text", columns: [{ name: "sku" }],
          detailPanelMode: "underRow", detailElements: [{ type: "text", name: "note" }] },
      ],
    });
    const res = await iv.answerAll({ items: [{ sku: "A", note: "x" }] });
    expect(res.errors).toEqual([]);
    expect(iv.data).toEqual({ items: [{ sku: "A", note: "x" }] });
  });

  test("The transcript of the README, through the loop", async () => {
    const survey = new SurveyModel(withQty());
    survey.data = { orders: [{ ref: "PO-1", items: [{ sku: "A-1", qty: 0 }, { sku: "B-2", qty: 1 }] }] };
    const iv = await createInterview(survey);
    const first = iv.getBatchDocument();
    // The invalid quantity, two levels down, keeps the root listed.
    expect(recordOf(first.items[0], "entries", 0, "items", "entries", 0, "qty").error).toBeDefined();
    const sent: Array<any> = [
      // The fix, a removal and a new order with an item, in one turn.
      { orders: [{ items: [{ qty: 2 }, null] }, { ref: "PO-2", items: [{ sku: "C-3", qty: 1 }] }] },
    ];
    let turn = 0;
    const turns = await runAgentLoop(iv, () => sent[turn++] || {});
    expect(turns).toBe(1);
    expect(iv.getBatchDocument().items).toEqual([]);
    const done = await iv.complete();
    expect(done.completed).toBe(true);
    expect(done.data).toEqual({
      orders: [
        { ref: "PO-1", items: [{ sku: "A-1", qty: 2 }] },
        { ref: "PO-2", items: [{ sku: "C-3", qty: 1 }] },
      ],
    });
  });

  test("A nested list takes patches, adds and removes like a root one", async () => {
    const iv = await createInterview(withQty({ rowCount: 2, minRowCount: 0 }));
    await iv.answerAll({ orders: [{ ref: "PO-1", items: [{ sku: "A-1", qty: 1 }, { sku: "B-2", qty: 1 }] }] });
    // One cell of one row: everything else is left as it is.
    const patched = await iv.answerAll({ orders: [{ items: [{ qty: 2 }] }] });
    expect(patched.errors).toEqual([]);
    expect(iv.data).toEqual({ orders: [{ ref: "PO-1", items: [{ sku: "A-1", qty: 2 }, { sku: "B-2", qty: 1 }] }] });
    // A null removes the row at that position.
    const removed = await iv.answerAll({ orders: [{ items: [null] }] });
    expect(removed.errors).toEqual([]);
    expect(iv.data).toEqual({ orders: [{ ref: "PO-1", items: [{ sku: "B-2", qty: 1 }] }] });
    // A position past the inner count adds a row and fills it.
    const added = await iv.answerAll({ orders: [{ items: [{}, { sku: "C-3" }] }] });
    expect(added.errors).toEqual([]);
    // The new row's cells, then the summary step of the dynamic panel in its detail panel - which the
    // interview created in the same call.
    expect(added.becameVisible)
      .toEqual(["orders[0].items[1].sku", "orders[0].items[1].qty", "orders[0].items[1].notes"]);
    expect(iv.data.orders[0].items).toEqual([{ sku: "B-2", qty: 1 }, { sku: "C-3" }]);
  });

  test("An outer add and the inner list of the new entry, in one record", async () => {
    const iv = await createInterview(ordersJson(undefined, [
      { type: "text", name: "ref", title: "Reference" },
      itemsMatrix({ rowCount: 0, isRequired: false, minRowCount: 0, detailPanelMode: "none" }),
    ]));
    await iv.answerAll({ orders: [{ ref: "PO-1" }] });
    const res = await iv.answerAll({ orders: [{}, { ref: "PO-2", items: [{ sku: "D-4" }] }] });
    expect(res.errors).toEqual([]);
    // One panel added, one row added inside it, both filled by the call that created them.
    expect(res.becameVisible).toEqual(["orders[1].ref", "orders[1].items[0].sku", "orders[1].items"]);
    expect(iv.data).toEqual({ orders: [{ ref: "PO-1" }, { ref: "PO-2", items: [{ sku: "D-4" }] }] });
  });

  test("Three levels in one call, and field order across kinds", async () => {
    const iv = await createInterview(ordersJson({ panelCount: 0 }));
    const res = await iv.answerAll({
      orders: [{ ref: "PO-1", items: [{ sku: "A-1", notes: [{ text: "fragile" }, { text: "urgent" }] }] }],
    });
    expect(res.errors).toEqual([]);
    expect(iv.data).toEqual({
      orders: [{ ref: "PO-1", items: [{ sku: "A-1", notes: [{ text: "fragile" }, { text: "urgent" }] }] }],
    });

    // "ref" is listed before "items", so it is written first whatever the object's key order: the
    // setValueIf of a cell that reads {panel.ref} fires on the ref, and the value sent for the cell is
    // written after it.
    const ordered = await createInterview(ordersJson(undefined, [
      { type: "text", name: "ref", title: "Reference" },
      itemsMatrix({ detailPanelMode: "none" }, [
        { name: "copy", title: "Copy", cellType: "text", setValueIf: "{panel.ref} notempty",
          setValueExpression: "{panel.ref}" },
      ]),
    ]));
    const written = await ordered.answerAll({ orders: [{ items: [{ copy: "mine" }], ref: "PO-9" }] });
    expect(written.errors).toEqual([]);
    expect(ordered.data).toEqual({ orders: [{ ref: "PO-9", items: [{ copy: "mine" }] }] });
  });

  test("null on a container field leaves it alone; anything else of the wrong shape is badRecord", async () => {
    const iv = await createInterview(withQty({ rowCount: 1, maxRowCount: 2 }));
    await iv.answerAll({ orders: [{ ref: "PO-1", items: [{ sku: "A-1", notes: [{ text: "x" }] }] }] });
    const before = JSON.stringify(iv.data);
    // null at every level: nothing written, nothing removed, nothing to report.
    const nothing = await iv.answerAll({ orders: [{ items: null }] });
    expect(nothing.errors).toEqual([]);
    await iv.answerAll({ orders: [{ items: [{ notes: null }] }] });
    expect(JSON.stringify(iv.data)).toBe(before);

    // A string where a list belongs: that field alone is skipped, and the ref of the record is written.
    const scalar = await iv.answerAll({ orders: [{ ref: "PO-2", items: "A-1" }] });
    expect(scalar.errors.map(error => ({ name: error.name, code: error.code })))
      .toEqual([{ name: "orders[0].items", code: InterviewErrorCodes.badRecord }]);
    expect(iv.data.orders[0].ref).toBe("PO-2");

    // A null past the inner count names nothing to remove.
    const past = await iv.answerAll({ orders: [{ items: [{}, null] }] });
    expect(past.errors.map(error => ({ name: error.name, code: error.code })))
      .toEqual([{ name: "orders[0].items[1]", code: InterviewErrorCodes.badRecord }]);

    // An inner list that does not fit: nothing of it is written, and the rest of the record is.
    const overflow = await iv.answerAll({ orders: [{ ref: "PO-3", items: [{ sku: "changed" }, {}, {}] }] });
    expect(overflow.errors.length).toBe(1);
    expect(overflow.errors[0].code).toBe(InterviewErrorCodes.cannotAdd);
    expect(overflow.errors[0].name).toBe("orders[0].items[2]");
    expect(overflow.errors[0].message).toContain("No entry can be added to \"orders[0].items\" at position 2");
    expect(iv.data.orders[0].ref).toBe("PO-3");
    expect(iv.data.orders[0].items[0].sku).toBe("A-1");
    expect(iv.survey.getQuestionByName("orders").panels[0].getQuestionByName("items").rowCount).toBe(1);
  });

  test("cannotRemove, unknownQuestion and the comment key, one and two levels down", async () => {
    const iv = await createInterview(withQty({ allowRemoveRows: false }, { panelCount: 1 }));
    await iv.answerAll({ orders: [{ items: [{ sku: "A-1" }] }] });
    const locked = await iv.answerAll({ orders: [{ ref: "PO-1", items: [null] }] });
    expect(locked.errors.map(error => ({ name: error.name, code: error.code })))
      .toEqual([{ name: "orders[0].items[0]", code: InterviewErrorCodes.cannotRemove }]);
    expect(iv.data.orders[0]).toEqual({ ref: "PO-1", items: [{ sku: "A-1" }] });

    // The message lists the row's fields, the detail questions included: the survey knows them.
    const unknown = await iv.answerAll({ orders: [{ items: [{ colour: "red" }] }] });
    expect(unknown.errors[0].code).toBe(InterviewErrorCodes.unknownQuestion);
    expect(unknown.errors[0].name).toBe("orders[0].items[0].colour");
    expect(unknown.errors[0].message).toContain("\"sku\", \"qty\", \"notes\"");

    // The suffix never belongs to a container field.
    const container = await iv.answerAll({ orders: [{ "items-Comment": "x" }] });
    expect(container.errors.map(error => ({ name: error.name, code: error.code })))
      .toEqual([{ name: "orders[0].items-Comment", code: InterviewErrorCodes.unknownQuestion }]);

    // A plain field two levels down takes its comment key as it does one level down.
    const comment = await createInterview(ordersJson(undefined, [
      itemsMatrix({ detailPanelMode: "none" }, [
        { name: "kind", title: "Kind", cellType: "dropdown", choices: ["box"], showOtherItem: true },
      ]),
    ]));
    const res = await comment.answerAll({ orders: [{ items: [{ kind: "other", "kind-Comment": "crate" }] }] });
    expect(res.errors).toEqual([]);
    expect(comment.data).toEqual({ orders: [{ items: [{ kind: "other", "kind-Comment": "crate" }] }] });
  });

  test("Positions are entries at every level, and outer removals run last", async () => {
    const both = async (value: any): Promise<IInterview> => {
      const iv = await createInterview(withQty({ minRowCount: 0, isRequired: false }, { panelCount: 2 }));
      await iv.answerAll({ orders: [{ ref: "A", items: [{ sku: "A-1" }] }, { ref: "B", items: [{ sku: "B-1" }] }] });
      const res = await iv.answerAll(value);
      expect(res.errors).toEqual([]);
      return iv;
    };
    const kept = await both({ orders: [{ items: [{ sku: "X" }] }, null] });
    expect(kept.data).toEqual({ orders: [{ ref: "A", items: [{ sku: "X" }] }] });
    // The other way round: the patch lands on the entry that was at position 1 although position 0 is
    // removed in the same call.
    const shifted = await both({ orders: [null, { items: [{ sku: "Y" }] }] });
    expect(shifted.data).toEqual({ orders: [{ ref: "B", items: [{ sku: "Y" }] }] });

    // An inner patch that hides an inner entry a later inner null targets: the tier-08 rule, one
    // level down - the position was resolved to the row before anything was written.
    const inner = await createInterview(ordersJson(undefined, [
      itemsMatrix({ rowCount: 3, minRowCount: 0, isRequired: false, detailPanelMode: "none",
        rowsVisibleIf: "{row.keep} <> false" }, [{ name: "sku", cellType: "text" }, { name: "keep", cellType: "boolean" }]),
    ]));
    await inner.answerAll({ orders: [{ items: [{ sku: "A" }, { sku: "B" }, { sku: "C" }] }] });
    const hid = await inner.answerAll({ orders: [{ items: [{ keep: false }, { sku: "B2" }, null] }] });
    expect(hid.errors).toEqual([]);
    expect(inner.data.orders[0].items).toEqual([{ sku: "A", keep: false }, { sku: "B2" }]);

    // An outer patch that hides the outer entry whose inner list a later record of the same call
    // targets: that entry is no longer being asked for.
    const outer = await createInterview(ordersJson({ panelCount: 2,
      templateVisibleIf: "{orders[0].ref} <> 'hide'" }, [
      { type: "text", name: "ref", title: "Reference" },
      itemsMatrix({ minRowCount: 0, isRequired: false, detailPanelMode: "none" }),
    ]));
    const hidden = await outer.answerAll({ orders: [{ ref: "hide" }, { items: [{ sku: "Z" }] }] });
    expect(hidden.errors.map(error => ({ name: error.name, code: error.code })))
      .toEqual([{ name: "orders[1]", code: InterviewErrorCodes.notAskable }]);
  });

  test("Validation is recursive, and an empty required field of a new entry is work, not an error", async () => {
    // A duplicated key inside a nested dynamic panel.
    const keyed = await createInterview(ordersJson(undefined, [
      { type: "paneldynamic", name: "notes", title: "Notes", panelCount: 0, keyName: "title",
        templateElements: [{ type: "text", name: "title", title: "Title" }] },
    ]));
    const duplicate = await keyed.answerAll({ orders: [{ notes: [{ title: "same" }, { title: "same" }] }] });
    expect(duplicate.errors.map(error => error.name)).toEqual(["orders[0].notes[1].title"]);
    expect(keyed.getBatchDocument().items.map(item => item.name)).toEqual(["orders"]);

    // A row added inside a panel added in the same call, its required cell left empty.
    const iv = await createInterview(withQty({ rowCount: 0, minRowCount: 0, isRequired: false }, { panelCount: 0 }));
    const res = await iv.answerAll({ orders: [{ ref: "PO-1", items: [{ qty: 1 }] }, { items: [{ qty: 2 }] }] });
    expect(res.errors).toEqual([]);
    const sku = recordOf(rootRecord(iv, "orders"), "entries", 1, "items", "entries", 0, "sku");
    expect(sku.value).toBeUndefined();
    expect(sku.error).toBeUndefined();
    const done = await iv.complete();
    expect(done.completed).toBe(false);
    expect(done.errors.map(error => error.name)).toEqual(["orders[0].items[0].sku", "orders[1].items[0].sku"]);

    // A required nested dynamic panel with no entries: listed, required, and reported at complete().
    const required = await createInterview(ordersJson(undefined, [
      { type: "text", name: "ref", title: "Reference" },
      Object.assign({}, NOTES, { isRequired: true }),
    ]));
    await required.answerAll({ orders: [{ ref: "PO-1" }] });
    const listed = required.getBatchDocument().items;
    expect(listed.map(item => item.name)).toEqual(["orders"]);
    expect(recordOf(listed[0], "entries", 0, "notes").required).toBe(true);
    const blocked = await required.complete();
    expect(blocked.errors.map(error => error.name)).toEqual(["orders[0].notes"]);
  });

  test("The predicates are recursive", async () => {
    const iv = await createInterview(ordersJson({ panelCount: 0 }, [
      { type: "text", name: "ref", title: "Reference", isRequired: true },
      itemsMatrix({ rowCount: 0 }, [SKU]),
      // Optional and left empty: it does not make the root invalid.
      { type: "multipletext", name: "contact", title: "Contact", items: [{ name: "email" }] },
    ]));
    const res = await iv.answerAll({
      orders: [{ ref: "PO-1", items: [{ sku: "A-1", notes: [{ text: "fragile" }] }] }],
    });
    expect(res.errors).toEqual([]);
    expect(res.current).toBe(null);
    const document = iv.getBatchDocument();
    expect(document.items).toEqual([]);
    expect(document.answered.orders).toEqual([{ ref: "PO-1", items: [{ sku: "A-1", notes: [{ text: "fragile" }] }] }]);

    // An empty required field three levels down keeps the root listed, and it is current.
    const deep = await createInterview(ordersJson({ panelCount: 0 }));
    const partial = await deep.answerAll({ orders: [{ items: [{ sku: "A-1", notes: [{}] }] }] });
    expect(partial.current).toBe(null);
    const strict = await createInterview(ordersJson({ panelCount: 0 }, [
      itemsMatrix({ rowCount: 0 }, [SKU]),
    ]));
    const open = await strict.answerAll({ orders: [{ items: [{ notes: [{ text: "x" }] }] }] });
    expect(open.current.name).toBe("orders");
    expect(recordOf(rootRecord(strict, "orders"), "entries", 0, "items", "entries", 0, "sku").value)
      .toBeUndefined();
  });

  test("A batch write drops the single-mode done of the nested container it writes, and the root's", async () => {
    const iv = await createInterview(ordersJson(undefined, [
      { type: "text", name: "ref", title: "Reference" },
      itemsMatrix({ isRequired: false, minRowCount: 0, detailPanelMode: "none" }),
    ]));
    await iv.answer("orders[0].ref", "PO-1");
    await iv.answer("orders[0].items[0].sku", "A-1");
    await iv.answer("orders[0].items", { action: "done" });
    await iv.answer("orders", { action: "done" });
    expect(iv.current()).toBe(null);
    await iv.answerAll({ orders: [{ items: [{ sku: "A-2" }] }] });
    // Both lists are open again: the inner one is current first, where the mode puts it.
    expect(iv.current().name).toBe("orders[0].items");
    await iv.answer({ action: "done" });
    expect(iv.current().name).toBe("orders");
  });

  test("Declaration mode: a container inside a template has no entries, no value and no error", async () => {
    const survey = new SurveyModel({
      elements: [
        { type: "paneldynamic", name: "outer", title: "Outer", panelCount: 1, templateElements: [
          { type: "paneldynamic", name: "inner", title: "Inner", panelCount: 2,
            templateElements: [{ type: "text", name: "leaf", title: "Leaf", defaultValue: "seed" }] },
          { type: "paneldynamic", name: "must", title: "Must", isRequired: true, minPanelCount: 1,
            templateElements: [{ type: "text", name: "x", title: "X" }] },
        ] },
        { type: "matrixdynamic", name: "lines", title: "Lines", rowCount: 0, cellType: "text",
          columns: [{ name: "code", title: "Code" }], detailPanelMode: "underRow",
          detailElements: [{ type: "matrixdropdown", name: "sizes", title: "Sizes", cellType: "text",
            columns: [{ name: "count", title: "Count", defaultValue: "1" }], rows: ["s"] }] },
      ],
    });
    const iv = await createInterview(survey);
    const template: any = (<any>survey.getQuestionByName("outer")).template;
    const countPanels = (): number => template.getQuestionByName("inner").getPropertyValue("panels").length;
    const before = countPanels();
    const outer = rootRecord(iv, "outer");
    const declared = recordOf(outer, "template", "inner");
    expect(declared.template.map(field => field.name)).toEqual(["leaf"]);
    expect(declared.canAdd).toBe(true);
    const text = JSON.stringify(outer.template);
    expect(text).not.toContain("\"entries\"");
    expect(text).not.toContain("\"value\"");
    expect(text).not.toContain("\"error\"");
    // The same question, live in the entry that exists: two panels, the default as their value.
    const live = recordOf(outer, "entries", 0, "inner");
    expect(live.entries.map(entry => entry.fields[0].value)).toEqual(["seed", "seed"]);
    // A matrix dropdown in the detail panel of a template: rows, and no value in any of them.
    const sizes = recordOf(rootRecord(iv, "lines"), "template", "sizes");
    expect(sizes.rows.map(row => row.name)).toEqual(["s"]);
    expect(JSON.stringify(sizes)).not.toContain("\"value\"");
    // Describing never builds the panels of a template's own question - whatever the model itself
    // built when it loaded - and never reads the ones there are: no default value above came from them.
    iv.describeAll();
    iv.getAnswerSchema();
    expect(countPanels()).toBe(before);
  });

  test("One snapshot per call: an error nobody asked for is dropped at every depth", async () => {
    // A required question in front keeps the model's current input outside the orders. Standing on
    // the empty sku, the model's own navigation would validate that row for the step's actions - the
    // matrix's single-input behavior validates a row that holds a value with persisted errors - and
    // put "Response required." back after the call cleared it.
    const json = (): any => {
      const res = withQty({ rowCount: 1, minRowCount: 0, isRequired: false, detailPanelMode: "none" });
      res.elements.unshift({ type: "text", name: "first", isRequired: true });
      return res;
    };
    const iv = await createInterview(json());
    const res = await iv.answerAll({ orders: [{ ref: "PO-1", items: [{ qty: 2 }] }] });
    expect(res.errors).toEqual([]);
    const sku = recordOf(rootRecord(iv, "orders"), "entries", 0, "items", "entries", 0, "sku");
    expect(sku.value).toBeUndefined();
    expect(sku.error).toBeUndefined();

    // The same sequence on a sku that was invalid before the call: it keeps its error.
    const invalid = await createInterview(json());
    await invalid.complete();
    const again = await invalid.answerAll({ orders: [{ ref: "PO-1", items: [{ qty: 2 }] }] });
    expect(again.errors).toEqual([]);
    const kept = recordOf(rootRecord(invalid, "orders"), "entries", 0, "items", "entries", 0, "sku");
    expect(kept.error).toBeDefined();
  });

  test("The depth ceiling: the grammar, the inventory, the documents and the panels agree", async () => {
    // 22 dynamic containers deep, each with one entry and a "leaf" beside the next container: p<k>
    // sits at depth k, and the leaf inside it at depth k + 1. Dynamic matrices whose detail panel holds
    // the next one rather than dynamic panels: the model itself builds a chain of 22 nested dynamic
    // panels in time that grows several-fold per level (a single SurveyModel takes seconds at 10), while
    // the matrix chain builds in milliseconds - and its entries are addressed by the same grammar,
    // "p0[0].p1[0].leaf".
    const deepJson = (): any => {
      let template: Array<any> = [{ type: "text", name: "leaf" }];
      for (let level = 21; level >= 0; level--) {
        const container = { type: "matrixdynamic", name: "p" + level, rowCount: 1,
          columns: [{ name: "c", cellType: "text" }], detailPanelMode: "underRow", detailElements: template };
        template = [{ type: "text", name: "leaf" }, container];
      }
      return { elements: [template[1]] };
    };
    const iv = await createInterview(deepJson());
    const pathTo = (depth: number): string => {
      const segments: Array<string> = [];
      for (let level = 0; level < depth; level++) segments.push("p" + level + "[0]");
      return segments.join(".");
    };
    // The record at depth 20 is the one thing a batch cannot fill.
    let record: any = rootRecord(iv, "p0");
    for (let level = 1; level <= MAX_NESTING_DEPTH; level++) {
      record = recordOf(record, "entries", 0, "p" + level);
    }
    expect(record.unsupported).toBe(true);
    expect(record.reason).toBe("batch");
    expect(record.template).toBeUndefined();
    expect(record.entries).toBeUndefined();
    expect(typeof iv.describeAll()).toBe("string");
    // A key for it: built as the value an agent would send, one record per level.
    let value: any = [{}];
    for (let level = MAX_NESTING_DEPTH - 1; level >= 0; level--) {
      value = [{ ["p" + (level + 1)]: value }];
    }
    const refused = await iv.answerAll({ p0: value });
    expect(refused.errors.map(error => ({ name: error.name, code: error.code })))
      .toEqual([{ name: pathTo(MAX_NESTING_DEPTH) + ".p20", code: InterviewErrorCodes.notAskable }]);
    expect(refused.errors[0].message).toContain("neither mode reaches it");

    // The leaf at depth 20 exists: 21 segments, an item.
    const leaf20 = pathTo(MAX_NESTING_DEPTH) + ".leaf";
    expect(leaf20.split(".").length).toBe(MAX_NESTING_DEPTH + 1);
    expect(parseAddress(leaf20).length).toBe(MAX_NESTING_DEPTH + 1);
    expect((await iv.answer(leaf20, "deep")).errors).toEqual([]);
    // The leaf at depth 21 does not: no address, no item, no record, and its text is not an address.
    // The interview created no panel at the ceiling; the test opens the one the leaf lives in.
    const deepLeaf = findDeepLeaf(iv.survey, 21);
    expect(getAddress(deepLeaf)).toBeUndefined();
    const text21 = pathTo(21) + ".leaf";
    expect(parseAddress(text21)).toBeUndefined();
    const bad = await iv.answer(text21, "x");
    expect(bad.errors[0].code).toBe(InterviewErrorCodes.badAddress);
    expect(iv.describeAll()).not.toContain("p21");
    // A value below the ceiling, written past the interview, is in no progress, no answered map and
    // no change report: those are taken over the inputs above the ceiling only.
    deepLeaf.value = "below";
    const document = iv.getSingleDocument();
    expect(document.progress.answered).toBe(1);
    expect(JSON.stringify(document)).not.toContain("below");
    expect(JSON.stringify(document)).not.toContain("p21");
    const changed = await iv.answer(leaf20, "deeper");
    expect(changed.becameVisible).toEqual([]);

    // The materialization pass stops at the same depth: panels down to depth 20 and none below.
    const matrices = new SurveyModel(deepJson());
    ensureDetailPanels(matrices);
    let matrix: any = matrices.getQuestionByName("p0");
    let created = 0;
    for (let level = 0; level <= 21 && !!matrix; level++) {
      const row = matrix.visibleRows[0];
      if (!row.detailPanel) break;
      created++;
      matrix = row.detailPanel.getQuestionByName("p" + (level + 1));
    }
    expect(created).toBe(MAX_NESTING_DEPTH);
  });

  test("Titles and error texts three levels down are localized, and the schema description is not", async () => {
    const survey = new SurveyModel(ordersJson({ panelCount: 0 }, [
      itemsMatrix({ rowCount: 0 }, [SKU]),
    ]));
    // The note of the innermost level has a German title and an e-mail input.
    const notes: any = survey.getQuestionByName("orders").template.getQuestionByName("items");
    notes.detailPanel.getQuestionByName("notes").template.getQuestionByName("text").fromJSON({
      title: { default: "Note", de: "Notiz" }, inputType: "email",
    });
    survey.locale = "de";
    const iv = await createInterview(survey);
    const res = await iv.answerAll({ orders: [{ items: [{ sku: "A-1", notes: [{ text: "nope" }] }] }] });
    expect(res.errors.map(error => error.name)).toEqual(["orders[0].items[0].notes[0].text"]);
    expect(res.errors[0].message).toBe((<any>surveyLocalization.locales["de"]).invalidEmail);
    expect(recordOf(rootRecord(iv, "orders"), "entries", 0, "items", "entries", 0, "notes",
      "entries", 0, "text").title).toBe("Notiz");
    expect(iv.getAnswerSchema().properties.orders.description).toContain("A list of entries by position.");
  });
});

// The leaf in the detail panel of the only row of p<depth - 1>, walked down through the live rows. A
// panel nothing created yet - the one at the ceiling - is opened on the way.
function findDeepLeaf(survey: SurveyModel, depth: number): any {
  const panelOf = (matrix: any): any => {
    const row = matrix.visibleRows[0];
    if (!row.detailPanel) row.showDetailPanel();
    return row.detailPanel;
  };
  let container: any = survey.getQuestionByName("p0");
  for (let level = 1; level < depth; level++) {
    container = panelOf(container).getQuestionByName("p" + level);
  }
  return panelOf(container).getQuestionByName("leaf");
}
