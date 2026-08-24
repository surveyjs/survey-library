import { closestMatch } from "../levenshtein";
import { ILintRule, LintContext } from "../rule";
import { buildTriggerSetStep, builtInVariableNames, classifyTargetName, equalsCI } from "../expression-utils";
import { ParsedRef, TriggerRecord } from "../symbols";
import { ILintReproduction } from "../types";

// Kind-filtered pools: classifyRef's own suggestion pool is unfiltered, which would
// offer question names for a page target.
function candidates(ctx: LintContext, kind: "questionvalue" | "question" | "page"): Array<string> {
  const res: Array<string> = [];
  ctx.index.byName.forEach((records, name) => {
    const wantPage = kind === "page";
    if (records.some(rec => wantPage ? rec.kind === "page" : rec.kind === "question")) res.push(name);
  });
  if (kind === "questionvalue") {
    ctx.index.byValueName.forEach((_, name) => res.push(name));
    ctx.index.calculatedValues.forEach((_, name) => res.push(name));
    if (Array.isArray(ctx.options.knownVariables)) res.push(...ctx.options.knownVariables);
    res.push(...builtInVariableNames());
  }
  return res;
}

function rootSuggestion(ctx: LintContext, ref: ParsedRef, kind: "questionvalue" | "question" | "page"): string | undefined {
  const pool = candidates(ctx, kind);
  // a typo inside a dotted name ("address.cty") is closest to the full registered name
  if (ref.segments.length > 1) {
    const joined = closestMatch(ref.segments.map(seg => seg.name).join("."), pool);
    if (joined) return joined;
  }
  return closestMatch(ref.segments[0].name, pool);
}

function buildReproduction(trigger: TriggerRecord, targetName: string): ILintReproduction | undefined {
  const step = buildTriggerSetStep(trigger, { equal: true });
  if (!step) return undefined;
  return {
    description: "This fires the trigger, which then targets the missing element \"" + targetName + "\".",
    steps: [step],
  };
}

// The noun for the container level the unknown segment belongs to.
function innerNoun(type: string, segmentIndex: number): string {
  if (type === "paneldynamic") return "template question";
  if (type === "matrixdynamic") return "column";
  if (type === "multipletext") return "item";
  if (type === "matrix") return "row";
  if (type === "matrixdropdown") return segmentIndex === 2 ? "column" : "row";
  return "field";
}

function isAcceptedTarget(ref: ParsedRef, kind: "questionvalue" | "question" | "page"): boolean {
  if (ref.status !== "resolved") return false;
  if (kind === "page") return ref.resolvedKind === "page";
  const record = ref.resolvedTo;
  if (kind === "question") {
    // navigation resolves by name only: a valueName hit or a "-total" data key is
    // not a navigable element, so require the record's own name to match the root
    return ref.resolvedKind === "element" && !!record && record.kind === "question" &&
      equalsCI(record.name, ref.segments[0].name);
  }
  if (ref.resolvedKind === "calculatedValue" || ref.resolvedKind === "knownVariable" ||
    ref.resolvedKind === "builtInVariable" || ref.resolvedKind === "comment") return true;
  return ref.resolvedKind === "element" && !!record && record.kind === "question";
}

export const triggerUnknownTargetRule: ILintRule = {
  id: "trigger/unknown-target",
  defaultSeverity: "error",
  run(ctx: LintContext): void {
    ctx.index.triggers.forEach(trigger => {
      trigger.targets.forEach(target => {
        const ref = classifyTargetName(target.name, ctx.index, ctx.options);
        // in name mode "skipped" only means an empty/degenerate name
        if (ref.status === "skipped") return;
        if (isAcceptedTarget(ref, target.kind)) return;
        const root = ref.segments[0].name;
        const messageData: { [key: string]: any } = {
          trigger: trigger.type, prop: target.prop, name: target.name, kind: target.kind,
        };
        if (target.kind === "page") {
          ctx.report({
            message: "The " + trigger.type + " trigger targets page \"" + target.name + "\", which does not exist.",
            path: target.path,
            messageData: messageData,
            suggestion: rootSuggestion(ctx, ref, "page"),
            reproduction: buildReproduction(trigger, target.name),
          });
          return;
        }
        // the root resolved, but a segment inside the container did not
        if (ref.unknownSegmentIndex > 0 && ref.resolvedTo) {
          const segment = ref.segments[ref.unknownSegmentIndex];
          messageData.segment = segment.name;
          ctx.report({
            message: "The " + trigger.type + " trigger targets \"" + target.name + "\", but " +
              ref.resolvedTo.type + " \"" + root + "\" has no " +
              innerNoun(ref.resolvedTo.type, ref.unknownSegmentIndex) + " \"" + segment.name + "\".",
            path: target.path,
            messageData: messageData,
            suggestion: ref.suggestion,
            reproduction: buildReproduction(trigger, target.name),
          });
          return;
        }
        const kindText = target.kind === "question" ? "question" : "question or variable";
        ctx.report({
          message: "The " + trigger.type + " trigger " +
            (target.prop === "fromName" ? "reads" : (target.prop === "gotoName" ? "navigates to" : "sets")) +
            " \"" + target.name + "\", but no " + kindText + " with that name exists." +
            (target.kind === "questionvalue"
              ? " If it is a variable set at runtime, list it in options.knownVariables."
              : ""),
          path: target.path,
          messageData: messageData,
          suggestion: rootSuggestion(ctx, ref, target.kind),
          reproduction: buildReproduction(trigger, target.name),
        });
      });
    });
  },
};
