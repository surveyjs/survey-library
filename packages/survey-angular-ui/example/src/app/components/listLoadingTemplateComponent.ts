import { Component, Input } from "@angular/core";
import { ListModel } from "survey-core";
import { AngularComponentFactory, BaseAngular } from "survey-angular-ui";

@Component({
  selector: "sv-my-list-loading",
  templateUrl: "./listLoadingTemplateComponent.html"
})
export class AngularListLoadingTemplateComponent extends BaseAngular<ListModel> {
  @Input() model!: ListModel;

  getModel(): ListModel {
    return this.model;
  }
}

AngularComponentFactory.Instance.registerComponent("my-list-loading", AngularListLoadingTemplateComponent);
