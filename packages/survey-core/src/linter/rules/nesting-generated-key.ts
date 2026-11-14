import { ILintRule, LintContext } from "../rule";
import { SurveyLintFixReasons, SurveyLintReasons } from "../reasons";
import { setFix } from "../fix-utils";
import { getContainerNestingKind } from "../data-nesting";

const reasons = SurveyLintReasons["nesting/generated-key"];
const fixReasons = SurveyLintFixReasons["nesting/generated-key"];

// The names the runtime and the Creator give a new page or panel (SurveyModel.generateNewName).
const GENERATED_NAME: { [kind: string]: RegExp } = { page: /^page[0-9]+$/i, panel: /^panel[0-9]+$/i };

// Nested data: a by-name dataNesting mode ("panel", "page", "panelAndPage") stores a container's
// values under its name when it has no valueName. A generated name is a placeholder an author renames
// sooner or later, and after the rename the elements read another key while the data stays under the
// old one ("Limitations" in docs/design-survey-nested-data.md). A hint, not a defect: the survey works
// as it is. The repair pins the key: valueName set to the current name keeps the data where it is,
// whatever the name becomes. An unnamed container nests under the name the runtime generates for it in load order,
// which the JSON does not state at all - it carries no fix, since that name depends on the order.
export const nestingGeneratedKeyRule: ILintRule = {
  id: "nesting/generated-key",
  defaultSeverity: "info",
  run(ctx: LintContext): void {
    ctx.index.containers.forEach(container => {
      const kind = getContainerNestingKind(container);
      const record = container.record;
      // root elements always land on the one page the survey creates, "page1": no order changes it,
      // and there is no page in the JSON to name. A dynamic panel's template never nests.
      if (!record || !kind) return;
      if (container.dataKeySource === "generated") {
        ctx.report({
          message: "This " + kind + " has no name: dataNesting \"" + ctx.index.dataNesting + "\" stores its questions' values under \"" +
            container.dataKey + "\", the name the survey generates for it in load order - adding or moving " + kind +
            "s changes it. Give it a name or a valueName.",
          path: container.path,
          reason: reasons.unnamed,
          messageData: { key: container.dataKey, kind: kind, dataNesting: ctx.index.dataNesting },
          elementType: kind,
        });
        return;
      }
      if (container.dataKeySource !== "name" || !GENERATED_NAME[kind].test(record.name)) return;
      ctx.report({
        message: "The " + kind + " \"" + record.name + "\" keeps a generated name, and dataNesting \"" + ctx.index.dataNesting +
          "\" stores its questions' values under it - renaming the " + kind + " moves them to another key." +
          " Set its valueName to \"" + record.name + "\" to keep the key.",
        path: record.path + ".name",
        reason: reasons.generatedName,
        messageData: { name: record.name, key: container.dataKey, kind: kind, dataNesting: ctx.index.dataNesting },
        elementName: record.name,
        elementType: kind,
        fix: setFix(fixReasons.setValueName, record.path + ".valueName", record.name),
      });
    });
  },
};
