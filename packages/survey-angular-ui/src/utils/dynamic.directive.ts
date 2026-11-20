import { Directive, Input, NgModuleRef, OnChanges, SimpleChanges, TemplateRef, ViewContainerRef, Injector, SimpleChange } from "@angular/core";
import { AngularComponentFactory } from "../component-factory";

interface IDynamicComponent {
  name: string;
  data?: any;
  default?: string;
  key?: any;
}

@Directive({
  selector: "[component]"
})

export class DynamicComponentDirective implements OnChanges {
  constructor(private containerRef: ViewContainerRef, private templateRef: TemplateRef<unknown>, private injector: Injector) { }
  @Input() component!: IDynamicComponent;
  private componentInstance: any;
  ngOnChanges(changes: SimpleChanges): void {
    const componentChanges = changes["component"];
    if (componentChanges.currentValue.name !== componentChanges.previousValue?.name ||
      (!!componentChanges.previousValue && componentChanges.currentValue.key !== componentChanges.previousValue.key) ||
      (componentChanges.currentValue.name === undefined && componentChanges.previousValue === undefined && !this.componentInstance)) {
      this.createComponent();
    } else {
      this.updateComponentData();
    }
  }
  createComponent(): void {
    this.containerRef.clear();
    const componentName = AngularComponentFactory.Instance.isComponentRegistered(this.component.name) ? this.component.name : this.component.default;
    if (componentName) {
      const resolver = (this.injector.get(NgModuleRef) as any).componentFactoryResolver;
      this.componentInstance = AngularComponentFactory.Instance.create(this.containerRef, componentName, resolver).instance;
    }
    if (!this.componentInstance) {
      throw new Error(`Can't create component with name: ${this.component.name} and default: ${this.component.default}`);
    } else {
      this.componentInstance.contentTempl = this.templateRef;
    }
    this.updateComponentData();
  }
  updateComponentData(): void {
    const data = this.component.data;
    const changes: SimpleChanges = {};
    for (const key in data) {
      if (this.componentInstance[key] !== data[key]) {
        changes[key] = new SimpleChange(this.componentInstance[key], data[key], this.componentInstance[key] === undefined);
      }
      this.componentInstance[key] = data[key];
    }
    if (Object.keys(changes).length > 0 && this.componentInstance["ngOnChanges"]) {
      this.componentInstance.ngOnChanges(changes);
    }
  }
}