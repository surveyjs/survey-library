import { ILintRule, LintContext } from "../rule";
import { SurveyLintReasons } from "../reasons";
import { DEFINITION_PATH, definitionRelated } from "./variable-preset";

const reasons = SurveyLintReasons["variable/dotted-key"];

// A variable key holds no dot: a host variable works like a JavaScript variable or property, and a
// path such as {users.tier} is then always one key per segment. The companion does not declare a
// variable for an element whose data key holds one, nor for anything inside it, so the element is
// silently unusable - no preset value reaches it and no condition can test it.
//
// Off by construction when no definition was given: the companion lists no element.
export const variableDottedKeyRule: ILintRule = {
  id: "variable/dotted-key",
  defaultSeverity: "error",
  run(ctx: LintContext): void {
    const presets = ctx.variablePresets;
    if (!presets) return;
    presets.getDottedKeyElements().forEach(element => {
      const path = element.getDataPath();
      const key = path[path.length - 1];
      // a set valueName is the key; it may be a number in the JSON (1.5 -> "1.5")
      const property = !!(<any>element).valueName ? "valueName" : "name";
      const isQuestion = element.isQuestion;
      const noun = isQuestion ? "question" : element.isPage ? "page" : "panel";
      ctx.report({
        message: "The variable definition " + noun + " \"" + element.name + "\" has the data key \"" + key +
          "\", which holds a dot. A variable key cannot hold one, so " +
          (isQuestion ? "the question declares no variable." :
            "the " + noun + " declares no object variable and none of its questions is a variable."),
        path: DEFINITION_PATH,
        reason: isQuestion ? reasons.questionKey : reasons.containerKey,
        messageData: { name: element.name, key: key, property: property, elementType: element.getType() },
        related: definitionRelated(element.name),
      });
    });
  },
};
