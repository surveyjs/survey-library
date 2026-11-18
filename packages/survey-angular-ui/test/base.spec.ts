import { Component, Input } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { BaseAngular, TrackingComponent } from "src/base-angular";
import { SurveyBaseProviders } from "src/component-depth";
import { Base, IPropertyArrayValueChangedEvent } from "survey-core";

class TestModel extends Base {
  public get text(): string {
    return this.getPropertyValue("text", "");
  }
  public set text(val: string) {
    this.setPropertyValue("text", val);
  }
  public get other(): string {
    return this.getPropertyValue("other", "");
  }
  public set other(val: string) {
    this.setPropertyValue("other", val);
  }
  public get items(): Array<string> {
    return this.getPropertyValue("items");
  }
  constructor() {
    super();
    this.createNewArray("items");
  }
}

// The update manager runs scheduled re-renders in a microtask
const flushUpdates = () => new Promise<void>(resolve => setTimeout(resolve));

const getCallbacks = (model: Base): Set<any> | undefined => (<any>model)["onPropertyValueCoreChanged"];

@Component({
  selector: "test-tracking",
  providers: SurveyBaseProviders,
  template: "<span class='text'>{{ model.text }}</span><span class='count'>{{ model.items.length }}</span>"
})
class TestTrackingComponent extends TrackingComponent {
  @Input() model!: TestModel;
  public log: Array<string> = [];
  public renderCount = 0;
  public readInAfterUpdate = false;
  public get currentDepth(): number {
    return this.depth;
  }
  protected override beforeUpdate(): void {
    this.renderCount++;
    this.log.push("before");
  }
  protected override afterUpdate(isSync: boolean = false): void {
    this.log.push("after:" + isSync);
    if (this.readInAfterUpdate) {
      this.model.other;
    }
  }
}

@Component({
  selector: "test-tracking-embedded",
  providers: SurveyBaseProviders,
  template: "<ng-template #template><span class='embedded-text'>{{ model.text }}</span></ng-template>"
})
class TestTrackingEmbeddedComponent extends TrackingComponent {
  @Input() model!: TestModel;
}

@Component({
  selector: "test-tracking-embedded-host",
  template: "<div class='host'><test-tracking-embedded [model]='model'></test-tracking-embedded></div>"
})
class TestTrackingEmbeddedHostComponent {
  @Input() model!: TestModel;
}

@Component({
  selector: "test-tracking-child",
  providers: SurveyBaseProviders,
  template: "<span class='child-text'>{{ model.text }}</span>"
})
class TestTrackingChildComponent extends TrackingComponent {
  @Input() model!: TestModel;
  @Input() checkedModel?: TestModel;
  @Input() log!: Array<string>;
  public get currentDepth(): number {
    return this.depth;
  }
  protected override beforeUpdate(): void {
    this.log?.push("child");
  }
  // Reads from lifecycle hooks must not subscribe the parent that renders this component
  protected override afterViewInit(): void {
    this.model.other;
  }
  protected override afterViewChecked(): void {
    this.checkedModel?.other;
  }
}

// Providers are not inherited from TrackingComponent: each component declares SurveyBaseProviders to get its own depth
@Component({
  selector: "test-tracking-parent",
  providers: SurveyBaseProviders,
  template: "<span class='parent-text'>{{ model.text }}</span><test-tracking-child [model]='childModel' [checkedModel]='checkedModel' [log]='log'></test-tracking-child>"
})
class TestTrackingParentComponent extends TrackingComponent {
  @Input() model!: TestModel;
  @Input() childModel!: TestModel;
  @Input() checkedModel?: TestModel;
  public log: Array<string> = [];
  public get currentDepth(): number {
    return this.depth;
  }
  protected override beforeUpdate(): void {
    this.log.push("parent");
  }
}

@Component({
  selector: "test-base-angular",
  providers: SurveyBaseProviders,
  template: "<span class='text'>{{ model.text }}</span><span class='other'>{{ model.other }}</span>"
})
class TestBaseAngularComponent extends BaseAngular<TestModel> {
  @Input() model!: TestModel;
  public syncProperties: Array<string> = [];
  public modelChangedCount = 0;
  public renderCount = 0;
  protected getModel(): TestModel {
    return this.model;
  }
  protected override onModelChanged(): void {
    this.modelChangedCount++;
  }
  protected override getPropertiesToUpdateSync(): Array<string> {
    return this.syncProperties;
  }
  protected override beforeUpdate(): void {
    this.renderCount++;
  }
  public callUpdate(model?: Base, options?: IPropertyArrayValueChangedEvent): void {
    this.update(model, options);
  }
}

describe("TrackingComponent", () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        TestTrackingComponent,
        TestTrackingEmbeddedComponent,
        TestTrackingEmbeddedHostComponent,
        TestTrackingChildComponent,
        TestTrackingParentComponent
      ],
    }).compileComponents();
  });

  it("renders on the first check and re-renders on a check only after its inputs change", () => {
    const fixture = TestBed.createComponent(TestTrackingComponent);
    const component = fixture.componentInstance;
    const model = new TestModel();
    model.text = "a";
    component.model = model;
    fixture.detectChanges();
    expect(component.renderCount).toBe(1);
    expect(component.log).toEqual(["before", "after:true"]);
    expect(fixture.nativeElement.querySelector(".text").textContent).toBe("a");

    fixture.detectChanges();
    expect(component.renderCount).toBe(1);

    // A change made outside the model properties is not seen until the inputs change
    const model2 = new TestModel();
    model2.text = "b";
    component.model = model2;
    fixture.detectChanges();
    expect(component.renderCount).toBe(1);
    expect(fixture.nativeElement.querySelector(".text").textContent).toBe("a");

    component.ngOnChanges();
    fixture.detectChanges();
    expect(component.renderCount).toBe(2);
    expect(fixture.nativeElement.querySelector(".text").textContent).toBe("b");
    fixture.destroy();
  });

  it("re-renders asynchronously when a property read during the render changes", async () => {
    const fixture = TestBed.createComponent(TestTrackingComponent);
    const component = fixture.componentInstance;
    const model = new TestModel();
    model.text = "a";
    component.model = model;
    fixture.detectChanges();
    component.log = [];

    model.text = "b";
    expect(component.renderCount).toBe(1);
    expect(fixture.nativeElement.querySelector(".text").textContent).toBe("a");
    await flushUpdates();
    expect(component.renderCount).toBe(2);
    expect(component.log).toEqual(["before", "after:false"]);
    expect(fixture.nativeElement.querySelector(".text").textContent).toBe("b");
    fixture.destroy();
  });

  it("re-renders when an array read during the render changes", async () => {
    const fixture = TestBed.createComponent(TestTrackingComponent);
    const component = fixture.componentInstance;
    const model = new TestModel();
    component.model = model;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector(".count").textContent).toBe("0");

    model.items.push("item1");
    await flushUpdates();
    expect(component.renderCount).toBe(2);
    expect(fixture.nativeElement.querySelector(".count").textContent).toBe("1");
    fixture.destroy();
  });

  it("does not re-render when a property not read during the render changes", async () => {
    const fixture = TestBed.createComponent(TestTrackingComponent);
    const component = fixture.componentInstance;
    const model = new TestModel();
    component.model = model;
    fixture.detectChanges();

    model.other = "b";
    await flushUpdates();
    expect(component.renderCount).toBe(1);
    fixture.destroy();
  });

  it("batches several changes into one re-render", async () => {
    const fixture = TestBed.createComponent(TestTrackingComponent);
    const component = fixture.componentInstance;
    const model = new TestModel();
    component.model = model;
    fixture.detectChanges();

    model.text = "b";
    model.text = "c";
    model.items.push("item1");
    await flushUpdates();
    expect(component.renderCount).toBe(2);
    expect(fixture.nativeElement.querySelector(".text").textContent).toBe("c");
    expect(fixture.nativeElement.querySelector(".count").textContent).toBe("1");
    fixture.destroy();
  });

  it("drops a scheduled re-render when it renders synchronously first", async () => {
    const fixture = TestBed.createComponent(TestTrackingComponent);
    const component = fixture.componentInstance;
    const model = new TestModel();
    component.model = model;
    fixture.detectChanges();

    model.text = "b";
    component.ngOnChanges();
    fixture.detectChanges();
    expect(component.renderCount).toBe(2);
    expect(fixture.nativeElement.querySelector(".text").textContent).toBe("b");
    await flushUpdates();
    expect(component.renderCount).toBe(2);
    fixture.destroy();
  });

  it("does not subscribe to properties read in afterUpdate", async () => {
    const fixture = TestBed.createComponent(TestTrackingComponent);
    const component = fixture.componentInstance;
    const model = new TestModel();
    component.model = model;
    component.readInAfterUpdate = true;
    fixture.detectChanges();

    model.other = "b";
    await flushUpdates();
    expect(component.renderCount).toBe(1);
    fixture.destroy();
  });

  it("subscribes to the models read during the last render only", async () => {
    const fixture = TestBed.createComponent(TestTrackingComponent);
    const component = fixture.componentInstance;
    const model1 = new TestModel();
    const model2 = new TestModel();
    component.model = model1;
    fixture.detectChanges();
    expect(getCallbacks(model1)?.size).toBe(1);
    expect(getCallbacks(model2)).toBeUndefined();

    component.model = model2;
    component.ngOnChanges();
    fixture.detectChanges();
    expect(getCallbacks(model1)).toBeUndefined();
    expect(getCallbacks(model2)?.size).toBe(1);

    model1.text = "b";
    await flushUpdates();
    expect(component.renderCount).toBe(2);
    model2.text = "b";
    await flushUpdates();
    expect(component.renderCount).toBe(3);
    fixture.destroy();
  });

  it("subscribes every component rendering the same model and unsubscribes it on destroy", () => {
    const model = new TestModel();
    const fixtures = [1, 2, 3].map(() => {
      const fixture = TestBed.createComponent(TestTrackingComponent);
      fixture.componentInstance.model = model;
      fixture.detectChanges();
      return fixture;
    });
    expect(getCallbacks(model)?.size).toBe(3);
    fixtures[1].destroy();
    expect(getCallbacks(model)?.size).toBe(2);
    fixtures[0].destroy();
    expect(getCallbacks(model)?.size).toBe(1);
    fixtures[2].destroy();
    expect(getCallbacks(model)).toBeUndefined();
    expect((<any>model)["onArrayChanged"]).toBeUndefined();
  });

  it("does not re-render after destroy, even with a scheduled update", async () => {
    const fixture = TestBed.createComponent(TestTrackingComponent);
    const component = fixture.componentInstance;
    const model = new TestModel();
    component.model = model;
    fixture.detectChanges();

    model.text = "b";
    fixture.destroy();
    await flushUpdates();
    expect(component.renderCount).toBe(1);

    model.text = "c";
    await flushUpdates();
    expect(component.renderCount).toBe(1);
  });

  it("re-renders the content of the embedded template", async () => {
    const fixture = TestBed.createComponent(TestTrackingEmbeddedHostComponent);
    const model = new TestModel();
    model.text = "a";
    fixture.componentInstance.model = model;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector(".embedded-text").textContent).toBe("a");

    model.text = "b";
    await flushUpdates();
    expect(fixture.nativeElement.querySelector(".embedded-text").textContent).toBe("b");

    // The embedded view is not refreshed by the parent's change detection
    (<any>model).setPropertyValueDirectly("text", "c");
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector(".embedded-text").textContent).toBe("b");
    fixture.destroy();
  });

  it("sets a depth for nested components and uses it as the update priority", () => {
    const fixture = TestBed.createComponent(TestTrackingParentComponent);
    const parent = fixture.componentInstance;
    parent.model = new TestModel();
    parent.childModel = new TestModel();
    fixture.detectChanges();
    const child: TestTrackingChildComponent = fixture.debugElement.query(el => el.componentInstance instanceof TestTrackingChildComponent).componentInstance;
    expect(parent.currentDepth).toBe(0);
    expect(child.currentDepth).toBe(1);
    expect((<any>parent)["updateTask"].priority).toBe(0);
    expect((<any>child)["updateTask"].priority).toBe(1);
    fixture.destroy();
  });

  it("re-renders a parent before its child", async () => {
    const fixture = TestBed.createComponent(TestTrackingParentComponent);
    const parent = fixture.componentInstance;
    const model = new TestModel();
    const childModel = new TestModel();
    parent.model = model;
    parent.childModel = childModel;
    fixture.detectChanges();
    expect(parent.log).toEqual(["parent", "child"]);

    parent.log.splice(0);
    childModel.text = "b";
    model.text = "b";
    await flushUpdates();
    expect(parent.log).toEqual(["parent", "child"]);
    expect(fixture.nativeElement.querySelector(".parent-text").textContent).toBe("b");
    expect(fixture.nativeElement.querySelector(".child-text").textContent).toBe("b");
    fixture.destroy();
  });

  it("re-renders only the child when only the child's model changes", async () => {
    const fixture = TestBed.createComponent(TestTrackingParentComponent);
    const parent = fixture.componentInstance;
    const childModel = new TestModel();
    parent.model = new TestModel();
    parent.childModel = childModel;
    fixture.detectChanges();

    parent.log.splice(0);
    childModel.text = "b";
    await flushUpdates();
    expect(parent.log).toEqual(["child"]);
    expect(fixture.nativeElement.querySelector(".child-text").textContent).toBe("b");
    fixture.destroy();
  });

  it("does not track property reads in a child's afterViewInit", async () => {
    const fixture = TestBed.createComponent(TestTrackingParentComponent);
    const parent = fixture.componentInstance;
    const childModel = new TestModel();
    parent.model = new TestModel();
    parent.childModel = childModel;
    fixture.detectChanges();

    parent.log.splice(0);
    childModel.other = "b";
    await flushUpdates();
    expect(parent.log).toEqual([]);
    fixture.destroy();
  });

  it("does not track property reads in a child's afterViewChecked", async () => {
    const fixture = TestBed.createComponent(TestTrackingParentComponent);
    const parent = fixture.componentInstance;
    const checkedModel = new TestModel();
    parent.model = new TestModel();
    parent.childModel = new TestModel();
    parent.checkedModel = checkedModel;
    fixture.detectChanges();

    parent.log.splice(0);
    checkedModel.other = "b";
    await flushUpdates();
    expect(parent.log).toEqual([]);
    fixture.destroy();
  });
});

describe("BaseAngular", () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestBaseAngularComponent],
    }).compileComponents();
  });

  it("calls onModelChanged when the model changes", () => {
    const fixture = TestBed.createComponent(TestBaseAngularComponent);
    const component = fixture.componentInstance;
    component.model = new TestModel();
    fixture.detectChanges();
    expect(component.modelChangedCount).toBe(1);

    fixture.detectChanges();
    expect(component.modelChangedCount).toBe(1);

    component.model = new TestModel();
    fixture.detectChanges();
    expect(component.modelChangedCount).toBe(2);
    fixture.destroy();
  });

  it("enables the onElementRerendered event for the rendered model only", () => {
    const fixture = TestBed.createComponent(TestBaseAngularComponent);
    const component = fixture.componentInstance;
    const model1 = new TestModel();
    const model2 = new TestModel();
    component.model = model1;
    fixture.detectChanges();
    expect(model1.onElementRerenderedEventEnabled).toBe(true);
    expect(model2.onElementRerenderedEventEnabled).toBe(false);

    component.model = model2;
    fixture.detectChanges();
    expect(model1.onElementRerenderedEventEnabled).toBe(false);
    expect(model2.onElementRerenderedEventEnabled).toBe(true);

    fixture.destroy();
    expect(model2.onElementRerenderedEventEnabled).toBe(false);
    expect(model2.onElementRerenderedEventLock).toBe(0);
  });

  it("keeps the onElementRerendered event enabled while another component renders the model", () => {
    const model = new TestModel();
    const fixture1 = TestBed.createComponent(TestBaseAngularComponent);
    const fixture2 = TestBed.createComponent(TestBaseAngularComponent);
    fixture1.componentInstance.model = model;
    fixture1.detectChanges();
    fixture2.componentInstance.model = model;
    fixture2.detectChanges();
    expect(model.onElementRerenderedEventLock).toBe(2);
    fixture1.destroy();
    expect(model.onElementRerenderedEventEnabled).toBe(true);
    fixture2.destroy();
    expect(model.onElementRerenderedEventEnabled).toBe(false);
  });

  it("cancels the onElementRerendered event when the model is not rendered anymore", () => {
    const fixture = TestBed.createComponent(TestBaseAngularComponent);
    const model = new TestModel();
    fixture.componentInstance.model = model;
    fixture.detectChanges();
    const log: Array<boolean> = [];
    model.onElementRerendered.add((_: Base, options: any) => log.push(options.isCancel));
    fixture.destroy();
    expect(log).toEqual([true]);
  });

  it("re-renders asynchronously and fires onElementRerendered after the render", async () => {
    const fixture = TestBed.createComponent(TestBaseAngularComponent);
    const component = fixture.componentInstance;
    const model = new TestModel();
    component.model = model;
    fixture.detectChanges();
    const log: Array<string> = [];
    model.onElementRerendered.add((_: Base, options: any) => {
      log.push("rerendered:" + options.isCancel + ":" + fixture.nativeElement.querySelector(".text").textContent);
    });

    model.text = "b";
    expect(component.renderCount).toBe(1);
    expect(log).toEqual([]);
    await flushUpdates();
    expect(component.renderCount).toBe(2);
    expect(log).toEqual(["rerendered:false:b"]);
    fixture.destroy();
  });

  it("fires onElementRerendered when the scheduled update is rendered synchronously first", async () => {
    const fixture = TestBed.createComponent(TestBaseAngularComponent);
    const component = fixture.componentInstance;
    const model = new TestModel();
    component.model = model;
    fixture.detectChanges();
    const log: Array<boolean> = [];
    model.onElementRerendered.add((_: Base, options: any) => log.push(options.isCancel));

    model.text = "b";
    component.ngOnChanges();
    fixture.detectChanges();
    expect(component.renderCount).toBe(2);
    await flushUpdates();
    expect(component.renderCount).toBe(2);
    expect(log).toEqual([false]);
    fixture.destroy();
  });

  it("re-renders synchronously when a property from getPropertiesToUpdateSync changes", async () => {
    const fixture = TestBed.createComponent(TestBaseAngularComponent);
    const component = fixture.componentInstance;
    const model = new TestModel();
    component.model = model;
    component.syncProperties = ["text"];
    fixture.detectChanges();
    const log: Array<string> = [];
    model.onElementRerendered.add((_: Base, options: any) => {
      log.push("rerendered:" + options.isCancel + ":" + fixture.nativeElement.querySelector(".text").textContent);
    });

    model.text = "b";
    expect(component.renderCount).toBe(2);
    expect(fixture.nativeElement.querySelector(".text").textContent).toBe("b");
    expect(log).toEqual(["rerendered:false:b"]);

    model.other = "c";
    expect(component.renderCount).toBe(2);
    await flushUpdates();
    expect(component.renderCount).toBe(3);
    expect(fixture.nativeElement.querySelector(".other").textContent).toBe("c");
    expect(log).toEqual(["rerendered:false:b", "rerendered:false:b"]);
    fixture.destroy();
  });

  it("re-renders asynchronously when a sync property changes on another model", async () => {
    const fixture = TestBed.createComponent(TestBaseAngularComponent);
    const component = fixture.componentInstance;
    const model = new TestModel();
    const anotherModel = new TestModel();
    component.model = model;
    component.syncProperties = ["text"];
    fixture.detectChanges();

    component.callUpdate(anotherModel, <any>{ name: "text" });
    expect(component.renderCount).toBe(1);
    await flushUpdates();
    expect(component.renderCount).toBe(2);
    fixture.destroy();
  });

  it("does not re-render synchronously while an update is scheduled", async () => {
    const fixture = TestBed.createComponent(TestBaseAngularComponent);
    const component = fixture.componentInstance;
    const model = new TestModel();
    component.model = model;
    component.syncProperties = ["text"];
    fixture.detectChanges();

    model.other = "c";
    model.text = "b";
    expect(component.renderCount).toBe(1);
    await flushUpdates();
    expect(component.renderCount).toBe(2);
    expect(fixture.nativeElement.querySelector(".text").textContent).toBe("b");
    expect(fixture.nativeElement.querySelector(".other").textContent).toBe("c");
    fixture.destroy();
  });
});
