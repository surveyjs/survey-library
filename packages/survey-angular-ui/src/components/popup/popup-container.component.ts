import { Component, Input, ViewChild, ViewContainerRef } from "@angular/core";
import { BaseAngular } from "../../base-angular";
import { PopupBaseViewModel } from "survey-core";
import { AngularComponentFactory } from "../../component-factory";

@Component({
  selector: "sv-ng-popup-container, '[sv-ng-popup-container]'",
  templateUrl: "./popup-container.component.html"
})

export class PopupContainerComponent extends BaseAngular<PopupBaseViewModel> {
  private prevIsVisible: boolean = false;
  isShow: boolean = false;

  @Input() model!: PopupBaseViewModel;
  @ViewChild("popupContent", { read: ViewContainerRef, static: true }) popupContent!: ViewContainerRef;

  protected getModel(): PopupBaseViewModel {
    return this.model;
  }

  override ngDoCheck() {
    super.ngDoCheck();
    if (this.prevIsVisible && !this.model.isVisible) {
      this.isShow = false;
    }
  }

  override ngAfterViewChecked() {
    if (!this.prevIsVisible && this.model.isVisible) {
      setTimeout(() => {
        this.model.updateOnShowing();
        this.isShow = true;
      }, 0);
    }
    if (this.prevIsVisible !== this.model.isVisible) {
      this.prevIsVisible = this.model.isVisible;
    }
    super.ngAfterViewChecked();
  }

  public createAndBindPopupContent() {
    let componentRef = AngularComponentFactory.Instance.create(this.popupContent, this.model.contentComponentName);
    if (!!componentRef) {
      (componentRef.instance as any).model = this.model.contentComponentData.model;
    }
  }
}