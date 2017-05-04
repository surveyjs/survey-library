import {JsonObject} from "./jsonobject";
import {Base, IPage, IConditionRunner, ISurvey, IElement, IQuestion, HashTable, SurveyElement, SurveyPageId} from "./base";
import {QuestionBase} from "./questionbase";
import {ConditionRunner} from "./conditions";
import {QuestionFactory} from "./questionfactory";
import {PanelModel, PanelModelBase, QuestionRowModel} from "./panel";

export class PageModel extends PanelModelBase implements IPage {
    private numValue: number = -1;
    private navigationButtonsVisibilityValue: string = "inherit";
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
    public get navigationButtonsVisibility(): string { return this.navigationButtonsVisibilityValue; }
    public set navigationButtonsVisibility(newValue: string) {
      this.navigationButtonsVisibilityValue = newValue.toLowerCase();
    }
    protected getRendredTitle(str: string): string {
        str = super.getRendredTitle(str);
        if(this.num > 0) {
            str = this.num  + ". " + str;
        }
        return str;
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
    protected onNumChanged(value: number) {
    }
    protected onVisibleChanged() {
        super.onVisibleChanged();
        if (this.data != null) {
            this.data.pageVisibilityChanged(this, this.visible);
        }
    }

}

JsonObject.metaData.addClass("page", [{ name: "navigationButtonsVisibility", default: "inherit", choices: ["inherit", "show", "hide"] }],
    function () { return new PageModel(); }, "panel");
