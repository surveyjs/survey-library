import { TestBed } from "@angular/core/testing";
import { SurveyComponent } from "src/survey.component";
import { SurveyModel } from "survey-core";

describe("etalon tests", () => {
  it("Check that that surveyAfterRender isCalled", (done: any) => {
    const fixture = TestBed.createComponent(SurveyComponent);
    const component = fixture.componentInstance;
    component.model = new SurveyModel({});
    component.model.onAfterRenderSurvey.add((sender: SurveyModel, opt: any) => {
      expect(sender).toBe(component.model);
      done();
    });
    fixture.detectChanges();
  });
  it("Check that that question afterRender isCalled", (done: any) => {
    const fixture = TestBed.createComponent(SurveyComponent);
    const component = fixture.componentInstance;
    component.model = new SurveyModel({ elements: [{ type: "text", name: "q1" }] });
    component.model.onAfterRenderQuestion.add((sender: SurveyModel, opt: any) => {
      expect(opt.question.name).toBe("q1");
      done();
    });
    fixture.detectChanges();
  });
  it("Check that that survey after render header isCalled correctly", (done: any) => {
    const fixture = TestBed.createComponent(SurveyComponent);
    const component = fixture.componentInstance;
    component.model = new SurveyModel({ title: "Some title", elements: [{ type: "text", name: "q1" }] });
    component.model.onAfterRenderHeader.add((sender: SurveyModel, opt: any) => {
      expect(opt.htmlElement.className).toBe("sv_header");
      done();
    });
    fixture.detectChanges();
  });
  it("Check that that question after question content isCalled correctly", (done: any) => {
    const fixture = TestBed.createComponent(SurveyComponent);
    const component = fixture.componentInstance;
    component.model = new SurveyModel({ elements: [{ type: "text", name: "q1" }] });
    component.model.onAfterRenderQuestionInput.add((sender: SurveyModel, opt: any) => {
      expect(opt.htmlElement.className.search(/sv_q_text_root/) > -1).toBe(true);
      done();
    });
    fixture.detectChanges();
  });
});
it("Check that after page isCalled correctly", (done: any) => {
  const fixture = TestBed.createComponent(SurveyComponent);
  const component = fixture.componentInstance;
  component.model = new SurveyModel({ elements: [{ type: "text", name: "q1" }] });
  component.model.onAfterRenderPage.add((sender: SurveyModel, opt: any) => {
    expect(opt.htmlElement.className).toBe("sv_p_root");
    done();
  });
  fixture.detectChanges();
});