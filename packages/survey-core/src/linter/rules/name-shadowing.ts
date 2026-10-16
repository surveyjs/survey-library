import { ILintRule, LintContext } from "../rule";
import { builtInVariableNames, equalsCI, isBuiltInVariable, stripCommentSuffix } from "../expression-utils";
import { ElementRecord, getCapturingFrame, getEffectiveType, TriggerRecord } from "../symbols";
import { isMatrixDropdown, isPropertyOn } from "../metadata";
import { hasOtherItem } from "../value-types";
import { addsItemFieldsTo, getDataKey, getDataKeyRecords, getListedRows, getSharingRecords } from "../record-fields";
import { ILintRelated } from "../types";
import { SurveyLintReasons } from "../reasons";

const reasons = SurveyLintReasons["name/shadowing"];

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

// A dynamic panel or matrix knows the fields another question adds to the value they share only
// when it declares the valueName itself (QuestionRecordsModel.getSharedQuestionFromArray): keyed by
// its name alone it treats them as unknown - setData() reports them and clearIncorrectValues()
// deletes them.
function losesSharedFields(shadowed: ElementRecord, record: ElementRecord): boolean {
  return addsItemFieldsTo(shadowed, record);
}

// Sharing a value through a valueName is a documented feature, on one side or on both (Merge
// Question Values), so only the form the runtime mishandles is reported: a valueName landing on the
// name of a dynamic panel or matrix without a valueName of its own, which the question adds fields
// to (losesSharedFields). Top-level questions only: a question inside a dynamic-panel template or
// a matrix detail panel writes into its panel's or row's record, never next to a top-level
// question (#12014).
function checkValueNameOverName(ctx: LintContext, record: ElementRecord): void {
  const valueName = record.valueName;
  if (!valueName || equalsCI(valueName, record.name)) return;
  if (getCapturingFrame(record.scope)) return;
  const shadowed = ctx.index.byName.get(valueName)
    .filter(other => other !== record && other.kind === "question" && !other.valueName &&
      losesSharedFields(other, record));
  if (shadowed.length === 0) return;
  const other = shadowed[0];
  ctx.report({
    message: "The valueName \"" + valueName + "\" of \"" + record.name + "\" shares the value of " +
      other.type + " \"" + other.name + "\", which has no valueName of its own - \"" + other.name +
      "\" treats the fields \"" + record.name + "\" adds as unknown, and clearIncorrectValues() deletes them." +
      " Set its valueName to \"" + valueName + "\" too.",
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
  if (isPropertyOn(json, "question", "showCommentArea")) return true;
  if (json.storeOthersAsComment === false) return false;
  return hasOtherItem(json);
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
  const dataName = getDataKey(record);
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
    // the questions writing the base key in the record's data scope: a question of a dynamic-panel
    // template writes into its panel's record, one of a matrix detail panel into its row's record
    // next to the columns, every other question into the survey data
    const owner = getDataKeyRecords(ctx.index, getCapturingFrame(record.scope), base)
      .filter(other => other !== record && owns(other))[0];
    if (!owner) return;
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

// The keys a question on the data key fills with a single value: the rows of a single-choice matrix
// (as the JSON lists them), the items of a multiple text.
function getSingleValueKeys(record: ElementRecord): Array<string> {
  const type = getEffectiveType(record);
  if (type === "matrix") return getListedRows(record) || [];
  if (type === "multipletext" && !!record.multipleTextItems) return record.multipleTextItems.names();
  return [];
}

// A matrixdropdown keeps an object of cells under a row key, a single-choice matrix the column
// value and a multiple text the item text: on one key the runtime stores one of them and deletes the
// other side (QuestionMatrixModel / QuestionMatrixDropdownModel clearIncorrectValues).
function checkDropdownRowConflict(ctx: LintContext, record: ElementRecord, reported: Set<string>): void {
  if (record.kind !== "question" || getEffectiveType(record) !== "matrixdropdown") return;
  const rows = getListedRows(record);
  if (!rows) return;
  getSharingRecords(ctx.index, record).forEach(other => {
    getSingleValueKeys(other).forEach(key => {
      // the runtime compares the keys exactly (hasValueKey: row.value + "" === key)
      const id = other.path + "|" + key;
      if (rows.indexOf(key) < 0 || reported.has(id)) return;
      reported.add(id);
      const what = getEffectiveType(other) === "matrix" ? "a row of matrix" : "an item of multipletext";
      ctx.report({
        message: "The row \"" + key + "\" of matrixdropdown \"" + record.name + "\" is also " + what + " \"" +
          other.name + "\" sharing its value - a cell object and a single value cannot both live under one key;" +
          " the runtime keeps one and deletes the other.",
        path: other.path,
        reason: reasons.dropdownRowConflict,
        messageData: { key: key, name: other.name, otherName: record.name },
        elementName: other.name,
        elementType: other.type,
        related: relatedOf([record, other]),
      });
    });
  });
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
    const reportedRows = new Set<string>();
    ctx.index.allElements.forEach(record => {
      checkValueNameOverName(ctx, record);
      checkDerivedKeyCollision(ctx, record);
      checkDropdownRowConflict(ctx, record, reportedRows);
    });
    ctx.index.triggers.forEach(trigger => checkVariableTrigger(ctx, trigger));
  },
};
