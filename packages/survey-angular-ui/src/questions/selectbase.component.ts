import { Component, Directive, ElementRef, Input, ViewChild } from "@angular/core";
import { QuestionAngular } from "../question";
import { QuestionRadiogroupModel, QuestionSelectBase } from "survey-core";
import { AngularComponentFactory } from "../component-factory";

@Component({
  selector: "['sv-ng-selectbase']",
  templateUrl: "./selectbase.component.html"
})
export class SelectBaseComponent<T extends QuestionSelectBase> extends QuestionAngular<T> {
  public inputType: string = "checkbox";
  public showLegend: boolean = true;
  //#todo temp fix (CanClearButton should be placed in selectbase so it could work with imagepicker)
  @Input() override model!: any;
}

AngularComponentFactory.Instance.registerComponent("selectbase", SelectBaseComponent);