import { Component, ElementRef, Input, ViewChild } from "@angular/core";
import { BaseAngular } from "../../base-angular";
import { AngularComponentFactory } from "../../component-factory";
import { Action } from "survey-core";
import { SurveyBaseProviders } from "../../component-depth";

@Component({
  providers: SurveyBaseProviders,
  selector: "sv-action-bar-item",
  templateUrl: "./action-bar-item.component.html",
  styleUrls: ["../../hide-host.scss"]
})
export class ActionBarItemComponent extends BaseAngular {
  @Input() model?: Action;
  @ViewChild("container") containerRef?: ElementRef<HTMLElement>;

  getModel() {
    return this.model as Action;
  }
  protected override afterViewInit(): void {
    this.model?.setInputElement(this.containerRef?.nativeElement as HTMLElement);
  }
  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.model?.setInputElement(undefined as any);
  }
}

AngularComponentFactory.Instance.registerComponent("sv-action-bar-item", ActionBarItemComponent);