import { LintContext } from "./rule";
import { builtInVariableNames, equalsCI, stripCommentSuffix, stripTotalsSuffix } from "./expression-utils";
import { CapturingScopeFrame, DataScopeRecord, ElementRecord, getEffectiveType } from "./symbols";
import { isMatrixDropdown, isPropertyOn } from "./metadata";
import { hasOtherItem } from "./value-types";
import { getDataKeyRecords } from "./record-fields";
import { ILintRelated } from "./types";
import { SurveyLintReasons } from "./reasons";

// What the name/shadowing checks of elements (name-shadowing.ts) and of container keys
// (name-shadowing-containers.ts) share.

const reasons = SurveyLintReasons["name/shadowing"];

export function relatedOf(records: Array<ElementRecord>): Array<ILintRelated> {
  return records.map(record => ({ path: record.path, elementName: record.name }));
}

export function builtInSpelling(name: string): string {
  const match = builtInVariableNames().filter(v => equalsCI(v, name));
  return match.length > 0 ? match[0] : name;
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
// or a nesting container spelling key in scope; frame is the dynamic-panel template or the matrix row a
// question is in. The questions writing the base key are looked up there: a question of a dynamic-panel
// template writes into its panel's record, one of a matrix detail panel into its row's record next to the
// columns, every other one into the object of its container or the survey data.
export function reportDerivedKeyCollision(ctx: LintContext, keyOwner: ElementRecord, key: string,
  scope: DataScopeRecord | undefined, frame: CapturingScopeFrame | undefined, path: string): void {
  const settings = ctx.index.settings;
  // an unnamed container is spoken of by its key
  const name = keyOwner.kind === "question" ? keyOwner.name : keyOwner.name || key;
  const check = (base: string, suffix: string, reason: string, owns: (rec: ElementRecord) => boolean,
    what: string): void => {
    if (!base) return;
    const owner = getDataKeyRecords(ctx.index, frame, base, scope).filter(other => other !== keyOwner && owns(other))[0];
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
