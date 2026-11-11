import { Base } from "../base";
import { property } from "../decorators";
import { Action } from "../actions/action";
import { SurveyModel } from "../survey";
import { PanelModel } from "../panel";
import { Question } from "../question";
import { CustomError } from "../error";
import { Serializer } from "../jsonobject";
import { toCssClasses } from "../utils/cssClassBuilder";
import type { FilterAIRequest, FilterAIResult } from "./filter-ai";
import { filterUIStrings } from "./filter-ui-strings";
import { removePanelFromSurvey } from "./filter-conditions-editor";
// The question type the description is typed in; imported here, as the other dialogs import theirs.
import "../question_comment";

// The longest description: the mockup's counter.
export const filterAIPromptMaxLength = 500;

export interface IFilterAIPromptOptions {
  // The filter the dialog holds now, as text, "" for none: Make Changes sends it, and with none the
  // request is for a new filter (Create new filter).
  getExpression: () => string;
  // the model's filter, as text, and the title it gave it
  onAnswer: (expression: string, title: string) => void;
  // The survey the description is added to, as a panel at the end of its first page: the dialog's
  // survey (Add New Preset, Edit Presets), which the dialog owns and draws.
  survey: SurveyModel;
  // The control's classes: the panel's frame (aiPrompt) and the row of its button (aiPromptRequest).
  css?: any;
}

// The description of what the filter needs or what to change in it, and its request button - "Create
// new filter", then "Make Changes" - with the request's state: busy while the model answers, and what
// went wrong. It starts empty and is not part of the preset: it stays in the field after an answer,
// and Make Changes sends it again with the filter as it is. Owns the request and disposes it.
// It is made of survey elements only, so a renderer draws it as the survey it is in: a panel titled
// promptTitle with the description's comment question, the request button in the panel's footer and
// errorText as the question's error.
export class FilterAIPrompt extends Base {
  @property({ defaultValue: false }) isBusy: boolean;
  // "" while nothing went wrong
  @property({ defaultValue: "" }) errorText: string;
  // There is a filter to change: the caption and the button say so, and a request is "modify". Follows
  // the dialog's filter (refresh).
  @property({ defaultValue: false }) isModify: boolean;
  private surveyValue: SurveyModel;
  private panelValue: PanelModel;
  private requestActionValue: Action;
  private onSurveyValueChanged = (): void => { this.updateAction(); };
  private onUpdatePanelCss = (_: SurveyModel, options: any): void => {
    if (options.panel === this.panelValue && !!this.css.aiPrompt) {
      options.cssClasses.panel.container = toCssClasses(options.cssClasses.panel.container, this.css.aiPrompt);
    }
  };

  constructor(private aiRequest: FilterAIRequest, private options: IFilterAIPromptOptions) {
    super();
    this.surveyValue = options.survey;
    // Listened to before the panel is made: the panel reads its classes when it is first drawn.
    this.surveyValue.onUpdatePanelCssClasses.add(this.onUpdatePanelCss);
    // The mockup's light brand button across the frame.
    this.requestActionValue = new Action({ id: "sv-filter-ai-request", iconName: "icon-sparkle-24x24", iconSize: "auto",
      appearance: { style: "brand", mode: "secondary", size: "medium" }, action: (): void => { this.request(); } });
    this.panelValue = this.createPanel();
    this.surveyValue.setValue("prompt", "");
    this.surveyValue.onValueChanged.add(this.onSurveyValueChanged);
    this.refresh();
  }
  // The dialog's filter changed: whether there is one to change now.
  public refresh(): void {
    if (this.isDisposed) return;
    this.isModify = !!(this.options.getExpression() || "").trim();
    this.updateAction();
  }
  public getType(): string { return "filteraiprompt"; }
  // The panel with the caption, the description and the request button.
  public get panel(): PanelModel { return this.panelValue; }
  public get prompt(): string { return this.surveyValue.getValue("prompt") || ""; }
  public set prompt(val: string) { this.surveyValue.setValue("prompt", val || ""); }
  public get promptTitle(): string {
    return this.isModify ? filterUIStrings.aiPromptEdit : filterUIStrings.aiPromptNew;
  }
  public get requestAction(): Action { return this.requestActionValue; }
  // Asks the model: a new filter, or a change of the filter as it is now. Nothing while a request runs
  // or for a blank description.
  public request(): void {
    const prompt = this.prompt.trim();
    if (this.isDisposed || this.isBusy || !prompt) return;
    this.isBusy = true;
    this.errorText = "";
    this.updateAction();
    const done = (res: FilterAIResult): void => { this.onResult(res); };
    const expression = (this.options.getExpression() || "").trim();
    if (!!expression) {
      this.aiRequest.modify(prompt, expression, done);
    } else {
      this.aiRequest.generate(prompt, done);
    }
  }
  // Stops waiting: the answer of the request, if it comes, is ignored.
  public cancel(): void {
    this.aiRequest.cancel();
    this.isBusy = false;
    this.updateAction();
  }
  // The survey belongs to its owner: the prompt takes only its panel and its value away.
  public dispose(): void {
    this.aiRequest.dispose();
    const survey = this.surveyValue;
    survey.onValueChanged.remove(this.onSurveyValueChanged);
    survey.onUpdatePanelCssClasses.remove(this.onUpdatePanelCss);
    if (!survey.isDisposed) {
      const page = this.panelValue.parent;
      if (!!page) page.blockAnimations();
      try {
        removePanelFromSurvey(this.panelValue);
      } finally {
        if (!!page) page.releaseAnimations();
      }
      survey.clearValue("prompt");
    }
    this.requestActionValue.dispose();
    super.dispose();
  }
  protected onPropertyValueChanged(name: string, oldValue: any, newValue: any): void {
    super.onPropertyValueChanged(name, oldValue, newValue);
    if (name === "errorText") {
      this.updateError();
    }
  }

  // A panel of its own: a question outside a panel gets a frame of its own, and the mockup frames the
  // caption, the description and the button together - the panel's frame (css.aiPrompt). The error
  // shows under the description.
  private createPanel(): PanelModel {
    const survey = this.surveyValue;
    const page = survey.pages.length > 0 ? survey.pages[0] : survey.addNewPage("page1");
    const panel = new PanelModel("promptPanel");
    // One button across the frame: an adaptive bar could fold it into a "more" menu.
    panel.allowAdaptiveActions = false;
    panel.footerActions.push(this.requestActionValue);
    panel.onGetFooterToolbarCssCallback = (): string => toCssClasses(panel.cssClasses.panel.footer, this.css.aiPromptRequest);
    // On the page first, then the question in it: an empty page that gets a panel which already has
    // a question does not become the survey's current page, and a survey with none draws nothing.
    // Not animated, as the fields' panels are not: in Edit Presets it comes with another tab, which
    // is drawn anew - and an entering row of a page that is already drawn could stay undrawn.
    page.blockAnimations();
    try {
      page.addElement(panel);
      const question = <Question>Serializer.createClass("comment");
      question.fromJSON({ name: "prompt", titleLocation: "hidden", maxLength: filterAIPromptMaxLength,
        textUpdateMode: "onTyping", errorLocation: "bottom" });
      panel.addElement(question);
    } finally {
      page.releaseAnimations();
    }
    return panel;
  }
  private get css(): any { return this.options.css || {}; }
  private get promptQuestion(): Question { return <Question>this.panelValue.getQuestionByName("prompt"); }
  private onResult(res: FilterAIResult): void {
    if (this.isDisposed) return;
    this.isBusy = false;
    if (res.status === "answer" || res.status === "expression") {
      this.errorText = "";
      const expression = res.status === "answer" ? this.aiRequest.toExpression(res.conditions) : res.expression;
      this.options.onAnswer(expression, res.title);
    } else if (res.status === "empty") {
      this.errorText = res.explanation || filterUIStrings.aiEmpty;
    } else {
      this.errorText = filterUIStrings.aiError;
    }
    this.updateAction();
  }
  // errorText is the description's only error: the survey is never validated.
  private updateError(): void {
    const question = !!this.panelValue ? this.promptQuestion : undefined;
    if (!question) return;
    const text = this.errorText;
    if (!!text) {
      question.errors = [new CustomError(text, this.surveyValue)];
    } else if (question.errors.length > 0) {
      question.errors = [];
    }
  }
  private updateAction(): void {
    const action = this.requestActionValue;
    if (!action || !this.panelValue) return;
    this.panelValue.title = this.promptTitle;
    // The hidden title is still the description's accessible name.
    this.promptQuestion.title = this.promptTitle;
    // While the model answers, the button says so: the answer may take seconds.
    if (this.isBusy) {
      action.title = this.isModify ? filterUIStrings.aiMakingChanges : filterUIStrings.aiCreating;
    } else {
      action.title = this.isModify ? filterUIStrings.aiMakeChanges : filterUIStrings.aiCreate;
    }
    action.enabled = !this.isBusy && !!this.prompt.trim();
  }
}
