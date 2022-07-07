import { ChangeDetectorRef, Component, Input, ViewChild, ViewContainerRef } from "@angular/core";
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
  constructor(changeDetectorRef: ChangeDetectorRef) {
    super(changeDetectorRef);
    this.changeDetectorRef.detach();
  }
  protected getModel(): PopupBaseViewModel {
    return this.model;
  }

  protected override onModelChanged(): void {
    this.changeDetectorRef.detectChanges();
  }

  protected override beforeUpdate(): void {
    super.beforeUpdate();
    if (this.prevIsVisible && !this.model.isVisible) {
      this.isShow = false;
    }
    if (this.prevIsVisible && this.model.isVisible) {
      this.isShow = true;
    }
  }

  protected override afterUpdate(): void {
    if (!this.prevIsVisible && this.model.isVisible) {
      setTimeout(() => { this.model.updateOnShowing(); this.changeDetectorRef.detectChanges(); });
    }
    if (this.prevIsVisible !== this.model.isVisible) {
      this.prevIsVisible = this.model.isVisible;
    }
    super.afterUpdate();
  }

  public createAndBindPopupContent() {
    let componentRef = AngularComponentFactory.Instance.create(this.popupContent, this.model.contentComponentName);
    if (!!componentRef) {
      (componentRef.instance as any).model = this.model.contentComponentData.model;
    }
  }
}