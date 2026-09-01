import { ILintRule, LintContext } from "../rule";
import { builtInVariableNames, equalsCI, isBuiltInVariable, stripCommentSuffix } from "../expression-utils";
import { ElementRecord, getEffectiveType, TriggerRecord } from "../symbols";
import { isMatrixDropdown } from "../metadata";
import { ILintRelated } from "../types";
import { SurveyLintReasons } from "../reasons";

const reasons = SurveyLintReasons["name/shadowing"];

function getDataName(record: ElementRecord): string {
  return record.valueName || record.name;
}

function relatedOf(records: Array<ElementRecord>): Array<ILintRelated> {
  return records.map(record => ({ path: record.path, elementName: record.name }));
}

function builtInSpelling(name: string): string {
  const match = builtInVariableNames().filter(v => equalsCI(v, name));
  return match.length > 0 ? match[0] : name;
}

// The survey answers a built-in name itself, before it looks at any value, so whatever the
// JSON declares under that name is unreachable in expressions.
function reportBuiltIn(ctx: LintContext, name: string, nameKind: string, path: string,
  record?: ElementRecord): void {
  if (!isBuiltInVariable(name)) return;
  const owner = nameKind === "calculatedValue" ? "calculated value" : (record ? record.type : "element");
  ctx.report({
    message: "The " + nameKind + " \"" + name + "\" of this " + owner +
      " is also a built-in survey variable - {" + name +
      "} answers the built-in value, so this one is unreachable in expressions.",
    path: path,
    reason: reasons.builtInVariable,
    messageData: { name: name, nameKind: nameKind, builtIn: builtInSpelling(name) },
    elementName: record ? record.name : name,
    elementType: record ? record.type : "calculatedvalue",
  });
}

// Two questions may deliberately share a valueName - that is how the runtime lets them answer
// as one. What is reported here is the one-sided form: a valueName landing on the data key
// another question writes under its own name, where only one of the two is aware of it.
function checkValueNameOverName(ctx: LintContext, record: ElementRecord): void {
  const valueName = record.valueName;
  if (!valueName || equalsCI(valueName, record.name)) return;
  const shadowed = ctx.index.byName.get(valueName)
    .filter(other => other !== record && other.kind === "question" && !other.valueName);
  if (shadowed.length === 0) return;
  ctx.report({
    message: "The valueName \"" + valueName + "\" of \"" + record.name + "\" is also the name of " +
      "question \"" + shadowed[0].name + "\" - both store their answer under the data key \"" +
      valueName + "\".",
    path: record.path + ".valueName",
    reason: reasons.valueNameShadowsElement,
    messageData: {
      name: record.name, valueName: valueName,
      otherName: shadowed[0].name, otherType: shadowed[0].type,
    },
    elementName: record.name,
    elementType: record.type,
    related: relatedOf([record].concat(shadowed)),
  });
}

// A question writes a comment when it has a comment area, and when its Other item stores the
// text as one (storeOthersAsComment defaults to true).
function writesComment(record: ElementRecord): boolean {
  const json = record.json;
  if (!json) return false;
  if (json.showCommentArea === true || json.hasComment === true) return true;
  if (json.storeOthersAsComment === false) return false;
  return json.showOtherItem === true || json.hasOther === true;
}

function hasTotals(record: ElementRecord): boolean {
  if (!isMatrixDropdown(getEffectiveType(record))) return false;
  const columns = record.json.columns;
  if (!Array.isArray(columns)) return false;
  return columns.some(column => !!column && typeof column === "object" &&
    ((!!column.totalType && column.totalType !== "none") || !!column.totalExpression));
}

// A data key the runtime derives from another one: <name>-Comment and <matrix>-total. An
// element whose own key spells one of those overwrites it, in whichever order they are written.
function checkDerivedKeyCollision(ctx: LintContext, record: ElementRecord): void {
  if (record.kind !== "question") return;
  const dataName = getDataName(record);
  const settings = ctx.index.settings;
  const commentBase = stripCommentSuffix(dataName, settings);
  const totalsSuffix = settings.matrixTotalsSuffix;
  const totalBase = !!totalsSuffix && dataName.length > totalsSuffix.length &&
    dataName.toLowerCase().endsWith(totalsSuffix.toLowerCase())
    ? dataName.substring(0, dataName.length - totalsSuffix.length)
    : undefined;
  const check = (base: string, suffix: string, reason: string, owns: (rec: ElementRecord) => boolean,
    what: string): void => {
    if (!base) return;
    const owner = ctx.index.findByDataName(base);
    if (!owner || owner === record || !owns(owner)) return;
    ctx.report({
      message: "The data key \"" + dataName + "\" of \"" + record.name + "\" is also the " + what +
        " key of \"" + owner.name + "\" (its data key plus \"" + suffix +
        "\") - one write silently overwrites the other.",
      path: record.path,
      reason: reason,
      messageData: { name: record.name, dataName: dataName, base: base, suffix: suffix },
      elementName: record.name,
      elementType: record.type,
      related: relatedOf([record, owner]),
    });
  };
  check(commentBase, settings.commentSuffix, reasons.commentKeyCollision, writesComment, "comment");
  check(totalBase, totalsSuffix, reasons.totalKeyCollision, hasTotals, "totals");
}

// setToName with isVariable writes a variable rather than the question's value, and the
// variables hash is consulted before the survey data: the question's own answer stops
// answering its name.
function checkVariableTrigger(ctx: LintContext, trigger: TriggerRecord): void {
  const json = trigger.json;
  if (!json || json.isVariable !== true) return;
  const name = json.setToName;
  if (typeof name !== "string" || !name) return;
  const question = ctx.index.findByDataName(name);
  if (!question || question.kind !== "question") return;
  ctx.report({
    message: "The " + trigger.type + " trigger sets the variable \"" + name +
      "\", which is also the data key of question \"" + question.name +
      "\" - the variable answers {" + name + "} from then on, not the question.",
    path: trigger.path + ".setToName",
    reason: reasons.variableShadowsQuestion,
    messageData: { name: name, trigger: trigger.type, questionName: question.name },
    elementName: question.name,
    elementType: question.type,
    related: relatedOf([question]).concat([{ path: trigger.path }]),
  });
}

export const nameShadowingRule: ILintRule = {
  id: "name/shadowing",
  defaultSeverity: "warning",
  run(ctx: LintContext): void {
    // built-in names are only shadowed at the top level: a column or a template question is
    // addressed through its container's scope, which resolves before the survey does
    ctx.index.byName.forEach(records => {
      records.forEach(record => {
        if (record.kind !== "question") return;
        reportBuiltIn(ctx, record.name, "name", record.path + ".name", record);
      });
    });
    ctx.index.byValueName.forEach(records => {
      records.forEach(record => {
        reportBuiltIn(ctx, record.valueName, "valueName", record.path + ".valueName", record);
      });
    });
    ctx.index.calculatedValueList.forEach(cv => {
      reportBuiltIn(ctx, cv.name, "calculatedValue", cv.path);
    });
    ctx.index.allElements.forEach(record => {
      checkValueNameOverName(ctx, record);
      checkDerivedKeyCollision(ctx, record);
    });
    ctx.index.triggers.forEach(trigger => checkVariableTrigger(ctx, trigger));
  },
};
