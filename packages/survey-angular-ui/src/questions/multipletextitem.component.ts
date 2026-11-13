import { MultipleTextCell, MultipleTextItemModel, Question, QuestionMultipleTextModel, QuestionTextModel } from "survey-core";
import { Component, DoCheck, Input, OnDestroy } from "@angular/core";
import { BaseAngular } from "../base-angular";
import { getComponentName } from "../question";
import { SurveyBaseProviders } from "../component-depth";

@Component({
  providers: SurveyBaseProviders,
  selector: "'[sv-ng-multipletext-item]'",
  templateUrl: "./mutlipletextitem.component.html"
})
export class MultipleTextItemComponent extends BaseAngular<QuestionTextModel> implements DoCheck, OnDestroy {
  @Input() question!: QuestionMultipleTextModel;
  @Input() model!: MultipleTextCell;
  protected getModel(): QuestionTextModel {
    if (!this.model.isErrorsCell) {
      return this.model.item.editor;
    }
    return null as any;
  }
  public get item(): MultipleTextItemModel {
    return this.model.item;
  }
  public get editor(): QuestionTextModel {
    return this.model.item.editor;
  }
  public getComponentName(element: Question): string { return getComponentName(element); }
}
