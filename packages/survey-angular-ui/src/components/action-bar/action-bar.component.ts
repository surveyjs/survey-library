import { Component, ElementRef, Input, ViewChild } from "@angular/core";
import { AngularComponentFactory } from "../../component-factory";
import { BaseAngular } from "../../base-angular";
import { Action, ActionContainer } from "survey-core";

@Component({
  selector: "sv-action-bar, sv-ng-action-bar",
  templateUrl: "./action-bar.component.html",
  styles: [":host { display: none }"]
})
export class ActionBarComponent extends BaseAngular<ActionContainer> {
  @Input() model!: ActionContainer;
  @Input() handleClick: any;
  @ViewChild("container") container!: ElementRef<HTMLDivElement>;
  getModel(): ActionContainer {
    return this.model;
  }
  trackActionBy(_: number, action: Action) {
    return action.renderedId;
  }
  get allowOnClick(): boolean {
    return this.handleClick !== undefined ? this.handleClick : true;
  }

  protected override onModelChanged() {
    super.onModelChanged();
    this.previousModel?.resetResponsivityManager();
  }
  private initResponsivityManager() {
    if (!!this.model.hasVisibleActions && this.container?.nativeElement) {
      this.model.initResponsivityManager(this.container.nativeElement);
    }
  }
  public override ngAfterViewChecked(): void {
    super.ngAfterViewChecked();
    this.initResponsivityManager();
  }
  public override afterUpdate(): void {
    super.afterUpdate();
    this.initResponsivityManager();
  }

  onClick(event: Event): void {
    if (this.allowOnClick) {
      event.stopPropagation();
    }
  }
  ngAfterViewInit() {
    this.initResponsivityManager();
  }
  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.model.resetResponsivityManager();
  }
}

AngularComponentFactory.Instance.registerComponent("sv-action-bar", ActionBarComponent);