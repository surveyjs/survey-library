import { MultipleTextItemModel, QuestionMultipleTextModel, QuestionTextModel } from "survey-core";
import { Component, Input } from "@angular/core";
import { BaseAngular } from "../base-angular";

@Component({
  selector: "'[sv-ng-multipletext-item]'",
  templateUrl: "./mutlipletextitem.component.html"
})
export class MultipleTextItemComponent extends BaseAngular<QuestionTextModel> {
  @Input() question!: QuestionMultipleTextModel;
  @Input() model!: MultipleTextItemModel;
  protected getModel(): QuestionTextModel {
    return this.model.editor;
  }
}
