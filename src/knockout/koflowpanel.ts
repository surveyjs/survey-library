import * as ko from "knockout";
import { PanelModel, QuestionRowModel } from "../panel";
import { FlowPanelModel } from "../flowpanel";
import { JsonObject } from "../jsonobject";
import { ElementFactory } from "../questionfactory";
import { SurveyElement, IElement } from "../base";
import { ImplementorBase } from "./kobase";
import { Panel } from "./kopage";

export class FlowPanel extends FlowPanelModel {
  koElementType: any;
  koContentAfterRender: any;
  constructor(name: string = "") {
    super(name);
    this.koElementType = ko.observable("survey-flowpanel");
    new ImplementorBase(this);
    var self = this;
    this.koContentAfterRender = function(el: any, con: any) {
      return self.contentAfterRender(el, con);
    };
  }
  private contentAfterRender(elements: any, con: any) {
    var el = SurveyElement.GetFirstNonTextElement(elements);
    if (!el) return;
    var element = <IElement>con;
    for (var i = 0; i < this.questions.length; i++) {
      var q = this.questions[i];
      var qEl = document.getElementById(q.id);
      if (!qEl) continue;
      var dEl = el.querySelector("#" + this.getQuestionHtmlId(q));
      if (dEl) {
        dEl.appendChild(qEl);
      }
    }
  }
}

JsonObject.metaData.overrideClassCreatore("flowpanel", function() {
  return new FlowPanel();
});

ElementFactory.Instance.registerElement("flowpanel", name => {
  return new FlowPanel(name);
});
