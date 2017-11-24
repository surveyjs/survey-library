import { Base } from "./base";
import { SurveyModel } from "./survey";
import { LocalizableString } from "./localizablestring";

/**
 * A Model for a survey running in the Window.
 */
export class SurveyWindowModel extends Base {
  public static surveyElementName = "windowSurveyJS";
  private isExpandedValue: boolean = false;
  private isShowingValue: boolean;
  surveyValue: SurveyModel;
  windowElement: HTMLDivElement;

  templateValue: string;
  expandedChangedCallback: () => void;
  showingChangedCallback: () => void;

  constructor(jsonObj: any, initialModel: SurveyModel = null) {
    super();
    if (initialModel) {
      this.surveyValue = initialModel;
    } else {
      this.surveyValue = this.createSurvey(jsonObj);
    }
    this.surveyValue.showTitle = false;
    if ("undefined" !== typeof document) {
      this.windowElement = <HTMLDivElement>document.createElement("div");
    }
  }
  public getType(): string {
    return "window";
  }
  /**
   * A survey object.
   * @see SurveyModel
   */
  public get survey(): SurveyModel {
    return this.surveyValue;
  }
  /**
   * Returns true if the window is currently showing. Set it to true to show the window and false to hide it.
   * @see show
   * @see hide
   */
  public get isShowing(): boolean {
    return this.isShowingValue;
  }
  public set isShowing(val: boolean) {
    if (this.isShowing == val) return;
    this.isShowingValue = val;
    if (this.showingChangedCallback) this.showingChangedCallback();
  }
  /**
   * Show the window
   * @see hide
   * @see isShowing
   */
  public show() {
    this.isShowing = true;
  }
  /**
   * Hide the window
   * @see show
   * @see isShowing
   */
  public hide() {
    this.isShowing = false;
  }
  /**
   * Returns true if the window is expanded. Set it to true to expand the window or false to collapse it.
   * @see expand
   * @see collapse
   */
  public get isExpanded(): boolean {
    return this.isExpandedValue;
  }
  public set isExpanded(val: boolean) {
    if (val) this.expand();
    else this.collapse();
  }
  /**
   * The window and survey title.
   */
  public get title(): string {
    return this.survey.title;
  }
  public set title(value: string) {
    this.survey.title = value;
  }
  get locTitle(): LocalizableString {
    return this.survey.locTitle;
  }
  /**
   * Expand the window to show the survey.
   */
  public expand() {
    this.expandcollapse(true);
  }
  /**
   * Collapse the window and show survey title only.
   */
  public collapse() {
    this.expandcollapse(false);
  }
  protected createSurvey(jsonObj: any): SurveyModel {
    return new SurveyModel(jsonObj);
  }
  protected expandcollapse(value: boolean) {
    if (this.isExpandedValue == value) return;
    this.isExpandedValue = value;
    if (this.expandedChangedCallback) this.expandedChangedCallback();
  }
}
