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

  public getDefaultComponentName(): string {
    return "sv-ng-selectbase-item";
  }
  public trackItemBy(_: number, item: ItemValue): any {
    return item.value;
  }
  public trackColumnBy(index: number): any {
    return index;
  }

  public getItemValueComponentName(item: ItemValue): string {
    return this.model.getItemValueWrapperComponentName(item) || this.getDefaultComponentName();
  }
  public getItemValueComponentData(item: ItemValue): any {
    const itemComponentProperty = this.model.getPropertyByName("itemComponent");
    const isDefaultItemComponent = itemComponentProperty.isDefaultValue(this.model.itemComponent);
    const itemComponent = isDefaultItemComponent ? this.getDefaultComponentName() : this.model.itemComponent;

    return {
      componentName: itemComponent,
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