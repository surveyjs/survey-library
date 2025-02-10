import { Component, Input } from "@angular/core";
import { ItemValue, QuestionTagboxModel } from "survey-core";
import { AngularComponentFactory } from "../../component-factory";
import { EmbeddedViewContentComponent } from "../../embedded-view-content.component";

@Component({
  selector: "sv-ng-tagbox-item, '[sv-ng-tagbox-item]'",
  templateUrl: "./tagbox-item.component.html",
  styleUrls: ["../../hide-host.scss"]
})
export class TagboxItemComponent extends EmbeddedViewContentComponent {
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