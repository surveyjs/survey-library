import { ChangeDetectorRef, Component, ElementRef, Input, ViewChild, ViewContainerRef } from "@angular/core";
import { BaseAngular } from "../../base-angular";
import { PopupBaseViewModel, PopupModel, createPopupViewModel } from "survey-core";

@Component({
  selector: "sv-ng-popup, '[sv-ng-popup]'",
  template: "<div #containerRef><sv-ng-popup-container [model]='model' ></sv-ng-popup-container></div>"
})

export class PopupComponent extends BaseAngular<PopupModel> {
  @Input() popupModel!: PopupModel;
  @Input() targetElement?: { setCurrent: (currentEl: HTMLElement) => void };
  @ViewChild("containerRef") containerRef!: ElementRef<HTMLDivElement>;

  public model!: PopupBaseViewModel;

  protected getModel(): PopupModel {
    return this.popupModel;
  }

  constructor(viewContainerRef: ViewContainerRef, changeDetectorRef: ChangeDetectorRef) {
    super(changeDetectorRef, viewContainerRef);
  }
  protected override onModelChanged(): void {
    this.model = createPopupViewModel(this.popupModel, this.viewContainerRef?.element.nativeElement);
  }
  ngAfterViewInit(): void {
    if(!!this.containerRef?.nativeElement) {
      this.model.setComponentElement(this.containerRef.nativeElement, this.containerRef?.nativeElement?.parentElement?.parentElement);
    }
    if(!!this.targetElement) {
      this.targetElement.setCurrent = (currentEl: HTMLElement) => this.model.setComponentElement(this.containerRef?.nativeElement, currentEl);
    }
  }
  override ngOnInit() {
    this.onModelChanged();
  }
}