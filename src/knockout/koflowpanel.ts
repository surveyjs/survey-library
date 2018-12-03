import * as ko from "knockout";
import { PanelModel, QuestionRowModel } from "../panel";
import { FlowPanelModel } from "../flowpanel";
import { JsonObject } from "../jsonobject";
import { ElementFactory } from "../questionfactory";
import { ImplementorBase } from "./kobase";
import { Panel } from "./kopage";

export class FlowPanel extends FlowPanelModel {
  koElementType: any;
  constructor(name: string = "") {
    super(name);
    this.koElementType = ko.observable("survey-flowpanel");
    new ImplementorBase(this);
  }
}

JsonObject.metaData.overrideClassCreatore("flowpanel", function() {
  return new FlowPanel();
});

ElementFactory.Instance.registerElement("flowpanel", name => {
  return new FlowPanel(name);
});
