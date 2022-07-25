import { QuestionAngular } from "../question";
import { MultipleTextItemModel, QuestionMultipleTextModel } from "survey-core";
import { Component } from "@angular/core";
import { AngularComponentFactory } from "../component-factory";

@Component({
  selector: "sv-ng-multipletext-question",
  templateUrl: "./multipletext.component.html"
})
export class MultipleTextComponent extends QuestionAngular<QuestionMultipleTextModel> {
  trackRowBy = (index: number): string => {
    return this.model.inputId + "rowkey" + index;
  }
  trackItemBy (_: number, item: MultipleTextItemModel): string {
    return "item" + item.editor.id;
  }
}

AngularComponentFactory.Instance.registerComponent("multipletext-question", MultipleTextComponent);