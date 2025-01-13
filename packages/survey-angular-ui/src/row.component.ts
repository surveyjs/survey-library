import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, NgZone, ViewChild, ViewContainerRef } from "@angular/core";
import { IElement, QuestionRowModel } from "survey-core";
import { BaseAngular } from "./base-angular";
@Component({
  selector: "sv-ng-row",
  templateUrl: "./row.component.html",
  styleUrls: ["./hide-host.scss"]
})
export class RowComponent extends BaseAngular<QuestionRowModel> implements AfterViewInit {
  @Input() row!: QuestionRowModel;
  @ViewChild("container", { read: ElementRef }) container?: ElementRef<HTMLDivElement>;
  constructor(cdr: ChangeDetectorRef, vcr: ViewContainerRef, private ngZone: NgZone) {
    super(cdr, vcr);
  }

  protected getModel(): QuestionRowModel {
    return this.row;
  }
  trackElementBy (index: number, element: IElement): string {
    return element.name + index;
  }
  public ngAfterViewInit(): void {
    const el = this.container?.nativeElement;
    if (!!el) {
      this.row.setRootElement(el);
      if(!this.row.isNeedRender) {
        this.ngZone.runOutsideAngular(() => {
          setTimeout(() => {
            this.row.startLazyRendering(el);
          }, 10);
        });
      }
    }
  }
  protected override onModelChanged(): void {
    super.onModelChanged();
    if(!this.previousModel) {
      return;
    } else {
      this.previousModel.setRootElement(undefined);
      if(this.container?.nativeElement) {
        this.row.setRootElement(this.container.nativeElement);
      }
      this.row.isNeedRender = this.previousModel.isNeedRender;
      this.stopLazyRendering();
    }
  }
  private stopLazyRendering() {
    this.row.stopLazyRendering();
    this.row.isNeedRender = !this.row.isLazyRendering();
  }
  public override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.row.setRootElement(undefined);
    this.stopLazyRendering();
  }
}