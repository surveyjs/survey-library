import { ExpressionSiteKind, TriggerTargetRef } from "./symbols";

// Linter semantics the serializer metadata does not carry. The lists of types and of
// expression-bearing properties are NOT here, and neither are the container array keys
// or the trigger/validator class-name suffixes: they are read from the Serializer at
// runtime (see metadata.ts), so a property or type added to the core - or registered
// by the application - is analyzed without touching this file.
//
// Sets and Maps, not object literals: the keys are matched against raw JSON type
// strings and against property names the application may have registered, which must
// not collide with Object.prototype keys ("constructor", ...).

// Conditions over the owner's own items (choices, matrix rows/columns): they evaluate
// with an itemValue frame, so the walker adds them with an extra scope frame instead
// of the plain element scope.
export const ITEMVALUE_SCOPED_PROPS = new Set<string>([
  "choicesvisibleif", "choicesenableif", "columnsvisibleif", "rowsvisibleif",
]);

// Evaluated against the dynamic-panel template scope. The walker adds these inside
// its paneldynamic branch, once the template frame exists, and skips them elsewhere.
export const TEMPLATE_SCOPED_PROPS = new Set<string>(["templatevisibleif"]);

// Localizable strings processed in the scope of a collection item rather than in the
// scope of the question that owns them: a dynamic-panel title is rendered per panel
// (QuestionPanelDynamicItem), and a matrix single-input title per row
// (processSingleInputTitle runs it through row.getTextProcessor()).
export const TEXT_SCOPED_PROPS = new Map<string, "template" | "row">([
  ["templatetitle", "template"],
  ["templatedescription", "template"],
  ["templatetabtitle", "template"],
  ["tabtitleplaceholder", "template"],
  ["singleinputtitletemplate", "row"],
]);

// Localizable strings that are not piping texts at all: the runtime takes them apart itself
// ({no}/{title}/{require} of a question title pattern) and never runs them through the text
// processor, so a {...} in them names nothing.
export const TEXT_TEMPLATE_PROPS = new Set<string>(["questiontitletemplate"]);

// Properties whose registered type does not match their runtime semantics.
// templateVisibleIf is registered as "expression", but is a per-panel condition.
export const PROP_KIND_OVERRIDES = new Map<string, ExpressionSiteKind>([
  ["templatevisibleif", "condition"],
]);

// Serializer property type -> the kind of reference a trigger target carries.
// A trigger property with any other type is not a target.
export const TRIGGER_TARGET_KINDS = new Map<string, { kind: TriggerTargetRef["kind"], isArray?: boolean }>([
  ["questionvalue", { kind: "questionvalue" }],
  ["question", { kind: "question" }],
  ["page", { kind: "page" }],
  ["questions", { kind: "question", isArray: true }],
  ["pages", { kind: "page", isArray: true }],
]);
