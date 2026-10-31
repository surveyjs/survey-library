import { ILintRule, LintContext } from "../rule";
import { CalculatedValueRecord } from "../symbols";
import { ILintRelated } from "../types";
import { SurveyLintFixReasons, SurveyLintReasons } from "../reasons";
import { setFix } from "../fix-utils";

const reasons = SurveyLintReasons["name/duplicate"];
const fixReasons = SurveyLintFixReasons["name/duplicate"];

export const nameDuplicateRule: ILintRule = {
  id: "name/duplicate",
  defaultSeverity: "error",
  run(ctx: LintContext): void {
    ctx.index.namespaces.forEach(namespace => {
      namespace.map.forEach((records, name) => {
        if (records.length < 2) return;
        const related: Array<ILintRelated> = records.map(rec => ({ path: rec.path, elementName: rec.name }));
        for (let i = 1; i < records.length; i++) {
          const rec = records[i];
          const scopeText = namespace.label ? " inside " + namespace.label : "";
          // neither how many elements share the name nor of which kinds they are tells the reader
          // of one duplicate anything: "related" carries every occurrence for a host that wants
          // to count them or walk them
          ctx.report({
            message: "The name \"" + name + "\" is duplicated" + scopeText + ".",
            path: rec.path,
            reason: reasons.elementNames,
            messageData: { name: name, scope: namespace.label },
            elementName: rec.name,
            elementType: rec.type,
            related: related,
            // only the later twin is renamed: the first keeps the name every reference to it
            // already spells. A duplicate calculated value gets none - nothing says which of the
            // two a reference meant.
            fix: setFix(fixReasons.renameElement, rec.path + ".name", ctx.newElementName(rec.kind)),
          });
        }
      });
    });
    // duplicate calculated-value names and calculated values shadowing element names
    // Map, not an object literal: calculated-value names come from user JSON
    const seenCalc = new Map<string, CalculatedValueRecord>();
    ctx.index.calculatedValueList.forEach(cv => {
      const key = cv.name.toLowerCase();
      const prev = seenCalc.get(key);
      if (prev) {
        ctx.report({
          message: "The calculated value name \"" + cv.name + "\" is already used by another calculated value.",
          path: cv.path,
          reason: reasons.calculatedValueNames,
          messageData: { name: cv.name },
          elementName: cv.name,
          elementType: "calculatedvalue",
          related: [{ path: prev.path, elementName: prev.name }, { path: cv.path, elementName: cv.name }],
        });
      } else {
        seenCalc.set(key, cv);
      }
      const elements = ctx.index.byName.get(cv.name);
      if (elements.length > 0) {
        ctx.report({
          message: "The calculated value \"" + cv.name + "\" shares its name with a " + elements[0].kind +
            " - both are referenced as {" + cv.name + "}, so one of them shadows the other.",
          path: cv.path,
          reason: reasons.calculatedValueShadowsElement,
          messageData: { name: cv.name },
          elementName: cv.name,
          elementType: "calculatedvalue",
          related: elements.map(el => ({ path: el.path, elementName: el.name })),
        });
      }
    });
  },
};
