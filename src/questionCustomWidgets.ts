import {Base, IQuestion, Event} from "./base";

export class QuestionCustomWidgetModel {
    public onAfterRender: (question: IQuestion, el: HTMLElement) => any = null;
    constructor(public name: string, public onIsFit: (question: IQuestion) => boolean) {

    }
    public afterRender(question: IQuestion, el: HTMLElement) {
        if (this.onAfterRender) this.onAfterRender(question, el);
    }
    public isFit(question: IQuestion): boolean {
        if (this.onIsFit) return this.onIsFit(question);
        return false;
    }
}

export class CustomWidgetCollection {
    public static Instance: CustomWidgetCollection = new CustomWidgetCollection();
    private widgetsValues: Array<QuestionCustomWidgetModel> = [];

    public onCustomWidgetAdded: Event<(customWidget: QuestionCustomWidgetModel) => any, any> = new Event<(customWidget: QuestionCustomWidgetModel) => any, any>();
        
    public get widgets(): Array<QuestionCustomWidgetModel> { return this.widgetsValues; }
    public addCustomWidget(customWidget: QuestionCustomWidgetModel) {
        if (!customWidget || !customWidget.name) return;
        this.widgetsValues.push(customWidget);
        this.onCustomWidgetAdded.fire(customWidget, null);
    }
    public clear() { this.widgetsValues = []; }

    public getCustomWidget(question: IQuestion): QuestionCustomWidgetModel {
        for (var i = 0; i < this.widgetsValues.length; i ++) {
            if (this.widgetsValues[i].isFit(question)) return this.widgetsValues[i];
        }
        return null;
    }
}