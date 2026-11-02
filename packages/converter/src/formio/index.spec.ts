import { describe, it, expect } from "vitest";
import { convert, FormioCodes } from "./index";
import { UnparseableInputError, WrongFormatError } from "../errors";
import { ReportEntry } from "../report";
import { SurveyJSONElement } from "../types";
import { assertConstructsCleanly } from "../testing/oracle";
import simpleForm from "./fixtures/simple-form.json";
import wizardForm from "./fixtures/wizard-form.json";
import datagridForm from "./fixtures/datagrid-form.json";

function entry(entries: ReportEntry[], code: string): ReportEntry | undefined {
  return entries.find((e) => e.code === code);
}

/** Depth-first find of the first element with the given `name` in a survey JSON. */
function findElement(node: unknown, name: string): SurveyJSONElement | undefined {
  if (!node || typeof node !== "object") return undefined;
  const obj = node as Record<string, unknown>;
  if (obj.name === name && typeof obj.type === "string") return obj as SurveyJSONElement;
  for (const key of ["pages", "elements", "templateElements"]) {
    const arr = obj[key];
    if (Array.isArray(arr)) {
      for (const child of arr) {
        const found = findElement(child, name);
        if (found) return found;
      }
    }
  }
  return undefined;
}

describe("formio convert - format detection", () => {
  it("throws UnparseableInputError on non-objects", () => {
    expect(() => convert(null)).toThrow(UnparseableInputError);
    expect(() => convert(42)).toThrow(UnparseableInputError);
    expect(() => convert([])).toThrow(UnparseableInputError);
  });

  it("throws WrongFormatError on a JSON Schema", () => {
    expect(() => convert({ type: "object", properties: {} })).toThrow(WrongFormatError);
  });

  it("throws WrongFormatError on a SurveyJS survey", () => {
    expect(() => convert({ pages: [] })).toThrow(WrongFormatError);
  });
});

describe("formio convert - simple form", () => {
  it("returns a result + report and constructs cleanly", () => {
    const { output, report } = convert(simpleForm);
    expect(report.source).toBe("formio");
    expect(Array.isArray(report.entries)).toBe(true);
    // Loads into a SurveyModel with zero errors AND that model actually creates
    // the questions (not just valid-but-empty JSON).
    const survey = assertConstructsCleanly(output, "simple-form");
    expect(survey.getQuestionByName("firstName")?.getType()).toBe("text");
    expect(survey.getQuestionByName("email")?.getType()).toBe("text");
    expect(survey.getQuestionByName("country")?.getType()).toBe("dropdown");
  });

  it("maps leaf types, choices and required", () => {
    const { output } = convert(simpleForm);
    expect(findElement(output, "firstName")).toMatchObject({ type: "text", title: "First name", isRequired: true });
    expect(findElement(output, "email")).toMatchObject({ type: "text", inputType: "email" });
    const country = findElement(output, "country");
    expect(country).toMatchObject({ type: "dropdown" });
    expect(country?.choices).toEqual([
      { value: "us", text: "USA" },
      { value: "ee", text: "Estonia" }
    ]);
  });

  it("maps `conditional` mechanically to `visibleIf` with no report noise", () => {
    const { output, report } = convert(simpleForm);
    expect(findElement(output, "vatId")?.visibleIf).toBe("{country} = 'ee'");
    // Mechanical `{ when, eq }` conditionals do not produce a report entry.
    expect(entry(report.entries, FormioCodes.ASSUMED_CONDITIONAL)).toBeUndefined();
  });
});

describe("formio convert - wizard", () => {
  it("promotes each top-level panel to a page (not a nested panel)", () => {
    const { output } = convert(wizardForm);
    expect(output.pages?.length).toBe(2);
    expect(output.pages?.[0]).toMatchObject({ name: "page1", title: "Personal details" });
    // Children are promoted directly -- the page contains the questions, not a panel.
    const first = output.pages?.[0].elements[0] as SurveyJSONElement;
    expect(first.type).toBe("text");
    expect(first.name).toBe("firstName");
    expect(output.pages?.[1].elements.some((e) => (e as SurveyJSONElement).name === "phoneExt")).toBe(true);
  });

  it("constructs cleanly", () => {
    assertConstructsCleanly(convert(wizardForm).output, "wizard-form");
  });
});

describe("formio convert - datagrid + refusals + drift", () => {
  it("models a data grid as a paneldynamic and flags it assumed", () => {
    const { output, report } = convert(datagridForm);
    const grid = findElement(output, "lineItems");
    expect(grid?.type).toBe("paneldynamic");
    expect(grid?.isRequired).toBe(true);
    expect((grid?.templateElements as SurveyJSONElement[]).map((e) => e.name)).toEqual([
      "description",
      "amount",
      "category"
    ]);
    const assumed = entry(report.entries, FormioCodes.ASSUMED_DATAGRID_MODEL);
    expect(assumed?.bucket).toBe("assumed");
    // Target path is a structural pointer into the produced JSON, not a name.
    expect(assumed?.targetPath).toMatch(/^pages\[\d+\]\.elements\[\d+\]$/);
    expect(assumed?.sourcePointer).toBe("/components/1");
  });

  it("refuses customConditional content-free (path + count, no source)", () => {
    const { report } = convert(datagridForm);
    const custom = entry(report.entries, FormioCodes.CUSTOM_CONDITIONAL);
    expect(custom?.bucket).toBe("unsupported");
    expect(custom?.sourcePointer).toContain("customConditional");
    // Content-free: the report entry must not carry the JS source anywhere.
    expect(JSON.stringify(custom)).not.toContain("data.approved");
  });

  it("drops buttons and distinguishes unknown vs unsupported drift", () => {
    const { output, report } = convert(datagridForm);
    // recaptcha is a known Form.io type we do not map yet -> unsupported (backlog).
    expect(entry(report.entries, FormioCodes.UNSUPPORTED_COMPONENT)?.bucket).toBe("unsupported");
    // acmeCustomWidget is not in the vendored snapshot -> unknown (drift alarm).
    expect(entry(report.entries, FormioCodes.UNKNOWN_COMPONENT)?.bucket).toBe("unknown");
    // The button produced no target node.
    expect(findElement(output, "submit")).toBeUndefined();
  });

  it("constructs cleanly", () => {
    assertConstructsCleanly(convert(datagridForm).output, "datagrid-form");
  });
});

// Resolve a JSON Pointer against a source definition, so a report entry can be checked to name
// the component it reports on.
function resolvePointer(root: unknown, pointer: string): unknown {
  return pointer.split("/").slice(1).reduce<unknown>((node, part) =>
    node && typeof node === "object" ? (node as Record<string, unknown>)[part] : undefined, root);
}

describe("formio convert - layout and defaults", () => {
  it("converts a table whose cells hold components, keeping the fields in order", () => {
    const form = { components: [{ type: "table", key: "t", rows: [
      [{ components: [{ type: "textfield", key: "a" }] }, { components: [{ type: "textfield", key: "b" }] }],
      [{ components: [{ type: "number", key: "c" }] }, { components: [] }]
    ] }] };
    const { output } = convert(form);
    const table = findElement(output, "t");
    expect((table?.elements as SurveyJSONElement[]).map((e) => e.name)).toEqual(["a", "b", "c"]);
    assertConstructsCleanly(output, "table with object cells");
  });

  it("still converts a table whose cells are component arrays", () => {
    const form = { components: [{ type: "table", key: "t", rows: [[[{ type: "textfield", key: "a" }], [{ type: "textfield", key: "b" }]]] }] };
    const { output } = convert(form);
    expect((findElement(output, "t")?.elements as SurveyJSONElement[]).map((e) => e.name)).toEqual(["a", "b"]);
    assertConstructsCleanly(output, "table with array cells");
  });

  it("reports a field in columns in a panel with a pointer that resolves in the source", () => {
    const form = { components: [{ type: "panel", key: "p", components: [
      { type: "columns", key: "cols", columns: [{ components: [] }, { components: [{ type: "acmeWidget", key: "w" }] }] }
    ] }] };
    const { report } = convert(form);
    const unknown = entry(report.entries, FormioCodes.UNKNOWN_COMPONENT);
    expect(unknown?.sourcePointer).toBe("/components/0/components/0/columns/1/components/0");
    expect((resolvePointer(form, unknown!.sourcePointer) as { key?: string })?.key).toBe("w");
  });

  it("gives no default for a multiple number field whose default is [null]", () => {
    const form = { components: [{ type: "number", key: "n", multiple: true, defaultValue: [null] }] };
    const { output } = convert(form);
    expect(findElement(output, "n")?.defaultValue).toBeUndefined();
    assertConstructsCleanly(output, "[null] default");
  });

  it("keeps the non-null items of an array default", () => {
    const form = { components: [{ type: "select", key: "n", multiple: true, data: { values: [{ label: "Zero", value: 0 }] }, defaultValue: [0, null] }] };
    expect(findElement(convert(form).output, "n")?.defaultValue).toEqual([0]);
  });
});

describe("formio convert - tabs", () => {
  const tabsForm = { components: [{ type: "tabs", key: "tabs", label: "Tabs", components: [
    { label: "Personal", key: "personal", components: [{ type: "textfield", key: "a" }] },
    { label: "Work", key: "work", components: [{ type: "textfield", key: "b" }, { type: "number", key: "c" }] },
    { label: "Empty", key: "empty", components: [] }
  ] }] };

  it("keeps the fields of every tab, each inside a panel titled with the tab label", () => {
    const { output, report } = convert(tabsForm);
    const tabs = findElement(output, "tabs");
    expect(tabs?.title).toBeUndefined();
    const panels = tabs?.elements as SurveyJSONElement[];
    expect(panels.map((p) => [p.name, p.title, (p.elements as SurveyJSONElement[]).map((e) => e.name)])).toEqual([
      ["personal", "Personal", ["a"]],
      ["work", "Work", ["b", "c"]]
    ]);
    expect(entry(report.entries, FormioCodes.UNKNOWN_COMPONENT)).toBeUndefined();
    expect(entry(report.entries, FormioCodes.DROPPED_STYLING)?.sourcePointer).toBe("/components/0");
    assertConstructsCleanly(output, "tabs");
  });

  it("keeps the tabs of a wizard whose top-level component is tabs", () => {
    const { output, report } = convert({ ...tabsForm, display: "wizard" });
    expect(output.pages?.length).toBe(1);
    expect(output.pages?.[0].elements[0]).toMatchObject({ type: "panel" });
    expect(findElement(output, "work")?.title).toBe("Work");
    expect(findElement(output, "c")?.type).toBe("text");
    expect(entry(report.entries, FormioCodes.UNKNOWN_COMPONENT)).toBeUndefined();
    assertConstructsCleanly(output, "wizard of tabs");
  });
});

describe("formio convert - container titles", () => {
  const titleOf = (comp: Record<string, unknown>) =>
    findElement(convert({ components: [{ key: "x", components: [{ type: "textfield", key: "a" }], ...comp }] }).output, "x")?.title;

  it("titles a panel with `title` rather than its builder label", () => {
    expect(titleOf({ type: "panel", title: "Shown", label: "Builder name" })).toBe("Shown");
  });

  it("titles a panel with no `title` with its label", () => {
    expect(titleOf({ type: "panel", label: "Builder name" })).toBe("Builder name");
  });

  it("titles a fieldset with its legend", () => {
    expect(titleOf({ type: "fieldset", legend: "Legend", label: "Builder name" })).toBe("Legend");
    expect(titleOf({ type: "fieldset", label: "Builder name" })).toBeUndefined();
  });

  it("titles a container with its label unless the label is hidden", () => {
    expect(titleOf({ type: "container", label: "Address" })).toBe("Address");
    expect(titleOf({ type: "container", label: "Address", hideLabel: true })).toBeUndefined();
  });

  it("gives a layout container no title", () => {
    expect(titleOf({ type: "columns", label: "Columns", components: undefined, columns: [{ components: [{ type: "textfield", key: "a" }] }] })).toBeUndefined();
    expect(titleOf({ type: "table", label: "Table", components: undefined, rows: [[{ components: [{ type: "textfield", key: "a" }] }]] })).toBeUndefined();
    expect(titleOf({ type: "well", label: "Well" })).toBeUndefined();
  });

  it("titles a wizard page made from a panel with the panel `title`", () => {
    const { output } = convert({ display: "wizard", components: [
      { type: "panel", key: "page1", title: "Shown", label: "Page 1", components: [{ type: "textfield", key: "a" }] }
    ] });
    expect(output.pages?.[0].title).toBe("Shown");
  });
});

describe("formio convert - hidden and disabled", () => {
  it("makes a hidden field invisible", () => {
    const { output } = convert({ components: [{ type: "textfield", key: "a", hidden: true }] });
    const survey = assertConstructsCleanly(output, "hidden");
    expect(survey.getQuestionByName("a").isVisible).toBe(false);
  });

  it("shows a hidden field whose condition holds, as Form.io does", () => {
    const { output } = convert({ components: [
      { type: "textfield", key: "a" },
      { type: "textfield", key: "b", hidden: true, conditional: { show: true, when: "a", eq: "x" } }
    ] });
    const survey = assertConstructsCleanly(output, "hidden with condition");
    survey.data = { a: "x" };
    expect(survey.getQuestionByName("b").isVisible).toBe(true);
    survey.data = { a: "y" };
    expect(survey.getQuestionByName("b").isVisible).toBe(false);
  });

  it("applies hidden and disabled on a panel to its children", () => {
    const { output } = convert({ components: [
      { type: "panel", key: "p", hidden: true, components: [{ type: "textfield", key: "a" }] },
      { type: "panel", key: "q", disabled: true, components: [{ type: "textfield", key: "b" }] }
    ] });
    const survey = assertConstructsCleanly(output, "hidden and disabled panels");
    expect(survey.getQuestionByName("a").isParentVisible).toBe(false);
    expect(survey.getQuestionByName("b").isReadOnly).toBe(true);
  });

  it("makes a disabled field read-only", () => {
    const { output } = convert({ components: [{ type: "textfield", key: "a", disabled: true }] });
    const survey = assertConstructsCleanly(output, "disabled");
    expect(survey.getQuestionByName("a").isReadOnly).toBe(true);
  });
});

describe("formio convert - selectboxes default", () => {
  const values = [{ label: "A", value: "a" }, { label: "B", value: "b" }, { label: "C", value: "c" }];
  const convertDefault = (defaultValue?: unknown) =>
    convert({ components: [{ type: "selectboxes", key: "s", values, ...(defaultValue === undefined ? {} : { defaultValue }) }] }).output;

  it("checks the keys that are true, in the object order", () => {
    const output = convertDefault({ c: true, b: false, a: true });
    expect(findElement(output, "s")?.defaultValue).toEqual(["c", "a"]);
    expect(assertConstructsCleanly(output, "selectboxes some true").getQuestionByName("s").value.slice()).toEqual(["c", "a"]);
  });

  it("gives no default when every key is false", () => {
    const output = convertDefault({ a: false, b: false, c: false });
    expect(findElement(output, "s")?.defaultValue).toBeUndefined();
    assertConstructsCleanly(output, "selectboxes all false");
  });

  it("gives no default when there is none", () => {
    const output = convertDefault();
    expect(findElement(output, "s")?.defaultValue).toBeUndefined();
    assertConstructsCleanly(output, "selectboxes absent");
  });
});

describe("formio convert - multiple on a text field", () => {
  const convertMultiple = (defaultValue?: unknown) =>
    convert({ components: [{ type: "textfield", key: "t", multiple: true, ...(defaultValue === undefined ? {} : { defaultValue }) }] });

  it("keeps one input and reports the lost multiple", () => {
    const { output, report } = convertMultiple();
    const unsupported = entry(report.entries, FormioCodes.UNSUPPORTED_MULTIPLE);
    expect(unsupported).toMatchObject({ bucket: "unsupported", sourcePointer: "/components/0" });
    expect(findElement(output, "t")?.type).toBe("text");
    assertConstructsCleanly(output, "multiple textfield");
  });

  it("keeps a one-item default as the value", () => {
    const { output } = convertMultiple(["x"]);
    expect(findElement(output, "t")?.defaultValue).toBe("x");
    assertConstructsCleanly(output, "multiple textfield one default");
  });

  it("drops a default of two items", () => {
    const { output } = convertMultiple(["x", "y"]);
    expect(findElement(output, "t")?.defaultValue).toBeUndefined();
    assertConstructsCleanly(output, "multiple textfield two defaults");
  });
});
