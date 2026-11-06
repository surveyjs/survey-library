import { describe, it, expect } from "vitest";
import { convert, FormioCodes } from "./index";
import { UnparseableInputError, WrongFormatError } from "../errors";
import { ReportEntry } from "../report";
import { SurveyJSONElement } from "../types";
import { ChoicesRestful, SurveyModel } from "survey-core";
import { assertConstructsCleanly, lintOutput } from "../testing/oracle";
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

// Convert a form, load it, set data, and read whether the named question is visible.
function isVisible(form: object, data: Record<string, unknown>, name: string): boolean {
  const survey = assertConstructsCleanly(convert(form).output, "conditions");
  survey.data = data;
  return survey.getQuestionByName(name).isVisible;
}

function simpleConditional(show: unknown, conditions: unknown[], conjunction = "all") {
  return { show, conjunction, conditions };
}

describe("formio convert - simple conditions", () => {
  // [operator, target type, compared value, data that matches, data that does not, assumed]
  const rows: [string, string, unknown, unknown, unknown, boolean][] = [
    ["isEqual", "textfield", "x", "x", "y", false],
    ["isNotEqual", "textfield", "x", "y", "x", false],
    ["isEmpty", "textfield", "", undefined, "x", false],
    ["isNotEmpty", "textfield", "", "x", undefined, false],
    ["lessThan", "number", 5, 3, 7, false],
    ["lessThanOrEqual", "number", 5, 5, 6, false],
    ["greaterThan", "number", 5, 7, 5, false],
    ["greaterThanOrEqual", "number", 5, 5, 4, false],
    ["includes", "textfield", "ell", "hello", "abc", false],
    ["notIncludes", "textfield", "ell", "abc", "hello", false],
    ["dateGreaterThan", "day", "1/1/2024", "2024-06-01", "2023-06-01", true],
    ["dateGreaterThanOrEqual", "day", "01/01/2024", "2024-01-01", "2023-06-01", true],
    ["dateLessThan", "day", "1/1/2024", "2023-06-01", "2024-06-01", true],
    ["dateLessThanOrEqual", "day", "01/01/2024", "2024-01-01", "2024-06-01", true],
    ["isDateEqual", "day", "06/01/2024", "2024-06-01", "2024-06-02", true],
    ["isNotDateEqual", "day", "06/01/2024", "2024-06-02", "2024-06-01", true]
  ];

  for (const [operator, type, value, match, noMatch, assumed] of rows) {
    const form = (show: boolean) => ({ components: [
      { type, key: "a" },
      { type: "textfield", key: "b", conditional: simpleConditional(show, [{ component: "a", operator, value }]) }
    ] });

    it(`${operator} shows the field when it holds, with show: true`, () => {
      expect(isVisible(form(true), { a: match }, "b")).toBe(true);
      expect(isVisible(form(true), { a: noMatch }, "b")).toBe(false);
      const assumedEntry = entry(convert(form(true)).report.entries, FormioCodes.ASSUMED_CONDITIONAL);
      expect(assumedEntry?.sourcePointer).toBe(assumed ? "/components/1/conditional/conditions/0" : undefined);
    });

    it(`${operator} hides the field when it holds, with show: false`, () => {
      expect(isVisible(form(false), { a: match }, "b")).toBe(false);
      expect(isVisible(form(false), { a: noMatch }, "b")).toBe(true);
    });
  }

  for (const operator of ["startsWith", "endsWith", "matchesSomething"]) {
    it(`${operator} gives no visibleIf, keeps the field visible, and is reported assumed`, () => {
      const form = { components: [
        { type: "textfield", key: "a" },
        { type: "textfield", key: "b", conditional: simpleConditional(true, [{ component: "a", operator, value: "x" }]) }
      ] };
      const { output, report } = convert(form);
      expect(findElement(output, "b")?.visibleIf).toBeUndefined();
      expect(isVisible(form, { a: "y" }, "b")).toBe(true);
      expect(entry(report.entries, FormioCodes.ASSUMED_CONDITIONAL)?.sourcePointer).toBe("/components/1/conditional/conditions/0");
    });
  }

  const twoConditions = (conjunction: string) => ({ components: [
    { type: "textfield", key: "a" },
    { type: "textfield", key: "c" },
    { type: "textfield", key: "b", conditional: simpleConditional(true, [
      { component: "a", operator: "isEqual", value: "x" },
      { component: "c", operator: "isEqual", value: "y" }
    ], conjunction) }
  ] });

  it("needs every condition with conjunction all", () => {
    expect(isVisible(twoConditions("all"), { a: "x", c: "y" }, "b")).toBe(true);
    expect(isVisible(twoConditions("all"), { a: "x", c: "z" }, "b")).toBe(false);
  });

  it("needs one condition with conjunction any", () => {
    expect(isVisible(twoConditions("any"), { a: "x", c: "z" }, "b")).toBe(true);
    expect(isVisible(twoConditions("any"), { a: "w", c: "z" }, "b")).toBe(false);
  });

  it("ignores a condition with no component, as Form.io does", () => {
    const form = { components: [
      { type: "textfield", key: "a" },
      { type: "textfield", key: "b", conditional: simpleConditional(true, [
        { component: "a", operator: "isEqual", value: "x" },
        { component: "", operator: "isEqual", value: "y" }
      ]) }
    ] };
    expect(isVisible(form, { a: "x" }, "b")).toBe(true);
    expect(isVisible(form, { a: "w" }, "b")).toBe(false);
    expect(convert(form).report.entries.some((e) => e.code === FormioCodes.ASSUMED_CONDITIONAL)).toBe(false);
  });

  const withNoComponent = (show: unknown, conjunction: string, real: boolean) => ({ components: [
    { type: "textfield", key: "a" },
    { type: "textfield", key: "b", conditional: simpleConditional(show, [
      ...(real ? [{ component: "a", operator: "isEqual", value: "x" }] : []),
      { component: "", operator: "isEqual", value: "y" }
    ], conjunction) }
  ] });

  for (const conjunction of ["all", "any"]) {
    for (const show of [true, false]) {
      it(`shows the field whatever the data when no condition names a component, with ${conjunction} and show: ${show}`, () => {
        const form = withNoComponent(show, conjunction, false);
        const { output, report } = convert(form);
        expect(findElement(output, "b")?.visibleIf).toBeUndefined();
        expect(entry(report.entries, FormioCodes.ASSUMED_CONDITIONAL)).toBeUndefined();
        expect(isVisible(form, { a: "x" }, "b")).toBe(true);
        expect(isVisible(form, { a: "w" }, "b")).toBe(true);
      });
    }
  }

  it("shows the field whatever the data when a condition names no component under any, with show: true", () => {
    const form = withNoComponent(true, "any", true);
    const { output, report } = convert(form);
    expect(findElement(output, "b")?.visibleIf).toBeUndefined();
    expect(entry(report.entries, FormioCodes.ASSUMED_CONDITIONAL)).toBeUndefined();
    expect(isVisible(form, { a: "x" }, "b")).toBe(true);
    expect(isVisible(form, { a: "w" }, "b")).toBe(true);
  });

  it("hides the field whatever the data when a condition names no component under any, with show: false", () => {
    const form = withNoComponent(false, "any", true);
    expect(findElement(convert(form).output, "b")?.visibleIf).toBe("false");
    expect(isVisible(form, { a: "x" }, "b")).toBe(false);
    expect(isVisible(form, { a: "w" }, "b")).toBe(false);
  });

  it("shows the field when a condition names no component under any and show is null, as Form.io then checks no condition", () => {
    const form = withNoComponent(null, "any", true);
    expect(findElement(convert(form).output, "b")?.visibleIf).toBeUndefined();
    expect(isVisible(form, { a: "x" }, "b")).toBe(true);
    expect(isVisible(form, { a: "w" }, "b")).toBe(true);
  });

  it("reads JSON logic beside simple conditions that name no component", () => {
    const form = { components: [
      { type: "textfield", key: "a" },
      { type: "textfield", key: "b", conditional: {
        ...simpleConditional(true, [{ component: "", operator: "isEqual", value: "y" }]),
        json: { "==": [{ var: "data.a" }, "x"] }
      } }
    ] };
    expect(isVisible(form, { a: "x" }, "b")).toBe(true);
    expect(isVisible(form, { a: "w" }, "b")).toBe(false);
  });

  it("reads a legacy when before simple conditions, as Form.io does", () => {
    const form = { components: [
      { type: "textfield", key: "a" },
      { type: "textfield", key: "c" },
      { type: "textfield", key: "b", conditional: {
        ...simpleConditional(true, [{ component: "c", operator: "isEqual", value: "y" }]),
        when: "a",
        eq: "x"
      } }
    ] };
    expect(isVisible(form, { a: "x", c: "z" }, "b")).toBe(true);
    expect(isVisible(form, { a: "w", c: "y" }, "b")).toBe(false);
  });

  it("reads show: \"true\" as true and show: null as false", () => {
    const form = (show: unknown) => ({ components: [
      { type: "textfield", key: "a" },
      { type: "textfield", key: "b", conditional: simpleConditional(show, [{ component: "a", operator: "isEqual", value: "x" }]) }
    ] });
    expect(isVisible(form("true"), { a: "x" }, "b")).toBe(true);
    expect(isVisible(form(null), { a: "x" }, "b")).toBe(false);
    expect(isVisible(form(null), { a: "y" }, "b")).toBe(true);
  });
});

describe("formio convert - legacy conditions", () => {
  const form = (show: unknown) => ({ components: [
    { type: "textfield", key: "a" },
    { type: "textfield", key: "b", conditional: { show, when: "a", eq: "x" } }
  ] });

  it("shows the field when equal for show: \"true\"", () => {
    expect(isVisible(form("true"), { a: "x" }, "b")).toBe(true);
    expect(isVisible(form("true"), { a: "y" }, "b")).toBe(false);
  });

  for (const show of ["false", null, ""]) {
    it(`hides the field when equal for show: ${JSON.stringify(show)}`, () => {
      expect(isVisible(form(show), { a: "x" }, "b")).toBe(false);
      expect(isVisible(form(show), { a: "y" }, "b")).toBe(true);
    });
  }

  it("compares a number target as a number and a checkbox target as a boolean", () => {
    const typed = { components: [
      { type: "number", key: "n" },
      { type: "checkbox", key: "c" },
      { type: "textfield", key: "b", conditional: { show: true, when: "n", eq: "5" } },
      { type: "textfield", key: "d", conditional: { show: true, when: "c", eq: "true" } }
    ] };
    const { output } = convert(typed);
    expect(findElement(output, "b")?.visibleIf).toBe("{n} = 5");
    expect(findElement(output, "d")?.visibleIf).toBe("{c} = true");
    expect(isVisible(typed, { n: 5 }, "b")).toBe(true);
    expect(isVisible(typed, { c: true }, "d")).toBe(true);
    expect(isVisible(typed, { c: false }, "d")).toBe(false);
  });

  // Form.io compares `String(value)` with `eq`, so a stored number only equals its own text.
  const numberTargets: [string, Record<string, unknown>][] = [
    ["a number field", { type: "number", key: "n" }],
    ["a currency field", { type: "currency", key: "n" }],
    ["a select from a URL", { type: "select", key: "n", dataSrc: "url", valueProperty: "id", data: { url: "https://x.test/items" } }],
    ["a select from a URL with dataType number", { type: "select", key: "n", dataType: "number", dataSrc: "url", valueProperty: "id", data: { url: "https://x.test/items" } }]
  ];
  for (const [what, comp] of numberTargets) {
    // Blank text reads as 0 in survey-core (`Number("  ")` is 0) but never equals a stored number's text.
    for (const eq of ["5.0", "05", "+5", " 5", "5 ", "0x5", "  ", "\t", "\n"]) {
      it(`gives no condition for ${JSON.stringify(eq)} on ${what}, and reports it assumed`, () => {
        const form = { components: [comp, { type: "textfield", key: "b", conditional: { show: true, when: "n", eq } }] };
        const { output, report } = convert(form);
        expect(findElement(output, "b")?.visibleIf).toBeUndefined();
        expect(entry(report.entries, FormioCodes.ASSUMED_CONDITIONAL)?.sourcePointer).toBe("/components/1/conditional/when");
        expect(isVisible(form, { n: 5 }, "b")).toBe(true);
        expect(isVisible(form, { n: 6 }, "b")).toBe(true);
        expect(isVisible(form, { n: 0 }, "b")).toBe(true);
        expect(isVisible(form, {}, "b")).toBe(true);
      });
    }

    // An empty select holds "", and an empty number field `null`, whose text "null" never equals "".
    const keepsEmpty = comp.type === "select";
    it(`${keepsEmpty ? "keeps" : "gives no condition for"} the empty string on ${what}`, () => {
      const form = { components: [comp, { type: "textfield", key: "b", conditional: { show: true, when: "n", eq: "" } }] };
      const { output, report } = convert(form);
      expect(findElement(output, "b")?.visibleIf).toBe(keepsEmpty ? "{n} = ''" : undefined);
      expect(!!entry(report.entries, FormioCodes.ASSUMED_CONDITIONAL)).toBe(!keepsEmpty);
      expect(isVisible(form, { n: 0 }, "b")).toBe(!keepsEmpty);
      expect(isVisible(form, { n: 5 }, "b")).toBe(!keepsEmpty);
      expect(isVisible(form, {}, "b")).toBe(true);
    });

    it(`compares "5" with 5 on ${what}`, () => {
      for (const show of [true, false]) {
        const form = { components: [comp, { type: "textfield", key: "b", conditional: { show, when: "n", eq: "5" } }] };
        const { report } = convert(form);
        expect(entry(report.entries, FormioCodes.ASSUMED_CONDITIONAL)).toBeUndefined();
        expect(isVisible(form, { n: 5 }, "b")).toBe(show);
        expect(isVisible(form, { n: 6 }, "b")).toBe(!show);
        expect(isVisible(form, {}, "b")).toBe(!show);
      }
    });
  }

  it("compares \"5.0\" as written on a select from a URL with dataType string, which stores text", () => {
    const form = { components: [
      { type: "select", key: "n", dataType: "string", dataSrc: "url", valueProperty: "id", data: { url: "https://x.test/items" } },
      { type: "textfield", key: "b", conditional: { show: true, when: "n", eq: "5.0" } }
    ] };
    expect(findElement(convert(form).output, "b")?.visibleIf).toBe("{n} = '5.0'");
    expect(isVisible(form, { n: "5.0" }, "b")).toBe(true);
    expect(isVisible(form, { n: "6" }, "b")).toBe(false);
  });

  // A select casts "true" and "false" in any case to a boolean under `auto` and `boolean`, and a
  // checkbox stores one; Form.io then compares `String(value)`, which is "true" or "false".
  const booleanTargets: [string, Record<string, unknown>][] = [
    ["a select from a URL", { type: "select", key: "n", dataSrc: "url", valueProperty: "id", data: { url: "https://x.test/items" } }],
    ["a select from a URL with dataType boolean", { type: "select", key: "n", dataType: "boolean", dataSrc: "url", valueProperty: "id", data: { url: "https://x.test/items" } }],
    ["a checkbox", { type: "checkbox", key: "n" }]
  ];
  for (const [what, comp] of booleanTargets) {
    // A select keeps " true" as text, which only that text equals, as in survey-core.
    const refused = comp.type === "checkbox" ? ["TRUE", "True", " true", "true ", "FALSE", "False"] : ["TRUE", "True", "FALSE", "False"];
    for (const eq of refused) {
      it(`gives no condition for ${JSON.stringify(eq)} on ${what}, and reports it assumed`, () => {
        const form = { components: [comp, { type: "textfield", key: "b", conditional: { show: true, when: "n", eq } }] };
        const { output, report } = convert(form);
        expect(findElement(output, "b")?.visibleIf).toBeUndefined();
        expect(entry(report.entries, FormioCodes.ASSUMED_CONDITIONAL)?.sourcePointer).toBe("/components/1/conditional/when");
        expect(isVisible(form, { n: true }, "b")).toBe(true);
        expect(isVisible(form, { n: false }, "b")).toBe(true);
      });
    }

    it(`compares "true" with true on ${what}`, () => {
      for (const show of [true, false]) {
        const form = { components: [comp, { type: "textfield", key: "b", conditional: { show, when: "n", eq: "true" } }] };
        const { report } = convert(form);
        expect(entry(report.entries, FormioCodes.ASSUMED_CONDITIONAL)).toBeUndefined();
        expect(isVisible(form, { n: true }, "b")).toBe(show);
        expect(isVisible(form, { n: false }, "b")).toBe(!show);
      }
    });
  }

  for (const eq of [" true", "true "]) {
    it(`compares ${JSON.stringify(eq)} as text on a select from a URL`, () => {
      const form = { components: [booleanTargets[0][1], { type: "textfield", key: "b", conditional: { show: true, when: "n", eq } }] };
      expect(findElement(convert(form).output, "b")?.visibleIf).toBe(`{n} = '${eq}'`);
      expect(isVisible(form, { n: eq }, "b")).toBe(true);
      expect(isVisible(form, { n: true }, "b")).toBe(false);
      expect(isVisible(form, { n: "true" }, "b")).toBe(false);
      expect(isVisible(form, {}, "b")).toBe(false);
    });
  }

  it("compares \"false\" with false on a select from a URL, and not with no value", () => {
    const form = { components: [booleanTargets[0][1], { type: "textfield", key: "b", conditional: { show: true, when: "n", eq: "false" } }] };
    expect(findElement(convert(form).output, "b")?.visibleIf).toBe("{n} = 'false'");
    expect(isVisible(form, { n: false }, "b")).toBe(true);
    expect(isVisible(form, { n: true }, "b")).toBe(false);
    expect(isVisible(form, {}, "b")).toBe(false);
  });
});

describe("formio convert - selectboxes targets", () => {
  const values = [{ label: "A", value: "a" }, { label: "B", value: "b" }];
  const withConditional = (conditional: unknown) => ({ components: [
    { type: "selectboxes", key: "s", values },
    { type: "textfield", key: "b", conditional }
  ] });

  it("shows on a checked key in the legacy format", () => {
    const form = withConditional({ show: true, when: "s", eq: "a" });
    expect(isVisible(form, { s: ["a"] }, "b")).toBe(true);
    expect(isVisible(form, { s: ["b"] }, "b")).toBe(false);
  });

  it("hides on a checked key in the legacy format", () => {
    const form = withConditional({ show: false, when: "s", eq: "a" });
    expect(isVisible(form, { s: ["a"] }, "b")).toBe(false);
    expect(isVisible(form, {}, "b")).toBe(true);
  });

  it("shows on a checked key with isEqual in the simple format", () => {
    const form = withConditional(simpleConditional(true, [{ component: "s", operator: "isEqual", value: "a" }]));
    expect(isVisible(form, { s: ["a", "b"] }, "b")).toBe(true);
    expect(isVisible(form, { s: ["b"] }, "b")).toBe(false);
  });

  it("hides on a checked key with isNotEqual in the simple format", () => {
    const form = withConditional(simpleConditional(true, [{ component: "s", operator: "isNotEqual", value: "a" }]));
    expect(isVisible(form, { s: ["a"] }, "b")).toBe(false);
    expect(isVisible(form, { s: ["b"] }, "b")).toBe(true);
  });
});

// Form.io's legacy check reads an array value as an object first: `isObject(value) && has(value, eq)`,
// and then compares the item at that path with `show`, which is not what a list of items holds.
describe("formio convert - array targets in the legacy format", () => {
  // The target, with the items it can hold.
  const targets: [string, (items: string[]) => Record<string, unknown>][] = [
    ["a multiple select", (items) => ({ type: "select", key: "q", multiple: true, data: { values: items.map((value) => ({ label: value, value })) } })],
    ["a multiple select from a URL", () => ({ type: "select", key: "q", multiple: true, dataSrc: "url", valueProperty: "id", data: { url: "https://x.test/items" } })],
    ["tags", () => ({ type: "tags", key: "q", storeas: "array" })]
  ];
  for (const [what, target] of targets) {
    // The first key of the lodash path is an index or `length`, or the text is empty or holds a comma.
    for (const eq of ["length", "0.0", "[0]", "0[0]", "length.x", "[\"0\"]", "0", ",", ""]) {
      it(`gives no condition for ${JSON.stringify(eq)} on ${what}, and reports it assumed`, () => {
        const items = ["a", "length"];
        for (const show of [true, false]) {
          const form = { components: [target(items), { type: "textfield", key: "b", conditional: { show, when: "q", eq } }] };
          const { output, report } = convert(form);
          expect(findElement(output, "b")?.visibleIf).toBeUndefined();
          expect(entry(report.entries, FormioCodes.ASSUMED_CONDITIONAL)?.sourcePointer).toBe("/components/1/conditional/when");
          const survey = assertConstructsCleanly(output, "array legacy refused");
          for (const value of [[], ...items.map((item) => [item])]) {
            survey.setValue("q", value);
            expect(survey.getQuestionByName("b").isVisible).toBe(true);
          }
        }
      });
    }

    // lodash reads a path whose first key is no key of the array as absent, so these compare by
    // membership.
    for (const eq of ["a", "a.b", "v1.0", "x[0]"]) {
      it(`compares ${JSON.stringify(eq)} with the items of ${what} by membership`, () => {
        for (const show of [true, false]) {
          const form = { components: [target([eq, "length"]), { type: "textfield", key: "b", conditional: { show, when: "q", eq } }] };
          const { output } = convert(form);
          expect(findElement(output, "b")?.visibleIf).toBe(`{q} ${show ? "contains" : "notcontains"} '${eq}'`);
          const survey = assertConstructsCleanly(output, "array legacy");
          survey.setValue("q", [eq]);
          expect(survey.getQuestionByName("b").isVisible).toBe(show);
          survey.setValue("q", ["length"]);
          expect(survey.getQuestionByName("b").isVisible).toBe(!show);
          survey.clear();
          expect(survey.getQuestionByName("b").isVisible).toBe(!show);
        }
      });
    }
  }
});

// survey-core's expressions have no exponent notation: `{q} = 1e-7` is an invalid expression.
describe("formio convert - numbers in exponent notation", () => {
  const radio = (dataType: string, values: string[]) => ({ type: "radio", key: "q", dataType, values: values.map((value) => ({ label: value, value })) });
  const refused: [string, Record<string, unknown>, unknown][] = [
    ["a number field compared with 1e21 in JSON logic", { type: "number", key: "q" }, { json: { "==": [{ var: "data.q" }, 1e21] } }],
    ["a radio compared with 1e21 in JSON logic", radio("", ["1", "2"]), { json: { "==": [{ var: "data.q" }, 1e21] } }],
    ["a radio of numbers compared with 1e21 in the simple format", radio("number", ["1e21", "2"]),
      simpleConditional(true, [{ component: "q", operator: "isEqual", value: 1e21 }])]
  ];
  for (const [what, comp, conditional] of refused) {
    it(`gives no condition for ${what}, and reports it assumed`, () => {
      const form = { components: [comp, { type: "textfield", key: "b", conditional }] };
      const { output, report } = convert(form);
      expect(findElement(output, "b")?.visibleIf).toBeUndefined();
      expect(report.entries.filter((e) => e.code === FormioCodes.ASSUMED_CONDITIONAL)).toHaveLength(1);
      const survey = assertConstructsCleanly(output, "exponent refused");
      for (const value of [1e-7, 1e21, 2]) {
        survey.setValue("q", value);
        expect(survey.getQuestionByName("b").isVisible).toBe(true);
      }
    });
  }

  it("compares a number field with \"1e-7\" as text, as Form.io's legacy check does", () => {
    const form = { components: [{ type: "number", key: "q" }, { type: "textfield", key: "b", conditional: { show: true, when: "q", eq: "1e-7" } }] };
    const { output, report } = convert(form);
    expect(findElement(output, "b")?.visibleIf).toBe("{q} = '1e-7'");
    expect(entry(report.entries, FormioCodes.ASSUMED_CONDITIONAL)).toBeUndefined();
    expect(isVisible(form, { q: 1e-7 }, "b")).toBe(true);
    for (const data of [{ q: 1 }, { q: 0 }, { q: 2 }, {}]) expect(isVisible(form, data, "b")).toBe(false);
  });

  it("gives no logic for a trigger that compares with 1e21, and reports it", () => {
    const form = { components: [{ type: "number", key: "q" }, { type: "textfield", key: "b", logic: [{ name: "l",
      trigger: { type: "json", json: { "==": [{ var: "data.q" }, 1e21] } },
      actions: [{ name: "act", type: "property", property: { label: "hidden", value: "hidden", type: "boolean" }, state: true }]
    }] }] };
    const { output, report } = convert(form);
    expect(findElement(output, "b")?.visibleIf).toBeUndefined();
    expect(entry(report.entries, FormioCodes.CUSTOM_LOGIC)?.sourcePointer).toBe("/components/1/logic/0");
    const survey = assertConstructsCleanly(output, "exponent trigger");
    survey.setValue("q", 1e21);
    expect(survey.getQuestionByName("b").isVisible).toBe(true);
  });

  // [what, component, condition on q, Form.io's result for each choice then for no value]
  const kept: [string, Record<string, unknown>, unknown, boolean[]][] = [
    ["a radio of numbers that stores 1e-7, in the legacy format", radio("number", ["0.0000001", "2"]), { show: true, when: "q", eq: "1e-7" }, [true, false, false]],
    ["a radio of numbers that stores 1e21, in the legacy format", radio("number", ["1e21", "2"]), { show: false, when: "q", eq: "1e+21" }, [false, true, true]],
    ["a radio of numbers, ordered against 1e21", radio("number", ["1", "2"]),
      simpleConditional(true, [{ component: "q", operator: "lessThan", value: "1e21" }]), [true, true, false]]
  ];
  for (const [what, comp, conditional, expected] of kept) {
    it(`compares ${what} without exponent notation, as Form.io does`, () => {
      const form = { components: [comp, { type: "textfield", key: "b", conditional }] };
      const { output, report } = convert(form);
      expect(entry(report.entries, FormioCodes.ASSUMED_CONDITIONAL)).toBeUndefined();
      // An exponent may only stand inside a quoted text.
      expect((findElement(output, "b")?.visibleIf as string).replace(/'[^']*'/g, "")).not.toMatch(/\de/);
      const values = (findElement(output, "q")?.choices as { value: unknown }[]).map((c) => c.value);
      const survey = assertConstructsCleanly(output, "exponent kept");
      [...values, undefined].forEach((value, i) => {
        survey.clear();
        if (value !== undefined) survey.setValue("q", value);
        expect(survey.getQuestionByName("b").isVisible, `value ${JSON.stringify(value)}`).toBe(expected[i]);
      });
    });
  }
});

// What Form.io stores in a field with no choices in the definition decides every comparison: the
// legacy check compares texts, the simple `isEqual` parses a text as JSON only when the stored value
// has another type and is not falsy, `includes` is lodash's, and JSON logic compares with `==` and
// `===`. A literal is kept only when survey-core holds for the same values.
describe("formio convert - conditions on fields with no choices", () => {
  const url = (props: Record<string, unknown> = {}) => ({ type: "select", key: "n", dataSrc: "url", valueProperty: "id", data: { url: "https://x.test/items" }, ...props });
  const simple = (operator: string, value: unknown) => simpleConditional(true, [{ component: "n", operator, value }]);
  const json = (op: string, value: unknown) => ({ json: { [op]: [{ var: "data.n" }, value] } });
  const legacy = (eq: unknown) => ({ show: true, when: "n", eq });
  const number = { type: "number", key: "n" };
  const checkbox = { type: "checkbox", key: "n" };
  const textfield = { type: "textfield", key: "n" };

  // [what, field, condition, values the field may hold in survey-core]
  const refused: [string, Record<string, unknown>, unknown, unknown[]][] = [
    ...["5", "05", "+5", " 5", "0x5"].flatMap((lit): [string, Record<string, unknown>, unknown, unknown[]][] => [
      [`=== ${JSON.stringify(lit)} on a select from a URL`, url(), json("===", lit), [5, "5"]],
      [`=== ${JSON.stringify(lit)} on a select from a URL with dataType number`, url({ dataType: "number" }), json("===", lit), [5, "5"]]
    ]),
    ...["true", "TRUE"].flatMap((lit): [string, Record<string, unknown>, unknown, unknown[]][] => [
      [`== ${JSON.stringify(lit)} on a select from a URL`, url(), json("==", lit), [true, "true"]],
      [`=== ${JSON.stringify(lit)} on a select from a URL`, url(), json("===", lit), [true, "true"]]
    ]),
    ...["05", "+5", "0x5", "TRUE"].map((lit): [string, Record<string, unknown>, unknown, unknown[]] =>
      [`isEqual ${JSON.stringify(lit)} on a select from a URL`, url(), simple("isEqual", lit), [5, "5", true]]),
    ["includes \"5\" on a select from a URL", url(), simple("includes", "5"), [5, "5", 15]],
    ["includes \"5\" on a number field", number, simple("includes", "5"), [5, 15]],
    ["notIncludes \"5\" on a number field", number, simple("notIncludes", "5"), [5, 15]],
    ...["05", "+5", ".5", "0x5", " ", "0"].map((lit): [string, Record<string, unknown>, unknown, unknown[]] =>
      [`isEqual ${JSON.stringify(lit)} on a number field`, number, simple("isEqual", lit), [5, 0.5, 0]]),
    ["legacy false on a number field", number, legacy(false), [0, 1]],
    ["isEqual false on a number field", number, simple("isEqual", false), [0, 1]],
    ["=== false on a number field", number, json("===", false), [0, 1]],
    ["lessThanOrEqual \"100\" on a number field", number, simple("lessThanOrEqual", "100"), [100, 50]],
    ["isEqual \"TRUE\" on a checkbox", checkbox, simple("isEqual", "TRUE"), [true, false]],
    ["isEqual \"True\" on a checkbox", checkbox, simple("isEqual", "True"), [true, false]],
    ["isEqual 5 on a text field", textfield, simple("isEqual", 5), ["5", "6"]],
    ["== 0 on a text field", textfield, json("==", 0), ["0", "1"]],
    ["includes \"\" on a text field", textfield, simple("includes", ""), ["a", ""]],
    ["lessThan 10 on a text field", textfield, simple("lessThan", 10), ["5", "50"]],
    ["includes \"b\" on tags", { type: "tags", key: "n", storeas: "array" }, simple("includes", "b"), [["b"], ["ab"]]],
    ["legacy \"5\" on a select from a URL with no valueProperty", url({ valueProperty: undefined }), legacy("5"), [5, "5"]],
    ["legacy \"5\" on a select from a URL with an unknown dataType", url({ dataType: "object" }), legacy("5"), [5, "5"]]
  ];
  for (const [what, field, conditional, values] of refused) {
    it(`gives no condition for ${what}, and reports it assumed`, () => {
      const form = { components: [field, { type: "textfield", key: "b", conditional }] };
      const { output, report } = convert(form);
      expect(findElement(output, "b")?.visibleIf).toBeUndefined();
      expect(entry(report.entries, FormioCodes.ASSUMED_CONDITIONAL)).toBeDefined();
      for (const value of values) expect(isVisible(form, { n: value }, "b")).toBe(true);
    });
  }

  // [what, field, condition, the expression, [value in survey-core, Form.io's result]]
  const kept: [string, Record<string, unknown>, unknown, string, [unknown, boolean][]][] = [
    ["=== 5 on a select from a URL", url(), json("===", 5), "{n} = 5", [[5, true], ["5", true], [6, false], [undefined, false]]],
    ["=== \"5\" on a select from a URL with dataType string", url({ dataType: "string" }), json("===", "5"), "{n} = '5'", [["5", true], [5, true], ["6", false], [undefined, false]]],
    // Form.io stores 1 for "1", and 1 == true.
    ["== true on a select from a URL", url(), json("==", true), "{n} = 1", [[true, true], ["true", true], [1, true], ["1", true], [false, false], [undefined, false]]],
    ["isEqual \"5\" on a select from a URL", url(), simple("isEqual", "5"), "({n} = 5)", [[5, true], ["5", true], [6, false], [undefined, false]]],
    ["legacy \"1\" on a select from a URL with dataType number, which keeps \"true\" as text", url({ dataType: "number" }), legacy("1"),
      "{n} = '1'", [[1, true], ["1", true], ["true", false], [true, false], [undefined, false]]],
    ["isEqual \"5\" on a number field", number, simple("isEqual", "5"), "({n} = 5)", [[5, true], [6, false], [undefined, false]]],
    ["legacy 0 on a number field", number, legacy(0), "{n} = 0", [[0, true], [1, false], [undefined, false]]],
    ["isEqual 0 on a number field", number, simple("isEqual", 0), "({n} = 0)", [[0, true], [1, false], [undefined, false]]],
    ["=== 0 on a number field", number, json("===", 0), "{n} = 0", [[0, true], [1, false], [undefined, false]]],
    ["== \"\" on a number field, which holds only for 0", number, json("==", ""), "{n} = 0", [[0, true], [1, false], [undefined, false]]],
    ["== \"  \" on a number field, which holds only for 0", number, json("==", "  "), "{n} = 0", [[0, true], [1, false], [undefined, false]]],
    ["lessThanOrEqual 100 on a number field", number, simple("lessThanOrEqual", 100), "({n} <= 100)", [[100, true], [50, true], [150, false], [undefined, false]]],
    ["isEqual \"true\" on a checkbox", checkbox, simple("isEqual", "true"), "({n} = true)", [[true, true], [false, false]]],
    ["== \"1\" on a checkbox", checkbox, json("==", "1"), "{n} = true", [[true, true], [false, false]]],
    ["includes \"b\" on a text field", textfield, simple("includes", "b"), "({n} contains 'b')", [["ab", true], ["a", false], [undefined, false]]]
  ];
  for (const [what, field, conditional, expression, cases] of kept) {
    it(`compares ${what} exactly`, () => {
      const form = { components: [field, { type: "textfield", key: "b", conditional }] };
      const { output, report } = convert(form);
      expect(findElement(output, "b")?.visibleIf).toBe(expression);
      expect(entry(report.entries, FormioCodes.ASSUMED_CONDITIONAL)).toBeUndefined();
      for (const [value, visible] of cases) {
        expect(isVisible(form, value === undefined ? {} : { n: value }, "b"), JSON.stringify(value)).toBe(visible);
      }
    });
  }

  it("compares a radio group by its members' values", () => {
    const member = (key: string, value: string) => ({ type: "checkbox", inputType: "radio", name: "g", key, value });
    const form = { components: [member("ra", "05"), member("rb", "5"), { type: "textfield", key: "b", conditional: { show: true, when: "g", eq: "5" } }] };
    const { output, report } = convert(form);
    expect(findElement(output, "b")?.visibleIf).toBe("{g} = '5'");
    expect(entry(report.entries, FormioCodes.ASSUMED_CONDITIONAL)).toBeUndefined();
    expect(isVisible(form, { g: "5" }, "b")).toBe(true);
    expect(isVisible(form, { g: "05" }, "b")).toBe(false);
    expect(isVisible(form, {}, "b")).toBe(false);
  });

  it("refuses includes on a multiple select whose choices contain the literal, and keeps it otherwise", () => {
    const select = (values: string[]) => ({ type: "select", key: "n", multiple: true, data: { values: values.map((value) => ({ label: value, value })) } });
    const refusedForm = { components: [select(["ab", "b"]), { type: "textfield", key: "b", conditional: simple("includes", "b") }] };
    expect(findElement(convert(refusedForm).output, "b")?.visibleIf).toBeUndefined();
    const keptForm = { components: [select(["a", "b"]), { type: "textfield", key: "b", conditional: simple("includes", "a") }] };
    expect(findElement(convert(keptForm).output, "b")?.visibleIf).toBe("({n} contains 'a')");
    expect(isVisible(keptForm, { n: ["a"] }, "b")).toBe(true);
    expect(isVisible(keptForm, { n: ["b"] }, "b")).toBe(false);
    const notIncludes = { components: [select(["a", "b"]), { type: "textfield", key: "b", conditional: simple("notIncludes", "a") }] };
    expect(findElement(convert(notIncludes).output, "b")?.visibleIf).toBeUndefined();
  });
});

describe("formio convert - conditions on containers", () => {
  it("hides the children of a panel with a condition", () => {
    const form = { components: [
      { type: "textfield", key: "a" },
      { type: "panel", key: "p", conditional: { show: true, when: "a", eq: "x" }, components: [{ type: "textfield", key: "b" }] }
    ] };
    const survey = assertConstructsCleanly(convert(form).output, "panel condition");
    survey.data = { a: "y" };
    expect(survey.getPanelByName("p").isVisible).toBe(false);
    expect(survey.getQuestionByName("b").isParentVisible).toBe(false);
    survey.data = { a: "x" };
    expect(survey.getPanelByName("p").isVisible).toBe(true);
  });

  it("hides a data grid with a condition", () => {
    const form = { components: [
      { type: "textfield", key: "a" },
      { type: "datagrid", key: "g", conditional: { show: true, when: "a", eq: "x" }, components: [{ type: "textfield", key: "b" }] }
    ] };
    expect(isVisible(form, { a: "y" }, "g")).toBe(false);
    expect(isVisible(form, { a: "x" }, "g")).toBe(true);
  });

  it("skips a wizard page with a condition", () => {
    const form = { display: "wizard", components: [
      { type: "panel", key: "one", components: [{ type: "textfield", key: "a" }] },
      { type: "panel", key: "two", conditional: { show: true, when: "a", eq: "x" }, components: [{ type: "textfield", key: "b" }] }
    ] };
    const survey = assertConstructsCleanly(convert(form).output, "page condition");
    survey.data = { a: "y" };
    expect(survey.visiblePages.map((p) => p.name)).toEqual(["one"]);
    survey.data = { a: "x" };
    expect(survey.visiblePages.map((p) => p.name)).toEqual(["one", "two"]);
  });

  it("refuses customConditional on a panel without its source", () => {
    const { output, report } = convert({ components: [
      { type: "panel", key: "p", customConditional: "show = data.secretFlag;", components: [{ type: "textfield", key: "b" }] }
    ] });
    const custom = entry(report.entries, FormioCodes.CUSTOM_CONDITIONAL);
    expect(custom).toMatchObject({ bucket: "unsupported", sourcePointer: "/components/0/customConditional" });
    expect(JSON.stringify(report)).not.toContain("secretFlag");
    expect(findElement(output, "p")?.visibleIf).toBeUndefined();
  });
});

describe("formio convert - condition references", () => {
  it("follows a renamed target", () => {
    const form = { components: [
      { type: "container", key: "c1", components: [{ type: "textfield", key: "x" }] },
      { type: "container", key: "c2", components: [{ type: "textfield", key: "x" }] },
      { type: "textfield", key: "b", conditional: { show: true, when: "c2.x", eq: "y" } }
    ] };
    expect(findElement(convert(form).output, "b")?.visibleIf).toBe("{x_1} = 'y'");
    expect(isVisible(form, { x_1: "y" }, "b")).toBe(true);
    expect(isVisible(form, { x: "y" }, "b")).toBe(false);
  });

  it("resolves a field declared after the condition", () => {
    const form = { components: [
      { type: "textfield", key: "b", conditional: { show: true, when: "a", eq: "x" } },
      { type: "textfield", key: "a" }
    ] };
    expect(isVisible(form, { a: "x" }, "b")).toBe(true);
    expect(isVisible(form, { a: "y" }, "b")).toBe(false);
  });

  // Data grids become dynamic panels; read the question inside the first panel.
  function gridQuestion(form: object, data: Record<string, unknown>, path: string[], name: string) {
    const survey = assertConstructsCleanly(convert(form).output, "grid references");
    survey.data = data;
    let container: any = survey;
    for (const grid of path) container = container.getQuestionByName(grid).panels[0];
    return container.getQuestionByName(name);
  }

  for (const when of ["g.x", "row.x"]) {
    it(`names a sibling in the same grid as panel.x, from ${when}`, () => {
      const form = { components: [{ type: "datagrid", key: "g", components: [
        { type: "textfield", key: "x" },
        { type: "textfield", key: "b", conditional: { show: true, when, eq: "1" } }
      ] }] };
      expect(findElement(convert(form).output, "b")?.visibleIf).toBe("{panel.x} = '1'");
      expect(gridQuestion(form, { g: [{ x: "1" }] }, ["g"], "b").isVisible).toBe(true);
      expect(gridQuestion(form, { g: [{ x: "2" }] }, ["g"], "b").isVisible).toBe(false);
    });
  }

  it("names a field of the parent grid as parentPanel.x", () => {
    const form = { components: [{ type: "datagrid", key: "o", components: [
      { type: "textfield", key: "y" },
      { type: "editgrid", key: "i", components: [{ type: "textfield", key: "b", conditional: { show: true, when: "o.y", eq: "1" } }] }
    ] }] };
    expect(findElement(convert(form).output, "b")?.visibleIf).toBe("{parentPanel.y} = '1'");
    expect(gridQuestion(form, { o: [{ y: "1", i: [{}] }] }, ["o", "i"], "b").isVisible).toBe(true);
    expect(gridQuestion(form, { o: [{ y: "2", i: [{}] }] }, ["o", "i"], "b").isVisible).toBe(false);
  });

  it("names a top-level field from inside a grid by its name", () => {
    const form = { components: [
      { type: "textfield", key: "t" },
      { type: "datagrid", key: "g", components: [{ type: "textfield", key: "b", conditional: { show: true, when: "t", eq: "1" } }] }
    ] };
    expect(findElement(convert(form).output, "b")?.visibleIf).toBe("{t} = '1'");
    expect(gridQuestion(form, { t: "1", g: [{}] }, ["g"], "b").isVisible).toBe(true);
    expect(gridQuestion(form, { t: "2", g: [{}] }, ["g"], "b").isVisible).toBe(false);
  });

  it("names a field inside a container by its name", () => {
    const form = { components: [
      { type: "container", key: "c", components: [{ type: "textfield", key: "x" }] },
      { type: "textfield", key: "b", conditional: { show: true, when: "c.x", eq: "1" } }
    ] };
    expect(findElement(convert(form).output, "b")?.visibleIf).toBe("{x} = '1'");
    expect(isVisible(form, { x: "1" }, "b")).toBe(true);
  });

  it("names a field by its full path through a layout panel", () => {
    const form = { components: [
      { type: "panel", key: "page1", components: [{ type: "checkbox", key: "agree" }] },
      { type: "textfield", key: "b", conditional: simpleConditional(true, [{ component: "page1.agree", operator: "isEqual", value: true }]) }
    ] };
    expect(isVisible(form, { agree: true }, "b")).toBe(true);
    expect(isVisible(form, { agree: false }, "b")).toBe(false);
  });

  const notExpressible: [string, object][] = [
    ["a field inside a grid, from outside it", { components: [
      { type: "datagrid", key: "g", components: [{ type: "textfield", key: "x" }] },
      { type: "textfield", key: "b", conditional: { show: true, when: "g.x", eq: "1" } }
    ] }],
    ["a missing field", { components: [
      { type: "textfield", key: "b", conditional: { show: true, when: "nowhere", eq: "1" } }
    ] }]
  ];
  for (const [what, form] of notExpressible) {
    it(`gives no visibleIf for ${what}, keeps the field visible, and reports it assumed`, () => {
      const { output, report } = convert(form);
      expect(findElement(output, "b")?.visibleIf).toBeUndefined();
      expect(entry(report.entries, FormioCodes.ASSUMED_CONDITIONAL)?.sourcePointer).toMatch(/\/conditional\/when$/);
      const survey = assertConstructsCleanly(output, what);
      expect(survey.getQuestionByName("b").isVisible).toBe(true);
    });
  }
});

describe("formio convert - equality that holds for no value", () => {
  // A text that is no number never equals a number's value, so the comparison is constant.
  const numbers: [string, Record<string, unknown>][] = [
    ["a number field", { type: "number", key: "n" }],
    ["a currency field", { type: "currency", key: "n" }]
  ];
  const visible = (form: object, data: Record<string, unknown>) => isVisible(form, data, "b");
  const noTypeMismatch = (form: object) =>
    expect(lintOutput(convert(form).output).filter((f) => f.ruleId === "expression/type-mismatch")).toEqual([]);
  const legacy = (comp: object, show: boolean, eq: string) =>
    ({ components: [comp, { type: "textfield", key: "b", conditional: { show, when: "n", eq } }] });
  const simple = (comp: object, operator: string, value: string) =>
    ({ components: [comp, { type: "textfield", key: "b", conditional: simpleConditional(true, [{ component: "n", operator, value }]) }] });
  const jsonLogic = (comp: object, op: string, value: string) =>
    ({ components: [comp, { type: "textfield", key: "b", conditional: { json: { [op]: [{ var: "data.n" }, value] } } }] });

  // A radio may hold a value outside its choices (a default, prefilled data), so its literal is kept.
  it("keeps the literal on a radio compared with a value outside its choices", () => {
    const radio = { type: "radio", key: "n", values: [{ label: "A", value: "a" }, { label: "B", value: "b" }] };
    for (const comp of [radio, { ...radio, defaultValue: "zzz" }]) {
      for (const show of [true, false]) {
        const form = legacy(comp, show, "zzz");
        expect(findElement(convert(form).output, "b")?.visibleIf).toBe(show ? "{n} = 'zzz'" : "{n} <> 'zzz'");
        expect(visible(form, { n: "zzz" })).toBe(show);
        expect(visible(form, { n: "a" })).toBe(!show);
      }
    }
  });

  for (const [what, comp] of numbers) {
    for (const eq of ["abc", "true", "false"]) {
      it(`hides a field shown when ${what} equals ${JSON.stringify(eq)}, and shows one hidden then`, () => {
        const shown = legacy(comp, true, eq);
        expect(findElement(convert(shown).output, "b")?.visibleIf).toBe("false");
        for (const data of [{ n: 5 }, { n: 0 }, {}]) expect(visible(shown, data)).toBe(false);
        noTypeMismatch(shown);
        const hidden = legacy(comp, false, eq);
        expect(findElement(convert(hidden).output, "b")?.visibleIf).toBe("true");
        for (const data of [{ n: 5 }, { n: 0 }, {}]) expect(visible(hidden, data)).toBe(true);
        noTypeMismatch(hidden);
      });
    }

    it(`reads the simple operators isEqual and isNotEqual as constants on ${what}`, () => {
      const equal = simple(comp, "isEqual", "abc");
      expect(findElement(convert(equal).output, "b")?.visibleIf).toBe("(false)");
      expect(visible(equal, { n: 5 })).toBe(false);
      expect(visible(equal, {})).toBe(false);
      noTypeMismatch(equal);
      const notEqual = simple(comp, "isNotEqual", "abc");
      expect(findElement(convert(notEqual).output, "b")?.visibleIf).toBe("(true)");
      expect(visible(notEqual, { n: 5 })).toBe(true);
      expect(visible(notEqual, {})).toBe(true);
      noTypeMismatch(notEqual);
    });

    it(`reads JSON logic == and != as constants on ${what}`, () => {
      const equal = jsonLogic(comp, "==", "abc");
      expect(visible(equal, { n: 5 })).toBe(false);
      expect(visible(equal, {})).toBe(false);
      noTypeMismatch(equal);
      const notEqual = jsonLogic(comp, "!=", "abc");
      expect(visible(notEqual, { n: 5 })).toBe(true);
      expect(visible(notEqual, {})).toBe(true);
      noTypeMismatch(notEqual);
    });

    it(`still compares a number text with the number on ${what}`, () => {
      const form = legacy(comp, true, "5");
      expect(findElement(convert(form).output, "b")?.visibleIf).toBe("{n} = 5");
      expect(visible(form, { n: 5 })).toBe(true);
      expect(visible(form, { n: 6 })).toBe(false);
    });
  }
});

describe("formio convert - condition literals", () => {
  const compareWith = (eq: string) => ({ components: [
    { type: "textfield", key: "a" },
    { type: "textfield", key: "b", conditional: { show: true, when: "a", eq } }
  ] });

  for (const value of ["O'Brien", "x\\y", "a\\'b"]) {
    it(`matches a compared value of ${JSON.stringify(value)} exactly`, () => {
      expect(isVisible(compareWith(value), { a: value }, "b")).toBe(true);
      expect(isVisible(compareWith(value), { a: value.replace(/['\\]/g, "") }, "b")).toBe(false);
    });
  }

  // survey-core reads `\'` and `\"` as escapes, so a trailing `\` would escape the closing quote
  // and `\"` would read back as `"`.
  for (const value of ["c:\\", "a\\\"b"]) {
    it(`gives no visibleIf for a compared value of ${JSON.stringify(value)}, and reports it assumed`, () => {
      const { output, report } = convert(compareWith(value));
      expect(findElement(output, "b")?.visibleIf).toBeUndefined();
      expect(entry(report.entries, FormioCodes.ASSUMED_CONDITIONAL)?.sourcePointer).toBe("/components/1/conditional/when");
      expect(isVisible(compareWith(value), { a: "other" }, "b")).toBe(true);
    });
  }
});

describe("formio convert - currency", () => {
  // Convert one currency field, load it, and show how the mask writes 1234.5.
  function convertCurrency(props: Record<string, unknown>) {
    const result = convert({ components: [{ type: "currency", key: "c", ...props }] });
    const survey = assertConstructsCleanly(result.output, "currency");
    const question = survey.getQuestionByName("c") as unknown as { maskInstance: { getMaskedValue(v: unknown): string } };
    return { ...result, el: findElement(result.output, "c"), shown: question.maskInstance.getMaskedValue(1234.5) };
  }

  it("masks the field as currency with the symbol of the currency code", () => {
    const { el, shown } = convertCurrency({ currency: "USD" });
    expect(el).toMatchObject({ type: "text", maskType: "currency", maskSettings: { currencySymbol: "$" } });
    expect(el?.inputType).toBeUndefined();
    expect(shown).toBe("$1,234.5");
  });

  it("reports an unknown currency code and leaves the symbol out, without throwing", () => {
    const { el, report } = convertCurrency({ currency: "NOT-A-CODE" });
    expect(el?.maskType).toBe("currency");
    expect((el?.maskSettings as Record<string, unknown> | undefined)?.currencySymbol).toBeUndefined();
    expect(entry(report.entries, FormioCodes.ASSUMED_CURRENCY_FORMAT)?.sourcePointer).toBe("/components/0/currency");
  });

  it("shows trailing zeros for requireDecimal", () => {
    const { el, shown } = convertCurrency({ currency: "USD", requireDecimal: true });
    expect((el?.maskSettings as Record<string, unknown>).showTrailingZeros).toBe(true);
    expect(shown).toBe("$1,234.50");
  });

  it("takes the precision from decimalLimit", () => {
    const { el, shown } = convertCurrency({ currency: "USD", decimalLimit: 3, requireDecimal: true });
    expect((el?.maskSettings as Record<string, unknown>).precision).toBe(3);
    expect(shown).toBe("$1,234.500");
  });

  it("writes a prefix before the symbol", () => {
    const { el, shown } = convertCurrency({ currency: "USD", prefix: "Total " });
    expect((el?.maskSettings as Record<string, unknown>).currencyPattern).toBe("Total @#");
    expect(shown).toBe("Total $1,234.5");
  });

  it("writes a suffix after the number", () => {
    const { el, shown } = convertCurrency({ currency: "USD", suffix: " net" });
    expect((el?.maskSettings as Record<string, unknown>).currencyPattern).toBe("@# net");
    expect(shown).toBe("$1,234.5 net");
  });

  it("reports an affix with a digit and writes no pattern", () => {
    const { el, report } = convertCurrency({ currency: "USD", prefix: "No. 1 " });
    expect((el?.maskSettings as Record<string, unknown>).currencyPattern).toBeUndefined();
    expect(entry(report.entries, FormioCodes.ASSUMED_CURRENCY_FORMAT)?.sourcePointer).toBe("/components/0");
  });
});

describe("formio convert - radio-type checkboxes", () => {
  const member = (key: string, value: string, extra: Record<string, unknown> = {}) =>
    ({ type: "checkbox", inputType: "radio", name: "size", key, value, label: value.toUpperCase(), ...extra });
  const form = { components: [
    { type: "textfield", key: "before" },
    member("small", "s"),
    member("medium", "m", { defaultValue: true, validate: { required: true } }),
    member("large", "l"),
    { type: "textfield", key: "after" }
  ] };

  it("gives one radio group at the first member's place, with the fields around it in order", () => {
    const { output } = convert(form);
    expect((output.pages?.[0].elements as SurveyJSONElement[]).map((e) => e.name)).toEqual(["before", "size", "after"]);
    expect(findElement(output, "size")).toMatchObject({
      type: "radiogroup",
      choices: [{ value: "s", text: "S" }, { value: "m", text: "M" }, { value: "l", text: "L" }],
      isRequired: true,
      defaultValue: "m"
    });
    expect(findElement(output, "size")?.title).toBeUndefined();
    const survey = assertConstructsCleanly(output, "radio group");
    expect(survey.getQuestionByName("size").value).toBe("m");
  });

  it("branches a condition on the group's name", () => {
    const withCondition = { components: [...form.components,
      { type: "textfield", key: "b", conditional: { show: true, when: "size", eq: "l" } }] };
    const survey = assertConstructsCleanly(convert(withCondition).output, "radio group condition");
    survey.data = { size: "l" };
    expect(survey.getQuestionByName("b").isVisible).toBe(true);
    survey.data = { size: "s" };
    expect(survey.getQuestionByName("b").isVisible).toBe(false);
  });

  it("reports a condition on a member's key, which holds no data", () => {
    const onMember = { components: [...form.components,
      { type: "textfield", key: "b", conditional: { show: true, when: "large", eq: "true" } }] };
    const { output, report } = convert(onMember);
    expect(findElement(output, "b")?.visibleIf).toBeUndefined();
    expect(entry(report.entries, FormioCodes.ASSUMED_CONDITIONAL)?.sourcePointer).toBe("/components/5/conditional/when");
  });

  it("keeps a radio-type checkbox with no name as a boolean", () => {
    const { output } = convert({ components: [{ type: "checkbox", inputType: "radio", key: "alone", value: "x" }] });
    expect(findElement(output, "alone")?.type).toBe("boolean");
  });
});

describe("formio convert - select data sources", () => {
  const urlSelect = (props: Record<string, unknown>) => ({ components: [{
    type: "select", key: "s", dataSrc: "url", data: { url: "https://example.com/items", headers: [{ key: "", value: "" }] }, ...props
  }] });

  it("maps a URL source to choicesByUrl", () => {
    const { output, report } = convert(urlSelect({ selectValues: "results", valueProperty: "id", template: "<span>{{ item.name }}</span>" }));
    expect(findElement(output, "s")?.choicesByUrl).toEqual({ url: "https://example.com/items", path: "results", valueName: "id", titleName: "name" });
    // With no `dataType`, Form.io casts each response value and survey-core keeps it.
    expect(report.entries.map((e) => e.code)).toEqual([FormioCodes.ASSUMED_DATA_SOURCE_VALUE]);
    assertConstructsCleanly(output, "url select");
  });

  it("titles items with item.label when there is no template, as Form.io does", () => {
    const { output } = convert(urlSelect({}));
    expect((findElement(output, "s")?.choicesByUrl as Record<string, unknown>).titleName).toBe("label");
  });

  it("reports a template that is not a single item property", () => {
    const { output, report } = convert(urlSelect({ template: "<span>{{ item.first }} {{ item.last }}</span>" }));
    expect((findElement(output, "s")?.choicesByUrl as Record<string, unknown>).titleName).toBeUndefined();
    expect(entry(report.entries, FormioCodes.ASSUMED_DATA_SOURCE_TITLE)?.sourcePointer).toBe("/components/0/template");
  });

  const refused: [string, Record<string, unknown>][] = [
    ["an interpolated address", { data: { url: "https://example.com/{{ data.make }}" } }],
    ["authentication", { authenticate: true }],
    ["request headers", { data: { url: "https://example.com/items", headers: [{ key: "Authorization", value: "token" }] } }]
  ];
  for (const [what, props] of refused) {
    it(`refuses a URL source with ${what}`, () => {
      const { output, report } = convert(urlSelect(props));
      expect(findElement(output, "s")?.choicesByUrl).toBeUndefined();
      expect(entry(report.entries, FormioCodes.UNSUPPORTED_DATA_SOURCE)).toMatchObject({ bucket: "unsupported", sourcePointer: "/components/0/dataSrc" });
    });
  }

  it("reads a nested valueProperty and template property from the response", () => {
    const { output } = convert(urlSelect({ valueProperty: "data.email", template: "<span>{{ item.data.name }}</span>" }));
    const byUrl = findElement(output, "s")?.choicesByUrl as Record<string, string>;
    const restful = new ChoicesRestful();
    restful.valueName = byUrl.valueName;
    restful.titleName = byUrl.titleName;
    let items: { value: unknown, text: string }[] = [];
    restful.getResultCallback = (result) => { items = result.map((i) => ({ value: i.value, text: i.text })); };
    (restful as unknown as { onLoad(result: unknown): void }).onLoad([
      { data: { email: "ann@example.com", name: "Ann" } },
      { data: { email: "bob@example.com", name: "Bob" } }
    ]);
    expect(items).toEqual([{ value: "ann@example.com", text: "Ann" }, { value: "bob@example.com", text: "Bob" }]);
  });

  for (const dataSrc of ["resource", "custom"]) {
    it(`reports a ${dataSrc} source`, () => {
      const { output, report } = convert({ components: [{ type: "select", key: "s", dataSrc }] });
      expect(findElement(output, "s")?.choices).toBeUndefined();
      expect(entry(report.entries, FormioCodes.UNSUPPORTED_DATA_SOURCE)?.sourcePointer).toBe("/components/0/dataSrc");
    });
  }
});

describe("formio convert - inline json and interpolated URL sources", () => {
  const jsonSelect = (json: unknown, props: Record<string, unknown> = {}) => ({ components: [{
    type: "select", key: "s", dataSrc: "json", data: { json }, ...props
  }] });
  const choiceTexts = (survey: SurveyModel) => survey.getQuestionByName("s").visibleChoices.map((c: { value: unknown, text: string }) => [c.value, c.text]);

  it("reads json choices from an array of objects", () => {
    const { output, report } = convert(jsonSelect(
      [{ id: "a", name: "Alpha" }, { id: "b", name: "Beta" }], { valueProperty: "id", template: "<span>{{ item.name }}</span>" }));
    expect(report.entries).toEqual([]);
    expect(choiceTexts(assertConstructsCleanly(output, "json array"))).toEqual([["a", "Alpha"], ["b", "Beta"]]);
  });

  it("reads json choices from an array of strings", () => {
    const { output, report } = convert(jsonSelect(["x", "y"]));
    expect(report.entries).toEqual([]);
    expect(choiceTexts(assertConstructsCleanly(output, "json strings"))).toEqual([["x", "x"], ["y", "y"]]);
  });

  it("reads json choices from a string that parses to an array", () => {
    const { output, report } = convert(jsonSelect('[{"value":"a","label":"Alpha"}]', { valueProperty: "value" }));
    expect(report.entries).toEqual([]);
    expect(choiceTexts(assertConstructsCleanly(output, "json string"))).toEqual([["a", "Alpha"]]);
  });

  for (const [what, json] of [["an array", [1, 2.5, 0]], ["a string that parses to an array", "[1, 2.5, 0]"]] as [string, unknown][]) {
    it(`reads json choices from numbers in ${what}`, () => {
      const form = { components: [
        { type: "select", key: "s", dataSrc: "json", data: { json } },
        { type: "textfield", key: "b", conditional: { show: true, when: "s", eq: "2.5" } }
      ] };
      const { output, report } = convert(form);
      expect(report.entries).toEqual([]);
      const survey = assertConstructsCleanly(output, "json numbers");
      expect(choiceTexts(survey)).toEqual([[1, "1"], [2.5, "2.5"], [0, "0"]]);
      survey.setValue("s", 2.5);
      expect(survey.getQuestionByName("b").isVisible).toBe(true);
      survey.setValue("s", 0);
      expect(survey.getQuestionByName("b").isVisible).toBe(false);
      survey.doComplete();
      expect(survey.data).toEqual({ s: 0 });
      // No value: Form.io's empty value (`{}` or "") is not "2.5" either.
      survey.clear();
      expect(survey.getQuestionByName("b").isVisible).toBe(false);
    });

    it(`gives no condition for a text that is not its number's own, on numbers in ${what}`, () => {
      const form = { components: [
        { type: "select", key: "s", dataSrc: "json", data: { json } },
        { type: "textfield", key: "b", conditional: { show: true, when: "s", eq: "2.50" } }
      ] };
      const { output, report } = convert(form);
      expect(findElement(output, "b")?.visibleIf).toBeUndefined();
      expect(entry(report.entries, FormioCodes.ASSUMED_CONDITIONAL)?.sourcePointer).toBe("/components/1/conditional/when");
      const survey = assertConstructsCleanly(output, "json numbers, non-canonical text");
      for (const value of [2.5, 1, undefined]) {
        survey.clear();
        if (value !== undefined) survey.setValue("s", value);
        expect(survey.getQuestionByName("b").isVisible).toBe(true);
      }
    });
  }

  it("stores a number item as text with dataType string, as Form.io does", () => {
    const { output, report } = convert(jsonSelect([1, 2.5], { dataType: "string" }));
    expect(report.entries).toEqual([]);
    const survey = assertConstructsCleanly(output, "json numbers as text");
    expect(choiceTexts(survey)).toEqual([["1", "1"], ["2.5", "2.5"]]);
  });

  it("reports object items without a valueProperty", () => {
    const { output, report } = convert(jsonSelect([{ id: "a" }]));
    expect(findElement(output, "s")?.choices).toBeUndefined();
    expect(entry(report.entries, FormioCodes.UNSUPPORTED_DATA_SOURCE)?.sourcePointer).toBe("/components/0/dataSrc");
  });

  it("gives no choices and no report for an empty json array", () => {
    const { output, report } = convert(jsonSelect([]));
    expect(findElement(output, "s")?.choices).toBeUndefined();
    expect(report.entries).toEqual([]);
  });

  it("reports an object or array as the value property", () => {
    for (const items of [[{ id: { a: 1 } }], [{ id: [1] }]]) {
      const { output, report } = convert(jsonSelect(items, { valueProperty: "id" }));
      expect(findElement(output, "s")?.choices).toBeUndefined();
      expect(entry(report.entries, FormioCodes.UNSUPPORTED_DATA_SOURCE)?.sourcePointer).toBe("/components/0/dataSrc");
    }
  });

  it("does not report the item template when every item is a string", () => {
    const { report } = convert(jsonSelect(["x"], { template: "<span>{{ item.a }} {{ item.b }}</span>" }));
    expect(report.entries).toEqual([]);
  });

  for (const [what, json] of [["a string that is not JSON", "not json"], ["a string that parses to an object", "{\"a\":1}"], ["an object", { a: 1 }]] as [string, unknown][]) {
    it(`reports json that is ${what}`, () => {
      const { output, report } = convert(jsonSelect(json));
      expect(findElement(output, "s")?.choices).toBeUndefined();
      expect(entry(report.entries, FormioCodes.UNSUPPORTED_DATA_SOURCE)?.sourcePointer).toBe("/components/0/dataSrc");
    });
  }

  it("reports a json item template that is not a single property", () => {
    const { report } = convert(jsonSelect([{ id: "a" }], { valueProperty: "id", template: "<span>{{ item.a }} {{ item.b }}</span>" }));
    expect(entry(report.entries, FormioCodes.ASSUMED_DATA_SOURCE_TITLE)?.sourcePointer).toBe("/components/0/template");
  });

  // Stubs XMLHttpRequest as the survey-core preflight does, and records the requested URLs.
  async function withStubbedRequests(run: (urls: string[], wait: () => Promise<void>) => Promise<void>): Promise<void> {
    const urls: string[] = [];
    const g = globalThis as unknown as { XMLHttpRequest: unknown };
    const original = g.XMLHttpRequest;
    g.XMLHttpRequest = class {
      onload?: () => void;
      status = 0;
      response = "";
      responseText = "";
      open(_method: string, url: string): void { urls.push(url); }
      setRequestHeader(): void { /* none */ }
      send(): void {
        this.status = 200;
        this.response = this.responseText = JSON.stringify([{ value: "a" }]);
        setTimeout(() => this.onload && this.onload(), 0);
      }
    };
    try {
      await run(urls, () => new Promise((r) => setTimeout(r, 50)));
    } finally {
      g.XMLHttpRequest = original;
    }
  }

  it("substitutes data.x in a URL and reloads when it changes", async () => {
    const { output, report } = convert({ components: [
      { type: "textfield", key: "country" },
      { type: "select", key: "s", dataSrc: "url", data: { url: "https://x.test/api?c={{ data.country }}&k={{data.country}}" } }
    ] });
    expect(report.entries.filter((e) => e.code === FormioCodes.UNSUPPORTED_DATA_SOURCE)).toEqual([]);
    expect((findElement(output, "s")?.choicesByUrl as Record<string, string>).url).toBe("https://x.test/api?c={country}&k={country}");
    await withStubbedRequests(async (urls, wait) => {
      const survey = new SurveyModel(output);
      survey.setValue("country", "US");
      await wait();
      survey.setValue("country", "DE");
      await wait();
      expect(urls).toEqual(["https://x.test/api?c=US&k=US", "https://x.test/api?c=DE&k=DE"]);
    });
  });

  it("substitutes row.x in a URL inside a grid, per row", async () => {
    const { output, report } = convert({ components: [{ type: "datagrid", key: "g", components: [
      { type: "textfield", key: "country" },
      { type: "select", key: "s", dataSrc: "url", data: { url: "https://x.test/api?c={{ row.country }}" } }
    ] }] });
    expect(report.entries.filter((e) => e.code === FormioCodes.UNSUPPORTED_DATA_SOURCE)).toEqual([]);
    await withStubbedRequests(async (urls, wait) => {
      const survey = new SurveyModel(output);
      const grid = survey.getQuestionByName("g") as unknown as { addPanel(): void, panels: { getQuestionByName(n: string): { value: unknown } }[] };
      grid.addPanel();
      await wait();
      urls.length = 0;
      grid.panels[grid.panels.length - 1].getQuestionByName("country").value = "FR";
      await wait();
      expect(urls).toEqual(["https://x.test/api?c=FR"]);
    });
  });

  for (const [what, url] of [
    ["limit", "https://x.test/api?l={{ limit }}"],
    ["a path that names no field", "https://x.test/api?c={{ data.missing }}"],
    ["row outside a grid", "https://x.test/api?c={{ row.country }}"],
    ["an expression", "https://x.test/api?c={{ data.country + 1 }}"],
    ["an unclosed interpolation", "https://x.test/api?c={{ data.country"],
    ["one resolvable and one unresolvable interpolation", "https://x.test/api?c={{ data.country }}&l={{ limit }}"]
  ]) {
    it(`still refuses a URL with ${what}`, () => {
      const { output, report } = convert({ components: [
        { type: "textfield", key: "country" },
        { type: "select", key: "s", dataSrc: "url", data: { url } }
      ] });
      expect(findElement(output, "s")?.choicesByUrl).toBeUndefined();
      expect(report.entries).toHaveLength(1);
      expect(entry(report.entries, FormioCodes.UNSUPPORTED_DATA_SOURCE)).toMatchObject({ bucket: "unsupported", sourcePointer: "/components/1/dataSrc" });
    });
  }
});

describe("formio convert - logic and computed values", () => {
  const secret = "data.secretTotal * 2";
  const refusals: [string, Record<string, unknown>, string][] = [
    ["logic", { logic: [{ name: "rule", trigger: { type: "javascript", javascript: secret }, actions: [] }] }, FormioCodes.CUSTOM_LOGIC],
    ["calculateValue as a string", { calculateValue: `value = ${secret};` }, FormioCodes.CUSTOM_VALUE],
    ["calculateValue as an object", { calculateValue: { "*": [{ var: "data.secretTotal" }, 2] } }, FormioCodes.CUSTOM_VALUE],
    ["customDefaultValue", { customDefaultValue: `value = ${secret};` }, FormioCodes.CUSTOM_VALUE]
  ];
  for (const [what, props, code] of refusals) {
    const key = Object.keys(props)[0];
    it(`reports ${what} on a field without its content`, () => {
      const { report } = convert({ components: [{ type: "textfield", key: "t", ...props }] });
      // A `logic` entry is reported by its index.
      const ptr = key === "logic" ? "/components/0/logic/0" : `/components/0/${key}`;
      expect(entry(report.entries, code)).toMatchObject({ bucket: "unsupported", sourcePointer: ptr });
      expect(JSON.stringify(report)).not.toContain("secretTotal");
    });
  }

  it("reports logic on a panel", () => {
    const { report } = convert({ components: [
      { type: "panel", key: "p", logic: [{ name: "rule", actions: [] }], components: [{ type: "textfield", key: "t" }] }
    ] });
    expect(entry(report.entries, FormioCodes.CUSTOM_LOGIC)?.sourcePointer).toBe("/components/0/logic/0");
  });
});

// The lint rules a converted form breaks, by rule id.
function lintRules(form: object): string[] {
  return lintOutput(convert(form).output).map((f) => f.ruleId);
}

describe("formio convert - names", () => {
  it("keeps a field keyed page1 and names the single page after it", () => {
    const form = { components: [{ type: "textfield", key: "page1" }] };
    const { output } = convert(form);
    expect(output.pages?.[0].name).toBe("page1_1");
    const survey = assertConstructsCleanly(output, "page1 key");
    survey.data = { page1: "v" };
    expect(survey.getQuestionByName("page1").value).toBe("v");
    expect(lintRules(form)).not.toContain("name/duplicate");
  });

  it("renames a panel whose key differs from a field's only in case", () => {
    const form = { components: [
      { type: "textfield", key: "gate" },
      { type: "textfield", key: "ab" },
      { type: "panel", key: "AB", conditional: { show: true, when: "gate", eq: "y" }, components: [{ type: "textfield", key: "c" }] }
    ] };
    const { output } = convert(form);
    expect(findElement(output, "ab")?.type).toBe("text");
    expect(findElement(output, "AB_1")?.type).toBe("panel");
    expect(findElement(output, "AB_1")?.visibleIf).toBe("{gate} = 'y'");
    assertConstructsCleanly(output, "case");
    const survey = assertConstructsCleanly(output, "case condition");
    survey.data = { gate: "y" };
    expect(survey.getQuestionByName("c").isParentVisible).toBe(true);
    survey.data = { gate: "n" };
    expect(survey.getQuestionByName("c").isParentVisible).toBe(false);
    expect(lintRules(form)).not.toContain("name/duplicate");
  });

  for (const type of ["panel", "fieldset", "container", "well"]) {
    it(`keeps the key of a field inside a ${type} with the same key`, () => {
      const form = { components: [
        { type: "textfield", key: "gate" },
        { type, key: "p", conditional: { show: true, when: "gate", eq: "y" }, components: [{ type: "textfield", key: "p" }] }
      ] };
      const { output } = convert(form);
      expect(findElement(output, "p")?.type).toBe("text");
      expect(findElement(output, "p_1")?.type).toBe("panel");
      expect(findElement(output, "p_1")?.visibleIf).toBe("{gate} = 'y'");
      const survey = assertConstructsCleanly(output, type);
      survey.data = { gate: "y", p: "v" };
      expect(survey.getQuestionByName("p").value).toBe("v");
      expect(survey.getQuestionByName("p").isParentVisible).toBe(true);
      survey.setValue("gate", "n");
      expect(survey.getQuestionByName("p").isParentVisible).toBe(false);
    });
  }

  it("keeps the key of a field inside a data grid with the same key", () => {
    const { output } = convert({ components: [{ type: "datagrid", key: "g", components: [{ type: "textfield", key: "g" }] }] });
    const grid = findElement(output, "g");
    expect(grid?.type).toBe("paneldynamic");
    expect((grid?.templateElements as SurveyJSONElement[])[0].name).toBe("g");
    const survey = assertConstructsCleanly(output, "grid same key");
    survey.data = { g: [{ g: "v" }] };
    expect((survey.getQuestionByName("g") as any).panels[0].getQuestionByName("g").value).toBe("v");
  });

  it("keeps the key of a field on a wizard page with the same key", () => {
    const form = { display: "wizard", components: [
      { type: "panel", key: "p", conditional: { show: true, when: "t", eq: "y" }, components: [{ type: "textfield", key: "p" }] },
      { type: "textfield", key: "t" }
    ] };
    const { output } = convert(form);
    expect(output.pages?.map((p) => p.name)).toEqual(["p_1", "t_1"]);
    expect(output.pages?.map((p) => (p.elements[0] as SurveyJSONElement).name)).toEqual(["p", "t"]);
    expect(output.pages?.[0].visibleIf).toBe("{t} = 'y'");
    const survey = assertConstructsCleanly(output, "wizard names");
    survey.data = { t: "y" };
    expect(survey.getQuestionByName("p").isParentVisible).toBe(true);
    survey.data = { t: "n" };
    expect(survey.getQuestionByName("p").isParentVisible).toBe(false);
  });

  // The grid comes first, so a single name pool would rename the outer `x`.
  const shared = { components: [
    { type: "datagrid", key: "g", components: [
      { type: "textfield", key: "x" },
      { type: "textfield", key: "b", conditional: { show: true, when: "row.x", eq: "1" } },
      { type: "textfield", key: "d", conditional: { show: true, when: "data.x", eq: "5" } }
    ] },
    { type: "textfield", key: "x" },
    { type: "textfield", key: "c", conditional: { show: true, when: "x", eq: "5" } }
  ] };

  it("keeps a key used both inside and outside a data grid", () => {
    const { output } = convert(shared);
    expect(output.pages?.[0].elements.map((e) => (e as SurveyJSONElement).name)).toEqual(["g", "x", "c"]);
    const template = findElement(output, "g")?.templateElements as SurveyJSONElement[];
    expect(template.map((e) => e.name)).toEqual(["x", "b", "d"]);
    expect(template[1].visibleIf).toBe("{panel.x} = '1'");
    expect(template[2].visibleIf).toBe("{x} = '5'");
    expect(findElement(output, "c")?.visibleIf).toBe("{x} = '5'");
    assertConstructsCleanly(output, "shared key names");
  });

  it("resolves conditions on a key used both inside and outside a data grid", () => {
    const load = (data: Record<string, unknown>) => {
      const survey = assertConstructsCleanly(convert(shared).output, "shared key");
      survey.data = data;
      const row = (survey.getQuestionByName("g") as any).panels[0];
      return { c: survey.getQuestionByName("c").isVisible, b: row.getQuestionByName("b").isVisible, d: row.getQuestionByName("d").isVisible };
    };
    expect(load({ x: "5", g: [{ x: "1" }] })).toEqual({ c: true, b: true, d: true });
    expect(load({ x: "1", g: [{ x: "5" }] })).toEqual({ c: false, b: false, d: false });
  });
});

describe("formio convert - structure", () => {
  it("gives no page for a wizard's top-level button", () => {
    const { output, report } = convert({ display: "wizard", components: [
      { type: "panel", key: "one", components: [{ type: "textfield", key: "a" }] },
      { type: "button", key: "submit" },
      { type: "panel", key: "two", components: [{ type: "textfield", key: "b", conditional: { show: true, when: "a", eq: "1" } }] }
    ] });
    expect(output.pages?.map((p) => p.name)).toEqual(["one", "two"]);
    expect(entry(report.entries, FormioCodes.DROPPED_VENDOR_META)?.sourcePointer).toBe("/components/1");
    const survey = assertConstructsCleanly(output, "wizard button");
    survey.data = { a: "1" };
    expect(survey.getQuestionByName("b").isVisible).toBe(true);
    survey.data = { a: "2" };
    expect(survey.getQuestionByName("b").isVisible).toBe(false);
  });

  const onlyButtons: [string, object][] = [
    ["columns", { type: "columns", key: "cols", columns: [{ components: [{ type: "button", key: "save" }] }, { components: [{ type: "button", key: "cancel" }] }] }],
    ["table", { type: "table", key: "tbl", rows: [[{ components: [{ type: "button", key: "save" }] }]] }],
    ["well", { type: "well", key: "wl", components: [{ type: "button", key: "save" }] }]
  ];
  for (const [type, layout] of onlyButtons) {
    it(`gives no element for a ${type} holding only buttons`, () => {
      const { output, report } = convert({ components: [{ type: "textfield", key: "a" }, layout] });
      expect(output.pages?.[0].elements.map((e) => (e as SurveyJSONElement).name)).toEqual(["a"]);
      if (type !== "well") expect(entry(report.entries, FormioCodes.DROPPED_STYLING)).toMatchObject({ sourcePointer: "/components/1", targetPath: "" });
      assertConstructsCleanly(output, type);
    });
  }

  for (const [type, layout] of onlyButtons) {
    it(`gives no page for a wizard's top-level ${type} holding only buttons, and reports its logic and computed value`, () => {
      const logic = [{ name: "l", trigger: { type: "simple", simple: { show: true, when: "a", eq: "1" } },
        actions: [{ name: "act", type: "property", property: { label: "Hidden", value: "hidden", type: "boolean" }, state: true }] }];
      const { output, report } = convert({ display: "wizard", components: [
        { type: "panel", key: "one", components: [{ type: "textfield", key: "a" }] },
        { ...layout, logic, calculateValue: "value = data.secretTotal;" },
        { type: "panel", key: "two", components: [{ type: "textfield", key: "b", conditional: { show: true, when: "a", eq: "1" } }] }
      ] });
      expect(output.pages?.map((p) => p.name)).toEqual(["one", "two"]);
      expect(report.entries.filter((e) => e.code === FormioCodes.CUSTOM_LOGIC || e.code === FormioCodes.CUSTOM_VALUE)
        .map((e) => [e.code, e.sourcePointer, e.targetPath])).toEqual([
        [FormioCodes.CUSTOM_LOGIC, "/components/1/logic/0", ""],
        [FormioCodes.CUSTOM_VALUE, "/components/1/calculateValue", ""]
      ]);
      expect(JSON.stringify(report)).not.toContain("secret");
      expect(output.pages?.[1].elements.map((e) => (e as SurveyJSONElement).name)).toEqual(["b"]);
      if (type !== "well") expect(entry(report.entries, FormioCodes.DROPPED_STYLING)).toMatchObject({ sourcePointer: "/components/1", targetPath: "" });
      const survey = assertConstructsCleanly(output, `wizard ${type}`);
      expect(survey.pages.length).toBe(2);
      survey.data = { a: "1" };
      expect(survey.getQuestionByName("b").isVisible).toBe(true);
      survey.data = { a: "2" };
      expect(survey.getQuestionByName("b").isVisible).toBe(false);
    });
  }

  it("still promotes the fields of a wizard's top-level well to a page", () => {
    const { output } = convert({ display: "wizard", components: [
      { type: "well", key: "wl", hidden: true, components: [{ type: "textfield", key: "a" }, { type: "button", key: "save" }] }
    ] });
    expect(output.pages).toEqual([{ name: "wl", visible: false, elements: [{ type: "text", name: "a", clearIfInvisible: "none" }] }]);
    assertConstructsCleanly(output, "wizard well");
  });

  // A button and a layout container around buttons give no element: their condition, which decides
  // when the form can be submitted, is reported with no target, as their logic is.
  const noElement: [string, Record<string, unknown>][] = [
    ["a button", { type: "button", key: "save" }],
    ["a columns holding only buttons", { type: "columns", key: "cols", columns: [{ components: [{ type: "button", key: "save" }] }] }]
  ];
  for (const [what, comp] of noElement) {
    for (const [where, wizard] of [["in a form", false], ["at the top of a wizard", true]] as [string, boolean][]) {
      it(`reports the condition of ${what} ${where}, with no target`, () => {
        const holder = { ...comp, conditional: { show: true, when: "a", eq: "1" } };
        const f = wizard ? { display: "wizard", components: [{ type: "panel", key: "p", components: [{ type: "textfield", key: "a" }] }, holder] }
          : { components: [{ type: "textfield", key: "a" }, holder] };
        const { output, report } = convert(f);
        expect(report.entries.filter((e) => e.code === FormioCodes.ASSUMED_CONDITIONAL).map((e) => [e.sourcePointer, e.targetPath]))
          .toEqual([["/components/1/conditional", ""]]);
        assertConstructsCleanly(output, `${what} condition`);
      });

      it(`reports the custom condition of ${what} ${where}, content-free`, () => {
        const holder = { ...comp, customConditional: "show = data.secretFlag;", conditional: { show: true, when: "a", eq: "1" } };
        const f = wizard ? { display: "wizard", components: [{ type: "panel", key: "p", components: [{ type: "textfield", key: "a" }] }, holder] }
          : { components: [{ type: "textfield", key: "a" }, holder] };
        const { output, report } = convert(f);
        expect(report.entries.filter((e) => e.code === FormioCodes.CUSTOM_CONDITIONAL).map((e) => [e.sourcePointer, e.targetPath]))
          .toEqual([["/components/1/customConditional", ""]]);
        // The custom condition decides alone, as for any other component.
        expect(entry(report.entries, FormioCodes.ASSUMED_CONDITIONAL)).toBeUndefined();
        expect(JSON.stringify(report)).not.toContain("secret");
        assertConstructsCleanly(output, `${what} custom condition`);
      });
    }
  }

  it("reports no condition for a button whose simple condition lists no condition", () => {
    const { report } = convert({ components: [{ type: "button", key: "save", conditional: { show: null, conjunction: "all", conditions: [] } }] });
    expect(entry(report.entries, FormioCodes.ASSUMED_CONDITIONAL)).toBeUndefined();
  });

  for (const type of ["panel", "fieldset"]) {
    it(`keeps a titled ${type} holding only buttons`, () => {
      const titled = type === "panel" ? { title: "T" } : { legend: "T" };
      const { output } = convert({ components: [{ type, key: "p", ...titled, components: [{ type: "button", key: "save" }] }] });
      expect(findElement(output, "p")).toMatchObject({ type: "panel", title: "T" });
      assertConstructsCleanly(output, type);
    });
  }
});

describe("formio convert - clearOnHide", () => {
  const gate = { type: "textfield", key: "gate" };
  const showOnGate = { show: true, when: "gate", eq: "y" };
  const readsA = { type: "textfield", key: "b", conditional: { show: true, when: "a", eq: "1" } };

  it("clears a field its condition hides, so a field that reads it branches as in Form.io", () => {
    const { output } = convert({ components: [gate, { type: "textfield", key: "a", conditional: showOnGate }, readsA] });
    expect(findElement(output, "a")?.clearIfInvisible).toBe("onHiddenContainer");
    expect(findElement(output, "b")?.clearIfInvisible).toBe("onHiddenContainer");
    const survey = assertConstructsCleanly(output, "clearOnHide own condition");
    survey.data = { gate: "y", a: "1" };
    expect(survey.getQuestionByName("b").isVisible).toBe(true);
    survey.setValue("gate", "n");
    expect(survey.data).toEqual({ gate: "n" });
    expect(survey.getQuestionByName("b").isVisible).toBe(false);
    survey.doComplete();
    expect(survey.data).toEqual({ gate: "n" });
  });

  it("keeps the value of a field with clearOnHide: false that its condition hides, through completion", () => {
    const { output } = convert({ components: [gate, { type: "textfield", key: "a", clearOnHide: false, conditional: showOnGate }, readsA] });
    expect(findElement(output, "a")?.clearIfInvisible).toBe("none");
    const survey = assertConstructsCleanly(output, "clearOnHide false");
    survey.data = { gate: "y", a: "1" };
    survey.setValue("gate", "n");
    expect(survey.data).toEqual({ gate: "n", a: "1" });
    expect(survey.getQuestionByName("b").isVisible).toBe(true);
    survey.doComplete();
    expect(survey.data).toEqual({ gate: "n", a: "1" });
  });

  it("keeps the value of a field with clearOnHide: false in a conditional panel that hides, through completion", () => {
    const { output } = convert({ components: [
      gate,
      { type: "panel", key: "p", conditional: showOnGate, components: [{ type: "textfield", key: "a", clearOnHide: false }, { type: "textfield", key: "c" }] }
    ] });
    expect(findElement(output, "a")?.clearIfInvisible).toBe("none");
    expect(findElement(output, "c")?.clearIfInvisible).toBe("onHiddenContainer");
    const survey = assertConstructsCleanly(output, "clearOnHide false in conditional panel");
    survey.data = { gate: "y", a: "1", c: "2" };
    survey.setValue("gate", "n");
    expect(survey.data).toEqual({ gate: "n", a: "1" });
    survey.doComplete();
    expect(survey.data).toEqual({ gate: "n", a: "1" });
  });

  it("leaves a field with clearOnHide: false alone when nothing can hide it", () => {
    const { output } = convert({ components: [gate, { type: "panel", key: "p", components: [{ type: "textfield", key: "a", clearOnHide: false }] }] });
    expect(findElement(output, "a")?.clearIfInvisible).toBeUndefined();
    expect(findElement(output, "gate")?.clearIfInvisible).toBeUndefined();
    const survey = assertConstructsCleanly(output, "clearOnHide false never hidden");
    survey.data = { gate: "n", a: "1" };
    survey.doComplete();
    expect(survey.data).toEqual({ gate: "n", a: "1" });
  });

  it("keeps the default of a statically hidden field through completion", () => {
    const { output } = convert({ components: [
      gate,
      { type: "textfield", key: "h", hidden: true, defaultValue: "d" },
      { type: "panel", key: "p", conditional: showOnGate, components: [{ type: "textfield", key: "k", hidden: true, defaultValue: "e" }] }
    ] });
    expect(findElement(output, "h")?.clearIfInvisible).toBe("none");
    expect(findElement(output, "k")?.clearIfInvisible).toBe("none");
    const survey = assertConstructsCleanly(output, "clearOnHide static hidden");
    survey.setValue("gate", "y");
    expect(survey.data).toEqual({ gate: "y", h: "d", k: "e" });
    survey.doComplete();
    expect(survey.data).toEqual({ gate: "y", h: "d", k: "e" });
  });

  it("keeps the value of a statically hidden field through completion", () => {
    const { output } = convert({ components: [gate, { type: "textfield", key: "h", hidden: true }] });
    expect(findElement(output, "h")?.clearIfInvisible).toBe("none");
    expect(findElement(output, "gate")?.clearIfInvisible).toBeUndefined();
    const survey = assertConstructsCleanly(output, "clearOnHide static hidden value");
    survey.data = { gate: "n", h: "v" };
    survey.doComplete();
    expect(survey.data).toEqual({ gate: "n", h: "v" });
  });

  it("keeps the values of every field in a statically hidden container through completion", () => {
    const { output } = convert({ components: [
      gate,
      { type: "panel", key: "p", hidden: true, components: [
        { type: "textfield", key: "m", defaultValue: "f" },
        { type: "columns", key: "cols", columns: [{ components: [{ type: "textfield", key: "n" }] }] },
        { type: "fieldset", key: "fs", components: [{ type: "textfield", key: "o", clearOnHide: false }] }
      ] },
      { type: "well", key: "w", hidden: true, components: [{ type: "textfield", key: "q" }] }
    ] });
    for (const name of ["m", "n", "o", "q"]) expect(findElement(output, name)?.clearIfInvisible).toBe("none");
    expect(findElement(output, "gate")?.clearIfInvisible).toBeUndefined();
    const survey = assertConstructsCleanly(output, "clearOnHide static hidden container");
    expect(survey.data).toEqual({ m: "f" });
    survey.data = { gate: "n", m: "f", n: "1", o: "2", q: "3" };
    survey.doComplete();
    expect(survey.data).toEqual({ gate: "n", m: "f", n: "1", o: "2", q: "3" });
  });

  it("clears a field in a conditional panel", () => {
    const { output } = convert({ components: [
      gate,
      { type: "panel", key: "p", conditional: showOnGate, components: [
        { type: "columns", key: "cols", columns: [{ components: [{ type: "textfield", key: "a" }] }] },
        { type: "htmlelement", key: "note", html: "<p>Note</p>" }
      ] },
      readsA
    ] });
    expect(findElement(output, "a")?.clearIfInvisible).toBe("onHiddenContainer");
    expect(findElement(output, "p")?.clearIfInvisible).toBeUndefined();
    expect(findElement(output, "note")?.clearIfInvisible).toBeUndefined();
    const survey = assertConstructsCleanly(output, "clearOnHide panel");
    survey.data = { gate: "y", a: "1" };
    expect(survey.getQuestionByName("b").isVisible).toBe(true);
    survey.setValue("gate", "n");
    expect(survey.data).toEqual({ gate: "n" });
    expect(survey.getQuestionByName("b").isVisible).toBe(false);
    survey.doComplete();
    expect(survey.data).toEqual({ gate: "n" });
  });

  it("clears a conditional data grid and the fields of a conditional wizard page", () => {
    const { output } = convert({ display: "wizard", components: [
      { type: "panel", key: "one", components: [gate, { type: "datagrid", key: "g", conditional: showOnGate, components: [{ type: "textfield", key: "x" }] }] },
      { type: "panel", key: "two", conditional: showOnGate, components: [{ type: "textfield", key: "a" }] }
    ] });
    expect(findElement(output, "g")?.clearIfInvisible).toBe("onHiddenContainer");
    expect(findElement(output, "x")?.clearIfInvisible).toBe("onHiddenContainer");
    expect(findElement(output, "a")?.clearIfInvisible).toBe("onHiddenContainer");
    const survey = assertConstructsCleanly(output, "clearOnHide grid and page");
    survey.data = { gate: "y", g: [{ x: "1" }], a: "2" };
    survey.setValue("gate", "n");
    expect(survey.data).toEqual({ gate: "n" });
    survey.doComplete();
    expect(survey.data).toEqual({ gate: "n" });
  });

  it("treats the fields of a data grid row as other fields", () => {
    const { output } = convert({ components: [
      gate,
      { type: "datagrid", key: "g", components: [
        { type: "textfield", key: "x" },
        { type: "textfield", key: "h", hidden: true, defaultValue: "d" },
        { type: "textfield", key: "k", clearOnHide: false, conditional: { show: true, when: "row.x", eq: "1" } },
        { type: "textfield", key: "c", conditional: { show: true, when: "row.x", eq: "1" } }
      ] },
      { type: "datagrid", key: "s", hidden: true, components: [{ type: "textfield", key: "y" }] }
    ] });
    const row = findElement(output, "g")?.templateElements as SurveyJSONElement[];
    expect(row.map((e) => e.clearIfInvisible)).toEqual([undefined, "none", "none", "onHiddenContainer"]);
    expect(findElement(output, "g")?.clearIfInvisible).toBeUndefined();
    expect(findElement(output, "s")?.clearIfInvisible).toBe("none");
    expect((findElement(output, "s")?.templateElements as SurveyJSONElement[])[0].clearIfInvisible).toBe("none");
    const survey = assertConstructsCleanly(output, "clearOnHide grid rows");
    survey.data = { g: [{ x: "1", h: "d", k: "2", c: "3" }], s: [{ y: "4" }] };
    (survey.getQuestionByName("g") as any).panels[0].getQuestionByName("x").value = "0";
    expect(survey.data).toEqual({ g: [{ x: "0", h: "d", k: "2" }], s: [{ y: "4" }] });
    survey.doComplete();
    expect(survey.data).toEqual({ g: [{ x: "0", h: "d", k: "2" }], s: [{ y: "4" }] });
  });

  // The grid's own setting is "none"; its fields do not inherit it, so `x` clears with the grid
  // (onHiddenContainer) and `k`, which sets clearOnHide: false itself, keeps its value.
  it("keeps a data grid with clearOnHide: false that its condition hides, and lets its fields follow their own rule", () => {
    const { output } = convert({ components: [
      gate,
      { type: "datagrid", key: "g", clearOnHide: false, conditional: showOnGate, components: [
        { type: "textfield", key: "x" },
        { type: "textfield", key: "k", clearOnHide: false }
      ] }
    ] });
    expect(findElement(output, "g")?.clearIfInvisible).toBe("none");
    const row = findElement(output, "g")?.templateElements as SurveyJSONElement[];
    expect(row.map((e) => e.clearIfInvisible)).toEqual(["onHiddenContainer", "none"]);
    const survey = assertConstructsCleanly(output, "clearOnHide false grid");
    survey.data = { gate: "y", g: [{ x: "1", k: "2" }] };
    survey.setValue("gate", "n");
    expect(survey.getQuestionByName("g").isVisible).toBe(false);
    expect(survey.data).toEqual({ gate: "n", g: [{ k: "2" }] });
    survey.doComplete();
    expect(survey.data).toEqual({ gate: "n", g: [{ k: "2" }] });
  });

  it("clears the fields of a row by that row's own visibility", () => {
    const { output } = convert({ components: [
      { type: "datagrid", key: "g", components: [
        { type: "textfield", key: "x" },
        { type: "textfield", key: "k", clearOnHide: false, conditional: { show: true, when: "row.x", eq: "1" } },
        { type: "textfield", key: "c", conditional: { show: true, when: "row.x", eq: "1" } }
      ] }
    ] });
    const survey = assertConstructsCleanly(output, "clearOnHide rows");
    survey.data = { g: [{ x: "1", k: "a", c: "b" }, { x: "1", k: "d", c: "e" }] };
    const panels = (survey.getQuestionByName("g") as any).panels;
    panels[1].getQuestionByName("x").value = "0";
    expect(panels[0].getQuestionByName("c").isVisible).toBe(true);
    expect(panels[1].getQuestionByName("c").isVisible).toBe(false);
    expect(survey.data).toEqual({ g: [{ x: "1", k: "a", c: "b" }, { x: "0", k: "d" }] });
    survey.doComplete();
    expect(survey.data).toEqual({ g: [{ x: "1", k: "a", c: "b" }, { x: "0", k: "d" }] });
  });

  it("leaves a field alone when its condition does not convert", () => {
    const { output, report } = convert({ components: [{ type: "textfield", key: "a", conditional: { show: true, when: "nowhere", eq: "y" } }] });
    expect(entry(report.entries, FormioCodes.ASSUMED_CONDITIONAL)).toBeDefined();
    expect(findElement(output, "a")?.clearIfInvisible).toBeUndefined();
    assertConstructsCleanly(output, "clearOnHide condition not converted");
  });

  it("leaves a field alone when its panel's condition does not convert", () => {
    const { output, report } = convert({ components: [
      gate,
      { type: "panel", key: "p", conditional: { show: true, when: "nowhere", eq: "y" }, components: [{ type: "textfield", key: "a" }] }
    ] });
    expect(entry(report.entries, FormioCodes.ASSUMED_CONDITIONAL)).toBeDefined();
    expect(findElement(output, "a")?.clearIfInvisible).toBeUndefined();
    const survey = assertConstructsCleanly(output, "clearOnHide panel condition not converted");
    survey.data = { gate: "n", a: "1" };
    expect(survey.data).toEqual({ gate: "n", a: "1" });
    survey.doComplete();
    expect(survey.data).toEqual({ gate: "n", a: "1" });
  });

  it("keeps the value of a conditional field inside a statically hidden panel, which survey-core would always clear", () => {
    const { output } = convert({ components: [
      gate,
      { type: "panel", key: "p", hidden: true, components: [{ type: "textfield", key: "a", conditional: showOnGate }] }
    ] });
    expect(findElement(output, "a")?.visibleIf).toBe("{gate} = 'y'");
    expect(findElement(output, "a")?.clearIfInvisible).toBe("none");
    const survey = assertConstructsCleanly(output, "clearOnHide conditional in static hidden panel");
    survey.data = { gate: "y", a: "1" };
    survey.setValue("gate", "n");
    expect(survey.getQuestionByName("a").isVisible).toBe(false);
    expect(survey.data).toEqual({ gate: "n", a: "1" });
    survey.doComplete();
    expect(survey.data).toEqual({ gate: "n", a: "1" });
  });

  it("clears a conditional field in a hidden panel that logic shows, and keeps the panel's other fields", () => {
    const show = { name: "show", trigger: { type: "simple", simple: showOnGate }, actions: [
      { name: "s", type: "property", property: { label: "Hidden", value: "hidden", type: "boolean" }, state: false }
    ] };
    const { output } = convert({ components: [
      gate,
      { type: "textfield", key: "gate2" },
      { type: "panel", key: "p", hidden: true, logic: [show], components: [
        { type: "textfield", key: "a", conditional: { show: true, when: "gate2", eq: "y" } },
        { type: "textfield", key: "c" }
      ] }
    ] });
    expect(findElement(output, "p")?.visibleIf).toBe("{gate} = 'y'");
    expect(findElement(output, "a")?.clearIfInvisible).toBe("onHiddenContainer");
    expect(findElement(output, "c")?.clearIfInvisible).toBe("none");
    const survey = assertConstructsCleanly(output, "clearOnHide in a panel logic shows");
    survey.data = { gate: "y", gate2: "y", a: "1", c: "2" };
    survey.setValue("gate2", "n");
    expect(survey.data).toEqual({ gate: "y", gate2: "n", c: "2" });
    survey.setValue("gate", "n");
    survey.doComplete();
    expect(survey.data).toEqual({ gate: "n", gate2: "n", c: "2" });
  });

  it("keeps the values of a hidden panel that logic shows while it is hidden", () => {
    const show = { name: "show", trigger: { type: "simple", simple: showOnGate }, actions: [
      { name: "s", type: "property", property: { label: "Hidden", value: "hidden", type: "boolean" }, state: false }
    ] };
    const { output } = convert({ components: [
      gate,
      { type: "panel", key: "p", hidden: true, logic: [show], components: [{ type: "textfield", key: "c" }] }
    ] });
    const survey = assertConstructsCleanly(output, "clearOnHide in a hidden panel logic shows");
    survey.data = { gate: "n", c: "2" };
    survey.doComplete();
    expect(survey.data).toEqual({ gate: "n", c: "2" });
  });
});

describe("formio convert - container data", () => {
  it("reports a container, whose fields Form.io nests under its key", () => {
    const form = { components: [{ type: "container", key: "c", components: [{ type: "textfield", key: "a" }] }] };
    const { output, report } = convert(form);
    expect(entry(report.entries, FormioCodes.ASSUMED_CONTAINER_DATA)).toMatchObject({
      bucket: "assumed", sourcePointer: "/components/0", targetPath: "pages[0].elements[0]"
    });
    assertConstructsCleanly(output, "container");
  });

  it("reports a container that becomes a wizard page", () => {
    const { output, report } = convert({ display: "wizard", components: [{ type: "container", key: "c", components: [{ type: "textfield", key: "a" }] }] });
    expect(entry(report.entries, FormioCodes.ASSUMED_CONTAINER_DATA)).toMatchObject({ bucket: "assumed", sourcePointer: "/components/0", targetPath: "pages[0]" });
    assertConstructsCleanly(output, "wizard container");
  });

  it("does not report a panel", () => {
    const { output, report } = convert({ components: [{ type: "panel", key: "p", components: [{ type: "textfield", key: "a" }] }] });
    expect(entry(report.entries, FormioCodes.ASSUMED_CONTAINER_DATA)).toBeUndefined();
    assertConstructsCleanly(output, "panel");
  });
});

describe("formio convert - date and time defaults", () => {
  const convertDefault = (comp: Record<string, unknown>) => {
    const { output, report } = convert({ components: [{ key: "d", ...comp }] });
    const survey = assertConstructsCleanly(output, "date default");
    return { defaultValue: findElement(output, "d")?.defaultValue, value: survey.getQuestionByName("d").value, report };
  };

  it("gives no default for Form.io's empty day, without a report entry", () => {
    const { defaultValue, value, report } = convertDefault({ type: "day", defaultValue: "00/00/0000" });
    expect(defaultValue).toBeUndefined();
    expect(value).toBeUndefined();
    expect(report.entries).toEqual([]);
  });

  it("reads a day as month first, or day first with dayFirst", () => {
    expect(convertDefault({ type: "day", defaultValue: "07/04/2025" }).value).toBe("2025-07-04");
    expect(convertDefault({ type: "day", defaultValue: "07/04/2025", dayFirst: true }).value).toBe("2025-04-07");
  });

  it("reads a time from 12-hour and from 24-hour with seconds", () => {
    expect(convertDefault({ type: "time", defaultValue: "03:03 PM" }).value).toBe("15:03");
    expect(convertDefault({ type: "time", defaultValue: "12:15 AM" }).value).toBe("00:15");
    expect(convertDefault({ type: "time", defaultValue: "13:57:00" }).value).toBe("13:57");
  });

  it("reads a datetime with seconds, and defaultDate when there is no defaultValue", () => {
    expect(convertDefault({ type: "datetime", defaultValue: "2018-08-03T17:53:52" }).value).toBe("2018-08-03T17:53");
    expect(convertDefault({ type: "datetime", defaultDate: "2018-08-03T17:53:04" }).value).toBe("2018-08-03T17:53");
    expect(convertDefault({ type: "datetime", defaultValue: "2018-08-03T17:53:52", defaultDate: "2020-01-01T00:00:00" }).value).toBe("2018-08-03T17:53");
  });

  const unparseable: [string, Record<string, unknown>, string][] = [
    ["a day that is not a date", { type: "day", defaultValue: "13/45/2025" }, "defaultValue"],
    ["a day with a zero part", { type: "day", defaultValue: "07/00/2025" }, "defaultValue"],
    ["a time that is not a time", { type: "time", defaultValue: "noon" }, "defaultValue"],
    ["a datetime in another zone", { type: "datetime", defaultValue: "2018-08-03T17:53:52Z" }, "defaultValue"],
    ["a defaultDate that is code", { type: "datetime", defaultDate: "moment().add(secretDays, 'days')" }, "defaultDate"]
  ];
  for (const [what, comp, key] of unparseable) {
    it(`gives no default for ${what}, and reports it assumed`, () => {
      const { defaultValue, value, report } = convertDefault(comp);
      expect(defaultValue).toBeUndefined();
      expect(value).toBeUndefined();
      expect(entry(report.entries, FormioCodes.ASSUMED_DEFAULT_VALUE)).toMatchObject({
        bucket: "assumed", sourcePointer: `/components/0/${key}`, targetPath: "pages[0].elements[0].defaultValue"
      });
      expect(JSON.stringify(report)).not.toContain("secretDays");
    });
  }
});

describe("formio convert - date and time condition literals", () => {
  const form = (comp: Record<string, unknown>, conditional: unknown) => ({ components: [
    { key: "d", ...comp },
    { type: "textfield", key: "b", conditional }
  ] });
  const legacy = (eq: unknown) => ({ show: true, when: "d", eq });
  const simple = (operator: string, value: unknown) => simpleConditional(true, [{ component: "d", operator, value }]);

  // Form.io stores a day as `MM/DD/YYYY` (`DD/MM/YYYY` with dayFirst) and a time in its `dataFormat`
  // (`HH:mm:ss`), compares them as text for equality, and as moments for the date operators.
  // [what, component, conditional, value that shows the field, value that does not, visibleIf]
  const kept: [string, Record<string, unknown>, unknown, string, string, string][] = [
    ["a day equal to the text Form.io stores", { type: "day" }, legacy("07/04/2025"), "2025-07-04", "2025-07-05", "{d} = '2025-07-04'"],
    ["a day-first day equal to the text Form.io stores", { type: "day", dayFirst: true }, legacy("04/07/2025"), "2025-07-04", "2025-04-07", "{d} = '2025-07-04'"],
    ["a day in JSON logic", { type: "day" }, { json: { "==": [{ var: "data.d" }, "07/04/2025"] } }, "2025-07-04", "2025-07-05", "{d} = '2025-07-04'"],
    ["a time equal to the text Form.io stores", { type: "time" }, legacy("15:03:00"), "15:03", "15:04", "{d} = '15:03'"],
    ["a time with an HH:mm data format", { type: "time", dataFormat: "HH:mm" }, simple("isEqual", "15:03"), "15:03", "03:03", "({d} = '15:03')"],
    ["a day after an unpadded date", { type: "day" }, simple("dateGreaterThan", "9/20/2022"), "2022-09-21", "2022-09-20", "({d} > '2022-09-20')"],
    ["a day-first day on or before a date", { type: "day", dayFirst: true }, simple("dateLessThanOrEqual", "20/09/2022"), "2022-09-20", "2022-09-21", "({d} <= '2022-09-20')"],
    ["a datetime before a local date and time", { type: "datetime" }, simple("dateLessThan", "2023-01-19T12:00:00"), "2023-01-19T11:59", "2023-01-19T12:00", "({d} < '2023-01-19T12:00')"],
    ["a date-only datetime on a date", { type: "datetime", enableTime: false }, simple("isDateEqual", "2022-09-20"), "2022-09-20", "2022-09-21", "({d} = '2022-09-20')"]
  ];
  for (const [what, comp, conditional, yes, no, visibleIf] of kept) {
    it(`compares ${what} with the ISO value the input stores`, () => {
      const f = form(comp, conditional);
      expect(findElement(convert(f).output, "b")?.visibleIf).toBe(visibleIf);
      expect(isVisible(f, { d: yes }, "b")).toBe(true);
      expect(isVisible(f, { d: no }, "b")).toBe(false);
    });
  }

  // [what, component, conditional, pointer of the refused part]
  const refused: [string, Record<string, unknown>, unknown, string][] = [
    ["an unpadded day, which Form.io never stores", { type: "day" }, legacy("7/4/2025"), "when"],
    ["a day in ISO form", { type: "day" }, legacy("2025-07-04"), "when"],
    ["a day with a hidden part", { type: "day", fields: { day: { hide: true } } }, simple("dateGreaterThan", "9/20/2022"), "conditions/0"],
    ["a day read in the viewer's locale", { type: "day", useLocaleSettings: true }, simple("dateGreaterThan", "9/20/2022"), "conditions/0"],
    ["a day compared as a number", { type: "day" }, simple("greaterThan", "9/20/2022"), "conditions/0"],
    ["a day compared as text", { type: "day" }, simple("includes", "2025"), "conditions/0"],
    ["a time in 12-hour form", { type: "time" }, legacy("03:03 PM"), "when"],
    ["a time without the seconds Form.io stores", { type: "time" }, legacy("15:03"), "when"],
    ["a time with seconds the input cannot hold", { type: "time" }, legacy("15:03:30"), "when"],
    ["a time compared as a date", { type: "time" }, simple("dateGreaterThan", "15:03:00"), "conditions/0"],
    ["a datetime equal to a text", { type: "datetime" }, legacy("2022-09-29T12:00:00+03:00"), "when"],
    ["a datetime after a date and time in a zone", { type: "datetime" }, simple("dateGreaterThan", "2021-09-16T12:00:00+03:00"), "conditions/0"],
    ["a datetime equal to a time with seconds", { type: "datetime" }, simple("isDateEqual", "2022-09-29T12:00:30"), "conditions/0"],
    ["a date-only datetime on a time of day", { type: "datetime", enableTime: false }, simple("isDateEqual", "2022-09-20T10:00:00"), "conditions/0"],
    ["a time-only datetime", { type: "datetime", enableDate: false }, simple("dateGreaterThan", "2022-09-20T10:00:00"), "conditions/0"]
  ];
  for (const [what, comp, conditional, ptr] of refused) {
    it(`gives no condition for ${what}, and reports it assumed`, () => {
      const f = form(comp, conditional);
      const { output, report } = convert(f);
      expect(findElement(output, "b")?.visibleIf).toBeUndefined();
      expect(report.entries.filter((e) => e.code === FormioCodes.ASSUMED_CONDITIONAL).map((e) => e.sourcePointer))
        .toEqual([`/components/1/conditional/${ptr}`]);
      expect(isVisible(f, {}, "b")).toBe(true);
    });
  }
});

describe("formio convert - HTML templates", () => {
  const html = (name: string, survey: ReturnType<typeof assertConstructsCleanly>) =>
    (survey.getQuestionByName(name) as unknown as { processedHtml: string }).processedHtml;

  it("pipes a field's value for {{ data.x }}, by the field's output name", () => {
    const { output, report } = convert({ components: [
      { type: "textfield", key: "x" },
      { type: "container", key: "c", components: [{ type: "textfield", key: "x" }] },
      { type: "htmlelement", key: "note", html: "<p>{{ data.x }} and {{data.c.x}}</p>" },
      { type: "content", key: "text", html: "<b>{{ data.x }}</b>" }
    ] });
    expect(findElement(output, "note")?.html).toBe("<p>{x} and {x_1}</p>");
    expect(findElement(output, "text")?.html).toBe("<b>{x}</b>");
    expect(entry(report.entries, FormioCodes.CUSTOM_TEMPLATE)).toBeUndefined();
    const survey = assertConstructsCleanly(output, "html template");
    survey.data = { x: "Ann", x_1: "Bob" };
    expect(html("note", survey)).toBe("<p>Ann and Bob</p>");
    expect(html("text", survey)).toBe("<b>Ann</b>");
  });

  describe("a survey field", () => {
    const survey = { type: "survey", key: "s", questions: [{ label: "Q1", value: "q1" }, { label: "Q2", value: "q2" }, { label: "Q3", value: "q.3" }],
      values: [{ label: "yes", value: "yes" }, { value: "no" }] };

    it("pipes the value of one of its rows for {{ data.s.<row> }}", () => {
      const { output, report } = convert({ components: [survey, { type: "htmlelement", key: "note", html: "<p>{{ data.s.q1 }} / {{data.s.q2}}</p>" }] });
      expect(findElement(output, "note")?.html).toBe("<p>{s.q1} / {s.q2}</p>");
      expect(report.entries).toEqual([]);
      const model = assertConstructsCleanly(output, "survey row template");
      model.data = { s: { q1: "yes", q2: "no" } };
      expect(html("note", model)).toBe("<p>yes / no</p>");
    });

    it("reads one of its rows in a URL", () => {
      const { output, report } = convert({ components: [survey,
        { type: "select", key: "c", dataSrc: "url", data: { url: "https://x.test/api?a={{ data.s.q1 }}" } }] });
      expect((findElement(output, "c")?.choicesByUrl as Record<string, string>).url).toBe("https://x.test/api?a={s.q1}");
      expect(report.entries.filter((e) => e.code === FormioCodes.UNSUPPORTED_DATA_SOURCE)).toEqual([]);
      assertConstructsCleanly(output, "survey row url");
    });

    it("refuses a row of a field whose column text is not its value, which survey-core would pipe instead", () => {
      const labelled = { ...survey, values: [{ label: "Yes", value: "yes" }, { label: "No", value: "no" }] };
      const { output, report } = convert({ components: [labelled, { type: "htmlelement", key: "note", html: "{{ data.s.q1 }}" }] });
      expect(findElement(output, "note")?.html).toBe("{{ data.s.q1 }}");
      expect(entry(report.entries, FormioCodes.CUSTOM_TEMPLATE)).toBeDefined();
    });

    for (const [what, text] of [
      ["the field itself", "{{ data.s }}"],
      ["a name that is not a row", "{{ data.s.q9 }}"],
      ["a row below a row", "{{ data.s.q1.deeper }}"],
      ["a row key with a dot", "{{ data.s.q.3 }}"]
    ]) {
      it(`still refuses ${what} in a template and in a URL`, () => {
        const { output, report } = convert({ components: [survey, { type: "htmlelement", key: "note", html: text },
          { type: "select", key: "c", dataSrc: "url", data: { url: `https://x.test/api?a=${text}` } }] });
        expect(findElement(output, "note")?.html).toBe(text);
        expect(findElement(output, "c")?.choicesByUrl).toBeUndefined();
        expect(entry(report.entries, FormioCodes.CUSTOM_TEMPLATE)).toBeDefined();
        expect(entry(report.entries, FormioCodes.UNSUPPORTED_DATA_SOURCE)).toBeDefined();
      });
    }
  });

  it("pipes an outer field's value in a data grid", () => {
    const { output } = convert({ components: [
      { type: "textfield", key: "x" },
      { type: "datagrid", key: "g", components: [{ type: "htmlelement", key: "note", html: "{{ data.x }}" }] }
    ] });
    expect(findElement(output, "note")?.html).toBe("{x}");
    const survey = assertConstructsCleanly(output, "html template in a grid");
    survey.data = { x: "Ann", g: [{}] };
    const row = (survey.getQuestionByName("g") as unknown as { panels: { getQuestionByName(n: string): unknown }[] }).panels[0];
    expect((row.getQuestionByName("note") as { processedHtml: string }).processedHtml).toBe("Ann");
  });

  it("reads an htmlelement's content key, piping a field and reporting at /content", () => {
    const { output, report } = convert({ components: [
      { type: "textfield", key: "x" },
      { type: "htmlelement", key: "note", tag: "p", content: "{{ data.x }} / {{ data.x + secretSuffix }}" }
    ] });
    expect(findElement(output, "note")?.html).toBe("{x} / {{ data.x + secretSuffix }}");
    expect(entry(report.entries, FormioCodes.CUSTOM_TEMPLATE)).toMatchObject({ bucket: "unsupported", sourcePointer: "/components/1/content" });
    expect(JSON.stringify(report)).not.toContain("secretSuffix");
    const survey = assertConstructsCleanly(output, "htmlelement content");
    survey.data = { x: "Ann" };
    expect(html("note", survey).startsWith("Ann / ")).toBe(true);
  });

  it("reports a {% %} code block and leaves the text as written", () => {
    const written = "{% if (data.secretFlag) { %}<p>Yes</p>{% } %}";
    const { output, report } = convert({ components: [{ type: "content", key: "note", html: written }] });
    expect(findElement(output, "note")?.html).toBe(written);
    expect(entry(report.entries, FormioCodes.CUSTOM_TEMPLATE)).toMatchObject({ bucket: "unsupported", sourcePointer: "/components/0/html" });
    expect(JSON.stringify(report)).not.toContain("secretFlag");
    assertConstructsCleanly(output, "code block");
  });

  it("reports any other template and leaves the text as written", () => {
    const written = "<p>{{ data.x.toUpperCase() }} {{ data.x }} {{ data.nowhere }}</p>";
    const { output, report } = convert({ components: [
      { type: "textfield", key: "x" },
      { type: "htmlelement", key: "note", html: written }
    ] });
    expect(findElement(output, "note")?.html).toBe("<p>{{ data.x.toUpperCase() }} {x} {{ data.nowhere }}</p>");
    const custom = report.entries.filter((e) => e.code === FormioCodes.CUSTOM_TEMPLATE);
    expect(custom).toHaveLength(1);
    expect(custom[0]).toMatchObject({ bucket: "unsupported", sourcePointer: "/components/1/html" });
    expect(JSON.stringify(report)).not.toContain("toUpperCase");
    expect(JSON.stringify(report)).not.toContain("nowhere");
    assertConstructsCleanly(output, "custom template");
  });
});

describe("formio convert - truthiness in JSON logic", () => {
  // [target type, a value that is truthy, values that are falsy]
  const rows: [string, unknown, unknown[]][] = [
    ["checkbox", true, [false, undefined]],
    ["textfield", "x", ["", undefined]],
    ["textarea", "0", ["", undefined]],
    ["number", 5, [0, undefined]]
  ];
  const form = (type: string, json: unknown) => ({ components: [
    { type, key: "a" },
    { type: "textfield", key: "b", conditional: { json } }
  ] });
  const data = (value: unknown): Record<string, unknown> => (value === undefined ? {} : { a: value });

  for (const [type, truthy, falsy] of rows) {
    it(`shows a field on a truthy ${type} with a bare var`, () => {
      const f = form(type, { var: "data.a" });
      expect(entry(convert(f).report.entries, FormioCodes.ASSUMED_CONDITIONAL)).toBeUndefined();
      expect(isVisible(f, data(truthy), "b")).toBe(true);
      for (const value of falsy) expect(isVisible(f, data(value), "b")).toBe(false);
    });

    it(`hides a field on a truthy ${type} with !`, () => {
      for (const json of [{ "!": { var: "data.a" } }, { "!": [{ var: "data.a" }] }]) {
        const f = form(type, json);
        expect(entry(convert(f).report.entries, FormioCodes.ASSUMED_CONDITIONAL)).toBeUndefined();
        expect(isVisible(f, data(truthy), "b")).toBe(false);
        for (const value of falsy) expect(isVisible(f, data(value), "b")).toBe(true);
      }
    });

    it(`shows a field on a truthy ${type} with !!`, () => {
      const f = form(type, { "!!": [{ var: "data.a" }] });
      expect(entry(convert(f).report.entries, FormioCodes.ASSUMED_CONDITIONAL)).toBeUndefined();
      expect(isVisible(f, data(truthy), "b")).toBe(true);
      for (const value of falsy) expect(isVisible(f, data(value), "b")).toBe(false);
    });

    it(`shows a field on a truthy ${type} with !! written with an object argument`, () => {
      const f = form(type, { "!!": { var: "data.a" } });
      expect(findElement(convert(f).output, "b")?.visibleIf).toBeDefined();
      expect(entry(convert(f).report.entries, FormioCodes.ASSUMED_CONDITIONAL)).toBeUndefined();
      expect(isVisible(f, data(truthy), "b")).toBe(true);
      for (const value of falsy) expect(isVisible(f, data(value), "b")).toBe(false);
    });
  }

  it("negates any other translated expression", () => {
    const f = form("textfield", { "!": { "==": [{ var: "data.a" }, "x"] } });
    expect(isVisible(f, { a: "x" }, "b")).toBe(false);
    expect(isVisible(f, { a: "y" }, "b")).toBe(true);
  });

  it("reads a truthy var inside and", () => {
    const f = { components: [
      { type: "checkbox", key: "a" },
      { type: "textfield", key: "c" },
      { type: "textfield", key: "b", conditional: { json: { and: [{ var: "data.a" }, { "==": [{ var: "data.c" }, "x"] }] } } }
    ] };
    expect(isVisible(f, { a: true, c: "x" }, "b")).toBe(true);
    expect(isVisible(f, { a: false, c: "x" }, "b")).toBe(false);
    expect(isVisible(f, { a: true, c: "y" }, "b")).toBe(false);
  });

  it("reads a truthy var inside or", () => {
    const f = { components: [
      { type: "checkbox", key: "a" },
      { type: "textfield", key: "c" },
      { type: "textfield", key: "b", conditional: { json: { or: [{ var: "data.a" }, { "==": [{ var: "data.c" }, "x"] }] } } }
    ] };
    expect(entry(convert(f).report.entries, FormioCodes.ASSUMED_CONDITIONAL)).toBeUndefined();
    expect(isVisible(f, { a: true, c: "y" }, "b")).toBe(true);
    expect(isVisible(f, { a: false, c: "x" }, "b")).toBe(true);
    expect(isVisible(f, { a: true, c: "x" }, "b")).toBe(true);
    expect(isVisible(f, { a: false, c: "y" }, "b")).toBe(false);
    expect(isVisible(f, {}, "b")).toBe(false);
  });

  it("reads two truthy vars inside or", () => {
    const f = { components: [
      { type: "textfield", key: "a" },
      { type: "number", key: "n" },
      { type: "textfield", key: "b", conditional: { json: { or: [{ var: "data.a" }, { var: "data.n" }] } } }
    ] };
    expect(entry(convert(f).report.entries, FormioCodes.ASSUMED_CONDITIONAL)).toBeUndefined();
    expect(isVisible(f, { a: "x" }, "b")).toBe(true);
    expect(isVisible(f, { n: 3 }, "b")).toBe(true);
    expect(isVisible(f, { a: "", n: 0 }, "b")).toBe(false);
    expect(isVisible(f, {}, "b")).toBe(false);
  });

  it("refuses ! with two arguments, which JSON logic reads from the first", () => {
    for (const json of [{ "!": [{ var: "data.a" }, { var: "data.c" }] }, { "!!": [{ var: "data.a" }, { var: "data.c" }] }]) {
      const f = { components: [
        { type: "textfield", key: "a" },
        { type: "textfield", key: "c" },
        { type: "textfield", key: "b", conditional: { json } }
      ] };
      const { output, report } = convert(f);
      expect(findElement(output, "b")?.visibleIf).toBeUndefined();
      expect(entry(report.entries, FormioCodes.ASSUMED_CONDITIONAL)?.sourcePointer).toBe("/components/2/conditional/json");
      assertConstructsCleanly(output, "! with two arguments");
      expect(isVisible(f, { a: "x" }, "b")).toBe(true);
      expect(isVisible(f, {}, "b")).toBe(true);
    }
  });

  const assumedTargets: [string, Record<string, unknown>][] = [
    ["selectboxes", { type: "selectboxes", key: "a", values: [{ label: "X", value: "x" }] }],
    ["select", { type: "select", key: "a" }],
    ["textfield with multiple", { type: "textfield", key: "a", multiple: true }]
  ];
  for (const [what, target] of assumedTargets) {
    it(`keeps a ${what} target assumed`, () => {
      for (const json of [{ var: "data.a" }, { "!": { var: "data.a" } }]) {
        const { output, report } = convert({ components: [target, { type: "textfield", key: "b", conditional: { json } }] });
        expect(findElement(output, "b")?.visibleIf).toBeUndefined();
        expect(entry(report.entries, FormioCodes.ASSUMED_CONDITIONAL)?.sourcePointer).toBe("/components/1/conditional/json");
        assertConstructsCleanly(output, "truthiness assumed");
      }
    });
  }
});

describe("formio convert - logic", () => {
  const gate = { type: "textfield", key: "a" };
  const whenA = (show: unknown = true) => ({ type: "simple", simple: { show, conjunction: "all", conditions: [{ component: "a", operator: "isEqual", value: "x" }] } });
  const legacyWhenA = { type: "simple", simple: { show: true, when: "a", eq: "x" } };
  const action = (value: string, state: unknown) => ({ name: "act", type: "property", property: { label: value, value, type: "boolean" }, state });
  const valueAction = { name: "v", type: "value", value: "value = 'secretValue';" };
  const withLogic = (comp: Record<string, unknown>, ...logic: unknown[]) => ({ components: [gate, { type: "textfield", key: "b", ...comp, logic }] });
  const load = (f: object, data: Record<string, unknown>) => {
    const survey = assertConstructsCleanly(convert(f).output, "logic");
    survey.data = data;
    return survey.getQuestionByName("b");
  };
  const customLogic = (f: object) => convert(f).report.entries.filter((e) => e.code === FormioCodes.CUSTOM_LOGIC).map((e) => e.sourcePointer);

  it("hides a field from a hidden: true action", () => {
    const f = withLogic({}, { name: "l", trigger: whenA(), actions: [action("hidden", true)] });
    expect(customLogic(f)).toEqual([]);
    expect(load(f, { a: "x" }).isVisible).toBe(false);
    expect(load(f, { a: "y" }).isVisible).toBe(true);
  });

  it("shows a hidden field from a hidden: false action with the legacy trigger shape", () => {
    const f = withLogic({ hidden: true }, { name: "l", trigger: legacyWhenA, actions: [action("hidden", false)] });
    expect(customLogic(f)).toEqual([]);
    expect(load(f, { a: "x" }).isVisible).toBe(true);
    expect(load(f, { a: "y" }).isVisible).toBe(false);
  });

  it("inverts a simple trigger with show: false", () => {
    const f = withLogic({}, { name: "l", trigger: whenA(false), actions: [action("hidden", true)] });
    expect(load(f, { a: "x" }).isVisible).toBe(true);
    expect(load(f, { a: "y" }).isVisible).toBe(false);
  });

  it("disables a field from a disabled action", () => {
    const f = withLogic({}, { name: "l", trigger: whenA(), actions: [action("disabled", "true")] });
    expect(customLogic(f)).toEqual([]);
    expect(load(f, { a: "x" }).isReadOnly).toBe(true);
    expect(load(f, { a: "y" }).isReadOnly).toBe(false);
  });

  it("requires a field from a validate.required action", () => {
    const f = withLogic({}, { name: "l", trigger: whenA(), actions: [action("validate.required", true)] });
    expect(customLogic(f)).toEqual([]);
    expect(load(f, { a: "x" }).isRequired).toBe(true);
    expect(load(f, { a: "y" }).isRequired).toBe(false);
  });

  it("reads a json trigger", () => {
    const f = withLogic({}, { name: "l", trigger: { type: "json", json: { "==": [{ var: "data.a" }, "x"] } }, actions: [action("hidden", true)] });
    expect(customLogic(f)).toEqual([]);
    expect(entry(convert(f).report.entries, FormioCodes.ASSUMED_CONDITIONAL)).toBeUndefined();
    expect(load(f, { a: "x" }).isVisible).toBe(false);
    expect(load(f, { a: "y" }).isVisible).toBe(true);
  });

  it("maps several property actions of one entry", () => {
    const f = withLogic({}, { name: "l", trigger: whenA(), actions: [action("disabled", true), action("validate.required", true)] });
    expect(load(f, { a: "x" })).toMatchObject({ isReadOnly: true, isRequired: true });
    expect(load(f, { a: "y" })).toMatchObject({ isReadOnly: false, isRequired: false });
  });

  it("clears a field that logic hides, and the fields of a panel that logic hides", () => {
    const { output } = convert({ components: [
      gate,
      { type: "textfield", key: "b", logic: [{ name: "l", trigger: whenA(), actions: [action("hidden", true)] }] },
      { type: "panel", key: "p", logic: [{ name: "l", trigger: whenA(), actions: [action("hidden", true)] }], components: [{ type: "textfield", key: "c" }] }
    ] });
    expect(findElement(output, "b")?.clearIfInvisible).toBe("onHiddenContainer");
    expect(findElement(output, "c")?.clearIfInvisible).toBe("onHiddenContainer");
    const survey = assertConstructsCleanly(output, "logic clearOnHide");
    survey.data = { a: "y", b: "1", c: "2" };
    survey.setValue("a", "x");
    expect(survey.data).toEqual({ a: "x" });
    survey.doComplete();
    expect(survey.data).toEqual({ a: "x" });
  });

  it("keeps the value of a hidden field that logic shows through completion, as Form.io keeps a static hidden one", () => {
    const f = withLogic({ hidden: true }, { name: "l", trigger: whenA(), actions: [action("hidden", false)] });
    const { output } = convert(f);
    expect(findElement(output, "b")?.clearIfInvisible).toBe("none");
    const survey = assertConstructsCleanly(output, "logic show keeps value");
    survey.setValue("a", "x");
    survey.setValue("b", "typed");
    survey.setValue("a", "y");
    expect(survey.getQuestionByName("b").isVisible).toBe(false);
    expect(survey.data).toEqual({ a: "y", b: "typed" });
    survey.doComplete();
    expect(survey.data).toEqual({ a: "y", b: "typed" });
  });

  it("keeps the values of the fields of a hidden panel that logic shows, through completion", () => {
    const { output } = convert({ components: [
      gate,
      { type: "panel", key: "p", hidden: true, logic: [{ name: "l", trigger: whenA(), actions: [action("hidden", false)] }], components: [{ type: "textfield", key: "c" }] }
    ] });
    expect(findElement(output, "p")?.visibleIf).toBe("({a} = 'x')");
    expect(findElement(output, "c")?.clearIfInvisible).toBe("none");
    const survey = assertConstructsCleanly(output, "logic show panel keeps value");
    survey.data = { a: "x", c: "1" };
    survey.setValue("a", "y");
    expect(survey.getQuestionByName("c").isParentVisible).toBe(false);
    survey.doComplete();
    expect(survey.data).toEqual({ a: "y", c: "1" });
  });

  it("still reports a value action, without its content", () => {
    const f = withLogic({}, { name: "l", trigger: whenA(), actions: [valueAction] });
    expect(customLogic(f)).toEqual(["/components/1/logic/0"]);
    const { output, report } = convert(f);
    expect(JSON.stringify(report)).not.toContain("secretValue");
    assertConstructsCleanly(output, "value action");
  });

  it("gives no partial output for an entry that does not translate fully", () => {
    const simple = (conditions: unknown[]) => ({ type: "simple", simple: { show: true, conjunction: "all", conditions } });
    const cases = [
      { name: "l", trigger: whenA(), actions: [action("hidden", true), valueAction] },
      { name: "l", trigger: simple([{ component: "nowhere", operator: "isEqual", value: "x" }]), actions: [action("hidden", true)] },
      { name: "l", trigger: simple([]), actions: [action("hidden", true)] },
      { name: "l", trigger: simple([{ component: "a", operator: "dateGreaterThan", value: "2024-01-01" }]), actions: [action("hidden", true)] },
      { name: "l", trigger: { type: "javascript", javascript: "result = true;" }, actions: [action("hidden", true)] },
      { name: "l", trigger: whenA(), actions: [action("label", true)] },
      { name: "l", trigger: whenA(), actions: [action("disabled", false)] },
      { name: "l", trigger: whenA(), actions: [] }
    ];
    for (const logic of cases) {
      const f = withLogic({}, logic);
      const { output } = convert(f);
      expect(customLogic(f)).toEqual(["/components/1/logic/0"]);
      const b = findElement(output, "b");
      expect(b?.visibleIf ?? b?.enableIf ?? b?.requiredIf).toBeUndefined();
      assertConstructsCleanly(output, "logic not translated");
    }
  });

  it("reports an action that changes nothing on the field as it is", () => {
    for (const [comp, act] of [[{ hidden: true }, action("hidden", true)], [{}, action("hidden", false)], [{ disabled: true }, action("disabled", true)]] as const) {
      const f = withLogic(comp, { name: "l", trigger: whenA(), actions: [act] });
      expect(customLogic(f)).toEqual(["/components/1/logic/0"]);
      assertConstructsCleanly(convert(f).output, "no-op logic");
    }
  });

  it("reports hidden logic on a field with a customConditional", () => {
    const f = withLogic({ customConditional: "show = true;" }, { name: "l", trigger: whenA(), actions: [action("hidden", true)] });
    expect(customLogic(f)).toEqual(["/components/1/logic/0"]);
    const { output } = convert(f);
    expect(findElement(output, "b")?.visibleIf).toBeUndefined();
    assertConstructsCleanly(output, "logic with customConditional");
  });

  it("reports validate.required logic on a panel", () => {
    const f = { components: [gate, { type: "panel", key: "p", logic: [{ name: "l", trigger: whenA(), actions: [action("validate.required", true)] }], components: [{ type: "textfield", key: "b" }] }] };
    expect(customLogic(f)).toEqual(["/components/1/logic/0"]);
    const { output } = convert(f);
    expect(findElement(output, "p")?.requiredIf).toBeUndefined();
    assertConstructsCleanly(output, "required logic on panel");
  });

  for (const type of ["htmlelement", "content"]) {
    it(`reports validate.required logic on ${type === "content" ? "a" : "an"} ${type}, which holds no value`, () => {
      const f = { components: [gate, { type, key: "b", html: "<p>Note</p>", logic: [{ name: "l", trigger: whenA(), actions: [action("validate.required", true)] }] }] };
      const { output } = convert(f);
      expect(customLogic(f)).toEqual(["/components/1/logic/0"]);
      expect(findElement(output, "b")?.requiredIf).toBeUndefined();
      const survey = assertConstructsCleanly(output, "required logic on html");
      survey.data = { a: "x" };
      expect(survey.getQuestionByName("b").isRequired).toBe(false);
    });
  }

  const layoutsWithButtons: [string, Record<string, unknown>][] = [
    ["columns", { type: "columns", key: "cols", columns: [{ components: [{ type: "button", key: "save" }] }] }],
    ["table", { type: "table", key: "tbl", rows: [[{ components: [{ type: "button", key: "save" }] }]] }],
    ["well", { type: "well", key: "wl", components: [{ type: "button", key: "save" }] }]
  ];
  for (const [type, layout] of layoutsWithButtons) {
    it(`reports the logic and computed values of a ${type} that gives no element`, () => {
      const f = { components: [gate, { ...layout,
        logic: [{ name: "l", trigger: whenA(), actions: [action("hidden", true)] }, { name: "v", trigger: whenA(), actions: [valueAction] }],
        calculateValue: "value = data.secretTotal;", customDefaultValue: "value = 1;"
      }] };
      const { output, report } = convert(f);
      expect(customLogic(f)).toEqual(["/components/1/logic/0", "/components/1/logic/1"]);
      expect(report.entries.filter((e) => e.code === FormioCodes.CUSTOM_VALUE).map((e) => e.sourcePointer))
        .toEqual(["/components/1/calculateValue", "/components/1/customDefaultValue"]);
      expect(report.entries.filter((e) => e.code === FormioCodes.CUSTOM_LOGIC || e.code === FormioCodes.CUSTOM_VALUE).every((e) => e.targetPath === "")).toBe(true);
      expect(JSON.stringify(report)).not.toContain("secret");
      assertConstructsCleanly(output, `${type} logic without element`);
    });
  }

  for (const [where, wizard] of [["in a form", false], ["at the top of a wizard", true]] as [string, boolean][]) {
    it(`reports the logic of a button ${where}, entry by entry`, () => {
      const button = { type: "button", key: "submit", logic: [
        { name: "l", trigger: whenA(), actions: [action("disabled", true)] },
        { name: "v", trigger: whenA(), actions: [valueAction] }
      ] };
      const f = wizard
        ? { display: "wizard", components: [{ type: "panel", key: "p", components: [gate] }, button] }
        : { components: [gate, button] };
      const { output, report } = convert(f);
      expect(customLogic(f)).toEqual(["/components/1/logic/0", "/components/1/logic/1"]);
      expect(report.entries.filter((e) => e.code === FormioCodes.CUSTOM_LOGIC).every((e) => e.targetPath === "")).toBe(true);
      expect(entry(report.entries, FormioCodes.DROPPED_VENDOR_META)?.sourcePointer).toBe("/components/1");
      assertConstructsCleanly(output, "button logic");
    });
  }

  it("maps an entry next to a value action on the same field", () => {
    const f = withLogic({},
      { name: "v", trigger: whenA(), actions: [valueAction] },
      { name: "l", trigger: whenA(), actions: [action("hidden", true)] });
    expect(customLogic(f)).toEqual(["/components/1/logic/0"]);
    expect(load(f, { a: "x" }).isVisible).toBe(false);
    expect(load(f, { a: "y" }).isVisible).toBe(true);
  });

  it("reports two entries that set the same property", () => {
    const f = withLogic({},
      { name: "l1", trigger: whenA(), actions: [action("hidden", true)] },
      { name: "l2", trigger: legacyWhenA, actions: [action("hidden", true)] });
    expect(customLogic(f)).toEqual(["/components/1/logic/0", "/components/1/logic/1"]);
    const { output } = convert(f);
    expect(findElement(output, "b")?.visibleIf).toBeUndefined();
    assertConstructsCleanly(output, "logic same property");
  });

  for (const type of ["customAction", "mergeComponentSchema"]) {
    it(`reports a hidden entry next to a ${type} action, which may change anything, and emits nothing`, () => {
      const f = withLogic({},
        { name: "c", trigger: whenA(), actions: [{ name: "c", type, customAction: "component.hidden = false;", schemaDefinition: "schema = { hidden: false };" }] },
        { name: "l", trigger: whenA(), actions: [action("hidden", true)] });
      const { output, report } = convert(f);
      expect(customLogic(f)).toEqual(["/components/1/logic/0", "/components/1/logic/1"]);
      expect(entry(report.entries, FormioCodes.ASSUMED_CONDITIONAL)).toBeUndefined();
      const b = findElement(output, "b");
      expect(b?.visibleIf ?? b?.enableIf ?? b?.requiredIf ?? b?.clearIfInvisible).toBeUndefined();
      expect(JSON.stringify(report)).not.toContain("component.hidden");
      expect(load(f, { a: "x" }).isVisible).toBe(true);
      expect(load(f, { a: "y" }).isVisible).toBe(true);
    });
  }

  it("reports hidden logic together with a conditional as assumed and emits neither", () => {
    const f = withLogic({ conditional: { show: true, when: "a", eq: "z" } }, { name: "l", trigger: whenA(), actions: [action("hidden", true)] });
    const { output, report } = convert(f);
    expect(findElement(output, "b")?.visibleIf).toBeUndefined();
    expect(customLogic(f)).toEqual([]);
    const assumed = report.entries.filter((e) => e.code === FormioCodes.ASSUMED_CONDITIONAL).map((e) => e.sourcePointer);
    expect(assumed).toEqual(["/components/1/conditional", "/components/1/logic/0"]);
    expect(load(f, { a: "x" }).isVisible).toBe(true);
    expect(load(f, { a: "z" }).isVisible).toBe(true);
  });

  it("reports hidden logic together with a partly assumed conditional as assumed and emits neither", () => {
    const conditional = { show: true, conjunction: "all", conditions: [
      { component: "a", operator: "isEqual", value: "z" },
      { component: "nowhere", operator: "isEqual", value: "z" }
    ] };
    const f = withLogic({ conditional }, { name: "l", trigger: whenA(), actions: [action("hidden", true)] });
    const { output, report } = convert(f);
    expect(findElement(output, "b")?.visibleIf).toBeUndefined();
    expect(findElement(output, "b")?.clearIfInvisible).toBeUndefined();
    expect(customLogic(f)).toEqual([]);
    const assumed = report.entries.filter((e) => e.code === FormioCodes.ASSUMED_CONDITIONAL).map((e) => e.sourcePointer);
    expect(assumed).toEqual(["/components/1/conditional/conditions/1", "/components/1/logic/0"]);
    expect(load(f, { a: "x" }).isVisible).toBe(true);
    expect(load(f, { a: "z" }).isVisible).toBe(true);
  });

  it("keeps a conditional next to disabled logic", () => {
    const f = withLogic({ conditional: { show: true, when: "a", eq: "z" } }, { name: "l", trigger: whenA(), actions: [action("disabled", true)] });
    expect(customLogic(f)).toEqual([]);
    expect(entry(convert(f).report.entries, FormioCodes.ASSUMED_CONDITIONAL)).toBeUndefined();
    expect(load(f, { a: "z" })).toMatchObject({ isVisible: true, isReadOnly: false });
    expect(load(f, { a: "y" })).toMatchObject({ isVisible: false, isReadOnly: false });
    expect(load(f, { a: "x" })).toMatchObject({ isVisible: false, isReadOnly: true });
  });

  it("refuses validate.required: false, which only turns off a requirement the field has", () => {
    for (const required of [false, true]) {
      const f = withLogic(required ? { validate: { required: true } } : {}, { name: "l", trigger: whenA(), actions: [action("validate.required", false)] });
      const { output } = convert(f);
      expect(customLogic(f)).toEqual(["/components/1/logic/0"]);
      expect(findElement(output, "b")?.requiredIf).toBeUndefined();
      expect(load(f, { a: "x" }).isRequired).toBe(required);
      expect(load(f, { a: "y" }).isRequired).toBe(required);
    }
  });

  it("refuses validate.required logic on a wizard page", () => {
    const f = { display: "wizard", components: [
      { type: "panel", key: "one", components: [gate] },
      { type: "panel", key: "two", logic: [{ name: "l", trigger: whenA(), actions: [action("validate.required", true)] }], components: [{ type: "textfield", key: "b" }] }
    ] };
    const { output } = convert(f);
    expect(customLogic(f)).toEqual(["/components/1/logic/0"]);
    expect(JSON.stringify(output)).not.toContain("requiredIf");
    const survey = assertConstructsCleanly(output, "required logic on page");
    survey.data = { a: "x" };
    expect(survey.getQuestionByName("b").isRequired).toBe(false);
  });

  it("maps a conditional next to hidden: false logic that changes nothing, and reports the logic", () => {
    const f = withLogic({ conditional: { show: true, when: "a", eq: "z" } }, { name: "l", trigger: whenA(), actions: [action("hidden", false)] });
    const { output, report } = convert(f);
    expect(customLogic(f)).toEqual(["/components/1/logic/0"]);
    expect(entry(report.entries, FormioCodes.ASSUMED_CONDITIONAL)).toBeUndefined();
    expect(findElement(output, "b")?.visibleIf).toBe("{a} = 'z'");
    expect(load(f, { a: "z" }).isVisible).toBe(true);
    expect(load(f, { a: "x" }).isVisible).toBe(false);
  });

  it("hides a panel from logic", () => {
    const f = { components: [gate, { type: "panel", key: "p", logic: [{ name: "l", trigger: whenA(), actions: [action("hidden", true)] }], components: [{ type: "textfield", key: "b" }] }] };
    expect(load(f, { a: "x" }).isParentVisible).toBe(false);
    expect(load(f, { a: "y" }).isParentVisible).toBe(true);
  });

  it("keeps the logic of a radio-type checkbox reported, since it would change one option", () => {
    const f = { components: [gate,
      { type: "checkbox", inputType: "radio", name: "r", key: "r1", value: "1", logic: [{ name: "l", trigger: whenA(), actions: [action("hidden", true)] }] },
      { type: "checkbox", inputType: "radio", name: "r", key: "r2", value: "2" }
    ] };
    const { output } = convert(f);
    expect(customLogic(f)).toEqual(["/components/1/logic/0"]);
    expect(findElement(output, "r")?.visibleIf).toBeUndefined();
    assertConstructsCleanly(output, "radio-type checkbox logic");
  });
});

describe("formio convert - options", () => {
  // Convert one component keyed `q`, load it, and return its element, report and question.
  function convertOne(comp: Record<string, unknown>, data?: Record<string, unknown>) {
    const { output, report } = convert({ components: [{ key: "q", ...comp }] });
    const survey = assertConstructsCleanly(output, "options");
    if (data) survey.data = data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const question = survey.getQuestionByName("q") as any;
    return { output, report, survey, question, el: findElement(output, "q") as SurveyJSONElement };
  }
  const codesAt = (report: { entries: ReportEntry[] }, code: string) =>
    report.entries.filter((e) => e.code === code).map((e) => e.sourcePointer);

  describe("datetime", () => {
    it("becomes a date input without time, with a date default", () => {
      const { el, question } = convertOne({ type: "datetime", enableTime: false, defaultValue: "2025-07-04T10:30:00" });
      expect(el.inputType).toBe("date");
      expect(question.value).toBe("2025-07-04");
    });

    it("becomes a time input without date, with a time default", () => {
      const { el, question } = convertOne({ type: "datetime", enableDate: false, defaultValue: "2025-07-04T10:30:00" });
      expect(el.inputType).toBe("time");
      expect(question.value).toBe("10:30");
    });

    it("keeps a date and time input by default", () => {
      expect(convertOne({ type: "datetime", enableTime: true, enableDate: true }).el.inputType).toBe("datetime-local");
    });

    it("takes min and max from a date literal in datePicker, or in widget", () => {
      const { el, question, report } = convertOne({
        type: "datetime", enableTime: false,
        datePicker: { minDate: "2025-07-01T12:00:00", maxDate: null },
        widget: { minDate: "2025-07-01T12:00:00", maxDate: "2025-07-31T12:00:00" }
      });
      expect(el).toMatchObject({ min: "2025-07-01", max: "2025-07-31" });
      expect(report.entries).toEqual([]);
      question.value = "2025-06-30";
      expect(question.hasErrors()).toBe(true);
      question.value = "2025-07-15";
      expect(question.hasErrors()).toBe(false);
    });

    it("keeps the time in min for a date and time input", () => {
      expect(convertOne({ type: "datetime", datePicker: { minDate: "2025-07-01T12:00:00" } }).el.min).toBe("2025-07-01T12:00");
    });

    it("reports a minDate that is an expression", () => {
      const { el, report } = convertOne({ type: "datetime", datePicker: { minDate: "moment().startOf('month')", maxDate: "" } });
      expect(el.min).toBeUndefined();
      expect(codesAt(report, FormioCodes.UNSUPPORTED_OPTION)).toEqual(["/components/0/datePicker/minDate"]);
      expect(JSON.stringify(report)).not.toContain("moment");
    });
  });

  describe("number", () => {
    it("masks a number with decimalLimit and requireDecimal", () => {
      const { el, question } = convertOne({ type: "number", decimalLimit: 3, requireDecimal: true });
      expect(el.inputType).toBeUndefined();
      expect(el).toMatchObject({ maskType: "numeric", maskSettings: { precision: 3, showTrailingZeros: true, thousandsSeparator: "" } });
      expect(question.maskInstance.getMaskedValue(1234.5)).toBe("1234.500");
    });

    it("takes two decimals for requireDecimal alone, and a separator with delimiter", () => {
      const { el, question } = convertOne({ type: "number", requireDecimal: true, delimiter: true });
      expect(el.maskSettings).toEqual({ precision: 2, showTrailingZeros: true });
      expect(question.maskInstance.getMaskedValue(1234.5)).toBe("1,234.50");
    });

    it("cuts the decimals at decimalLimit, without trailing zeros", () => {
      const { question } = convertOne({ type: "number", decimalLimit: 2 }, { q: 1.5 });
      expect(question.maskInstance.getMaskedValue(1.257)).toBe("1.25");
      expect(question.value).toBe(1.5);
    });

    it("keeps a number input without the options", () => {
      expect(convertOne({ type: "number", requireDecimal: false }).el).toEqual({ type: "text", name: "q", inputType: "number" });
    });
  });

  it("maps selectboxes minSelectedCount and maxSelectedCount", () => {
    const values = ["a", "b", "c"].map((v) => ({ label: v, value: v }));
    const { el, question } = convertOne({ type: "selectboxes", values, validate: { minSelectedCount: 2, maxSelectedCount: 2 } }, { q: ["a"] });
    expect(el).toMatchObject({ minSelectedChoices: 2, maxSelectedChoices: 2 });
    expect(question.hasErrors()).toBe(true);
    question.value = ["a", "b"];
    expect(question.hasErrors()).toBe(false);
  });

  it("uses validate.customMessage for the required error and each validator", () => {
    const { el, question } = convertOne({ type: "textfield", validate: { required: true, minLength: 3, customMessage: "Three or more" } });
    expect(el.requiredErrorText).toBe("Three or more");
    expect((el.validators as Record<string, unknown>[])[0].text).toBe("Three or more");
    expect(question.hasErrors()).toBe(true);
    expect(question.errors[0].text).toBe("Three or more");
    question.value = "ab";
    expect(question.hasErrors()).toBe(true);
    expect(question.errors[0].text).toBe("Three or more");
  });

  it("uses validate.customMessage for the required error only when the field can be required", () => {
    const { el, question, report } = convertOne({ type: "textfield", validate: { minLength: 3, customMessage: "Three or more" } });
    expect(el.requiredErrorText).toBeUndefined();
    expect((el.validators as Record<string, unknown>[])[0].text).toBe("Three or more");
    expect(report.entries).toEqual([]);
    question.value = "ab";
    expect(question.hasErrors()).toBe(true);
    expect(question.errors[0].text).toBe("Three or more");
  });

  it("uses validate.customMessage for the required error of a field required by logic", () => {
    const requiredWhenA = {
      name: "l", trigger: { type: "simple", simple: { show: true, when: "a", eq: "x" } },
      actions: [{ name: "act", type: "property", property: { label: "r", value: "validate.required", type: "boolean" }, state: true }]
    };
    const form = { components: [{ type: "textfield", key: "a" }, { type: "textfield", key: "q", validate: { customMessage: "Needed" }, logic: [requiredWhenA] }] };
    const { output } = convert(form);
    expect(findElement(output, "q")).toMatchObject({ requiredIf: "{a} = 'x'", requiredErrorText: "Needed" });
    const survey = assertConstructsCleanly(output, "required by logic");
    survey.data = { a: "x" };
    const question = survey.getQuestionByName("q");
    expect(question.hasErrors()).toBe(true);
    expect(question.errors[0].text).toBe("Needed");
  });

  describe("inputMask", () => {
    it("masks a textfield with a pattern and keeps the literals in the value", () => {
      const { el, question } = convertOne({ type: "textfield", inputMask: "999-AAA*" });
      expect(el).toMatchObject({ maskType: "pattern", maskSettings: { pattern: "999-aaa#", saveMaskedValue: true } });
      expect(question.maskInstance.getMaskedValue("123abc4")).toBe("123-abc4");
      question.inputValue = "123-abc4";
      expect(question.value).toBe("123-abc4");
    });

    it("escapes a literal # in a phoneNumber mask", () => {
      const { el, question } = convertOne({ type: "phoneNumber", inputMask: "#9-9" });
      expect((el.maskSettings as Record<string, unknown>).pattern).toBe("\\#9-9");
      expect(question.maskInstance.getMaskedValue("12")).toBe("#1-2");
      question.inputValue = "#1-2";
      expect(question.value).toBe("#1-2");
    });

    it("gives a phoneNumber Form.io's default mask, and none for an empty mask", () => {
      const { el, question } = convertOne({ type: "phoneNumber" });
      expect(el).toMatchObject({ inputType: "tel", maskType: "pattern", maskSettings: { pattern: "(999) 999-9999", saveMaskedValue: true } });
      expect(question.maskInstance.getMaskedValue("1234567890")).toBe("(123) 456-7890");
      question.inputValue = "(123) 456-7890";
      expect(question.value).toBe("(123) 456-7890");
      expect(convertOne({ type: "phoneNumber", inputMask: "" }).el.maskType).toBeUndefined();
    });

    const refused: [string, Record<string, unknown>, string][] = [
      ["a lowercase letter token", { type: "phoneNumber", inputMask: "aa-99" }, "inputMask"],
      ["a literal backslash", { type: "phoneNumber", inputMask: "99\\99" }, "inputMask"],
      ["a hex digit token in a textfield", { type: "textfield", inputMask: "#99" }, "inputMask"],
      ["a group in a textfield", { type: "textfield", inputMask: "+9(99)-999" }, "inputMask"],
      ["an uppercase alphanumeric token in a textfield", { type: "textfield", inputMask: "&&" }, "inputMask"],
      ["several masks", { type: "textfield", inputMask: "999", allowMultipleMasks: true }, "allowMultipleMasks"]
    ];
    for (const [what, comp, key] of refused) {
      it(`reports a mask with ${what} and writes none`, () => {
        const { el, report } = convertOne(comp);
        expect(el.maskType).toBeUndefined();
        expect(codesAt(report, FormioCodes.UNSUPPORTED_OPTION)).toEqual([`/components/0/${key}`]);
      });
    }
  });

  describe("dataType", () => {
    const values = [{ label: "One", value: "1" }, { label: "Two", value: "2" }];
    const choiceField = (type: string, dataType: string, vals = values, extra: Record<string, unknown> = {}) =>
      type === "select" ? { type, key: "q", dataType, data: { values: vals }, ...extra } : { type, key: "q", dataType, values: vals, ...extra };
    const choiceValues = (el: SurveyJSONElement | undefined) => (el?.choices as { value: unknown }[]).map((c) => c.value);

    for (const type of ["radio", "select"]) {
      it(`stores numbers in a ${type} with dataType number, and its conditions compare numbers`, () => {
        const form = { components: [
          choiceField(type, "number", values, { defaultValue: "2" }),
          { type: "textfield", key: "legacy", conditional: { show: true, when: "q", eq: "1" } },
          { type: "textfield", key: "simple", conditional: simpleConditional(true, [{ component: "q", operator: "isEqual", value: "1" }]) },
          { type: "textfield", key: "json", conditional: { json: { "==": [{ var: "data.q" }, "1"] } } }
        ] };
        const { output, report } = convert(form);
        expect(report.entries).toEqual([]);
        expect(choiceValues(findElement(output, "q"))).toEqual([1, 2]);
        expect(findElement(output, "legacy")?.visibleIf).toBe("{q} = 1");
        const survey = assertConstructsCleanly(output, "dataType");
        expect(survey.getQuestionByName("q").value).toBe(2);
        for (const name of ["legacy", "simple", "json"]) expect(survey.getQuestionByName(name).isVisible).toBe(false);
        survey.getQuestionByName("q").value = 1;
        for (const name of ["legacy", "simple", "json"]) expect(survey.getQuestionByName(name).isVisible).toBe(true);
      });

      it(`stores booleans in a ${type} with dataType boolean, and its conditions compare booleans`, () => {
        const yesNo = [{ label: "Yes", value: "true" }, { label: "No", value: "false" }];
        const form = { components: [
          choiceField(type, "boolean", yesNo),
          { type: "textfield", key: "t", conditional: { show: true, when: "q", eq: "false" } }
        ] };
        const { output } = convert(form);
        expect(choiceValues(findElement(output, "q"))).toEqual([true, false]);
        expect(findElement(output, "t")?.visibleIf).toBe("{q} = false");
        expect(isVisible(form, { q: false }, "t")).toBe(true);
        expect(isVisible(form, { q: true }, "t")).toBe(false);
      });
    }

    it("coerces each value of a multiple select", () => {
      const { el, question } = convertOne({ type: "select", multiple: true, dataType: "number", data: { values }, defaultValue: ["1", "2"] });
      expect(choiceValues(el)).toEqual([1, 2]);
      expect([...question.value]).toEqual([1, 2]);
    });

    it("reports values a radio cannot store in the type, and keeps them as written", () => {
      const { el, report } = convertOne(choiceField("radio", "number", [{ label: "A", value: "a" }, { label: "B", value: "b" }]));
      expect(choiceValues(el)).toEqual(["a", "b"]);
      expect(codesAt(report, FormioCodes.UNSUPPORTED_OPTION)).toEqual(["/components/0/dataType"]);
    });

    it("reports a dataType on choices from a URL", () => {
      const { report } = convertOne({ type: "select", dataType: "number", dataSrc: "url", data: { url: "https://example.com/items" } });
      expect(codesAt(report, FormioCodes.UNSUPPORTED_OPTION)).toEqual(["/components/0/dataType"]);
    });

    it("reports dataType string on choices from a URL, which Form.io casts to text", () => {
      const { report } = convertOne({ type: "select", dataType: "string", dataSrc: "url", valueProperty: "id", data: { url: "https://example.com/items" } });
      expect(codesAt(report, FormioCodes.UNSUPPORTED_OPTION)).toEqual(["/components/0/dataType"]);
      expect(codesAt(report, FormioCodes.ASSUMED_DATA_SOURCE_VALUE)).toEqual([]);
    });

    for (const dataType of [undefined, "", "auto"]) {
      it(`reports that a select from a URL with dataType ${JSON.stringify(dataType)} keeps the response value, which Form.io casts`, () => {
        const { report, el } = convertOne({ type: "select", dataType, dataSrc: "url", valueProperty: "id", data: { url: "https://example.com/items" } });
        expect(el.choicesByUrl).toBeDefined();
        expect(codesAt(report, FormioCodes.ASSUMED_DATA_SOURCE_VALUE)).toEqual(["/components/0/dataSrc"]);
        expect(report.entries.find((e) => e.code === FormioCodes.ASSUMED_DATA_SOURCE_VALUE)?.bucket).toBe("assumed");
        expect(codesAt(report, FormioCodes.UNSUPPORTED_OPTION)).toEqual([]);
      });
    }

    it("does not report the response value of a select from a URL whose dataType keeps it", () => {
      const { report } = convertOne({ type: "select", dataType: "object", dataSrc: "url", valueProperty: "id", data: { url: "https://example.com/items" } });
      expect(codesAt(report, FormioCodes.ASSUMED_DATA_SOURCE_VALUE)).toEqual([]);
      expect(codesAt(report, FormioCodes.UNSUPPORTED_OPTION)).toEqual([]);
    });

    it("reports the response value of a select from a URL that interpolates a field", () => {
      const { output, report } = convert({ components: [
        { type: "textfield", key: "country" },
        { type: "select", key: "q", dataSrc: "url", valueProperty: "id", data: { url: "https://example.com/items?c={{ data.country }}" } }
      ] });
      expect((findElement(output, "q")?.choicesByUrl as Record<string, unknown>).url).toBe("https://example.com/items?c={country}");
      expect(codesAt(report, FormioCodes.ASSUMED_DATA_SOURCE_VALUE)).toEqual(["/components/1/dataSrc"]);
    });

    it("does not report the response value of a URL source it refuses", () => {
      const { report } = convertOne({ type: "select", dataSrc: "url", authenticate: true, data: { url: "https://example.com/items" } });
      expect(codesAt(report, FormioCodes.UNSUPPORTED_DATA_SOURCE)).toEqual(["/components/0/dataSrc"]);
      expect(codesAt(report, FormioCodes.ASSUMED_DATA_SOURCE_VALUE)).toEqual([]);
    });

    const auto = [{ label: "Two", value: "2" }, { label: "Yes", value: "true" }, { label: "Odd", value: "1.5x" }];
    for (const type of ["radio", "select"]) {
      for (const dataType of [undefined, "auto"]) {
        it(`stores numbers and booleans in a ${type} with dataType ${String(dataType)}, as Form.io does, and its conditions follow`, () => {
          const field = type === "select" ? { type, key: "q", dataType, data: { values: auto }, defaultValue: "2" } : { type, key: "q", dataType, values: auto, defaultValue: "2" };
          const form = { components: [
            field,
            { type: "textfield", key: "legacy", conditional: { show: true, when: "q", eq: "true" } },
            { type: "textfield", key: "simple", conditional: simpleConditional(true, [{ component: "q", operator: "isEqual", value: "2" }]) },
            { type: "textfield", key: "json", conditional: { json: { "==": [{ var: "data.q" }, "2"] } } }
          ] };
          const { output, report } = convert(form);
          expect(report.entries).toEqual([]);
          expect(choiceValues(findElement(output, "q"))).toEqual([2, true, "1.5x"]);
          expect(findElement(output, "legacy")?.visibleIf).toBe("{q} = true");
          expect(findElement(output, "simple")?.visibleIf).toBe("({q} = 2)");
          expect(findElement(output, "json")?.visibleIf).toBe("{q} = 2");
          const survey = assertConstructsCleanly(output, "auto dataType");
          const visible = () => ["legacy", "simple", "json"].map((name) => survey.getQuestionByName(name).isVisible);
          expect(survey.getQuestionByName("q").value).toBe(2);
          expect(visible()).toEqual([false, true, true]);
          survey.getQuestionByName("q").value = true;
          expect(visible()).toEqual([true, false, false]);
          survey.doComplete();
          expect(survey.data).toEqual({ q: true });
        });
      }
    }

    it("reads \"TRUE\" as a boolean in a select with no dataType, and not in a radio", () => {
      const vals = [{ label: "Yes", value: "TRUE" }, { label: "No", value: "no" }];
      expect(choiceValues(convertOne({ type: "select", data: { values: vals } }).el)).toEqual([true, "no"]);
      expect(choiceValues(convertOne({ type: "radio", values: vals }).el)).toEqual(["TRUE", "no"]);
    });

    // survey-core reads "01" and 1 as one value, and true and 1 too (`true == 1`).
    for (const written of [["01", "1"], ["1", "true"]]) {
      it(`reports values ${JSON.stringify(written)} whose cast would make survey-core read two choices as one, and keeps them as written`, () => {
        const { el, report } = convertOne({ type: "radio", values: written.map((value) => ({ label: value, value })) });
        expect(choiceValues(el)).toEqual(written);
        expect(codesAt(report, FormioCodes.UNSUPPORTED_OPTION)).toEqual(["/components/0/values/1/value"]);
      });
    }

    it("reports the value of a select, past an item with no value, when no dataType is set", () => {
      const { el, report } = convertOne({ type: "select", data: { values: [{ label: "none", value: "" }, { label: "A", value: "01" }, { label: "B", value: "1" }] } });
      expect(choiceValues(el)).toEqual(["01", "1"]);
      expect(codesAt(report, FormioCodes.UNSUPPORTED_OPTION)).toEqual(["/components/0/data/values/2/value"]);
    });

    it("reports the dataType when one is set and the values merge", () => {
      const { report } = convertOne({ type: "radio", dataType: "auto", values: [{ label: "A", value: "01" }, { label: "B", value: "1" }] });
      expect(codesAt(report, FormioCodes.UNSUPPORTED_OPTION)).toEqual(["/components/0/dataType"]);
    });

    it("compares a value that Form.io keeps as written as written", () => {
      const form = { components: [
        choiceField("select", "number", [{ label: "A", value: "1.0" }, { label: "B", value: "2" }]),
        { type: "textfield", key: "b", conditional: simpleConditional(true, [{ component: "q", operator: "isEqual", value: "1.0" }]) }
      ] };
      const { output, report } = convert(form);
      expect(report.entries).toEqual([]);
      expect(choiceValues(findElement(output, "q"))).toEqual(["1.0", 2]);
      expect(findElement(output, "b")?.visibleIf).toBe("({q} = '1.0')");
      expect(isVisible(form, { q: "1.0" }, "b")).toBe(true);
      expect(isVisible(form, { q: 2 }, "b")).toBe(false);
    });

    // survey-core reads "1.0" and 1 as equal, and "1.0" as a number in an order; Form.io does neither.
    // [what, component, condition on q]
    const refusedLiterals: [string, Record<string, unknown>, unknown][] = [
      ["a number against a value kept as written", choiceField("select", "number", [{ label: "A", value: "1.0" }, { label: "B", value: "2" }]),
        simpleConditional(true, [{ component: "q", operator: "isEqual", value: 1 }])],
      ["an order on a value kept as written", choiceField("select", "number", [{ label: "A", value: "1.0" }, { label: "B", value: "2" }]),
        simpleConditional(true, [{ component: "q", operator: "lessThan", value: 5 }])],
      ["text that a cast number never reads as", choiceField("radio", "number", [{ label: "A", value: "1.0" }, { label: "B", value: "2" }]),
        { show: true, when: "q", eq: "1.0" }]
    ];
    for (const [what, comp, conditional] of refusedLiterals) {
      it(`gives no condition for ${what}, and reports it assumed`, () => {
        const form = { components: [comp, { type: "textfield", key: "b", conditional }] };
        const { output, report } = convert(form);
        expect(findElement(output, "b")?.visibleIf).toBeUndefined();
        expect(report.entries.filter((e) => e.code === FormioCodes.ASSUMED_CONDITIONAL)).toHaveLength(1);
        expect(isVisible(form, {}, "b")).toBe(true);
      });
    }

    // Each choice, and no value, against Form.io's result. survey-core reads a question's text as a
    // number or a boolean before it compares ("01" stays text, "1" is 1, "TRUE" is true, "10,000" is
    // 10), so a literal is kept only when its `=` holds for exactly the choices Form.io's does.
    // [what, component, condition on q, Form.io's result for each choice then for no value, or
    // undefined when the condition is refused]
    const jsonChoices = (dataType: string | undefined, json: unknown[]) =>
      ({ type: "select", key: "q", dataType, dataSrc: "json", valueProperty: "value", data: { json } });
    const perChoice: [string, Record<string, unknown>, unknown, boolean[] | undefined][] = [
      ["a text that reads as true, against 1 in JSON logic", choiceField("radio", "", [{ label: "A", value: "TRUE" }, { label: "B", value: "no" }]),
        { json: { "==": [{ var: "data.q" }, 1] } }, undefined],
      ["values kept as written, strictly unequal to one of them", choiceField("radio", "", [{ label: "A", value: "01" }, { label: "B", value: "1" }]),
        { json: { "!==": [{ var: "data.q" }, "01"] } }, undefined],
      ["values kept as written, equal to the one Form.io casts", choiceField("radio", "", [{ label: "A", value: "01" }, { label: "B", value: "1" }]),
        { show: true, when: "q", eq: "1" }, [false, true, false]],
      ["a text with a comma, in the legacy format", choiceField("radio", "", [{ label: "A", value: "10,000" }, { label: "B", value: "20,000" }]),
        { show: true, when: "q", eq: "10,000" }, undefined],
      ["a text with a comma, in the simple format", choiceField("radio", "", [{ label: "A", value: "10,000" }, { label: "B", value: "20,000" }]),
        simpleConditional(true, [{ component: "q", operator: "isEqual", value: "10,000" }]), undefined],
      ["plain texts", choiceField("radio", "", [{ label: "A", value: "yes" }, { label: "B", value: "no" }]),
        { show: false, when: "q", eq: "yes" }, [false, true, true]],
      ["numbers from JSON items, strictly equal to a text", jsonChoices("number", [{ value: 1 }, { value: "2" }]),
        { json: { "===": [{ var: "data.q" }, "2"] } }, undefined],
      ["numbers from JSON items with no dataType, strictly equal to a text", jsonChoices(undefined, [{ value: 1 }, { value: "2" }]),
        { json: { "===": [{ var: "data.q" }, "2"] } }, undefined],
      ["booleans from JSON items, loosely equal to \"true\"", jsonChoices("boolean", [{ value: 1 }, { value: "true" }]),
        { json: { "==": [{ var: "data.q" }, "true"] } }, undefined],
      ["numbers from JSON items, strictly equal to a number", jsonChoices("number", [{ value: 1 }, { value: "2" }]),
        { json: { "===": [{ var: "data.q" }, 2] } }, [false, true, false]]
    ];
    for (const [what, comp, conditional, expected] of perChoice) {
      it(`compares ${what} as Form.io does, for each choice and for no value`, () => {
        const form = { components: [comp, { type: "textfield", key: "b", conditional }] };
        const { output, report } = convert(form);
        const conditions = report.entries.filter((e) => e.code === FormioCodes.ASSUMED_CONDITIONAL);
        if (expected === undefined) {
          expect(findElement(output, "b")?.visibleIf).toBeUndefined();
          expect(conditions).toHaveLength(1);
          return;
        }
        expect(conditions).toEqual([]);
        const values = choiceValues(findElement(output, "q"));
        const survey = assertConstructsCleanly(output, "choice literals");
        [...values, undefined].forEach((value, i) => {
          survey.clear();
          if (value !== undefined) survey.setValue("q", value);
          expect(survey.getQuestionByName("b").isVisible, `value ${JSON.stringify(value)}`).toBe(expected[i]);
        });
      });
    }
  });

  describe("file", () => {
    it("maps multiple, fileMaxSize and filePattern", () => {
      const { el, question, report } = convertOne({ type: "file", storage: "base64", multiple: true, fileMaxSize: "1.5MB", filePattern: "*.pdf, image/*" });
      expect(el).toMatchObject({ allowMultiple: true, maxSize: 1572864, acceptedTypes: ".pdf,image/*" });
      expect(report.entries).toEqual([]);
      expect(question.allowMultiple).toBe(true);
      expect(question.maxSize).toBe(1572864);
      expect(question.acceptedTypes).toBe(".pdf,image/*");
    });

    it("keeps Form.io's defaults out", () => {
      const { el } = convertOne({ type: "file", multiple: false, fileMaxSize: "1GB", filePattern: "*" });
      expect(el).toEqual({ type: "file", name: "q" });
    });

    it("reports a size that does not parse", () => {
      const { el, report } = convertOne({ type: "file", fileMaxSize: "{{config.max}}" });
      expect(el.maxSize).toBeUndefined();
      expect(codesAt(report, FormioCodes.UNSUPPORTED_OPTION)).toEqual(["/components/0/fileMaxSize"]);
    });
  });

  describe("signature", () => {
    it("maps the pad's size and pen", () => {
      const { el, question } = convertOne({ type: "signature", width: "400px", height: 120, penColor: "blue", backgroundColor: "white", minWidth: "1", maxWidth: "3" });
      expect(el).toMatchObject({ signatureWidth: 400, signatureHeight: 120, penColor: "blue", backgroundColor: "white", penMinWidth: 1, penMaxWidth: 3 });
      expect(question.signatureWidth).toBe(400);
      expect(question.penMaxWidth).toBe(3);
    });

    it("keeps Form.io's defaults out", () => {
      const { el, report } = convertOne({ type: "signature", width: "100%", height: "150px", penColor: "black", backgroundColor: "rgb(245,245,235)", minWidth: "0.5", maxWidth: "2.5" });
      expect(el).toEqual({ type: "signaturepad", name: "q" });
      expect(report.entries).toEqual([]);
    });

    it("reports a size that is not in pixels as styling", () => {
      const { el, report } = convertOne({ type: "signature", width: "50%" });
      expect(el.signatureWidth).toBeUndefined();
      expect(codesAt(report, FormioCodes.DROPPED_STYLING)).toEqual(["/components/0/width"]);
    });
  });

  describe("data grids", () => {
    const grid = (type: string, extra: Record<string, unknown>) =>
      convertOne({ type, components: [{ type: "textfield", key: "t" }], ...extra });

    it("starts a datagrid with one row, or with minLength rows", () => {
      expect(grid("datagrid", {}).question.panelCount).toBe(1);
      const { el, question } = grid("datagrid", { validate: { minLength: 3, maxLength: 5 } });
      expect(el).toMatchObject({ panelCount: 3, minPanelCount: 3, maxPanelCount: 5 });
      expect(question.panelCount).toBe(3);
      question.addPanel();
      question.addPanel();
      expect(question.panelCount).toBe(5);
      expect(question.canAddPanel).toBe(false);
    });

    it("starts a datagrid with initEmpty, and an editgrid, with no row", () => {
      expect(grid("datagrid", { initEmpty: true }).el.panelCount).toBeUndefined();
      expect(grid("datagrid", { noFirstRow: true }).question.panelCount).toBe(0);
      expect(grid("editgrid", {}).question.panelCount).toBe(0);
      const { el, question } = grid("editgrid", { validate: { minLength: 2 } });
      expect(el.minPanelCount).toBe(2);
      expect(el.panelCount).toBeUndefined();
      expect(question.panelCount).toBe(2);
    });

    it("reports initEmpty together with minLength, which opens minLength rows in SurveyJS", () => {
      const { report, question } = grid("datagrid", { initEmpty: true, validate: { minLength: 2 } });
      expect(codesAt(report, FormioCodes.UNSUPPORTED_OPTION)).toEqual(["/components/0/initEmpty"]);
      expect(question.panelCount).toBe(2);
      expect(codesAt(grid("datagrid", { initEmpty: true }).report, FormioCodes.UNSUPPORTED_OPTION)).toEqual([]);
    });

    it("uses a required grid's customMessage for its required error", () => {
      const { el, question, report } = grid("editgrid", { validate: { required: true, customMessage: "Add a row" } });
      expect(el.requiredErrorText).toBe("Add a row");
      expect(report.entries.filter((e) => e.code === FormioCodes.UNSUPPORTED_OPTION)).toEqual([]);
      expect(question.hasErrors()).toBe(true);
      expect(question.errors[0].text).toBe("Add a row");
    });

    it("reports the customMessage of a grid that is not required", () => {
      const { el, report } = grid("datagrid", { validate: { minLength: 2, customMessage: "Two rows" } });
      expect(el.requiredErrorText).toBeUndefined();
      expect(codesAt(report, FormioCodes.UNSUPPORTED_OPTION)).toEqual(["/components/0/validate/customMessage"]);
      expect(JSON.stringify(report)).not.toContain("Two rows");
    });

    it("takes the add button's text from addAnother", () => {
      const { el, question } = grid("editgrid", { addAnother: "Add a fund" });
      expect(el.addPanelText).toBe("Add a fund");
      expect(question.addPanelText).toBe("Add a fund");
    });

    it("disables adding and removing rows", () => {
      const { el, question } = grid("datagrid", { disableAddingRemovingRows: true });
      expect(el).toMatchObject({ allowAddPanel: false, allowRemovePanel: false });
      expect(question.canAddPanel).toBe(false);
      expect(question.canRemovePanel).toBe(false);
    });
  });

  it("lays out inline radio and selectboxes options in one row", () => {
    const values = [{ label: "A", value: "a" }];
    for (const type of ["radio", "selectboxes"]) {
      const { el, question } = convertOne({ type, values, inline: true });
      expect(el.colCount).toBe(0);
      expect(question.colCount).toBe(0);
      expect(convertOne({ type, values, inline: false }).el.colCount).toBeUndefined();
    }
  });

  it("takes a textarea's rows", () => {
    expect(convertOne({ type: "textarea", rows: 5 }).question.rows).toBe(5);
    expect(convertOne({ type: "textarea", rows: 3 }).el.rows).toBeUndefined();
  });

  const unsupported: [string, Record<string, unknown>, string][] = [
    ["minWords", { type: "textarea", validate: { minWords: 3 } }, "validate/minWords"],
    ["maxWords", { type: "textfield", validate: { maxWords: 5 } }, "validate/maxWords"],
    ["unique", { type: "select", unique: true }, "unique"],
    ["kickbox", { type: "email", kickbox: { enabled: true } }, "kickbox"],
    ["persistent false", { type: "textfield", persistent: false }, "persistent"],
    ["persistent client-only", { type: "textfield", persistent: "client-only" }, "persistent"],
    ["a textarea editor", { type: "textarea", editor: "ace" }, "editor"],
    ["reorder on a grid", { type: "datagrid", reorder: true, components: [{ type: "textfield", key: "t" }] }, "reorder"],
    ["s3 storage", { type: "file", storage: "s3" }, "storage"],
    ["url storage", { type: "file", storage: "url" }, "storage"]
  ];
  for (const [what, comp, key] of unsupported) {
    it(`reports ${what} as an unsupported option`, () => {
      const { report } = convertOne(comp);
      expect(report.entries.filter((e) => e.code === FormioCodes.UNSUPPORTED_OPTION)).toEqual([
        expect.objectContaining({ bucket: "unsupported", sourcePointer: `/components/0/${key}` })
      ]);
    });
  }

  it("keeps Form.io's defaults of the unsupported options out of the report", () => {
    const { report } = convertOne({ type: "email", unique: false, kickbox: { enabled: false }, persistent: true, allowMultipleMasks: false, validate: { minWords: "", maxWords: "" } });
    expect(report.entries).toEqual([]);
  });

  const styling: [string, Record<string, unknown>, string][] = [
    ["a tooltip", { type: "textfield", tooltip: "Help" }, "tooltip"],
    ["a prefix", { type: "number", prefix: "$" }, "prefix"],
    ["a suffix", { type: "textfield", suffix: "kg" }, "suffix"],
    ["an error label", { type: "textfield", errorLabel: "Name" }, "errorLabel"],
    ["a panel's tooltip", { type: "panel", title: "T", tooltip: "Help", components: [{ type: "textfield", key: "t" }] }, "tooltip"]
  ];
  for (const [what, comp, key] of styling) {
    it(`reports ${what} as dropped styling`, () => {
      const { report } = convertOne(comp);
      expect(report.entries.filter((e) => e.code === FormioCodes.DROPPED_STYLING)).toEqual([
        expect.objectContaining({ bucket: "dropped", sourcePointer: `/components/0/${key}` })
      ]);
      expect(JSON.stringify(report)).not.toMatch(/Help|kg|"Name"/);
    });
  }

  it("reports a wizard page's tooltip as dropped styling", () => {
    const { report } = convert({ display: "wizard", components: [{ type: "panel", key: "p", title: "T", tooltip: "Help", components: [{ type: "textfield", key: "t" }] }] });
    expect(codesAt(report, FormioCodes.DROPPED_STYLING)).toEqual(["/components/0/tooltip"]);
  });

  it("keeps a currency's prefix and suffix in its mask, not in the report", () => {
    const { report } = convertOne({ type: "currency", currency: "USD", prefix: "Total ", suffix: " net" });
    expect(report.entries).toEqual([]);
  });
});

describe("formio convert - typed comparisons in JSON logic", () => {
  const radio = { type: "radio", dataType: "number", values: [{ label: "One", value: "1" }, { label: "Two", value: "2" }] };
  // Form.io's default `auto` casts "1" to 1 and "true" to true.
  const autoRadio = { type: "radio", values: [{ label: "One", value: "1" }, { label: "Two", value: "2" }] };
  const autoYesNo = { type: "radio", values: [{ label: "Yes", value: "true" }, { label: "No", value: "false" }] };
  // [what, target, operator, literal, data that matches, data that does not]
  const kept: [string, Record<string, unknown>, string, unknown, unknown, unknown][] = [
    ["a number strictly equal to a number", { type: "number" }, "===", 5, 5, 6],
    ["a number loosely equal to a numeric string", { type: "number" }, "==", "5", 5, 6],
    ["a number strictly unequal to a number", { type: "number" }, "!==", 5, 6, 5],
    ["a checkbox loosely equal to true", { type: "checkbox" }, "==", true, true, false],
    ["a checkbox strictly equal to false", { type: "checkbox" }, "===", false, false, true],
    ["a cast radio strictly equal to a number", radio, "===", 1, 1, 2],
    ["a radio with no dataType loosely equal to a numeric string", autoRadio, "==", "1", 1, 2],
    ["a radio with no dataType loosely equal to true", autoYesNo, "==", true, true, false],
    ["a text field strictly equal to a string", { type: "textfield" }, "===", "x", "x", "y"]
  ];
  for (const [what, target, op, literal, yes, no] of kept) {
    it(`converts ${what}`, () => {
      const form = { components: [{ key: "a", ...target }, { type: "textfield", key: "b", conditional: { json: { [op]: [{ var: "data.a" }, literal] } } }] };
      expect(convert(form).report.entries.filter((e) => e.code === FormioCodes.ASSUMED_CONDITIONAL)).toEqual([]);
      expect(isVisible(form, { a: yes }, "b")).toBe(true);
      expect(isVisible(form, { a: no }, "b")).toBe(false);
    });
  }

  // Form.io: `5 === "5"` and `true == "true"` are false, so these never match as written.
  const refused: [string, Record<string, unknown>, string, unknown, unknown][] = [
    ["a number strictly equal to a string", { type: "number" }, "===", "5", 5],
    ["a number strictly unequal to a string", { type: "number" }, "!==", "5", 5],
    ["a currency strictly equal to a string", { type: "currency" }, "===", "5", 5],
    ["a checkbox loosely equal to \"true\"", { type: "checkbox" }, "==", "true", true],
    ["a checkbox loosely unequal to \"false\"", { type: "checkbox" }, "!=", "false", false],
    ["a checkbox strictly equal to \"true\"", { type: "checkbox" }, "===", "true", true],
    ["a cast radio strictly equal to a string", radio, "===", "1", 1],
    ["a radio with no dataType strictly equal to a numeric string", autoRadio, "===", "1", 1],
    ["a radio with no dataType loosely equal to \"true\"", autoYesNo, "==", "true", true]
  ];
  for (const [what, target, op, literal, value] of refused) {
    it(`reports ${what} assumed and gives no condition`, () => {
      const form = { components: [{ key: "a", ...target }, { type: "textfield", key: "b", conditional: { json: { [op]: [{ var: "data.a" }, literal] } } }] };
      const { output, report } = convert(form);
      expect(findElement(output, "b")?.visibleIf).toBeUndefined();
      expect(report.entries.filter((e) => e.code === FormioCodes.ASSUMED_CONDITIONAL).map((e) => e.sourcePointer)).toEqual(["/components/1/conditional/json"]);
      expect(isVisible(form, { a: value }, "b")).toBe(true);
      expect(isVisible(form, {}, "b")).toBe(true);
    });
  }

  // Form.io stores true or false for a yes/no choice cast by `auto` or `boolean`, and the empty
  // value "" with no choice; `==` is JavaScript's loose comparison of that value with the literal.
  // A literal is kept only when survey-core holds for the same values, and is otherwise reported.
  const yesNo = [{ label: "Yes", value: "true" }, { label: "No", value: "false" }];
  const castTargets: [string, Record<string, unknown>][] = [
    ["a radio with no dataType", { type: "radio", values: yesNo }],
    ["a radio with dataType boolean", { type: "radio", dataType: "boolean", values: yesNo }],
    ["a select with no dataType", { type: "select", data: { values: yesNo } }],
    ["a select with dataType boolean", { type: "select", dataType: "boolean", data: { values: yesNo } }]
  ];
  const states: [string, unknown, Record<string, unknown>][] = [
    ["true", true, { a: true }],
    ["false", false, { a: false }],
    ["no value", "", {}]
  ];
  for (const [what, target] of castTargets) {
    for (const op of ["==", "!="]) {
      for (const literal of [true, false, "true", "false", "TRUE", 1, 0, "1", "0", "", null]) {
        it(`compares ${what} ${op} ${JSON.stringify(literal)} as JavaScript does`, () => {
          const form = { components: [{ key: "a", ...target }, { type: "textfield", key: "b", conditional: { json: { [op]: [{ var: "data.a" }, literal] } } }] };
          const { output, report } = convert(form);
          const assumed = report.entries.filter((e) => e.code === FormioCodes.ASSUMED_CONDITIONAL).map((e) => e.sourcePointer);
          // Survey-core holds for the same values only for these four literals.
          const kept = [true, 1, "1", "0"].includes(literal as never);
          expect(findElement(output, "b")?.visibleIf !== undefined).toBe(kept);
          if (!kept) {
            expect(assumed).toEqual(["/components/1/conditional/json"]);
            for (const [, , data] of states) expect(isVisible(form, data, "b")).toBe(true);
            return;
          }
          expect(assumed).toEqual([]);
          for (const [state, stored, data] of states) {
            // eslint-disable-next-line eqeqeq
            const equal = stored == (literal as never);
            expect(isVisible(form, data, "b"), state).toBe(op === "==" ? equal : !equal);
          }
        });
      }
    }

    it(`converts ${what} == true and == 1, which JavaScript holds for true`, () => {
      for (const literal of [true, 1]) {
        const form = { components: [{ key: "a", ...target }, { type: "textfield", key: "b", conditional: { json: { "==": [{ var: "data.a" }, literal] } } }] };
        expect(findElement(convert(form).output, "b")?.visibleIf).toBeDefined();
      }
    });

    it(`gives no condition for ${what} == "true", which JavaScript never holds`, () => {
      const form = { components: [{ key: "a", ...target }, { type: "textfield", key: "b", conditional: { json: { "==": [{ var: "data.a" }, "true"] } } }] };
      expect(findElement(convert(form).output, "b")?.visibleIf).toBeUndefined();
    });
  }
});

describe("formio convert - survey, hidden, tags and nested form types", () => {
  const gate = { type: "textfield", key: "gate" };
  const showOnGate = { show: true, when: "gate", eq: "y" };

  describe("survey", () => {
    const surveyComp = {
      type: "survey", key: "s", label: "Rate",
      questions: [{ label: "Speed", value: "speed" }, { label: "Price", value: "price" }],
      values: [{ label: "Bad", value: "bad" }, { label: "Good", value: "good" }]
    };

    it("becomes a matrix whose rows are the questions and whose columns are the values", () => {
      const { output, report } = convert({ components: [surveyComp] });
      expect(findElement(output, "s")).toMatchObject({
        type: "matrix", title: "Rate",
        rows: [{ value: "speed", text: "Speed" }, { value: "price", text: "Price" }],
        columns: [{ value: "bad", text: "Bad" }, { value: "good", text: "Good" }]
      });
      expect(entry(report.entries, FormioCodes.UNSUPPORTED_COMPONENT)).toBeUndefined();
      const survey = assertConstructsCleanly(output, "survey");
      survey.data = { s: { speed: "good", price: "bad" } };
      expect(survey.getQuestionByName("s").value).toEqual({ speed: "good", price: "bad" });
      survey.setValue("s", { speed: "bad" });
      expect(survey.data).toEqual({ s: { speed: "bad" } });
    });

    it("keeps an object default, and spreads a single value over the questions as Form.io does", () => {
      const byObject = convert({ components: [{ ...surveyComp, defaultValue: { speed: "good" } }] });
      expect(assertConstructsCleanly(byObject.output, "survey object default").data).toEqual({ s: { speed: "good" } });
      const byValue = convert({ components: [{ ...surveyComp, defaultValue: "bad" }] });
      expect(assertConstructsCleanly(byValue.output, "survey value default").data).toEqual({ s: { speed: "bad", price: "bad" } });
    });

    it("spreads a value over every question, one with an empty value included, as Form.io's getter does", () => {
      const questions = [...surveyComp.questions, { label: "Blank", value: "" }];
      const { output } = convert({ components: [{ ...surveyComp, questions, defaultValue: "good" }] });
      expect(findElement(output, "s")?.rows).toEqual([{ value: "speed", text: "Speed" }, { value: "price", text: "Price" }]);
      expect(findElement(output, "s")?.defaultValue).toEqual({ speed: "good", price: "good", "": "good" });
      expect(assertConstructsCleanly(output, "survey spread with empty question").data).toEqual({ s: { speed: "good", price: "good", "": "good" } });
    });

    it("does not spread a falsy value, which Form.io keeps as it is, and reports it", () => {
      const { output, report } = convert({ components: [{ ...surveyComp, values: [{ label: "None", value: 0 }], defaultValue: 0 }] });
      expect(findElement(output, "s")?.defaultValue).toBeUndefined();
      expect(entry(report.entries, FormioCodes.ASSUMED_DEFAULT_VALUE)).toMatchObject({ sourcePointer: "/components/0/defaultValue" });
      assertConstructsCleanly(output, "survey falsy default");
    });

    it("reports a default that is neither an object nor one of its values", () => {
      const { output, report } = convert({ components: [{ ...surveyComp, defaultValue: "other" }] });
      expect(findElement(output, "s")?.defaultValue).toBeUndefined();
      expect(entry(report.entries, FormioCodes.ASSUMED_DEFAULT_VALUE)).toMatchObject({ sourcePointer: "/components/0/defaultValue" });
      assertConstructsCleanly(output, "survey unknown default");
    });

    it("requires an answer for every question when it is required", () => {
      const { output } = convert({ components: [{ ...surveyComp, validate: { required: true } }] });
      expect(findElement(output, "s")).toMatchObject({ isRequired: true, eachRowRequired: true });
      const survey = assertConstructsCleanly(output, "survey required");
      survey.data = { s: { speed: "good" } };
      expect(survey.getQuestionByName("s").hasErrors()).toBe(true);
      survey.data = { s: { speed: "good", price: "bad" } };
      expect(survey.getQuestionByName("s").hasErrors()).toBe(false);
    });

    it("reports a condition on its object value assumed and gives no condition", () => {
      const form = { components: [
        surveyComp,
        { type: "textfield", key: "a", conditional: { show: true, when: "s", eq: "good" } },
        { type: "textfield", key: "b", conditional: simpleConditional(true, [{ component: "s", operator: "isEmpty" }]) }
      ] };
      const { output, report } = convert(form);
      expect(findElement(output, "a")?.visibleIf).toBeUndefined();
      expect(findElement(output, "b")?.visibleIf).toBeUndefined();
      expect(report.entries.filter((e) => e.code === FormioCodes.ASSUMED_CONDITIONAL).map((e) => e.sourcePointer))
        .toEqual(["/components/1/conditional/when", "/components/2/conditional/conditions/0"]);
      expect(isVisible(form, { s: { speed: "good" } }, "a")).toBe(true);
    });
  });

  describe("hidden", () => {
    it("becomes an invisible text that keeps its default in the data", () => {
      const form = { components: [
        { type: "hidden", key: "h", label: "H", defaultValue: "d" },
        { type: "textfield", key: "b", conditional: { show: true, when: "h", eq: "d" } }
      ] };
      const { output, report } = convert(form);
      expect(findElement(output, "h")).toMatchObject({ type: "text", visible: false, clearIfInvisible: "none", defaultValue: "d" });
      expect(entry(report.entries, FormioCodes.UNSUPPORTED_COMPONENT)).toBeUndefined();
      const survey = assertConstructsCleanly(output, "hidden");
      expect(survey.data).toEqual({ h: "d" });
      expect(survey.getQuestionByName("b").isVisible).toBe(true);
      survey.data = { h: "e" };
      expect(survey.getQuestionByName("b").isVisible).toBe(false);
      survey.doComplete();
      expect(survey.data).toEqual({ h: "e" });
    });

    it("still reports a calculated value", () => {
      const { output, report } = convert({ components: [{ type: "hidden", key: "h", calculateValue: "value = 1;" }] });
      expect(entry(report.entries, FormioCodes.CUSTOM_VALUE)).toMatchObject({ sourcePointer: "/components/0/calculateValue" });
      assertConstructsCleanly(output, "hidden calculated");
    });

    it("keeps its value in a shown conditional panel through completion", () => {
      const { output } = convert({ components: [
        gate,
        { type: "panel", key: "p", conditional: showOnGate, components: [{ type: "hidden", key: "h", defaultValue: "d" }, { type: "textfield", key: "a" }] }
      ] });
      expect(findElement(output, "h")?.clearIfInvisible).toBe("none");
      const survey = assertConstructsCleanly(output, "hidden in shown conditional panel");
      expect(survey.data).toEqual({ h: "d" });
      survey.setValue("gate", "y");
      expect(survey.getQuestionByName("a").isVisible).toBe(true);
      survey.doComplete();
      expect(survey.data).toEqual({ gate: "y", h: "d" });
    });

    it("keeps its value when a conditional panel around it hides, where the Form.io server clears it", () => {
      const { output } = convert({ components: [
        gate,
        { type: "panel", key: "p", conditional: showOnGate, components: [{ type: "hidden", key: "h" }, { type: "textfield", key: "a" }] }
      ] });
      expect(findElement(output, "h")?.clearIfInvisible).toBe("none");
      const survey = assertConstructsCleanly(output, "hidden in hidden conditional panel");
      survey.data = { gate: "y", h: "v" };
      survey.setValue("gate", "n");
      survey.doComplete();
      expect(survey.data).toEqual({ gate: "n", h: "v" });
    });

    it("keeps its value in a conditional panel with clearOnHide: false", () => {
      const { output } = convert({ components: [
        gate,
        { type: "panel", key: "p", conditional: showOnGate, components: [{ type: "hidden", key: "h", clearOnHide: false }] }
      ] });
      expect(findElement(output, "h")?.clearIfInvisible).toBe("none");
      const survey = assertConstructsCleanly(output, "hidden clearOnHide false");
      survey.data = { gate: "y", h: "v" };
      survey.setValue("gate", "n");
      expect(survey.data).toEqual({ gate: "n", h: "v" });
      survey.doComplete();
      expect(survey.data).toEqual({ gate: "n", h: "v" });
    });

    it("reports its own condition assumed rather than showing it", () => {
      const { output, report } = convert({ components: [gate, { type: "hidden", key: "h", defaultValue: "d", conditional: showOnGate }] });
      expect(findElement(output, "h")?.visibleIf).toBeUndefined();
      expect(findElement(output, "h")?.clearIfInvisible).toBe("none");
      expect(report.entries.filter((e) => e.code === FormioCodes.ASSUMED_CONDITIONAL).map((e) => e.sourcePointer)).toEqual(["/components/1/conditional"]);
      const survey = assertConstructsCleanly(output, "hidden own condition");
      survey.setValue("gate", "y");
      expect(survey.getQuestionByName("h").isVisible).toBe(false);
      expect(survey.data).toEqual({ gate: "y", h: "d" });
      survey.doComplete();
      expect(survey.data).toEqual({ gate: "y", h: "d" });
    });

    it("reports its own condition once when parts of it are assumed", () => {
      const conditional = simpleConditional(true, [{ component: "day", operator: "dateGreaterThan", value: "01/01/2020" }]);
      const { output, report } = convert({ components: [{ type: "day", key: "day" }, { type: "hidden", key: "h", conditional }] });
      expect(findElement(output, "h")?.visibleIf).toBeUndefined();
      expect(report.entries.filter((e) => e.code === FormioCodes.ASSUMED_CONDITIONAL).map((e) => e.sourcePointer)).toEqual(["/components/1/conditional"]);
      assertConstructsCleanly(output, "hidden own condition with assumed parts");
    });

    it("reports logic that hides it assumed rather than showing it", () => {
      const logic = [{ trigger: { type: "simple", simple: { show: true, when: "gate", eq: "y" } }, actions: [{ type: "property", property: { type: "boolean", value: "hidden" }, state: true }] }];
      const { output, report } = convert({ components: [gate, { type: "hidden", key: "h", logic }] });
      expect(findElement(output, "h")?.visibleIf).toBeUndefined();
      expect(report.entries.filter((e) => e.code === FormioCodes.ASSUMED_CONDITIONAL).map((e) => e.sourcePointer)).toEqual(["/components/1/logic/0"]);
      const survey = assertConstructsCleanly(output, "hidden logic");
      survey.setValue("gate", "n");
      expect(survey.getQuestionByName("h").isVisible).toBe(false);
    });

    it("keeps its value in a statically hidden panel, even under a condition", () => {
      const { output } = convert({ components: [
        gate,
        { type: "panel", key: "p", conditional: showOnGate, components: [
          { type: "panel", key: "q", hidden: true, components: [{ type: "hidden", key: "h", defaultValue: "d" }] }
        ] }
      ] });
      expect(findElement(output, "h")?.clearIfInvisible).toBe("none");
      const survey = assertConstructsCleanly(output, "hidden in static hidden panel");
      expect(survey.data).toEqual({ h: "d" });
      survey.doComplete();
      expect(survey.data).toEqual({ h: "d" });
    });
  });

  describe("tags", () => {
    it("becomes a tagbox with custom choices when stored as an array", () => {
      const form = { components: [
        { type: "tags", key: "t", label: "Tags", storeas: "array", maxTags: 2 },
        { type: "textfield", key: "b", conditional: { show: true, when: "t", eq: "a" } }
      ] };
      const { output, report } = convert(form);
      expect(findElement(output, "t")).toMatchObject({ type: "tagbox", title: "Tags", allowCustomChoices: true, maxSelectedChoices: 2 });
      expect(findElement(output, "b")?.visibleIf).toBe("{t} contains 'a'");
      expect(entry(report.entries, FormioCodes.UNSUPPORTED_COMPONENT)).toBeUndefined();
      const survey = assertConstructsCleanly(output, "tags");
      survey.data = { t: ["a", "x"] };
      expect([...survey.getQuestionByName("t").value]).toEqual(["a", "x"]);
      expect(survey.getQuestionByName("b").isVisible).toBe(true);
      survey.data = { t: ["x"] };
      expect(survey.getQuestionByName("b").isVisible).toBe(false);
      survey.doComplete();
      expect(survey.data).toEqual({ t: ["x"] });
    });

    it("splits a string default on its delimiter, as Form.io does for an array", () => {
      const { output } = convert({ components: [{ type: "tags", key: "t", storeas: "array", delimeter: ";", defaultValue: "a;b;" }] });
      expect(assertConstructsCleanly(output, "tags default").data).toEqual({ t: ["a", "b"] });
    });

    it("gives no limit for maxTags 0", () => {
      const { output } = convert({ components: [{ type: "tags", key: "t", storeas: "array", maxTags: 0 }] });
      expect(findElement(output, "t")?.maxSelectedChoices).toBeUndefined();
      const survey = assertConstructsCleanly(output, "tags without limit");
      survey.data = { t: ["a", "b", "c"] };
      expect(survey.data).toEqual({ t: ["a", "b", "c"] });
    });

    it("stays reported when stored as a string", () => {
      for (const comp of [{ type: "tags", key: "t" }, { type: "tags", key: "t", storeas: "string" }]) {
        const { output, report } = convert({ components: [comp] });
        expect(findElement(output, "t")).toBeUndefined();
        expect(entry(report.entries, FormioCodes.UNSUPPORTED_COMPONENT)).toMatchObject({ bucket: "unsupported", sourcePointer: "/components/0" });
        assertConstructsCleanly(output, "tags string");
      }
    });
  });

  describe("nested form", () => {
    const nested = (components: unknown[]) => ({ type: "form", key: "f", label: "Nested", components });

    it("becomes a panel holding its fields, reported because Form.io nests their data", () => {
      const { output, report } = convert({ components: [nested([{ type: "textfield", key: "x", label: "X" }])] });
      expect(findElement(output, "f")).toMatchObject({ type: "panel", elements: [{ type: "text", name: "x", title: "X" }] });
      expect(findElement(output, "f")?.title).toBeUndefined();
      expect(entry(report.entries, FormioCodes.ASSUMED_CONTAINER_DATA)).toMatchObject({
        bucket: "assumed", sourcePointer: "/components/0", targetPath: "pages[0].elements[0]"
      });
      expect(entry(report.entries, FormioCodes.UNSUPPORTED_COMPONENT)).toBeUndefined();
      const survey = assertConstructsCleanly(output, "nested form");
      survey.data = { x: "1" };
      expect(survey.getQuestionByName("x").value).toBe("1");
    });

    it("resolves a condition inside it in its own data, and one outside through <key>.data", () => {
      const form = { components: [
        { type: "textfield", key: "x" },
        nested([
          { type: "textfield", key: "x" },
          { type: "textfield", key: "inner", conditional: { show: true, when: "x", eq: "1" } },
          { type: "htmlelement", key: "note", html: "<p>{{ data.x }}</p>" }
        ]),
        { type: "textfield", key: "outer", conditional: { json: { "==": [{ var: "data.f.data.x" }, "2"] } } }
      ] };
      const { output, report } = convert(form);
      expect(findElement(output, "inner")?.visibleIf).toBe("{x_1} = '1'");
      expect(findElement(output, "outer")?.visibleIf).toBe("{x_1} = '2'");
      expect(findElement(output, "note")?.html).toBe("<p>{x_1}</p>");
      expect(entry(report.entries, FormioCodes.ASSUMED_CONDITIONAL)).toBeUndefined();
      expect(isVisible(form, { x: "0", x_1: "1" }, "inner")).toBe(true);
      expect(isVisible(form, { x: "1", x_1: "0" }, "inner")).toBe(false);
      expect(isVisible(form, { x: "0", x_1: "2" }, "outer")).toBe(true);
      expect(isVisible(form, { x: "2", x_1: "0" }, "outer")).toBe(false);
    });

    it("keeps the key of an outer field that follows a nested field with the same key", () => {
      const form = { components: [
        nested([
          { type: "textfield", key: "x" },
          { type: "textfield", key: "inner", conditional: { show: true, when: "x", eq: "1" } }
        ]),
        { type: "textfield", key: "x" },
        { type: "textfield", key: "outer", conditional: { show: true, when: "x", eq: "2" } },
        { type: "textfield", key: "deep", conditional: { json: { "==": [{ var: "data.f.data.x" }, "3"] } } }
      ] };
      const { output, report } = convert(form);
      expect(output.pages?.[0].elements.map((e) => (e as SurveyJSONElement).name)).toEqual(["f", "x", "outer", "deep"]);
      expect((findElement(output, "f")?.elements as SurveyJSONElement[]).map((e) => e.name)).toEqual(["x_1", "inner"]);
      expect(findElement(output, "inner")?.visibleIf).toBe("{x_1} = '1'");
      expect(findElement(output, "outer")?.visibleIf).toBe("{x} = '2'");
      expect(findElement(output, "deep")?.visibleIf).toBe("{x_1} = '3'");
      expect(entry(report.entries, FormioCodes.ASSUMED_CONDITIONAL)).toBeUndefined();
      expect(lintRules(form)).not.toContain("name/duplicate");
      expect(isVisible(form, { x: "0", x_1: "1" }, "inner")).toBe(true);
      expect(isVisible(form, { x: "1", x_1: "0" }, "inner")).toBe(false);
      expect(isVisible(form, { x: "2", x_1: "0" }, "outer")).toBe(true);
      expect(isVisible(form, { x: "0", x_1: "2" }, "outer")).toBe(false);
      expect(isVisible(form, { x: "0", x_1: "3" }, "deep")).toBe(true);
      expect(isVisible(form, { x: "3", x_1: "0" }, "deep")).toBe(false);
    });

    it("keeps the key of a field inside a data grid inside a nested form", () => {
      const { output } = convert({ components: [
        nested([{ type: "datagrid", key: "g", components: [{ type: "textfield", key: "y" }] }]),
        { type: "textfield", key: "y" }
      ] });
      expect((findElement(output, "g")?.templateElements as SurveyJSONElement[]).map((e) => e.name)).toEqual(["y"]);
      expect(output.pages?.[0].elements.map((e) => (e as SurveyJSONElement).name)).toEqual(["f", "y"]);
      assertConstructsCleanly(output, "grid in nested form");
    });

    it("keeps the key of a field of a middle form when a form nested in it holds the same key", () => {
      const inner = { type: "form", key: "g", label: "Inner", components: [{ type: "textfield", key: "x" }] };
      const { output } = convert({ components: [
        { type: "form", key: "f", label: "Middle", components: [inner, { type: "textfield", key: "x" }] }
      ] });
      const middle = findElement(output, "f")?.elements as SurveyJSONElement[];
      expect(middle.map((e) => e.name)).toEqual(["g", "x"]);
      expect((middle[0].elements as SurveyJSONElement[]).map((e) => e.name)).toEqual(["x_1"]);
      assertConstructsCleanly(output, "doubly nested form");
    });

    it("does not resolve a condition inside it to a field of the outer form", () => {
      const form = { components: [
        { type: "textfield", key: "y" },
        nested([{ type: "textfield", key: "inner", conditional: { show: true, when: "y", eq: "1" } }])
      ] };
      const { output, report } = convert(form);
      expect(findElement(output, "inner")?.visibleIf).toBeUndefined();
      expect(entry(report.entries, FormioCodes.ASSUMED_CONDITIONAL)).toMatchObject({ sourcePointer: "/components/1/components/0/conditional/when" });
      assertConstructsCleanly(output, "nested form outer reference");
    });

    it("does not resolve a JSON logic path from the outer form to a field inside a nested form", () => {
      const form = { components: [
        nested([{ type: "textfield", key: "inner" }]),
        { type: "textfield", key: "byKey", conditional: { json: { "==": [{ var: "data.inner" }, "1"] } } },
        { type: "textfield", key: "byLayout", conditional: { json: { "==": [{ var: "data.f.inner" }, "1"] } } },
        { type: "textfield", key: "byTruthiness", conditional: { json: { var: "data.inner" } } },
        { type: "textfield", key: "byData", conditional: { json: { "==": [{ var: "data.f.data.inner" }, "1"] } } }
      ] };
      const { output, report } = convert(form);
      for (const name of ["byKey", "byLayout", "byTruthiness"]) expect(findElement(output, name)?.visibleIf).toBeUndefined();
      expect(report.entries.filter((e) => e.code === FormioCodes.ASSUMED_CONDITIONAL).map((e) => e.sourcePointer)).toEqual([
        "/components/1/conditional/json", "/components/2/conditional/json", "/components/3/conditional/json"
      ]);
      expect(findElement(output, "byData")?.visibleIf).toBe("{inner} = '1'");
      for (const name of ["byKey", "byLayout", "byTruthiness"]) {
        expect(isVisible(form, { inner: "1" }, name)).toBe(true);
        expect(isVisible(form, { inner: "0" }, name)).toBe(true);
      }
      expect(isVisible(form, { inner: "1" }, "byData")).toBe(true);
      expect(isVisible(form, { inner: "0" }, "byData")).toBe(false);
    });

    it("resolves a legacy or simple condition from the outer form to a field inside a nested form by its key", () => {
      const form = { components: [
        nested([{ type: "textfield", key: "inner" }]),
        { type: "textfield", key: "byWhen", conditional: { show: true, when: "inner", eq: "1" } },
        { type: "textfield", key: "bySimple", conditional: simpleConditional(true, [{ component: "inner", operator: "isEqual", value: "1" }]) }
      ] };
      const { output, report } = convert(form);
      expect(findElement(output, "byWhen")?.visibleIf).toBe("{inner} = '1'");
      expect(entry(report.entries, FormioCodes.ASSUMED_CONDITIONAL)).toBeUndefined();
      for (const name of ["byWhen", "bySimple"]) {
        expect(isVisible(form, { inner: "1" }, name)).toBe(true);
        expect(isVisible(form, { inner: "0" }, name)).toBe(false);
      }
    });

    it("does not resolve a JSON logic path inside a nested form to a field of a form nested in it", () => {
      const form = { components: [nested([
        { type: "form", key: "g", components: [{ type: "textfield", key: "deep" }] },
        { type: "textfield", key: "byKey", conditional: { json: { "==": [{ var: "data.deep" }, "1"] } } },
        { type: "textfield", key: "byData", conditional: { json: { "==": [{ var: "data.g.data.deep" }, "1"] } } }
      ])] };
      const { output, report } = convert(form);
      expect(findElement(output, "byKey")?.visibleIf).toBeUndefined();
      expect(entry(report.entries, FormioCodes.ASSUMED_CONDITIONAL)).toMatchObject({ sourcePointer: "/components/0/components/1/conditional/json" });
      expect(isVisible(form, { deep: "1" }, "byKey")).toBe(true);
      expect(isVisible(form, { deep: "0" }, "byKey")).toBe(true);
      expect(isVisible(form, { deep: "1" }, "byData")).toBe(true);
      expect(isVisible(form, { deep: "0" }, "byData")).toBe(false);
    });

    it("does not pipe {{ data.<key> }} from the outer form to a field inside a nested form", () => {
      const { output, report } = convert({ components: [
        nested([{ type: "textfield", key: "inner" }]),
        { type: "htmlelement", key: "note", html: "<p>{{ data.inner }} / {{ data.f.data.inner }}</p>" }
      ] });
      expect(findElement(output, "note")?.html).toBe("<p>{{ data.inner }} / {inner}</p>");
      expect(entry(report.entries, FormioCodes.CUSTOM_TEMPLATE)).toMatchObject({ bucket: "unsupported", sourcePointer: "/components/1/html" });
      const survey = assertConstructsCleanly(output, "nested form template");
      survey.data = { inner: "Ann" };
      expect((survey.getQuestionByName("note") as unknown as { processedHtml: string }).processedHtml).toContain("/ Ann</p>");
    });

    it("does not substitute {{ data.<key> }} in a URL from the outer form with a field inside a nested form", () => {
      const select = (url: string) => ({ components: [
        nested([{ type: "textfield", key: "inner" }]),
        { type: "select", key: "s", dataSrc: "url", valueProperty: "id", data: { url } }
      ] });
      const refused = convert(select("https://x.test/api?c={{ data.inner }}"));
      expect(findElement(refused.output, "s")?.choicesByUrl).toBeUndefined();
      expect(entry(refused.report.entries, FormioCodes.UNSUPPORTED_DATA_SOURCE)).toMatchObject({ sourcePointer: "/components/1/dataSrc" });
      assertConstructsCleanly(refused.output, "nested form URL refused");
      const resolved = convert(select("https://x.test/api?c={{ data.f.data.inner }}"));
      expect((findElement(resolved.output, "s")?.choicesByUrl as Record<string, string>).url).toBe("https://x.test/api?c={inner}");
      assertConstructsCleanly(resolved.output, "nested form URL resolved");
    });

    it("stays reported without inline components", () => {
      for (const comp of [{ type: "form", key: "f", form: "5692b920d1028f01000407e7" }, nested([])]) {
        const { output, report } = convert({ components: [comp] });
        expect(findElement(output, "f")).toBeUndefined();
        expect(entry(report.entries, FormioCodes.UNSUPPORTED_COMPONENT)).toMatchObject({ bucket: "unsupported", sourcePointer: "/components/0" });
        expect(entry(report.entries, FormioCodes.ASSUMED_CONTAINER_DATA)).toBeUndefined();
        assertConstructsCleanly(output, "nested form by reference");
      }
    });
  });
});
