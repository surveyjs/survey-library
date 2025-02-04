import { AfterViewInit, Component, ElementRef, Input, ViewChild, ViewContainerRef } from "@angular/core";
import { BaseAngular } from "../../base-angular";
import { AngularComponentFactory } from "../../component-factory";
import { Action } from "survey-core";

@Component({
  selector: "sv-ng-action",
  templateUrl: "./action.component.html",
  styles: [":host { display: none; }"],
})
export class ActionComponent extends BaseAngular implements AfterViewInit {
  @Input() model!: Action;
  @ViewChild("container") containerRef!: ElementRef<HTMLElement>;
  getModel() {
    return this.model;
  }
  public get id() {
    return this.model.id || '';
  }
  public override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.model.updateModeCallback = undefined as any;
  }
  public ngAfterViewInit(): void {
    this.model.updateModeCallback = (mode, callback) => {
      this.model.mode = mode;
      queueMicrotask(() => {
        callback(mode, this.containerRef?.nativeElement)
      });
    }
    this.model.afterRender();
  }
}

AngularComponentFactory.Instance.registerComponent("sv-action", ActionComponent);