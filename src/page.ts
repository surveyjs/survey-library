import {JsonObject} from "./jsonobject";
import {Base, IPage, IConditionRunner, ISurvey, IQuestion, HashTable} from "./base";
import {QuestionBase} from "./questionbase";
import {ConditionRunner} from "./conditions";
import {QuestionFactory} from "./questionfactory";

export class QuestionRowModel {
    private visibleValue: boolean = false;
    visibilityChangedCallback: () => void;
    constructor(public page: PageModel, public question: QuestionBase) {
        var self = this;
        this.question.rowVisibilityChangedCallback = function () { self.onRowVisibilityChanged(); }
    }
    public questions: Array<QuestionBase> = [];
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
    public addQuestion(q: QuestionBase) {
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
        this.page.onRowVisibilityChanged(this);
    }
    private getVisibleCount(): number {
        var res = 0;
        for (var i = 0; i < this.questions.length; i++) {
            if (this.isQuestionVisible(this.questions[i])) res++;
        }
        return res;
    }
    private isQuestionVisible(q: QuestionBase): boolean { return this.page.isQuestionVisible(q); }
    private calcVisible(): boolean { return this.getVisibleCount() > 0; }
}

export class PageModel extends Base implements IPage, IConditionRunner {
    private rowValues: Array<QuestionRowModel> = null;
    private conditionRunner: ConditionRunner = null;
    questions: Array<QuestionBase> = new Array<QuestionBase>();
    public data: ISurvey = null;
    public visibleIf: string = "";

    public title: string = "";
    public visibleIndex: number = -1;
    private numValue: number = -1;
    private visibleValue: boolean = true;
    constructor(public name: string = "") {
        super();
        var self = this;
        this.questions.push = function (value) {
            if (self.data != null) {
                value.setData(self.data);
            }
            return Array.prototype.push.call(this, value);
        };
    }
    public get rows(): Array<QuestionRowModel> {
        this.rowValues = this.buildRows();
        return this.rowValues;
    }
    public get isActive() { return (!this.data) || this.data.currentPage == this; }
    public isQuestionVisible(question: QuestionBase): boolean { return question.visible || this.isDesignMode; }
    protected createRow(question: QuestionBase): QuestionRowModel { return new QuestionRowModel(this, question); }
    private get isDesignMode() { return this.data && this.data.isDesignMode; }
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
        if (index < 0 || index >= this.questions.length) {
            this.questions.push(question);
        } else {
            this.questions.splice(index, 0, question);
        }
        if (this.data != null) {
            question.setData(this.data);
            this.data.questionAdded(question, index);
        }
    }
    public addNewQuestion(questionType: string, name: string): QuestionBase {
        var question = QuestionFactory.Instance.createQuestion(questionType, name);
        this.addQuestion(question);
        return question;
    }
    public removeQuestion(question: QuestionBase) {
        var index = this.questions.indexOf(question);
        if (index < 0) return;
        this.questions.splice(index, 1);
        if (this.data != null) this.data.questionRemoved(question);
    }
    public scrollToFirstQuestion() {
        for (var i = 0; i < this.questions.length; i++) {
            if (this.questions[i].visible) {
                this.questions[i].focus();
                break;
            }
        }
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
        if (firstErrorQuestion) firstErrorQuestion.focus();
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
JsonObject.metaData.addClass("page", ["name", { name: "questions", baseClassName: "question" }, { name: "visible:boolean", default: true }, "visibleIf", "title"], function () { return new PageModel(); });