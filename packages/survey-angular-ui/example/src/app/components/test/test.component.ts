import { ChangeDetectorRef, Component } from "@angular/core";
import { SurveyModel } from "survey-core";
import * as Survey from "survey-core";
import { defaultCss } from "survey-core/plugins/bootstrap-integration";
import "survey-core/survey.i18n";

@Component({
  selector: "test",
  template: "<router-outlet></router-outlet>",
})
export class TestComponent {
  public model?: SurveyModel | Survey.PopupSurveyModel;
  public isPopup: boolean = true;
  public isExpanded: boolean = true;
  constructor(private changeDetectorRef: ChangeDetectorRef) {
    (window as any).Survey = Survey;
    Survey.defaultStandardCss.variables.mobileWidth = <any>undefined;
    Survey.modernCss.variables.mobileWidth = <any>undefined;
    (<any>window).setSurvey = (survey: SurveyModel | Survey.PopupSurveyModel, isPopup: boolean, isExpanded: boolean = true) => {
      this.model = survey;
      this.isPopup = isPopup;
      this.isExpanded = isExpanded;
      this.changeDetectorRef.detectChanges();
    };
    (window as any).Survey.defaultBootstrapCss = defaultCss;
  }
}
