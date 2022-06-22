import { ChangeDetectorRef, Component, Input } from "@angular/core";
import { BaseAngular } from "../../base-angular";
import { AngularComponentFactory } from "../../component-factory";

@Component({
  selector: "sv-ng-list, '[sv-ng-list]'",
  templateUrl: "./list.component.html",
})
export class ListComponent extends BaseAngular {
    @Input() model: any;

    constructor(a: ChangeDetectorRef) {
      super(a);
      debugger;
    }
    getModel() {
      return this.model;
    }
    mousedown(event: Event) {
      event.preventDefault();
    }
    keydown(event: Event) {
      this.model.onKeyDown(event);
      return true;
    }
}

AngularComponentFactory.Instance.registerComponent("sv-list", ListComponent);