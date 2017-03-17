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
    private numValue: number = -1;
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
                    for(var i = 0; i < qs.length; i ++) {
                        this.questionsValue.push(qs[i]);    
                    }
                } {
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
    protected createRow(question: QuestionBase): QuestionRowModel { return new QuestionRowModel(this, question); }
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
        if(element.isPanel) {
            var p = <PanelModel>element;
            if(p.parent) p.parent.markQuestionListDirty();
        } else {
            var q = <QuestionBase>element;
            if(this.data) this.data.questionRemoved(q);
        }
    }
    private buildRows(): Array<QuestionRowModel> {
        var result = new Array<QuestionRowModel>();
        var lastRowVisibleIndex = -1;
        var self = this;
        for (var i = 0; i < this.questions.length; i++) {
            var q = this.questions[i];
            result.push(this.createRow(q));
            if (q.startWithNewLine) {
                lastRowVisibleIndex = i;
                result[i].addQuestion(q);
            } else {
                if (lastRowVisibleIndex < 0) lastRowVisibleIndex = i;
                result[lastRowVisibleIndex].addQuestion(q);
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
    public get num() { return this.numValue; }
    public set num(value: number) {
        if (this.numValue == value) return;
        this.numValue = value;
        this.onNumChanged(value);
    }
    public get visible(): boolean { return this.visibleValue; }
    public set visible(value: boolean) {
        if (value === this.visible) return;
        this.visibleValue = value;
        if (this.data != null) {
            this.data.pageVisibilityChanged(this, this.visible);
        }
    }
    public getType(): string { return "page"; }
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
    public focusFirstQuestion() {
        for (var i = 0; i < this.questions.length; i++) {
            var question = this.questions[i];
            if (!question.visible || !question.hasInput) continue;
            this.questions[i].focus();
            break;
        }
    }
    public focusFirstErrorQuestion() {
        for (var i = 0; i < this.questions.length; i++) {
            if (!this.questions[i].visible || this.questions[i].currentErrorCount == 0) continue;
            this.questions[i].focus(true);
            break;
        }
    }
    public scrollToTop() {
        SurveyElement.ScrollElementToTop(SurveyPageId);
    }
    public hasErrors(fireCallback: boolean = true, focuseOnFirstError: boolean = false): boolean {
        var result = false;
        var firstErrorQuestion = null;
        for (var i = 0; i < this.questions.length; i++) {
            if (this.questions[i].visible && this.questions[i].hasErrors(fireCallback)) {
                if (focuseOnFirstError && firstErrorQuestion == null) {
                    firstErrorQuestion = this.questions[i];
                }
                result = true;
            }
        }
        if (firstErrorQuestion) firstErrorQuestion.focus(true);
        return result;
    }
    public addQuestionsToList(list: Array<IQuestion>, visibleOnly: boolean = false) {
        if (visibleOnly && !this.visible) return;
        for (var i: number = 0; i < this.questions.length; i++) {
            if (visibleOnly && !this.questions[i].visible) continue;
            list.push(this.questions[i]);
        }
    }
    public runCondition(values: HashTable<any>) {
        if (!this.visibleIf) return;
        if (!this.conditionRunner) this.conditionRunner = new ConditionRunner(this.visibleIf);
        this.conditionRunner.expression = this.visibleIf;
        this.visible = this.conditionRunner.run(values);
    }
    protected onNumChanged(value: number) {
    }
}

//export class 
export class PanelModel extends PanelModelBase implements IElement {
    private renderWidthValue: string;
    private rightIndentValue: number;
    public width: string;
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

export class PageModel extends PanelModelBase implements IPage {
    public navigationButtonsVisibility: string = "inherit";
    constructor(public name: string = "") {
        super(name);
    }
    public getType(): string { return "page"; }
}

JsonObject.metaData.addClass("panel", ["name",  { name: "elements", alternativeName: "questions", baseClassName: "question" },
    { name: "visible:boolean", default: true }, "visibleIf:expression", "title"], function () { return new PanelModel(); });

JsonObject.metaData.addClass("page", [{ name: "navigationButtonsVisibility", default: "inherit", choices: ["iherit", "show", "hide"] }], 
    function () { return new PageModel(); }, "panel");