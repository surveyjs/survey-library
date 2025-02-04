import { TestBed } from "@angular/core/testing";
import { SurveyModule } from "src/angular-ui.module";
import { SurveyComponent } from "src/survey.component";
import { SurveyModel } from "survey-core";

describe("event tests", () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyModule],
    }).compileComponents();
    TestBed;
  });
  it("Check that surveyAfterRender is called", (done: any) => {
    const fixture = TestBed.createComponent(SurveyComponent);
    const component = fixture.componentInstance;
    component.model = new SurveyModel({});
    component.model.onAfterRenderSurvey.add((sender: SurveyModel, opt: any) => {
      expect(sender).toBe(component.model);
      done();
    });
    fixture.detectChanges();
  });
  it("Check that startTimerFromUI is called", (done: any) => {
    const fixture = TestBed.createComponent(SurveyComponent);
    const component = fixture.componentInstance;
    component.model = new SurveyModel({});
    let log = "";
    component.model.startTimerFromUI = () => {
      log += "->called";
    };
    fixture.detectChanges();
    expect(log).toBe("->called");
    done();
  });
  it("Check that that question afterRender is called", (done: any) => {
    const fixture = TestBed.createComponent(SurveyComponent);
    const component = fixture.componentInstance;
    component.model = new SurveyModel({ elements: [{ type: "text", name: "q1" }] });
    component.model.onAfterRenderQuestion.add((sender: SurveyModel, opt: any) => {
      expect(opt.question.name).toBe("q1");
      done();
    });
    fixture.detectChanges();
  });
  it("Check that that survey after render header is called correctly", (done: any) => {
    const fixture = TestBed.createComponent(SurveyComponent);
    const component = fixture.componentInstance;
    const survey = new SurveyModel({ headerView: "basic", title: "Some title", elements: [{ type: "text", name: "q1" }] });
    survey.css = { header: "sv_header" };
    component.model = survey;
    component.model.onAfterRenderHeader.add((sender: SurveyModel, opt: any) => {
      expect(opt.htmlElement.className.search(/sv_header/) > -1).toBe(true);
      done();
    });
    fixture.detectChanges();
  });
  it("Check that that question after question content is called correctly", (done: any) => {
    const fixture = TestBed.createComponent(SurveyComponent);
    const component = fixture.componentInstance;
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q1" }] });
    survey.css = { text: { root: "sv_q_text_root" } };
    component.model =survey;
    component.model.onAfterRenderQuestionInput.add((sender: SurveyModel, opt: any) => {
      expect(opt.htmlElement.className.search(/sv_q_text_root/) > -1).toBe(true);
      done();
    });
    fixture.detectChanges();
  });
  it("Check that after render page is called correctly", (done: any) => {
    const fixture = TestBed.createComponent(SurveyComponent);
    const component = fixture.componentInstance;
    const survey = new SurveyModel({ pages: [{ elements: [{ type: "text", name: "q1" }] }, { elements: [{ type: "text", name: "q2" }] }] });
    component.model = survey;
    let callCount = 0;
    survey.css = { page: { root: "sv_p_root" } };
    component.model.onAfterRenderPage.add((sender: SurveyModel, opt: any) => {
      expect(opt.htmlElement.className.search(/sv_p_root/) > -1).toBe(true);
      callCount++;
    });
    fixture.autoDetectChanges(true);
    component.model.nextPage();
    setTimeout(() => {
      expect(callCount).toBe(2);
      done();
    });
  });
  it("Check that after render panel is called correctly", (done: any) => {
    const fixture = TestBed.createComponent(SurveyComponent);
    const component = fixture.componentInstance;
    const survey = new SurveyModel({ elements: [{
      "type": "panel",
      "name": "panel1",
      "elements": [
        {
          "type": "text",
          "name": "question1"
        }
      ]
    }] });
    survey.css = { panel: { container: "sv_p_container" } };
    component.model = survey;
    component.model.onAfterRenderPanel.add((sender: SurveyModel, opt: any) => {
      expect(opt.htmlElement.className.search(/sv_p_container/) > -1).toBe(true);
      done();
    });
    fixture.detectChanges();
  });
});