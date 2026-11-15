import { ChangeDetectorRef, Component, Inject, Input, Optional } from "@angular/core";
import { SurveyModel, SvgRegistry, addIconsToThemeSet } from "survey-core";
import { BaseAngular } from "./base-angular";

import { icons as iconsV2 } from "survey-core/icons/iconsV2";
import { COMPONENT_DEPTH, SurveyBaseProviders } from "./component-depth";
addIconsToThemeSet("v2", iconsV2);

SvgRegistry.registerIcons(iconsV2);
@Component({
  providers: SurveyBaseProviders,
  selector: "survey",
  template: "<sv-ng-modal-container></sv-ng-modal-container><survey-content [model]='model'></survey-content>"
})
export class SurveyComponent extends BaseAngular<SurveyModel> {
  @Input() model!: SurveyModel;
  protected getModel(): SurveyModel {
    return this.model;
  }
}