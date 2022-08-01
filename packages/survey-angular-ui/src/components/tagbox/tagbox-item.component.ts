import { Component, Input } from "@angular/core";
import { ItemValue, QuestionTagboxModel } from "survey-core";
import { BaseAngular } from "../../base-angular";
import { AngularComponentFactory } from "../../component-factory";

@Component({
  selector: "sv-ng-tagbox-item, '[sv-ng-tagbox-item]'",
  templateUrl: "./tagbox-item.component.html",
})
export class TagboxItemComponent extends BaseAngular {
  @Input() item!: ItemValue;
  @Input() question!: QuestionTagboxModel;

  removeItem(event: any) {
    this.question.dropdownListModel.deselectItem(this.item.value);
    event.stopPropagation();
  }

  getModel() {
    return this.item;
  }
}

AngularComponentFactory.Instance.registerComponent("sv-tagbox-item", TagboxItemComponent);