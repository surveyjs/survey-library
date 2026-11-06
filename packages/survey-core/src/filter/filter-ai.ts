import { ItemValue } from "../itemvalue";
import { surveyLocalization } from "../surveyStrings";
import { IDynamicDataFilterField } from "../dynamic-data/dynamic-data-filter-fields";
import { IFilterCondition } from "../interfaces/ui-interfaces";
import { AIRequestIssue, AIResponseFormat } from "../interfaces/ai-interfaces";
import { IAIFeature } from "../ai/ai-request";
import { isAIObject } from "../ai/ai-response";
import { parseExpressionResponse, readExpressionData } from "../ai/expression-response";
import { analyzeFilterExpression, FilterExpressionProblem, getFieldsByValueName, getFilterFieldOperators, normalizeFilterCondition } from "./filter-conditions";
import { getFieldChoiceItems } from "./filter-expression";
import { FilterFieldEditorKind, getFilterFieldListItems } from "./filter-field-kinds";
import { filterPresetTitleMaxLength } from "./filter-preset-dialog";

// The AI side of a Filter Control: what the model is told about the control's fields, and how its
// answer is read and checked. The answer is a filter the control can show as conditions - one per
// field, joined by "and" - or it is sent back with what is wrong with it (see AIRequestSession).

// Raise whenever the guide or the rules of the prompt change: a host that caches a prompt knows it is stale.
export const filterAIGuideVersion = "1";
// The choices of one field the context lists; the rest are left out and truncated.choices says so.
export const filterAIMaxChoices = 100;

export interface IFilterAIField {
  // the variable the expression names: {name}
  name: string;
  title: string;
  valueType: string;
  editor: FilterFieldEditorKind;
  operators: Array<string>;
  choices?: Array<{ value: any, text: string }>;
}
export interface IFilterAIContext {
  guideVersion: string;
  fields: Array<IFilterAIField>;
  locales: { survey: string };
  truncated: { choices: boolean };
}
// What the context is read from: the control's public API.
export interface IFilterAIContextOwner {
  getAllFieldKeys(): Array<string>;
  getFieldByName(key: string): IDynamicDataFilterField;
  getFieldOperators(key: string): Array<string>;
  getFieldEditorKind(key: string): FilterFieldEditorKind;
  getLocale(): string;
}

// Every field the Filters dialog shows, in its order.
export function buildFilterAIContext(owner: IFilterAIContextOwner): IFilterAIContext {
  const locale = owner.getLocale() || surveyLocalization.defaultLocale;
  const res: IFilterAIContext = { guideVersion: filterAIGuideVersion, fields: [], locales: { survey: locale }, truncated: { choices: false } };
  owner.getAllFieldKeys().forEach((key: string): void => {
    const field = owner.getFieldByName(key);
    if (!field) return;
    const entry: IFilterAIField = {
      name: field.valueName,
      title: (!!field.locTitle && field.locTitle.calculatedText) || field.name,
      valueType: field.valueType,
      editor: owner.getFieldEditorKind(key),
      operators: owner.getFieldOperators(key)
    };
    const items = getFilterFieldListItems(field, locale);
    if (items.length > 0) {
      if (items.length > filterAIMaxChoices) res.truncated.choices = true;
      entry.choices = items.slice(0, filterAIMaxChoices).map((item): { value: any, text: string } => ({ value: item.value, text: item.text }));
    }
    res.fields.push(entry);
  });
  return res;
}

// The examples of the guide, over the fields name (text), country (choices "de", "fr"), price
// (number) and discontinued (boolean). A test runs each through analyzeFilterExpression, so an
// example shown as valid decomposes and one shown as invalid does not.
export const filterAIGuideExamples: Array<{ expression: string, isValid: boolean, note?: string }> = [
  { expression: "{price} > 100", isValid: true },
  { expression: "{country} = 'de'", isValid: true, note: "a choice is compared by its value, never by its text \"Germany\"" },
  { expression: "{country} anyof ['de', 'fr']", isValid: true, note: "any of several values" },
  { expression: "{country} noneof ['de']", isValid: true, note: "none of the values" },
  { expression: "{name} contains 'tea'", isValid: true, note: "the text holds 'tea'" },
  { expression: "{discontinued} = true", isValid: true },
  { expression: "{name} notempty", isValid: true, note: "has a value; empty is the opposite" },
  { expression: "{price} > 10 and {country} = 'de'", isValid: true, note: "conditions on different fields, joined by and" },
  { expression: "{price} > 10 or {country} = 'de'", isValid: false, note: "or is not allowed: only and" },
  { expression: "{price} >= 10 and {price} <= 20", isValid: false, note: "one condition per field" },
  { expression: "{price} * 2 > 10", isValid: false, note: "no arithmetic" },
  { expression: "!({country} = 'de')", isValid: false, note: "no !: use notequal or noneof" },
];
function getGuideText(): string {
  const lines: Array<string> = [];
  lines.push("## Filter expressions");
  lines.push("A filter is one or more conditions joined by \"and\", at most one condition per field. A condition is a field name in curly braces, an operator and a value: {price} > 100. Strings go in single quotes, an array of values in square brackets. Operators: = != < > <= >= contains notcontains anyof noneof allof empty notempty.");
  lines.push("Examples:");
  filterAIGuideExamples.forEach((e): void => {
    lines.push("- " + (e.isValid ? "valid" : "NOT valid") + ": " + e.expression + (!!e.note ? " - " + e.note : ""));
  });
  return lines.join("\n");
}

// Same context in, byte-identical prompt out: a host may cache it.
export function buildFilterAISystemPrompt(context: IFilterAIContext): string {
  const lines: Array<string> = [];
  lines.push("You turn a user's description of the records they need into a SurveyJS filter expression over the fields of a list. The user describes in words what the records must be; you answer with one filter and a short title for it.");
  lines.push("");
  lines.push(getGuideText());
  lines.push("");
  lines.push("## The fields the filter can use (JSON)");
  lines.push(JSON.stringify(context, null, 2));
  lines.push("");
  lines.push("## Rules");
  lines.push("- Use only the names listed under \"fields\", and for each field only the operators listed for it.");
  lines.push("- At most one condition per field. Join conditions with \"and\" only: no \"or\", no functions, no arithmetic, no \"!\".");
  lines.push("- Compare a field that lists choices with the values of its choices, never with their texts.");
  if (context.truncated.choices) lines.push("- Some choice lists are partial: a field may have more values than are shown.");
  lines.push("- When the description cannot be expressed with what is listed, return an empty expression and say why in the explanation.");
  lines.push("");
  lines.push("## Answer");
  lines.push("Answer with JSON only, nothing around it: {\"expression\": \"...\", \"title\": \"...\", \"explanation\": \"...\"}. The title names the filter in at most " +
    filterPresetTitleMaxLength + " characters; the explanation is one sentence.");
  lines.push("Write the title and the explanation in the language with locale code \"" + context.locales.survey + "\", whatever language the description uses.");
  return lines.join("\n");
}

const emptyOption = "If the description cannot be expressed with the listed fields, return an empty expression and say why in the explanation.";
// The last user message of a request: a new filter, the current one for a new description (the
// description is what the filter is for, not a change to it), or a rejected answer and its problems.
export function buildFilterAIInstruction(action: "generate" | "modify" | "fix", prompt: string, expression: string,
  issues?: Array<AIRequestIssue>): string {
  switch(action) {
    case "generate":
      return "Write a filter for this description:\n" + (prompt || "") + "\n\n" + emptyOption;
    case "modify":
      return "The current filter:\n" + (expression || "") + "\n\nThe description of the filter is now:\n" + (prompt || "") +
        "\n\nUpdate the filter to match the description, keeping the conditions that still fit it.\n\n" + emptyOption;
    default:
      return "This filter failed the check:\n" + (expression || "") + "\n\nProblems found:\n" +
        (issues || []).map((issue: AIRequestIssue): string => "- [" + issue.severity + "] " + issue.message).join("\n") + "\n\n" +
        "Return a corrected filter that still matches the description. " + emptyOption;
  }
}

export interface IFilterAIResponse {
  expression: string;
  title: string;
  explanation: string;
}
// The answer the system prompt asks for, as a structured-output schema
export const filterAIResponseFormat: AIResponseFormat = {
  name: "survey_filter",
  schema: {
    type: "object",
    properties: {
      expression: { type: "string" },
      title: { type: "string" },
      explanation: { type: "string" },
    },
    required: ["expression", "title", "explanation"],
    additionalProperties: false,
  },
};

const choiceOperators: { [operator: string]: boolean } = { equal: true, notequal: true, anyof: true, noneof: true, allof: true };
function quote(value: any): string {
  return typeof value === "string" ? "'" + value + "'" : String(value);
}
function getProblemMessage(problem: FilterExpressionProblem, fields: { [valueName: string]: IDynamicDataFilterField }): string {
  switch(problem.code) {
    case "unsupported":
      return "The filter must be conditions on the listed fields joined by \"and\": no \"or\" inside \"and\", no functions, no arithmetic, no \"!\" and no comparison of two fields.";
    case "not-and":
      return "Join the conditions with \"and\" only; \"or\" is not allowed.";
    case "unknown-field":
      return "There is no field \"" + problem.field + "\". Use only the names listed under \"fields\".";
    case "duplicate-field":
      return "The field \"" + problem.field + "\" has more than one condition. Use one condition per field.";
    default:
      return "The field \"" + problem.field + "\" does not offer the operator \"" + problem.operator + "\". Use one of: " +
        getFilterFieldOperators(fields[problem.field]).join(", ") + ".";
  }
}
// A condition on a field that lists choices must hold their values: an answer that compares with a
// choice's text would filter out every record.
function getChoiceIssue(field: IDynamicDataFilterField, condition: IFilterCondition): AIRequestIssue {
  if (!choiceOperators[condition.operator]) return undefined;
  const items = getFieldChoiceItems(field);
  if (items.length === 0) return undefined;
  const values: Array<any> = Array.isArray(condition.value) ? condition.value : [condition.value];
  const wrong = values.filter((v: any): boolean => !ItemValue.getItemByValue(items, v));
  if (wrong.length === 0) return undefined;
  const allowed = items.slice(0, filterAIMaxChoices).map((item: ItemValue): string => quote(item.value)).join(", ");
  return { severity: "error", code: "filter:choice",
    message: wrong.map(quote).join(", ") + " is not a choice value of the field \"" + condition.field + "\". Use the choice values: " + allowed + "." };
}

// The filter's part of an AI request. getFields: the control's fields at the moment the answer comes.
export class FilterAIFeature implements IAIFeature<IFilterAIResponse, AIRequestIssue> {
  public readonly responseFormat = filterAIResponseFormat;

  constructor(private getFields: () => Array<IDynamicDataFilterField>) { }

  public parse(data: any, text: string): IFilterAIResponse {
    // data is the first object the text holds; one that is no answer leaves the text to read
    const res = (isAIObject(data) ? readExpressionData(data) : undefined) || parseExpressionResponse(text);
    const title = isAIObject(data) && typeof data.title === "string" ? data.title.trim() : "";
    return { expression: (!!res && res.expression || "").trim(), title: title, explanation: !!res && res.explanation || "" };
  }
  public isEmpty(answer: IFilterAIResponse): boolean {
    return !answer.expression;
  }
  public serialize(answer: IFilterAIResponse): string {
    return JSON.stringify({ expression: answer.expression, title: answer.title || "", explanation: answer.explanation || "" });
  }
  public validate(answer: IFilterAIResponse, action: string): Array<AIRequestIssue> {
    if (!answer || !answer.expression) return [];
    const fields = this.getFields();
    const fieldsByValueName = getFieldsByValueName(fields);
    const res = analyzeFilterExpression(answer.expression, fields);
    if ("problem" in res) {
      return [{ severity: "error", code: "filter:" + res.problem.code, message: getProblemMessage(res.problem, fieldsByValueName) }];
    }
    const issues: Array<AIRequestIssue> = [];
    res.conditions.forEach((condition: IFilterCondition): void => {
      const field = fieldsByValueName[condition.field];
      if (!normalizeFilterCondition(field, condition)) {
        issues.push({ severity: "error", code: "filter:value",
          message: "The condition on the field \"" + condition.field + "\" has no value the operator \"" + condition.operator + "\" needs." });
        return;
      }
      const issue = getChoiceIssue(field, condition);
      if (!!issue) issues.push(issue);
    });
    return issues;
  }
  public buildFixInstruction(answer: IFilterAIResponse, issues: Array<AIRequestIssue>): string {
    return buildFilterAIInstruction("fix", "", answer.expression, issues);
  }
}
