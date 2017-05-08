import {Base, IQuestion, Event} from "./base";

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
    public isFit(question: IQuestion): boolean {
        if (this.widgetJson.isFit) return this.widgetJson.isFit(question);
        return false;
    }
}

export class CustomWidgetCollection {
    public static Instance: CustomWidgetCollection = new CustomWidgetCollection();
    private widgetsValues: Array<QuestionCustomWidget> = [];

    public onCustomWidgetAdded: Event<(customWidget: QuestionCustomWidget) => any, any> = new Event<(customWidget: QuestionCustomWidget) => any, any>();

    public get widgets(): Array<QuestionCustomWidget> { return this.widgetsValues; }
    public addCustomWidget(widgetJson: any) {
        var name = widgetJson.name;
        if (!name) {
            name = "widget_" + this.widgets.length + 1;
        }
        var customWidget = new QuestionCustomWidget(name, widgetJson);
        this.widgetsValues.push(customWidget);
        this.onCustomWidgetAdded.fire(customWidget, null);
    }
    public clear() { this.widgetsValues = []; }

    public getCustomWidget(question: IQuestion): QuestionCustomWidget {
        for (var i = 0; i < this.widgetsValues.length; i ++) {
            if (this.widgetsValues[i].isFit(question)) return this.widgetsValues[i];
        }
        return null;
    }
}
