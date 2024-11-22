import { ChangeDetectorRef, Component, Input } from "@angular/core";
import { SurveyModel, SvgRegistry, addIconsToThemeSet } from "survey-core";
import { BaseAngular } from "./base-angular";

import { icons as iconsV1 } from "survey-core/icons/iconsV1";
import { icons as iconsV2 } from "survey-core/icons/iconsV2";
addIconsToThemeSet("v1", iconsV1);
addIconsToThemeSet("v2", iconsV2);

SvgRegistry.registerIcons(iconsV1);
@Component({
  selector: "survey",
  template: "<sv-ng-modal-container></sv-ng-modal-container><survey-content [model]='model'></survey-content>"
  })
export class SurveyComponent extends BaseAngular<SurveyModel> {
  @Input() model!: SurveyModel;
  protected getModel(): SurveyModel {
    return this.model;
  }
  constructor(changeDetectorRef: ChangeDetectorRef) {
    super(changeDetectorRef);
    changeDetectorRef.detach();
  }
  protected override getShouldReattachChangeDetector(): boolean {
    return false;
  }
  protected override onModelChanged(): void {
    this.changeDetectorRef.detectChanges();
  }
}