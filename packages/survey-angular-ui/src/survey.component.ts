import { ChangeDetectorRef, Component, Input } from "@angular/core";
import { SurveyModel, SvgRegistry, addIconsToThemeSet } from "survey-core";
import { BaseAngular } from "./base-angular";
import { SurveyIdSourceService } from "./survey-id-source.service";

import { icons as iconsV1 } from "survey-core/icons/iconsV1";
import { icons as iconsV2 } from "survey-core/icons/iconsV2";
addIconsToThemeSet("v1", iconsV1);
addIconsToThemeSet("v2", iconsV2);

SvgRegistry.registerIcons(iconsV2);
@Component({
  selector: "survey",
  template: "<sv-ng-modal-container></sv-ng-modal-container><survey-content [model]='model'></survey-content>"
})
export class SurveyComponent extends BaseAngular<SurveyModel> {
  @Input() model!: SurveyModel;
  protected getModel(): SurveyModel {
    return this.model;
  }
  constructor(changeDetectorRef: ChangeDetectorRef, private idSource: SurveyIdSourceService) {
    super(changeDetectorRef);
    changeDetectorRef.detach();
  }
  ngOnInit(): void {
    // Assign the app-scoped SSR token before the survey body renders and reads renderedId. Inert on
    // Angular 12 (idSource.next() returns "" while SurveyIdSourceService.isEnabled is false), so
    // postId stays empty. idPrefix (Creator) wins over postId, so skip when it is set.
    const model = this.model;
    if (model && !model.idPrefix) {
      const token = this.idSource.next();
      if (token) model.postId = token;
    }
  }
  protected override getShouldReattachChangeDetector(): boolean {
    return false;
  }
  protected override onModelChanged(): void {
    this.changeDetectorRef.detectChanges();
  }
}