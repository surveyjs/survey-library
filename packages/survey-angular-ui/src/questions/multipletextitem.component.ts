import { MultipleTextCell, MultipleTextItemModel, QuestionMultipleTextModel, QuestionTextModel } from "survey-core";
import { Component, DoCheck, Input, OnDestroy } from "@angular/core";
import { BaseAngular } from "../base-angular";

@Component({
  selector: "'[sv-ng-multipletext-item]'",
  templateUrl: "./mutlipletextitem.component.html"
})
export class MultipleTextItemComponent extends BaseAngular<QuestionTextModel> implements DoCheck, OnDestroy {
  @Input() question!: QuestionMultipleTextModel;
  @Input() model!: MultipleTextCell;
  protected getModel(): QuestionTextModel {
    if(!this.model.isErrorsCell) {
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
  override ngDoCheck(): void {
    super.ngDoCheck();
    if(this.model.isErrorsCell) {
      this.editor.registerFunctionOnPropertyValueChanged("errors", () => {
        this.update();
      }, "__ngSubscription")
    }
  }
  override ngOnDestroy(): void {
    super.ngOnDestroy();
    if(this.model.isErrorsCell) {
      this.editor.unRegisterFunctionOnPropertyValueChanged("errors", "__ngSubscription")    
    }
  }
}
