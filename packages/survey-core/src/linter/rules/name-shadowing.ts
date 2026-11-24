import { ILintRule, LintContext } from "../rule";
import {
  builtInVariableNames, equalsCI, isBuiltInVariable, isListedVariable, isValueQuestion, stripCommentSuffix, stripTotalsSuffix,
} from "../expression-utils";
import { DataScopeRecord, ElementRecord, getCapturingFrame, getEffectiveType, TriggerRecord } from "../symbols";
import { isMatrixDropdown, isPropertyOn } from "../metadata";
import { hasOtherItem } from "../value-types";
import {
  addsItemFieldsTo, getDataKey, getDataKeyRecords, getListedRows, getSharedValueShape, getSharingRecords,
} from "../record-fields";
import { forEachContainerKey, getContainerKeyPath, isInNestedObject } from "../data-nesting";
import { relatedOf } from "../message-utils";
import { SurveyLintReasons } from "../reasons";

const reasons = SurveyLintReasons["name/shadowing"];

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
  // nested data: a question inside a nesting container answers its own name inside the container
  // first, and by its path everywhere; only the bare name outside the container reads the built-in
  const dataPath = !!record && record.kind === "question" && isInNestedObject(record)
    ? record.dataScope.path.join(".") : undefined;
  const tail = dataPath === undefined ? "} answers the built-in value, so this one is unreachable in expressions."
    : "} outside its container answers the built-in value - reference it there as {" + dataPath + "." + name + "}.";
  ctx.report({
    message: "The " + nameKind + " \"" + name + "\" of this " + owner +
      " is also a built-in survey variable - {" + name + tail,
    path: path,
    reason: reasons.builtInVariable,
    messageData: dataPath === undefined ? { name: name, nameKind: nameKind, builtIn: builtInSpelling(name) }
      : { name: name, nameKind: nameKind, builtIn: builtInSpelling(name), dataPath: dataPath },
    elementName: record ? record.name : name,
    elementType: record ? record.type : "calculatedvalue",
  });
}

// Sharing a value through a valueName is a documented feature, on one side or on both (Merge
// Question Values), so only the form the runtime mishandles is reported: a valueName landing on the
// name of a dynamic panel or matrix without a valueName of its own, which the question adds fields
// to. Such a question knows those fields only when it declares the valueName itself
// (QuestionRecordsModel.getSharedQuestionFromArray): keyed by its name alone it treats them as
// unknown - setData() reports them and clearIncorrectValues() deletes them. Top-level questions
// only: a question inside a dynamic-panel template or a matrix detail panel writes into its panel's
// or row's record, never next to a top-level question (#12014).
function checkValueNameOverName(ctx: LintContext, record: ElementRecord): void {
  const valueName = record.valueName;
  if (!valueName || valueName === record.name) return;
  if (getCapturingFrame(record.scope)) return;
  const shadowed = getSharingRecords(ctx.index, record)
    .filter(other => other !== record && other.kind === "question" && !other.valueName &&
      addsItemFieldsTo(other, record));
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

const SHAPE_RANK: { [shape: string]: number } = { records: 2, object: 1, plain: 0 };
const SHAPE_TEXT: { [shape: string]: string } = { records: "an array of objects", object: "an object", plain: "a plain value" };

// Questions on one data key keeping values of different shapes (getSharedValueShape): each side
// reports the other one's value (invalidValueType) and clearIncorrectValues() deletes it. Reported
// once per pair, on the question of the simpler shape. Top-level questions only, as with
// checkValueNameOverName.
function checkValueShapeConflict(ctx: LintContext, record: ElementRecord): void {
  if (record.kind !== "question" || getCapturingFrame(record.scope)) return;
  // the map lookup first: few questions share their data key
  const sharing = getSharingRecords(ctx.index, record);
  if (sharing.length < 2) return;
  const shape = getSharedValueShape(record);
  if (!shape || SHAPE_RANK[shape] === 0) return;
  sharing.forEach(other => {
    if (other === record || other.kind !== "question") return;
    const otherShape = getSharedValueShape(other);
    if (!otherShape || SHAPE_RANK[otherShape] >= SHAPE_RANK[shape]) return;
    const dataKey = getDataKey(record);
    ctx.report({
      message: "\"" + other.name + "\" shares the data key \"" + dataKey + "\" with " + record.type + " \"" +
        record.name + "\", which keeps " + SHAPE_TEXT[shape] + " there, while " + other.type + " \"" + other.name +
        "\" keeps " + SHAPE_TEXT[otherShape] + " - one cannot hold the other's value; setData() reports it" +
        " and clearIncorrectValues() deletes it.",
      path: other.path,
      reason: reasons.valueShapeConflict,
      messageData: {
        name: other.name, otherName: record.name, otherType: record.type, dataKey: dataKey,
        shape: otherShape, otherShape: shape,
      },
      elementName: other.name,
      elementType: other.type,
      related: relatedOf([record, other]),
    });
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

// A data key the runtime derives from another one: <name>-Comment and <matrix>-total. An element whose
// own key spells one of those overwrites it, in whichever order they are written. keyOwner is a question
// or a nesting container spelling key in scope. The questions writing the base key are looked up there: a
// question of a dynamic-panel template writes into its panel's record, one of a matrix detail panel into its
// row's record next to the columns, every other one into the object of its container or the survey data.
function reportDerivedKeyCollision(ctx: LintContext, keyOwner: ElementRecord, key: string,
  scope: DataScopeRecord | undefined, path: string): void {
  const settings = ctx.index.settings;
  // an unnamed container is spoken of by its key
  const name = keyOwner.kind === "question" ? keyOwner.name : keyOwner.name || key;
  const check = (base: string, suffix: string, reason: string, owns: (rec: ElementRecord) => boolean,
    what: string): void => {
    if (!base) return;
    const owner = getDataKeyRecords(ctx.index, base, scope).filter(other => other !== keyOwner && owns(other))[0];
    if (!owner) return;
    ctx.report({
      message: "The data key \"" + key + "\" of \"" + name + "\" is also the " + what +
        " key of \"" + owner.name + "\" (its data key plus \"" + suffix +
        "\") - one write silently overwrites the other.",
      path: path,
      reason: reason,
      messageData: { name: name, dataName: key, base: base, suffix: suffix },
      elementName: keyOwner.name,
      elementType: keyOwner.type,
      related: relatedOf([keyOwner, owner]),
    });
  };
  check(stripCommentSuffix(key, settings), settings.commentSuffix, reasons.commentKeyCollision, writesComment, "comment");
  check(stripTotalsSuffix(key, settings), settings.matrixTotalsSuffix, reasons.totalKeyCollision, hasTotals, "totals");
}

// The variable a trigger with isVariable sets: it writes a variable rather than a question's value.
function getVariableTarget(trigger: TriggerRecord): string | undefined {
  const json = trigger.json;
  if (!json || json.isVariable !== true) return undefined;
  return typeof json.setToName === "string" && !!json.setToName ? json.setToName : undefined;
}

// The variables hash is consulted before the survey data: the question's own answer stops answering
// its name.
function checkVariableTrigger(ctx: LintContext, trigger: TriggerRecord): void {
  const name = getVariableTarget(trigger);
  if (!name) return;
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

// The keys of nesting containers (nested data): a key equal to a built-in variable, a key a variable
// answers first, and a key spelling the comment or totals key of a question in the same object.

// A container key spelling a built-in: the survey answers only the bare {key} itself, while a path
// into the container's object ({key.street}) still reaches the object, so the key is not
// unreachable - only the object as a whole is. When a variable of that name exists too, a path may
// read the variable instead (containerKeyShadowed reports it), so the path clause is left out.
function reportContainerBuiltIn(ctx: LintContext, scope: DataScopeRecord, nameKind: string, path: string,
  container: ElementRecord, isPathShadowed: boolean): void {
  const key = scope.key;
  if (!isBuiltInVariable(key)) return;
  // the example names a key that holds a value: a display-only question (html) stores nothing
  const innerKeys = scope.questions.names().filter(name => scope.questions.get(name).some(isValueQuestion));
  const examplePath = key + "." + (innerKeys.length > 0 ? innerKeys[0] : "x");
  const messageData: any = { name: key, nameKind: nameKind, builtIn: builtInSpelling(key) };
  if (!isPathShadowed) messageData.examplePath = examplePath;
  ctx.report({
    message: "The " + nameKind + " \"" + key + "\" of this " + container.type +
      " is also a built-in survey variable - only the bare {" + key + "} reads the built-in value" +
      (isPathShadowed ? "." : "; {" + examplePath + "} still reaches the " + container.type + "'s object."),
    path: path,
    reason: reasons.builtInVariable,
    messageData: messageData,
    elementName: container.name,
    elementType: container.type,
  });
}

// What answers {key} before a container key of the survey data: a calculated value, a host variable or
// a variable a trigger sets. Variables are read first in expressions, and
// a calculated value with includeIntoResult writes the same key of the survey data. Only a key of the
// survey data itself: inside a container, the container's object answers first.
function findVariableOver(ctx: LintContext, key: string): { kind: string, name: string, path?: string } | undefined {
  const cv = ctx.index.calculatedValues.get(key);
  if (!!cv) return { kind: "calculatedValue", name: cv.name, path: cv.path };
  if (isListedVariable(key, ctx.options)) return { kind: "variable", name: key };
  const definitionName = ctx.index.definitionVariables.get(key);
  if (!!definitionName) return { kind: "variable", name: definitionName };
  const trigger = ctx.index.triggers.filter(trg => equalsCI(getVariableTarget(trg), key))[0];
  if (!!trigger) return { kind: "trigger", name: getVariableTarget(trigger), path: trigger.path };
  return undefined;
}

const VARIABLE_KIND_TEXT: { [kind: string]: string } = {
  calculatedValue: "calculated value", variable: "host variable", trigger: "variable a trigger sets",
};

function checkRootContainerKeys(ctx: LintContext): void {
  ctx.index.rootScope.children.forEach(scopes => scopes.forEach(scope => {
    const record = scope.containers[0];
    if (!record || !record.json) return;
    const path = getContainerKeyPath(record);
    const nameKind = record.container.dataKeySource === "valueName" ? "valueName" : "name";
    const over = findVariableOver(ctx, scope.key);
    reportContainerBuiltIn(ctx, scope, nameKind, path, record, !!over);
    if (!over) return;
    ctx.report({
      message: "The " + record.type + " \"" + record.name + "\" stores its questions' values under \"" + scope.key +
        "\", which is also a " + VARIABLE_KIND_TEXT[over.kind] + " - {" + scope.key + "} and {" + scope.key +
        ".x} read the variable first.",
      path: path,
      reason: reasons.containerKeyShadowed,
      messageData: { name: record.name, key: scope.key, kind: over.kind, variable: over.name },
      elementName: record.name,
      elementType: record.type,
      related: relatedOf(scope.containers).concat(over.path ? [{ path: over.path }] : []),
    });
  }));
}

function checkContainerKeys(ctx: LintContext): void {
  checkRootContainerKeys(ctx);
  // the <name>-Comment and <matrix>-total keys the runtime derives, spelled by a container key in the same
  // object: the comment or the totals overwrite the container's object, or the other way round. The
  // records' levels too, where a key meets no variable.
  forEachContainerKey(ctx.index, (scope, child) => child.containers.forEach(container =>
    reportDerivedKeyCollision(ctx, container, child.key, scope, getContainerKeyPath(container))));
}

export const nameShadowingRule: ILintRule = {
  id: "name/shadowing",
  defaultSeverity: "warning",
  run(ctx: LintContext): void {
    // built-in names are only shadowed at the top level: a column or a template question is
    // addressed through its container's scope, which resolves before the survey does. A question
    // inside a nesting container shadows the built-in inside that container.
    ctx.index.flatNames.forEach(records => {
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
      // a data key the runtime derives from another one: <name>-Comment and <matrix>-total
      if (record.kind === "question") {
        reportDerivedKeyCollision(ctx, record, getDataKey(record), record.dataScope, record.path);
      }
      checkDropdownRowConflict(ctx, record, reportedRows);
      checkValueShapeConflict(ctx, record);
    });
    ctx.index.triggers.forEach(trigger => checkVariableTrigger(ctx, trigger));
    checkContainerKeys(ctx);
  },
};
