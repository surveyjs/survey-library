// @vitest-environment node
// The address grammar is a pure function of the model: no DOM anywhere in it.
import { createInterview, InterviewErrorCodes } from "survey-core/interview";
import { SurveyModel } from "survey-core";
import { SurveyTestTargets } from "survey-core/tester";
import type { Question } from "survey-core";

import { describe, expect, test } from "vitest";

// The fixture of the issue's address table, with every container type in it and two levels of
// nesting. Nothing is answered: an address exists because the structure does, not because a value
// does.
const addressJson = {
  elements: [
    { type: "text", name: "email", title: "Email" },
    { type: "paneldynamic", name: "medications", panelCount: 2, templateElements: [
      { type: "text", name: "dose", title: "Dose" },
    ] },
    { type: "matrixdynamic", name: "items", rowCount: 2, columns: [
      { name: "quantity", cellType: "text" },
    ] },
    { type: "matrixdropdown", name: "matrix", rows: ["row1", "row2"], columns: [
      { name: "column1", cellType: "text" },
    ] },
    { type: "matrix", name: "satisfaction", rows: ["price", "quality"], columns: ["low", "high"] },
    { type: "multipletext", name: "contact", items: [{ name: "email" }, { name: "phone" }] },
    { type: "paneldynamic", name: "orders", panelCount: 2, templateElements: [
      { type: "matrixdynamic", name: "items", rowCount: 2, columns: [{ name: "sku", cellType: "text" }] },
    ] },
  ],
};

// The addresses of that fixture, in inventory order. It is the whole table of the issue in one
// place: if a segment rule changes, this list says so.
const addressList = [
  "email",
  "medications[0].dose",
  "medications[1].dose",
  "medications",
  "items[0].quantity",
  "items[1].quantity",
  "items",
  "matrix.row1.column1",
  "matrix.row2.column1",
  "satisfaction.price",
  "satisfaction.quality",
  "contact.email",
  "contact.phone",
  "orders[0].items[0].sku",
  "orders[0].items[1].sku",
  "orders[0].items",
  "orders[1].items[0].sku",
  "orders[1].items[1].sku",
  "orders[1].items",
  "orders",
];

// The four of them that are a container's summary step and take an action instead of a value.
const summaryAddresses = ["medications", "items", "orders[0].items", "orders[1].items", "orders"];

function createAddressInterview(): Promise<any> {
  return createInterview(new SurveyModel(addressJson));
}

// Every address the interview hands out, in order, walked the way a consumer walks them: ask what is
// current, leave it alone, ask again. A summary step is optional, so skip() moves past it too.
async function collectAddresses(iv: any): Promise<Array<string>> {
  const res: Array<string> = [];
  for (let guard = 0; guard < 100; guard++) {
    const current = iv.current();
    if (!current) break;
    res.push(current.name);
    const result = await iv.skip();
    if (result.errors.length > 0) break;
  }
  return res;
}

describe("interview addresses (issue #11818)", () => {
  test("Every input of the fixture, in order, at the address of the issue's table", async () => {
    const iv = await createAddressInterview();
    expect(await collectAddresses(iv)).toEqual(addressList);
  });

  test("Every address resolves back to the input it was built for", async () => {
    const iv = await createAddressInterview();
    for (let i = 0; i < addressList.length; i++) {
      const address = addressList[i];
      // A container takes an action and not a value; its own address is covered by the summary tests.
      if (summaryAddresses.indexOf(address) >= 0) continue;
      const isRow = address.indexOf("satisfaction.") === 0;
      const result = await iv.answer(address, isRow ? "low" : "v-" + i);
      expect(result.errors, address).toEqual([]);
    }
    expect(iv.data).toEqual({
      email: "v-0",
      medications: [{ dose: "v-1" }, { dose: "v-2" }],
      items: [{ quantity: "v-4" }, { quantity: "v-5" }],
      matrix: { row1: { column1: "v-7" }, row2: { column1: "v-8" } },
      satisfaction: { price: "low", quality: "low" },
      contact: { email: "v-11", phone: "v-12" },
      orders: [
        { items: [{ sku: "v-13" }, { sku: "v-14" }] },
        { items: [{ sku: "v-16" }, { sku: "v-17" }] },
      ],
    });
  });

  // The twin-grammar guard. The tester writes the same paths for the same objects, and the two
  // implementations are separate only because a sub-bundle may import nothing but "survey-core".
  // Where the tester has a name at all - it has none for a multiple-text item, a composite's content
  // question or a synthesized matrix row - it must be the interview's address, character for
  // character.
  test("Where SurveyTestTargets.nameOf answers, it answers with the same address", async () => {
    const survey = new SurveyModel(addressJson);
    const iv = await createInterview(survey);
    const addresses = await collectAddresses(iv);
    const checked: Array<string> = [];
    addresses.forEach(address => {
      const question = findQuestionByAddress(survey, address);
      if (!question) return;
      const name = SurveyTestTargets.nameOf(survey, question);
      if (name === undefined) return;
      checked.push(address);
      expect(name, "the tester and the interview address " + address + " the same way").toBe(address);
    });
    // The guard is worthless if it checked nothing: the nested cases have to be among them.
    expect(checked).toContain("medications[0].dose");
    expect(checked).toContain("matrix.row1.column1");
    expect(checked).toContain("orders[1].items[0].sku");
  });

  test("A segment that carries a delimiter is quoted, and reads back", async () => {
    const survey = new SurveyModel({
      elements: [
        { type: "multipletext", name: "contact", items: [{ name: "e.mail" }] },
        { type: "matrixdropdown", name: "matrix", rows: ["row.one"],
          columns: [{ name: "c1", cellType: "text" }] },
      ],
    });
    const iv = await createInterview(survey);
    expect(iv.current().name).toBe("contact.\"e.mail\"");
    let result = await iv.answer("a@b.c");
    expect(result.errors).toEqual([]);
    expect(result.current.name).toBe("matrix.\"row.one\".c1");
    result = await iv.answer("matrix.\"row.one\".c1", "x");
    expect(result.errors).toEqual([]);
    expect(iv.data).toEqual({ contact: { "e.mail": "a@b.c" }, matrix: { "row.one": { c1: "x" } } });
    // The quoted segment is a quoted YAML key on top of it, by the scalar rule of tier 03.
    expect(iv.describe()).toContain("\"contact.\\\"e.mail\\\"\": a@b.c");
  });

  test("Malformed text is badAddress, and so is an index past the entries there are", async () => {
    const iv = await createAddressInterview();
    const malformed = ["", "medications[", "medications[0", "medications[0].", ".dose",
      "medications[a].dose", "medications[].dose", "medications..dose", "medications[0]]",
      "contact.\"e.mail", "medications[-1].dose"];
    for (let i = 0; i < malformed.length; i++) {
      const result = await iv.answer(malformed[i], "x");
      expect(result.errors.length, malformed[i]).toBe(1);
      expect(result.errors[0].code, malformed[i]).toBe(InterviewErrorCodes.badAddress);
    }
    // Well formed, and the entry simply does not exist: the summary step's "add" is how one is made,
    // which is why this is not "unknownQuestion".
    const outOfRange = await iv.answer("medications[2].dose", "x");
    expect(outOfRange.errors[0].code).toBe(InterviewErrorCodes.badAddress);
    // A name nothing answers to is the other error, and it lists what is being asked for.
    const unknown = await iv.answer("nowhere", "x");
    expect(unknown.errors[0].code).toBe(InterviewErrorCodes.unknownQuestion);
    expect(unknown.errors[0].message).toContain("medications[0].dose");
  });

  test("An address that names a panel or a row answers nothing", async () => {
    const iv = await createAddressInterview();
    const result = await iv.answer("medications[0]", "x");
    expect(result.errors[0].code).toBe(InterviewErrorCodes.unknownQuestion);
  });

  test("A question with valueName keeps its name in the address and its value under the valueName", async () => {
    const iv = await createInterview({
      elements: [
        { type: "text", name: "email", valueName: "contactEmail" },
        { type: "paneldynamic", name: "medications", valueName: "meds", panelCount: 1,
          templateElements: [{ type: "text", name: "dose" }] },
      ],
    });
    expect(iv.current().name).toBe("email");
    await iv.answer("a@b.c");
    expect(iv.current().name).toBe("medications[0].dose");
    await iv.answer("10mg");
    await iv.answer({ action: "done" });
    expect(iv.data).toEqual({ contactEmail: "a@b.c", meds: [{ dose: "10mg" }] });
  });
});

// The survey side of the round trip, written here rather than borrowed from the module: a test that
// looked the question up the way the resolver does would only agree with itself.
function findQuestionByAddress(survey: SurveyModel, address: string): Question {
  const parts = address.split(".");
  let obj: any = undefined;
  for (let i = 0; i < parts.length; i++) {
    const bracket = parts[i].indexOf("[");
    const name = bracket < 0 ? parts[i] : parts[i].substring(0, bracket);
    const index = bracket < 0 ? -1 : parseInt(parts[i].substring(bracket + 1, parts[i].length - 1), 10);
    obj = i === 0 ? survey.getQuestionByName(name) : findChild(obj, name);
    if (!obj) return undefined;
    if (index >= 0) {
      obj = Array.isArray(obj.panels) ? obj.visiblePanels[index] : obj.visibleRows[index];
      if (!obj) return undefined;
    }
  }
  return obj;
}

function findChild(obj: any, name: string): any {
  if (typeof obj.getMatrixSingleInputQuestions === "function") {
    return obj.getMatrixSingleInputQuestions(undefined, true).filter((q: any) => q.name === name)[0];
  }
  if (Array.isArray(obj.visibleRows) && typeof obj.addRow !== "function") {
    const row = obj.visibleRows.filter((r: any) => String(r.rowName) === name)[0];
    if (!!row) return row;
  }
  if (typeof obj.getQuestionByName === "function" && !!obj.getQuestionByName(name)) {
    return obj.getQuestionByName(name);
  }
  return obj.getNestedQuestions(true, false).filter((q: any) => q.name === name)[0];
}
