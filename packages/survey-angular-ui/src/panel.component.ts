import { Component, Input } from "@angular/core";
import { PageModel, PanelModel } from "survey-core";
import { BaseAngular } from "./base-angular";
import { AngularComponentFactory } from "./component-factory";
@Component({
  selector: "sv-ng-panel, '[sv-ng-panel]'",
  templateUrl: "./panel.component.html",
})
export class PanelComponent extends BaseAngular<PanelModel> {
  @Input() model!: PanelModel;
  protected getModel(): PanelModel {
    return this.model;
  }
}
AngularComponentFactory.Instance.registerComponent("panel", PanelComponent);