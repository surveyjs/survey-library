import {JsonObject} from "./jsonobject";
import {Base, IPage, IConditionRunner, ISurvey, IElement, IQuestion, HashTable, SurveyElement, SurveyPageId} from "./base";
import {QuestionBase} from "./questionbase";
import {ConditionRunner} from "./conditions";
import {QuestionFactory} from "./questionfactory";

export class QuestionRowModel {
    private visibleValue: boolean = false;
    visibilityChangedCallback: () => void;
    constructor(public panel: PanelModelBase, public question: IElement) {
        var self = this;
        this.question.rowVisibilityChangedCallback = function () { self.onRowVisibilityChanged(); }
    }
    public questions: Array<IElement> = [];
    public get visible(): boolean { return this.visibleValue; }
    public set visible(val: boolean) {
        if (val == this.visible) return;
        this.visibleValue = val;
        this.onVisibleChanged();
    }
    public updateVisible() {
        this.visible = this.calcVisible();
        this.setWidth();
    }
    public addQuestion(q: IElement) {
        this.questions.push(q);
        this.updateVisible();
    }
    protected onVisibleChanged() {
        if (this.visibilityChangedCallback) this.visibilityChangedCallback();
    }
    public setWidth() {
        var visCount = this.getVisibleCount();
        if (visCount == 0) return;
        var counter = 0;
        for (var i = 0; i < this.questions.length; i++)
            if (this.isQuestionVisible(this.questions[i])) {
                this.questions[i].renderWidth = this.question.width ? this.question.width : Math.floor(100 / visCount) + '%';
                this.questions[i].rightIndent = counter < visCount - 1 ? 1 : 0;
                counter++;
            }
    }
    private onRowVisibilityChanged() {
        this.panel.onRowVisibilityChanged(this);
    }
    private getVisibleCount(): number {
        var res = 0;
        for (var i = 0; i < this.questions.length; i++) {
            if (this.isQuestionVisible(this.questions[i])) res++;
        }
        return res;
    }
    private isQuestionVisible(q: IElement): boolean { return this.panel.isQuestionVisible(q); }
    private calcVisible(): boolean { return this.getVisibleCount() > 0; }
}

export class PanelModelBase extends Base implements IConditionRunner {
    private static panelCounter = 100;
    private static getPanelId(): string {
        return "sp_" + PanelModelBase.panelCounter++;
    }

    private idValue: string;
    private rowValues: Array<QuestionRowModel> = null;
    private conditionRunner: ConditionRunner = null;
    private elementsValue: Array<IElement> = new Array<IElement>();
    private isQuestionsReady: boolean = false;
    private questionsValue: Array<QuestionBase> = new Array<QuestionBase>();
    public parent: PanelModelBase = null;
    public data: ISurvey = null;
    public visibleIf: string = "";

    public title: string = "";
    public visibleIndex: number = -1;
    private visibleValue: boolean = true;
    constructor(public name: string = "") {
        super();
        this.idValue = PanelModelBase.getPanelId();
        var self = this;
        this.elementsValue.push = function (value): number { return self.doOnPushElement(this, value); };
        this.elementsValue.splice = function (start?: number, deleteCount?: number, ...items: QuestionBase[]): QuestionBase[] {
            return self.doSpliceElements(this, start, deleteCount, ...items);
        };
    }
    public get id(): string { return this.idValue; }
    public get questions(): Array<QuestionBase> { 
        if(!this.isQuestionsReady) {
            this.questionsValue = [];
            for(var i = 0; i < this.elements.length; i ++) {
                var el = this.elements[i];
                if(el.isPanel) {
                    var qs = (<PanelModel>el).questions;
                    for(var j = 0; j < qs.length; j ++) {
                        this.questionsValue.push(qs[j]);    
                    }
                } else {
                    this.questionsValue.push(<QuestionBase>el);
                }
            }
            this.isQuestionsReady = true;
        } 

        return this.questionsValue;
    }
    private markQuestionListDirty() {
        this.isQuestionsReady = false;
        if(this.parent) this.parent.markQuestionListDirty();
    }
    public get elements(): Array<IElement> { return this.elementsValue; }
    public get rows(): Array<QuestionRowModel> {
        this.rowValues = this.buildRows();
        return this.rowValues;
    }
    public get isActive() { return (!this.data) || this.data.currentPage == this; }
    public isQuestionVisible(question: IElement): boolean { return question.visible || this.isDesignMode; }
    protected createRow(el: IElement): QuestionRowModel { return new QuestionRowModel(this, el); }
    private get isDesignMode() { return this.data && this.data.isDesignMode; }
    private doOnPushElement(list: Array<IElement>, value: IElement) {
        this.markQuestionListDirty();
        var result = Array.prototype.push.call(list, value);
        this.onAddElement(value, list.length);
        return result;
    }
    private doSpliceElements(list: Array<IElement>, start?: number, deleteCount?: number, ...items: IElement[]) {
        if(!start) start = 0;
        if(!deleteCount) deleteCount = 0;
        var deletedQuestions = [];
        for(var i = 0; i < deleteCount; i ++) {
            if(i + start >= list.length) continue;
            deletedQuestions.push(list[i + start]);
        }
        this.markQuestionListDirty();
        var result = Array.prototype.splice.call(list, start, deleteCount, ... items);
        if(!items) items = [];
        for(var i = 0; i < deletedQuestions.length; i ++) {
            this.onRemoveQuestion(deletedQuestions[i])
        }
        for(var i = 0; i < items.length; i ++) {
            this.onAddElement(items[i], start + i);
        }
        this.markQuestionListDirty();
        return result;
    }
    private onAddElement(element: IElement, index: number) {
        if(element.isPanel) {
            var p = <PanelModel>element;
            p.data = this.data;
            p.parent = this;
        } else {
            if(this.data) {
                var q = <QuestionBase>element;
                q.setData(this.data);
                this.data.questionAdded(q, index);
            }
        }
    }
    private onRemoveQuestion(element: IElement) {
        if(!element.isPanel) {
            var q = <QuestionBase>element;
            if(this.data) this.data.questionRemoved(q);
        }
    }
    private buildRows(): Array<QuestionRowModel> {
        var result = new Array<QuestionRowModel>();
        var lastRowVisibleIndex = -1;
        var self = this;
        for (var i = 0; i < this.elements.length; i++) {
            var el = this.elements[i];
            result.push(this.createRow(el));
            if (el.startWithNewLine) {
                lastRowVisibleIndex = i;
                result[i].addQuestion(el);
            } else {
                if (lastRowVisibleIndex < 0) lastRowVisibleIndex = i;
                result[lastRowVisibleIndex].addQuestion(el);
            }
        }
        for (var i = 0; i < result.length; i++) {
            result[i].setWidth();
        }
        return result;
    }
    onRowVisibilityChanged(row: QuestionRowModel) {
        if (!this.isActive || !this.rowValues) return;
        var index = this.rowValues.indexOf(row);
        for (var i = index; i >= 0; i--) {
            if (this.rowValues[i].questions.indexOf(row.question) > -1) {
                this.rowValues[i].updateVisible();
                break;
            }
        }
    }
    public get processedTitle() { return this.data != null ? this.data.processText(this.title) : this.title; }
    public get visible(): boolean { return this.visibleValue; }
    public set visible(value: boolean) {
        if (value === this.visible) return;
        this.visibleValue = value;
        if (this.data != null) {
            this.data.pageVisibilityChanged(this, this.visible);
        }
    }
    public get isVisible(): boolean {  return this.getIsPageVisible(null); }
    public getIsPageVisible(exceptionQuestion: IQuestion): boolean {
        if (!this.visible) return false;
        for (var i = 0; i < this.questions.length; i++) {
            if (this.questions[i] == exceptionQuestion) continue;
            if (this.questions[i].visible) return true;
        }
        return false;
    }

    public addQuestion(question: QuestionBase, index: number = -1) {
        if (question == null) return;
        if (index < 0 || index >= this.elements.length) {
            this.elements.push(question);
        } else {
            this.elements.splice(index, 0, question);
        }
    }
    public addPanel(panel: PanelModel, index: number = -1) {
        if (panel == null) return;
        if (index < 0 || index >= this.elements.length) {
            this.elements.push(panel);
        } else {
            this.elements.splice(index, 0, panel);
        }
    }
    public addNewQuestion(questionType: string, name: string): QuestionBase {
        var question = QuestionFactory.Instance.createQuestion(questionType, name);
        this.addQuestion(question);
        return question;
    }
    public addNewPanel(name: string): PanelModel {
        var panel = new PanelModel(name);
        this.addPanel(panel);
        return panel;
    }
    public removeQuestion(question: QuestionBase) {
        var index = this.elements.indexOf(question);
        if (index < 0) return;
        this.elements.splice(index, 1);
    }
    public runCondition(values: HashTable<any>) {
        if (!this.visibleIf) return;
        if (!this.conditionRunner) this.conditionRunner = new ConditionRunner(this.visibleIf);
        this.conditionRunner.expression = this.visibleIf;
        this.visible = this.conditionRunner.run(values);
    }
}

//export class 
export class PanelModel extends PanelModelBase implements IElement {
    private renderWidthValue: string;
    private rightIndentValue: number;
    public width: string;
    public startWithNewLine: boolean = true;
    rowVisibilityChangedCallback: () => void;
    constructor(public name: string = "") {
        super(name);
    }
    public getType(): string { return "panel"; }
    public get isPanel(): boolean { return true; }
    public get renderWidth(): string { return this.renderWidthValue; }
    public set renderWidth(val: string) {
        if (val == this.renderWidth) return;
        this.renderWidthValue = val;
        //this.fireCallback(this.renderWidthChangedCallback);
    }
    public get rightIndent(): number { return this.rightIndentValue; }
    public set rightIndent(val: number) {
        if (val == this.rightIndent) return;
        this.rightIndentValue = val;
        //this.fireCallback(this.renderWidthChangedCallback);
    }
}

JsonObject.metaData.addClass("panel", ["name",  { name: "elements", alternativeName: "questions", baseClassName: "question" },
    { name: "visible:boolean", default: true }, "visibleIf:expression", "title"], function () { return new PanelModel(); });
