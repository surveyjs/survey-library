import { Component, Input } from "@angular/core";
import { DropdownMultiSelectListModel, QuestionTagboxModel } from "survey-core";
import { BaseAngular } from "../../base-angular";
import { AngularComponentFactory } from "../../component-factory";

@Component({
  selector: "sv-tagbox-filter",
  templateUrl: "./tagbox-filter.component.html",
  styleUrls: ["../../hide-host.scss"]
})
export class TagboxFilterComponent extends BaseAngular {
  @Input() model!: DropdownMultiSelectListModel;
  @Input() question!: QuestionTagboxModel;

  getModel() {
    return this.model;
  }
}

AngularComponentFactory.Instance.registerComponent("sv-tagbox-filter", TagboxFilterComponent);