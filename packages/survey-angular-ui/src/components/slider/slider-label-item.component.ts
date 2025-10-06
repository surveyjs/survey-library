import { Component, Input } from "@angular/core";
import { QuestionSliderModel, SliderLabelItemValue } from "survey-core";
import { BaseAngular } from "../../base-angular";
import { AngularComponentFactory } from "../../component-factory";

@Component({
  selector: "sv-ng-slider-label-item",
  templateUrl: "./slider-label-item.component.html"
})

export class SliderLabelItemComponent extends BaseAngular {
  @Input() model!: QuestionSliderModel;
  @Input() item!: SliderLabelItemValue;

  // onClick(event: any): void {
  //   this.model.setValueFromClick(event.target.value);
  //   event.stopPropagation();
  // }

  getModel() {
    return this.item;
  }
}

AngularComponentFactory.Instance.registerComponent("sv-slider-label-item", SliderLabelItemComponent);