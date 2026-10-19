import { Component, Input } from "@angular/core";
import { DropdownMultiSelectListModel, DropdownMultiSelectRenderState, QuestionTagboxModel } from "survey-core";
import { BaseAngular } from "../../base-angular";
import { AngularComponentFactory } from "../../component-factory";

@Component({
  selector: "sv-tagbox-filter",
  templateUrl: "./tagbox-filter.component.html",
  styleUrls: ["../../hide-host.scss"]
})
export class TagboxFilterComponent extends BaseAngular {
  @Input() model?: DropdownMultiSelectListModel;
  @Input() question!: QuestionTagboxModel;

  // Everything the filter renders. It does not create DropdownListModel.
  get renderState(): DropdownMultiSelectRenderState {
    return <any>this.question.dropdownRenderState;
  }
  get inputStringRendered(): string {
    return this.renderState.inputStringRendered;
  }
  set inputStringRendered(val: string) {
    this.question.dropdownListModel.inputStringRendered = val;
  }
  inputKeyHandler(event: any): void {
    this.question.dropdownListModel.inputKeyHandler(event);
  }
  // The model is created on an interaction; ngDoCheck subscribes to it on the next change detection.
  getModel() {
    return this.model || <DropdownMultiSelectListModel>this.question.dropdownListModelValue;
  }
}

AngularComponentFactory.Instance.registerComponent("sv-tagbox-filter", TagboxFilterComponent);