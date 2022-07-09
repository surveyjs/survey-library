import { ChangeDetectorRef, Component, DoCheck, OnChanges, OnDestroy, SimpleChange, ViewContainerRef } from "@angular/core";
import { ArrayChanges, Base } from "survey-core";
import { NoRootComponent } from "./no-root-component";

@Component({
  template: ""
})
export abstract class BaseAngular<T extends Base = Base> extends NoRootComponent implements DoCheck, OnDestroy {
  constructor(protected changeDetectorRef: ChangeDetectorRef, viewContainerRef?: ViewContainerRef) {
    super(viewContainerRef);
  }

  protected abstract getModel(): T;
  protected previousModel?: T;
  public ngDoCheck(): void {
    if(this.previousModel !== this.getModel()) {
      this.makeBaseElementAngular(this.getModel());
      this.previousModel = this.getModel();
      this.onModelChanged();
    }
    this.beforeUpdate();
  }

  protected onModelChanged() {}

  private setIsRendering(val: boolean) {
    const model = this.getModel();
    if (!!model) {
      (<any>model).isRendering = val;
    }
  }
  private getIsRendering() {
    const model = this.getModel();
    return !!model && !!(<any>model).isRendering;
  }

  ngOnDestroy() {
    this.unMakeBaseElementAngular(this.getModel());
  }

  private makeBaseElementAngular(stateElement: Base) {
    if(!!stateElement && !(<any>stateElement)["__angular__implemented"]) {
      (<any>stateElement)["__angular__implemented"] = true;
      stateElement.iteratePropertiesHash((hash, key) => {
        var val: any = hash[key];
        if (Array.isArray(val)) {
          var val: any = val;
          val["onArrayChanged"] = (arrayChanges: ArrayChanges) => {
            this.detectChanges();
          };
        }
      });
      stateElement.setPropertyValueCoreHandler = (
        hash: any,
        key: string,
        val: any
      ) => {
        if (hash[key] !== val) {
          hash[key] = val;
          this.detectChanges();
        }
      };
    }
  }
  private unMakeBaseElementAngular(stateElement: Base) {
    (<any>stateElement)["__angular__implemented"] = false;
    stateElement.setPropertyValueCoreHandler = <any>undefined;
    stateElement.iteratePropertiesHash((hash, key) => {
      var val: any = hash[key];
      if (Array.isArray(val)) {
        var val: any = val;
        val["onArrayChanged"] = () => {};
      }
    });
  }

  protected detectChanges() {
    if (this.getIsRendering()) return;
    this.beforeUpdate();
    if(!!this.embeddedView) {
      this.embeddedView.detectChanges();
    } else {
      this.changeDetectorRef.detectChanges();
    }
    this.afterUpdate();
  }

  protected beforeUpdate(): void {
    this.setIsRendering(true);
  }
  protected afterUpdate(): void {
    this.setIsRendering(false);
  }
  ngAfterViewChecked(): void {
    this.afterUpdate();
  }
}