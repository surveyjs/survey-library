import { Component, Input } from "@angular/core";
import { QuestionAngular } from "../question";
import { ItemValue, QuestionRadiogroupModel, QuestionSelectBase } from "survey-core";
import { AngularComponentFactory } from "../component-factory";

@Component({
  selector: "['sv-ng-selectbase']",
  templateUrl: "./selectbase.component.html"
})
export class SelectBaseComponent<T extends QuestionSelectBase> extends QuestionAngular<T> {
  //#todo temp fix (CanClearButton should be placed in selectbase so it could work with imagepicker)
  @Input() override model!: any;

  public inputType: string = "checkbox";
  public showLegend: boolean = true;
  public getItemValueComponentName(item: ItemValue): string {
    return this.model.getItemValueWrapperComponentName(item) || "sv-ng-selectbase-item";
  }
  public getItemValueComponentData(item: ItemValue): any {
    return {
      componentName: "sv-ng-selectbase-item",
      componentData: {
        question: this.model,
        model: item,
        inputType: this.inputType,
        data: this.model.getItemValueWrapperComponentData(item)
      }
    };
  }
}

AngularComponentFactory.Instance.registerComponent("selectbase", SelectBaseComponent);