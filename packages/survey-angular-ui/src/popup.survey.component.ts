import { ChangeDetectorRef, Component, Inject, Input, OnChanges, Optional, SimpleChanges } from "@angular/core";
import { PopupSurveyModel, SurveyModel } from "survey-core";
import { BaseAngular } from "./base-angular";
import { COMPONENT_DEPTH, SurveyBaseProviders } from "./component-depth";
@Component({
  providers: SurveyBaseProviders,
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
  @Input() onClose?: () => void;
  public popup!: PopupSurveyModel;

  constructor(changeDetectorRef: ChangeDetectorRef, @Optional() @Inject(COMPONENT_DEPTH) depth?: number | null) {
    super(changeDetectorRef, undefined, depth);
    changeDetectorRef.detach();
  }
  protected getModel(): PopupSurveyModel {
    return this.popup;
  }
  public getHeaderCss(): string {
    let headerCss = this.popup.cssHeaderRoot;
    if (this.popup.isCollapsed) {
      headerCss += " " + this.popup.cssRootCollapsedMod;
    }
    return headerCss;
  }

  public closeHandler() {
    this.popup.hide();
    if (!!this.onClose) {
      this.onClose();
    }
  }

  override ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);
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
  }
  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.popup.dispose();
  }
}