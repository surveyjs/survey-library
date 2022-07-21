import { ChangeDetectorRef, Component, Input } from "@angular/core";
import { BaseAngular } from "../../base-angular";
import { PopupBaseViewModel } from "survey-core";

@Component({
  selector: "sv-ng-popup-container, '[sv-ng-popup-container]'",
  templateUrl: "./popup-container.component.html"
})

export class PopupContainerComponent extends BaseAngular<PopupBaseViewModel> {
  private prevIsVisible: boolean = false;
  isShow: boolean = false;
  @Input() model!: PopupBaseViewModel;

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
    if (!this.prevIsVisible && this.model.isVisible) {
      this.isShow = false;
    }
  }

  protected override afterUpdate(): void {
    if (!this.prevIsVisible && this.model.isVisible) {
      setTimeout(() => {
        this.model.updateOnShowing();
        this.isShow = true;
        this.changeDetectorRef.detectChanges();
      });
    }
    if (this.prevIsVisible !== this.model.isVisible) {
      this.prevIsVisible = this.model.isVisible;
    }
    super.afterUpdate();
  }
}