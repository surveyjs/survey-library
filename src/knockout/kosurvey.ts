import * as ko from "knockout";
import {SurveyModel} from "../survey";
import {IPage, IQuestion, Event, SurveyElement} from "../base";
import {Page} from "./kopage";
import {PageModel} from "../page";
import {surveyCss} from "../defaultCss/cssstandard";
import {koTemplate, SurveyTemplateText} from "./templateText";
import {QuestionCustomWidget, CustomWidgetCollection} from "../questionCustomWidgets";

CustomWidgetCollection.Instance.onCustomWidgetAdded.add((customWidget) => {
    if (!customWidget.htmlTemplate) customWidget.htmlTemplate = "<div>'htmlTemplate' attribute is missed.</div>"
    new SurveyTemplateText().replaceText(customWidget.htmlTemplate, "widget", customWidget.name);
});

export class Survey extends SurveyModel {
    public static get cssType(): string { return surveyCss.currentType; }
    public static set cssType(value: string) { surveyCss.currentType = value; }
    private renderedElement: HTMLElement;
    //TODO remove it, since there is onAfterRenderSurvey
    public onRendered: Event<(sender: SurveyModel) => any, any> = new Event<(sender: SurveyModel) => any, any>();
    private isFirstRender: boolean = true;

    koCurrentPage: any; koIsFirstPage: any; koIsLastPage: any; koIsNavigationButtonsShowing: any; dummyObservable: any; koState: any;
    koProgress: any; koProgressText: any; koAfterRenderPage: any;

    constructor(jsonObj: any = null, renderedElement: any = null, css: any = null) {
        super(jsonObj);
        if (css) {
            this.css = css;
        }
        if (renderedElement) {
            this.renderedElement = renderedElement;
        }
        if (typeof ko === 'undefined') throw new Error('knockoutjs library is not loaded.');
        this.render(renderedElement);
    }
    public get cssNavigationComplete() { return this.getNavigationCss(this.css.navigationButton, this.css.navigation.complete); }
    public get cssNavigationPrev() { return this.getNavigationCss(this.css.navigationButton, this.css.navigation.prev); }
    public get cssNavigationNext() { return this.getNavigationCss(this.css.navigationButton, this.css.navigation.next); }
    private getNavigationCss(main: string, btn: string) {
        var res = "";
        if (main) res = main;
        if (btn) res += ' ' + btn;
        return res;
    }
    public get css(): any { return surveyCss.getCss(); }
    public set css(value: any) {
        this.mergeValues(value, this.css);
    }
    public render(element: any = null) {
        var self = this;
        if (element && typeof element == "string") {
            element = document.getElementById(element);
        }
        if (element) {
            this.renderedElement = element;
        }
        element = this.renderedElement;
        if (!element) return;
        this.updateCustomWidgets(this.currentPage);
        element.innerHTML = this.getTemplate();
        self.applyBinding();
        self.onRendered.fire(self, {});
        self.afterRenderSurvey(element);
    }
    public loadSurveyFromService(surveyId: string = null, renderedElement: any = null) {
        if (renderedElement) {
            this.renderedElement = renderedElement;
        }
        super.loadSurveyFromService(surveyId);
    }
    protected setCompleted() {
        super.setCompleted();
        this.updateKoCurrentPage();
    }
    protected createNewPage(name: string) { return new Page(name); }
    protected getTemplate(): string { return koTemplate; }
    protected onBeforeCreating() {
        var self = this;
        this.dummyObservable = ko.observable(0);
        this.koCurrentPage = ko.computed(function () { self.dummyObservable(); return self.currentPage; });
        this.koIsNavigationButtonsShowing = ko.computed(function () { self.dummyObservable(); return self.isNavigationButtonsShowing; });
        this.koIsFirstPage = ko.computed(function () { self.dummyObservable(); return self.isFirstPage; });
        this.koIsLastPage = ko.computed(function () { self.dummyObservable(); return self.isLastPage; });
        this.koProgressText = ko.computed(function () { self.dummyObservable(); return self.progressText; });
        this.koProgress = ko.computed(function () { self.dummyObservable(); return self.getProgress(); });
        this.koState = ko.computed(function () { self.dummyObservable(); return self.state; });
        this.koAfterRenderPage = function (elements, con) {
            var el = SurveyElement.GetFirstNonTextElement(elements);
            if (el) self.afterRenderPage(el);
        };
    }
    protected currentPageChanged(newValue: PageModel, oldValue: PageModel) {
        this.updateKoCurrentPage();
        super.currentPageChanged(newValue, oldValue);
        if (!this.isDesignMode && this.focusFirstQuestionAutomatic) this.focusFirstQuestion();
    }
    pageVisibilityChanged(page: IPage, newValue: boolean) {
        super.pageVisibilityChanged(page, newValue);
        this.updateKoCurrentPage();
    }
    protected onLoadSurveyFromService() {
        this.render();
    }
    protected onLoadingSurveyFromService() {
        this.render();
    }
    private applyBinding() {
        if (!this.renderedElement) return;
        this.updateKoCurrentPage();
        ko.cleanNode(this.renderedElement);
        if (!this.isFirstRender) {
            this.updateCurrentPageQuestions();
        }
        this.isFirstRender = false;
        ko.applyBindings(this, this.renderedElement);
    }
    private updateKoCurrentPage() {
        this.dummyObservable(this.dummyObservable() + 1);
    }
    private updateCurrentPageQuestions() {
        var questions = this.currentPage ? this.currentPage.questions : [];
        for (var i = 0; i < questions.length; i++) {
            var q = questions[i];
            if (q.visible) q["updateQuestion"]();
        }
    }
}

