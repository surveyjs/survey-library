import { countBySeverity, ILintFinding, IRenderOptions, ISurveyLintResult } from "./types";

const SEVERITY_LABELS: { [severity: string]: string } = {
  error: "ERROR", warning: "WARN", info: "INFO",
};

function renderFinding(finding: ILintFinding): string {
  const lines: Array<string> = [];
  lines.push(SEVERITY_LABELS[finding.severity] + "  " + finding.ruleId);
  lines.push("  " + finding.message);
  const expression = finding.messageData ? finding.messageData.expression : undefined;
  if (typeof expression === "string" && expression) {
    lines.push("");
    const prop = finding.path.lastIndexOf(".") > -1
      ? finding.path.substring(finding.path.lastIndexOf(".") + 1)
      : "expression";
    lines.push("  " + prop + ": " + expression);
  }
  lines.push("  at " + finding.path);
  // report() drops an empty list, so any related list a finding carries has something to say
  if (finding.related && finding.related.length > 0) {
    lines.push("  related: " + finding.related.map(rel => rel.path).join(", "));
  }
  const note = finding.messageData ? finding.messageData.note : undefined;
  if (finding.reproduction) {
    lines.push("");
    const title = finding.reproduction.description
      ? "  Reproduction: " + finding.reproduction.description
      : "  Reproduction:";
    lines.push(title);
    const json = JSON.stringify({ steps: finding.reproduction.steps }, undefined, 2);
    json.split("\n").forEach(line => lines.push("    " + line));
  } else if (typeof note === "string" && note) {
    lines.push("");
    lines.push("  " + note);
  }
  return lines.join("\n");
}

export function renderFindings(input: ISurveyLintResult | Array<ILintFinding>, options?: IRenderOptions): string {
  const isResult = !Array.isArray(input);
  const result = isResult ? <ISurveyLintResult>input : undefined;
  let findings = isResult ? result.findings : <Array<ILintFinding>>input;
  if (isResult && options && options.includeSuppressed && result.suppressed) {
    findings = findings.concat(result.suppressed);
  }
  const blocks = findings.map(renderFinding);
  // counted over what is rendered, which includeSuppressed may extend past result.findings
  const counts = countBySeverity(findings);
  let summary = counts.error + " error" + (counts.error === 1 ? "" : "s") + ", " +
    counts.warning + " warning" + (counts.warning === 1 ? "" : "s") + ", " +
    counts.info + " info";
  if (isResult && result.suppressedCount > 0) {
    summary += " (" + result.suppressedCount + " suppressed)";
  }
  blocks.push(summary);
  return blocks.join("\n\n");
}
