import * as ko from "knockout";
import { SurveyModel } from "../survey";
import { IPage, IQuestion, Event, SurveyElement } from "../base";
import { Page } from "./kopage";
import { PageModel } from "../page";
import { surveyCss } from "../defaultCss/cssstandard";
import { koTemplate, SurveyTemplateText } from "./templateText";
import {
  QuestionCustomWidget,
  CustomWidgetCollection
} from "../questionCustomWidgets";
import { LocalizableString } from "../localizablestring";
import { ItemValue } from "../itemvalue";
import { QuestionRatingModel } from "../question_rating";

CustomWidgetCollection.Instance.onCustomWidgetAdded.add(customWidget => {
  if (customWidget.widgetJson.isDefaultRender) return;
  if (!customWidget.htmlTemplate)
    customWidget.htmlTemplate =
      "<div>'htmlTemplate' attribute is missed.</div>";
  new SurveyTemplateText().replaceText(
    customWidget.htmlTemplate,
    "widget",
    customWidget.name
  );
});

export class Survey extends SurveyModel {
  public static get cssType(): string {
    return surveyCss.currentType;
  }
  public static set cssType(value: string) {
    surveyCss.currentType = value;
  }
  private renderedElement: HTMLElement;
  //TODO remove it, since there is onAfterRenderSurvey
  public onRendered: Event<(sender: SurveyModel) => any, any> = new Event<
    (sender: SurveyModel) => any,
    any
  >();
  private isFirstRender: boolean = true;
  private mouseDownPage: any = null;

  koCurrentPage: any;
  koIsFirstPage: any;
  koIsLastPage: any;
  koIsNavigationButtonsShowing = ko.observable<boolean>(true);
  dummyObservable: any;
  koState: any;
  koProgress: any;
  koProgressText: any;
  koAfterRenderPage: any;
  koCompletedState: any;
  koCompletedStateText: any;
  koCompletedStateCss: any;
  koTimerInfoText: any;

  constructor(
    jsonObj: any = null,
    renderedElement: any = null,
    css: any = null
  ) {
    super(jsonObj);
    if (css) {
      this.css = css;
    }
    if (renderedElement) {
      this.renderedElement = renderedElement;
    }
    if (typeof ko === "undefined")
      throw new Error("knockoutjs library is not loaded.");
    var self = this;
    this.registerFunctionOnPropertyValueChanged("timeSpent", function() {
      self.onTimeSpentChanged();
    });

    this.render(renderedElement);
  }
  public nextPageUIClick() {
    if (!!this.mouseDownPage && this.mouseDownPage !== this.currentPage) return;
    this.mouseDownPage = null;
    this.nextPage();
  }
  public nextPageMouseDown() {
    this.mouseDownPage = this.currentPage;
    var el = <any>document.activeElement;
    if (!!el && !!el.blur) el.blur();
  }
  public get cssNavigationComplete() {
    return this.getNavigationCss(
      this.css.navigationButton,
      this.css.navigation.complete
    );
  }
  public get cssNavigationPrev() {
    return this.getNavigationCss(
      this.css.navigationButton,
      this.css.navigation.prev
    );
  }
  public get cssNavigationStart() {
    return this.getNavigationCss(
      this.css.navigationButton,
      this.css.navigation.start
    );
  }
  public get cssNavigationNext() {
    return this.getNavigationCss(
      this.css.navigationButton,
      this.css.navigation.next
    );
  }
  public get completedCss() {
    var css = surveyCss.getCss();
    return css.body + " " + css.completedPage;
  }
  private getNavigationCss(main: string, btn: string) {
    var res = "";
    if (main) res = main;
    if (btn) res += " " + btn;
    return res;
  }
  public get css(): any {
    return surveyCss.getCss();
  }
  public set css(value: any) {
    this.mergeValues(value, this.css);
  }
  public render(element: any = null) {
    this.updateKoCurrentPage();
    this.updateCustomWidgets(this.currentPage);
    var self = this;
    if (element && typeof element == "string") {
      element = document.getElementById(element);
    }
    if (element) {
      this.renderedElement = element;
    }
    element = this.renderedElement;
    if (!element) return;
    element.innerHTML = this.getHtmlTemplate();
    self.startTimerFromUI();
    self.applyBinding();
  }
  public clear(clearData: boolean = true, gotoFirstPage: boolean = true) {
    super.clear(clearData, gotoFirstPage);
    this.render();
  }
  public koEventAfterRender(element:any, survey:any) {
    survey.onRendered.fire(self, {});
    survey.afterRenderSurvey(element);
  }
  public loadSurveyFromService(
    surveyId: string = null,
    clientId: string = null,
    renderedElement: any = null
  ) {
    if (renderedElement) {
      this.renderedElement = renderedElement;
    }
    super.loadSurveyFromService(surveyId, clientId);
  }
  protected setCompleted() {
    super.setCompleted();
    this.updateKoCurrentPage();
  }
  protected propertyValueChanged(name: string, oldValue: any, newValue: any) {
    super.propertyValueChanged(name, oldValue, newValue);
    if (this.isLoadingFromJson) return;
    if (name === "showNavigationButtons") {
      this.koIsNavigationButtonsShowing(this.isNavigationButtonsShowing);
    }
  }
  public start() {
    super.start();
    this.updateKoCurrentPage();
  }
  protected createNewPage(name: string) {
    return new Page(name);
  }
  protected getHtmlTemplate(): string {
    return koTemplate;
  }
  protected onBeforeCreating() {
    var self = this;
    this.dummyObservable = ko.observable(0);
    this.koCurrentPage = ko.observable(this.currentPage);
    this.koIsNavigationButtonsShowing = ko.observable(
      this.isNavigationButtonsShowing
    );
    ko.computed(() => {
      this.dummyObservable();
      this.koIsNavigationButtonsShowing(this.isNavigationButtonsShowing);
    });
    this.koIsFirstPage = ko.computed(() => {
      this.dummyObservable();
      return this.isFirstPage;
    });
    this.koIsLastPage = ko.computed(() => {
      this.dummyObservable();
      return this.isLastPage;
    });
    this.koProgressText = ko.computed(() => {
      this.dummyObservable();
      return this.progressText;
    });
    this.koProgress = ko.computed(() => {
      this.dummyObservable();
      return this.getProgress();
    });
    this.koState = ko.observable(this.state);
    this.koCompletedState = ko.observable("");
    this.koCompletedStateText = ko.observable("");
    this.koCompletedStateCss = ko.observable("");
    this.koTimerInfoText = ko.observable(this.timerInfoText);
    this.koAfterRenderPage = function(elements:any, con:any) {
      var el = SurveyElement.GetFirstNonTextElement(elements);
      if (el) self.afterRenderPage(el);
    };
  }
  protected currentPageChanged(newValue: PageModel, oldValue: PageModel) {
    this.updateKoCurrentPage();
    super.currentPageChanged(newValue, oldValue);
    if (!this.isDesignMode) this.scrollToTopOnPageChange();
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
  protected setCompletedState(value: string, text: string) {
    super.setCompletedState(value, text);
    this.koCompletedState(this.completedState);
    this.koCompletedStateText(this.completedStateText);
    this.koCompletedStateCss(
      this.completedState !== "" ? this.css.saveData[this.completedState] : ""
    );
  }
  protected onTimeSpentChanged() {
    this.koTimerInfoText(this.timerInfoText);
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
    if (this.isLoadingFromJson) return;
    this.dummyObservable(this.dummyObservable() + 1);
    if (this.currentPage !== this.koCurrentPage()) {
      this.koCurrentPage(this.currentPage);
    }
    this.koState(this.state);
  }
  private updateCurrentPageQuestions() {
    var questions = this.currentPage ? this.currentPage.questions : [];
    for (var i = 0; i < questions.length; i++) {
      var q = questions[i];
      if (q.visible) q["updateQuestion"]();
    }
  }
}

LocalizableString.prototype["onCreating"] = function() {
  var self = this;
  this.koReRender = ko.observable(0);
  this.koRenderedHtml = ko.pureComputed(function() {
    self.koReRender();
    return self.renderedHtml;
  });
};

LocalizableString.prototype["onChanged"] = function() {
  this.koReRender(this.koReRender() + 1);
};

ko.components.register("survey", {
  viewModel: {
    createViewModel: function(params, componentInfo) {
      var survey: Survey = ko.unwrap(params.survey);
      survey.render();
      return params.survey;
    }
  },
  template: koTemplate
});

ko.bindingHandlers["surveyProp"] = {
  update: function(element, valueAccessor, allBindingsAccessor) {
    var value = ko.utils.unwrapObservable(valueAccessor()) || {};
    for (var propName in value) {
      if (typeof propName == "string") {
        var propValue = ko.utils.unwrapObservable(value[propName]);
        element[propName] = propValue;
      }
    }
  }
};
SurveyModel.platform = "knockout";
