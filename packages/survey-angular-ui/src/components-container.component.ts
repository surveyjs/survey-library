import { Component, Input, TemplateRef, ViewContainerRef, OnChanges, OnInit, SimpleChanges, ChangeDetectorRef } from "@angular/core";
import { SurveyModel } from "survey-core";
import { AngularComponentFactory } from "./component-factory";

@Component({
  selector: "sv-components-container, [sv-components-container], sv-ng-components-container",
  templateUrl: "./components-container.component.html"
  })
export class ComponentsContainerComponent implements OnChanges, OnInit {
  @Input() survey!: SurveyModel;
  @Input() container!: string;
  public components: Array<any> = [];
  private setComponents() {
    this.components = this.survey.getContainerContent(this.container as any);
  }
  ngOnInit(): void {
    this.setComponents();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.setComponents();
  }
}
AngularComponentFactory.Instance.registerComponent("sv-components-container", ComponentsContainerComponent);