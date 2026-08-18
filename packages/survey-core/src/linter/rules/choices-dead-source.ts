import { SELECTBASE_TYPES } from "../catalog";
import { closestMatch } from "../levenshtein";
import { ILintRule, LintContext } from "../rule";
import { ElementRecord } from "../symbols";

// carry-forward sources that provide an array of objects to pick fields from
const ARRAY_SOURCE_TYPES = new Set<string>(["matrixdynamic", "matrixdropdown", "paneldynamic"]);

function questionCandidates(ctx: LintContext): Array<string> {
  const res: Array<string> = [];
  ctx.index.byName.forEach((records, name) => {
    if (records.some(rec => rec.kind === "question")) res.push(name);
  });
  return res;
}

function getFieldNames(source: ElementRecord): Array<string> | undefined {
  if (source.matrixColumns) return source.matrixColumns.names();
  if (source.templateNames) return source.templateNames.names();
  return undefined;
}

export const choicesDeadSourceRule: ILintRule = {
  id: "choices/dead-source",
  defaultSeverity: "error",
  run(ctx: LintContext): void {
    ctx.index.allElements.forEach(record => {
      const info = record.choicesInfo;
      if (!info || !info.carryForwardFrom) return;
      const path = info.carryForwardPath || record.path;
      const sourceName = info.carryForwardFrom;
      const source = <ElementRecord>ctx.index.byName.first(sourceName) ||
        <ElementRecord>ctx.index.byValueName.first(sourceName);
      if (!source || source.kind !== "question") {
        ctx.report({
          message: "\"" + record.name + "\" copies its choices from \"" + sourceName +
            "\", but no question with that name exists.",
          path: path,
          messageData: { name: record.name, source: sourceName, reason: "missing" },
          elementName: record.name,
          elementType: record.type,
          suggestion: closestMatch(sourceName, questionCandidates(ctx)),
        });
        return;
      }
      if (source === record) {
        ctx.report({
          message: "\"" + record.name + "\" copies its choices from itself.",
          path: path,
          messageData: { name: record.name, source: sourceName, reason: "self" },
          elementName: record.name,
          elementType: record.type,
        });
        return;
      }
      const isSelectSource = SELECTBASE_TYPES.has(source.type);
      const isArraySource = ARRAY_SOURCE_TYPES.has(source.type);
      if (!isSelectSource && !isArraySource && !source.isUnknownType && !source.componentDef) {
        ctx.report({
          message: "\"" + record.name + "\" copies its choices from \"" + sourceName + "\" (" + source.type +
            "), which provides neither choices nor an array of values.",
          path: path,
          messageData: { name: record.name, source: sourceName, sourceType: source.type, reason: "not-a-source" },
          elementName: record.name,
          elementType: record.type,
          related: [{ path: source.path, elementName: source.name }],
        });
        return;
      }
      if (isArraySource) {
        const fieldNames = getFieldNames(source);
        if (!fieldNames) return;
        const checkField = (fieldValue: string, fieldPath: string, prop: string) => {
          if (!fieldValue) return;
          if (fieldNames.some(name => name.toLowerCase() === fieldValue.toLowerCase())) return;
          ctx.report({
            message: "\"" + record.name + "\" reads " + prop + " \"" + fieldValue + "\" from \"" + sourceName +
              "\", but " + source.type + " \"" + sourceName + "\" has no such " +
              (source.type === "paneldynamic" ? "template question" : "column") + ".",
            path: fieldPath,
            messageData: { name: record.name, source: sourceName, field: fieldValue, reason: "missing-field", prop: prop },
            elementName: record.name,
            elementType: record.type,
            suggestion: closestMatch(fieldValue, fieldNames),
            related: [{ path: source.path, elementName: source.name }],
          });
        };
        checkField(info.carryForwardValuesFrom, info.carryForwardValuesPath || path, "choiceValuesFromQuestion");
        checkField(info.carryForwardTextsFrom, info.carryForwardTextsPath || path, "choiceTextsFromQuestion");
        if (!info.carryForwardValuesFrom) {
          ctx.report({
            message: "\"" + record.name + "\" copies its choices from " + source.type + " \"" + sourceName +
              "\" but does not specify choiceValuesFromQuestion - no choices can be built.",
            path: path,
            messageData: { name: record.name, source: sourceName, reason: "missing-choice-values" },
            elementName: record.name,
            elementType: record.type,
            related: [{ path: source.path, elementName: source.name }],
          });
        }
      }
    });
  },
};
