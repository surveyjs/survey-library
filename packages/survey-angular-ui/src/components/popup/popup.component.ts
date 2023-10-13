import { ChangeDetectorRef, Component, ElementRef, Input, ViewChild, ViewContainerRef } from "@angular/core";
import { BaseAngular } from "../../base-angular";
import { PopupBaseViewModel, PopupModel, createPopupViewModel } from "survey-core";

@Component({
  selector: "sv-ng-popup, '[sv-ng-popup]'",
  template: "<div #containerRef><sv-ng-popup-container [model]='model' ></sv-ng-popup-container></div>"
})

export class PopupComponent extends BaseAngular<PopupModel> {
  @Input() popupModel!: PopupModel;
  @Input() getTarget?: (container: HTMLElement) => HTMLElement;
  @ViewChild("containerRef") containerRef!: ElementRef<HTMLDivElement>;

  public model!: PopupBaseViewModel;

  protected getModel(): PopupModel {
    return this.popupModel;
  }

  constructor(viewContainerRef: ViewContainerRef, changeDetectorRef: ChangeDetectorRef) {
    super(changeDetectorRef, viewContainerRef);
  }
  protected override onModelChanged(): void {
    if (this.model) {
      this.model.resetComponentElement();
      this.model.dispose();
    }
    this.model = createPopupViewModel(this.popupModel, this.viewContainerRef?.element.nativeElement);
  }
  ngAfterViewInit(): void {
    if (!!this.containerRef?.nativeElement) {
      const container = this.containerRef.nativeElement as HTMLElement;
      this.model.setComponentElement(container, this.getTarget ? this.getTarget(container.parentElement as HTMLElement) : container?.parentElement?.parentElement);
    }
  }
  override ngOnInit() {
    this.onModelChanged();
  }
  override ngOnDestroy(): void {
    this.model.resetComponentElement();
    this.model.dispose();
    super.ngOnDestroy();
  }
}