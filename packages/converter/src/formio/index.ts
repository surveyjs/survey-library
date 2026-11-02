// Form.io -> SurveyJS converter.
//
// Form.io is a single proprietary component tree: no data/presentation split,
// logic embedded in the nodes. There is no published JSON Schema of the form
// definition; the authoritative shape is the TypeScript types in `@formio/core`,
// a snapshot of whose builtin `type` set we vendor under `vendor/` and diff
// against upstream via `npm run corpus:refresh`. This module never throws on a
// construct it cannot map -- every such case goes to the report. It throws only
// when the input is not a Form.io form at all (see `assertFormioForm`).
//
// SETTLED MODELLING DECISIONS (do not re-open in review):
//
//   * Data grids (`datagrid` / `editgrid`) -> `paneldynamic`, always, with
//     `ASSUMED_DATAGRID_MODEL`. A data grid is a repeating group of arbitrary
//     nested components; `paneldynamic` preserves that nested tree without
//     forcing a column model, and data grids routinely nest panels/containers
//     that `matrixdynamic` cannot hold. `matrixdynamic` would be more faithful
//     ONLY for a provably flat grid (all children simple inputs) -- we cannot
//     prove tabular-vs-nested intent from the definition, so we default to the
//     structural superset and flag it `assumed` (renders right, may shape wrong).
//
//   * Wizards (`display: "wizard"`): each top-level container component becomes a
//     SurveyJS `page` ({ name, title, elements }), NOT a nested `panel` -- its
//     children are promoted directly into the page so we do not double-wrap. A
//     plain `display: "form"` (or `"pdf"`) becomes a single page.
//
//   * `conditional: { show, when, eq }` -> `visibleIf` (mechanical, no report
//     entry). The JSON-logic `conditional.json` form is translated where the
//     operators are provable; anything else -> `ASSUMED_CONDITIONAL`.
//
//   * `customConditional` / `validate.custom` are arbitrary JavaScript. We do
//     NOT parse, attempt, or eval them. Reported content-free (path + count,
//     never the JS source); the field still converts, only its custom logic is
//     dropped-with-an-alarm.

import { ConversionResult, ReportBuilder } from "../report";
import { UnparseableInputError, WrongFormatError } from "../errors";
import { SurveyJSON, SurveyJSONElement, SurveyJSONPage } from "../types";
import { FormioCodes } from "./codes";
import { isKnownFormioType } from "./vendor/component-types";

const SOURCE = "formio";

/** The subset of a Form.io form we rely on. Structural only. */
interface FormioForm {
  display?: string; // "form" | "wizard" | "pdf"
  title?: string;
  components?: FormioComponent[];
  [key: string]: unknown;
}

interface FormioValidate {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  custom?: string; // arbitrary JS -- REFUSED
  [key: string]: unknown;
}

interface FormioChoice {
  label?: string;
  value?: unknown;
}

interface FormioComponent {
  type?: string;
  key?: string;
  label?: string;
  title?: string; // `panel`: the displayed title; `label` is the builder's name
  legend?: string; // `fieldset`: the displayed title
  hideLabel?: boolean;
  hidden?: boolean;
  disabled?: boolean;
  description?: string;
  placeholder?: string;
  defaultValue?: unknown;
  input?: boolean;
  multiple?: boolean;
  html?: string;
  content?: string;
  validate?: FormioValidate;
  conditional?: { show?: boolean, when?: string, eq?: unknown, json?: unknown };
  customConditional?: string; // arbitrary JS -- REFUSED
  data?: { values?: FormioChoice[], [key: string]: unknown };
  values?: FormioChoice[];
  components?: FormioComponent[]; // container/panel/grid children
  columns?: { components?: FormioComponent[] }[]; // `columns` layout
  rows?: FormioTableCell[][]; // `table` layout
  [key: string]: unknown;
}

// A `table` cell is `{ components: [...] }`; older forms store the component array itself.
type FormioTableCell = { components?: FormioComponent[] } | FormioComponent[];

/**
 * Recognize a Form.io form definition. A Form.io form is an object with a
 * top-level `components` array. We use this to reject wrong-format input loudly
 * (a JSON Schema, a SurveyJS JSON) before attempting any conversion. This is the
 * entire throwing surface of the converter.
 */
function assertFormioForm(input: unknown): asserts input is FormioForm {
  if (input === null || typeof input !== "object" || Array.isArray(input)) {
    throw new UnparseableInputError("Form.io input must be a JSON object.");
  }
  const form = input as FormioForm;
  if (!Array.isArray(form.components)) {
    // A JSON Schema has `properties`; a SurveyJS survey has `pages`/`elements`.
    // Neither has a top-level `components` array -- steer the caller.
    throw new WrongFormatError(
      "Input does not look like a Form.io form (missing top-level `components` array). " +
        "If this is a JSON Schema, use survey-converter/json-schema."
    );
  }
}

// --- text `inputType` table -------------------------------------------------
// Form.io input types that all map to a SurveyJS `text` question, distinguished
// by `inputType`. `undefined` means a plain text field (SurveyJS default).
const TEXT_INPUT_TYPE: Record<string, string | undefined> = {
  textfield: undefined,
  email: "email",
  url: "url",
  phoneNumber: "tel",
  number: "number",
  currency: "number", // currency formatting (symbol/precision) is presentation -> dropped
  password: "password",
  datetime: "datetime-local",
  day: "date",
  time: "time"
};

// Container types whose children are recursed into a SurveyJS `panel`.
const PANEL_CONTAINERS = new Set(["panel", "fieldset", "well", "container"]);
// Layout containers with no SurveyJS equivalent -- flattened into a `panel`,
// their layout reported `dropped`. `tabs` has its own path, see `mapTabs`.
const LAYOUT_CONTAINERS = new Set(["columns", "table"]);

interface Ctx {
  report: ReportBuilder;
  usedNames: Set<string>;
}

/** Read `data.values` (select) or `values` (radio/selectboxes) as SurveyJS choices. */
function readChoices(comp: FormioComponent): { value: unknown, text?: string }[] | undefined {
  const raw = comp.data?.values ?? comp.values;
  if (!Array.isArray(raw)) return undefined;
  const choices = raw
    .filter((c) => c && c.value !== undefined && c.value !== "")
    .map((c) => (c.label !== undefined ? { value: c.value, text: c.label } : { value: c.value }));
  return choices.length > 0 ? choices : undefined;
}

/** SurveyJS `validators` from Form.io `validate` (excluding `custom`, which is refused). */
function readValidators(v: FormioValidate | undefined): Record<string, unknown>[] | undefined {
  if (!v) return undefined;
  const validators: Record<string, unknown>[] = [];
  if (v.minLength !== undefined || v.maxLength !== undefined) {
    const t: Record<string, unknown> = { type: "text" };
    if (v.minLength !== undefined) t.minLength = v.minLength;
    if (v.maxLength !== undefined) t.maxLength = v.maxLength;
    validators.push(t);
  }
  if (v.min !== undefined || v.max !== undefined) {
    const n: Record<string, unknown> = { type: "numeric" };
    if (v.min !== undefined) n.minValue = v.min;
    if (v.max !== undefined) n.maxValue = v.max;
    validators.push(n);
  }
  if (typeof v.pattern === "string" && v.pattern.length > 0) {
    validators.push({ type: "regex", regex: v.pattern });
  }
  return validators.length > 0 ? validators : undefined;
}

/**
 * Translate `component.conditional` into a `visibleIf` expression and/or a
 * report entry. The simple `{ show, when, eq }` form is mechanical (no report).
 * The JSON-logic `conditional.json` form is translated where provable, else
 * reported `ASSUMED_CONDITIONAL`.
 */
function readVisibleIf(comp: FormioComponent, sourcePtr: string, targetPath: string, ctx: Ctx): string | undefined {
  const cond = comp.conditional;
  if (!cond) return undefined;

  // JSON-logic form takes precedence when present.
  if (cond.json !== undefined && cond.json !== null && cond.json !== "") {
    const expr = translateJsonLogic(cond.json);
    if (expr) return expr;
    ctx.report.assumed(FormioCodes.ASSUMED_CONDITIONAL, `${sourcePtr}/conditional/json`, `${targetPath}.visibleIf`);
    return undefined;
  }

  if (typeof cond.when === "string" && cond.when.length > 0) {
    const op = cond.show === false ? "<>" : "=";
    return `{${cond.when}} ${op} ${formatConditionValue(cond.eq)}`;
  }
  return undefined;
}

/** Quote a Form.io conditional target value for a SurveyJS expression. */
function formatConditionValue(value: unknown): string {
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return `'${String(value ?? "")}'`;
}

/**
 * Translate the provable subset of Form.io JSON-logic into a SurveyJS
 * expression. Handles `==`/`!=` against a `var`, and `and`/`or` of the same.
 * Returns `undefined` for anything outside the proven subset -- the caller then
 * flags it `assumed` rather than emitting a wrong expression.
 */
function translateJsonLogic(node: unknown): string | undefined {
  if (node === null || typeof node !== "object" || Array.isArray(node)) return undefined;
  const obj = node as Record<string, unknown>;
  const keys = Object.keys(obj);
  if (keys.length !== 1) return undefined;
  const op = keys[0];
  const args = obj[op];
  if (!Array.isArray(args)) return undefined;

  if ((op === "==" || op === "===" || op === "!=" || op === "!==") && args.length === 2) {
    const varName = readJsonLogicVar(args[0]) ?? readJsonLogicVar(args[1]);
    const literal = readJsonLogicVar(args[0]) === undefined ? args[0] : args[1];
    if (varName === undefined) return undefined;
    const sqlOp = op.startsWith("!") ? "<>" : "=";
    return `{${varName}} ${sqlOp} ${formatConditionValue(literal)}`;
  }
  if ((op === "and" || op === "or") && args.length >= 2) {
    const parts = args.map((a) => translateJsonLogic(a));
    if (parts.some((p) => p === undefined)) return undefined;
    const joiner = op === "and" ? " and " : " or ";
    return "(" + parts.join(joiner) + ")";
  }
  return undefined;
}

function readJsonLogicVar(node: unknown): string | undefined {
  if (node === null || typeof node !== "object" || Array.isArray(node)) return undefined;
  const v = (node as { var?: unknown }).var;
  return typeof v === "string" ? v : undefined;
}

/** Ensure `name` is unique within the produced survey (SurveyJS keys on name). */
function uniqueName(base: string, ctx: Ctx): string {
  let name = base;
  let i = 1;
  while(ctx.usedNames.has(name)) name = `${base}_${i++}`;
  ctx.usedNames.add(name);
  return name;
}

/**
 * Map a single Form.io component to a SurveyJS element (or `null` when the
 * component is knowingly dropped or refused). `sourcePtr` is a JSON Pointer into
 * the source; `targetPath` is where the produced node will live in the output.
 */
function mapComponent(
  comp: FormioComponent,
  sourcePtr: string,
  targetPath: string,
  ctx: Ctx
): SurveyJSONElement | null {
  const type = comp.type;
  if (typeof type !== "string") {
    ctx.report.unknown(FormioCodes.UNKNOWN_COMPONENT, sourcePtr, "");
    return null;
  }

  // Layout / container types recurse; handled before the leaf mapping.
  if (PANEL_CONTAINERS.has(type)) {
    return mapPanel(comp, sourcePtr, targetPath, ctx);
  }
  if (type === "tabs") {
    // The tab strip is lost; the tabs' fields are kept, grouped by tab.
    ctx.report.dropped(FormioCodes.DROPPED_STYLING, sourcePtr, targetPath);
    return mapTabs(comp, sourcePtr, targetPath, ctx);
  }
  if (LAYOUT_CONTAINERS.has(type)) {
    // Layout containers carry no SurveyJS structural equivalent -- flatten to a
    // panel and record the lost layout.
    ctx.report.dropped(FormioCodes.DROPPED_STYLING, sourcePtr, targetPath);
    return mapPanel(comp, sourcePtr, targetPath, ctx, collectLayoutChildren(comp, sourcePtr));
  }
  if (type === "datagrid" || type === "editgrid") {
    return mapDataGrid(comp, sourcePtr, targetPath, ctx);
  }
  if (type === "button") {
    // Submit/save is handled by SurveyJS navigation -- no target node.
    ctx.report.dropped(FormioCodes.DROPPED_VENDOR_META, sourcePtr, "");
    return null;
  }

  // Leaf inputs.
  const el = mapLeaf(comp, type, sourcePtr, targetPath, ctx);
  if (!el) return null;

  applyCommon(comp, el, sourcePtr, targetPath, ctx);
  return el;
}

/** Map a leaf (non-container) component to its SurveyJS element, or null. */
function mapLeaf(
  comp: FormioComponent,
  type: string,
  sourcePtr: string,
  targetPath: string,
  ctx: Ctx
): SurveyJSONElement | null {
  const name = uniqueName(comp.key ?? sanitizePointer(sourcePtr), ctx);

  // text-family
  if (type in TEXT_INPUT_TYPE) {
    const el: SurveyJSONElement = { type: "text", name };
    const inputType = TEXT_INPUT_TYPE[type];
    if (inputType) el.inputType = inputType;
    return el;
  }

  switch(type) {
    case "textarea":
      return { type: "comment", name };
    case "checkbox":
      // A single Form.io checkbox is a boolean; `selectboxes` is the multi-select.
      return { type: "boolean", name };
    case "selectboxes": {
      const el: SurveyJSONElement = { type: "checkbox", name };
      const choices = readChoices(comp);
      if (choices) el.choices = choices;
      return el;
    }
    case "radio": {
      const el: SurveyJSONElement = { type: "radiogroup", name };
      const choices = readChoices(comp);
      if (choices) el.choices = choices;
      return el;
    }
    case "select": {
      const el: SurveyJSONElement = { type: comp.multiple ? "tagbox" : "dropdown", name };
      const choices = readChoices(comp);
      if (choices) el.choices = choices;
      return el;
    }
    case "file":
      return { type: "file", name };
    case "signature":
      return { type: "signaturepad", name };
    case "content":
    case "htmlelement":
      return { type: "html", name, html: comp.html ?? comp.content ?? "" };
    default:
      // Known to Form.io but unmapped -> our backlog; unknown -> drift alarm.
      if (isKnownFormioType(type)) {
        ctx.report.unsupported(FormioCodes.UNSUPPORTED_COMPONENT, sourcePtr, "");
      } else {
        ctx.report.unknown(FormioCodes.UNKNOWN_COMPONENT, sourcePtr, "");
      }
      return null;
  }
}

/** Apply `title`/`description`/validators/conditional/custom-logic to a leaf. */
function applyCommon(comp: FormioComponent, el: SurveyJSONElement, sourcePtr: string, targetPath: string, ctx: Ctx): void {
  if (comp.label !== undefined && el.type !== "html") el.title = comp.label;
  if (comp.description) el.description = comp.description;
  if (comp.placeholder && (el.type === "text" || el.type === "comment")) el.placeholder = comp.placeholder;
  let defaultValue = readDefaultValue(comp.defaultValue);
  if (comp.type === "selectboxes") defaultValue = readSelectboxesDefault(defaultValue);
  if (comp.multiple === true && isTextLike(comp.type)) {
    ctx.report.unsupported(FormioCodes.UNSUPPORTED_MULTIPLE, sourcePtr, targetPath);
    defaultValue = readSingleDefault(defaultValue);
  }
  if (defaultValue !== undefined) el.defaultValue = defaultValue;
  applyState(comp, el);

  if (comp.validate?.required) el.isRequired = true;
  const validators = readValidators(comp.validate);
  if (validators) el.validators = validators;

  // `validate.custom`: arbitrary JS -- refuse, content-free.
  if (typeof comp.validate?.custom === "string" && comp.validate.custom.trim().length > 0) {
    ctx.report.unsupported(FormioCodes.CUSTOM_VALIDATION, `${sourcePtr}/validate/custom`, targetPath);
  }

  // `customConditional`: arbitrary JS -- refuse, content-free.
  if (typeof comp.customConditional === "string" && comp.customConditional.trim().length > 0) {
    ctx.report.unsupported(FormioCodes.CUSTOM_CONDITIONAL, `${sourcePtr}/customConditional`, targetPath);
  } else {
    const visibleIf = readVisibleIf(comp, sourcePtr, targetPath, ctx);
    if (visibleIf) el.visibleIf = visibleIf;
  }
}

// Form.io writes `[null]` on a `multiple` number or currency field to mean "no default", and
// survey-core cannot load it. Null items are dropped and an array left empty gives no default;
// falsy values such as `0`, `false` and `""` inside an array stay.
function readDefaultValue(value: unknown): unknown {
  if (value === undefined || value === null || value === "") return undefined;
  if (!Array.isArray(value)) return value;
  const items = value.filter((item) => item !== null && item !== undefined);
  return items.length > 0 ? items : undefined;
}

// A `selectboxes` default is `{ a: true, b: false }`; the SurveyJS checkbox value is the array of
// checked keys, in the object's order. No checked key gives no default.
function readSelectboxesDefault(value: unknown): unknown {
  if (value === undefined || typeof value !== "object" || Array.isArray(value)) return value;
  const checked = Object.keys(value as object).filter((key) => (value as Record<string, unknown>)[key] === true);
  return checked.length > 0 ? checked : undefined;
}

function isTextLike(type: string | undefined): boolean {
  return type === "textarea" || (type !== undefined && Object.prototype.hasOwnProperty.call(TEXT_INPUT_TYPE, type));
}

// A text-like field keeps one input when Form.io allows several, so only a one-item default
// fits it. A longer one is dropped; the field's `multiple` report entry covers the loss.
function readSingleDefault(value: unknown): unknown {
  if (!Array.isArray(value)) return value;
  return value.length === 1 ? value[0] : undefined;
}

// `hidden` and `disabled` on any component that becomes an element or a page. In survey-core a
// `visibleIf` overrides `visible: false`, as a Form.io condition overrides `hidden`, so no guard
// for a condition is needed.
function applyState(comp: FormioComponent, el: SurveyJSONElement | SurveyJSONPage): void {
  if (comp.hidden === true) el.visible = false;
  if (comp.disabled === true) el.readOnly = true;
}

// The displayed title of a container. `label` is the builder's name for a component, so a panel
// shows `title`, a fieldset `legend`, and a layout container nothing. Other types keep `label`.
function readContainerTitle(comp: FormioComponent): string | undefined {
  switch(comp.type) {
    case "panel":
      return typeof comp.title === "string" ? comp.title : comp.label;
    case "fieldset":
      return typeof comp.legend === "string" ? comp.legend : undefined;
    case "container":
      return comp.hideLabel === true ? undefined : comp.label;
    case "columns":
    case "table":
    case "well":
    case "tabs":
      return undefined;
    default:
      return comp.label;
  }
}

/** Map a container component to a SurveyJS `panel`, recursing into its children. */
function mapPanel(
  comp: FormioComponent,
  sourcePtr: string,
  targetPath: string,
  ctx: Ctx,
  childrenOverride?: { child: FormioComponent, ptr: string }[]
): SurveyJSONElement {
  const name = uniqueName(comp.key ?? sanitizePointer(sourcePtr), ctx);
  const panel: SurveyJSONElement = { type: "panel", name };
  const title = readContainerTitle(comp);
  if (title !== undefined) panel.title = title;
  applyState(comp, panel);

  const children = childrenOverride ?? indexedChildren(comp.components, `${sourcePtr}/components`);
  const elements = walk(children, `${targetPath}.elements`, ctx);
  if (elements.length > 0) panel.elements = elements;
  return panel;
}

// A tab is `{ label, key, components }` with no `type`, so it cannot go through `mapComponent`.
// The `tabs` component becomes an untitled panel holding one panel per tab, titled with the
// tab's label, so the fields stay on one page (D2). A tab with no fields gives no element; its
// fields are walked before its name is taken, so an empty tab reserves no name.
function mapTabs(comp: FormioComponent, sourcePtr: string, targetPath: string, ctx: Ctx): SurveyJSONElement {
  const name = uniqueName(comp.key ?? sanitizePointer(sourcePtr), ctx);
  const panel: SurveyJSONElement = { type: "panel", name };
  applyState(comp, panel);

  const elements: SurveyJSONElement[] = [];
  (Array.isArray(comp.components) ? comp.components : []).forEach((tab, i) => {
    const tabPtr = `${sourcePtr}/components/${i}`;
    const tabPath = `${targetPath}.elements[${elements.length}]`;
    const children = walk(indexedChildren(tab?.components, `${tabPtr}/components`), `${tabPath}.elements`, ctx);
    if (children.length === 0) return;
    const tabPanel: SurveyJSONElement = { type: "panel", name: uniqueName(tab.key ?? sanitizePointer(tabPtr), ctx) };
    if (typeof tab.label === "string") tabPanel.title = tab.label;
    tabPanel.elements = children;
    elements.push(tabPanel);
  });
  if (elements.length > 0) panel.elements = elements;
  return panel;
}

/** Map `datagrid` / `editgrid` to a dynamic panel (settled decision, flagged assumed). */
function mapDataGrid(comp: FormioComponent, sourcePtr: string, targetPath: string, ctx: Ctx): SurveyJSONElement {
  const name = uniqueName(comp.key ?? sanitizePointer(sourcePtr), ctx);
  ctx.report.assumed(FormioCodes.ASSUMED_DATAGRID_MODEL, sourcePtr, targetPath);

  const panel: SurveyJSONElement = { type: "paneldynamic", name };
  if (comp.label !== undefined) panel.title = comp.label;
  applyState(comp, panel);

  const children = indexedChildren(comp.components, `${sourcePtr}/components`);
  const template = walk(children, `${targetPath}.templateElements`, ctx);
  if (template.length > 0) panel.templateElements = template;

  if (comp.validate?.required) panel.isRequired = true;
  return panel;
}

interface IndexedChild {
  child: FormioComponent;
  ptr: string;
}

function indexedChildren(components: FormioComponent[] | undefined, ptrPrefix: string): IndexedChild[] {
  if (!Array.isArray(components)) return [];
  return components.map((child, i) => ({ child, ptr: `${ptrPrefix}/${i}` }));
}

/** Flatten `columns` / `table` layout children into a single ordered list. */
function collectLayoutChildren(comp: FormioComponent, sourcePtr: string): IndexedChild[] {
  const out: IndexedChild[] = [];
  if (Array.isArray(comp.columns)) {
    comp.columns.forEach((col, ci) => {
      (col?.components ?? []).forEach((child, i) => out.push({ child, ptr: `${sourcePtr}/columns/${ci}/components/${i}` }));
    });
  }
  if (Array.isArray(comp.rows)) {
    comp.rows.forEach((row, ri) => {
      if (!Array.isArray(row)) return;
      row.forEach((cell, ci) => {
        const cellPtr = `${sourcePtr}/rows/${ri}/${ci}`;
        if (Array.isArray(cell)) {
          cell.forEach((child, i) => out.push({ child, ptr: `${cellPtr}/${i}` }));
        } else if (Array.isArray(cell?.components)) {
          cell.components.forEach((child, i) => out.push({ child, ptr: `${cellPtr}/components/${i}` }));
        }
      });
    });
  }
  if (Array.isArray(comp.components)) {
    comp.components.forEach((child, i) => out.push({ child, ptr: `${sourcePtr}/components/${i}` }));
  }
  return out;
}

/** Walk an indexed list of components into SurveyJS elements, dropping nulls. */
function walk(children: IndexedChild[], targetPath: string, ctx: Ctx): SurveyJSONElement[] {
  const elements: SurveyJSONElement[] = [];
  for (const { child, ptr } of children) {
    const el = mapComponent(child, ptr, `${targetPath}[${elements.length}]`, ctx);
    if (el) elements.push(el);
  }
  return elements;
}

/** A safe fallback element name derived from a JSON Pointer (e.g. `/components/2`). */
function sanitizePointer(ptr: string): string {
  // Join the alphanumeric runs rather than replacing separators and then trimming underscores:
  // a `/^_+|_+$/` trim backtracks quadratically on long underscore runs coming from library input.
  const cleaned = (ptr.match(/[a-zA-Z0-9]+/g) || []).join("_");
  return cleaned.length > 0 ? `element_${cleaned}` : "element";
}

/**
 * Convert a Form.io form definition to SurveyJS survey JSON.
 *
 * Never throws on an unsupported construct -- those are recorded in the report.
 * Throws `UnparseableInputError` / `WrongFormatError` only for input that is not
 * a Form.io form at all.
 */
export function convert(input: unknown): ConversionResult<SurveyJSON> {
  assertFormioForm(input);
  const report = new ReportBuilder(SOURCE);
  const ctx: Ctx = { report, usedNames: new Set<string>() };

  const topLevel = indexedChildren(input.components, "/components");
  const output: SurveyJSON = { pages: [] };
  if (typeof input.title === "string" && input.title.length > 0) output.title = input.title;

  if (input.display === "wizard") {
    // Each top-level container is promoted to a page; its children go directly
    // into the page (no double-wrapping panel).
    topLevel.forEach(({ child, ptr }, pageIndex) => {
      const page = wizardPage(child, ptr, pageIndex, ctx);
      output.pages!.push(page);
    });
  } else {
    // Plain form / pdf -> a single page.
    const elements = walk(topLevel, "pages[0].elements", ctx);
    output.pages!.push({ name: "page1", elements });
  }

  return { output, report: report.build() };
}

/** Promote a top-level wizard component to a SurveyJS page. */
function wizardPage(comp: FormioComponent, sourcePtr: string, pageIndex: number, ctx: Ctx): SurveyJSONPage {
  const targetPath = `pages[${pageIndex}]`;
  const name = uniqueName(comp.key ?? `page${pageIndex + 1}`, ctx);
  const page: SurveyJSONPage = { name, elements: [] };
  const title = readContainerTitle(comp);
  if (title !== undefined) page.title = title;

  // A wizard page is a container: its `components` become the page elements. A
  // non-container top-level component (rare) becomes the page's single element,
  // which carries the component's own state.
  const isContainer = typeof comp.type === "string" && (PANEL_CONTAINERS.has(comp.type) || comp.type === "panel");
  if (isContainer && Array.isArray(comp.components)) {
    applyState(comp, page);
    page.elements = walk(indexedChildren(comp.components, `${sourcePtr}/components`), `${targetPath}.elements`, ctx);
  } else {
    const el = mapComponent(comp, sourcePtr, `${targetPath}.elements[0]`, ctx);
    if (el) page.elements.push(el);
  }
  return page;
}

export { FormioCodes } from "./codes";
export type { ConversionResult } from "../report";
