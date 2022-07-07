import {  Component, ViewEncapsulation } from "@angular/core";
import { TestComponent } from "./test.component";

@Component({
  selector: "test-defaultV2",
  templateUrl: "./test.component.html",
  styleUrls: ["./testdefaultV2.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class TestDefaultV2Component extends TestComponent {
}