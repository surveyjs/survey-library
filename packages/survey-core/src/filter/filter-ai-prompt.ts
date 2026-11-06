import { Base } from "../base";
import { property } from "../decorators";
import { Action } from "../actions/action";
import { ActionContainer } from "../actions/container";
import { SurveyModel } from "../survey";
import { IFilterCondition } from "../interfaces/ui-interfaces";
import type { FilterAIRequest, FilterAIResult } from "./filter-ai";
import { filterUIStrings } from "./filter-ui-strings";
// The question type the description is typed in; imported here, as the other dialogs import theirs.
import "../question_comment";

// The longest description: the mockup's counter.
export const filterAIPromptMaxLength = 500;

export interface IFilterAIPromptOptions {
  // the description the field starts with
  prompt?: string;
  // the filter exists: the request is "modify" from the start (an AI preset in Edit Presets)
  isModify?: boolean;
  // the caption over the field once there is a filter; aiPromptChange when not given
  modifyTitle?: string;
  locale: string;
  // the filter as it is now, which "modify" sends
  getConditions: () => Array<IFilterCondition>;
  onAnswer: (conditions: Array<IFilterCondition>, title: string) => void;
}

// The description of a filter and its request button - "Create new filter", then "Make Changes" -
// with the request's state: busy while the model answers, and what went wrong. The description is
// what the filter is for: it stays in the field after an answer and is sent again, with the filter
// as it is, by Make Changes. Owns the request and disposes it.
export class FilterAIPrompt extends Base {
  @property({ defaultValue: false }) isBusy: boolean;
  // "" while nothing went wrong
  @property({ defaultValue: "" }) errorText: string;
  // There is a filter to change: the caption and the button say so, and a request is "modify".
  @property({ defaultValue: false }) isModify: boolean;
  private formValue: SurveyModel;
  private requestActionValue: Action;
  private requestToolbarValue: ActionContainer;

  constructor(private aiRequest: FilterAIRequest, private options: IFilterAIPromptOptions) {
    super();
    this.isModify = !!options.isModify;
    // In a panel of its own, as the preset dialogs' title is: a question that is not in a panel gets a
    // frame, and the mockup has none.
    this.formValue = new SurveyModel({ showNavigationButtons: false, showQuestionNumbers: "off",
      elements: [{ type: "panel", name: "promptPanel", elements: [
        { type: "comment", name: "prompt", titleLocation: "hidden", maxLength: filterAIPromptMaxLength, textUpdateMode: "onTyping" }] }] });
    this.formValue.locale = options.locale;
    // Inside the dialog with no frames of its own, as the fields' editors are.
    this.formValue.isCompact = true;
    this.formValue.setValue("prompt", options.prompt || "");
    this.formValue.onValueChanged.add((): void => { this.updateAction(); });
    this.requestActionValue = new Action({ id: "sv-filter-ai-request", iconName: "icon-sparkle-24x24", iconSize: "auto",
      action: (): void => { this.request(); } });
    // The mockup's light brand button across the dialog: an action bar of its own, as every other
    // button of the control is drawn.
    this.requestToolbarValue = new ActionContainer();
    this.requestToolbarValue.setActionsAppearance({ style: "brand", mode: "secondary", size: "medium" });
    this.requestToolbarValue.setItems([this.requestActionValue], false);
    this.updateAction();
  }
  public getType(): string { return "filteraiprompt"; }
  public get form(): SurveyModel { return this.formValue; }
  public get prompt(): string { return this.formValue.getValue("prompt") || ""; }
  public get promptTitle(): string {
    return !this.isModify ? filterUIStrings.aiPromptNew : (this.options.modifyTitle || filterUIStrings.aiPromptChange);
  }
  public get requestAction(): Action { return this.requestActionValue; }
  public get requestToolbar(): ActionContainer { return this.requestToolbarValue; }
  // Asks the model: a new filter, or the filter as it is for the description as it is now. Nothing
  // while a request runs or for a blank description.
  public request(): void {
    const prompt = this.prompt.trim();
    if (this.isDisposed || this.isBusy || !prompt) return;
    this.isBusy = true;
    this.errorText = "";
    this.updateAction();
    const done = (res: FilterAIResult): void => { this.onResult(res); };
    if (this.isModify) {
      this.aiRequest.modify(prompt, this.options.getConditions(), done);
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
  public dispose(): void {
    this.aiRequest.dispose();
    this.requestToolbarValue.dispose();
    this.formValue.dispose();
    super.dispose();
  }

  private onResult(res: FilterAIResult): void {
    if (this.isDisposed) return;
    this.isBusy = false;
    if (res.status === "answer") {
      this.errorText = "";
      this.isModify = true;
      this.options.onAnswer(res.conditions, res.title);
    } else if (res.status === "empty") {
      this.errorText = res.explanation || filterUIStrings.aiEmpty;
    } else {
      this.errorText = filterUIStrings.aiError;
    }
    this.updateAction();
  }
  private updateAction(): void {
    const action = this.requestActionValue;
    if (!action) return;
    // While the model answers, the button says so: the answer may take seconds.
    if (this.isBusy) {
      action.title = this.isModify ? filterUIStrings.aiMakingChanges : filterUIStrings.aiCreating;
    } else {
      action.title = this.isModify ? filterUIStrings.aiMakeChanges : filterUIStrings.aiCreate;
    }
    action.enabled = !this.isBusy && !!this.prompt.trim();
  }
}
