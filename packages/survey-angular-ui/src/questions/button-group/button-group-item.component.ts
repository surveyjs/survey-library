import { Component, Input, OnChanges } from "@angular/core";
import { BaseAngular } from "../../base-angular";
import { ButtonGroupItemModel, ItemValue, QuestionButtonGroupModel } from "survey-core";

@Component({
  selector: "sv-button-group-item",
  templateUrl: "./button-group-item.component.html",
  styleUrls: ["../../hide-host.scss"]
})
export class ButtonGroupItemComponent extends BaseAngular<ItemValue> implements OnChanges {
  @Input() item!: ItemValue;
  @Input() question!: QuestionButtonGroupModel;
  @Input() index!: number;
  public model!: ButtonGroupItemModel;
  public ngOnChanges(): void {
    this.model = new ButtonGroupItemModel(this.question, this.item, this.index);
  }
  protected getModel(): ItemValue {
    return this.item;
  }
}