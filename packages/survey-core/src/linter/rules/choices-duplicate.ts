import { ILintRule, LintContext } from "../rule";
import { ElementRecord, getEffectiveType } from "../symbols";
import { isDescendantOf, isMatrixDropdown } from "../metadata";
import { getItemValueRaw, getSpecialChoiceDefs } from "../value-types";
import { runtimeEquals } from "../value-domain";
import { SurveyLintReasons } from "../reasons";

const reasons = SurveyLintReasons["choices/duplicate"];

// The properties naming the built-in item, in the order the runtime reads them: the
// finding names the key the author actually wrote.
const TOGGLE_PROPS: { [item: string]: Array<string> } = {
  other: ["showOtherItem", "hasOther"],
  none: ["showNoneItem", "hasNone"],
  refuse: ["showRefuseItem"],
  dontknow: ["showDontKnowItem"],
};

const ITEM_LABELS: { [item: string]: string } = {
  other: "Other", none: "None", refuse: "Refuse to answer", dontknow: "Don't know",
};

// The itemvalue arrays of this element. A matrix column is here as its own record, so its
// own choices are checked once and the shared choices of the matrix once - a column
// inheriting them carries no array of its own.
function getItemArrayProps(record: ElementRecord): Array<string> {
  const res: Array<string> = [];
  const type = getEffectiveType(record);
  if (!!record.choicesInfo) {
    // carry-forward replaces the listed choices, which choices/dead-source owns
    if (!record.choicesInfo.carryForwardFrom) res.push("choices");
  } else if (isMatrixDropdown(type)) {
    res.push("choices");
  }
  if (type === "rating") res.push("rateValues");
  // the columns of a single-choice matrix are the values its rows answer with; the columns
  // of a matrixdropdown are questions, whose duplicate names name/duplicate reports
  if (type === "matrix") {
    res.push("rows");
    res.push("columns");
  } else if (isDescendantOf(type, "matrixdropdown")) {
    res.push("rows");
  }
  return res;
}

function getToggleProp(json: any, item: string): string {
  const props = TOGGLE_PROPS[item];
  const written = props.filter(prop => json[prop] === true);
  return written.length > 0 ? written[0] : props[0];
}

function reportDuplicates(ctx: LintContext, record: ElementRecord, prop: string, items: Array<any>): void {
  const seen: Array<{ value: any, path: string }> = [];
  items.forEach((item, index) => {
    const value = getItemValueRaw(item);
    if (value === undefined || value === null) return;
    const path = record.path + "." + prop + "[" + index + "]";
    const first = seen.filter(entry => runtimeEquals(entry.value, value))[0];
    if (!first) {
      seen.push({ value: value, path: path });
      return;
    }
    ctx.report({
      message: "Another item of the " + prop + " of \"" + record.name + "\" already has the value \"" +
        value + "\" - the runtime keeps both items.",
      path: path,
      reason: reasons.duplicateValue,
      messageData: {
        name: record.name, questionType: record.type, prop: prop, value: value,
      },
      elementName: record.name,
      elementType: record.type,
      related: [{ path: first.path, elementName: record.name }],
    });
  });
}

// A listed choice holding the value of a built-in item the question also shows: the runtime
// renders both, so the list has the item twice.
function reportSpecialCollisions(ctx: LintContext, record: ElementRecord, items: Array<any>): void {
  const defs = getSpecialChoiceDefs(record.choicesInfo, ctx.index.settings);
  if (defs.length === 0) return;
  items.forEach((item, index) => {
    const value = getItemValueRaw(item);
    if (value === undefined || value === null) return;
    defs.forEach(def => {
      if (!runtimeEquals(def.value, value)) return;
      const toggleProp = getToggleProp(record.json, def.item);
      ctx.report({
        message: "The choices of \"" + record.name + "\" contain \"" + value + "\" while " +
          toggleProp + " is on - it collides with the built-in " + ITEM_LABELS[def.item] + " item.",
        path: record.path + ".choices[" + index + "]",
        reason: reasons.specialItemCollision,
        messageData: {
          name: record.name, questionType: record.type, prop: "choices", value: value,
          specialItem: def.item, toggleProp: toggleProp,
        },
        elementName: record.name,
        elementType: record.type,
      });
    });
  });
}

export const choicesDuplicateRule: ILintRule = {
  id: "choices/duplicate",
  defaultSeverity: "warning",
  run(ctx: LintContext): void {
    ctx.index.allElements.forEach(record => {
      const json = record.json;
      if (!json) return;
      getItemArrayProps(record).forEach(prop => {
        const items = json[prop];
        if (!Array.isArray(items) || items.length < 2) return;
        reportDuplicates(ctx, record, prop, items);
      });
      if (!!record.choicesInfo && !record.choicesInfo.carryForwardFrom && Array.isArray(json.choices)) {
        reportSpecialCollisions(ctx, record, json.choices);
      }
    });
  },
};
