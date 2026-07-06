import { AfterViewInit, Component, ElementRef, Input, ViewChild } from "@angular/core";
import { PanelModel } from "survey-core";
import { BaseAngular } from "./base-angular";
import { AngularComponentFactory } from "./component-factory";
@Component({
  selector: "sv-ng-panel, '[sv-ng-panel]'",
  templateUrl: "./panel.component.html",
})
export class PanelComponent extends BaseAngular<PanelModel> implements AfterViewInit {
  @Input() model!: PanelModel;
  @ViewChild("panelContainer", { static: false, read: ElementRef }) panelContainerRef!: ElementRef<HTMLDivElement>;
  private readonly panelPaddingHorizontal = "var(--sd-base-padding, var(--sjs2-spacing-x500))";
  protected getModel(): PanelModel {
    return this.model;
  }
  ngAfterViewInit(): void {
    if (!!this.panelContainerRef?.nativeElement) {
      this.model.afterRender(this.panelContainerRef.nativeElement);
    }
  }
  trackRowBy = (_: any, row: any) => {
    return row.id;
  };
  public get canRender() {
    return this.model && this.model.survey && this.model.getIsContentVisible();
  }
  public get panelContentStyle(): Record<string, string> {
    const hasInnerPadding = !!this.model?.innerPaddingLeft;
    return hasInnerPadding ? {
      "padding-inline-start": `calc(${this.panelPaddingHorizontal} + ${this.model.innerPaddingLeft})`,
    } : {};
  }
}
AngularComponentFactory.Instance.registerComponent("panel", PanelComponent);