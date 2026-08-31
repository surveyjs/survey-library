import { ILintRule, LintContext } from "../rule";
import { classifyNameRef, classifySiteRefs } from "../expression-utils";
import { ElementRecord, NameRef, ParsedRef } from "../symbols";
import { didYouMean } from "../message-utils";
import { SurveyLintReasons } from "../reasons";
import { ILintHint } from "../types";

const reasons = SurveyLintReasons["reference/unknown"];

function segmentName(ref: ParsedRef): string {
  const idx = ref.unknownSegmentIndex || 0;
  return ref.segments[idx] ? ref.segments[idx].name : ref.raw;
}

function getReason(ref: ParsedRef): string {
  const idx = ref.unknownSegmentIndex || 0;
  if (ref.status === "scoped-unknown") return reasons.scopedUnknown;
  if (idx > 0 && ref.resolvedTo) return reasons.inContainer;
  return reasons.notFound;
}

function buildMessage(ref: ParsedRef, context: string): string {
  let message: string;
  const reason = getReason(ref);
  if (reason === reasons.scopedUnknown) {
    message = "\"" + segmentName(ref) + "\" is not found in the \"" + ref.scopePrefix + "\" scope of {" + ref.raw + "}.";
  } else if (reason === reasons.inContainer) {
    message = "\"" + segmentName(ref) + "\" is not found in " + ref.resolvedTo.type + " \"" + ref.segments[0].name + "\" ({" + ref.raw + "}).";
  } else {
    message = "\"" + ref.raw + "\" is not found - no question, panel, page, calculated value, or variable with that name exists.";
  }
  message += didYouMean(ref.suggestion);
  if (ref.scopeHint) message += " " + ref.scopeHint;
  if (context) message += " " + context;
  return message;
}

function isUnknown(ref: ParsedRef): boolean {
  return ref.status === "unknown" || ref.status === "scoped-unknown";
}

function getHint(ref: ParsedRef): ILintHint {
  if (!ref.hintReason) return undefined;
  return { reason: ref.hintReason, name: ref.hintName };
}

// One report for both forms an unknown reference takes: inside an expression, where the
// expression itself is named, and inside a plain name property (bindings, a choicesByUrl URL),
// where only the context sentence differs.
function reportRef(ctx: LintContext, ref: ParsedRef, params: {
  path: string, owner?: ElementRecord, context: string, expression?: string, refKind: string,
}): void {
  ctx.report({
    message: buildMessage(ref, params.context),
    path: params.path,
    reason: getReason(ref),
    hint: getHint(ref),
    messageData: {
      name: ref.raw,
      segment: segmentName(ref),
      segmentIndex: ref.unknownSegmentIndex || 0,
      root: ref.segments[0].name,
      containerType: ref.resolvedTo ? ref.resolvedTo.type : undefined,
      expression: params.expression,
      refKind: params.refKind,
      scopePrefix: ref.scopePrefix,
      note: "No case: the reference cannot be evaluated.",
    },
    elementName: params.owner ? params.owner.name : undefined,
    elementType: params.owner ? params.owner.type : undefined,
    suggestion: ref.suggestion,
  });
}

export const referenceUnknownRule: ILintRule = {
  id: "reference/unknown",
  defaultSeverity: "error",
  run(ctx: LintContext): void {
    ctx.forEachSite("parsed", site => {
      classifySiteRefs(site, ctx.index, ctx.options).forEach(ref => {
        if (!isUnknown(ref)) return;
        reportRef(ctx, ref, {
          path: site.path, owner: site.owner, refKind: "expression",
          expression: site.text, context: site.text ? "(in \"" + site.text + "\")" : "",
        });
      });
    });
    ctx.index.nameRefs.forEach((nameRef: NameRef) => {
      const ref = classifyNameRef(nameRef, ctx.index, ctx.options);
      if (!isUnknown(ref)) return;
      reportRef(ctx, ref, {
        path: nameRef.path, owner: nameRef.owner, refKind: nameRef.kind,
        context: nameRef.kind === "binding"
          ? "(referenced in bindings)" : "(referenced in the choicesByUrl URL)",
      });
    });
  },
};
