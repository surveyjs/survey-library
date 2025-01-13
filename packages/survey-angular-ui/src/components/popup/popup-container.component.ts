import { ChangeDetectorRef, Component, Input } from "@angular/core";
import { BaseAngular } from "../../base-angular";
import { PopupBaseViewModel, PopupModalViewModel } from "survey-core";

@Component({
  selector: "sv-ng-popup-container, '[sv-ng-popup-container]'",
  templateUrl: "./popup-container.component.html"
  })

export class PopupBaseContainerComponent<T extends PopupBaseViewModel = PopupBaseViewModel> extends BaseAngular<T> {
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

  protected override getPropertiesToUpdateSync(): string[] {
    return ["height"];
  }

  protected override getShouldReattachChangeDetector(): boolean {
    return false;
  }

  protected override onModelChanged(): void {
    this.changeDetectorRef.detectChanges();
  }

  protected override afterUpdate(isSync: boolean = false): void {
    super.afterUpdate(isSync);
    if(!isSync) {
      if (!this.model.isPositionSet && this.model.isVisible) {
        this.model.updateOnShowing();
      }
    }
  }
  public clickInside(event: any) {
    event.stopPropagation();
  }
}