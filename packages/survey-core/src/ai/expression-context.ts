import { Serializer } from "../jsonobject";
import { FunctionFactory, IFunctionRegistration } from "../functionsfactory";
import { getConditionOperatorNames } from "../conditions/conditionOperators";
import { settings } from "../settings";
import { surveyLocalization } from "../surveyStrings";
import type { ItemValue } from "../itemvalue";
import type { MatrixDropdownColumn } from "../question_matrixdropdowncolumn";
import type { Question } from "../question";
import { getExpressionGuideText } from "./expression-guide";

export interface IExpressionContextChoice { value: any, text: string }
export interface IExpressionVariable {
  name: string;
  title?: string;
  kind: "question" | "calculatedValue" | "hostVariable" | "variable";
  type?: string;
  valueType?: string;
  page?: string;
  choices?: Array<IExpressionContextChoice>;
  rows?: Array<IExpressionContextChoice>;
  columns?: Array<{ name: string, title?: string, cellType?: string }>;
}
export interface IExpressionContextFunction {
  name: string;
  isCustom: boolean;
  isAsync: boolean;
  signature?: string;
  description?: string;
}
export interface IExpressionContextOperator {
  name: string;
  spellings: Array<string>;
  // the question types a condition editor offers the operator for; empty: every type
  questionTypes: Array<string>;
}
export interface IExpressionContext {
  guideVersion: string;
  target: {
    isCondition: boolean,
    resultType?: string,
    objects: Array<{ type: string, name?: string, title?: string, path?: string, propertyName: string }>,
    // the innermost dynamic panel or matrix every target runs in, once per entry or row
    container?: { type: "paneldynamic" | "matrixdynamic" | "matrixdropdown", name: string, title?: string, valueName?: string },
    // the targets run in different scopes; "scopes" lists only what they have in common
    mixedScopes?: boolean,
  };
  variables: Array<IExpressionVariable>;
  scopes: Array<{ prefix: string, meaning: string, names?: Array<string> }>;
  functions: Array<IExpressionContextFunction>;
  operators: Array<IExpressionContextOperator>;
  examples: Array<{ path: string, propertyName: string, expression: string }>;
  // creator: the Survey Creator UI locale, when the request comes from Creator. The explanation is
  // written in it, else in the survey locale. The key keeps its name: hosts may read the context JSON.
  locales: { creator?: string, survey: string };
  truncated: { variables: boolean, choices: boolean, examples: boolean };
}

// The functions registered by the time this module loads are survey-core's own; whatever an
// application registers later is a custom function.
const builtInFunctions: Array<string> = FunctionFactory.Instance.getAll();

// Every spelling the expression parser (survey-core expressions/expressionParserCore.ts) accepts per operator. Not
// OperandMaker.signs, which is a display table. A test parses each spelling to its operator.
export const expressionOperatorSpellings: { [name: string]: Array<string> } = {
  empty: ["empty"],
  notempty: ["notempty"],
  equal: ["=", "==", "equal"],
  notequal: ["!=", "<>", "notequal"],
  contains: ["contains", "contain", "*="],
  notcontains: ["notcontains", "notcontain"],
  anyof: ["anyof"],
  noneof: ["noneof"],
  allof: ["allof"],
  greater: [">", "greater"],
  less: ["<", "less"],
  greaterorequal: [">=", "greaterorequal"],
  lessorequal: ["<=", "lessorequal"],
  and: ["and", "&&"],
  or: ["or", "||"],
  negate: ["!", "negate"],
  plus: ["+"],
  minus: ["-"],
  mul: ["*"],
  div: ["/"],
  mod: ["%"],
  power: ["^", "power"],
};
const nonConditionOperators = ["and", "or", "negate", "plus", "minus", "mul", "div", "mod", "power"];
// Spellings the grammar accepts that the AI is not offered: "negate(" parses as a call of a function
// named negate, which does not exist, so negation is advertised as ! only, as the guide teaches it.
const untaughtOperatorSpellings: Array<string> = ["negate"];

// An entry of a scope table: key is its settings.expressionVariables entry.
export interface IExpressionScopeEntry { key: string, meaning: string, hasNames?: boolean }

// What each scope prefix means, keyed by its settings.expressionVariables entry; the prefix itself
// is read from the settings at call time, so a renamed prefix is what the AI is told.
export const expressionPanelScope: Array<IExpressionScopeEntry> = [
  { key: "panel", meaning: "a question of the same dynamic panel entry: {panel.name}", hasNames: true },
  { key: "prevPanel", meaning: "a question of the previous dynamic panel entry: {prevPanel.name}", hasNames: true },
  { key: "nextPanel", meaning: "a question of the next dynamic panel entry: {nextPanel.name}", hasNames: true },
  { key: "parentPanel", meaning: "a question of the entry of the outer dynamic panel: {parentPanel.name}" },
  { key: "panelIndex", meaning: "the zero-based index of the dynamic panel entry: {panelIndex}" },
  { key: "visiblePanelIndex", meaning: "the zero-based index of the entry among the visible ones: {visiblePanelIndex}" },
];
export const expressionRowScope: Array<IExpressionScopeEntry> = [
  { key: "row", meaning: "a cell of the same matrix row: {row.columnName}", hasNames: true },
  { key: "prevRow", meaning: "a cell of the previous row: {prevRow.columnName}", hasNames: true },
  { key: "nextRow", meaning: "a cell of the next row: {nextRow.columnName}", hasNames: true },
  { key: "totalRow", meaning: "a cell of the total row: {totalRow.columnName}", hasNames: true },
  { key: "rowIndex", meaning: "the zero-based index of the row: {rowIndex}" },
  { key: "visibleRowIndex", meaning: "the zero-based index of the row among the visible ones: {visibleRowIndex}" },
  { key: "rowValue", meaning: "the value (name) of the row of a matrix with fixed rows: {rowValue}" },
];
export const expressionItemScope: Array<IExpressionScopeEntry> = [
  { key: "item", meaning: "the value of the choice, row or column being tested: {item}" },
];

// The prefix a scope entry is written with: its settings.expressionVariables value, else the key.
export function getExpressionScopePrefix(key: string): string {
  const res = (<any>settings.expressionVariables)[key];
  return typeof res === "string" && !!res ? res : key;
}

// The type of the value a question holds, as an expression reads it: "array", "object", "boolean",
// "number", "date" or "string". The question reports it itself (a boolean with valueTrue "yes" holds a
// string, a range slider an array); a question nobody types into (an expression, html) has none.
export function getExpressionValueType(question: Question): string {
  if (!question || !question.getValueType) return undefined;
  return question.hasInput ? question.getValueType() : undefined;
}

export function toExpressionChoices(items: Array<ItemValue>): Array<IExpressionContextChoice> {
  if (!Array.isArray(items)) return undefined;
  return items.map(item => ({ value: item.value, text: item.text }));
}

// The items a select question offers as values. In Creator's design mode the visible items also hold
// the "new item" placeholder and the special items that are off - the question that owns the list
// knows which it really shows - and they leave out carried-forward and URL-loaded choices: there the
// source question's values or the static choices stand in for them. visited stops a choicesFromQuestion cycle.
function getValueItems(question: any, visited: Array<any>): Array<ItemValue> {
  const owner = question.contentQuestion || question;
  const items: Array<ItemValue> = (question.getValueChoices() || [])
    .filter((item: ItemValue) => typeof owner.isItemInList !== "function" || owner.isItemInList(item));
  if (!owner.isInDesignMode || typeof owner.isBuiltInChoice !== "function" || visited.indexOf(owner) > -1) return items;
  visited.push(owner);
  let choices: Array<ItemValue>;
  const source = !!owner.choicesFromQuestion ? owner.getCarryForwardQuestion() : null;
  if (!!source && owner.carryForwardQuestionType === "select") {
    choices = getValueItems(source, visited).filter(item => !source.isBuiltInChoice(item));
  } else if (!!owner.choicesByUrl && !!owner.choicesByUrl.url) {
    choices = owner.choices || [];
  }
  return !!choices ? choices.concat(items.filter(item => owner.isBuiltInChoice(item))) : items;
}

// The values a question can hold, as a condition compares them: what the question offers -
// generated, copied from another question, loaded by URL or wrapped by a component - with the
// built-in items it shows (none, other, ...).
export function getExpressionChoices(question: Question): Array<IExpressionContextChoice> {
  if (!question || !question.getType) return undefined;
  const q: any = question;
  if (question.isSelectQuestion() && typeof q.getValueChoices === "function") {
    const items = getValueItems(q, []);
    return items.length > 0 ? toExpressionChoices(items) : undefined;
  }
  if (question.getType() === "matrix") return toExpressionChoices(q.columns);
  return undefined;
}

// The name of the page an element or a matrix column is on; undefined when it is on none.
export function getExpressionPageName(obj: any): string {
  let page = obj?.page;
  if (!page && !!obj?.colOwner) page = obj.colOwner.page;
  return !!page ? page.name : undefined;
}

// Fills a variable with what the question says about its value: its type, value type, page,
// choices, rows and columns.
export function describeExpressionQuestion(variable: IExpressionVariable, question: Question): void {
  if (!question || !question.getType) return;
  const q: any = question;
  const type = question.getType();
  variable.type = type;
  const valueType = getExpressionValueType(question);
  if (!!valueType) variable.valueType = valueType;
  const page = getExpressionPageName(question);
  if (!!page) variable.page = page;
  const choices = getExpressionChoices(question);
  if (!!choices) variable.choices = choices;
  if (type === "matrix" || type === "matrixdropdown") variable.rows = toExpressionChoices(q.rows);
  if (Serializer.isDescendantOf(type, "matrixdropdownbase")) {
    variable.columns = q.columns.map((col: MatrixDropdownColumn) => ({ name: col.name, title: col.title, cellType: col.cellType }));
  }
  if (type === "paneldynamic") {
    variable.columns = q.template.questions.map((tq: Question) => ({ name: tq.name, title: tq.title, cellType: tq.getType() }));
  }
  if (type === "multipletext") {
    variable.columns = q.items.map((item: any) => ({ name: item.name, title: item.title, cellType: item.inputType }));
  }
}

function getSignature(reg: IFunctionRegistration): string {
  if (!Array.isArray(reg.parameters)) return undefined;
  const params = reg.parameters.map(p => (p.isRest ? "..." : "") + p.name + (p.optional ? "?" : "") + (!!p.type ? ": " + p.type : ""));
  return reg.name + "(" + params.join(", ") + ")" + (!!reg.returnType ? ": " + reg.returnType : "");
}

// The registered functions an expression may call. excludedNames are left out: Survey Creator
// passes the functions it registers for its own editors.
export function getExpressionFunctions(excludedNames?: Array<string>): Array<IExpressionContextFunction> {
  const excluded = excludedNames || [];
  return FunctionFactory.Instance.getRegistrations()
    .filter(reg => excluded.indexOf(reg.name) < 0)
    .map(reg => {
      const res: IExpressionContextFunction = {
        name: reg.name, isCustom: builtInFunctions.indexOf(reg.name) < 0, isAsync: !!reg.isAsync,
      };
      const signature = getSignature(reg);
      if (!!signature) res.signature = signature;
      if (!!reg.description) res.description = reg.description;
      return res;
    });
}

function getTaughtSpellings(name: string): Array<string> {
  return (expressionOperatorSpellings[name] || [name]).filter(sp => untaughtOperatorSpellings.indexOf(sp) < 0);
}

// The operators an expression may use: the condition operators with the question types
// settings.logic.operators offers them for, then and, or, negation and arithmetic.
export function getExpressionOperators(): Array<IExpressionContextOperator> {
  const table: { [name: string]: Array<string> } = settings.logic.operators;
  const res: Array<IExpressionContextOperator> = getConditionOperatorNames().map(name => ({
    name: name, spellings: getTaughtSpellings(name),
    questionTypes: Array.isArray(table[name]) ? table[name].slice() : [],
  }));
  nonConditionOperators.forEach(name => res.push({ name: name, spellings: getTaughtSpellings(name), questionTypes: [] }));
  return res;
}

// The user turn of a request: what the system prompt's model is asked to do this time. Built here
// so a host does not write its own and drop a part of it - a fix message without "return an empty
// expression" got "false" back from a model that could not express the request.
// A modify (and a refine of a result) must not change what the author did not ask about. Models
// regrouped "a or b and c" as "(a or b) and c" while adding a clause, and answered "this never
// shows, please fix it" with "false".
const modifyRules = "The request may describe a problem with the current expression (for example, that the question never shows) rather than a change. " +
  "Then return the corrected expression that does what the author intended, not one that reproduces the problem. " +
  "Keep the meaning of every part the request does not change. " +
  "If the current expression relies on and binding tighter than or, keep that grouping and write the parentheses out. " +
  "If you change the meaning of a part the author did not mention, say so in the explanation.";

export function buildExpressionInstruction(kind: string, prompt: string, expression: string,
  findings?: Array<{ severity: string, message: string }>): string {
  const emptyOption = "If the request cannot be expressed with the listed variables and functions, return an empty expression and say why in the explanation.";
  switch(kind) {
    case "generate":
      return "Write an expression for this request:\n" + (prompt || "") + "\n\n" + emptyOption;
    case "modify":
      return "Current expression:\n" + (expression || "") + "\n\nChange it as follows:\n" + (prompt || "") + "\n\n" + modifyRules + "\n\n" + emptyOption;
    case "fix":
      return "This expression failed the check:\n" + (expression || "") + "\n\nProblems found:\n" +
        (findings || []).map(f => "- [" + f.severity + "] " + f.message).join("\n") + "\n\n" +
        "Return a corrected expression that still does what the author asked. " +
        "If it cannot be corrected with the listed variables and functions, return an empty expression and say why in the explanation.";
    case "explain":
      return "Explain what this expression does, in plain words for a form author:\n" + (expression || "") + "\n\n" +
        "Put the explanation in \"explanation\" and return the expression unchanged in \"expression\".";
    default:
      return prompt || "";
  }
}

// The texts of the system prompt that say who asks and where the explanation is shown. Survey Creator
// passes its own; a text that is not set is the neutral default of defaultSystemPromptTexts.
export interface IExpressionSystemPromptTexts {
  // the first line of the prompt
  intro?: string;
  // what the explanation language is, after its name: "the language of the user interface"
  uiLanguage?: string;
  // the English name of a locale; the locale code itself when there is none
  getLocaleName?: (locale: string) => string;
}
const defaultSystemPromptTexts: IExpressionSystemPromptTexts = {
  intro: "You write SurveyJS expressions for the user. The user describes in words what the expression must do; you answer with one expression.",
  uiLanguage: "the language of the user interface",
  // the first letter upper-cased: survey-core has no English name for "en" and returns its native name "english"
  getLocaleName: (locale: string): string => {
    const name = surveyLocalization.getLocaleName(locale, true);
    return !!name && name !== locale ? name.charAt(0).toUpperCase() + name.substring(1) : name;
  },
};

// The explanation is shown in the user interface, so it is written in the UI language. Named explicitly:
// "the language the author wrote in" left the model to guess and it answered an English request in German.
function getExplanationLanguage(locale: string, getLocaleName: (locale: string) => string): string {
  locale = locale || "en";
  const name = getLocaleName(locale);
  return !!name && name !== locale ? name + " (locale code \"" + locale + "\")" : "the language with locale code \"" + locale + "\"";
}

// The target is evaluated once per entry or row and decides for it. Unsaid, a model asked about
// "children under 10" from inside the panel aggregated over {kids} instead of reading {panel.kidAge}.
function getPerEntryRule(context: IExpressionContext): string {
  const container = context.target.container;
  const isPanel = container.type === "paneldynamic";
  // the prefix as the scopes list names it, so the prompt follows the context alone
  const meaning = (isPanel ? expressionPanelScope : expressionRowScope)[0].meaning;
  const scope = context.scopes.filter(s => s.meaning === meaning)[0];
  const prefix = !!scope ? scope.prefix : isPanel ? "panel" : "row";
  const unit = isPanel ? "entry" : "row";
  let res = "- The expression runs once for each " + unit + " of the " + (isPanel ? "dynamic panel" : "matrix") +
    " \"" + container.name + "\"" + (!!container.title ? " (" + container.title + ")" : "") + " and decides for that " + unit + ". " +
    (isPanel ? "Read the entry's own questions" : "Read the row's own cells") + " with {" + prefix + ".name}.";
  // a nested container's value is no survey-level variable: there is nothing to aggregate over
  const valueName = container.valueName || container.name;
  if (context.variables.some(v => v.name === valueName)) {
    res += " Use the inArray functions over {" + valueName + "} only when the request is about all " + (isPanel ? "entries" : "rows") + ".";
  }
  return res;
}

// Same context in, byte-identical prompt out: a host may cache it.
export function buildExpressionSystemPrompt(context: IExpressionContext, texts?: IExpressionSystemPromptTexts): string {
  const t: IExpressionSystemPromptTexts = Object.assign({}, defaultSystemPromptTexts);
  Object.keys(texts || {}).forEach(key => { if ((<any>texts)[key] !== undefined) (<any>t)[key] = (<any>texts)[key]; });
  const lines: Array<string> = [];
  lines.push(t.intro);
  lines.push("");
  lines.push(getExpressionGuideText());
  lines.push("");
  lines.push("## The place being edited and what the expression can use (JSON)");
  lines.push(JSON.stringify(context, null, 2));
  lines.push("");
  lines.push("## Rules");
  lines.push("- Use only the names listed under \"variables\" and only the functions listed under \"functions\".");
  lines.push("- Compare a question with the values of its choices, never with their texts.");
  const target = context.target;
  if (context.scopes.length > 0) lines.push("- Use the scope prefixes listed under \"scopes\" and no others.");
  else lines.push(target.mixedScopes ? "- Use no scope prefix." : "- Use no scope prefix: this expression runs at the survey level.");
  if (!!target.container) lines.push(getPerEntryRule(context));
  if (target.mixedScopes) lines.push("- This expression is used at places with different scopes; use only references that work at all of them.");
  if (context.target.isCondition) {
    lines.push("- The expression is a condition: it must evaluate to true or false.");
  } else if (!!context.target.resultType) {
    lines.push("- The expression must evaluate to a value of type " + context.target.resultType + ".");
  }
  const partial = Object.keys(context.truncated).filter(key => (<any>context.truncated)[key]);
  if (partial.length > 0) {
    lines.push("- Some lists are partial (" + partial.join(", ") + "): the survey has more than is shown.");
  }
  lines.push("- When the request cannot be expressed with what is listed, say so in the explanation and return an empty expression.");
  lines.push("");
  lines.push("## Answer");
  lines.push("Answer with JSON only, nothing around it: {\"expression\": \"...\", \"explanation\": \"...\"}. The explanation is one or two sentences.");
  const locales = context.locales;
  lines.push("Write the explanation in " + getExplanationLanguage(locales && (locales.creator || locales.survey), t.getLocaleName) +
    ", " + t.uiLanguage + ", whatever language the request or the survey texts use.");
  return lines.join("\n");
}
