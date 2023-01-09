import { TestBed } from "@angular/core/testing";
import { SurveyModule } from "src/angular-ui.module";
import { PopupSurveyComponent } from "src/popup.survey.component";
import { SurveyModel } from "survey-core";

describe("popup survey tests", () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyModule],
    }).compileComponents();
    TestBed;
  });
  it("check popup survey behavior", () => {
    const fixture = TestBed.createComponent(PopupSurveyComponent);
    const component = fixture.componentInstance;
    let survey1 = new SurveyModel({});
    let survey2 = new SurveyModel({});
    component.model = survey1;
    component.isExpanded = false;
    component.ngOnChanges({ model: {
      previousValue: undefined,
      firstChange: true,
      isFirstChange() {
        return true;
      },
      currentValue: survey1,
    },
    isExpanded: {
      previousValue: undefined,
      firstChange: true,
      isFirstChange() {
        return true;
      },
      currentValue: false,
    } });
    expect(component.popup.isExpanded).toBe(false);
    expect(component.popup.survey).toBe(survey1);
    let previosPopup = component.popup;
    component.model = survey2;
    component.isExpanded = false;
    component.ngOnChanges({ model: {
      previousValue: survey1,
      firstChange: false,
      isFirstChange() {
        return false;
      },
      currentValue: survey2,
    },
    isExpanded: {
      previousValue: false,
      firstChange: false,
      isFirstChange() {
        return false;
      },
      currentValue: false,
    } });
    expect(component.popup.isExpanded).toBe(false);
    expect(component.popup.survey).toBe(survey2);
    expect(component.popup !== previosPopup).toBe(true);
    previosPopup = component.popup;
    component.model = survey2;
    component.isExpanded = true;
    component.ngOnChanges({ model: {
      previousValue: survey2,
      firstChange: false,
      isFirstChange() {
        return false;
      },
      currentValue: survey2,
    },
    isExpanded: {
      previousValue: false,
      firstChange: false,
      isFirstChange() {
        return false;
      },
      currentValue: true,
    } });
    expect(component.popup.isExpanded).toBe(true);
    expect(component.popup.survey).toBe(survey2);
    expect(component.popup).toBe(previosPopup);
    previosPopup = component.popup;

    component.isExpanded = false;
    component.model = survey2;
    component.ngOnChanges({
      isExpanded: {
        previousValue: false,
        firstChange: false,
        isFirstChange() {
          return false;
        },
        currentValue: false,
      } });
    expect(component.popup.isExpanded).toBe(false);
    expect(component.popup.survey).toBe(survey2);
    expect(component.popup).toBe(previosPopup);
  });
});