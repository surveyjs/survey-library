import { Component } from "@angular/core";
import { QuestionAngular } from "../question";
import { PanelModel, QuestionPanelDynamicModel } from "survey-core";
import { AngularComponentFactory } from "../component-factory";

@Component({
  selector: "sv-ng-paneldynamic-question",
  templateUrl: "./paneldynamic.component.html"
})
export class PanelDynamicQuestionComponent extends QuestionAngular<QuestionPanelDynamicModel | any> {
  get renderedPanels(): PanelModel[] {
    if (this.model.isRenderModeList) return this.model.panels;
    const panels = [];
    if (this.model.currentPanel) {
      panels.push(this.model.currentPanel);
    }
    return panels;
  }
  get progressCssClass() {
    return this.model.isProgressTopShowing
      ? this.model.cssClasses.progressTop
      : this.model.cssClasses.progressBottom;
  }
}

AngularComponentFactory.Instance.registerComponent("paneldynamic-question", PanelDynamicQuestionComponent);