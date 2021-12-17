import * as ko from "knockout";
import { Question, SurveyModel } from "survey-core";
import { IPage, SurveyElement } from "survey-core";
import { Page, Panel } from "./kopage";
import { PageModel } from "survey-core";
import { surveyCss } from "survey-core";
import { koTemplate, SurveyTemplateText } from "./templateText";
import { CustomWidgetCollection } from "survey-core";
import { LocalizableString } from "survey-core";
import { ItemValue } from "survey-core";
import { ImplementorBase } from "./kobase";
import { StylesManager } from "survey-core";
import { doKey2ClickDown, doKey2ClickUp } from "../utils/utils";

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
    StylesManager.applyTheme(value);
  }
  private renderedElement: HTMLElement;
  private isFirstRender: boolean = true;
  private mouseDownPage: any = null;

  koCurrentPage: any;
  koState: any;
  koAfterRenderPage: any;
  koAfterRenderHeader: any;
  koCompletedState: any;
  koCompletedStateText: any;
  koCompletedStateCss: any;
  koTimerInfoText: any;
  koTitleTemplate: any = <any>ko.observable("survey-header");

  public getDataValueCore(valuesHash: any, key: string) {
    if (!!this.editingObj) return super.getDataValueCore(valuesHash, key);
    if (valuesHash[key] === undefined) {
      valuesHash[key] = ko.observable();
    }
    return ko.unwrap(valuesHash[key]);
  }
  public setDataValueCore(valuesHash: any, key: string, value: any) {
    if (!!this.editingObj) {
      super.setDataValueCore(valuesHash, key, value);
      return;
    }
    if (ko.isWriteableObservable(valuesHash[key])) {
      valuesHash[key](value);
    } else {
      valuesHash[key] = ko.observable(value);
    }
  }
  public deleteDataValueCore(valuesHash: any, key: string) {
    if (!!this.editingObj) {
      super.deleteDataValueCore(valuesHash, key);
      return;
    }
    if (ko.isWriteableObservable(valuesHash[key])) {
      valuesHash[key](undefined);
    } else {
      delete valuesHash[key];
    }
  }

  constructor(
    jsonObj: any = null,
    renderedElement: any = null,
    css: any = null
  ) {
    super(jsonObj);
    if (typeof ko === "undefined")
      throw new Error("knockoutjs library is not loaded.");

    if (css) {
      this.css = css;
    }
    if (renderedElement) {
      this.renderedElement = renderedElement;
    }
    this.render(renderedElement);
  }
  protected onBaseCreating() {
    super.onBaseCreating();
    new ImplementorBase(this);
  }
  public nextPageUIClick() {
    if (!!this.mouseDownPage && this.mouseDownPage !== this.currentPage) return;
    this.mouseDownPage = null;
    this.nextPage();
  }
  public nextPageMouseDown() {
    this.mouseDownPage = this.currentPage;
    return this.navigationMouseDown();
  }
  public render(element: any = null) {
    this.updateKoCurrentPage();
    this.updateCustomWidgets(this.currentPage);
    this.updateElementCss(false);
    const self = this;
    if (element && typeof element === "string") {
      element = document.getElementById(element);
    }
    if (element) {
      this.renderedElement = element;
    }
    element = this.renderedElement;
    self.startTimerFromUI();
    if (!element) return;
    self.applyBinding();
  }
  public clear(clearData: boolean = true, gotoFirstPage: boolean = true) {
    super.clear(clearData, gotoFirstPage);
    this.render();
  }
  public localeChanged() {
    super.localeChanged();
    this.render();
  }
  public koEventAfterRender(element: any, survey: any) {
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
  public setCompleted() {
    super.setCompleted();
    this.updateKoCurrentPage();
  }
  public start(): boolean {
    var res = super.start();
    this.updateKoCurrentPage();
    return res;
  }
  public createNewPage(name: string): PageModel {
    return new Page(name);
  }
  protected getHtmlTemplate(): string {
    return koTemplate;
  }
  protected onBeforeCreating() {
    this.koCurrentPage = ko.observable(this.currentPage);
    this.isCurrentPageEmpty = ko.computed(
      () =>
        !!this.koCurrentPage() &&
        this.getRows(this.koCurrentPage()).length === 0
    );
    this.koState = ko.observable(this.state);
    this.koCompletedState = ko.observable("");
    this.koCompletedStateText = ko.observable("");
    this.koCompletedStateCss = ko.observable("");
    this.koTimerInfoText = ko.observable(this.timerInfoText);
    this.koAfterRenderPage = (elements: any, con: any) => {
      var el = SurveyElement.GetFirstNonTextElement(elements);
      if (!el) return;
      setTimeout(() => {
        !!ko.tasks && ko.tasks.runEarly();
        this.afterRenderPage(el);
      }, 0);
    };
    this.koAfterRenderHeader = (elements: any, con: any) => {
      var el = SurveyElement.GetFirstNonTextElement(elements);
      if (el) this.afterRenderHeader(el);
    };
  }
  protected currentPageChanged(newValue: PageModel, oldValue: PageModel) {
    this.updateKoCurrentPage();
    super.currentPageChanged(newValue, oldValue);
  }
  pageVisibilityChanged(page: IPage, newValue: boolean) {
    super.pageVisibilityChanged(page, newValue);
    if (this.currentPage !== this.koCurrentPage()) {
      this.updateKoCurrentPage();
    }
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
  protected doTimer() {
    super.doTimer();
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
    ko.renderTemplate(
      "survey-content",
      this,
      { afterRender: this.koEventAfterRender },
      this.renderedElement
    );
  }
  private updateKoCurrentPage() {
    if (this.isLoadingFromJson || this.isDisposed) return;
    if (this.currentPage !== this.koCurrentPage()) {
      this.koCurrentPage(this.currentPage);
    }
    this.koState(this.state);
  }
  private getRows(pnl: any): Array<any> {
    return !!pnl["koRows"] ? pnl["koRows"]() : pnl.rows;
  }
  private updateCurrentPageQuestions() {
    if (this.isDisposed) return;
    var questions = this.currentPage ? this.currentPage.questions : [];
    for (var i = 0; i < questions.length; i++) {
      var q = questions[i];
      if (q.visible) q["updateQuestion"]();
    }
  }
  public updateSurvey(newProps: any, oldProps?: any) {
    for (var key in newProps) {
      if (key == "model" || key == "children") continue;
      if (key == "css") {
        this.mergeValues(newProps.css, this.getCss());
        this.updateElementCss();
        continue;
      }
      if (key.indexOf("on") == 0 && this[key] && this[key].add) {
        let funcBody = newProps[key];
        let func = function (sender: any, options: any) {
          funcBody(sender, options);
        };
        this[key].add(func);
      } else {
        this[key] = newProps[key];
      }
    }

    if (newProps && newProps.data)
      this.onValueChanged.add((sender, options) => {
        newProps.data[options.name] = options.value;
      });
  }
  public dispose() {
    super.dispose();
    if (!!this.renderedElement) {
      ko.cleanNode(this.renderedElement);
      this.renderedElement.innerHTML = "";
    }
    this.koAfterRenderPage = undefined;
    this.koAfterRenderHeader = undefined;
    this.isCurrentPageEmpty.dispose();
    this.iteratePropertiesHash((hash, key) => {
      delete hash[key];
    });
    this.koCurrentPage(undefined);
  }
}

LocalizableString.prototype["onCreating"] = function () {
  // var self = this;
  // this.koReRender = ko.observable(0);
  this.koHasHtml = ko.observable(this.hasHtml);
  this.koRenderedHtml = ko.observable(this.renderedHtml);
  // Object.defineProperty(self, "koHasHtml", {
  //   get: () => {
  //     self.koReRender();
  //     return self.hasHtml;
  //   },
  // });
  // this.koRenderedHtml = ko.pureComputed(function() {
  //   self.koReRender();
  //   return self.renderedHtml;
  // });
};

ItemValue.prototype["onCreating"] = function () {
  new ImplementorBase(this);
};

LocalizableString.prototype["onChanged"] = function () {
  // this.koReRender(this.koReRender() + 1);
  const hasHtml = this.hasHtml;
  this.koHasHtml(hasHtml);
  this.koRenderedHtml(hasHtml ? this.getHtmlValue() : this.calculatedText);
};

ko.components.register("survey", {
  viewModel: {
    createViewModel: function (params: any, componentInfo: any) {
      var survey: Survey = ko.unwrap(params.survey);
      setTimeout(() => {
        var surveyRoot = document.createElement("div");
        componentInfo.element.appendChild(surveyRoot);
        survey.render(surveyRoot);
      }, 1);
      // !!ko.tasks && ko.tasks.runEarly();
      return params.survey;
    },
  },
  template: koTemplate,
});

ko.bindingHandlers["surveyProp"] = {
  update: function (element: any, valueAccessor: any, allBindingsAccessor: any) {
    var value = ko.utils.unwrapObservable(valueAccessor()) || {};
    for (var propName in value) {
      if (typeof propName == "string") {
        var propValue = ko.utils.unwrapObservable(value[propName]);
        element[propName] = propValue;
      }
    }
  },
};
SurveyModel.platform = "knockout";

export var registerTemplateEngine = (ko: any, platform: string) => {
  (<any>ko).surveyTemplateEngine = function () { };

  (<any>ko).surveyTemplateEngine.prototype = new ko.nativeTemplateEngine();

  (<any>ko).surveyTemplateEngine.prototype.makeTemplateSource = function (
    template: any,
    templateDocument: any
  ) {
    if (typeof template === "string") {
      templateDocument = templateDocument || document;
      var templateElementRoot = templateDocument.getElementById(
        "survey-content-" + platform
      );
      if (!templateElementRoot) {
        templateElementRoot = document.createElement("div");
        templateElementRoot.id = "survey-content-" + SurveyModel.platform;
        templateElementRoot.style.display = "none";
        templateElementRoot.innerHTML = koTemplate;
        document.body.appendChild(templateElementRoot);
      }
      var elem;
      for (var i = 0; i < templateElementRoot.children.length; i++) {
        if (templateElementRoot.children[i].id === template) {
          elem = templateElementRoot.children[i];
          break;
        }
      }
      if (!elem) {
        elem = templateDocument.getElementById(template);
      }
      if (!elem) {
        return new ko.nativeTemplateEngine().makeTemplateSource(
          template,
          templateDocument
        );
      }
      return new ko.templateSources.domElement(elem);
    } else if (template.nodeType === 1 || template.nodeType === 8) {
      return new ko.templateSources.anonymousTemplate(template);
    } else {
      throw new Error("Unknown template type: " + template);
    }
  };

  // (<any>ko).surveyTemplateEngine.prototype.renderTemplateSource = function (templateSource: any, bindingContext: any, options: any, templateDocument: any) {
  //   var useNodesIfAvailable = !((<any>ko.utils).ieVersion < 9),
  //     templateNodesFunc = useNodesIfAvailable ? templateSource["nodes"] : null,
  //     templateNodes = templateNodesFunc ? templateSource["nodes"]() : null;
  //   if (templateNodes) {
  //     return (<any>ko.utils).makeArray(templateNodes.cloneNode(true).childNodes);
  //   } else {
  //     var templateText = templateSource["text"]();
  //     return (<any>ko.utils).parseHtmlFragment(templateText, templateDocument);
  //   }
  // };

  var surveyTemplateEngineInstance = new (<any>ko).surveyTemplateEngine();
  ko.setTemplateEngine(surveyTemplateEngineInstance);
};

ko.bindingHandlers["key2click"] = {
  init: function (element: HTMLElement, valueAccessor, allBindingsAccessor, viewModel: any) {
    const options = valueAccessor() || {
      processEsc: true
    };
    if (viewModel.disableTabStop) {
      element.tabIndex = -1;
      return;
    }
    element.tabIndex = 0;
    element.onkeyup = (evt: any) => {
      evt.preventDefault();
      evt.stopPropagation();
      doKey2ClickUp(evt, options);
      return false;
    };
    element.onkeydown = (evt: any) => doKey2ClickDown(evt, options);
  },
};
