import { ChangeDetectorRef, Component, Input, ViewContainerRef } from "@angular/core";
import { BaseAngular } from "../../base-angular";
import { PopupBaseViewModel, PopupModel, createPopupViewModel } from "survey-core";
import { DomPortalOutlet } from "@angular/cdk/portal";
import { PopupService } from "./popup.service";

@Component({
  selector: "sv-ng-popup, '[sv-ng-popup]'",
  template: "<div></div>"
})

export class PopupComponent extends BaseAngular<PopupModel> {
  @Input() popupModel!: PopupModel;

  public model!: PopupBaseViewModel;
  private portalHost!: DomPortalOutlet;

  protected getModel(): PopupModel {
    return this.popupModel;
  }

  constructor(viewContainerRef: ViewContainerRef, changeDetectorRef: ChangeDetectorRef, private popupService: PopupService) {
    super(changeDetectorRef, viewContainerRef);
  }
  protected override onModelChanged(): void {
    this.destroyModel();
    this.model = createPopupViewModel(this.popupModel, this.viewContainerRef?.element.nativeElement.parentElement);
    this.model.initializePopupContainer();
    this.portalHost = this.popupService.createComponent(this.model);
  }
  override ngOnInit() {
    this.onModelChanged();
  }
  public destroyModel(): void {
    this.portalHost?.detach();
    this.model?.unmountPopupContainer();
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this.destroyModel();
  }
}