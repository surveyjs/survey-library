import { Directive, ElementRef, Input, OnChanges, SimpleChanges, ViewContainerRef } from "@angular/core";
import { AngularComponentFactory } from "../component-factory";

interface IDynamicComponent {
  name: string;
  data?: any;
  default?: string;
}

@Directive({
  selector: "[component]"
})

export class DynamicComponentDirective implements OnChanges {
  constructor(private containerRef: ViewContainerRef) { }
  @Input() component!: IDynamicComponent;
  private componentInstance: any;
  ngOnChanges(changes: SimpleChanges): void {
    const componentChanges = changes["component"];
    if(componentChanges.currentValue.name !== componentChanges.previousValue?.name ||
      (componentChanges.currentValue.name === undefined && componentChanges.previousValue === undefined && !this.componentInstance)) {
      this.createComponent();
    } else {
      this.updateComponentData();
    }
  }
  createComponent(): void {
    this.containerRef.clear();
    if(AngularComponentFactory.Instance.isComponentRegistered(this.component.name)) {
      this.componentInstance = AngularComponentFactory.Instance.create(this.containerRef, this.component.name).instance;
    } else if (this.component.default) {
      this.componentInstance = AngularComponentFactory.Instance.create(this.containerRef, this.component.default).instance;
    }
    if(!this.componentInstance) {
      throw new Error(`Can't create component with name: ${this.component.name} and default: ${this.component.default}`);
    }
    this.updateComponentData();
  }
  updateComponentData(): void {
    if(!this.componentInstance) return;
    const data = this.component.data;
    Object.keys(data).forEach((key) => {
      this.componentInstance[key] = data[key];
    });
  }
}