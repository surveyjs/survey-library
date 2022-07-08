import { ChangeDetectorRef, Component, HostBinding, Input, SkipSelf, ViewChild, ViewContainerRef } from "@angular/core";
import { BaseAngular } from "../../base-angular";
import { AngularComponentFactory } from "../../component-factory";
import { ActionBarItemComponent } from "./action-bar-item.component";

@Component({
  selector: "'[sv-ng-action]'",
  templateUrl: "./action.component.html",
  styleUrls: ["./action.component.scss"],
})
export class ActionComponent extends BaseAngular {
  @Input() model: any;
  @ViewChild("actionContent", { read: ViewContainerRef, static: true }) actionContent!: ViewContainerRef;

  //todo need to remove skip selfs - runs change detection for whole action bar
  //but fixies host bindings updates in some cases
  constructor(@SkipSelf() changeDetectorRef: ChangeDetectorRef) {
    super(changeDetectorRef);
  }

  getModel() {
    return this.model;
  }
  override ngOnInit(): void {
    let componentRef = AngularComponentFactory.Instance.create(this.actionContent, this.model.component || "sv-action-bar-item");
    if (!componentRef) {
      componentRef = this.actionContent.createComponent(ActionBarItemComponent) as any;
    }
    (componentRef.instance as any).model = this.model;
  }
  @HostBinding("class") get class(): string {
    return this.model.getActionRootCss();
  }
  @HostBinding("id") get id(): string {
    return this.model.id;
  }
}

AngularComponentFactory.Instance.registerComponent("sv-action", ActionComponent);