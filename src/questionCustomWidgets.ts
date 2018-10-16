import { Base, IQuestion, Event } from "./base";

export class QuestionCustomWidget {
  public htmlTemplate: string;
  constructor(public name: string, public widgetJson: any) {
    this.htmlTemplate = widgetJson.htmlTemplate ? widgetJson.htmlTemplate : "";
  }
  public afterRender(question: IQuestion, el: any) {
    if (this.widgetJson.afterRender) this.widgetJson.afterRender(question, el);
  }
  public willUnmount(question: IQuestion, el: any) {
    if (this.widgetJson.willUnmount) this.widgetJson.willUnmount(question, el);
  }
  public getDisplayValue(question: IQuestion): string {
    if (this.widgetJson.getDisplayValue)
      return this.widgetJson.getDisplayValue(question);
    return null;
  }
  public isFit(question: IQuestion): boolean {
    if (this.isLibraryLoaded() && this.widgetJson.isFit)
      return this.widgetJson.isFit(question);
    return false;
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
}

export class CustomWidgetCollection {
  public static Instance: CustomWidgetCollection = new CustomWidgetCollection();
  private widgetsValues: Array<QuestionCustomWidget> = [];
  private widgetsActivatedBy = {};

  public onCustomWidgetAdded: Event<
    (customWidget: QuestionCustomWidget) => any,
    any
  > = new Event<(customWidget: QuestionCustomWidget) => any, any>();

  public get widgets(): Array<QuestionCustomWidget> {
    return this.widgetsValues;
  }
  public addCustomWidget(widgetJson: any, activatedBy: string = "property") {
    var name = widgetJson.name;
    if (!name) {
      name = "widget_" + this.widgets.length + 1;
    }
    var customWidget = new QuestionCustomWidget(name, widgetJson);
    this.widgetsValues.push(customWidget);
    (<any>this).widgetsActivatedBy[name] = activatedBy;
    customWidget.activatedByChanged(activatedBy);
    this.onCustomWidgetAdded.fire(customWidget, null);
  }
  /**
   * Returns the way the custom wiget is activated. It can be activated by a property ("property"), question type ("type") or by new/custom question type ("customtype").
   * @param widgetName the custom widget name
   * @see setActivatedBy
   */
  public getActivatedBy(widgetName: string) {
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
