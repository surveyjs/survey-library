import { ILintRule, LintContext } from "../rule";
import { SurveyLintReasons } from "../reasons";

const reasons = SurveyLintReasons["progress/incompatible-location"];

const QUESTION_PROGRESS_TYPES = [
  "questions",
  "requiredquestions", "requiredquestion",
  "correctquestions", "correctquestion",
];

function isQuestionProgressBarType(type: any): boolean {
  return typeof type === "string" && QUESTION_PROGRESS_TYPES.indexOf(type.toLowerCase()) !== -1;
}

function isAdvancedHeader(json: any): boolean {
  const view = json.headerView;
  if (view === undefined || view === null || view === "") return true;
  return typeof view === "string" && view.toLowerCase() === "advanced";
}

function authoredLocation(json: any): { value: string, path: string } | undefined {
  if (typeof json.progressBarLocation === "string") {
    return { value: json.progressBarLocation, path: "progressBarLocation" };
  }
  if (typeof json.showProgressBar === "string") {
    return { value: json.showProgressBar, path: "showProgressBar" };
  }
  return undefined;
}

function isBelowHeader(value: string): boolean {
  return value.toLowerCase() === "belowheader";
}

export const progressIncompatibleLocationRule: ILintRule = {
  id: "progress/incompatible-location",
  defaultSeverity: "warning",
  run(ctx: LintContext): void {
    const json = ctx.index.json;
    if (!json || typeof json !== "object" || Array.isArray(json)) return;
    if (!isAdvancedHeader(json) || !isQuestionProgressBarType(json.progressBarType)) return;
    const location = authoredLocation(json);
    if (!location || !isBelowHeader(location.value)) return;
    const headerView = typeof json.headerView === "string" && json.headerView !== ""
      ? json.headerView : "advanced";
    ctx.report({
      message: "\"" + location.path + "\" is " + JSON.stringify(location.value) +
        ", which is incompatible with an advanced header when progressBarType is " +
        JSON.stringify(json.progressBarType) + ". Question progress (answered questions, " +
        "answered required questions, or correct answers) renders incorrectly below an " +
        "advanced header. Use another location, the \"pages\" progress type, or a basic header.",
      path: location.path,
      reason: reasons.belowHeader,
      messageData: {
        key: location.path,
        location: location.value,
        progressBarType: json.progressBarType,
        headerView: headerView,
      },
    });
  },
};
