import { ChangeDetectorRef, Component, ViewEncapsulation } from "@angular/core";
import * as SurveyCore from "survey-core";
import { TestComponent } from "./test.component";
import * as widgets from "surveyjs-widgets";
import "icheck";
@Component({
  selector: "test-default",
  templateUrl: "./test.component.html",
  styleUrls: ["./customwidget.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class TestCustomWidgetComponent extends TestComponent {
  constructor(changeDetectorRef: ChangeDetectorRef) {
    super(changeDetectorRef);
    widgets.sortablejs(SurveyCore);
    widgets.icheck(SurveyCore, (<any>window).jQuery);
  }
}