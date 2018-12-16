import * as ko from "knockout";
import { FlowPanelModel } from "../flowpanel";
import { Question } from "../question";
import { JsonObject } from "../jsonobject";
import { ElementFactory } from "../questionfactory";
import { ImplementorBase } from "./kobase";
import { SurveyElement, IElement } from "../base";

export class FlowPanel extends FlowPanelModel {
  koElementType: any;
  koElementAfterRender: any;
  placeHolder: string;
  constructor(name: string = "") {
    super(name);
    this.koElementType = ko.observable("survey-flowpanel");
    new ImplementorBase(this);
    this.onCreating();
    var self = this;
    this.koElementAfterRender = function(el: any, con: any) {
      return self.elementAfterRender(el, con);
    };
  }
  protected onCreating() {}
  protected getHtmlForQuestion(question: Question): string {
    return (
      '<span question="true" id="flowpanel_' +
      question.name +
      '"><!-- ko template: { name: "survey-flowpanel-question", data: "' +
      question.name +
      '"} --><!-- /ko --></span>'
    );
  }
  private elementAfterRender(elements: any, con: any) {
    if (!this.survey) return;
    var el = SurveyElement.GetFirstNonTextElement(elements);
    if (!!el) {
      this.survey.afterRenderQuestion(con, el);
    }
  }
}

JsonObject.metaData.overrideClassCreatore("flowpanel", function() {
  return new FlowPanel();
});

ElementFactory.Instance.registerElement("flowpanel", name => {
  return new FlowPanel(name);
});

ko.components.register("f-panel", {
  viewModel: {
    createViewModel: function(params: any, componentInfo: any) {
      var self = this;
      var question = ko.unwrap(params.question);
      self.element = componentInfo.element;
      self.element.innerHTML = question.html;
      self.isOnFocus = false;
      self.wasChanged = false;
      self.isContentUpdating = false;
      question.contentChangedCallback = function() {
        if (self.isContentUpdating) return;
        ko.cleanNode(self.element);
        self.element.innerHTML = question.html;
        ko.applyBindings({ question }, self.element);
      };
      self.element.onfocus = function() {
        self.isOnFocus = true;
      };
      self.element.onblur = function() {
        if (self.wasChanged) self.updateContent();
        self.isOnFocus = false;
        self.wasChanged = false;
      };
      self.updateContent = function() {
        var content = document.createElement("DIV");
        content.innerHTML = self.element.innerHTML;
        var cps = content.querySelectorAll('span[question="true"]');
        for (var i = 0; i < cps.length; i++) {
          var name = cps[i].id.replace("flowpanel_", "");
          var el = question.getQuestionByName(name);
          cps[i].outerHTML = !!el ? question.getElementContentText(el) : "";
        }
        self.isContentUpdating = true;
        question.content = content.innerHTML;
        self.isContentUpdating = false;
      };
      var config = {
        characterData: true,
        attributes: true,
        childList: true,
        subtree: true
      };
      var callback = function(mutationsList: any, observer: any) {
        if (!self.isOnFocus) return;
        self.wasChanged = true;
      };
      var observer = new MutationObserver(callback);
      observer.observe(self.element, config);
      return { question };
    }
  },
  template: "<div></div>"
});
