import {  ChangeDetectorRef, Component, ViewEncapsulation } from "@angular/core";
import {  StylesManager } from "survey-core";
import * as SurveyCore from "survey-core";
import { TestComponent } from "./test.component";
import * as widgets from "surveyjs-widgets";
import "icheck";
import { defaultThemeName } from "../../../../../../src/entries/plugins";
@Component({
  selector: "test-default",
  templateUrl: "./test.component.html",
  styleUrls: ["./customwidget.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class TestCustomWidgetComponent extends TestComponent {
  constructor(changeDetectorRef: ChangeDetectorRef) {
    super(changeDetectorRef);
    StylesManager.applyTheme(defaultThemeName);
    widgets.sortablejs(SurveyCore);
    widgets.icheck(SurveyCore, window.jQuery);
  }
}