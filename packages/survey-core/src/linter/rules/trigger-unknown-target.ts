import { ILintRule, LintContext } from "../rule";
import {
  buildTriggerSetStep, classifyTargetName, equalsCI, nameCandidates, RefSuggestion, respellRef,
  suggestForRef,
} from "../expression-utils";
import { ParsedRef, SegmentLevel, TriggerRecord } from "../symbols";
import { ILintReproduction } from "../types";
import {
  SurveyLintFixReasons, SurveyLintReasons, SurveyLintReproductionReasons,
} from "../reasons";
import { setFix } from "../fix-utils";

const reasons = SurveyLintReasons["trigger/unknown-target"];
const fixReasons = SurveyLintFixReasons["trigger/unknown-target"];

type TargetKind = "questionvalue" | "question" | "page";

// Kind-filtered pools: the pool classifyRef draws from is the one an expression reference
// may name, which would offer a question name for a page target.
function rootSuggestion(ctx: LintContext, ref: ParsedRef, kind: TargetKind): RefSuggestion | undefined {
  const wantPage = kind === "page";
  return suggestForRef(ref, nameCandidates(ctx.index, ctx.options, {
    accepts: record => record.kind === (wantPage ? "page" : "question"),
    values: kind === "questionvalue",
  }));
}

// The property holds the name as the author wrote it, so a dotted one keeps every segment the
// suggestion does not spell.
function respellRoot(ref: ParsedRef, suggestion: RefSuggestion | undefined): string | undefined {
  return suggestion ? respellRef(ref, 0, suggestion.end, suggestion.name) : undefined;
}

function buildReproduction(trigger: TriggerRecord, targetName: string): ILintReproduction | undefined {
  const step = buildTriggerSetStep(trigger, { equal: true });
  if (!step) return undefined;
  return {
    description: "This fires the trigger, which then targets the missing element \"" + targetName + "\".",
    reason: SurveyLintReproductionReasons.missingTriggerTarget,
    steps: [step],
  };
}

// The noun for what the unknown segment was meant to name inside its container.
function innerNoun(level: SegmentLevel): string {
  if (level === "templateQuestion") return "template question";
  if (level === "row" || level === "column" || level === "item") return level;
  return "field";
}

function isAcceptedTarget(ref: ParsedRef, kind: TargetKind): boolean {
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
          const pageSuggestion = rootSuggestion(ctx, ref, "page");
          ctx.report({
            message: "The " + trigger.type + " trigger targets page \"" + target.name + "\", which does not exist.",
            path: target.path,
            reason: reasons.pageNotFound,
            messageData: messageData,
            suggestion: pageSuggestion ? pageSuggestion.name : undefined,
            fix: setFix(fixReasons.setName, target.path, respellRoot(ref, pageSuggestion)),
            reproduction: buildReproduction(trigger, target.name),
          });
          return;
        }
        // the root resolved, but a segment inside the container did not
        if (ref.unknownSegmentIndex > 0 && ref.resolvedTo) {
          const segment = ref.segments[ref.unknownSegmentIndex];
          messageData.segment = segment.name;
          messageData.root = root;
          messageData.containerType = ref.resolvedTo.type;
          messageData.segmentIndex = ref.unknownSegmentIndex;
          messageData.segmentLevel = ref.unknownSegmentLevel;
          const suggestionEnd = ref.suggestionEnd !== undefined ? ref.suggestionEnd : ref.unknownSegmentIndex;
          ctx.report({
            message: "The " + trigger.type + " trigger targets \"" + target.name + "\", but " +
              ref.resolvedTo.type + " \"" + root + "\" has no " +
              innerNoun(ref.unknownSegmentLevel) + " \"" + segment.name + "\".",
            path: target.path,
            reason: reasons.segmentNotFound,
            messageData: messageData,
            suggestion: ref.suggestion,
            fix: setFix(fixReasons.setName, target.path,
              respellRef(ref, ref.unknownSegmentIndex, suggestionEnd, ref.suggestion)),
            reproduction: buildReproduction(trigger, target.name),
          });
          return;
        }
        const rootSuggestionValue = rootSuggestion(ctx, ref, target.kind);
        const kindText = target.kind === "question" ? "question" : "question or variable";
        ctx.report({
          message: "The " + trigger.type + " trigger " +
            (target.prop === "fromName" ? "reads" : (target.prop === "gotoName" ? "navigates to" : "sets")) +
            " \"" + target.name + "\", but no " + kindText + " with that name exists." +
            (target.kind === "questionvalue"
              ? " If it is a variable set at runtime, list it in options.knownVariables or declare it in the variable definition."
              : ""),
          path: target.path,
          reason: reasons.rootNotFound,
          messageData: messageData,
          suggestion: rootSuggestionValue ? rootSuggestionValue.name : undefined,
          fix: setFix(fixReasons.setName, target.path, respellRoot(ref, rootSuggestionValue)),
          reproduction: buildReproduction(trigger, target.name),
        });
      });
    });
  },
};
