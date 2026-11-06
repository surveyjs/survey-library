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
//   * `conditional` -> `visibleIf` (mechanical, no report entry), in all three
//     Form.io formats: legacy `{ show, when, eq }`, simple `{ show, conjunction,
//     conditions }`, and JSON logic `conditional.json`, translated where the
//     operators are provable; anything else -> `ASSUMED_CONDITIONAL`.
//
//   * `customConditional` / `validate.custom` are arbitrary JavaScript. We do
//     NOT parse, attempt, or eval them. Reported content-free (path + count,
//     never the JS source); the field still converts, only its custom logic is
//     dropped-with-an-alarm.

import { ConversionResult, ReportBuilder } from "../report";
import { UnparseableInputError, WrongFormatError } from "../errors";
import { SurveyJSON, SurveyJSONElement, SurveyJSONPage } from "../types";
import { formatLiteral } from "../expression";
import { SurveyOperator, surveyEquals, surveyHolds, surveyLiteral, surveyNumber } from "../survey-values";
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
  conditional?: FormioConditional;
  customConditional?: string; // arbitrary JS -- REFUSED
  data?: { values?: FormioChoice[], [key: string]: unknown };
  values?: FormioChoice[];
  components?: FormioComponent[]; // container/panel/grid children
  columns?: { components?: FormioComponent[] }[]; // `columns` layout
  rows?: FormioTableCell[][]; // `table` layout
  [key: string]: unknown;
}

// The three formats a Form.io `conditional` comes in: legacy `{ show, when, eq }`, simple
// `{ show, conjunction, conditions }`, and JSON logic `{ json }`.
interface FormioConditional {
  show?: unknown;
  when?: unknown;
  eq?: unknown;
  json?: unknown;
  conjunction?: unknown;
  conditions?: { component?: unknown, operator?: unknown, value?: unknown }[];
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
  currency: undefined, // plain text under a currency mask, see `applyCurrencyMask`
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

// An element or a page: what a condition can show or hide.
type Target = SurveyJSONElement | SurveyJSONPage;

interface Ctx {
  report: ReportBuilder;
  // The lower-cased names taken in the current name pool.
  usedNames: Set<string>;
  // The lower-cased keys of the fields of the current pool outside its nested forms, see
  // `collectFieldKeys`, and the names a field in a nested form avoids: those keys, inside one.
  fieldKeys: Set<string>;
  reservedNames?: Set<string>;
  // The keys of the data-nesting components around the walk, of every component around it, and
  // the data grids among them.
  dataPath: string[];
  fullPath: string[];
  grids: GridScope[];
  fields: FieldRecord[];
  conditions: ConditionRecord[];
  // The panels, data grids and pages around the walk, from the outermost in.
  containers: Target[];
  inputs: InputRecord[];
  // The targets that got a `visibleIf`, see `setVisibleIf`.
  conditionallyVisible: Set<Target>;
  templates: TemplateRecord[];
  // The selects whose URL interpolates form data, resolved after the walk like `templates`.
  urlSources: TemplateRecord[];
  // The selects from a URL whose response values Form.io casts, reported once the URL is resolved,
  // see `applyDataType`.
  castUrlValues: { el: SurveyJSONElement, sourcePtr: string, targetPath: string }[];
  // The radios and selects whose choice values were cast to their `dataType`, see `applyDataType`.
  valueTypes: Map<SurveyJSONElement, ValueType>;
  // The choices of the radios and selects with choices in the definition, see `ChoiceSet`.
  choiceSets: Map<SurveyJSONElement, ChoiceSet>;
  // The innermost nested `form` around the walk, see `FormRoot`.
  root?: FormRoot;
  // The elements of `hidden` components, which Form.io never shows, see `resolveConditions`.
  neverShown: Set<Target>;
  // Custom messages waiting for a `requiredIf`, see `applyRequiredMessages`. `sourcePtr` is set
  // when an unused message is reported.
  requiredMessages: { el: SurveyJSONElement, message: string, sourcePtr?: string, targetPath: string }[];
}

// The `dataType` a radio or select casts its values to, when the converter casts them too. `auto`,
// Form.io's default, casts each value that reads as a number or a boolean, see `formioCast`.
type ValueType = "number" | "boolean" | "auto";

// A choice value of a radio or select as the converted question stores it, and as Form.io stores
// it after its cast (see `formioCast`). The two differ where the converter keeps a value as
// written; conditions compare with both, see `matchEquality`.
interface ChoiceValue {
  stored: unknown;
  formio: unknown;
}

// The choices of a radio or select in the definition, with Form.io's empty value (`""`, `{}` for
// a select from JSON items whose first value is not a text, `[]` when multiple). `opaque` when a
// value is not a text, a number or a boolean: no comparison with a literal is modelled.
interface ChoiceSet {
  values: ChoiceValue[];
  empty: unknown;
  opaque: boolean;
}

// A data grid around a field or a condition, compared by identity: the chains of the two decide
// how a condition can name the field.
interface GridScope {
  dataPath: string;
}

// A nested `form` with inline components. Form.io renders it as a form of its own, whose data is
// `<key>.data` of the outer form: a reference inside it is a path in that data, and cannot name a
// field outside it. `dataPath` and `fullPath` are those of its data, as `FieldRecord` writes them.
interface FormRoot {
  dataPath: string;
  fullPath: string;
}

// A field as a condition can reference it. `dataPath` joins the keys of the components that nest
// data (`container`, `datagrid`, `editgrid`, and a nested `form` as `<key>.data`) with the field's
// own key; layout components add nothing. `fullPath` joins the keys of every component around the field, layout included, which
// Form.io also accepts. `grids` runs from the outermost grid in.
interface FieldRecord {
  key: string;
  dataPath: string;
  fullPath: string;
  name: string;
  type: string;
  multiple: boolean;
  grids: GridScope[];
  // The row values of a `survey` field whose columns show the value they hold (see `surveyRowValues`).
  rows?: string[];
  // The innermost nested `form` around the field, compared by identity, see `resolveReference`.
  root?: FormRoot;
  // A `day`, `time` or `datetime` component and the `inputType` of its question: condition
  // literals are read in its format, see `formatDateTimeLiteral`.
  dateTime?: { comp: FormioComponent, inputType: unknown };
  // The choices of a radio, a radio group or a select with choices in the definition.
  choices?: ChoiceSet;
  // What Form.io stores for any other field, when the converter knows it, see `formioStores`.
  stores?: StoredValues;
}

// What Form.io stores for a field with no choices in the definition: numbers, booleans, texts, or a
// mix of them. `text` tells which texts it keeps as written: a select casts a text that reads as a
// number or a boolean (see `formioCast`). `empty` holds Form.io's empty values, for which the
// converted question holds no value. `raw` is set when the converted question holds the source's
// own value, which may be a number or a boolean as its text. `items` is set for an array of such
// values, compared item by item.
interface StoredValues {
  number: boolean;
  boolean: boolean;
  text?: (value: string) => boolean;
  empty: unknown[];
  raw: boolean;
  items: boolean;
}

// An element that holds data, with the containers around it, for `applyClearOnHide`.
interface InputRecord {
  el: SurveyJSONElement;
  containers: Target[];
  // `clearOnHide: false`: Form.io keeps the value of the hidden field.
  keepsValue: boolean;
}

// An element whose `{{ ... }}` templates (in its HTML or its URL) are resolved after the walk, as
// conditions are.
interface TemplateRecord {
  el: SurveyJSONElement;
  sourcePtr: string;
  targetPath: string;
  grids: GridScope[];
  root?: FormRoot;
}

// A component with a conditional, `logic` entries, or both. A condition can name a field declared
// later, and a field's output name is only known after `uniqueName`, so conditions are resolved
// after the walk.
interface ConditionRecord {
  conditional?: FormioConditional;
  logic?: LogicRecord;
  target: Target;
  sourcePtr: string;
  targetPath: string;
  grids: GridScope[];
  root?: FormRoot;
}

// The `logic` entries of a component, with the state they change: an action maps only when it
// changes that state (see `translateLogicEntry`).
interface LogicRecord {
  entries: unknown[];
  hidden: boolean;
  disabled: boolean;
  required: boolean;
  // A `customConditional` also decides whether the component is hidden.
  customConditional: boolean;
  // `requiredIf` needs a question that holds a value; a panel, a page or an HTML element has no
  // required state in Form.io's sense.
  canRequire: boolean;
}

/** Read `data.values` (select) or `values` (radio/selectboxes) as SurveyJS choices. */
function readChoices(comp: FormioComponent): { value: unknown, text?: string }[] | undefined {
  return readItems(comp.data?.values ?? comp.values);
}

// Form.io `{ label, value }` items as SurveyJS `{ value, text }` items; an item with no value is
// skipped.
function readItems(raw: unknown): { value: unknown, text?: string }[] | undefined {
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

// --- conditions ---------------------------------------------------------------
//
// Form.io (`@formio/core` 2.9, `utils/conditions.ts`) checks the JSON, legacy and simple formats in
// that order, and each one that applies overwrites the result of the one before, so the last that
// applies decides. A condition that cannot be expressed exactly gives no `visibleIf` and an
// `ASSUMED_CONDITIONAL` entry: a field left visible is a safer loss than one that shows or hides
// at the wrong time, and a partial `and` or `or` would be exactly that.

function isJsonConditional(cond: FormioConditional): boolean {
  return !!cond.json && typeof cond.json === "object";
}
function isLegacyConditional(cond: FormioConditional): boolean {
  return !!cond.when;
}
function isSimpleConditional(cond: FormioConditional): boolean {
  return !!cond.conjunction && !!cond.conditions;
}

// `customConditional`, `calculateValue` and `customDefaultValue` hold arbitrary code and are
// refused, content-free: path and count, never the source. A conditional and the `logic` entries
// are recorded with their target and resolved after the walk; `mapsLogic` is false where an entry
// could not act on the target as a whole, and each entry is then refused. Called for leaves,
// panels, data grids, tabs and wizard pages.
function applyLogic(
  comp: FormioComponent,
  target: Target,
  sourcePtr: string,
  targetPath: string,
  ctx: Ctx,
  mapsLogic = true
): void {
  const entries = Array.isArray(comp.logic) ? comp.logic : [];
  if (!mapsLogic) reportLogicEntries(comp, sourcePtr, targetPath, ctx);
  reportCustomValues(comp, sourcePtr, targetPath, ctx);
  const customConditional = typeof comp.customConditional === "string" && comp.customConditional.trim().length > 0;
  if (customConditional) {
    ctx.report.unsupported(FormioCodes.CUSTOM_CONDITIONAL, `${sourcePtr}/customConditional`, targetPath);
  }
  const cond = comp.conditional;
  const conditional = !customConditional && !!cond && typeof cond === "object"
    && (isJsonConditional(cond) || isLegacyConditional(cond) || isSimpleConditional(cond)) ? cond : undefined;
  const logic: LogicRecord | undefined = mapsLogic && entries.length > 0 ? {
    entries,
    hidden: comp.hidden === true,
    disabled: comp.disabled === true,
    required: comp.validate?.required === true,
    customConditional,
    canRequire: typeof target.type === "string" && target.type !== "panel" && target.type !== "html"
  } : undefined;
  if (conditional || logic) {
    ctx.conditions.push({ conditional, logic, target, sourcePtr, targetPath, grids: [...ctx.grids], root: ctx.root });
  }
}

// Each `logic` entry of a component, refused: one that gives no element (a button, a layout container
// with no element in it), or whose entries could not act on its target as a whole.
function reportLogicEntries(comp: FormioComponent, sourcePtr: string, targetPath: string, ctx: Ctx): void {
  const entries = Array.isArray(comp.logic) ? comp.logic : [];
  entries.forEach((_, i) => ctx.report.unsupported(FormioCodes.CUSTOM_LOGIC, `${sourcePtr}/logic/${i}`, targetPath));
}

function reportCustomValues(comp: FormioComponent, sourcePtr: string, targetPath: string, ctx: Ctx): void {
  for (const key of ["calculateValue", "customDefaultValue"]) {
    if (holdsCode(comp[key])) ctx.report.unsupported(FormioCodes.CUSTOM_VALUE, `${sourcePtr}/${key}`, targetPath);
  }
}

// JavaScript as a string, or JSON logic as an object.
function holdsCode(value: unknown): boolean {
  if (typeof value === "string") return value.trim().length > 0;
  return !!value && typeof value === "object" && Object.keys(value).length > 0;
}

// The row values of a `survey` field, or `undefined` when a column's text is not its value: Form.io
// prints the selected value, and survey-core pipes the text of the selected column.
function surveyRowValues(comp: FormioComponent): string[] | undefined {
  const columns = readItems(comp.values) ?? [];
  if (columns.some((c) => c.text !== undefined && c.text !== String(c.value))) return undefined;
  return (readItems(comp.questions) ?? []).map((row) => String(row.value));
}

function recordField(comp: FormioComponent, name: string, ctx: Ctx, el?: SurveyJSONElement): void {
  if (typeof comp.key !== "string" || typeof comp.type !== "string") return;
  const field: FieldRecord = {
    key: comp.key,
    dataPath: [...ctx.dataPath, comp.key].join("."),
    fullPath: [...ctx.fullPath, comp.key].join("."),
    name,
    type: comp.type,
    multiple: comp.multiple === true,
    grids: [...ctx.grids],
    root: ctx.root
  };
  if (comp.type === "survey") field.rows = surveyRowValues(comp);
  if (el && (comp.type === "day" || comp.type === "time" || comp.type === "datetime")) field.dateTime = { comp, inputType: el.inputType };
  const choices = el && ctx.choiceSets.get(el);
  const stores = formioStores(comp);
  if (choices) field.choices = choices;
  else if (stores) field.stores = stores;
  ctx.fields.push(field);
}

// What Form.io stores for a component with no choices in the definition, or `undefined` when the
// converter cannot tell, and a condition that compares its value is refused. A number or currency
// field stores a number, and `null` when empty (`Component.emptyValue`); a checkbox stores a boolean;
// a text field stores its text, and "" when empty; `tags` stores an array of texts; a `hidden`
// component stores a number, a boolean or a text, and `null` when empty. A select from a
// URL stores the item's `valueProperty` cast to its `dataType` (`Select.normalizeSingleValue`), and
// "" when empty; with no `valueProperty` it stores the whole item, which is refused, as are other
// sources and an unknown `dataType`. A field that holds several values is refused too.
//
// An untouched checkbox holds `false` in Form.io and no value in survey-core, which is not modelled.
function formioStores(comp: FormioComponent): StoredValues | undefined {
  const type = comp.type as string;
  const single = comp.multiple !== true;
  const none = { number: false, boolean: false, empty: [] as unknown[], raw: false, items: false };
  if ((type === "number" || type === "currency") && single) return { ...none, number: true, empty: [null, undefined] };
  if (type === "checkbox" && comp.inputType !== "radio") return { ...none, boolean: true };
  if ((STRING_VALUED.has(type) || type === "textarea") && single) return { ...none, text: () => true, empty: [""] };
  if (type === "tags") return { ...none, text: () => true, items: true };
  // A `hidden` component holds whatever its default or the submission sets, and so does its question.
  if (type === "hidden" && single) return { ...none, number: true, boolean: true, text: () => true, empty: [null, undefined] };
  if (type !== "select" || comp.dataSrc !== "url" || typeof comp.valueProperty !== "string" || comp.valueProperty === "") {
    return undefined;
  }
  const dataType = comp.dataType === undefined || comp.dataType === "" ? "auto" : comp.dataType;
  if (dataType !== "auto" && dataType !== "number" && dataType !== "boolean" && dataType !== "string") return undefined;
  return {
    number: dataType === "auto" || dataType === "number",
    boolean: dataType === "auto" || dataType === "boolean",
    text: (value) => formioCast(value, dataType, "select") === value,
    empty: single ? [""] : [],
    raw: true,
    items: !single
  };
}

// An element that holds data. Its value is cleared when it is hidden, see `applyClearOnHide`.
function recordInput(comp: FormioComponent, el: SurveyJSONElement, ctx: Ctx): void {
  ctx.inputs.push({ el, containers: [...ctx.containers], keepsValue: comp.clearOnHide === false });
}

// Enter the scope of `comp` for the walk of its children: every component adds its key to the
// full path, a `container` and a data grid nest their fields' data under their key, a nested
// `form` under `<key>.data`, and a data grid opens a grid scope. A nested `form` also opens a
// data root, see `FormRoot`. `target` is the element or page the children go into, when a
// condition can hide it. Returns the exit.
function enterScope(comp: FormioComponent, ctx: Ctx, target?: Target): () => void {
  const isGrid = comp.type === "datagrid" || comp.type === "editgrid";
  const isForm = comp.type === "form";
  const nestsData = isGrid || isForm || comp.type === "container";
  const outerRoot = ctx.root;
  ctx.fullPath.push(comp.key ?? "");
  if (nestsData) ctx.dataPath.push(isForm ? `${comp.key ?? ""}.data` : comp.key ?? "");
  if (isGrid) ctx.grids.push({ dataPath: ctx.dataPath.join(".") });
  if (isForm) ctx.root = { dataPath: ctx.dataPath.join("."), fullPath: ctx.fullPath.join(".") };
  if (target) ctx.containers.push(target);
  return () => {
    ctx.fullPath.pop();
    if (nestsData) ctx.dataPath.pop();
    if (isGrid) ctx.grids.pop();
    ctx.root = outerRoot;
    if (target) ctx.containers.pop();
  };
}

// A `hidden` component is never shown, and a `visibleIf` would show it, so a condition that hides
// it, which in Form.io only decides whether its value is cleared, is reported instead.
function resolveConditions(ctx: Ctx): void {
  for (const record of ctx.conditions) {
    const visibleIfPath = `${record.targetPath}.visibleIf`;
    const neverShown = ctx.neverShown.has(record.target);
    const conditional: Translation = record.conditional ? translateConditional(record.conditional, record, ctx) : { assumed: [] };
    const logic = record.logic ? translateLogic(record, record.logic, ctx) : [];
    const hiding = logic.find((entry) => entry.visibleIf !== undefined);
    if (hiding && (conditional.expression !== undefined || conditional.assumed.length > 0)) {
      // Form.io combines the two in its own order: hidden logic wins over the condition, and logic
      // that shows the component cannot override it. Emitting either alone, or a combination,
      // would be a guess.
      const dropped = conditional.expression !== undefined ? [`${record.sourcePtr}/conditional`] : conditional.assumed;
      for (const ptr of [...dropped, hiding.ptr]) ctx.report.assumed(FormioCodes.ASSUMED_CONDITIONAL, ptr, visibleIfPath);
      logic.splice(logic.indexOf(hiding), 1);
    } else {
      // A converted condition on a `hidden` component is reported once, for the whole condition.
      const assumed = conditional.expression !== undefined && neverShown ? [`${record.sourcePtr}/conditional`] : conditional.assumed;
      if (conditional.expression !== undefined && !neverShown) setVisibleIf(record.target, conditional.expression, ctx);
      for (const ptr of assumed) ctx.report.assumed(FormioCodes.ASSUMED_CONDITIONAL, ptr, visibleIfPath);
    }
    for (const entry of logic) {
      if (entry.visibleIf && neverShown) ctx.report.assumed(FormioCodes.ASSUMED_CONDITIONAL, entry.ptr, visibleIfPath);
      else if (entry.visibleIf) setVisibleIf(record.target, entry.visibleIf.expression, ctx, entry.visibleIf.clears);
      if (entry.enableIf !== undefined) record.target.enableIf = entry.enableIf;
      if (entry.requiredIf !== undefined) record.target.requiredIf = entry.requiredIf;
    }
  }
}

// Every `visibleIf` the converter writes goes through here, a conditional's or one derived from
// another rule that hides the component, so that `applyClearOnHide` sees it. `clears` is false for
// a statically hidden component that a rule shows: Form.io hides it again by its own `hidden`, and
// keeps its value, so it stays statically hidden for `applyClearOnHide` (as an input, not as a
// container).
function setVisibleIf(target: Target, expression: string, ctx: Ctx, clears = true): void {
  target.visibleIf = expression;
  if (clears) ctx.conditionallyVisible.add(target);
}

// --- logic ----------------------------------------------------------------------
//
// Form.io (`Component.fieldLogic`) rebuilds a component from its definition on every check and
// applies the actions of each entry whose trigger fires, so a `property` action holds exactly
// while its trigger does, as a condition does. An entry maps when its trigger is `simple` or
// `json` and translates exactly, and every action sets `hidden`, `disabled` or `validate.required`
// to the state the component does not already have. Anything else is refused, with no partial
// output, under `CUSTOM_LOGIC`, content-free.

// The properties a mapped entry sets, written as survey-core conditions.
interface LogicTranslation {
  ptr: string;
  visibleIf?: { expression: string, clears: boolean };
  enableIf?: string;
  requiredIf?: string;
}

const LOGIC_PROPERTIES = new Set(["hidden", "disabled", "validate.required"]);

// The mapped entries of a component; each other entry is reported. An entry also stays unmapped
// when another entry sets one of its properties, as Form.io's result then depends on their order,
// and an action other than `property` or `value` may set any property.
function translateLogic(record: ConditionRecord, logic: LogicRecord, ctx: Ctx): LogicTranslation[] {
  const touched = logic.entries.map(touchedProperties);
  const mapped: LogicTranslation[] = [];
  logic.entries.forEach((entry, i) => {
    const ptr = `${record.sourcePtr}/logic/${i}`;
    const overlaps = touched[i].some((p) => (p === "hidden" && logic.customConditional)
      || touched.some((other, j) => j !== i && (other.includes(p) || other.includes("*"))));
    const translation = overlaps ? undefined : translateLogicEntry(entry, ptr, record, logic, ctx);
    if (translation) mapped.push(translation);
    else ctx.report.unsupported(FormioCodes.CUSTOM_LOGIC, ptr, record.targetPath);
  });
  return mapped;
}

// The component properties an entry's actions may change: `*` for any.
function touchedProperties(entry: unknown): string[] {
  const actions = isObject(entry) && Array.isArray(entry.actions) ? entry.actions : [];
  return actions.flatMap((action: unknown) => {
    if (isObject(action) && action.type === "value") return [];
    if (isObject(action) && action.type === "property" && isObject(action.property) && typeof action.property.value === "string") {
      return [action.property.value];
    }
    return ["*"];
  });
}

function translateLogicEntry(
  entry: unknown,
  ptr: string,
  record: ConditionRecord,
  logic: LogicRecord,
  ctx: Ctx
): LogicTranslation | undefined {
  if (!isObject(entry) || !Array.isArray(entry.actions) || entry.actions.length === 0) return undefined;
  const states = new Map<string, boolean>();
  for (const action of entry.actions) {
    if (!isObject(action) || action.type !== "property" || !isObject(action.property)) return undefined;
    const property = action.property.value;
    // `setActionProperty` sets a boolean property to `String(state) === "true"`.
    if (action.property.type !== "boolean" || typeof property !== "string" || !LOGIC_PROPERTIES.has(property)) return undefined;
    if (action.state !== true && action.state !== false && action.state !== "true" && action.state !== "false") return undefined;
    if (states.has(property)) return undefined;
    states.set(property, String(action.state) === "true");
  }
  const cond = translateTrigger(entry.trigger, record, ctx);
  if (cond === undefined) return undefined;

  const result: LogicTranslation = { ptr };
  for (const [property, state] of states) {
    if (property === "hidden") {
      if (state === logic.hidden) return undefined;
      // Hidden by logic, Form.io clears the value; shown by logic, it is hidden by its own `hidden`.
      result.visibleIf = state ? { expression: `!(${cond})`, clears: true } : { expression: cond, clears: false };
    } else if (property === "disabled") {
      if (!state || logic.disabled) return undefined;
      result.enableIf = `!(${cond})`;
    } else {
      if (!state || logic.required || !logic.canRequire) return undefined;
      result.requiredIf = cond;
    }
  }
  return result;
}

// Form.io's `checkTrigger`: a `simple` trigger is a legacy `{ show, when, eq }` or a simple
// `{ show, conjunction, conditions }` condition, and a `json` trigger is JSON logic. A simple
// trigger with no conditions always fires, and a condition in it with no component counts as true,
// so neither is a condition SurveyJS needs, and both stay unmapped. So does a translation with a
// part whose semantics differ.
function translateTrigger(trigger: unknown, record: ConditionRecord, ctx: Ctx): string | undefined {
  if (!isObject(trigger)) return undefined;
  if (trigger.type === "json") return translateJsonLogic(trigger.json, record, ctx);
  if (trigger.type !== "simple" || !isObject(trigger.simple)) return undefined;
  const cond = trigger.simple as FormioConditional;
  let translation: Translation;
  if (isLegacyConditional(cond)) {
    translation = translateLegacy(cond, record, "", ctx);
  } else {
    const conditions = Array.isArray(cond.conditions) ? cond.conditions : [];
    if (conditions.length === 0 || conditions.some((c) => !c || !c.component)) return undefined;
    translation = translateSimple(cond, record, "", ctx);
  }
  return translation.assumed.length === 0 ? translation.expression : undefined;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

// The chain of an input is the input and the containers around it. survey-core's default setting
// (`clearInvisibleValues: "onComplete"`) drops the value of every question that is invisible at
// completion, so each input that can be invisible gets the setting that matches Form.io:
//
// * `onHiddenContainer` when Form.io's server clears it: a converted condition or hiding logic
//   (a `visibleIf` that clears) is in its chain, the input does not set `clearOnHide: false`, and
//   nothing in its chain is statically hidden. `onHiddenContainer` clears it when the question or
//   a panel or page around it hides, for any reason.
// * `none` when Form.io keeps it:
//   - an input with `clearOnHide: false` whose chain holds any `visibleIf` or `visible: false`;
//   - an input whose chain is statically hidden, that is `visible: false` without a `visibleIf`
//     that clears: a static `hidden`, or, on the input itself, one that logic only shows. Form.io
//     keeps the values a static `hidden` hides. Any other setting drops them at completion, and
//     `onHiddenContainer` drops a default value at load as well. The trade-off: where a condition
//     in that chain hides the input, the Form.io server clears its value, and the converted survey
//     keeps it.
//   - a `hidden` component, always. It is never shown, so any other setting would drop its value at
//     completion, and `onHiddenContainer` would also drop its default at load. The trade-off: when
//     a condition hides a container around it, the Form.io server clears its value, and the
//     converted survey keeps it.
//   - an input in a container that logic only shows, with no converted condition anywhere in its
//     chain.
// * nothing for an input that can never be invisible, so ordinary forms are unchanged.
//
// A container that logic only shows is not hidden statically for the inputs in it: Form.io's
// logic sets its `hidden` to false, and the server then clears an input that a converted condition
// anywhere in its chain hides, inside or outside that container. The trade-off: while the container
// is hidden by its own `hidden`, such an input loses its value, which Form.io keeps.
function applyClearOnHide(ctx: Ctx): void {
  for (const input of ctx.inputs) {
    const chain = [input.el, ...input.containers];
    const hiddenStatically = chain.some((t) => t.visible === false && !ctx.conditionallyVisible.has(t)
      && (t === input.el || t.visibleIf === undefined));
    const canHide = chain.some((t) => t.visibleIf !== undefined || t.visible === false);
    if (ctx.neverShown.has(input.el) || hiddenStatically) {
      input.el.clearIfInvisible = "none";
    } else if (input.keepsValue) {
      if (canHide) input.el.clearIfInvisible = "none";
    } else if (chain.some((t) => ctx.conditionallyVisible.has(t))) {
      input.el.clearIfInvisible = "onHiddenContainer";
    } else if (canHide) {
      input.el.clearIfInvisible = "none";
    }
  }
}

interface Translation {
  expression?: string;
  // Pointers to the parts reported `assumed`: the parts that could not be expressed when there is
  // no expression, or the parts whose semantics differ when there is one.
  assumed: string[];
}

// In the order of the renderer's `checkCondition`: a legacy `when` first, then the simple format
// when one of its conditions names a component and an operator, then JSON logic. With none of
// them the component shows.
function translateConditional(cond: FormioConditional, record: ConditionRecord, ctx: Ctx): Translation {
  const ptr = `${record.sourcePtr}/conditional`;
  if (isLegacyConditional(cond)) return translateLegacy(cond, record, `${ptr}/when`, ctx);
  if (isSimpleConditional(cond) && Array.isArray(cond.conditions) && cond.conditions.some((c) => !!c && !!c.component && !!c.operator)) {
    return translateSimple(cond, record, ptr, ctx);
  }
  if (!isJsonConditional(cond)) return { assumed: [] };
  const expression = translateJsonLogic(cond.json, record, ctx);
  return expression !== undefined ? { expression, assumed: [] } : { assumed: [`${ptr}/json`] };
}

// Form.io's `convertShowToBoolean`: a string goes through `JSON.parse`, and the result is cast to a
// boolean. Only an absent `show` defaults to true, so `null` and `""` mean "hide when true".
function readSimpleShow(show: unknown): boolean {
  if (show === undefined) return true;
  if (typeof show === "string") {
    try {
      return !!JSON.parse(show);
    } catch{
      return !!show;
    }
  }
  return !!show;
}

function translateSimple(cond: FormioConditional, record: ConditionRecord, ptr: string, ctx: Ctx): Translation {
  const conditions = Array.isArray(cond.conditions) ? cond.conditions : [];
  // Form.io treats an empty list as no condition at all.
  if (conditions.length === 0) return { assumed: [] };
  const any = cond.conjunction === "any";
  const show = readSimpleShow(cond.show);
  if (any && conditions.some((c) => !c || !c.component)) {
    // The renderer's `checkSimpleConditional` counts a condition with no component as true, so
    // under `any` the result is true whatever the others hold. The component hides for good when
    // `show` is false, and the renderer checks the condition at all (`hasCondition`) only when
    // `show` is a boolean or truthy. (`@formio/core` ignores such a condition instead.)
    const hides = !show && (typeof cond.show === "boolean" || !!cond.show);
    return { expression: hides ? "false" : undefined, assumed: [] };
  }
  const parts: string[] = [];
  const failed: string[] = [];
  const assumed: string[] = [];
  conditions.forEach((c, i) => {
    // Under `all`, a condition with no component, true for the renderer, changes nothing.
    if (!c || !c.component) return;
    const part = translateOperator(c, record, ctx);
    if (part.expression === undefined) failed.push(`${ptr}/conditions/${i}`);
    else parts.push(part.expression);
    if (part.assumed) assumed.push(`${ptr}/conditions/${i}`);
  });
  if (failed.length > 0) return { assumed: failed };
  // Not reached: `translateConditional` and `translateTrigger` pass a condition that names a component.
  if (parts.length === 0) return { assumed };
  const joined = `(${parts.join(any ? " or " : " and ")})`;
  // `!` and not `not`: survey-core reads `not ({a} = 1)` as true when `a` is 1.
  return { expression: show ? joined : `!${joined}`, assumed };
}

// One simple condition. `assumed` marks an operator whose semantics differ: Form.io compares
// dates as moments, survey-core as values.
function translateOperator(
  c: { component?: unknown, operator?: unknown, value?: unknown },
  record: ConditionRecord,
  ctx: Ctx
): { expression?: string, assumed?: boolean } {
  const ref = resolveReference(c.component, record, ctx);
  if (!ref) return {};
  const target = ref.field;
  if (c.operator === "isEmpty") return { expression: `${ref.text} empty` };
  if (c.operator === "isNotEmpty") return { expression: `${ref.text} notempty` };
  const lit = simpleLiteral(c.operator, c.value, target);
  if (lit === undefined) return {};
  // Only an equality gives a constant.
  if (lit === NEVER_EQUAL) return { expression: equalityExpression(ref.text, c.operator === "isNotEqual", lit) };
  // A `selectboxes` value is `{ a: true }` in Form.io; `isEqual` reads the checked state of the
  // compared key, and `includes` looks at the object's values, which never match.
  const isSelectboxes = target.type === "selectboxes";
  switch(c.operator) {
    case "isEqual":
      if (isSelectboxes) return { expression: `${ref.text} contains ${lit}` };
      return isArrayValued(target) ? {} : { expression: `${ref.text} = ${lit}` };
    case "isNotEqual":
      if (isSelectboxes) return { expression: `${ref.text} notcontains ${lit}` };
      return isArrayValued(target) ? {} : { expression: `${ref.text} <> ${lit}` };
    case "lessThan":
      return { expression: `${ref.text} < ${lit}` };
    case "lessThanOrEqual":
      return { expression: `${ref.text} <= ${lit}` };
    case "greaterThan":
      return { expression: `${ref.text} > ${lit}` };
    case "greaterThanOrEqual":
      return { expression: `${ref.text} >= ${lit}` };
    case "includes":
      return isSelectboxes ? {} : { expression: `${ref.text} contains ${lit}` };
    case "notIncludes":
      return isSelectboxes ? {} : { expression: `${ref.text} notcontains ${lit}` };
    case "dateGreaterThan":
      return { expression: `${ref.text} > ${lit}`, assumed: true };
    case "dateGreaterThanOrEqual":
      return { expression: `${ref.text} >= ${lit}`, assumed: true };
    case "dateLessThan":
      return { expression: `${ref.text} < ${lit}`, assumed: true };
    case "dateLessThanOrEqual":
      return { expression: `${ref.text} <= ${lit}`, assumed: true };
    case "isDateEqual":
      return { expression: `${ref.text} = ${lit}`, assumed: true };
    case "isNotDateEqual":
      return { expression: `${ref.text} <> ${lit}`, assumed: true };
    default:
      // `startsWith`, `endsWith` and unknown operators have no survey-core equivalent (D3).
      return {};
  }
}

const ORDER_OPERATORS = new Set(["lessThan", "lessThanOrEqual", "greaterThan", "greaterThanOrEqual"]);
const DATE_OPERATORS = new Set(["dateGreaterThan", "dateGreaterThanOrEqual", "dateLessThan", "dateLessThanOrEqual", "isDateEqual", "isNotDateEqual"]);

// The literal a simple condition compares its field with, or `undefined` when the comparison has no
// exact equivalent. A `day`, `time` or `datetime` holds text, which Form.io's `lessThan` and its
// kin never hold for (they need a number) and `includes` reads in Form.io's format, so only the
// equality and date operators are kept. A `selectboxes` equality names one of its keys (see
// `translateOperator`). Every other field is matched by what Form.io stores in it (see
// `fieldWitnesses`).
function simpleLiteral(operator: unknown, value: unknown, field: FieldRecord): string | typeof NEVER_EQUAL | undefined {
  const op = String(operator);
  const isEquality = op === "isEqual" || op === "isNotEqual";
  if (field.dateTime) {
    if (DATE_OPERATORS.has(op)) return formatDateTimeLiteral(value, field, true);
    return isEquality ? formatDateTimeLiteral(value, field, false) : undefined;
  }
  if (field.type === "selectboxes") return isEquality && isPrimitive(value) ? formatLiteral(value) : undefined;
  if (isEquality) return matchEquality(value, field, "isEqual");
  if (ORDER_OPERATORS.has(op)) return matchOrder(value, field, op);
  if (op === "includes" || op === "notIncludes") return matchIncludes(value, field, op);
  return undefined;
}

// Form.io's comparisons of a stored value with a condition's literal: `isEqual` is the simple
// operator (`IsEqualTo`), which reads a string compared with a value of another type as JSON first;
// `legacy` compares the two as text; `loose` and `strict` are JSON logic's `==` and `===`.
type Comparison = "isEqual" | "legacy" | "loose" | "strict";

function formioEquals(value: unknown, literal: unknown, comparison: Comparison): boolean {
  if (comparison === "legacy") return String(value) === String(literal);
  // eslint-disable-next-line eqeqeq
  if (comparison === "loose") return value == literal;
  if (comparison === "strict") return value === literal;
  let compared = literal;
  // The parse is skipped for a falsy value other than `false`, such as 0 or "".
  if ((value || value === false) && literal && typeof value !== typeof literal && typeof literal === "string") {
    try {
      compared = JSON.parse(literal);
    } catch{
      // kept as written
    }
  }
  return isSameValue(compared, value);
}

// `_.isEqual` on the values a choice or a literal can hold: NaN equals NaN, and `{}` equals `{}`.
function isSameValue(a: unknown, b: unknown): boolean {
  if (a === b || (Number.isNaN(a) && Number.isNaN(b))) return true;
  const isEmptyObject = (v: unknown) => isObject(v) && Object.getPrototypeOf(v) === Object.prototype && Object.keys(v).length === 0;
  return isEmptyObject(a) && isEmptyObject(b);
}

// A value Form.io may hold for a field, with the values the converted question may hold then
// (`undefined` for no value).
interface Witness {
  formio: unknown;
  survey: unknown[];
}

// The values to check a literal against, or `undefined` when what Form.io stores is not known. A
// radio or select with choices gives its choices, and its empty value unless it holds several. Any
// other field gives the values that decide a comparison with `seed`, the condition's literal: its
// empty values; for numbers, every reading of the literal as a number (`Number`, `parseFloat`,
// `parseInt`, survey-core's), and the numbers next to them, so that an order is checked on both sides;
// both booleans; and for texts, the literal's own text, a longer text that contains it, the texts of
// those numbers and booleans, and "0", "1", "true" and "false", which survey-core reads as numbers
// and booleans, each where Form.io keeps it as written. Texts that differ from the literal only in
// case, in surrounding spaces, or in how they write a number are not checked: survey-core reads them
// as equal, so checking them would refuse every condition on a text field.
function fieldWitnesses(field: FieldRecord, seed: unknown): Witness[] | undefined {
  if (field.choices) {
    const set = field.choices;
    if (set.opaque) return undefined;
    const choices = set.values.map((c) => ({ formio: c.formio, survey: [c.stored] }));
    return field.multiple ? choices : [...choices, { formio: set.empty, survey: [undefined] }];
  }
  const stores = field.stores;
  if (!stores) return undefined;
  const witnesses: Witness[] = stores.empty.map((formio) => ({ formio, survey: [undefined] }));
  const texts = seed === null || seed === undefined ? [] : [String(seed), `#${String(seed)}`];
  if (stores.number) {
    const numbers = new Set([0, 1, -1, 2, 0.5, -0.5]);
    for (const n of numberReadings(seed)) for (const step of [0, 1, -1, 0.5, -0.5]) numbers.add(n + step);
    for (const n of numbers) {
      if (!Number.isFinite(n)) continue;
      witnesses.push({ formio: n, survey: stores.raw ? [n, String(n)] : [n] });
      texts.push(String(n));
    }
  }
  if (stores.boolean) {
    for (const b of [true, false]) witnesses.push({ formio: b, survey: stores.raw ? [b, String(b), String(b).toUpperCase()] : [b] });
    texts.push("true", "false");
  }
  // The texts of those numbers and booleans too, where Form.io keeps such a text as written, and texts
  // survey-core reads as 0, 1 or a boolean. A source value that is a number or a boolean may reach
  // the question as that value, where Form.io keeps its text.
  const keepsText = stores.text;
  if (keepsText) {
    for (const t of new Set([...texts, "0", "1", "true", "false"])) {
      if (t === "" || !keepsText(t)) continue;
      const survey: unknown[] = [t];
      if (stores.raw && t === String(Number(t))) survey.push(Number(t));
      if (stores.raw && (t === "true" || t === "false")) survey.push(t === "true");
      witnesses.push({ formio: t, survey });
    }
  }
  return witnesses;
}

function numberReadings(value: unknown): number[] {
  if (typeof value === "number") return [value];
  if (typeof value === "boolean" || value === null) return [Number(value)];
  if (typeof value !== "string") return [];
  return [Number(value), parseFloat(value), parseInt(value), surveyNumber(value)];
}

// Whether the field's value is an array compared item by item: a multiple select, or `tags`.
function holdsItems(field: FieldRecord): boolean {
  return isArrayValued(field) && field.type !== "selectboxes";
}

// The first of `candidates` whose literal makes survey-core's `op` hold for exactly the witnesses
// Form.io's comparison holds for. With `items`, a witness is one item of an array, and `op` is
// `contains`; Form.io's comparison holds for an array when it holds for one of its items, and so does
// survey-core's `contains`.
function agreeingLiteral(
  witnesses: Witness[],
  candidates: unknown[],
  op: SurveyOperator,
  formio: (value: unknown) => boolean,
  items: boolean
): string | undefined {
  for (const candidate of candidates) {
    const literal = isPrimitive(candidate) ? formatLiteral(candidate) : undefined;
    if (literal === undefined) continue;
    const read = surveyLiteral(candidate);
    const holds = (value: unknown) => surveyHolds(op, items && value !== undefined ? [value] : value, read);
    if (witnesses.every((w) => w.survey.every((value) => holds(value) === formio(w.formio)))) return literal;
  }
  return undefined;
}

// What `matchEquality` gives when Form.io's equality holds for none of the values the field may hold:
// the comparison is constant, and is written as `false` (`true` for `<>`) rather than as a literal
// the linter reads as a type mismatch.
const NEVER_EQUAL = Symbol("never equal");

// `ref = lit` or `ref <> lit`; a literal that never matches gives the constant.
function equalityExpression(ref: string, notEqual: boolean, lit: string | typeof NEVER_EQUAL): string {
  if (lit === NEVER_EQUAL) return notEqual ? "true" : "false";
  return `${ref} ${notEqual ? "<>" : "="} ${lit}`;
}

// The literal an equality compares with, so that survey-core's `=` (or `contains`, on an array) holds
// for exactly the values Form.io's comparison holds for. The candidates are the values the question
// stores where Form.io's comparison holds, and the literal as written. For example survey-core reads
// "1.0", "01" and 1 as one number, "TRUE" as true, and "10,000" as 10, where Form.io's legacy check
// compares texts, and its simple check parses "05" as no JSON at all. A legacy literal that Form.io
// does not read as an item of an array is refused before this (see `misreadsArray`).
function matchEquality(value: unknown, field: FieldRecord, comparison: Comparison): string | typeof NEVER_EQUAL | undefined {
  const witnesses = isPrimitive(value) ? fieldWitnesses(field, value) : undefined;
  if (!witnesses) return undefined;
  const formio = (v: unknown) => formioEquals(v, value, comparison);
  let candidates = [...witnesses.filter((w) => w.survey[0] !== undefined && formio(w.formio)).map((w) => w.survey[0]), value];
  // A checkbox is compared with a boolean only: survey-core's linter reports a text compared with a
  // boolean question as a condition that cannot hold.
  if (field.type === "checkbox") candidates = candidates.filter((c) => typeof c === "boolean");
  const items = holdsItems(field);
  const literal = agreeingLiteral(witnesses, candidates, items ? "contains" : "=", formio, items);
  // The literal agrees with every value checked, and Form.io holds for none of them. A field with
  // choices may hold a value outside them (a default, prefilled data), so only a field whose type
  // excludes the literal gives the constant.
  if (literal !== undefined && !items && !field.choices && witnesses.every((w) => !formio(w.formio))) return NEVER_EQUAL;
  return literal;
}

// `lessThan`, `greaterThan` and their `OrEqual` forms. Form.io holds them only for a number:
// `_.isNumber(value) && (value < literal || _.isEqual(value, literal))`. survey-core holds `<` for two
// set values by JavaScript's `<` on its reading of the question's value, and `<=` also when `=`
// holds. The literal is written as compared, or as a number when it is a numeric text, and kept only
// when survey-core holds for the same values: a value Form.io keeps as text, such as "1.0" with
// `dataType: "number"`, is a number to survey-core. A field that may hold any text is refused, as
// survey-core orders a text that reads as a number, and so is an array.
function matchOrder(value: unknown, field: FieldRecord, operator: string): string | undefined {
  if (holdsItems(field) || field.stores?.text || !isPrimitive(value) || value === null || value === "") return undefined;
  const witnesses = fieldWitnesses(field, value);
  if (!witnesses) return undefined;
  const less = operator.startsWith("less");
  const orEqual = operator.endsWith("OrEqual");
  const formio = (v: unknown) => typeof v === "number"
    && ((less ? v < (value as number) : v > (value as number)) || (orEqual && isSameValue(v, value)));
  const op: SurveyOperator = less ? (orEqual ? "<=" : "<") : (orEqual ? ">=" : ">");
  const candidates = typeof value === "string" && !Number.isNaN(surveyNumber(value)) ? [value, surveyNumber(value)] : [value];
  return agreeingLiteral(witnesses, candidates, op, formio, false);
}

// `includes` and `notIncludes`: Form.io's `_.includes(value, literal)` holds for a text that contains
// the literal's text, and never for a number or a boolean; on an array, Form.io holds when it holds
// for one of its items. survey-core's `contains` reads a text without regard to case, and the items
// of an array as equal or not, so an array is matched only with its choices, and `notIncludes`, which
// holds in Form.io when one item does not contain the literal, is refused on it.
function matchIncludes(value: unknown, field: FieldRecord, operator: string): string | undefined {
  const items = holdsItems(field);
  if (!isPrimitive(value) || value === null || (items && (operator === "notIncludes" || !field.choices))) return undefined;
  const witnesses = fieldWitnesses(field, value);
  if (!witnesses) return undefined;
  const includes = (v: unknown) => typeof v === "string" && v.indexOf(String(value)) > -1;
  const formio = operator === "includes" ? includes : (v: unknown) => !includes(v);
  return agreeingLiteral(witnesses, [value], operator === "includes" || items ? "contains" : "notcontains", formio, items);
}

// The literal a condition on a `day`, `time` or `datetime` compares with, as the ISO text its input
// stores, or `undefined` when no literal compares exactly. Form.io stores a day as `MM/DD/YYYY`
// (`DD/MM/YYYY` with `dayFirst`), padded (`Day.getDate`); a time in its `dataFormat`, `HH:mm:ss` by
// default (`Time.getStringAsValue`); a datetime as an instant in the viewer's zone. An equality
// compares that text, so only a literal Form.io can store matches. The date operators
// (`DateGreaterThan`) read both sides as moments, a day in its own format, so any literal that
// parses does; a time does not parse as a moment, and a datetime literal in a zone, compared with a
// local value, gives another result in every zone. A day with a hidden part, or read in the
// viewer's locale, and seconds the input cannot hold, give no literal.
function formatDateTimeLiteral(value: unknown, field: FieldRecord, asMoment: boolean): string | undefined {
  if (typeof value !== "string" || !field.dateTime) return undefined;
  const { comp, inputType } = field.dateTime;
  // Form.io's empty value is "", which survey-core's `= ''` holds for too.
  if (value === "" && !asMoment) return formatLiteral(value);
  const text = asMoment ? value.trim() : value;
  if (field.type === "day") {
    const parts = isObject(comp.fields) ? comp.fields : {};
    if (["day", "month", "year"].some((part) => {
      const settings = parts[part];
      return isObject(settings) && settings.hide === true;
    })) return undefined;
    if (asMoment && comp.useLocaleSettings === true) return undefined;
    const iso = parseDateTime(comp, text);
    if (iso === undefined) return undefined;
    const [year, month, day] = iso.split("-");
    if (!asMoment && text !== (comp.dayFirst === true ? `${day}/${month}/${year}` : `${month}/${day}/${year}`)) return undefined;
    return formatLiteral(iso);
  }
  if (field.type === "time") {
    const dataFormat = comp.dataFormat === undefined ? "HH:mm:ss" : comp.dataFormat;
    if (asMoment || (dataFormat !== "HH:mm:ss" && dataFormat !== "HH:mm")) return undefined;
    const iso = parseDateTime(comp, text);
    return iso !== undefined && text === (dataFormat === "HH:mm" ? iso : `${iso}:00`) ? formatLiteral(iso) : undefined;
  }
  if (!asMoment) return undefined;
  const seconds = /:\d{2}:(\d{2}(?:\.\d+)?)$/.exec(text);
  if (seconds && Number(seconds[1]) !== 0) return undefined;
  const iso = parseDateTime(comp, text);
  if (iso === undefined) return undefined;
  if (inputType === "date") return iso.endsWith("T00:00") ? formatLiteral(iso.slice(0, "YYYY-MM-DD".length)) : undefined;
  return inputType === "datetime-local" ? formatLiteral(iso) : undefined;
}

// Form.io's legacy check: `(String(value) === String(eq)) === (String(show) === "true")`. An array
// value, and a `selectboxes` object, compare by membership instead.
function translateLegacy(cond: FormioConditional, record: ConditionRecord, ptr: string, ctx: Ctx): Translation {
  const ref = resolveReference(cond.when, record, ctx);
  if (!ref) return { assumed: [ptr] };
  const show = String(cond.show) === "true";
  if (isArrayValued(ref.field)) {
    // A `selectboxes` key is compared with `show` as a string, so a `show` other than "true" or
    // "false" never matches and hides the field whatever is checked.
    if (ref.field.type === "selectboxes" && !show && String(cond.show) !== "false") return { assumed: [ptr] };
    if (ref.field.type !== "selectboxes" && misreadsArray(cond.eq)) return { assumed: [ptr] };
    const lit = formatTypedLiteral(cond.eq, ref.field, "legacy");
    if (lit === undefined || lit === NEVER_EQUAL) return { assumed: [ptr] };
    return { expression: `${ref.text} ${show ? "contains" : "notcontains"} ${lit}`, assumed: [] };
  }
  const lit = formatTypedLiteral(cond.eq, ref.field, "legacy");
  if (lit === undefined) return { assumed: [ptr] };
  return { expression: equalityExpression(ref.text, !show, lit), assumed: [] };
}

// Whether Form.io's legacy check reads an array value (a multiple select, `tags`) with `eq` other
// than by membership. It reads the array as an object first, `isObject(value) && has(value, eq)`,
// and then compares the item at `eq` with `show`. lodash's `has` holds only when the first key of
// the path is an own key of the array, an index or `length`: "length", "0", and paths such as
// "0.0", "[0]" or "0[0]" when the item there has the next key, as a text does. Last, it compares the
// array's text, its items joined with commas, so an empty `eq` or one with a comma can hold for a
// value no membership describes.
function misreadsArray(eq: unknown): boolean {
  const text = String(eq);
  if (text === "" || text.includes(",")) return true;
  const key = typeof eq === "string" ? lodashFirstKey(eq) : text;
  return key === "length" || /^(0|[1-9]\d*)$/.test(key);
}

// The first key of a lodash path (`castPath`): a text that `isKey` accepts is one key; any other is
// split by `stringToPath`, where a leading "." gives an empty key, and a key is a run of characters
// other than ".", "[" and "]", or a bracketed number or quoted text. A path with no key gives "",
// which `has` holds for on no array either.
function lodashFirstKey(path: string): string {
  const isDeep = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
  if (/^\w*$/.test(path) || !isDeep.test(path)) return path;
  if (path.charCodeAt(0) === 46) return "";
  const m = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/.exec(path);
  if (!m) return "";
  if (m[2]) return m[3].replace(/\\(\\)?/g, "$1");
  return m[1] || m[0];
}

// The provable subset of Form.io JSON logic: `==` and `!=` between a `var` and a literal, a bare
// `var` read for its truthiness, `!` and `!!`, and `and` and `or` of those. Anything else gives
// `undefined`, and the caller reports it.
function translateJsonLogic(node: unknown, record: ConditionRecord, ctx: Ctx): string | undefined {
  if (node === null || typeof node !== "object" || Array.isArray(node)) return undefined;
  const obj = node as Record<string, unknown>;
  const keys = Object.keys(obj);
  if (keys.length !== 1) return undefined;
  const op = keys[0];
  if (op === "var") return translateTruthiness(readJsonLogicVar(obj), record, ctx);
  if (op === "!" || op === "!!") {
    // JSON logic reads a single argument as a one-item list, and `!` and `!!` use the first.
    const arg = Array.isArray(obj[op]) ? obj[op] as unknown[] : [obj[op]];
    if (arg.length !== 1) return undefined;
    const inner = translateJsonLogic(arg[0], record, ctx);
    if (inner === undefined) return undefined;
    // `!` and not `not`: survey-core reads `not ({a} = 1)` as true when `a` is 1.
    return op === "!" ? `!(${inner})` : inner;
  }
  const args = obj[op];
  if (!Array.isArray(args)) return undefined;

  if ((op === "==" || op === "===" || op === "!=" || op === "!==") && args.length === 2) {
    const varIndex = readJsonLogicVar(args[0]) !== undefined ? 0 : 1;
    const ref = resolveReference(readJsonLogicVar(args[varIndex]), record, ctx, true);
    if (!ref || isArrayValued(ref.field)) return undefined;
    // The literal is matched by what Form.io stores in the field: a number never strictly equals a
    // string, and a boolean loosely equals "1" but not "true" (`true == "true"` is false).
    const lit = formatTypedLiteral(args[1 - varIndex], ref.field, op === "===" || op === "!==" ? "strict" : "loose");
    if (lit === undefined) return undefined;
    return equalityExpression(ref.text, op.startsWith("!"), lit);
  }
  if ((op === "and" || op === "or") && args.length >= 2) {
    const parts = args.map((a) => translateJsonLogic(a, record, ctx));
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

// Form.io types whose value is one string.
const STRING_VALUED = new Set(["textfield", "textarea", "email", "url", "phoneNumber", "password"]);

// JSON logic's truthiness of a field's value, where survey-core can test it exactly: a checkbox is
// true, a string is not empty, and a number is neither empty nor 0. An object, such as a
// `selectboxes` value, is always truthy, and other types hold values whose truthiness depends on
// their format, so they give `undefined`.
function translateTruthiness(path: string | undefined, record: ConditionRecord, ctx: Ctx): string | undefined {
  const ref = resolveReference(path, record, ctx, true);
  if (!ref || ref.field.multiple) return undefined;
  const { text, field } = ref;
  if (field.type === "checkbox") return `${text} = true`;
  if (field.type === "number") return `(${text} notempty and ${text} <> 0)`;
  if (STRING_VALUED.has(field.type)) return `${text} notempty`;
  return undefined;
}

// A field whose SurveyJS value is an array: `selectboxes` (a checkbox), a multiple `select` (a
// tagbox) and `tags`, which is mapped only when it stores an array.
function isArrayValued(field: FieldRecord): boolean {
  return field.type === "selectboxes" || field.type === "tags" || (field.type === "select" && field.multiple);
}

// The literal an equality of the given kind compares with: a date or time is read in its format
// (see `formatDateTimeLiteral`), a `selectboxes` condition names one of its keys, and any other field
// is matched by what Form.io stores in it (see `matchEquality`). `undefined` when no literal compares
// exactly.
function formatTypedLiteral(value: unknown, field: FieldRecord, comparison: Comparison): string | typeof NEVER_EQUAL | undefined {
  if (field.dateTime) return formatDateTimeLiteral(value, field, false);
  if (field.type === "selectboxes") return isPrimitive(value) ? formatLiteral(value) : undefined;
  return matchEquality(value, field, comparison);
}

// Resolve a Form.io reference to the output name of the field it reads, written as seen from the
// condition. The exact data path is tried first, then the full path through layout components,
// then the bare key if exactly one field has it. A leading `data.` is the root, and a leading
// `row.` is a sibling in the condition's own grid. Inside a nested form, the root is the nested
// form's data, and only its fields can be named (see `FormRoot`). A `survey` field holds an object
// that no comparison, truthiness or text reads as Form.io does (its `{}` is not empty there), so
// a reference to it is refused (see `resolveSurveyRow` for one of its rows).
//
// `strict` is for JSON logic, `{{ ... }}` templates and URLs, which read the path from the root as
// written: the full-path and bare-key fallbacks then stay in the condition's own form, and a field
// of a nested form is named only by its data path. A legacy `when` and a simple condition read the
// value with `getValue`, which searches nested objects for the key, so their fallbacks reach into
// nested forms.
function resolveReference(
  path: unknown,
  from: { grids: GridScope[], root?: FormRoot },
  ctx: Ctx,
  strict = false,
  survey = false
): { text: string, field: FieldRecord } | undefined {
  if (typeof path !== "string" || path.length === 0) return undefined;
  const ref = path.startsWith("data.") ? path.slice("data.".length) : path;
  const root = from.root;
  // A path relative to the root, or `undefined` outside it.
  const relative = (full: string, base: string | undefined) =>
    base === undefined ? full : full.startsWith(`${base}.`) ? full.slice(base.length + 1) : undefined;
  const fields = root ? ctx.fields.filter((f) => relative(f.dataPath, root.dataPath) !== undefined) : ctx.fields;
  const only = (list: FieldRecord[]) => (list.length === 1 ? list[0] : undefined);
  let field: FieldRecord | undefined;
  if (ref.startsWith("row.")) {
    const grid = from.grids[from.grids.length - 1];
    if (!grid || relative(grid.dataPath, root?.dataPath) === undefined) return undefined;
    field = only(fields.filter((f) => f.dataPath === `${grid.dataPath}.${ref.slice("row.".length)}`));
  } else {
    // A strict fallback that names a field of another form is refused. Uniqueness is still judged
    // over every field, so that refusing one never makes another fallback unique.
    const fallback = (list: FieldRecord[]) => (strict && list.length === 1 && list[0].root !== root ? [] : list);
    field = only(fields.filter((f) => relative(f.dataPath, root?.dataPath) === ref))
      ?? only(fallback(fields.filter((f) => relative(f.fullPath, root?.fullPath) === ref)))
      ?? only(fallback(fields.filter((f) => f.key === ref)));
  }
  if (!field || (field.type === "survey") !== survey) return undefined;
  const prefix = referencePrefix(field.grids, from.grids);
  return prefix === undefined ? undefined : { text: `{${prefix}${field.name}}`, field };
}

// `data.s.<row>` in a template or a URL, where `s` is a `survey` field and `<row>` one of its rows: the
// row's selected value, which survey-core pipes as `{s.<row>}`. A row key with a dot, a name that is
// not a row, and the field itself are not resolved.
function resolveSurveyRow(path: string, from: { grids: GridScope[], root?: FormRoot }, ctx: Ctx): { text: string } | undefined {
  const dot = path.lastIndexOf(".");
  if (dot < 0) return undefined;
  const row = path.slice(dot + 1);
  const ref = resolveReference(path.slice(0, dot), from, ctx, true, true);
  if (!ref || !ref.field.rows?.includes(row) || row.includes(".")) return undefined;
  return { text: `${ref.text.slice(0, -1)}.${row}}` };
}

// How a condition inside the grids `from` names a field inside the grids `target`: bare outside
// any grid, `panel.` in the same grid, `parentPanel.` one grid up. A field inside a grid the
// condition is not in, or two or more grids up, cannot be named.
function referencePrefix(target: GridScope[], from: GridScope[]): string | undefined {
  if (target.length === 0) return "";
  if (target.length > from.length || target.some((grid, i) => from[i] !== grid)) return undefined;
  const up = from.length - target.length;
  if (up === 0) return "panel.";
  if (up === 1) return "parentPanel.";
  return undefined;
}

// A name not yet taken in the current pool. survey-core compares names without regard to case, so
// the pool does too. A data grid's template is a pool of its own (see `mapDataGrid`). Inside a
// nested form, a name is not one of the keys of the fields outside it, so that a field of the outer
// form keeps its key when it follows a nested field with the same key; the nested field's data
// moves anyway (see `ASSUMED_CONTAINER_DATA`).
function uniqueName(base: string, ctx: Ctx): string {
  let name = base;
  let i = 1;
  const taken = (n: string) => ctx.usedNames.has(n.toLowerCase()) || !!ctx.reservedNames?.has(n.toLowerCase());
  while(taken(name)) name = `${base}_${i++}`;
  ctx.usedNames.add(name.toLowerCase());
  return name;
}

// The lower-cased keys of the fields among `components`, through the layout around them: the
// components that take a name of their own in the pool, a data grid included. A container is named
// after its children, so it yields its key to them already. The fields of a nested form, and those
// of a data grid, which is a pool of its own, are left out.
function collectFieldKeys(components: unknown, keys = new Set<string>()): Set<string> {
  if (!Array.isArray(components)) return keys;
  for (const comp of components as unknown[]) {
    if (!isObject(comp)) continue;
    const c = comp as FormioComponent;
    if (isRadioCheckbox(c)) {
      keys.add((c.name as string).toLowerCase());
      continue;
    }
    const type = c.type;
    const isNestedForm = type === "form" && Array.isArray(c.components) && c.components.length > 0;
    // A tab has no `type`.
    const isContainer = typeof type !== "string" || PANEL_CONTAINERS.has(type) || LAYOUT_CONTAINERS.has(type) || type === "tabs";
    if (isContainer) {
      collectFieldKeys(collectLayoutChildren(c, "").map(({ child }) => child), keys);
    } else if (!isNestedForm && type !== "button" && typeof c.key === "string") {
      keys.add(c.key.toLowerCase());
    }
  }
  return keys;
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
  if (type === "form" && Array.isArray(comp.components) && comp.components.length > 0) {
    // A nested form with inline components; one that only references a form elsewhere stays
    // unsupported, see `mapLeaf`.
    return mapPanel(comp, sourcePtr, targetPath, ctx);
  }
  if (LAYOUT_CONTAINERS.has(type)) {
    // Layout containers carry no SurveyJS structural equivalent -- flatten to a
    // panel and record the lost layout. One with no element has no target node.
    const panel = mapPanel(comp, sourcePtr, targetPath, ctx, collectLayoutChildren(comp, sourcePtr));
    ctx.report.dropped(FormioCodes.DROPPED_STYLING, sourcePtr, panel ? targetPath : "");
    return panel;
  }
  if (type === "datagrid" || type === "editgrid") {
    return mapDataGrid(comp, sourcePtr, targetPath, ctx);
  }
  if (type === "button") {
    // Submit/save is handled by SurveyJS navigation -- no target node. That drop is silent, and a
    // condition or logic that hides or disables the button changes when the form can be submitted,
    // so each is refused as well (see `reportDroppedLogic`).
    ctx.report.dropped(FormioCodes.DROPPED_VENDOR_META, sourcePtr, "");
    reportDroppedLogic(comp, sourcePtr, ctx);
    return null;
  }

  // Leaf inputs.
  const el = mapLeaf(comp, type, sourcePtr, targetPath, ctx);
  if (!el) return null;

  recordField(comp, el.name as string, ctx, el);
  if (el.type !== "html") recordInput(comp, el, ctx);
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
    if (type === "currency") applyCurrencyMask(comp, el, sourcePtr, targetPath, ctx);
    if (type === "number") applyNumberMask(comp, el);
    if (type === "textfield" || type === "phoneNumber") applyInputMask(comp, el, sourcePtr, targetPath, ctx);
    if (type === "datetime") applyDateTimeOptions(comp, el, sourcePtr, targetPath, ctx);
    return el;
  }

  switch(type) {
    case "textarea": {
      const el: SurveyJSONElement = { type: "comment", name };
      applyTextareaOptions(comp, el, sourcePtr, targetPath, ctx);
      return el;
    }
    case "checkbox":
      // A single Form.io checkbox is a boolean; `selectboxes` is the multi-select.
      return { type: "boolean", name };
    case "selectboxes": {
      const el: SurveyJSONElement = { type: "checkbox", name };
      const choices = readChoices(comp);
      if (choices) el.choices = choices;
      applyInline(comp, el);
      const min = readCount(comp.validate?.minSelectedCount);
      const max = readCount(comp.validate?.maxSelectedCount);
      if (min !== undefined) el.minSelectedChoices = min;
      if (max !== undefined) el.maxSelectedChoices = max;
      return el;
    }
    case "radio": {
      const el: SurveyJSONElement = { type: "radiogroup", name };
      const choices = readChoices(comp);
      if (choices) el.choices = choices;
      applyInline(comp, el);
      applyDataType(comp, el, sourcePtr, targetPath, ctx);
      return el;
    }
    case "select": {
      const el: SurveyJSONElement = { type: comp.multiple ? "tagbox" : "dropdown", name };
      applyDataSource(comp, el, sourcePtr, targetPath, ctx);
      applyDataType(comp, el, sourcePtr, targetPath, ctx);
      return el;
    }
    case "file": {
      const el: SurveyJSONElement = { type: "file", name };
      applyFileOptions(comp, el, sourcePtr, targetPath, ctx);
      return el;
    }
    case "signature": {
      const el: SurveyJSONElement = { type: "signaturepad", name };
      applySignatureOptions(comp, el, sourcePtr, targetPath, ctx);
      return el;
    }
    case "content":
    case "htmlelement": {
      const key = comp.html !== undefined && comp.html !== null ? "html" : "content";
      const el: SurveyJSONElement = { type: "html", name, html: comp[key] ?? "" };
      if (typeof el.html === "string" && (el.html.includes("{{") || el.html.includes("{%"))) {
        ctx.templates.push({ el, sourcePtr: `${sourcePtr}/${key}`, targetPath: `${targetPath}.html`, grids: [...ctx.grids], root: ctx.root });
      }
      return el;
    }
    case "hidden": {
      // Never shown; its value, from a default or from the submission, stays in the data (see
      // `applyClearOnHide`).
      const el: SurveyJSONElement = { type: "text", name, visible: false };
      ctx.neverShown.add(el);
      return el;
    }
    case "survey": {
      // Its value `{ question: value }` is a matrix value.
      const el: SurveyJSONElement = { type: "matrix", name };
      const rows = readItems(comp.questions);
      const columns = readItems(comp.values);
      if (rows) el.rows = rows;
      if (columns) el.columns = columns;
      // Form.io requires an answer to every question.
      if (comp.validate?.required === true) el.eachRowRequired = true;
      return el;
    }
    case "tags": {
      // Stored as a string (the default), the value has no SurveyJS question.
      if (comp.storeas !== "array") return reportUnmapped(type, sourcePtr, ctx);
      const el: SurveyJSONElement = { type: "tagbox", name, allowCustomChoices: true };
      const max = readCount(comp.maxTags);
      if (max !== undefined) el.maxSelectedChoices = max;
      return el;
    }
    default:
      return reportUnmapped(type, sourcePtr, ctx);
  }
}

// Known to Form.io but unmapped -> our backlog; unknown -> drift alarm.
function reportUnmapped(type: string, sourcePtr: string, ctx: Ctx): null {
  if (isKnownFormioType(type)) {
    ctx.report.unsupported(FormioCodes.UNSUPPORTED_COMPONENT, sourcePtr, "");
  } else {
    ctx.report.unknown(FormioCodes.UNKNOWN_COMPONENT, sourcePtr, "");
  }
  return null;
}

// --- HTML templates -------------------------------------------------------------

// Form.io renders `{{ ... }}` in HTML as a template. `{{ data.x }}` and `{{ data.a.b }}` read a
// value by its data path, which survey-core pipes as `{name}`. Any other template, a path that
// names no field, and a `{% ... %}` code block stay as written and are reported once per
// component, content-free.
function resolveTemplates(ctx: Ctx): void {
  for (const record of ctx.templates) {
    const html = record.el.html as string;
    const open = html.indexOf("{%");
    let unresolved = open >= 0 && html.indexOf("%}", open + 2) >= 0;
    record.el.html = replaceTemplates(html, (template, inner) => {
      const path = /^\s*(data\.[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)\s*$/.exec(inner)?.[1];
      const ref = path !== undefined ? resolveReference(path, record, ctx, true) ?? resolveSurveyRow(path, record, ctx) : undefined;
      if (ref) return ref.text;
      unresolved = true;
      return template;
    });
    if (unresolved) ctx.report.unsupported(FormioCodes.CUSTOM_TEMPLATE, record.sourcePtr, record.targetPath);
  }
}

// Replace each `{{ ... }}` with what `replace` returns for it and its inner text. A scan rather
// than a regular expression, which would backtrack quadratically on a run of unclosed `{{`.
function replaceTemplates(text: string, replace: (template: string, inner: string) => string): string {
  let out = "";
  let pos = 0;
  for (;;) {
    const open = text.indexOf("{{", pos);
    const close = open < 0 ? -1 : text.indexOf("}}", open + 2);
    if (close < 0) break;
    out += text.slice(pos, open) + replace(text.slice(open, close + 2), text.slice(open + 2, close));
    pos = close + 2;
  }
  return out + text.slice(pos);
}

// --- currency -----------------------------------------------------------------

// Form.io's default when a currency field names none.
const DEFAULT_CURRENCY = "USD";

// The parts of an amount formatted in `currency` with the "en" format, or `undefined` for a code
// `Intl` does not know (it throws a RangeError).
function currencyParts(currency: string): Intl.NumberFormatPart[] | undefined {
  try {
    return new Intl.NumberFormat("en", { style: "currency", currency }).formatToParts(1);
  } catch{
    return undefined;
  }
}

// A Form.io currency field is a number under a mask: the currency symbol sits inside the value, and
// the component's own `prefix` and `suffix` render outside the input. In survey-core the mask's
// `currencyPattern` holds both: `@` is the symbol and `#` the number, so `prefix` and `suffix`
// wrap the currency's own layout. `currency` is an ISO code and `currencySymbol` is displayed as
// written, so the symbol is resolved with `Intl` ("USD" gives "$").
function applyCurrencyMask(comp: FormioComponent, el: SurveyJSONElement, sourcePtr: string, targetPath: string, ctx: Ctx): void {
  const settings: Record<string, unknown> = {};
  const currency = typeof comp.currency === "string" && comp.currency.length > 0 ? comp.currency : undefined;
  const parts = currencyParts(currency ?? DEFAULT_CURRENCY);
  if (currency !== undefined) {
    const symbol = parts?.find((p) => p.type === "currency")?.value;
    if (symbol !== undefined) settings.currencySymbol = symbol;
    else ctx.report.assumed(FormioCodes.ASSUMED_CURRENCY_FORMAT, `${sourcePtr}/currency`, `${targetPath}.maskSettings`);
  }
  if (comp.requireDecimal === true) settings.showTrailingZeros = true;
  if (typeof comp.decimalLimit === "number") settings.precision = comp.decimalLimit;

  const prefix = typeof comp.prefix === "string" ? comp.prefix : "";
  const suffix = typeof comp.suffix === "string" ? comp.suffix : "";
  if (prefix.length > 0 || suffix.length > 0) {
    // A digit is refused by the pattern's validator, and `#`, `@` and `-` are its own symbols with
    // no escape, so such an affix cannot be written.
    if (/[0-9#@-]/.test(prefix + suffix)) {
      ctx.report.assumed(FormioCodes.ASSUMED_CURRENCY_FORMAT, sourcePtr, `${targetPath}.maskSettings`);
    } else {
      settings.currencyPattern = `${prefix}${currencyLayout(parts)}${suffix}`;
    }
  }
  el.maskType = "currency";
  if (Object.keys(settings).length > 0) el.maskSettings = settings;
}

// The currency's own layout as a pattern: "@#" for "$1.00", "@ #" for "CHF 1.00".
function currencyLayout(parts: Intl.NumberFormatPart[] | undefined): string {
  if (!parts) return "@#";
  let layout = "";
  for (const part of parts) {
    if (part.type === "currency") layout += "@";
    else if (part.type === "literal") layout += part.value;
    else if (!layout.endsWith("#")) layout += "#";
  }
  return layout;
}

// --- component options ------------------------------------------------------------
//
// Options with a SurveyJS equivalent are read where their type is handled. Only a value other than
// Form.io's default (its component `schema()`) counts. An option with no equivalent is reported
// `UNSUPPORTED_OPTION`, and presentation the respondent reads `DROPPED_STYLING`, at the option.

function reportOption(key: string, sourcePtr: string, targetPath: string, ctx: Ctx): void {
  ctx.report.unsupported(FormioCodes.UNSUPPORTED_OPTION, `${sourcePtr}/${key}`, targetPath);
}

function reportStyling(key: string, sourcePtr: string, targetPath: string, ctx: Ctx): void {
  ctx.report.dropped(FormioCodes.DROPPED_STYLING, `${sourcePtr}/${key}`, targetPath);
}

function isText(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== "";
}

// A positive whole number, written as a number or a string; Form.io's empty setting is "".
function readCount(value: unknown): number | undefined {
  const n = typeof value === "string" && value.trim() !== "" ? Number(value) : value;
  return typeof n === "number" && Number.isInteger(n) && n > 0 ? n : undefined;
}

// The options of an input, a data grid included, that no type maps. A currency's prefix and suffix
// are part of its mask (see `applyCurrencyMask`).
function reportInputOptions(comp: FormioComponent, sourcePtr: string, targetPath: string, ctx: Ctx): void {
  for (const key of ["minWords", "maxWords"]) {
    if (readCount(comp.validate?.[key]) !== undefined) reportOption(`validate/${key}`, sourcePtr, targetPath, ctx);
  }
  if (comp.unique === true) reportOption("unique", sourcePtr, targetPath, ctx);
  if (isObject(comp.kickbox) && comp.kickbox.enabled === true) reportOption("kickbox", sourcePtr, targetPath, ctx);
  if (comp.allowMultipleMasks === true) reportOption("allowMultipleMasks", sourcePtr, targetPath, ctx);
  // `false` and `"client-only"` both keep the value out of the stored submission.
  if (comp.persistent !== undefined && comp.persistent !== true) reportOption("persistent", sourcePtr, targetPath, ctx);
  const styling = comp.type === "currency" ? ["tooltip", "errorLabel"] : ["tooltip", "errorLabel", "prefix", "suffix"];
  for (const key of styling) {
    if (isText(comp[key])) reportStyling(key, sourcePtr, targetPath, ctx);
  }
}

// Form.io shows `validate.customMessage` for every failed rule: each validator takes it, and so
// does the required error when the field is required, statically or by a converted `requiredIf`
// (known after the walk, see `applyRequiredMessages`). A data grid has no validators, and
// survey-core keeps its row count within its limits instead of showing an error, so a grid's
// message that no required error takes is reported.
function applyCustomMessage(
  comp: FormioComponent,
  el: SurveyJSONElement,
  validators: Record<string, unknown>[] | undefined,
  sourcePtr: string,
  targetPath: string,
  ctx: Ctx,
  reportUnused: boolean
): void {
  const message = comp.validate?.customMessage;
  if (!isText(message)) return;
  for (const validator of validators ?? []) validator.text = message;
  if (comp.validate?.required) el.requiredErrorText = message;
  else ctx.requiredMessages.push({ el, message, sourcePtr: reportUnused ? `${sourcePtr}/validate/customMessage` : undefined, targetPath });
}

// The custom messages of fields that are not statically required, once the `requiredIf`s are set.
function applyRequiredMessages(ctx: Ctx): void {
  for (const pending of ctx.requiredMessages) {
    if (pending.el.requiredIf !== undefined) pending.el.requiredErrorText = pending.message;
    else if (pending.sourcePtr !== undefined) ctx.report.unsupported(FormioCodes.UNSUPPORTED_OPTION, pending.sourcePtr, pending.targetPath);
  }
}

// `inline` lays the options out in one row.
function applyInline(comp: FormioComponent, el: SurveyJSONElement): void {
  if (comp.inline === true) el.colCount = 0;
}

// Form.io shows a number with `decimalLimit` decimals, two under `requireDecimal`, and pads them
// with zeros under `requireDecimal`. survey-core rounds and pads under a numeric mask, which needs
// a text input. Form.io writes a thousands separator only with `delimiter`.
function applyNumberMask(comp: FormioComponent, el: SurveyJSONElement): void {
  const limit = typeof comp.decimalLimit === "number" || isText(comp.decimalLimit) ? Number(comp.decimalLimit) : NaN;
  const precision = Number.isInteger(limit) && limit >= 0 ? limit : undefined;
  if (precision === undefined && comp.requireDecimal !== true) return;
  const settings: Record<string, unknown> = { precision: precision ?? 2 };
  if (comp.requireDecimal === true) settings.showTrailingZeros = true;
  if (!comp.delimiter) settings.thousandsSeparator = "";
  delete el.inputType;
  el.maskType = "numeric";
  el.maskSettings = settings;
}

// Form.io's default mask of a `phoneNumber`.
const DEFAULT_PHONE_MASK = "(999) 999-9999";

// `inputMask` becomes a pattern mask. Form.io stores the value with the mask's literals, so the
// mask saves the masked value too. A mask Form.io chooses from several is reported with
// `allowMultipleMasks`.
function applyInputMask(comp: FormioComponent, el: SurveyJSONElement, sourcePtr: string, targetPath: string, ctx: Ctx): void {
  if (comp.allowMultipleMasks === true) return;
  const mask = comp.inputMask === undefined && comp.type === "phoneNumber" ? DEFAULT_PHONE_MASK : comp.inputMask;
  if (typeof mask !== "string" || mask === "") return;
  const pattern = translateInputMask(mask, comp.type === "textfield");
  if (pattern === undefined) {
    reportOption("inputMask", sourcePtr, targetPath, ctx);
    return;
  }
  el.maskType = "pattern";
  el.maskSettings = { pattern, saveMaskedValue: true };
}

// Form.io's mask tokens (`getInputMask`) are `9` a digit, `A` a letter, `a` a lowercase letter and
// `*` a letter or digit; every other character is itself, with no escape. survey-core's are `9`,
// `a` (a letter of either case) and `#`, escaped with a backslash. A lowercase letter has no
// token, and survey-core cannot write a literal backslash: its escape character does not escape
// itself. A `textfield` also types through the Inputmask library, which reads `#`, `&`, brackets
// and `|` as tokens of its own, so such a mask behaves differently while typing.
function translateInputMask(mask: string, isTextfield: boolean): string | undefined {
  if (mask.includes("a") || mask.includes("\\")) return undefined;
  if (isTextfield && /[#&[\]{}()|]/.test(mask)) return undefined;
  let pattern = "";
  for (const ch of mask) {
    if (ch === "A") pattern += "a";
    else if (ch === "*") pattern += "#";
    else if (ch === "#") pattern += "\\#";
    else pattern += ch;
  }
  return pattern;
}

// `enableTime: false` keeps the date and `enableDate: false` the time. `datePicker.minDate` and
// `maxDate` limit the date; Form.io builds its widget from `datePicker`, and older forms store
// them under `widget` only. A limit that is not a date, such as a `moment()` expression, is
// reported.
function applyDateTimeOptions(comp: FormioComponent, el: SurveyJSONElement, sourcePtr: string, targetPath: string, ctx: Ctx): void {
  if (comp.enableTime === false && comp.enableDate !== false) el.inputType = "date";
  else if (comp.enableDate === false && comp.enableTime !== false) el.inputType = "time";
  for (const [key, prop] of [["minDate", "min"], ["maxDate", "max"]]) {
    const holder = ["datePicker", "widget"].find((h) => isObject(comp[h]) && isSetLimit((comp[h] as Record<string, unknown>)[key]));
    if (holder === undefined) continue;
    const value = (comp[holder] as Record<string, unknown>)[key];
    const iso = typeof value === "string" ? parseDateTime({ type: "datetime" }, value.trim()) : undefined;
    if (iso === undefined || el.inputType === "time") reportOption(`${holder}/${key}`, sourcePtr, targetPath, ctx);
    else el[prop] = el.inputType === "date" ? iso.slice(0, "YYYY-MM-DD".length) : iso;
  }
}

function isSetLimit(value: unknown): boolean {
  return value !== undefined && value !== null && value !== "";
}

// Form.io's default `rows` of a textarea.
const DEFAULT_TEXTAREA_ROWS = 3;

// A rich text or code `editor` stores HTML or code, which a comment does not edit.
function applyTextareaOptions(comp: FormioComponent, el: SurveyJSONElement, sourcePtr: string, targetPath: string, ctx: Ctx): void {
  const rows = readCount(comp.rows);
  if (rows !== undefined && rows !== DEFAULT_TEXTAREA_ROWS) el.rows = rows;
  if (isText(comp.editor)) reportOption("editor", sourcePtr, targetPath, ctx);
}

// Form.io's default `fileMaxSize`, 1GB, and the units `translateScalars` reads.
const DEFAULT_FILE_MAX_SIZE = 1024 * 1024 * 1024;
const FILE_SIZE_UNITS: Record<string, number> = { b: 1, kb: 1024, mb: 1024 * 1024, gb: 1024 * 1024 * 1024 };

// `fileMaxSize` in bytes and `filePattern` as accepted types. Base64, SurveyJS's default, is the
// only storage that keeps the file in the submission.
function applyFileOptions(comp: FormioComponent, el: SurveyJSONElement, sourcePtr: string, targetPath: string, ctx: Ctx): void {
  if (comp.multiple === true) el.allowMultiple = true;
  // An empty size is no limit in Form.io, as `maxSize: 0` is in SurveyJS.
  if (comp.fileMaxSize !== undefined && comp.fileMaxSize !== null && comp.fileMaxSize !== "") {
    const size = readFileSize(comp.fileMaxSize);
    if (size === undefined) reportOption("fileMaxSize", sourcePtr, targetPath, ctx);
    else if (size !== DEFAULT_FILE_MAX_SIZE) el.maxSize = size;
  }
  if (isText(comp.filePattern) && comp.filePattern.trim() !== "*") {
    const types = readAcceptedTypes(comp.filePattern);
    if (types === undefined) reportOption("filePattern", sourcePtr, targetPath, ctx);
    else el.acceptedTypes = types;
  }
  if (isText(comp.storage) && comp.storage !== "base64") reportOption("storage", sourcePtr, targetPath, ctx);
}

function readFileSize(value: unknown): number | undefined {
  if (typeof value === "number") return Number.isFinite(value) && value >= 0 ? Math.round(value) : undefined;
  const m = typeof value === "string" ? /^\s*(\d+(?:\.\d+)?)\s*(b|kb|mb|gb)\s*$/i.exec(value) : null;
  return m ? Math.round(Number(m[1]) * FILE_SIZE_UNITS[m[2].toLowerCase()]) : undefined;
}

// Form.io matches each comma-separated glob against the file's type and name. `*.pdf` and `.pdf`
// match an extension and `image/*` a type, as the `accept` list does; any other glob, a
// `!` exclusion or a regular expression is not an accepted type.
function readAcceptedTypes(pattern: string): string | undefined {
  const types: string[] = [];
  for (const part of pattern.replace(/\s/g, "").split(",")) {
    const ext = /^\*?(\.[A-Za-z0-9]+)$/.exec(part);
    if (ext) types.push(ext[1]);
    else if (/^[A-Za-z]+\/(?:\*|[A-Za-z0-9.+-]+)$/.test(part)) types.push(part);
    else return undefined;
  }
  return types.join(",");
}

// Form.io's defaults for the signature pad. `width` and `height` are CSS sizes; only a pixel size
// maps to the pad's size in pixels, and another one is reported as styling.
const SIGNATURE_SIZES: [string, string, string][] = [["width", "signatureWidth", "100%"], ["height", "signatureHeight", "150px"]];
const SIGNATURE_PENS: [string, string, number][] = [["minWidth", "penMinWidth", 0.5], ["maxWidth", "penMaxWidth", 2.5]];
const SIGNATURE_COLORS: [string, string][] = [["penColor", "black"], ["backgroundColor", "rgb(245,245,235)"]];

function applySignatureOptions(comp: FormioComponent, el: SurveyJSONElement, sourcePtr: string, targetPath: string, ctx: Ctx): void {
  for (const [key, prop, byDefault] of SIGNATURE_SIZES) {
    const value = comp[key];
    if (!isSetLimit(value) || value === byDefault) continue;
    const m = typeof value === "string" ? /^\s*(\d+(?:\.\d+)?)px\s*$/.exec(value) : null;
    const px = typeof value === "number" ? value : m ? Number(m[1]) : undefined;
    if (px !== undefined && Number.isFinite(px) && px > 0) el[prop] = px;
    else reportStyling(key, sourcePtr, targetPath, ctx);
  }
  for (const [key, byDefault] of SIGNATURE_COLORS) {
    if (isText(comp[key]) && comp[key] !== byDefault) el[key] = comp[key];
  }
  for (const [key, prop, byDefault] of SIGNATURE_PENS) {
    const value = comp[key];
    if (!isSetLimit(value)) continue;
    const width = Number(value);
    if (!Number.isFinite(width) || width <= 0) reportStyling(key, sourcePtr, targetPath, ctx);
    else if (width !== byDefault) el[prop] = width;
  }
}

// A data grid's row limits, its add button and its initial rows. A `datagrid` opens with one row,
// or `validate.minLength` rows, unless `initEmpty` (or its alias `noFirstRow`) is set; an
// `editgrid` opens with none, which is `paneldynamic`'s default.
function applyGridOptions(comp: FormioComponent, panel: SurveyJSONElement, sourcePtr: string, targetPath: string, ctx: Ctx): void {
  const min = readCount(comp.validate?.minLength);
  const max = readCount(comp.validate?.maxLength);
  const initEmpty = comp.initEmpty ? "initEmpty" : comp.noFirstRow ? "noFirstRow" : undefined;
  if (comp.type === "datagrid" && !initEmpty) panel.panelCount = Math.max(1, min ?? 0);
  // An empty grid opens with no row in Form.io even under `minLength`, while `minPanelCount`
  // opens that many.
  if (comp.type === "datagrid" && initEmpty && min !== undefined) reportOption(initEmpty, sourcePtr, targetPath, ctx);
  if (min !== undefined) panel.minPanelCount = min;
  if (max !== undefined) panel.maxPanelCount = max;
  if (isText(comp.addAnother)) panel.addPanelText = comp.addAnother;
  if (comp.disableAddingRemovingRows === true) {
    panel.allowAddPanel = false;
    panel.allowRemovePanel = false;
  }
  if (comp.reorder === true) reportOption("reorder", sourcePtr, targetPath, ctx);
}

// --- select data sources ----------------------------------------------------------

// The item template Form.io falls back to without one shows `item.label`.
const DEFAULT_ITEM_TITLE = "label";

// `dataSrc: "url"` becomes `choicesByUrl`; `json` and static values become `choices`. A resource or
// custom code is refused, and so is a URL the form would call wrongly: one that interpolates
// anything but a field, or one that needs authentication or request headers. A URL that names a
// field is resolved after the walk, see `resolveUrlSources`.
function applyDataSource(comp: FormioComponent, el: SurveyJSONElement, sourcePtr: string, targetPath: string, ctx: Ctx): void {
  const src = comp.dataSrc;
  if (src === undefined || src === "" || src === "values") {
    const choices = readChoices(comp);
    if (choices) el.choices = choices;
    return;
  }
  if (src === "json") {
    applyJsonChoices(comp, el, sourcePtr, targetPath, ctx);
    return;
  }
  if (src !== "url") {
    ctx.report.unsupported(FormioCodes.UNSUPPORTED_DATA_SOURCE, `${sourcePtr}/dataSrc`, targetPath);
    return;
  }
  const url = comp.data?.url;
  const headers = Array.isArray(comp.data?.headers) ? comp.data.headers as { key?: unknown, value?: unknown }[] : [];
  const hasHeaders = headers.some((h) => !!h && (!!h.key || !!h.value));
  if (typeof url !== "string" || url.length === 0 || comp.authenticate === true || hasHeaders) {
    ctx.report.unsupported(FormioCodes.UNSUPPORTED_DATA_SOURCE, `${sourcePtr}/dataSrc`, targetPath);
    return;
  }
  const byUrl: Record<string, unknown> = { url };
  if (typeof comp.selectValues === "string" && comp.selectValues.length > 0) byUrl.path = comp.selectValues;
  if (typeof comp.valueProperty === "string" && comp.valueProperty.length > 0) byUrl.valueName = comp.valueProperty;
  const titleName = readTemplateTitle(comp.template);
  if (titleName !== undefined) byUrl.titleName = titleName;
  else ctx.report.assumed(FormioCodes.ASSUMED_DATA_SOURCE_TITLE, `${sourcePtr}/template`, `${targetPath}.choicesByUrl`);
  el.choicesByUrl = byUrl;
  if (url.includes("{{")) ctx.urlSources.push({ el, sourcePtr: `${sourcePtr}/dataSrc`, targetPath, grids: [...ctx.grids], root: ctx.root });
}

// Form.io casts each value a radio or select stores to its `dataType`, and with none to `auto` (see
// `formioCast`), so the choice values are cast the same way for `number`, `boolean` and `auto`, and
// so is the default (see `castDefault`). Values that would give no number, or that the cast would
// make one value for survey-core, are reported and kept as written. Values from a URL come in the
// response's own types: an explicit `dataType` that casts them is reported, and so is `auto` or none,
// which Form.io casts too (`Select.normalizeSingleValue`); `object` or an unknown one keeps them. The
// values of choices in the definition are recorded, as stored and as Form.io stores them, for
// conditions (see `matchEquality`).
function applyDataType(comp: FormioComponent, el: SurveyJSONElement, sourcePtr: string, targetPath: string, ctx: Ctx): void {
  const dataType = comp.dataType;
  const valueType: ValueType | undefined = dataType === "number" || dataType === "boolean" ? dataType
    : dataType === undefined || dataType === "" || dataType === "auto" ? "auto" : undefined;
  if (el.choicesByUrl) {
    if (dataType === "number" || dataType === "boolean" || dataType === "string") reportOption("dataType", sourcePtr, targetPath, ctx);
    else if (valueType === "auto") ctx.castUrlValues.push({ el, sourcePtr: `${sourcePtr}/dataSrc`, targetPath });
    return;
  }
  // With no choices there is no value to cast; a refused source is reported as such.
  const choices = el.choices as { value: unknown }[] | undefined;
  if (!choices) return;
  const written = choices.map((c) => c.value);
  if (valueType) {
    const values = written.map((v) => castValue(v, valueType, comp.type));
    // survey-core reads "01" and 1, or "true" and true, as one value, so a cast that leads two
    // values written apart to that would merge two choices.
    const merging = values.findIndex((v, i) => v === undefined
      || values.some((w, j) => j < i && (w === v || (surveyEquals(w, v) && !surveyEquals(written[j], written[i])))));
    if (merging >= 0) {
      if (dataType !== undefined) reportOption("dataType", sourcePtr, targetPath, ctx);
      else ctx.report.unsupported(FormioCodes.UNSUPPORTED_OPTION, itemValuePointer(comp, merging, sourcePtr), targetPath);
    } else {
      choices.forEach((c, i) => (c.value = values[i]));
      ctx.valueTypes.set(el, valueType);
    }
  }
  ctx.choiceSets.set(el, {
    values: choices.map((c, i) => ({ stored: c.value, formio: formioCast(written[i], dataType, comp.type) })),
    empty: comp.multiple === true ? [] : hasObjectEmptyValue(comp) ? {} : "",
    opaque: !written.every(isPrimitive)
  });
}

// The pointer of the `value` of the `index`th item `readChoices` kept: items with no value are skipped.
function itemValuePointer(comp: FormioComponent, index: number, sourcePtr: string): string {
  const inData = comp.data?.values !== undefined;
  const raw = (comp.data?.values ?? comp.values) as { value?: unknown }[];
  let sourceIndex = -1;
  for (let kept = -1; kept < index && sourceIndex + 1 < raw.length;) {
    sourceIndex++;
    const item = raw[sourceIndex];
    if (item && item.value !== undefined && item.value !== "") kept++;
  }
  return `${sourcePtr}${inData ? "/data" : ""}/values/${sourceIndex}/value`;
}

function isPrimitive(value: unknown): boolean {
  return value === null || typeof value === "string" || typeof value === "number" || typeof value === "boolean";
}

// Form.io's empty value of a single select from JSON items whose first value is not a text is `{}`
// (`Select.emptyValue`).
function hasObjectEmptyValue(comp: FormioComponent): boolean {
  if (comp.type !== "select" || comp.multiple === true || comp.dataSrc !== "json" || !comp.data?.json) return false;
  const first = (comp.data.json as ArrayLike<unknown>)[0];
  const valueProperty = comp.valueProperty;
  const value = typeof valueProperty === "string" && valueProperty !== "" ? readItemPath(first, valueProperty) : first;
  return !(typeof value === "string" && value !== "");
}

// The value of a radio or select as Form.io stores it: `Radio.normalizeValue` and
// `Select.normalizeSingleValue` (the server's `normalize` processor does the same). With no
// `dataType` both use `auto`: a radio reads a value written as JavaScript writes a number as that
// number, and "true" or "false" as a boolean; a select reads the value as text first, then the same
// way, with "true" and "false" in any case. An unknown `dataType` keeps the value.
function formioCast(value: unknown, dataType: unknown, type: unknown): unknown {
  const mode = dataType || "auto";
  if (type === "radio") {
    switch(mode) {
      case "auto": {
        const text = typeof value === "number" && Object.is(value, -0) ? "-0" : value === null || value === undefined ? "" : String(value);
        const cast = !Number.isNaN(parseFloat(text)) && isFinite(value as number) && text === String(Number(value)) ? Number(value) : value;
        return cast === "true" ? true : cast === "false" ? false : cast;
      }
      case "number":
        return Number(value);
      case "string":
        return value !== null && typeof value === "object" ? JSON.stringify(value) : String(value);
      case "boolean":
        return !(!value || String(value) === "false");
      default:
        return value;
    }
  }
  if (value === null || value === undefined) return undefined;
  if (typeof value === "object") return mode === "string" ? String(value) : value;
  const toNumber = (current: unknown) => {
    const n = Number(current);
    return Number.isFinite(n) && value !== "" && String(value) === String(n) ? n : current;
  };
  const toBoolean = (current: unknown) =>
    typeof current === "string" && /^(true|false)$/i.test(current) ? current.toLowerCase() === "true" : current;
  switch(mode) {
    case "auto": return toBoolean(toNumber(String(value)));
    case "number": return toNumber(value);
    case "boolean": return toBoolean(value);
    case "string": return String(value);
    default: return value;
  }
}

// The value the converted question stores for a `dataType`: Form.io's, or `undefined` when that is
// no number.
function castValue(value: unknown, valueType: ValueType, type: unknown): unknown {
  if (value === null || value === undefined) return value;
  const cast = formioCast(value, valueType, type);
  return typeof cast === "number" && !Number.isFinite(cast) ? undefined : cast;
}

// `{{ data.x }}` in a URL becomes `{x}` and `{{ row.x }}` becomes `{panel.x}`, which survey-core
// substitutes and reloads on. Any other interpolation, or a path that names no field, refuses the
// source.
function resolveUrlSources(ctx: Ctx): void {
  for (const record of ctx.urlSources) {
    const byUrl = record.el.choicesByUrl as Record<string, unknown>;
    let resolved = true;
    const url = replaceTemplates(byUrl.url as string, (template, inner) => {
      const path = /^\s*((?:data|row)\.[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)\s*$/.exec(inner)?.[1];
      const ref = path !== undefined ? resolveReference(path, record, ctx, true) ?? resolveSurveyRow(path, record, ctx) : undefined;
      if (ref) return ref.text;
      resolved = false;
      return template;
    });
    // An unclosed `{{` is left in the text by `replaceTemplates`.
    if (resolved && !url.includes("{{")) {
      byUrl.url = url;
    } else {
      delete record.el.choicesByUrl;
      ctx.report.unsupported(FormioCodes.UNSUPPORTED_DATA_SOURCE, record.sourcePtr, record.targetPath);
    }
  }
}

// `dataSrc: "json"`: the items are inline, as an array or a string that parses to one. A string or
// number item is its own value; an object item takes its value from `valueProperty` and its text
// from the item template. An object without a `valueProperty` gives no choice.
function applyJsonChoices(comp: FormioComponent, el: SurveyJSONElement, sourcePtr: string, targetPath: string, ctx: Ctx): void {
  let items: unknown = comp.data?.json;
  if (typeof items === "string") {
    try {
      items = JSON.parse(items);
    } catch{
      items = undefined;
    }
  }
  const valueName = typeof comp.valueProperty === "string" && comp.valueProperty.length > 0 ? comp.valueProperty : undefined;
  const titleName = readTemplateTitle(comp.template);
  const choices: { value: unknown, text?: string }[] = [];
  let skipped = !Array.isArray(items);
  let fromObjects = false;
  for (const item of Array.isArray(items) ? items : []) {
    if (typeof item === "string") {
      // An empty string is no choice, as in `readChoices`; it is dropped without a report.
      if (item !== "") choices.push({ value: item });
    } else if (typeof item === "number" && Number.isFinite(item)) {
      // Form.io's option value is the item as text (`getOptionValue`), shown as its text, and cast to
      // the `dataType` once chosen, so a number item is the string item of its text (see
      // `applyDataType`): with no `dataType` it stores the number.
      choices.push({ value: String(item) });
    } else if (item && typeof item === "object" && valueName !== undefined) {
      const value = readItemPath(item, valueName);
      // An object or array cannot be a choice value.
      if (typeof value !== "string" && typeof value !== "number" && typeof value !== "boolean" || value === "") {
        skipped = true;
        continue;
      }
      fromObjects = true;
      const text = titleName !== undefined ? readItemPath(item, titleName) : undefined;
      choices.push(typeof text === "string" || typeof text === "number" ? { value, text: String(text) } : { value });
    } else {
      skipped = true;
    }
  }
  // An empty array is a valid empty list in Form.io, so it gives no choices and no report.
  if (choices.length > 0) {
    el.choices = choices;
    // The template matters only for object items.
    if (fromObjects && titleName === undefined) ctx.report.assumed(FormioCodes.ASSUMED_DATA_SOURCE_TITLE, `${sourcePtr}/template`, `${targetPath}.choices`);
  }
  if (skipped) ctx.report.unsupported(FormioCodes.UNSUPPORTED_DATA_SOURCE, `${sourcePtr}/dataSrc`, targetPath);
}

// A dotted path into an item, as `valueName` and `titleName` read a response.
function readItemPath(item: unknown, path: string): unknown {
  let node = item;
  for (const part of path.split(".")) {
    if (!node || typeof node !== "object") return undefined;
    node = (node as Record<string, unknown>)[part];
  }
  return node;
}

// The item property a template shows, when the template is exactly `<span>{{ item.x }}</span>`.
// `titleName` reads a dotted path, so `item.data.name` gives `data.name`.
function readTemplateTitle(template: unknown): string | undefined {
  if (template === undefined || template === "") return DEFAULT_ITEM_TITLE;
  if (typeof template !== "string") return undefined;
  const match = /^<span>\{\{\s*item\.([A-Za-z0-9_$]+(?:\.[A-Za-z0-9_$]+)*)\s*\}\}<\/span>$/.exec(template.trim());
  return match ? match[1] : undefined;
}

// --- radio-type checkboxes -----------------------------------------------------------

// A `checkbox` with `inputType: "radio"` and a `name` is one option of a radio group: Form.io stores
// the checked member's `value` under `name`. Without a `name` it stays a boolean.
function isRadioCheckbox(comp: FormioComponent): boolean {
  return comp.type === "checkbox" && comp.inputType === "radio" && typeof comp.name === "string" && comp.name.length > 0;
}

// The group's element, taken at the first member's place. It has no title, as in Form.io. Its
// `name` is the field a condition reads; a member's `key` holds no data, so a condition on it
// finds no field and is reported.
function mapRadioGroup(first: FormioComponent, sourcePtr: string, targetPath: string, ctx: Ctx): SurveyJSONElement {
  const dataKey = first.name as string;
  const name = uniqueName(dataKey, ctx);
  const el: SurveyJSONElement = { type: "radiogroup", name, choices: [] };
  applyState(first, el);
  recordInput(first, el, ctx);
  // A checked member stores its `value` as written, and the group's empty value is "" (`Checkbox`).
  const choices: ChoiceSet = { values: [], empty: "", opaque: false };
  ctx.choiceSets.set(el, choices);
  ctx.fields.push({
    key: dataKey,
    dataPath: [...ctx.dataPath, dataKey].join("."),
    fullPath: [...ctx.fullPath, dataKey].join("."),
    name,
    type: "radio",
    multiple: false,
    grids: [...ctx.grids],
    choices
  });
  addRadioMember(el, first, sourcePtr, targetPath, ctx);
  return el;
}

function addRadioMember(group: SurveyJSONElement, member: FormioComponent, sourcePtr: string, targetPath: string, ctx: Ctx): void {
  const value = member.value !== undefined ? member.value : member.key;
  const choice: Record<string, unknown> = { value };
  if (typeof member.label === "string") choice.text = member.label;
  (group.choices as Record<string, unknown>[]).push(choice);
  const set = ctx.choiceSets.get(group);
  if (set) {
    set.values.push({ stored: value, formio: member.value });
    // A member with no value, or an empty one, stores what no choice describes.
    if (!isPrimitive(member.value) || member.value === "" || member.value === null) set.opaque = true;
  }
  if (member.validate?.required) group.isRequired = true;
  if (member.defaultValue === true) group.defaultValue = value;
  // A member's own condition would show or hide one option; the group carries none of them.
  if (member.conditional && typeof member.conditional === "object" && (isJsonConditional(member.conditional)
    || isLegacyConditional(member.conditional) || isSimpleConditional(member.conditional))) {
    ctx.report.assumed(FormioCodes.ASSUMED_CONDITIONAL, `${sourcePtr}/conditional`, `${targetPath}.choices`);
  }
  // Its logic would act on that option too, so each entry is refused.
  applyLogic({ ...member, conditional: undefined }, group, sourcePtr, targetPath, ctx, false);
}

/** Apply `title`/`description`/validators/conditional/custom-logic to a leaf. */
function applyCommon(comp: FormioComponent, el: SurveyJSONElement, sourcePtr: string, targetPath: string, ctx: Ctx): void {
  if (comp.label !== undefined && el.type !== "html") el.title = comp.label;
  if (comp.description) el.description = comp.description;
  if (comp.placeholder && (el.type === "text" || el.type === "comment")) el.placeholder = comp.placeholder;
  let defaultValue = readDefaultValue(comp.defaultValue);
  if (comp.type === "selectboxes") defaultValue = readSelectboxesDefault(defaultValue);
  if (comp.type === "survey") defaultValue = readSurveyDefault(comp, defaultValue, sourcePtr, targetPath, ctx);
  if (comp.type === "tags") defaultValue = readTagsDefault(comp, defaultValue);
  if (comp.multiple === true && isTextLike(comp.type)) {
    ctx.report.unsupported(FormioCodes.UNSUPPORTED_MULTIPLE, sourcePtr, targetPath);
    defaultValue = readSingleDefault(defaultValue);
  }
  if (comp.type === "day" || comp.type === "time" || comp.type === "datetime") {
    defaultValue = readDateTimeDefault(comp, defaultValue, sourcePtr, targetPath, ctx);
    // A datetime without its time or its date keeps the part its input reads.
    const iso = defaultValue;
    if (comp.type === "datetime" && typeof iso === "string") {
      if (el.inputType === "date") defaultValue = iso.slice(0, "YYYY-MM-DD".length);
      if (el.inputType === "time") defaultValue = iso.slice("YYYY-MM-DDT".length);
    }
  }
  const valueType = ctx.valueTypes.get(el);
  if (valueType && defaultValue !== undefined) defaultValue = castDefault(defaultValue, valueType, comp.type);
  if (defaultValue !== undefined) el.defaultValue = defaultValue;
  applyState(comp, el);

  if (comp.validate?.required) el.isRequired = true;
  const validators = readValidators(comp.validate);
  if (validators) el.validators = validators;
  if (el.type !== "html") {
    applyCustomMessage(comp, el, validators, sourcePtr, targetPath, ctx, false);
    reportInputOptions(comp, sourcePtr, targetPath, ctx);
  }

  // `validate.custom`: arbitrary JS -- refuse, content-free.
  if (typeof comp.validate?.custom === "string" && comp.validate.custom.trim().length > 0) {
    ctx.report.unsupported(FormioCodes.CUSTOM_VALIDATION, `${sourcePtr}/validate/custom`, targetPath);
  }

  applyLogic(comp, el, sourcePtr, targetPath, ctx);
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

// A radio or select default in its `dataType`, item by item for a multiple select. A value with no
// cast stays as written.
function castDefault(value: unknown, valueType: ValueType, type: unknown): unknown {
  const cast = (item: unknown) => {
    const result = castValue(item, valueType, type);
    return result === undefined ? item : result;
  };
  return Array.isArray(value) ? value.map(cast) : cast(value);
}

// A `selectboxes` default is `{ a: true, b: false }`; the SurveyJS checkbox value is the array of
// checked keys, in the object's order. No checked key gives no default.
function readSelectboxesDefault(value: unknown): unknown {
  if (value === undefined || typeof value !== "object" || Array.isArray(value)) return value;
  const checked = Object.keys(value as object).filter((key) => (value as Record<string, unknown>)[key] === true);
  return checked.length > 0 ? checked : undefined;
}

// A `survey` default is the `{ question: value }` object. Form.io's `defaultValue` getter also
// reads a truthy one of its values, written by older versions, as that value for every question,
// keyed by each question's `value` as written, even an empty one. Anything else gives no default
// and is reported.
function readSurveyDefault(comp: FormioComponent, value: unknown, sourcePtr: string, targetPath: string, ctx: Ctx): unknown {
  if (value === undefined || isObject(value)) return value;
  const values = Array.isArray(comp.values) ? comp.values : [];
  if (value && values.some((v) => v && v.value === value)) {
    const spread: Record<string, unknown> = {};
    const questions = Array.isArray(comp.questions) ? comp.questions : [];
    for (const question of questions) {
      if (isObject(question)) spread[String(question.value)] = value;
    }
    return spread;
  }
  ctx.report.assumed(FormioCodes.ASSUMED_DEFAULT_VALUE, `${sourcePtr}/defaultValue`, `${targetPath}.defaultValue`);
  return undefined;
}

// A `tags` field stored as an array splits a string default on its delimiter, as Form.io's
// `normalizeValue` does, dropping empty items.
function readTagsDefault(comp: FormioComponent, value: unknown): unknown {
  if (typeof value !== "string") return value;
  const delimiter = isText(comp.delimeter) ? comp.delimeter : ",";
  const items = value.split(delimiter).filter((item) => item);
  return items.length > 0 ? items : undefined;
}

// A `day`, `time` or `datetime` default in Form.io's format, as the ISO value its SurveyJS input
// reads. A `datetime` with no `defaultValue` reads `defaultDate` the same way. Form.io's empty day
// gives no default; anything else that does not parse gives none and is reported.
function readDateTimeDefault(comp: FormioComponent, value: unknown, sourcePtr: string, targetPath: string, ctx: Ctx): unknown {
  let key = "defaultValue";
  if (value === undefined && comp.type === "datetime" && typeof comp.defaultDate === "string" && comp.defaultDate.trim() !== "") {
    key = "defaultDate";
    value = comp.defaultDate;
  }
  if (value === undefined) return undefined;
  if (comp.type === "day" && typeof value === "string" && /^0+\/0+\/0+$/.test(value.trim())) return undefined;
  const iso = typeof value === "string" ? parseDateTime(comp, value.trim()) : undefined;
  if (iso === undefined) ctx.report.assumed(FormioCodes.ASSUMED_DEFAULT_VALUE, `${sourcePtr}/${key}`, `${targetPath}.defaultValue`);
  return iso;
}

// A `day` is `MM/DD/YYYY`, or `DD/MM/YYYY` with `dayFirst`, and gives `YYYY-MM-DD`. A `time` is
// 24-hour or `h:mm AM`, with optional seconds, and gives `HH:mm`. A `datetime` is a local ISO date
// and time, with optional seconds, and gives `YYYY-MM-DDTHH:mm`; one with a zone depends on where
// it is opened, so it does not parse.
function parseDateTime(comp: FormioComponent, text: string): string | undefined {
  if (comp.type === "day") {
    const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(text);
    if (!m) return undefined;
    const [day, month] = comp.dayFirst === true ? [m[1], m[2]] : [m[2], m[1]];
    return formatDate(Number(m[3]), Number(month), Number(day));
  }
  if (comp.type === "time") {
    const m = /^(\d{1,2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?(?:\s*([AaPp][Mm]))?$/.exec(text);
    if (!m) return undefined;
    let hours = Number(m[1]);
    if (m[4] !== undefined) {
      if (hours < 1 || hours > 12) return undefined;
      hours = (hours % 12) + (m[4].toUpperCase() === "PM" ? 12 : 0);
    }
    return formatTime(hours, Number(m[2]), m[3] === undefined ? 0 : Number(m[3]));
  }
  const m = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?)?$/.exec(text);
  if (!m) return undefined;
  const date = formatDate(Number(m[1]), Number(m[2]), Number(m[3]));
  const time = formatTime(Number(m[4] ?? 0), Number(m[5] ?? 0), Number(m[6] ?? 0));
  return date !== undefined && time !== undefined ? `${date}T${time}` : undefined;
}

// `YYYY-MM-DD` for a real calendar date; a zero part is no date.
function formatDate(year: number, month: number, day: number): string | undefined {
  const leap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
  if (year < 1 || days === undefined || day < 1 || day > days) return undefined;
  return `${String(year).padStart(4, "0")}-${pad2(month)}-${pad2(day)}`;
}

// `HH:mm`; the seconds are only checked.
function formatTime(hours: number, minutes: number, seconds: number): string | undefined {
  if (hours > 23 || minutes > 59 || seconds > 59) return undefined;
  return `${pad2(hours)}:${pad2(minutes)}`;
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
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
    case "form":
      return undefined;
    default:
      return comp.label;
  }
}

// Layout containers that give no element when none of their children maps to one.
const DROPPED_WHEN_EMPTY = new Set(["columns", "table", "well"]);

// A component that gives no element, a button or a layout container with no element in it, leaves
// its condition, logic and computed values no target, so each is refused with no target, as
// `applyLogic` refuses them for any other component: a `customConditional`, or else a condition, then
// each `logic` entry and each computed value. A button's condition, and that of a container around
// buttons, decides when the form can be submitted.
function reportDroppedLogic(comp: FormioComponent, sourcePtr: string, ctx: Ctx): void {
  if (typeof comp.customConditional === "string" && comp.customConditional.trim().length > 0) {
    ctx.report.unsupported(FormioCodes.CUSTOM_CONDITIONAL, `${sourcePtr}/customConditional`, "");
  } else if (holdsCondition(comp.conditional)) {
    ctx.report.assumed(FormioCodes.ASSUMED_CONDITIONAL, `${sourcePtr}/conditional`, "");
  }
  reportLogicEntries(comp, sourcePtr, "", ctx);
  reportCustomValues(comp, sourcePtr, "", ctx);
}

// A conditional Form.io checks: JSON logic, the legacy format, or the simple format with at least
// one condition that names a component (Form.io ignores the others).
function holdsCondition(cond: unknown): boolean {
  if (!isObject(cond)) return false;
  const c = cond as FormioConditional;
  if (isJsonConditional(c) || isLegacyConditional(c)) return true;
  return isSimpleConditional(c) && Array.isArray(c.conditions) && c.conditions.some((x) => !!x && !!x.component);
}

// Walks a container's children with `walkChildren` and applies its logic to `target`. A layout
// container in `DROPPED_WHEN_EMPTY` has its logic applied after the walk, and when none of its
// children gives an element it gives none either: its logic is reported (see `reportDroppedLogic`)
// and the result is `undefined`.
function walkContainer(
  comp: FormioComponent,
  target: Target,
  sourcePtr: string,
  targetPath: string,
  ctx: Ctx,
  walkChildren: () => SurveyJSONElement[]
): SurveyJSONElement[] | undefined {
  const droppedWhenEmpty = DROPPED_WHEN_EMPTY.has(comp.type as string);
  if (!droppedWhenEmpty) applyLogic(comp, target, sourcePtr, targetPath, ctx);
  const elements = walkChildren();
  if (droppedWhenEmpty) {
    if (elements.length === 0) {
      reportDroppedLogic(comp, sourcePtr, ctx);
      return undefined;
    }
    applyLogic(comp, target, sourcePtr, targetPath, ctx);
  }
  return elements;
}

// A container or nested form keeps its fields' data under its own key; the panel does not.
function reportContainerData(comp: FormioComponent, sourcePtr: string, targetPath: string, ctx: Ctx): void {
  if (comp.type === "container" || comp.type === "form") ctx.report.assumed(FormioCodes.ASSUMED_CONTAINER_DATA, sourcePtr, targetPath);
}

/** Map a container component to a SurveyJS `panel`, recursing into its children. */
function mapPanel(
  comp: FormioComponent,
  sourcePtr: string,
  targetPath: string,
  ctx: Ctx,
  childrenOverride?: { child: FormioComponent, ptr: string }[]
): SurveyJSONElement | null {
  const panel: SurveyJSONElement = { type: "panel", name: "" };
  reportContainerData(comp, sourcePtr, targetPath, ctx);
  const title = readContainerTitle(comp);
  if (title !== undefined) panel.title = title;
  applyState(comp, panel);

  const children = childrenOverride ?? indexedChildren(comp.components, `${sourcePtr}/components`);
  const elements = walkContainer(comp, panel, sourcePtr, targetPath, ctx, () => {
    const { reservedNames, fieldKeys } = ctx;
    // The keys of every enclosing form stay free, so a field of a middle form keeps its key too.
    if (comp.type === "form") {
      ctx.reservedNames = new Set([...(reservedNames ?? []), ...fieldKeys]);
      ctx.fieldKeys = collectFieldKeys(comp.components);
    }
    const exitScope = enterScope(comp, ctx, panel);
    try {
      return walk(children, `${targetPath}.elements`, ctx);
    } finally {
      exitScope();
      ctx.reservedNames = reservedNames;
      ctx.fieldKeys = fieldKeys;
    }
  });
  if (!elements) return null;
  // The tooltip's icon sits by the title.
  if (title !== undefined && isText(comp.tooltip)) reportStyling("tooltip", sourcePtr, targetPath, ctx);
  // Named after its children, so a field keeps a key the panel also has.
  panel.name = uniqueName(comp.key ?? sanitizePointer(sourcePtr), ctx);
  if (elements.length > 0) panel.elements = elements;
  return panel;
}

// A tab is `{ label, key, components }` with no `type`, so it cannot go through `mapComponent`.
// The `tabs` component becomes an untitled panel holding one panel per tab, titled with the
// tab's label, so the fields stay on one page (D2). A tab with no fields gives no element; its
// fields are walked before its name is taken, so an empty tab reserves no name.
function mapTabs(comp: FormioComponent, sourcePtr: string, targetPath: string, ctx: Ctx): SurveyJSONElement {
  const panel: SurveyJSONElement = { type: "panel", name: "" };
  applyState(comp, panel);
  applyLogic(comp, panel, sourcePtr, targetPath, ctx);

  const elements: SurveyJSONElement[] = [];
  const exitTabs = enterScope(comp, ctx, panel);
  (Array.isArray(comp.components) ? comp.components : []).forEach((tab, i) => {
    const tabPtr = `${sourcePtr}/components/${i}`;
    const tabPath = `${targetPath}.elements[${elements.length}]`;
    const exitTab = enterScope(tab ?? {}, ctx);
    const children = walk(indexedChildren(tab?.components, `${tabPtr}/components`), `${tabPath}.elements`, ctx);
    exitTab();
    if (children.length === 0) return;
    const tabPanel: SurveyJSONElement = { type: "panel", name: uniqueName(tab.key ?? sanitizePointer(tabPtr), ctx) };
    if (typeof tab.label === "string") tabPanel.title = tab.label;
    tabPanel.elements = children;
    elements.push(tabPanel);
  });
  exitTabs();
  // Named after its tabs, as a panel is after its children.
  panel.name = uniqueName(comp.key ?? sanitizePointer(sourcePtr), ctx);
  if (elements.length > 0) panel.elements = elements;
  return panel;
}

/** Map `datagrid` / `editgrid` to a dynamic panel (settled decision, flagged assumed). */
function mapDataGrid(comp: FormioComponent, sourcePtr: string, targetPath: string, ctx: Ctx): SurveyJSONElement {
  ctx.report.assumed(FormioCodes.ASSUMED_DATAGRID_MODEL, sourcePtr, targetPath);

  const panel: SurveyJSONElement = { type: "paneldynamic", name: "" };
  if (comp.label !== undefined) panel.title = comp.label;
  applyState(comp, panel);
  // The grid's condition is seen from its outer scope.
  applyLogic(comp, panel, sourcePtr, targetPath, ctx);

  // survey-core scopes template names to the dynamic panel, so the template is a name pool of its
  // own: a field keeps a key that a field outside the grid also has.
  const children = indexedChildren(comp.components, `${sourcePtr}/components`);
  const { usedNames, fieldKeys, reservedNames } = ctx;
  ctx.usedNames = new Set<string>();
  ctx.fieldKeys = collectFieldKeys(comp.components);
  ctx.reservedNames = undefined;
  const exitScope = enterScope(comp, ctx, panel);
  let template: SurveyJSONElement[];
  try {
    template = walk(children, `${targetPath}.templateElements`, ctx);
  } finally {
    exitScope();
    ctx.usedNames = usedNames;
    ctx.fieldKeys = fieldKeys;
    ctx.reservedNames = reservedNames;
  }
  if (template.length > 0) panel.templateElements = template;

  // Named after its template, in the outer pool. The grid is a field of its outer scope.
  panel.name = uniqueName(comp.key ?? sanitizePointer(sourcePtr), ctx);
  recordField(comp, panel.name, ctx);
  recordInput(comp, panel, ctx);

  if (comp.validate?.required) panel.isRequired = true;
  applyCustomMessage(comp, panel, undefined, sourcePtr, targetPath, ctx, true);
  applyGridOptions(comp, panel, sourcePtr, targetPath, ctx);
  reportInputOptions(comp, sourcePtr, targetPath, ctx);
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
  // Radio-type checkbox siblings sharing a `name` become one radio group at the first one's place.
  const radioGroups = new Map<string, { el: SurveyJSONElement, path: string }>();
  for (const { child, ptr } of children) {
    const path = `${targetPath}[${elements.length}]`;
    if (child && isRadioCheckbox(child)) {
      const group = radioGroups.get(child.name as string);
      if (group) {
        addRadioMember(group.el, child, ptr, group.path, ctx);
      } else {
        const el = mapRadioGroup(child, ptr, path, ctx);
        radioGroups.set(child.name as string, { el, path });
        elements.push(el);
      }
      continue;
    }
    const el = mapComponent(child, ptr, path, ctx);
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
  const ctx: Ctx = {
    report, usedNames: new Set<string>(), fieldKeys: collectFieldKeys(input.components),
    dataPath: [], fullPath: [], grids: [], fields: [], conditions: [],
    containers: [], inputs: [], conditionallyVisible: new Set<Target>(), templates: [], urlSources: [], castUrlValues: [],
    valueTypes: new Map<SurveyJSONElement, ValueType>(), choiceSets: new Map<SurveyJSONElement, ChoiceSet>(),
    requiredMessages: [], neverShown: new Set<Target>()
  };

  const topLevel = indexedChildren(input.components, "/components");
  const output: SurveyJSON = { pages: [] };
  if (typeof input.title === "string" && input.title.length > 0) output.title = input.title;

  if (input.display === "wizard") {
    // Each top-level container is promoted to a page; its children go directly
    // into the page (no double-wrapping panel).
    topLevel.forEach(({ child, ptr }) => {
      const page = wizardPage(child, ptr, output.pages!.length, ctx);
      if (page) output.pages!.push(page);
    });
  } else {
    // Plain form / pdf -> a single page, named after its fields so a field keyed `page1` keeps
    // its key.
    const elements = walk(topLevel, "pages[0].elements", ctx);
    output.pages!.push({ name: uniqueName("page1", ctx), elements });
  }

  resolveConditions(ctx);
  applyRequiredMessages(ctx);
  applyClearOnHide(ctx);
  resolveTemplates(ctx);
  resolveUrlSources(ctx);
  // A URL refused while it was resolved holds no response value.
  for (const record of ctx.castUrlValues) {
    if (record.el.choicesByUrl) ctx.report.assumed(FormioCodes.ASSUMED_DATA_SOURCE_VALUE, record.sourcePtr, record.targetPath);
  }
  return { output, report: report.build() };
}

/** Promote a top-level wizard component to a SurveyJS page. */
function wizardPage(comp: FormioComponent, sourcePtr: string, pageIndex: number, ctx: Ctx): SurveyJSONPage | null {
  const targetPath = `pages[${pageIndex}]`;
  // A top-level button gives no page: SurveyJS navigation replaces it.
  if (comp.type === "button") {
    mapComponent(comp, sourcePtr, "", ctx);
    return null;
  }
  const page: SurveyJSONPage = { name: "", elements: [] };
  const title = readContainerTitle(comp);
  if (title !== undefined) page.title = title;

  // A wizard page is a container: its `components` become the page elements. A
  // non-container top-level component (rare) becomes the page's single element,
  // which carries the component's own state.
  //
  // A layout container that gives no element gives no page either, as a button does.
  const isContainer = typeof comp.type === "string" && (PANEL_CONTAINERS.has(comp.type) || comp.type === "panel");
  if (isContainer && Array.isArray(comp.components)) {
    reportContainerData(comp, sourcePtr, targetPath, ctx);
    if (title !== undefined && isText(comp.tooltip)) reportStyling("tooltip", sourcePtr, targetPath, ctx);
    applyState(comp, page);
    const elements = walkContainer(comp, page, sourcePtr, targetPath, ctx, () => {
      const exitScope = enterScope(comp, ctx, page);
      try {
        return walk(indexedChildren(comp.components, `${sourcePtr}/components`), `${targetPath}.elements`, ctx);
      } finally {
        exitScope();
      }
    });
    if (!elements) return null;
    page.elements = elements;
  } else {
    const el = mapComponent(comp, sourcePtr, `${targetPath}.elements[0]`, ctx);
    if (el) page.elements.push(el);
    else if (DROPPED_WHEN_EMPTY.has(comp.type as string)) return null;
  }
  // Named after its elements, so a field keeps a key the page also has.
  page.name = uniqueName(comp.key ?? `page${pageIndex + 1}`, ctx);
  return page;
}

export { FormioCodes } from "./codes";
export type { ConversionResult } from "../report";
