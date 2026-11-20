import { QuestionAngular } from "../question";
import { MultipleTextItemModel, QuestionMultipleTextModel } from "survey-core";
import { Component } from "@angular/core";
import { AngularComponentFactory } from "../component-factory";
import { SurveyBaseProviders } from "../component-depth";

@Component({
  providers: SurveyBaseProviders,
  selector: "sv-ng-multipletext-question",
  templateUrl: "./multipletext.component.html"
})
export class MultipleTextComponent extends QuestionAngular<QuestionMultipleTextModel> {
  trackRowBy = (index: number): string => {
    return this.model.inputId + "rowkey" + index;
  };
}

AngularComponentFactory.Instance.registerComponent("multipletext-question", MultipleTextComponent);