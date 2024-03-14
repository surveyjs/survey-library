/* eslint-disable no-restricted-globals */
import * as ko from "knockout";
import { FlowPanelModel } from "survey-core";
import { Question } from "survey-core";
import { Serializer } from "survey-core";
import { ImplementorBase } from "./kobase";
import { SurveyElement } from "survey-core";

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
    this.koElementAfterRender = function (el: any, con: any) {
      return self.elementAfterRender(el, con);
    };
  }
  protected onCreating() {}
  protected getHtmlForQuestion(question: Question): string {
    return (
      '<span question="true" contenteditable="false" id="flowpanel_' +
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

Serializer.overrideClassCreator("flowpanel", function () {
  return new FlowPanel();
});
/*
ElementFactory.Instance.registerElement("flowpanel", name => {
  return new FlowPanel(name);
});
*/
ko.components.register("f-panel", {
  viewModel: {
    createViewModel: function (params: any, componentInfo: any) {
      var self = this;
      var question = ko.unwrap(params.question);
      self.element = componentInfo.element;
      self.element.innerHTML = question.html;
      self.isOnFocus = false;
      self.wasChanged = false;
      self.isContentUpdating = false;
      question.contentChangedCallback = function () {
        if (self.isContentUpdating) return;
        ko.cleanNode(self.element);
        self.element.innerHTML = question.html;
        ko.applyBindings({ question }, self.element);
        !!ko.tasks && ko.tasks.runEarly();
      };
      self.element.onfocus = function () {
        self.isOnFocus = true;
      };
      self.element.onblur = function () {
        if (self.wasChanged) self.updateContent();
        self.isOnFocus = false;
        self.wasChanged = false;
      };
      self.element.ondragend = function (event: any) {
        var regEx = /{(.*?(element:)[^$].*?)}/g;
        var str = self.element.innerHTML;
        var res = regEx.exec(str);
        if (res !== null) {
          var q = question.getQuestionFromText(res[0]);
          if (!!q) {
            question.content = self.getContent(q.name);
          }
        }
      };
      self.updateContent = function () {
        self.isContentUpdating = true;
        question.content = self.getContent();
        self.isContentUpdating = false;
      };
      question.getContent = self.getContent = function (deletedName: string) {
        var content = document.createElement("div");
        content.innerHTML = self.element.innerHTML;
        var cps = content.querySelectorAll('span[question="true"]');
        for (var i = 0; i < cps.length; i++) {
          var name = cps[i].id.replace("flowpanel_", "");
          var html = "";
          if (name !== deletedName) {
            var el = question.getQuestionByName(name);
            html = !!el ? question.getElementContentText(el) : "";
          }
          cps[i].outerHTML = html;
        }
        return content.innerHTML;
      };
      var config = {
        characterData: true,
        attributes: true,
        childList: true,
        subtree: true,
      };
      var callback = function (mutationsList: any, observer: any) {
        if (!self.isOnFocus) return;
        self.wasChanged = true;
      };
      var observer = new MutationObserver(callback);
      observer.observe(self.element, config);
      return { question };
    },
  },
  template: "<div></div>",
});
