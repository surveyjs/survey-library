import { ILintRule, LintContext } from "../rule";
import { classifyNameRef, classifySiteRefs } from "../expression-utils";
import { ExpressionSite, NameRef, ParsedRef } from "../symbols";

function segmentName(ref: ParsedRef): string {
  const idx = ref.unknownSegmentIndex || 0;
  return ref.segments[idx] ? ref.segments[idx].name : ref.raw;
}

function buildMessage(ref: ParsedRef, context: string): string {
  const idx = ref.unknownSegmentIndex || 0;
  let message: string;
  if (ref.status === "scoped-unknown") {
    message = "\"" + segmentName(ref) + "\" is not found in the \"" + ref.scopePrefix + "\" scope of {" + ref.raw + "}.";
  } else if (idx > 0 && ref.resolvedTo) {
    message = "\"" + segmentName(ref) + "\" is not found in " + ref.resolvedTo.type + " \"" + ref.segments[0].name + "\" ({" + ref.raw + "}).";
  } else {
    message = "\"" + ref.raw + "\" is not found - no question, panel, page, calculated value, or variable with that name exists.";
  }
  if (ref.suggestion) message += " Did you mean \"" + ref.suggestion + "\"?";
  if (ref.scopeHint) message += " " + ref.scopeHint;
  if (context) message += " " + context;
  return message;
}

function reportRef(ctx: LintContext, ref: ParsedRef, path: string, site: ExpressionSite | undefined,
  expression: string, refKind: string): void {
  ctx.report({
    message: buildMessage(ref, expression ? "(in \"" + expression + "\")" : ""),
    path: path,
    messageData: {
      name: ref.raw,
      segment: segmentName(ref),
      segmentIndex: ref.unknownSegmentIndex || 0,
      expression: expression,
      refKind: refKind,
      scopePrefix: ref.scopePrefix,
      note: "No case: the reference cannot be evaluated.",
    },
    elementName: site && site.owner ? site.owner.name : undefined,
    elementType: site && site.owner ? site.owner.type : undefined,
    suggestion: ref.suggestion,
  });
}

export const referenceUnknownRule: ILintRule = {
  id: "reference/unknown",
  defaultSeverity: "error",
  run(ctx: LintContext): void {
    ctx.index.expressionSites.forEach(site => {
      if (site.parseError) return;
      classifySiteRefs(site, ctx.index, ctx.options).forEach(ref => {
        if (ref.status === "unknown" || ref.status === "scoped-unknown") {
          reportRef(ctx, ref, site.path, site, site.text, "expression");
        }
      });
    });
    ctx.index.nameRefs.forEach((nameRef: NameRef) => {
      const ref = classifyNameRef(nameRef, ctx.index, ctx.options);
      if (ref.status === "unknown" || ref.status === "scoped-unknown") {
        ctx.report({
          message: buildMessage(ref, nameRef.kind === "binding"
            ? "(referenced in bindings)" : "(referenced in the choicesByUrl URL)"),
          path: nameRef.path,
          messageData: {
            name: ref.raw,
            segment: segmentName(ref),
            segmentIndex: ref.unknownSegmentIndex || 0,
            refKind: nameRef.kind,
            note: "No case: the reference cannot be evaluated.",
          },
          elementName: nameRef.owner ? nameRef.owner.name : undefined,
          elementType: nameRef.owner ? nameRef.owner.type : undefined,
          suggestion: ref.suggestion,
        });
      }
    });
  },
};
