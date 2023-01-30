import { Component, Input } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { BaseAngular } from "src/base-angular";
import { SurveyContentComponent } from "src/survey-content.component";
import { QuestionTextModel } from "survey-core";

@Component({
  selector: "sv-ng-test-base",
  template: ""
  })
class TestBase extends BaseAngular<QuestionTextModel> {
  @Input() model!: QuestionTextModel;
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