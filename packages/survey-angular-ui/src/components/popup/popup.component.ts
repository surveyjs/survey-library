import { ChangeDetectorRef, Component, Input, ViewContainerRef } from "@angular/core";
import { BaseAngular } from "../../base-angular";
import { PopupBaseViewModel, PopupModel } from "survey-core";
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

  override ngOnInit() {
    this.model = new PopupBaseViewModel(this.popupModel, this.viewContainerRef?.element.nativeElement.parentElement);
    this.model.initializePopupContainer();
    this.portalHost = this.popupService.createComponent(this.model);
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this.portalHost.detach();
    (<HTMLElement>this.model.container).remove();
    this.model.unmountPopupContainer();
  }
}