import { Component, Input } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { BaseAngular } from "src/base-angular";
import { SurveyContentComponent } from "src/survey-content.component";
import { Base, QuestionTextModel } from "survey-core";

@Component({
  selector: "sv-ng-test-base",
  template: ""
  })
class TestBase extends BaseAngular<QuestionTextModel> {
  @Input() model!: QuestionTextModel;
  public shouldReattachChangeDetector: boolean = true;
  protected override getShouldReattachChangeDetector(): boolean {
    return this.shouldReattachChangeDetector;
  }
  getModel() {
    return this.model;
  }
}

describe("base tests", () => {
  it("check base makeBaseElementAngular behavior", () => {
    const fixture = TestBed.createComponent(TestBase);
    const q = new QuestionTextModel("q1");
    const q2 = new QuestionTextModel("q1");
    const component = fixture.componentInstance;
    component.model = q;
    fixture.detectChanges();
    expect(!!q.setPropertyValueCoreHandler).toBe(true);
    component.model = q2;
    component.ngDoCheck();
    expect(!!q.setPropertyValueCoreHandler).toBe(false);
    expect(!!q2.setPropertyValueCoreHandler).toBe(true);
    component.ngOnDestroy();
    expect(!!q2.setPropertyValueCoreHandler).toBe(false);
  });
  it("check base makeBaseElementAngular behavior with child and parent components share model", () => {
    const parentFixture = TestBed.createComponent(TestBase);
    const childFixture = TestBed.createComponent(TestBase);
    const parentComponent = parentFixture.componentInstance;
    const childComponent = childFixture.componentInstance;
    const q = new QuestionTextModel("q1");

    parentComponent.model = q;
    parentFixture.detectChanges();
    const parentCallback = q.setPropertyValueCoreHandler;
    expect(!!q.setPropertyValueCoreHandler).toBe(true);

    childComponent.model = q;
    childFixture.detectChanges();
    expect(q.setPropertyValueCoreHandler).toBe(parentCallback);

    childComponent.ngOnDestroy();
    expect(!!q.setPropertyValueCoreHandler).toBe(true);
    parentComponent.ngOnDestroy();
    expect(!!q.setPropertyValueCoreHandler).toBe(false);
  });
});
it("check survey renderCallback destroy if model is not defined", () => {
  const fixture = TestBed.createComponent(SurveyContentComponent);
  fixture.detectChanges();
  const component = fixture.componentInstance;
  expect(() => { component.ngOnDestroy(); }).not.toThrow();
});
// it("Check shouldReattachChangeDetector flag", (done: any) => {
//   const fixture = TestBed.createComponent(TestBase);
//   const component = fixture.componentInstance;
//   component.model = new QuestionTextModel("q1");
//   fixture.detectChanges();
//   let log = "";
//   const oldReattach = component["changeDetectorRef"].reattach;
//   component["changeDetectorRef"].reattach = () => {
//     oldReattach.call(component["changeDetectorRef"]);
//     log += "->reattached";
//   };
//   component.model.titleLocation = "left";
//   setTimeout(() => {
//     expect(log).toBe("->reattached");
//     component.model.titleLocation = "top";
//     component.shouldReattachChangeDetector = false;
//     setTimeout(() => {
//       expect(log).toBe("->reattached");
//       done();
//     }, 100);
//   }, 100);
// });

class RecurciveModel extends Base {
  constructor() {
    super();
    this.createNewArray("recursiveProperty");
    this.getPropertyValue("recursiveProperty").push(1);
  }
  get recursiveProperty(): number {
    let [a] = this.getPropertyValue("recursiveProperty").splice(0, 1);
    a++;
    this.getPropertyValue("recursiveProperty").push(a);
    return this.getPropertyValue("recursiveProperty");
  }
}

@Component({
  selector: "sv-ng-test-base",
  template: "<span>{{model.recursiveProperty}}</span>"
  })
class TestWithRecursiveProperty extends BaseAngular<RecurciveModel> {
  @Input() model!: RecurciveModel;
  public log: string = "";
  protected override getModel(): RecurciveModel {
    return this.model;
  }
  protected override afterUpdate(): void {
    super.afterUpdate();
    this.log += "->afterUpdate";
  }

}

// it("Check shouldReattachChangeDetector flag", (done: any) => {
//   const fixture = TestBed.createComponent(TestWithRecursiveProperty);
//   const component = fixture.componentInstance;
//   component.model = new RecurciveModel();
//   fixture.detectChanges();
//   component.ngAfterViewChecked();
//   fixture.checkNoChanges();
//   setTimeout(() => {
//     expect(component.log).toBe("->afterUpdate");
//     done();
//   }, 100);
// });