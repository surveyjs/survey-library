import { ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { PopupSurveyModel, SurveyModel } from "survey-core";
import { BaseAngular } from "./base-angular";
@Component({
  selector: "popup-survey",
  templateUrl: "./popup.survey.component.html",
  styleUrls: ["./popup.survey.component.scss"]
})
export class PopupSurveyComponent extends BaseAngular<PopupSurveyModel> implements OnChanges {
  @Input() model!: SurveyModel;
  @Input() isExpanded?: boolean;
  @Input() allowClose?: boolean;
  @Input() closeOnCompleteTimeout?: number;
  @Input() allowFullScreen?: boolean;
  public popup!: PopupSurveyModel;

  constructor(changeDetectorRef: ChangeDetectorRef) {
    super(changeDetectorRef);
    changeDetectorRef.detach();
  }
  protected getModel(): PopupSurveyModel {
    return this.popup;
  }
  protected override getShouldReattachChangeDetector(): boolean {
    return false;
  }
  public getHeaderCss(): string {
    let headerCss = this.popup.cssHeaderRoot;
    if (this.popup.isCollapsed) {
      headerCss += " " + this.popup.cssRootCollapsedMod;
    }
    return headerCss;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["model"]?.currentValue !== changes["model"]?.previousValue) {
      this.popup = new PopupSurveyModel(null, this.model);
    }
    if (this.isExpanded !== undefined) {
      this.popup.isExpanded = this.isExpanded;
    }
    if (this.allowClose !== undefined) {
      this.popup.allowClose = this.allowClose;
    }
    if (this.allowFullScreen !== undefined) {
      this.popup.allowFullScreen = this.allowFullScreen;
    }
    if (this.closeOnCompleteTimeout !== undefined) {
      this.popup.closeOnCompleteTimeout = this.closeOnCompleteTimeout;
    }
    this.popup.isShowing = true;
    this.changeDetectorRef.detectChanges();
  }
  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.popup.dispose();
  }
}