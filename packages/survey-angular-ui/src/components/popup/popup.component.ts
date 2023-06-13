import { ChangeDetectorRef, Component, Input, ViewContainerRef } from "@angular/core";
import { BaseAngular } from "../../base-angular";
import { PopupBaseViewModel, PopupModel, createPopupViewModel } from "survey-core";

@Component({
  selector: "sv-ng-popup, '[sv-ng-popup]'",
  template: "<div><sv-ng-popup-container [model]='model' ></sv-ng-popup-container></div>"
})

export class PopupComponent extends BaseAngular<PopupModel> {
  @Input() popupModel!: PopupModel;

  public model!: PopupBaseViewModel;

  protected getModel(): PopupModel {
    return this.popupModel;
  }

  constructor(viewContainerRef: ViewContainerRef, changeDetectorRef: ChangeDetectorRef) {
    super(changeDetectorRef, viewContainerRef);
  }
  protected override onModelChanged(): void {
    this.model = createPopupViewModel(this.popupModel,  this.viewContainerRef?.element.nativeElement.parentElement, this.viewContainerRef?.element.nativeElement.children[0].children[0].children[0]);
  }
  override ngOnInit() {
    this.onModelChanged();
  }
}