import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { BaseAngular } from "../../base-angular";
import { ButtonGroupItemModel, ItemValue, QuestionButtonGroupModel } from "survey-core";
import { SurveyBaseProviders } from "../../component-depth";

@Component({
  providers: SurveyBaseProviders,
  selector: "sv-button-group-item",
  templateUrl: "./button-group-item.component.html",
  styleUrls: ["../../hide-host.scss"]
})
export class ButtonGroupItemComponent extends BaseAngular<ItemValue> implements OnChanges {
  @Input() item!: ItemValue;
  @Input() question!: QuestionButtonGroupModel;
  @Input() index!: number;
  public model!: ButtonGroupItemModel;
  public override ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);
    this.model = new ButtonGroupItemModel(this.question, this.item, this.index);
  }
  protected getModel(): ItemValue {
    return this.item;
  }
}