import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import { SurveyModel, ProgressButtons, ProgressButtonsResponsivityManager, IProgressButtonsViewModel } from "survey-core";
import { AngularComponentFactory } from "../../../component-factory";

@Component({
  selector: "sv-ng-progress-buttons",
  templateUrl: "./progress.component.html"
})
export class ProgressButtonsComponent implements OnDestroy, AfterViewInit, OnChanges, OnInit, IProgressButtonsViewModel {
  @Input() model!: ProgressButtons;
  @Input() survey!: SurveyModel;
  @Input() container!: string;
  @ViewChild("progressButtonsListContainer") progressButtonsListContainer!: ElementRef<HTMLDivElement>;
  public hasScroller: boolean = false;
  public canShowHeader: boolean = false;
  public canShowFooter: boolean = false;
  public canShowItemTitles: boolean = true;
  private respManager?: ProgressButtonsResponsivityManager;
  constructor(private changeDetectorRef: ChangeDetectorRef) {
  }
  onResize(canShowItemTitles: boolean): void {
    this.canShowItemTitles = canShowItemTitles;
    this.canShowHeader = !this.canShowItemTitles;
    this.changeDetectorRef.detectChanges();
  }
  onUpdateScroller(hasScroller: boolean): void {
    this.hasScroller = hasScroller;
    this.changeDetectorRef.detectChanges();
  }
  onUpdateSettings(): void {
    this.canShowItemTitles = this.model.showItemTitles;
    this.canShowFooter = !this.model.showItemTitles;
    this.changeDetectorRef.detectChanges();
  }
  ngOnInit(): void {
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
  public ngOnDestroy(): void {
    this.respManager?.dispose();
  }
}
AngularComponentFactory.Instance.registerComponent("sv-progress-buttons", ProgressButtonsComponent);
