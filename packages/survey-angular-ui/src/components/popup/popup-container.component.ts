import { ChangeDetectorRef, Component, Input } from "@angular/core";
import { BaseAngular } from "../../base-angular";
import { PopupBaseViewModel, PopupModalViewModel } from "survey-core";

@Component({
  selector: "sv-ng-popup-container, '[sv-ng-popup-container]'",
  templateUrl: "./popup-container.component.html"
})

export class PopupBaseContainerComponent<T extends PopupBaseViewModel = PopupBaseViewModel> extends BaseAngular<T> {
  private prevIsVisible: boolean = false;
  isShow: boolean = false;
  @Input() model!: T;

  constructor(changeDetectorRef: ChangeDetectorRef) {
    super(changeDetectorRef);
    this.changeDetectorRef.detach();
  }
  protected getModel(): T {
    return this.model;
  }

  get applyButtonText(): string | null {
    const popupModalModel = this.model as any as PopupModalViewModel;
    if(!popupModalModel) return null;

    return popupModalModel.applyButtonText;
  }

  apply(): void {
    const popupModalModel = this.model as any as PopupModalViewModel;
    if(!popupModalModel) return;

    popupModalModel.apply();
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