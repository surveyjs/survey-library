import { TestBed } from "@angular/core/testing";
import { SurveyComponent } from "src/survey.component";
import { settings, StylesManager, SurveyModel } from "survey-core";
import { testQuestionMarkup } from "../../../../tests/markup/helper";
import { markupTests } from "../../../../tests/markup/etalon";
import { SurveyAngularModule } from "src/angular-ui.module";

const platformDescriptor = {
  name: "Angular",
  survey: null,
  surveyFactory: (json: any) => new SurveyModel(json),
  getStrFromHtml: (fileName: string) => (<any>window).__html__[fileName],
  render: (survey: SurveyModel, element: HTMLElement) => {
    const fixture = TestBed.createComponent(SurveyComponent);
    const component = fixture.componentInstance;
    component.model = survey;
    fixture.detectChanges(true);
  },
  getSettings: () => {
    return settings;
  },
  getStylesManager: () => {
    return StylesManager;
  }
};

class ExpectAssertAdapter {
  constructor(private expect: any, private done: any) {

  }
  public equal(actual: any, expected: any, msg: string) {
    this.expect(actual, msg).toBe(expected);
  }
  public async () {
    return this.done;
  }
}

describe("etalon tests", () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyAngularModule],
    }).compileComponents();
    TestBed.inject(SurveyAngularModule);
    (<any>window).ResizeObserver = function () {
      return {
        observe: () => {},
        disconnect: () => {},
        unobserve: () => {},
      };
    };
  });
  markupTests.forEach(markupTest => {
    if(markupTest.snapshot?.search(/^file-?/) > -1) {
      it(markupTest.name, (done: any) => {
        testQuestionMarkup(new ExpectAssertAdapter(expect, done), markupTest, platformDescriptor);
      });
    }
  });
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