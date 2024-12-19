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
  @ViewChild("container", { read: ElementRef, static: false }) containerRef!: ElementRef<HTMLElement>;
  getModel() {
    return this.model;
  }
  protected override getPropertiesToUpdateSync(): string[] {
    return ["mode"];
  }
  public get id() {
    return this.model.id || '';
  }
  public override ngOnDestroy(): void {
    this.model.updateModeCallback = undefined as any;
  }
  public ngAfterViewInit(): void {
    this.model.updateModeCallback = (mode, callback) => {
      this.model.mode = mode;
      callback(mode, this.containerRef?.nativeElement)
    }
    this.model.afterRender();
  }
}

AngularComponentFactory.Instance.registerComponent("sv-action", ActionComponent);