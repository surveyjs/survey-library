import { ExpressionSiteKind } from "./symbols";

export interface ExpressionPropDef {
  name: string;
  kind: ExpressionSiteKind;
}

const condition = (name: string): ExpressionPropDef => ({ name: name, kind: "condition" });
const expression = (name: string): ExpressionPropDef => ({ name: name, kind: "expression" });

// Condition/expression properties every question carries (registered on the "question" class).
export const QUESTION_EXPRESSION_PROPS: Array<ExpressionPropDef> = [
  condition("visibleIf"),
  condition("enableIf"),
  condition("requiredIf"),
  condition("resetValueIf"),
  condition("setValueIf"),
  expression("setValueExpression"),
  expression("defaultValueExpression"),
];

export const PANELBASE_EXPRESSION_PROPS: Array<ExpressionPropDef> = [
  condition("visibleIf"),
  condition("enableIf"),
  condition("requiredIf"),
];

// Extra expression-bearing properties per question type / family.
// The walker adds family props on top of QUESTION_EXPRESSION_PROPS.
export const TYPE_EXPRESSION_PROPS: { [type: string]: Array<ExpressionPropDef> } = {
  selectbase: [condition("choicesVisibleIf"), condition("choicesEnableIf")],
  matrixbase: [condition("columnsVisibleIf"), condition("rowsVisibleIf")],
  // registered as "expression" in the serializer, semantically a per-panel condition
  paneldynamic: [condition("templateVisibleIf")],
  text: [expression("minValueExpression"), expression("maxValueExpression")],
  slider: [expression("minValueExpression"), expression("maxValueExpression")],
  expression: [expression("expression")],
};

export const MULTIPLETEXT_ITEM_EXPRESSION_PROPS: Array<ExpressionPropDef> = [
  expression("minValueExpression"),
  expression("maxValueExpression"),
  expression("defaultValueExpression"),
];

// matrixdropdowncolumn own props + props commonly inherited from the cell question type.
export const MATRIX_COLUMN_EXPRESSION_PROPS: Array<ExpressionPropDef> = [
  condition("visibleIf"),
  condition("enableIf"),
  condition("requiredIf"),
  condition("resetValueIf"),
  condition("setValueIf"),
  condition("choicesVisibleIf"),
  condition("choicesEnableIf"),
  expression("setValueExpression"),
  expression("defaultValueExpression"),
  expression("totalExpression"),
  expression("minValueExpression"),
  expression("maxValueExpression"),
];

export const ITEMVALUE_EXPRESSION_PROPS: Array<ExpressionPropDef> = [
  condition("visibleIf"),
  condition("enableIf"),
];

// Sets, not object literals: these are looked up with the raw JSON "type" string,
// which must not collide with Object.prototype keys ("constructor", ...).
export const SELECTBASE_TYPES = new Set<string>([
  "radiogroup", "dropdown", "checkbox", "tagbox", "imagepicker", "ranking", "buttongroup",
]);

export const MATRIXDROPDOWN_TYPES = new Set<string>(["matrixdropdown", "matrixdynamic"]);

export const MATRIXBASE_TYPES = new Set<string>(["matrix", "matrixdropdown", "matrixdynamic"]);

export const PANEL_TYPES = new Set<string>(["panel", "flowpanel"]);

export const KNOWN_QUESTION_TYPES: Array<string> = [
  "boolean", "buttongroup", "checkbox", "comment", "dropdown", "expression",
  "file", "flowpanel", "html", "image", "imagemap", "imagepicker", "matrix",
  "matrixdropdown", "matrixdynamic", "multipletext", "panel", "paneldynamic",
  "radiogroup", "ranking", "rating", "signaturepad", "slider", "tagbox", "text",
];

const knownTypesSet = new Set<string>(KNOWN_QUESTION_TYPES);
export function isKnownQuestionType(type: string): boolean {
  return knownTypesSet.has(type);
}

// "questions" is a legacy alternativeName for the elements array on the survey root,
// on panels/pages and on the paneldynamic template.
export const ELEMENTS_ALIASES: Array<string> = ["elements", "questions"];

export interface TriggerTypeDef {
  // JSON "type" (class name with the "trigger" suffix stripped)
  targets: Array<{ prop: string, kind: "questionvalue" | "question" | "page", isArray?: boolean }>;
  setsValue?: boolean;
  extraExpressionProps?: Array<ExpressionPropDef>;
}

// Map, not an object literal: looked up with the raw JSON trigger "type".
export const TRIGGER_TYPES = new Map<string, TriggerTypeDef>([
  ["complete", { targets: [] }],
  ["visible", {
    targets: [
      { prop: "questions", kind: "question", isArray: true },
      { prop: "pages", kind: "page", isArray: true },
    ],
  }],
  ["setvalue", {
    targets: [{ prop: "setToName", kind: "questionvalue" }],
    setsValue: true,
  }],
  ["copyvalue", {
    targets: [
      { prop: "setToName", kind: "questionvalue" },
      { prop: "fromName", kind: "questionvalue" },
    ],
    setsValue: true,
  }],
  ["skip", { targets: [{ prop: "gotoName", kind: "question" }] }],
  ["runexpression", {
    targets: [{ prop: "setToName", kind: "questionvalue" }],
    setsValue: true,
    extraExpressionProps: [expression("runExpression")],
  }],
]);

// (className, propName) pairs the drift-guard test may find via prop.isExpression
// that the linter deliberately does not analyze. Every entry needs a reason.
export const IGNORED_EXPRESSION_PROPS: Array<{ className: string, propName: string, reason: string }> = [];

// Flat coverage set for the drift-guard test: "classname.propname" (lowercase) the
// linter analyzes. Family entries are expanded by the test using Serializer inheritance.
export function getCoveredExpressionProps(): Array<{ className: string, propName: string }> {
  const res: Array<{ className: string, propName: string }> = [];
  const add = (className: string, defs: Array<ExpressionPropDef> | Array<string>) => {
    (<Array<any>>defs).forEach(def => {
      res.push({ className: className, propName: (typeof def === "string" ? def : def.name).toLowerCase() });
    });
  };
  add("question", QUESTION_EXPRESSION_PROPS);
  add("panelbase", PANELBASE_EXPRESSION_PROPS);
  add("selectbase", TYPE_EXPRESSION_PROPS.selectbase);
  add("matrixbase", TYPE_EXPRESSION_PROPS.matrixbase);
  add("matrixdropdown", [{ name: "rowsVisibleIf", kind: "condition" }]);
  add("paneldynamic", TYPE_EXPRESSION_PROPS.paneldynamic);
  add("text", TYPE_EXPRESSION_PROPS.text);
  add("slider", TYPE_EXPRESSION_PROPS.slider);
  add("expression", TYPE_EXPRESSION_PROPS.expression);
  // the expression question re-declares inherited question props (mostly as
  // non-serializable); the walker scans them through QUESTION_EXPRESSION_PROPS
  add("expression", ["enableIf", "requiredIf", "resetValueIf", "setValueIf", "setValueExpression", "defaultValueExpression"]);
  // questionnonvalue (html/image) re-declares enableIf/requiredIf - scanned as question props
  add("nonvalue", ["enableIf", "requiredIf"]);
  // sliderlabel extends itemvalue - scanned via addItemValueSites over customLabels
  add("sliderlabel", ["visibleIf", "enableIf"]);
  add("multipletextitem", MULTIPLETEXT_ITEM_EXPRESSION_PROPS);
  add("matrixdropdowncolumn", MATRIX_COLUMN_EXPRESSION_PROPS);
  add("itemvalue", ITEMVALUE_EXPRESSION_PROPS);
  add("calculatedvalue", ["expression"]);
  add("trigger", ["expression"]);
  add("runexpressiontrigger", ["runExpression"]);
  add("expressionitem", ["expression"]);
  add("expressionvalidator", ["expression"]);
  return res;
}
