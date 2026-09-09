// @vitest-environment node
// The entries of a dynamic container as batch records. An agent runs on a server; nothing here
// needs a DOM.
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

function medicationsJson(extra?: any, template?: Array<any>): any {
  return {
    title: "Health check",
    elements: [Object.assign({
      type: "paneldynamic", name: "medications", title: "Medications",
      templateElements: template || [
        { type: "text", name: "name", title: "Name", isRequired: true },
        { type: "text", name: "dose", title: "Dose" },
      ],
    }, extra || {})],
  };
}

function itemsJson(extra?: any, columns?: Array<any>): any {
  return {
    elements: [Object.assign({
      type: "matrixdynamic", name: "items", title: "Items",
      columns: columns || [{ name: "sku", title: "SKU", cellType: "text" }],
    }, extra || {})],
  };
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

describe("interview dynamic containers in batch mode (issue #11818)", () => {
  test("A dynamic panel is one record with its entries, its template and canAdd", async () => {
    const survey = new SurveyModel(medicationsJson({
      isRequired: true, panelCount: 2, minPanelCount: 1, maxPanelCount: 5,
    }));
    // An error text without a constraint of its own: the record of a field carries whatever error the
    // model persisted for it, and a validator would have added a "constraints" key to the record too.
    survey.onValidateQuestion.add((_, options) => {
      if (options.name === "dose" && options.value === "10 mg") {
        options.error = "Please enter a number followed by a unit";
      }
    });
    const iv = await createInterview(survey);
    await iv.answerAll({ medications: [{ name: "Aspirin", dose: "10 mg" }] });
    expect(iv.describeAll()).toContain(block(
      "  - name: medications",
      "    type: paneldynamic",
      "    title: Medications",
      "    required: true",
      "    constraints:",
      "      minCount: 1",
      "      maxCount: 5",
      "    entries:",
      "      - index: 0",
      "        canRemove: true",
      "        fields:",
      "          - name: name",
      "            type: text",
      "            title: Name",
      "            required: true",
      "            value: Aspirin",
      "          - name: dose",
      "            type: text",
      "            title: Dose",
      "            required: false",
      "            value: 10 mg",
      "            error: Please enter a number followed by a unit",
      "      - index: 1",
      "        canRemove: true",
      "        fields:",
      "          - name: name",
      "            type: text",
      "            title: Name",
      "            required: true",
      "          - name: dose",
      "            type: text",
      "            title: Dose",
      "            required: false",
      "    template:",
      "      - name: name",
      "        type: text",
      "        title: Name",
      "        required: true",
      "      - name: dose",
      "        type: text",
      "        title: Dose",
      "        required: false",
      "    canAdd: true"
    ));
  });

  test("A dynamic matrix reports its rows as entries, and a column inherits the matrix choices", async () => {
    const iv = await createInterview(itemsJson({ rowCount: 2, choices: ["low", "high"] },
      [{ name: "col", title: "Col", cellType: "dropdown", isRequired: true }]));
    const document = iv.describeAll();
    expect(document).toContain(block(
      "    entries:",
      "      - index: 0",
      "        canRemove: true",
      "        fields:",
      "          - name: col",
      "            type: dropdown",
      "            title: Col",
      "            required: true",
      "            choices:",
      "              - value: low",
      "              - value: high"
    ));
    // The column's own templateQuestion is not bound to the matrix's "choices", so it is described
    // from the first existing row instead. No row is ever created to read it: with none, the template
    // says what it can and the entry's fields are the truth once an entry exists.
    expect(document).toContain(block(
      "    template:",
      "      - name: col",
      "        type: dropdown",
      "        title: Col",
      "        required: true",
      "        choices:",
      "          - value: low",
      "          - value: high"
    ));
  });

  test("An empty container has no entries key, and canAdd is the whole story", async () => {
    const iv = await createInterview(medicationsJson({ isRequired: true, panelCount: 0 }));
    const document = iv.describeAll();
    expect(document).not.toContain("entries:");
    expect(document).toContain("    canAdd: true");
    expect(document).toContain("    template:");
    // Listed: a required container with no entries is neither answered nor valid.
    expect(iv.getBatchDocument().items.length).toBe(1);
  });

  test("canAdd and canRemove are the model's own permissions", async () => {
    const full = await createInterview(medicationsJson({ panelCount: 2, maxPanelCount: 2 }));
    expect(full.getBatchDocument().items[0].canAdd).toBe(false);
    const locked = await createInterview(medicationsJson({ panelCount: 2, allowRemovePanel: false }));
    const entries = locked.getBatchDocument().items[0].entries;
    expect(entries.map(entry => entry.canRemove)).toEqual([false, false]);

    const survey = new SurveyModel(itemsJson({ rowCount: 2 },
      [{ name: "sku", title: "SKU", isRequired: true }]));
    // Per row, exactly as the summary step's remove button is: canRemoveRows && canRemoveRow(row).
    survey.onMatrixRenderRemoveButton.add((_, options) => {
      if (options.rowIndex === 0) options.allow = false;
    });
    const iv = await createInterview(survey);
    expect(iv.getBatchDocument().items[0].entries.map(entry => entry.canRemove)).toEqual([false, true]);
  });

  test("The transcript of the README: three turns, then complete()", async () => {
    const survey = new SurveyModel(medicationsJson({ isRequired: true, panelCount: 0 }));
    survey.onValidateQuestion.add((_, options) => {
      if (options.name === "dose" && !!options.value && !/^\d+ [a-z]+$/.test(options.value)) {
        options.error = "Please enter a number followed by a unit";
      }
    });
    const iv = await createInterview(survey);
    const sent: Array<any> = [
      { medications: [{ name: "Aspirin", dose: "10 mg" }, { name: "Ibuprofen", dose: "twice a day" }] },
      // The fix and the removal in one turn: patches run before removals, so the fix lands on the
      // entry the agent read at position 1 whatever the removal does to the positions.
      { medications: [null, { dose: "400 mg" }] },
    ];
    let turn = 0;
    const turns = await runAgentLoop(iv, () => sent[turn++] || {});
    expect(turn).toBe(2);
    expect(turns).toBe(2);
    const done = await iv.complete();
    expect(done.completed).toBe(true);
    expect(done.data).toEqual({ medications: [{ name: "Ibuprofen", dose: "400 mg" }] });
  });

  test("A patch writes the keys it carries and leaves the others as they are", async () => {
    const iv = await createInterview(medicationsJson({ panelCount: 1 }));
    await iv.answerAll({ medications: [{ name: "Aspirin", dose: "10 mg" }] });
    const res = await iv.answerAll({ medications: [{ dose: "20 mg" }] });
    expect(res.errors).toEqual([]);
    expect(iv.data).toEqual({ medications: [{ name: "Aspirin", dose: "20 mg" }] });
    // An empty record patches nothing; the whole key null writes nothing and removes nothing.
    await iv.answerAll({ medications: [{}] });
    await iv.answerAll({ medications: null });
    expect(iv.data).toEqual({ medications: [{ name: "Aspirin", dose: "20 mg" }] });
    // A single object is wrapped: one record is one entry, at position 0.
    await iv.answerAll({ medications: { dose: "30 mg" } });
    expect(iv.data.medications[0].dose).toBe("30 mg");
  });

  test("The keys of a record are written in the entry's field order", async () => {
    const iv = await createInterview(medicationsJson({ panelCount: 1 }, [
      { type: "text", name: "name", title: "Name" },
      // Fires when the name is written, so the order of the two writes is observable in the value.
      { type: "text", name: "dose", title: "Dose", setValueIf: "{panel.name} notempty",
        setValueExpression: "'unknown'" },
    ]));
    const res = await iv.answerAll({ medications: [{ dose: "20 mg", name: "Aspirin" }] });
    expect(res.errors).toEqual([]);
    // "name" first, although the object carries "dose" first: the setValueIf ran and the dose the
    // agent sent was written after it.
    expect(iv.data).toEqual({ medications: [{ name: "Aspirin", dose: "20 mg" }] });
  });

  test("A field an earlier key of the same record reveals is written in the same call", async () => {
    const iv = await createInterview(medicationsJson({ panelCount: 1 }, [
      { type: "text", name: "name", title: "Name" },
      { type: "text", name: "dose", title: "Dose", visibleIf: "{panel.name} = 'Aspirin'" },
    ]));
    const res = await iv.answerAll({ medications: [{ dose: "10 mg", name: "Aspirin" }] });
    expect(res.errors).toEqual([]);
    expect(res.becameVisible).toEqual(["medications[0].dose"]);
    expect(iv.data).toEqual({ medications: [{ name: "Aspirin", dose: "10 mg" }] });
  });

  test("A position past the count adds an entry and fills it", async () => {
    const survey = new SurveyModel(medicationsJson({ panelCount: 2 }));
    let added = 0;
    survey.onDynamicPanelAdded.add(() => { added++; });
    const iv = await createInterview(survey);
    const res = await iv.answerAll({ medications: [{}, {}, { name: "X" }] });
    expect(res.errors).toEqual([]);
    expect(added).toBe(1);
    expect(res.becameVisible).toEqual(["medications[2].name", "medications[2].dose"]);
    expect(iv.data).toEqual({ medications: [{}, {}, { name: "X" }] });
  });

  test("A host that refuses the new row is cannotAdd, and nothing else changed", async () => {
    const survey = new SurveyModel(itemsJson({ rowCount: 1 }));
    survey.onMatrixRowAdding.add((_, options) => { options.allow = false; });
    const iv = await createInterview(survey);
    const res = await iv.answerAll({ items: [{ sku: "A-1" }, { sku: "A-2" }] });
    expect(res.errors.length).toBe(1);
    expect(res.errors[0].code).toBe(InterviewErrorCodes.cannotAdd);
    expect(res.errors[0].name).toBe("items[1]");
    // The patch of the first position ran; only the add was refused.
    expect(iv.data).toEqual({ items: [{ sku: "A-1" }] });
  });

  test("A detail panel the model opens on adding is part of the entry", async () => {
    const iv = await createInterview(itemsJson({
      rowCount: 0, detailPanelMode: "underRow", detailPanelShowOnAdding: true,
      detailElements: [
        { type: "text", name: "note", title: "Note" },
        // Left empty on purpose: the container stays listed, which is how the document can be read.
        { type: "text", name: "why", title: "Why", isRequired: true },
        { type: "matrixdynamic", name: "inner", columns: [{ name: "c" }] },
      ],
    }));
    const res = await iv.answerAll({ items: [{ sku: "A-1", note: "fragile" }] });
    expect(res.errors).toEqual([]);
    expect(iv.data.items[0]).toEqual({ sku: "A-1", note: "fragile" });
    const document = iv.getBatchDocument();
    const fields = document.items[0].entries[0].fields;
    expect(fields.map(field => field.name)).toEqual(["sku", "note", "why", "inner"]);
    // A container inside an entry is listed where it sits and never filled.
    expect(fields[3].unsupported).toBe(true);
    expect(fields[3].reason).toBe("batch");
    expect(fields[3].fields).toBeUndefined();
  });

  test("null at a position removes that entry", async () => {
    const iv = await createInterview(medicationsJson({ panelCount: 2 }));
    await iv.answerAll({ medications: [{ name: "A" }, { name: "B" }] });
    const res = await iv.answerAll({ medications: [null] });
    expect(res.errors).toEqual([]);
    expect(iv.data).toEqual({ medications: [{ name: "B" }] });
    // The addresses of the entries after the removed one shift, exactly as they do in single mode.
    expect(res.becameHidden).toEqual(["medications[1].name", "medications[1].dose"]);
  });

  test("Patch, add and remove in one call: positions name entries, not indexes", async () => {
    const iv = await createInterview(medicationsJson({ panelCount: 2 }));
    await iv.answerAll({ medications: [{ name: "A", dose: "1" }, { name: "B", dose: "2" }] });
    const res = await iv.answerAll({ medications: [{ dose: "1 mg" }, null, { name: "N" }] });
    expect(res.errors).toEqual([]);
    // Entry 0 patched, entry 1 removed, the added entry now at position 1.
    expect(iv.data).toEqual({ medications: [{ name: "A", dose: "1 mg" }, { name: "N" }] });
    // One entry came and one went, so no address of the inventory appeared or disappeared: the
    // change report is about addresses, and there are as many entries after the call as before it.
    expect(res.becameVisible).toEqual([]);
    expect(res.becameHidden).toEqual([]);
  });

  test("A host that refuses one removal does not stop the others", async () => {
    const survey = new SurveyModel(medicationsJson({ panelCount: 3 }));
    survey.onDynamicPanelRemoving.add((_, options) => {
      if (options.panel.getQuestionByName("name").value === "B") options.allow = false;
    });
    const iv = await createInterview(survey);
    await iv.answerAll({ medications: [{ name: "A" }, { name: "B" }, { name: "C" }] });
    const res = await iv.answerAll({ medications: [null, null, null] });
    expect(res.errors.length).toBe(1);
    expect(res.errors[0].code).toBe(InterviewErrorCodes.cannotRemove);
    expect(res.errors[0].name).toBe("medications[1]");
    expect(iv.data).toEqual({ medications: [{ name: "B" }] });
  });

  test("confirmDelete does not prompt: the interview removes at the data level", async () => {
    const iv = await createInterview(medicationsJson({ panelCount: 2, confirmDelete: true }));
    await iv.answerAll({ medications: [{ name: "A" }, { name: "B" }] });
    const res = await iv.answerAll({ medications: [null] });
    expect(res.errors).toEqual([]);
    expect(iv.data).toEqual({ medications: [{ name: "B" }] });
  });

  test("Whole-key refusals: the list is refused before anything is written", async () => {
    // Below the minimum: the removal cannot happen, and the patch of the same list is not applied.
    const matrix = await createInterview(itemsJson({ rowCount: 2, minRowCount: 2 }));
    await matrix.answerAll({ items: [{ sku: "A-1" }, { sku: "A-2" }] });
    const removed = await matrix.answerAll({ items: [{ sku: "changed" }, null] });
    expect(removed.errors.length).toBe(1);
    expect(removed.errors[0].code).toBe(InterviewErrorCodes.cannotRemove);
    expect(matrix.data).toEqual({ items: [{ sku: "A-1" }, { sku: "A-2" }] });

    // At the maximum: no entry can be added at all.
    const full = await createInterview(medicationsJson({ panelCount: 1, maxPanelCount: 1 }));
    const overflow = await full.answerAll({ medications: [{ name: "A" }, { name: "B" }] });
    expect(overflow.errors.length).toBe(1);
    expect(overflow.errors[0].code).toBe(InterviewErrorCodes.cannotAdd);
    // The one panel the container was created with is still the only one, and still empty.
    expect(full.data).toEqual({ medications: [{}] });

    // Four entries, a maximum of five, two adds and one null: the adds are checked before the
    // removes, because the model enforces every step on its own.
    const iv = await createInterview(medicationsJson({ panelCount: 4, maxPanelCount: 5 }));
    const res = await iv.answerAll({ medications: [null, {}, {}, {}, { name: "A" }, { name: "B" }] });
    expect(res.errors.length).toBe(1);
    expect(res.errors[0].code).toBe(InterviewErrorCodes.cannotAdd);
    expect(res.errors[0].message).toContain("position 5");
    expect(res.errors[0].message).toContain("Removing an entry first");
    expect(iv.survey.getQuestionByName("medications").panelCount).toBe(4);
  });

  test("An element that is not a record, and a null past the count, are badRecord", async () => {
    const iv = await createInterview(medicationsJson({ panelCount: 1 }));
    const bad = await iv.answerAll({ medications: [{ name: "A" }, "Aspirin"] });
    expect(bad.errors.length).toBe(1);
    expect(bad.errors[0].code).toBe(InterviewErrorCodes.badRecord);
    expect(bad.errors[0].name).toBe("medications[1]");
    // Whole-key: the good record of the same list is not written either.
    expect(iv.data).toEqual({ medications: [{}] });

    const past = await iv.answerAll({ medications: [{}, null] });
    expect(past.errors[0].code).toBe(InterviewErrorCodes.badRecord);
    expect(past.errors[0].name).toBe("medications[1]");

    const scalar = await iv.answerAll({ medications: "Aspirin" });
    expect(scalar.errors[0].code).toBe(InterviewErrorCodes.badRecord);
    expect(scalar.errors[0].name).toBe("medications");

    // The whole key null: nothing written, nothing removed, nothing to report.
    const nothing = await iv.answerAll({ medications: null });
    expect(nothing.errors).toEqual([]);
  });

  test("A position names the entry it named when the document was read", async () => {
    const iv = await createInterview(medicationsJson({ panelCount: 3,
      templateVisibleIf: "{panel.keep} <> false" }, [
      { type: "text", name: "name", title: "Name" },
      { type: "boolean", name: "keep", title: "Keep" },
    ]));
    await iv.answerAll({ medications: [{ name: "A" }, { name: "B" }, { name: "C" }] });
    // The patch hides the panel at position 0; the removal still deletes the panel that was at
    // position 2, because the position was resolved to that panel before anything was written.
    const res = await iv.answerAll({ medications: [{ keep: false }, { name: "B2" }, null] });
    expect(res.errors).toEqual([]);
    expect(iv.data.medications).toEqual([{ name: "A", keep: false }, { name: "B2" }]);
  });

  test("An entry an earlier patch of the same call hid is no longer being asked for", async () => {
    const iv = await createInterview(medicationsJson({ panelCount: 2,
      templateVisibleIf: "{medications[0].keep} <> false" }, [
      { type: "text", name: "name", title: "Name" },
      { type: "boolean", name: "keep", title: "Keep" },
    ]));
    await iv.answerAll({ medications: [{ name: "A" }, { name: "B" }] });
    const res = await iv.answerAll({ medications: [{ keep: false }, { name: "B2" }] });
    expect(res.errors.length).toBe(1);
    expect(res.errors[0].code).toBe(InterviewErrorCodes.notAskable);
    expect(res.errors[0].name).toBe("medications[1]");
    expect(iv.data.medications[1]).toEqual({ name: "B" });
  });

  test("A permission a patch of the same call took away is read again before the removal", async () => {
    const survey = new SurveyModel(medicationsJson({ panelCount: 3 }));
    survey.onDynamicPanelItemValueChanged.add((_, options) => {
      if (options.name === "name" && options.value === "lock") {
        (<any>options.question).allowRemovePanel = false;
      }
    });
    const iv = await createInterview(survey);
    const res = await iv.answerAll({ medications: [{ name: "lock" }, null, null] });
    // The pre-check saw a container that allowed removing; the patch turned it off, and both
    // removals are refused where they are attempted.
    expect(res.errors.length).toBe(2);
    expect(res.errors.map(error => error.code))
      .toEqual([InterviewErrorCodes.cannotRemove, InterviewErrorCodes.cannotRemove]);
    expect(res.errors.map(error => error.name)).toEqual(["medications[2]", "medications[1]"]);
    expect(iv.survey.getQuestionByName("medications").panelCount).toBe(3);
  });

  test("A patch that duplicates a key is caught by the container's own validation", async () => {
    const iv = await createInterview(medicationsJson({ panelCount: 2, keyName: "name" }));
    await iv.answerAll({ medications: [{ name: "Aspirin" }, { name: "Ibuprofen" }] });
    // No add, no remove and no complete(): hasKeysDuplicated lives in the container's own validate,
    // and nothing a nested question does reaches it.
    const res = await iv.answerAll({ medications: [{}, { name: "Aspirin" }] });
    expect(res.errors.length).toBe(1);
    expect(res.errors[0].name).toBe("medications[1].name");
    expect(res.errors[0].code).toBeUndefined();
    expect(iv.getBatchDocument().items.length).toBe(1);
  });

  test("One bad field of a record skips that field and the rest is written", async () => {
    const iv = await createInterview(medicationsJson({ panelCount: 1 }, [
      { type: "dropdown", name: "kind", title: "Kind", choices: ["pill", "syrup"], showOtherItem: true },
      { type: "text", name: "dose", title: "Dose" },
    ]));
    const res = await iv.answerAll({ medications: [{ kind: "powder", dose: "10 mg" }] });
    expect(res.errors.length).toBe(1);
    expect(res.errors[0].code).toBe(InterviewErrorCodes.notAChoice);
    expect(res.errors[0].name).toBe("medications[0].kind");
    expect(iv.data).toEqual({ medications: [{ dose: "10 mg" }] });

    const unknown = await iv.answerAll({ medications: [{ colour: "red" }] });
    expect(unknown.errors[0].code).toBe(InterviewErrorCodes.unknownQuestion);
    expect(unknown.errors[0].name).toBe("medications[0].colour");
    expect(unknown.errors[0].message).toContain("\"kind\", \"dose\"");

    // The suffix belongs to a field inside a record and never to the container key.
    const container = await iv.answerAll({ "medications-Comment": "Ferret" });
    expect(container.errors[0].code).toBe(InterviewErrorCodes.unknownQuestion);

    // The comment key works one level down, for a field of a record.
    const comment = await iv.answerAll({ medications: [{ kind: "other", "kind-Comment": "Ferret" }] });
    expect(comment.errors).toEqual([]);
    expect(iv.data.medications[0]["kind-Comment"]).toBe("Ferret");
  });

  test("A container inside an entry is listed and refused, and so is a hidden field", async () => {
    const iv = await createInterview(medicationsJson({ panelCount: 1 }, [
      { type: "text", name: "name", title: "Name", isRequired: true },
      { type: "text", name: "dose", title: "Dose", visibleIf: "{panel.name} = 'Aspirin'" },
      { type: "paneldynamic", name: "refills", templateElements: [{ type: "text", name: "when" }] },
      { type: "multipletext", name: "contact", items: [{ name: "email" }] },
    ]));
    const document = iv.describeAll();
    // Twice each: in the fields of the entry that exists, and in the template a new entry takes.
    expect(document.split("reason: batch").length - 1).toBe(4);
    const res = await iv.answerAll({ medications: [{ refills: [{}], dose: "10 mg", contact: {} }] });
    expect(res.errors.map(error => error.code)).toEqual([
      InterviewErrorCodes.notAskable, InterviewErrorCodes.notAskable, InterviewErrorCodes.notAskable,
    ]);
    // In the entry's own field order, and a key that names nothing the entry offers comes last.
    expect(res.errors[0].name).toBe("medications[0].refills");
    expect(res.errors[0].message).toContain("nested inside another container");
    expect(res.errors[1].name).toBe("medications[0].contact");
    expect(res.errors[2].name).toBe("medications[0].dose");
    expect(res.errors[2].message).toContain("no longer being asked");
    expect(iv.data).toEqual({ medications: [{}] });
  });

  test("An empty required field of an entry nobody was asked for yet is not an error", async () => {
    const iv = await createInterview(medicationsJson({ panelCount: 0 }));
    const res = await iv.answerAll({ medications: [{}] });
    expect(res.errors).toEqual([]);
    const entry = iv.getBatchDocument().items[0].entries[0];
    expect(entry.fields[0].name).toBe("name");
    expect(entry.fields[0].value).toBeUndefined();
    expect(entry.fields[0].error).toBeUndefined();
    // It is work in the next document, and an error at complete().
    const done = await iv.complete();
    expect(done.completed).toBe(false);
    expect(done.errors[0].name).toBe("medications[0].name");
  });

  test("The container's own errors are reported under its own address", async () => {
    // Below the minimum from the start: the container writes MinRowCountError on itself, and the
    // interview reports it where the container is - no field of any row carries it.
    const iv = await createInterview(itemsJson({ rowCount: 2, minRowCount: 2, isRequired: true }));
    const res = await iv.answerAll({ items: [{ sku: "A-1" }] });
    expect(res.errors.some(error => error.name === "items")).toBe(true);

    const required = await createInterview(medicationsJson({ isRequired: true, panelCount: 0 }));
    const document = required.getBatchDocument();
    expect(document.items[0].required).toBe(true);
    const done = await required.complete();
    expect(done.completed).toBe(false);
    expect(done.errors[0].name).toBe("medications");
  });

  test("The predicates: a container that is answered and valid drops out of the document", async () => {
    const iv = await createInterview(medicationsJson({ panelCount: 1 }));
    await iv.answerAll({ medications: [{ name: "Aspirin", dose: "10 mg" }] });
    const document = iv.getBatchDocument();
    expect(document.items).toEqual([]);
    expect(document.answered["medications"]).toEqual([{ name: "Aspirin", dose: "10 mg" }]);
    expect((await iv.answerAll({})).current).toBe(null);
    // An empty optional field does not make it invalid.
    await iv.answerAll({ medications: [{ dose: null }] });
    expect(iv.getBatchDocument().items).toEqual([]);
  });

  test("current in batch is the first writable item, and a batch write drops a done", async () => {
    const iv = await createInterview({
      elements: [
        { type: "file", name: "photo" },
        { type: "paneldynamic", name: "meds", panelCount: 0,
          templateElements: [{ type: "text", name: "dose" }] },
      ],
    });
    const first = await iv.answerAll({});
    // The file is listed and cannot be written to; the container is the first item an agent may send.
    expect(first.current.name).toBe("meds");
    await iv.answerAll({ meds: [{ dose: "10 mg" }] });
    // Single mode: the list is not finished until the interviewee says so, and "done" says it.
    await iv.answer("meds", { action: "done" });
    expect(iv.current()).toBe(null);
    // A batch write re-opens it, exactly as an add, a remove or an edit does in single mode.
    await iv.answerAll({ meds: [{ dose: "20 mg" }] });
    expect(iv.current().name).toBe("meds");
    expect(iv.current().summary.entries.length).toBe(1);
  });

  test("A dynamic panel and a multiple text side by side, in one call", async () => {
    const iv = await createInterview({
      elements: [
        { type: "paneldynamic", name: "meds", panelCount: 1,
          templateElements: [{ type: "text", name: "dose", isRequired: true }] },
        { type: "multipletext", name: "contact", items: [{ name: "email", isRequired: true }] },
      ],
    });
    const res = await iv.answerAll({
      meds: [{ dose: "10 mg" }, { dose: "20 mg" }],
      contact: { email: "ann@example.com" },
    });
    expect(res.errors).toEqual([]);
    expect(iv.data).toEqual({
      meds: [{ dose: "10 mg" }, { dose: "20 mg" }],
      contact: { email: "ann@example.com" },
    });
    expect(iv.getBatchDocument().items).toEqual([]);
  });

  test("onCheckSingleInputPerPageMode tunes single mode only", async () => {
    const survey = new SurveyModel(medicationsJson({ panelCount: 1 }));
    survey.onCheckSingleInputPerPageMode.add((_, options) => { options.supportPerPage = false; });
    const iv = await createInterview(survey);
    expect(iv.getBatchDocument().items[0].entries[0].fields.map(field => field.name))
      .toEqual(["name", "dose"]);
    const res = await iv.answerAll({ medications: [{ name: "Aspirin" }] });
    expect(res.errors).toEqual([]);
    expect(iv.data).toEqual({ medications: [{ name: "Aspirin" }] });
  });

  test("Field titles and error texts are localized, and the schema description is not", async () => {
    const survey = new SurveyModel(medicationsJson({ panelCount: 1, isRequired: true }, [
      { type: "text", name: "mail", title: { de: "E-Mail" }, inputType: "email" },
    ]));
    survey.locale = "de";
    const iv = await createInterview(survey);
    const res = await iv.answerAll({ medications: [{ mail: "nope" }] });
    expect(res.errors[0].name).toBe("medications[0].mail");
    expect(res.errors[0].message).toBe((<any>surveyLocalization.locales["de"]).invalidEmail);
    expect(iv.describeAll()).toContain("            title: E-Mail");
    expect(iv.getAnswerSchema().properties.medications.description)
      .toContain("A list of entries by position.");
  });
});
