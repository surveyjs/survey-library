import { ChangeDetectorRef, Component, Input } from "@angular/core";
import { settings, SurveyModel, SvgRegistry, SvgThemeSets } from "survey-core";
import { BaseAngular } from "./base-angular";

import iconsV1 from "survey-core/icons/iconsV1";
import iconsV2 from "survey-core/icons/iconsV2";

SvgThemeSets["v1"] = iconsV1;
SvgThemeSets["v2"] = iconsV2;
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
    SvgRegistry.registerIcons(settings.useLegacyIcons ? iconsV1 : iconsV2);
  }
  protected override getShouldReattachChangeDetector(): boolean {
    return false;
  }
  protected override onModelChanged(): void {
    this.changeDetectorRef.detectChanges();
  }
}