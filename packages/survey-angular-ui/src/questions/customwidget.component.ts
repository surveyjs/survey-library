import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from "@angular/core";
import { AngularComponentFactory } from "../component-factory";
import { Question } from "survey-core";

@Component(
  {
    templateUrl: "./customwidget.component.html",
    selector: "sv-ng-custom-widget"
  }
)
export class CustomWidgetComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input() css: any;
  @Input() model!: Question;

  @ViewChild("content") container!: ElementRef<HTMLDivElement>;

  get hasDefaultRender(): boolean {
    return this.model.customWidget.isDefaultRender || this.hasAngularComponent;
  }
  get hasHtml(): boolean {
    return this.model.customWidget.htmlTemplate ? true : false;
  }
  get customHtml(): string {
    return this.model.customWidget.htmlTemplate;
  }
  get hasAngularComponent(): boolean {
    return AngularComponentFactory.Instance.isComponentRegistered(this.model.customWidget.name);
  }
  get componentName(): string {
    if (this.hasAngularComponent) return this.model.customWidget.name;
    return this.model.getTemplate() + "-question";
  }
  ngAfterViewInit(): void {
    this.model.customWidget.afterRender(this.model, this.container.nativeElement);
  }
  ngOnChanges(simpleChanges: SimpleChanges) {
    if(simpleChanges["model"].previousValue !== undefined && simpleChanges["model"].currentValue !== undefined) {
      this.model.customWidget.afterRender(this.model, this.container.nativeElement);
    }
  }
  ngOnDestroy(): void {
    this.model.customWidget.willUnmount(this.model, this.container.nativeElement);
  }

}

AngularComponentFactory.Instance.registerComponent("survey-customwidget", CustomWidgetComponent);
