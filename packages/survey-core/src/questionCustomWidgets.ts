import { Base, Event } from "./base";
import { IQuestion } from "./base-interfaces";

export class QuestionCustomWidget {
  public htmlTemplate: string;

  constructor(public name: string, public widgetJson: any) {
    this.htmlTemplate = widgetJson.htmlTemplate ? widgetJson.htmlTemplate : "";
  }
  public afterRender(question: IQuestion, el: any) {
    if(!this.widgetJson.afterRender) return;
    (<any>question).localeChangedCallback = () => {
      if(this.widgetJson.willUnmount) {
        this.widgetJson.willUnmount(question, el);
      }
      this.widgetJson.afterRender(question, el);
    };
    this.widgetJson.afterRender(question, el);
  }
  public willUnmount(question: IQuestion, el: any) {
    if (this.widgetJson.willUnmount) this.widgetJson.willUnmount(question, el);
  }
  public getDisplayValue(question: IQuestion, value: any = undefined): string {
    if (this.widgetJson.getDisplayValue)
      return this.widgetJson.getDisplayValue(question, value);
    return null;
  }
  public validate(question: IQuestion): string {
    if (this.widgetJson.validate)
      return this.widgetJson.validate(question);
    return undefined;
  }
  public isFit(question: IQuestion): boolean {
    if (this.isLibraryLoaded() && this.widgetJson.isFit)
      return this.widgetJson.isFit(question);
    return false;
  }
  public get canShowInToolbox(): boolean {
    if (this.widgetJson.showInToolbox === false) return false;
    if (
      CustomWidgetCollection.Instance.getActivatedBy(this.name) != "customtype"
    )
      return false;
    return !this.widgetJson.widgetIsLoaded || this.widgetJson.widgetIsLoaded();
  }
  public get showInToolbox(): boolean {
    return this.widgetJson.showInToolbox !== false;
  }
  public set showInToolbox(val: boolean) {
    this.widgetJson.showInToolbox = val;
  }
  public init() {
    if (this.widgetJson.init) {
      this.widgetJson.init();
    }
  }
  public activatedByChanged(activatedBy: string) {
    if (this.isLibraryLoaded() && this.widgetJson.activatedByChanged) {
      this.widgetJson.activatedByChanged(activatedBy);
    }
  }
  private isLibraryLoaded(): boolean {
    if (this.widgetJson.widgetIsLoaded)
      return this.widgetJson.widgetIsLoaded() == true;
    return true;
  }
  public get isDefaultRender(): boolean {
    return this.widgetJson.isDefaultRender;
  }
  public get pdfQuestionType(): string {
    return this.widgetJson.pdfQuestionType;
  }
  public get pdfRender() {
    return this.widgetJson.pdfRender;
  }
}

export class CustomWidgetCollection {
  public static Instance: CustomWidgetCollection = new CustomWidgetCollection();
  private widgetsValues: Array<QuestionCustomWidget> = [];
  private widgetsActivatedBy = {};

  public onCustomWidgetAdded: Event<
    (customWidget: QuestionCustomWidget) => any,
    QuestionCustomWidget,
    any
  > = new Event<(customWidget: QuestionCustomWidget) => any, QuestionCustomWidget, any>();

  public get widgets(): Array<QuestionCustomWidget> {
    return this.widgetsValues;
  }
  public add(widgetJson: any, activatedBy: string = "property") {
    this.addCustomWidget(widgetJson, activatedBy);
  }
  public addCustomWidget(
    widgetJson: any,
    activatedBy: string = "property"
  ): QuestionCustomWidget {
    var name = widgetJson.name;
    if (!name) {
      name = "widget_" + this.widgets.length + 1;
    }
    var customWidget = new QuestionCustomWidget(name, widgetJson);
    this.widgetsValues.push(customWidget);
    customWidget.init();
    (<any>this).widgetsActivatedBy[name] = activatedBy;
    customWidget.activatedByChanged(activatedBy);
    this.onCustomWidgetAdded.fire(customWidget, null);
    return customWidget;
  }
  /**
   * Returns the way the custom wiget is activated. It can be activated by a property ("property"), question type ("type") or by new/custom question type ("customtype").
   * @param widgetName the custom widget name
   * @see setActivatedBy
   */
  public getActivatedBy(widgetName: string): string {
    var res = (<any>this).widgetsActivatedBy[widgetName];
    return res ? res : "property";
  }
  /**
   * Sets the way the custom wiget is activated. The activation types are: property ("property"), question type ("type") or new/custom question type ("customtype"). A custom wiget may support all or only some of this activation types.
   * @param widgetName
   * @param activatedBy there are three possible variants: "property", "type" and "customtype"
   */
  public setActivatedBy(widgetName: string, activatedBy: string) {
    if (!widgetName || !activatedBy) return;
    var widget = this.getCustomWidgetByName(widgetName);
    if (!widget) return;
    (<any>this).widgetsActivatedBy[widgetName] = activatedBy;
    widget.activatedByChanged(activatedBy);
  }
  public clear() {
    this.widgetsValues = [];
  }
  public getCustomWidgetByName(name: string): QuestionCustomWidget {
    for (var i = 0; i < this.widgets.length; i++) {
      if (this.widgets[i].name == name) return this.widgets[i];
    }
    return null;
  }
  public getCustomWidget(question: IQuestion): QuestionCustomWidget {
    for (var i = 0; i < this.widgetsValues.length; i++) {
      if (this.widgetsValues[i].isFit(question)) return this.widgetsValues[i];
    }
    return null;
  }
}
