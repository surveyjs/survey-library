import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild, ViewContainerRef } from "@angular/core";
import { SurveyModel, ProgressButtons, ProgressButtonsResponsivityManager, IProgressButtonsViewModel, Base } from "survey-core";
import { AngularComponentFactory } from "../../../component-factory";
import { BaseAngular } from "../../../base-angular";

@Component({
  selector: "sv-ng-progress-buttons",
  templateUrl: "./progress.component.html"
})
export class ProgressButtonsComponent extends BaseAngular implements OnDestroy, AfterViewInit, OnChanges, OnInit, IProgressButtonsViewModel {
  @Input() model!: ProgressButtons;
  @Input() survey!: SurveyModel;
  @Input() container!: string;
  @ViewChild("progressButtonsListContainer") progressButtonsListContainer!: ElementRef<HTMLDivElement>;
  public hasScroller: boolean = false;
  public canShowHeader: boolean = false;
  public canShowFooter: boolean = false;
  public canShowItemTitles: boolean = true;
  private respManager?: ProgressButtonsResponsivityManager;
  constructor(changeDetectorRef: ChangeDetectorRef, viewContainerRef?: ViewContainerRef) {
    super(changeDetectorRef, viewContainerRef);
  }
  protected getModel(): Base {
    return this.model;
  }
  onResize(canShowItemTitles: boolean): void {
    this.canShowItemTitles = canShowItemTitles;
    this.canShowHeader = !this.canShowItemTitles;
    this.detectChanges();
  }
  onUpdateScroller(hasScroller: boolean): void {
    this.hasScroller = hasScroller;
    this.detectChanges();
  }
  onUpdateSettings(): void {
    this.canShowItemTitles = this.model.showItemTitles;
    this.canShowFooter = !this.model.showItemTitles;
    this.detectChanges();
  }
  override ngOnInit(): void {
    super.ngOnInit();
  }
  ngOnChanges(changes: SimpleChanges): void {
  }
  public clickScrollButton(
    isLeftScroll: boolean
  ): void {
    if (this.progressButtonsListContainer) {
      this.progressButtonsListContainer.nativeElement.scrollLeft += (isLeftScroll ? -1 : 1) * 70;
    }
  }
  public ngAfterViewInit(): void {
    if (!!this.progressButtonsListContainer?.nativeElement) {
      const element = this.progressButtonsListContainer.nativeElement;
      this.respManager = new ProgressButtonsResponsivityManager(this.model, element, this);
    }
  }
  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.respManager?.dispose();
  }
}
AngularComponentFactory.Instance.registerComponent("sv-progress-buttons", ProgressButtonsComponent);
