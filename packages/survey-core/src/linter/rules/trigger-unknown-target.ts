import { BinaryOperand, Const, Variable } from "../../expressions/expressions";
import { closestMatch } from "../levenshtein";
import { ILintRule, LintContext } from "../rule";
import { splitRefSegments } from "../expression-utils";
import { ElementRecord, TriggerRecord } from "../symbols";
import { ILintReproduction } from "../types";

function isKnownVariable(ctx: LintContext, name: string): boolean {
  const vars = ctx.options.knownVariables;
  return Array.isArray(vars) && vars.some(v => v.toLowerCase() === name.toLowerCase());
}

function candidates(ctx: LintContext, kind: "questionvalue" | "question" | "page"): Array<string> {
  const res: Array<string> = [];
  ctx.index.byName.forEach((records, name) => {
    const wantPage = kind === "page";
    if (records.some(rec => wantPage ? rec.kind === "page" : rec.kind === "question")) res.push(name);
  });
  if (kind === "questionvalue") {
    ctx.index.byValueName.forEach((records, name) => res.push(name));
    ctx.index.calculatedValues.forEach((record, name) => res.push(name));
  }
  return res;
}

function buildReproduction(trigger: TriggerRecord, targetName: string): ILintReproduction | undefined {
  const ast = trigger.expressionSite ? trigger.expressionSite.ast : undefined;
  if (!(ast instanceof BinaryOperand) || ast.operator !== "equal") return undefined;
  const left = ast.leftOperand;
  const right = ast.rightOperand;
  let variable: Variable;
  let constant: Const;
  if (left instanceof Variable && right instanceof Const && !(right instanceof Variable)) {
    variable = left;
    constant = right;
  } else if (right instanceof Variable && left instanceof Const && !(left instanceof Variable)) {
    variable = right;
    constant = left;
  } else {
    return undefined;
  }
  const root = splitRefSegments(variable.variable)[0];
  if (!root || !root.name || root.name.indexOf(":") > -1) return undefined;
  return {
    description: "This fires the trigger, which then targets the missing element \"" + targetName + "\".",
    steps: [{ set: { [root.name]: constant.correctValue } }],
  };
}

export const triggerUnknownTargetRule: ILintRule = {
  id: "trigger/unknown-target",
  defaultSeverity: "error",
  run(ctx: LintContext): void {
    ctx.index.triggers.forEach(trigger => {
      trigger.targets.forEach(target => {
        const segments = splitRefSegments(target.name);
        const root = segments[0] ? segments[0].name : "";
        if (!root) return;
        let resolved: ElementRecord = <ElementRecord>ctx.index.byName.first(root);
        if (target.kind === "questionvalue" && !resolved) {
          resolved = <ElementRecord>ctx.index.byValueName.first(root);
        }
        if (target.kind === "questionvalue" && !resolved &&
          (ctx.index.calculatedValues.has(root) || isKnownVariable(ctx, root))) {
          return;
        }
        if (target.kind === "page") {
          if (resolved && resolved.kind === "page") return;
          ctx.report({
            message: "The " + trigger.type + " trigger targets page \"" + target.name + "\", which does not exist.",
            path: target.path,
            messageData: { trigger: trigger.type, prop: target.prop, name: target.name, kind: target.kind },
            suggestion: closestMatch(root, candidates(ctx, "page")),
            reproduction: buildReproduction(trigger, target.name),
          });
          return;
        }
        if (!resolved || resolved.kind !== "question") {
          const kindText = target.kind === "question" ? "question" : "question or variable";
          ctx.report({
            message: "The " + trigger.type + " trigger " +
              (target.prop === "fromName" ? "reads" : (target.prop === "gotoName" ? "navigates to" : "sets")) +
              " \"" + target.name + "\", but no " + kindText + " with that name exists." +
              (target.kind === "questionvalue"
                ? " If it is a variable set at runtime, list it in options.knownVariables."
                : ""),
            path: target.path,
            messageData: { trigger: trigger.type, prop: target.prop, name: target.name, kind: target.kind },
            suggestion: closestMatch(root, candidates(ctx, target.kind)),
            reproduction: buildReproduction(trigger, target.name),
          });
          return;
        }
        // indexed paths into dynamic containers: panel1[0].q2 / matrix1[0].col1
        if (segments.length > 1) {
          const inner = segments[1].name;
          let innerNames: Array<string>;
          let containerText: string;
          if (resolved.type === "paneldynamic" && resolved.templateNames && segments[0].index !== undefined) {
            innerNames = resolved.templateNames.names();
            containerText = "template question";
          } else if (resolved.type === "matrixdynamic" && resolved.matrixColumns && segments[0].index !== undefined) {
            innerNames = resolved.matrixColumns.names();
            containerText = "column";
          } else {
            return;
          }
          if (!innerNames.some(name => name.toLowerCase() === inner.toLowerCase())) {
            ctx.report({
              message: "The " + trigger.type + " trigger targets \"" + target.name + "\", but " +
                resolved.type + " \"" + root + "\" has no " + containerText + " \"" + inner + "\".",
              path: target.path,
              messageData: { trigger: trigger.type, prop: target.prop, name: target.name, segment: inner, kind: target.kind },
              suggestion: closestMatch(inner, innerNames),
              reproduction: buildReproduction(trigger, target.name),
            });
          }
        }
      });
    });
  },
};
