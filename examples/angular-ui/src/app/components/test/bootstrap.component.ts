import {  ChangeDetectorRef, Component, ViewEncapsulation } from "@angular/core";
import {  StylesManager } from "survey-core";
import { defaultThemeName } from "survey-core/plugins/survey-default-theme";
import { TestComponent } from "./test.component";

@Component({
  selector: "test-bootstap",
  templateUrl: "./test.component.html",
  styleUrls: ["./bootstrap.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class TestBootstrapComponent extends TestComponent {
  constructor(changeDetectorRef: ChangeDetectorRef) {
    super(changeDetectorRef);
    StylesManager.applyTheme(defaultThemeName);
  }
}