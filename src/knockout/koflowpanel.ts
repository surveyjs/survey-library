import * as ko from "knockout";
import { FlowPanelModel } from "../flowpanel";
import { Question } from "../question";
import { JsonObject } from "../jsonobject";
import { ElementFactory } from "../questionfactory";
import { ImplementorBase } from "./kobase";

export class FlowPanel extends FlowPanelModel {
  koElementType: any;
  constructor(name: string = "") {
    super(name);
    this.koElementType = ko.observable("survey-flowpanel");
    new ImplementorBase(this);
  }
  protected getHtmlForQuestion(question: Question): string {
    return (
      '<!-- ko template: { name: "survey-flowpanel-question", data: "' +
      question.name +
      '"} --><!-- /ko -->'
    );
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
      var question = ko.unwrap(params.question);
      componentInfo.element.innerHTML = question.html;
      return { question };
    }
  },
  template: "<div></div>"
});
