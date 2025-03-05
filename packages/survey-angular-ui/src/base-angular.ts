import { ChangeDetectorRef, Component, DoCheck, OnChanges, OnDestroy, SimpleChange, ViewContainerRef } from "@angular/core";
import { ArrayChanges, Base, ISurvey, SurveyModel } from "survey-core";
import { EmbeddedViewContentComponent } from "./embedded-view-content.component";

@Component({
  template: ""
})
export abstract class BaseAngular<T extends Base = Base> extends EmbeddedViewContentComponent implements DoCheck, OnDestroy {
  constructor(protected changeDetectorRef: ChangeDetectorRef, viewContainerRef?: ViewContainerRef) {
    super(viewContainerRef);
  }
  protected get surveyModel(): ISurvey {
    return this.getModel().getSurvey();
  }
  protected abstract getModel(): T;
  protected previousModel?: T;
  private isModelSubsribed: boolean = false;

  public ngDoCheck(): void {
    if (this.previousModel !== this.getModel()) {
      this.unMakeBaseElementAngular(this.previousModel);
      this.makeBaseElementAngular(this.getModel());
      this.onModelChanged();
      this.previousModel = this.getModel();
    }
    this.setIsRendering(true);
  }

  protected onModelChanged() { }

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
  private isDestroyed: boolean = false;
  ngOnDestroy() {
    this.isDestroyed = true;
    this.unMakeBaseElementAngular(this.getModel());
    this.previousModel = undefined;
  }
  private makeBaseElementAngularCallback?: () => void;
  protected isBaseElementSubsribed(stateElement: Base) {
    return !!(<any>stateElement).__ngImplemented;
  }
  private getBaseElementCallbacks(stateElement: Base): Array<() => void> {
    (<any>stateElement).__ngSubscribers = (<any>stateElement).__ngSubscribers ?? [];
    return ((<any>stateElement).__ngSubscribers);
  }
  private makeBaseElementAngular(stateElement: T) {
    this.makeBaseElementAngularCallback = () => {
      this.isModelSubsribed = true;
      (<any>stateElement).__ngImplemented = true;
      stateElement.iteratePropertiesHash((hash, key) => {
        var val: any = hash[key];
        if (Array.isArray(val)) {
          var val: any = val;
          val["onArrayChanged"] = (arrayChanges: ArrayChanges) => {
            this.update(key);
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
          this.update(key);
        }
      };
      stateElement.enableOnElementRerenderedEvent();
    };
    if (!!stateElement) {
      if(!(<any>stateElement).__ngImplemented) {
        this.makeBaseElementAngularCallback();
      } else {
        this.getBaseElementCallbacks(stateElement).push(this.makeBaseElementAngularCallback);
      }
    }
  }
  private unMakeBaseElementAngular(stateElement?: Base) {
    if (!!stateElement) {
      if(this.isModelSubsribed) {
        this.isModelSubsribed = false;
        (<any>stateElement).__ngImplemented = false;
        stateElement.setPropertyValueCoreHandler = <any>undefined;
        stateElement.iteratePropertiesHash((hash, key) => {
          var val: any = hash[key];
          if (Array.isArray(val)) {
            var val: any = val;
            val["onArrayChanged"] = () => { };
          }
        });
        stateElement.disableOnElementRerenderedEvent();
        const callbacks = this.getBaseElementCallbacks(stateElement);
        const callback = callbacks.shift();
        callback && callback();
      }
      else if(this.makeBaseElementAngularCallback) {
        const callbacks = this.getBaseElementCallbacks(stateElement);
        const index = callbacks.indexOf(this.makeBaseElementAngularCallback);
        if(index > -1) {
          callbacks.splice(index, 1);
        }
      }
    }
  }

  protected update(key?: string): void {
    if (this.getIsRendering()) return;
    this.beforeUpdate();
    if (key && this.getPropertiesToUpdateSync().indexOf(key) > -1) {
      this.detectChanges();
      this.afterUpdate(true);
    } else {
      queueMicrotask(() => {
        if (!this.isDestroyed) {
          this.setIsRendering(true);
          this.detectChanges();
        }
        this.afterUpdate();
      });
    }
  }
  private getChangeDetectorRef() {
    return this.embeddedView ? this.embeddedView : this.changeDetectorRef;
  }
  protected getPropertiesToUpdateSync(): Array<string> {
    return [];
  }
  protected detectChanges() {
    this.getChangeDetectorRef().detectChanges();
  }

  protected getShouldReattachChangeDetector(): boolean {
    return true;
  }

  protected beforeUpdate(): void {
    this.setIsRendering(true);
  }
  protected afterUpdate(isSync: boolean = false): void {
    this.setIsRendering(false);
    const model = this.getModel();
    if(model && !this.isDestroyed) {
      model.afterRerender();
    }
  }
  ngAfterViewChecked(): void {
    this.setIsRendering(false);
  }
}