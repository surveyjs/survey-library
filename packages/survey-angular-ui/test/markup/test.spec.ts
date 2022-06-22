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

const blackList = [
  new RegExp(/paneldynamic/), //not implemented yet
  new RegExp(/file-mob2/), // waiting for action bar
  new RegExp(/image(-video)?/), //not implemented yet
  new RegExp(/dropdown-select/), //not implemented yet
  new RegExp(/panel/) //not implemented yet
];

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
    if(!blackList.some(item => markupTest.snapshot?.search(item) > -1)) {
      it(markupTest.name, (done: any) => {
        testQuestionMarkup(new ExpectAssertAdapter(expect, done), markupTest, platformDescriptor);
      });
    }
  });
});