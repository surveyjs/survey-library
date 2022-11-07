import { TestBed } from "@angular/core/testing";
import { SurveyComponent } from "src/survey.component";
import { settings, StylesManager, SurveyModel } from "survey-core";
import { testQuestionMarkup } from "../../../../tests/markup/helper";
import { markupTests } from "../../../../tests/markup/etalon";
import { SurveyModule } from "src/angular-ui.module";

const platformDescriptor = {
  name: "Angular",
  survey: null,
  surveyFactory: (json: any) => new SurveyModel(json),
  getStrFromHtml: (snapshot: string) => (<any>window).__html__["./snapshots/"+snapshot+".snap.html"],
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

const blackList = [];

describe("etalon tests", () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyModule],
    }).compileComponents();
    TestBed.inject(SurveyModule);
    (<any>window).ResizeObserver = function () {
      return {
        observe: () => {},
        disconnect: () => {},
        unobserve: () => {},
      };
    };
  });
  markupTests.forEach(markupTest => {
    if(!blackList.some(item => markupTest.snapshot?.search(item) > -1)) {
      it(markupTest.name, (done: any) => {
        testQuestionMarkup(new ExpectAssertAdapter(expect, done), markupTest, platformDescriptor);
      });
    }
  });
});