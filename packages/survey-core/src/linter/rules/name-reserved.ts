import { ILintRule, LintContext } from "../rule";
import { OBJECT_PROTOTYPE_MEMBERS } from "../catalog";
import { ElementRecord } from "../symbols";
import { getItemValueRaw } from "../value-types";
import { ILintFix } from "../types";
import { SurveyLintFixReasons, SurveyLintReasons } from "../reasons";
import { setFix } from "../fix-utils";

const reasons = SurveyLintReasons["name/reserved"];
const fixReasons = SurveyLintFixReasons["name/reserved"];

// The one clause every message ends with: what the name collides with is the whole story, the
// consequence - the value objects the name keys are plain, and which of them the runtime has
// since been taught to guard - is told once, in the README.
const TAIL = " is reserved - a member of Object.prototype.";

// The list is spelled the way Object.prototype spells it; the comparison trims and ignores case.
// The runtime trims a name, lower-cases its variable names and its question lookup hashes, so a
// spelling that survives in one slot collides in another - one list, any case, any context is the
// rule an author can remember.
// A Set lookup, never obj[name] - that lookup is the very collision this rule reports. Anything
// that is not a string is no data key either, and property/required owns an empty name.
const RESERVED_LOWER = new Set<string>();
OBJECT_PROTOTYPE_MEMBERS.forEach(member => RESERVED_LOWER.add(member.toLowerCase()));
function isReserved(name: any): boolean {
  return typeof name === "string" && RESERVED_LOWER.has(name.trim().toLowerCase());
}

// The one repair a name key has is another name. Which one is the author's call, so the fix
// hands out a free placeholder the way name/duplicate does; a reference to the old name never
// worked and surfaces as reference/unknown once the element is renamed.
function renameFix(ctx: LintContext, path: string, kind: string): ILintFix | undefined {
  return setFix(fixReasons.renameElement, path, ctx.newElementName(kind));
}

function checkQuestion(ctx: LintContext, record: ElementRecord): void {
  if (isReserved(record.name)) {
    const path = record.path + ".name";
    ctx.report({
      message: "The name \"" + record.name + "\"" + TAIL,
      path: path,
      reason: reasons.questionName,
      messageData: { name: record.name },
      elementName: record.name,
      elementType: record.type,
      fix: renameFix(ctx, path, record.kind),
    });
  }
  // a valueName has no single repair: dropping it moves the answer under the question's own
  // name, respelling it moves it under a made-up one, and the author meant one of the two
  if (isReserved(record.valueName)) {
    ctx.report({
      message: "The valueName \"" + record.valueName + "\" of \"" + record.name + "\"" + TAIL,
      path: record.path + ".valueName",
      reason: reasons.valueName,
      messageData: { name: record.name, valueName: record.valueName },
      elementName: record.name,
      elementType: record.type,
    });
  }
  checkRows(ctx, record);
}

// The rows of a single-choice or a dropdown matrix key the matrix value - the walker gives
// exactly those two types matrixRowValues. The indexes come from the JSON itself: the walker
// drops the items that hold no value, which shifts the rest. A row is an item value, not an
// element: no name factory names one, so it carries no fix.
function checkRows(ctx: LintContext, record: ElementRecord): void {
  if (!Array.isArray(record.matrixRowValues)) return;
  const rows = record.json ? record.json.rows : undefined;
  if (!Array.isArray(rows)) return;
  rows.forEach((row: any, i: number) => {
    const value = getItemValueRaw(row);
    if (!isReserved(value)) return;
    const path = record.path + ".rows[" + i + "]" + (typeof row === "object" ? ".value" : "");
    ctx.report({
      message: "The row \"" + value + "\" of \"" + record.name + "\"" + TAIL,
      path: path,
      reason: reasons.rowValue,
      messageData: { name: record.name, rowValue: value },
      elementName: record.name,
      elementType: record.type,
    });
  });
}

// A column keys every row value of a dropdown or a dynamic matrix, an item the value of a
// multiple text. Both are named in the JSON, so both get the fix a question gets.
function checkMember(ctx: LintContext, record: ElementRecord, reason: string, noun: string,
  ownerKey: string): void {
  if (!isReserved(record.name)) return;
  const owner = record.parent ? record.parent.name : undefined;
  const path = record.path + ".name";
  const messageData: { [key: string]: any } = { name: record.name };
  messageData[ownerKey] = owner;
  ctx.report({
    message: "The " + noun + " \"" + record.name + "\" of \"" + owner + "\"" + TAIL,
    path: path,
    reason: reason,
    messageData: messageData,
    elementName: record.name,
    elementType: record.type,
    fix: renameFix(ctx, path, record.kind),
  });
}

export const nameReservedRule: ILintRule = {
  id: "name/reserved",
  defaultSeverity: "error",
  run(ctx: LintContext): void {
    // every element, scopes included: a template question keys the value of each panel, a
    // detail question the value of each row. A page or a panel keys nothing and is left alone.
    ctx.index.allElements.forEach(record => {
      if (record.kind === "question") {
        checkQuestion(ctx, record);
      } else if (record.kind === "column") {
        checkMember(ctx, record, reasons.columnName, "column", "matrixName");
      } else if (record.kind === "multipletextitem") {
        checkMember(ctx, record, reasons.itemName, "item", "questionName");
      }
    });
    // a calculated value is stored the way an answer is, and named the way a question is
    ctx.index.calculatedValueList.forEach(cv => {
      if (!isReserved(cv.name)) return;
      const path = cv.path + ".name";
      ctx.report({
        message: "The calculated value \"" + cv.name + "\"" + TAIL,
        path: path,
        reason: reasons.calculatedValueName,
        messageData: { name: cv.name },
        elementName: cv.name,
        elementType: "calculatedvalue",
        fix: renameFix(ctx, path, "calculatedvalue"),
      });
    });
  },
};
