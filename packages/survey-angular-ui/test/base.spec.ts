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

it("check survey renderCallback destroy if model is not defined", () => {
  const fixture = TestBed.createComponent(SurveyContentComponent);
  fixture.detectChanges();
  const component = fixture.componentInstance;
  expect(() => { component.ngOnDestroy(); }).not.toThrow();
});
it("check model is subscribed correctly for multiple components", () => {
  const fixture1 = TestBed.createComponent(TestBase);
  const fixture2 = TestBed.createComponent(TestBase);
  const fixture3 = TestBed.createComponent(TestBase);
  const fixture4 = TestBed.createComponent(TestBase);
  const q = new QuestionTextModel("q1");
  fixture1.componentInstance.model = q;
  fixture1.detectChanges();
  fixture2.componentInstance.model = q;
  fixture2.detectChanges();
  fixture3.componentInstance.model = q;
  fixture3.detectChanges();
  fixture4.componentInstance.model = q;
  fixture4.detectChanges();

  expect(!!fixture1.componentInstance["isModelSubsribed"]).toBe(true);
  expect(!!fixture2.componentInstance["isModelSubsribed"]).toBe(true);
  expect(!!fixture3.componentInstance["isModelSubsribed"]).toBe(true);
  expect(!!fixture4.componentInstance["isModelSubsribed"]).toBe(true);
  expect(q["onPropertyValueCoreChanged"].length).toBe(4);

  fixture1.destroy();
  expect(!!fixture1.componentInstance["isModelSubsribed"]).toBe(false);
  expect(!!fixture2.componentInstance["isModelSubsribed"]).toBe(true);
  expect(!!fixture3.componentInstance["isModelSubsribed"]).toBe(true);
  expect(!!fixture4.componentInstance["isModelSubsribed"]).toBe(true);
  expect(q["onPropertyValueCoreChanged"].length).toBe(3);

  fixture2.destroy();
  expect(!!fixture1.componentInstance["isModelSubsribed"]).toBe(false);
  expect(!!fixture2.componentInstance["isModelSubsribed"]).toBe(false);
  expect(!!fixture3.componentInstance["isModelSubsribed"]).toBe(true);
  expect(!!fixture4.componentInstance["isModelSubsribed"]).toBe(true);
  expect(q["onPropertyValueCoreChanged"].length).toBe(2);

  fixture4.destroy();
  expect(!!fixture1.componentInstance["isModelSubsribed"]).toBe(false);
  expect(!!fixture2.componentInstance["isModelSubsribed"]).toBe(false);
  expect(!!fixture3.componentInstance["isModelSubsribed"]).toBe(true);
  expect(!!fixture4.componentInstance["isModelSubsribed"]).toBe(false);
  expect(q["onPropertyValueCoreChanged"].length).toBe(1);

  fixture3.destroy();
  expect(!!fixture1.componentInstance["isModelSubsribed"]).toBe(false);
  expect(!!fixture2.componentInstance["isModelSubsribed"]).toBe(false);
  expect(!!fixture3.componentInstance["isModelSubsribed"]).toBe(false);
  expect(!!fixture4.componentInstance["isModelSubsribed"]).toBe(false);
  expect(q["onPropertyValueCoreChanged"]).toBe(undefined);
});

@Component({
  selector: "test-parent-component",
  template: "<test-child-component [model]='model'></test-child-component>"
})
class TestParentComponent extends BaseAngular<Base> {
  @Input() model!: Base;
  protected override getModel(): Base {
    return this.model;
  }
}

@Component({
  selector: "test-child-component",
  template: "<span></span>"
})
class TestChildComponent extends BaseAngular<Base> {
  @Input() model!: Base;
  protected override getModel(): Base {
    return this.model;
  }
}

it("check model is not subcribed for nested components", async () => {
  await TestBed.configureTestingModule({
    declarations: [TestParentComponent, TestChildComponent],
  }).compileComponents();
  const fixture = TestBed.createComponent(TestParentComponent);
  const q = new QuestionTextModel("q1");
  fixture.componentInstance.model = q;
  fixture.detectChanges();
  expect(q["onPropertyValueCoreChanged"].length).toBe(1);
  expect(q["onPropertyValueCoreChanged"].hasFunc(fixture.componentInstance["onPropertyChangedCallback"]));
  fixture.destroy();
  expect(q["onPropertyValueCoreChanged"]).toBe(undefined);
});