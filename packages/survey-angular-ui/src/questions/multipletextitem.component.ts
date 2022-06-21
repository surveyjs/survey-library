import { MultipleTextItemModel, QuestionMultipleTextModel } from "survey-core";
import { Component, Input } from "@angular/core";
import { BaseAngular } from "../base-angular";

@Component({
  selector: "'[sv-ng-multipletext-item]'",
  templateUrl: "./mutlipletextitem.component.html"
})
export class MultipleTextItemComponent extends BaseAngular<MultipleTextItemModel> {
  @Input() question!: QuestionMultipleTextModel;
  @Input() model!: MultipleTextItemModel;
  protected getModel(): MultipleTextItemModel {
    return this.model;
  }
}
