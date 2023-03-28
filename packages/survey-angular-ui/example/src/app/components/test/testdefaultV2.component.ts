import { ChangeDetectorRef, Component, ViewEncapsulation } from "@angular/core";
import { StylesManager } from "survey-core";
import { TestComponent } from "./test.component";

@Component({
  selector: "test-defaultV2",
  templateUrl: "./test.component.html",
  styleUrls: ["./testdefaultV2.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class TestDefaultV2Component extends TestComponent {
  constructor(changeDetectorRef: ChangeDetectorRef) {
    super(changeDetectorRef);
    StylesManager.applyTheme("defaultV2");
  }
}