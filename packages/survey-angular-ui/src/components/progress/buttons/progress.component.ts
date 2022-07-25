import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import { AngularComponentFactory } from "../../../component-factory";
import { SurveyModel, SurveyProgressButtonsModel } from "survey-core";

@Component({
  selector: "sv-ng-progress-buttons",
  templateUrl: "./progress.component.html"
})
export class ProgressButtonsComponent implements OnDestroy, AfterViewInit, OnChanges, OnInit {
  @Input() model!: SurveyModel;
  @ViewChild("progressButtonsListContainer") progressButtonsListContainer!: ElementRef<HTMLDivElement>;
  private progressButtonsModel!: SurveyProgressButtonsModel;
  private hasScroller: boolean = false;
  private updateScroller: any = undefined;
  constructor(private changeDetectorRef: ChangeDetectorRef) {
  }
  private createProgressButtonsModel() {
    this.progressButtonsModel = new SurveyProgressButtonsModel(this.model);
  }
  ngOnInit(): void {
    this.createProgressButtonsModel();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.createProgressButtonsModel();
  }
  public isListElementClickable(index: number): boolean {
    return this.progressButtonsModel.isListElementClickable(index);
  }
  public getListElementCss(index: number): string {
    return this.progressButtonsModel.getListElementCss(index);
  }
  public clickListElement(index: number): void {
    this.progressButtonsModel.clickListElement(index);
  }
  public getScrollButtonCss(isLeftScroll: boolean): string {
    return this.progressButtonsModel.getScrollButtonCss(this.hasScroller, isLeftScroll);
  }
  public clickScrollButton(
    isLeftScroll: boolean
  ): void {
    if(this.progressButtonsListContainer) {
      this.progressButtonsListContainer.nativeElement.scrollLeft += (isLeftScroll ? -1 : 1) * 70;
    }
  }
  public ngAfterViewInit(): void {
    this.progressButtonsModel = new SurveyProgressButtonsModel(this.model);
    this.updateScroller = setInterval(() => {
      if(!!this.progressButtonsListContainer?.nativeElement) {
        const listContainerElement = this.progressButtonsListContainer.nativeElement;
        this.hasScroller = listContainerElement.scrollWidth > listContainerElement.offsetWidth;
        this.changeDetectorRef.detectChanges();
      }
    }, 100);
  }
  public ngOnDestroy(): void {
    if (typeof this.updateScroller !== "undefined") {
      clearInterval(this.updateScroller);
      this.updateScroller = undefined;
    }
  }
}
AngularComponentFactory.Instance.registerComponent("sv-progress-buttons", ProgressButtonsComponent);
