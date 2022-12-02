import {  ChangeDetectorRef, Component, ViewEncapsulation } from "@angular/core";
import {  StylesManager } from "survey-core";
import { defaultThemeName } from "survey-core/plugins/survey-default-theme";
import { TestComponent } from "./test.component";

@Component({
  selector: "test-default",
  templateUrl: "./test.component.html",
  styleUrls: ["./testdefault.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class TestDefaultComponent extends TestComponent {
  constructor(changeDetectorRef: ChangeDetectorRef) {
    super(changeDetectorRef);
    StylesManager.applyTheme(defaultThemeName);
  }
}