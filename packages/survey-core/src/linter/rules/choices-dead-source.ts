import { Serializer } from "survey-core";
import { closestMatch } from "../levenshtein";
import { ILintRule, LintContext } from "../rule";
import { resolveCarryForwardSource } from "../expression-utils";
import { CIMultiMap, ElementRecord } from "../symbols";

// carry-forward sources that provide an array of objects to pick fields from
const ARRAY_SOURCE_TYPES = new Set<string>(["matrixdynamic", "matrixdropdown", "paneldynamic"]);

function questionCandidates(ctx: LintContext): Array<string> {
  const res: Array<string> = [];
  ctx.index.byName.forEach((records, name) => {
    if (records.some(rec => rec.kind === "question")) res.push(name);
  });
  return res;
}

function getFields(source: ElementRecord): CIMultiMap<ElementRecord> | undefined {
  return source.matrixColumns || source.templateNames || undefined;
}

export const choicesDeadSourceRule: ILintRule = {
  id: "choices/dead-source",
  defaultSeverity: "error",
  run(ctx: LintContext): void {
    ctx.index.allElements.forEach(record => {
      const info = record.choicesInfo;
      if (!info || !info.carryForwardFrom) return;
      // report at the property that carries the dead reference
      const path = record.path + ".choicesFromQuestion";
      const sourceName = info.carryForwardFrom;
      const resolved = resolveCarryForwardSource(sourceName, record, ctx.index);
      const source = resolved.source;
      if (!source || (source.kind !== "question" && source.kind !== "column")) {
        ctx.report({
          message: "\"" + record.name + "\" copies its choices from \"" + sourceName +
            "\", but no question with that name exists.",
          path: path,
          messageData: { name: record.name, source: sourceName, reason: "missing" },
          elementName: record.name,
          elementType: record.type,
          suggestion: closestMatch(sourceName, resolved.candidates || questionCandidates(ctx)),
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
      // a matrix column carries its cell type in effectiveType; record.type is the wrapper.
      // Mirrors question_baseselect.ts getQuestionWithChoicesCore, which accepts any
      // selectbase descendant rather than a fixed list of type names.
      const sourceType = source.effectiveType || source.type;
      const isSelectSource = Serializer.isDescendantOf(sourceType, "selectbase");
      const isArraySource = ARRAY_SOURCE_TYPES.has(sourceType);
      if (!isSelectSource && !isArraySource && !source.isUnknownType && !source.componentDef) {
        ctx.report({
          message: "\"" + record.name + "\" copies its choices from \"" + sourceName + "\" (" + sourceType +
            "), which provides neither choices nor an array of values.",
          path: path,
          messageData: { name: record.name, source: sourceName, sourceType: sourceType, reason: "not-a-source" },
          elementName: record.name,
          elementType: record.type,
          related: [{ path: source.path, elementName: source.name }],
        });
        return;
      }
      if (isArraySource) {
        const fields = getFields(source);
        if (!fields) return;
        const checkField = (fieldValue: string, fieldPath: string, prop: string) => {
          if (!fieldValue) return;
          if (fields.has(fieldValue)) return;
          ctx.report({
            message: "\"" + record.name + "\" reads " + prop + " \"" + fieldValue + "\" from \"" + sourceName +
              "\", but " + sourceType + " \"" + sourceName + "\" has no such " +
              (sourceType === "paneldynamic" ? "template question" : "column") + ".",
            path: fieldPath,
            messageData: { name: record.name, source: sourceName, field: fieldValue, reason: "missing-field", prop: prop },
            elementName: record.name,
            elementType: record.type,
            suggestion: closestMatch(fieldValue, fields.names()),
            related: [{ path: source.path, elementName: source.name }],
          });
        };
        checkField(info.carryForwardValuesFrom, record.path + ".choiceValuesFromQuestion", "choiceValuesFromQuestion");
        checkField(info.carryForwardTextsFrom, record.path + ".choiceTextsFromQuestion", "choiceTextsFromQuestion");
        // no choiceValuesFromQuestion is not a defect: getValueKeyName (question_baseselect.ts)
        // falls back to the first key of every row/panel value object, so choices are built
      }
    });
  },
};
