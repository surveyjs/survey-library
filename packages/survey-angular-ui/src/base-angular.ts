import { ChangeDetectorRef, Component, DoCheck, OnChanges, OnDestroy, SimpleChange } from "@angular/core";
import { ArrayChanges, Base } from "survey-core";

@Component({
  template: ""
})
export abstract class BaseAngular<T extends Base = Base> implements DoCheck, OnDestroy {
  constructor(protected changeDetectorRef: ChangeDetectorRef) {}

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
    stateElement.iteratePropertiesHash((hash, key) => {
      var val: any = hash[key];
      if (Array.isArray(val)) {
        var val: any = val;
        val["onArrayChanged"] = (arrayChanges: ArrayChanges) => {
          if (this.getIsRendering()) return;
          this.beforeUpdate();
          this.changeDetectorRef.detectChanges();
          this.afterUpdate();
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
        if (this.getIsRendering()) return;
        this.beforeUpdate();
        this.changeDetectorRef.detectChanges();
        this.afterUpdate();
      }
    };
  }
  private unMakeBaseElementAngular(stateElement: Base) {
    stateElement.setPropertyValueCoreHandler = <any>undefined;
    stateElement.iteratePropertiesHash((hash, key) => {
      var val: any = hash[key];
      if (Array.isArray(val)) {
        var val: any = val;
        val["onArrayChanged"] = () => {};
      }
    });
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