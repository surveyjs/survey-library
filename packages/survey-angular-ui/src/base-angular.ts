import { ChangeDetectorRef, Component, DoCheck, Inject, OnChanges, OnDestroy, Optional, SimpleChanges, ViewContainerRef } from "@angular/core";
import { Base, IPropertyArrayValueChangedEvent, ISurvey } from "survey-core";
import { EmbeddedViewContentComponent } from "./embedded-view-content.component";
import { IPropertyAccessTracker, PropertyAccessTracker } from "survey-core";
import { getUpdateManager, IUpdateTask } from "./update-manager";
import { COMPONENT_DEPTH, SurveyBaseProviders } from "./component-depth";

const wrappedHookKey = "__surveyRunWithUpdateAccess";
function wrapAfterViewInitHooks(instance: any): void {
  const resolvedHook = instance.ngAfterViewInit;
  if (typeof resolvedHook !== "function" || resolvedHook[wrappedHookKey]) return;
  let proto = Object.getPrototypeOf(instance);
  while(!!proto && proto !== Object.prototype) {
    if (Object.prototype.hasOwnProperty.call(proto, "ngAfterViewInit")) {
      const hook = proto.ngAfterViewInit;
      if (typeof hook === "function" && !hook[wrappedHookKey]) {
        const wrapped = function (this: any, ...args: Array<any>) {
          return Base.runWithUpdateAccess(() => hook.apply(this, args));
        };
        (<any>wrapped)[wrappedHookKey] = true;
        proto.ngAfterViewInit = wrapped;
      }
    }
    proto = Object.getPrototypeOf(proto);
  }
}

@Component({
  template: "",
  providers: SurveyBaseProviders
})
export abstract class BaseAngular<T extends Base = Base> extends EmbeddedViewContentComponent implements DoCheck, OnDestroy, OnChanges {
  protected readonly depth: number;
  constructor(protected changeDetectorRef: ChangeDetectorRef, viewContainerRef?: ViewContainerRef, @Optional() @Inject(COMPONENT_DEPTH) depth?: number | null) {
    super(viewContainerRef);
    wrapAfterViewInitHooks(this);
    this.changeDetectorRef.detach();
    this.depth = depth ?? 0;
    this.updateTask = {
      priority: this.depth,
      callback: () => this.detectChanges(false)
    };
  }
  override ngOnInit() {
    super.ngOnInit();
    this.embeddedView?.detach();
  }
  protected get surveyModel(): ISurvey {
    return this.getModel().getSurvey();
  }
  protected abstract getModel(): T;
  protected previousModel?: T;
  private propertyAccessTracker: IPropertyAccessTracker = new PropertyAccessTracker((model, options) => this.update(model, options));
  private hasInputChanges: boolean = false;
  ngOnChanges(changes?: SimpleChanges): void {
    this.hasInputChanges = true;
  }
  public override ngDoCheck(): void {
    this.syncModel();
    if (this.hasInputChanges) {
      this.hasInputChanges = false;
      this.detectChanges();
    }
  }
  private syncModel(): void {
    const model = this.getModel();
    if (this.previousModel === model) return;
    this.previousModel?.disableOnElementRerenderedEvent();
    this.getModel()?.enableOnElementRerenderedEvent();
    this.onModelChanged();
    this.previousModel = model;
  }
  protected onModelChanged() { }
  private isDestroyed: boolean = false;
  ngOnDestroy() {
    this.isDestroyed = true;
    this.propertyAccessTracker.unsubscribe();
    this.getModel()?.disableOnElementRerenderedEvent();
    this.previousModel = undefined;
  }
  protected isBaseElementSubsribed(stateElement: Base) {
    return ((<any>stateElement).__ngImplementedCount ?? 0) > 0;
  }
  private updateTask: IUpdateTask;
  protected update(model?: Base, options?: IPropertyArrayValueChangedEvent): void {
    const manger = getUpdateManager();
    if (manger.hasTask(this.updateTask)) return;
    const key = options?.name;
    if (model === this.getModel() && key && this.getPropertiesToUpdateSync().indexOf(key) > -1) {
      this.detectChanges();
      this.getModel()?.afterRerender();
    } else {
      this.updateTask.after = this.getModel()?.afterRerenderCallback;
      getUpdateManager().addTask(this.updateTask);
    }
  }
  protected getPropertiesToUpdateSync(): Array<string> {
    return [];
  }
  protected detectChanges(isSync: boolean = true) {
    if (this.isDestroyed) return;
    this.beforeUpdate();
    this.propertyAccessTracker.startTracking();
    this.embeddedView?.detectChanges();
    this.changeDetectorRef.detectChanges();
    this.propertyAccessTracker.stopTracking();
    this.propertyAccessTracker.subscribe();
    Base.runWithUpdateAccess(() => {
      this.afterUpdate(isSync);
    });
  }
  protected beforeUpdate(): void {
  }
  protected afterUpdate(isSync: boolean = false): void {}
}