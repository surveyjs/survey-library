import {  Component, ViewEncapsulation } from "@angular/core";
import { StylesManager } from "survey-core";
import { TestComponent } from "./test.component";

StylesManager.applyTheme("modern");
@Component({
  selector: "test-modern",
  templateUrl: "./test.component.html",
  styleUrls: ["./testmodern.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class TestModernComponent extends TestComponent {
}