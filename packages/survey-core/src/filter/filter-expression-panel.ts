import { SurveyModel } from "../survey";
import { PanelModel, PanelModelBase } from "../panel";
import { Question } from "../question";
import { Serializer } from "../jsonobject";
import { canParseFilterExpression } from "./filter-conditions";
import { removePanelFromSurvey } from "./filter-conditions-editor";
import { filterUIStrings } from "./filter-ui-strings";
// The question type the text is typed in; imported here, as the other dialogs import theirs.
import "../question_comment";

export interface IFilterExpressionPanelOptions {
  // the panel's title; the text's accessible name too, as its own title is hidden
  title: string;
  // shown, not typed in: no placeholder and no check
  readOnly?: boolean;
  // where the panel goes: the survey's first page when not given, at the start unless index says
  container?: PanelModelBase;
  index?: number;
  // after every change the respondent types
  onChanged?: (text: string) => void;
}

// Why a typed expression cannot be a preset's filter: "" for one that can.
export function getFilterExpressionError(text: string): string {
  const value = (text || "").trim();
  if (!value) return filterUIStrings.presetNoExpression;
  return canParseFilterExpression(value) ? "" : filterUIStrings.presetInvalidExpression;
}

// The text of a filter expression in a survey of someone else's: a panel named "expression" with a
// comment question in it, which the survey's own validation checks (empty, or text that does not
// parse - getFilterExpressionError) unless it is read-only. A panel of its own, as the presets'
// Contains is: a question that is not in a panel gets a frame, and the mockup frames neither. A
// renderer draws it as the survey it is in. The survey belongs to its owner: dispose() takes only
// the panel and its value away.
export class FilterExpressionPanel {
  private panelValue: PanelModel;
  private isDisposedValue: boolean = false;
  private onValueChanged = (_: SurveyModel, options: any): void => {
    if (options.question === this.question && !!this.options.onChanged) {
      this.options.onChanged(this.text);
    }
  };
  private onValidateQuestion = (_: SurveyModel, options: any): void => {
    if (options.question === this.question && !this.options.readOnly) {
      const error = getFilterExpressionError(options.value);
      if (!!error) options.error = error;
    }
  };

  constructor(private survey: SurveyModel, text: string, private options: IFilterExpressionPanelOptions) {
    const container = options.container || (survey.pages.length > 0 ? survey.pages[0] : survey.addNewPage("page1"));
    const panel = new PanelModel("expression");
    panel.title = options.title;
    // On the container first, then the question in it, as FilterAIPrompt does: an empty page that gets
    // a panel which already has a question does not become the survey's current page.
    container.blockAnimations();
    try {
      container.addElement(panel, options.index !== undefined ? options.index : 0);
      const question = <Question>Serializer.createClass("comment");
      question.fromJSON({ name: "expression", titleLocation: "hidden", title: options.title, textUpdateMode: "onTyping",
        placeholder: options.readOnly ? "" : filterUIStrings.expressionPlaceholder, readOnly: !!options.readOnly });
      panel.addElement(question);
    } finally {
      container.releaseAnimations();
    }
    this.panelValue = panel;
    this.question.value = text || "";
    survey.onValueChanged.add(this.onValueChanged);
    survey.onValidateQuestion.add(this.onValidateQuestion);
  }
  public get panel(): PanelModel { return this.panelValue; }
  public get question(): Question { return <Question>this.panelValue.getQuestionByName("expression"); }
  public get text(): string { return this.question.value || ""; }
  public set text(val: string) { this.question.value = val || ""; }
  public get isDisposed(): boolean { return this.isDisposedValue; }
  public dispose(): void {
    if (this.isDisposedValue) return;
    this.isDisposedValue = true;
    const survey = this.survey;
    survey.onValueChanged.remove(this.onValueChanged);
    survey.onValidateQuestion.remove(this.onValidateQuestion);
    if (survey.isDisposed) return;
    const container = this.panelValue.parent;
    if (!!container) container.blockAnimations();
    try {
      removePanelFromSurvey(this.panelValue);
    } finally {
      if (!!container) container.releaseAnimations();
    }
    survey.clearValue("expression");
  }
}
