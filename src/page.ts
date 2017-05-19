import {JsonObject} from "./jsonobject";
import {Base, IPage, IConditionRunner, ISurvey, IElement, IQuestion, HashTable, SurveyElement, SurveyPageId} from "./base";
import {QuestionBase} from "./questionbase";
import {ConditionRunner} from "./conditions";
import {QuestionFactory} from "./questionfactory";
import {PanelModel, PanelModelBase, QuestionRowModel} from "./panel";
/**
 * The page object. It has elements collection, that contains questions and panels.
 */
export class PageModel extends PanelModelBase implements IPage {
    private numValue: number = -1;
    private navigationButtonsVisibilityValue: string = "inherit";
    /**
     * The visible index of the page. It has values from 0 to visible page count - 1.
     * @see SurveyModel.visiblePages
     * @see SurveyModel.pages
     */
    public visibleIndex: number = -1;
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
    /**
     * Set this property to "hide" to make "Prev", "Next" and "Complete" buttons are invisible for this page. Set this property to "show" to make these buttons visible, even if survey showNavigationButtons property is false.
     * @see SurveyMode.showNavigationButtons
     */
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
    /** 
     * Call it to focus the input on the first question
     */
    public focusFirstQuestion() {
        for (var i = 0; i < this.questions.length; i++) {
            var question = this.questions[i];
            if (!question.visible || !question.hasInput) continue;
            this.questions[i].focus();
            break;
        }
    }
    /**
     * Call it to focus the input of the first question that has an error.
     */
    public focusFirstErrorQuestion() {
        for (var i = 0; i < this.questions.length; i++) {
            if (!this.questions[i].visible || this.questions[i].currentErrorCount == 0) continue;
            this.questions[i].focus(true);
            break;
        }
    }
    /**
     * Call it to scroll to the page top.
     */
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
