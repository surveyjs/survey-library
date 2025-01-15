import { ChangeDetectorRef, Component, ViewEncapsulation } from "@angular/core";
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
  }
}