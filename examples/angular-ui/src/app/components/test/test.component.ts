import { ChangeDetectorRef, Component } from "@angular/core";
import { SurveyModel } from "survey-core";
import * as Survey from "survey-core";
import { defaultStandardCss } from "survey-core/plugins/survey-default-theme";
import { defaultBootstrapCss } from "survey-core/plugins/survey-bootstrap-theme";
import "survey-core/survey.i18n";

@Component({
  selector: "test",
  template: "<router-outlet></router-outlet>",
})
export class TestComponent {
  public model?: SurveyModel | Survey.PopupSurveyModel;
  public isPopup: boolean;
  constructor(private changeDetectorRef: ChangeDetectorRef) {
    (window as any).Survey = Survey;
    (<any>window).setSurvey = (survey: SurveyModel | Survey.PopupSurveyModel, isPopup: boolean) => {
      this.model = survey;
      this.isPopup = isPopup;
      this.changeDetectorRef.detectChanges();
    }
    (window as any).Survey.defaultStandardCss = defaultStandardCss;
    (window as any).Survey.defaultBootstrapCss = defaultBootstrapCss;
  }
}
