import {JsonObject} from "./jsonobject";
import {Base, IPage, IConditionRunner, ISurvey, IElement, IQuestion, HashTable, SurveyElement, SurveyPageId} from "./base";
import {QuestionBase} from "./questionbase";
import {ConditionRunner} from "./conditions";
import {QuestionFactory} from "./questionfactory";
import {PanelModel, PanelModelBase, QuestionRowModel} from "./panel";

export class PageModel extends PanelModelBase implements IPage {
    private numValue: number = -1;
    public navigationButtonsVisibility: string = "inherit";
    constructor(public name: string = "") {
        super(name);
    }
    public getType(): string { return "page"; }
    public get num() { return this.numValue; }
    public set num(value: number) {
        if (this.numValue == value) return;
        this.numValue = value;
        this.onNumChanged(value);
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
        var qs = this.questions;
        for (var i: number = 0; i < qs.length; i++) {
            if (visibleOnly && !qs[i].visible) continue;
            list.push(qs[i]);
        }
    }
    protected onNumChanged(value: number) {
    }
}

JsonObject.metaData.addClass("page", [{ name: "navigationButtonsVisibility", default: "inherit", choices: ["iherit", "show", "hide"] }], 
    function () { return new PageModel(); }, "panel");