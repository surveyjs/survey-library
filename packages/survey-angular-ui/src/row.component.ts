import { ChangeDetectorRef, Component, ElementRef, Inject, Input, NgZone, Optional, ViewChild, ViewContainerRef } from "@angular/core";
import { IElement, QuestionRowModel } from "survey-core";
import { BaseAngular } from "./base-angular";
import { COMPONENT_DEPTH, SurveyBaseProviders } from "./component-depth";
@Component({
  providers: SurveyBaseProviders,
  selector: "sv-ng-row",
  templateUrl: "./row.component.html",
  styleUrls: ["./hide-host.scss"]
})
export class RowComponent extends BaseAngular<QuestionRowModel> {
  @Input() row!: QuestionRowModel;
  @ViewChild("container", { read: ElementRef }) container?: ElementRef<HTMLDivElement>;
  constructor(cdr: ChangeDetectorRef, vcr: ViewContainerRef, private ngZone: NgZone, @Optional() @Inject(COMPONENT_DEPTH) depth?: number | null) {
    super(cdr, vcr, depth);
  }
  private lazyRenderingTimeout?: ReturnType<typeof setTimeout>;
  protected getModel(): QuestionRowModel {
    return this.row;
  }
  trackElementBy (index: number, element: IElement): string {
    return element.name + index;
  }
  protected override afterViewInit(): void {
    const el = this.container?.nativeElement;
    if (!!el) {
      this.row.setRootElement(el);
      if (!this.row.isNeedRender) {
        this.ngZone.runOutsideAngular(() => {
          this.lazyRenderingTimeout = setTimeout(() => {
            this.row.startLazyRendering(el);
          }, 10);
        });
      }
    }
  }
  protected override onModelChanged(): void {
    super.onModelChanged();
    if (!this.previousModel) {
      return;
    } else {
      this.previousModel.setRootElement(undefined);
      if (this.container?.nativeElement) {
        this.row.setRootElement(this.container.nativeElement);
      }
      this.row.isNeedRender = this.previousModel.isNeedRender;
      this.stopLazyRendering();
    }
  }
  private stopLazyRendering() {
    clearTimeout(this.lazyRenderingTimeout);
    this.row.stopLazyRendering();
    this.row.isNeedRender = !this.row.isLazyRendering();
  }
  public override ngOnDestroy(): void {
    super.ngOnDestroy();
    if (!this.isBaseElementSubsribed(this.row)) {
      this.row.setRootElement(undefined);
      this.stopLazyRendering();
    }
  }
}