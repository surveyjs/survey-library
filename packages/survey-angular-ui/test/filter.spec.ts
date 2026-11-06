import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SurveyModule } from "src/angular-ui.module";
import { SurveyComponent } from "src/survey.component";
import { AngularComponentFactory } from "src/component-factory";
import { Action, FilterFieldPopup, QuestionFilterModel, SurveyModel } from "survey-core";

// The scenarios of packages/survey-react-ui/tests/filter.spec.tsx, drawn by the Angular components.
function createByName(name: string, inputs: any): ComponentFixture<any> {
  const type = (<any>AngularComponentFactory.Instance)["creatorHash"][name];
  expect(!!type).withContext("registered: " + name).toBe(true);
  const fixture = TestBed.createComponent(type);
  Object.keys(inputs).forEach((key: string) => { (<any>fixture.componentInstance)[key] = inputs[key]; });
  fixture.detectChanges();
  return fixture;
}
// A component drawn through an <ng-template> puts its content next to its (hidden) host element - in
// a test, right in the document body, next to what other tests left there. So the content is looked
// up in the component's own view.
function getRootNodes(fixture: ComponentFixture<any>): Array<HTMLElement> {
  const view = (<any>fixture.componentInstance).embeddedView;
  return (!!view ? view.rootNodes : []).filter((node: Node) => node.nodeType === 1);
}
function getRoot(fixture: ComponentFixture<any>): { querySelector: (selector: string) => HTMLElement | null, textContent: string } {
  const nodes = getRootNodes(fixture);
  return {
    querySelector: (selector: string): HTMLElement | null => {
      for (const node of nodes) {
        if (node.matches(selector)) return node;
        const res = <HTMLElement>node.querySelector(selector);
        if (!!res) return res;
      }
      return null;
    },
    textContent: nodes.map((node: HTMLElement) => node.textContent).join("")
  };
}
function renderSurvey(survey: SurveyModel): ComponentFixture<SurveyComponent> {
  const fixture = TestBed.createComponent(SurveyComponent);
  fixture.componentInstance.model = survey;
  fixture.detectChanges();
  return fixture;
}

describe("Filter question", () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [SurveyModule] }).compileComponents();
  });
  it("unmounting after the survey was disposed builds no toolbars anew", async () => {
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1", fields: [{ name: "age" }] }] });
    const q = survey.getQuestionByName("f1") as QuestionFilterModel;
    const fixture = renderSurvey(survey);
    await fixture.whenStable();
    fixture.detectChanges();
    expect(!!fixture.nativeElement.querySelector(".sd-filter__chips .sd-action")).withContext("#1: the chips are drawn").toBe(true);
    survey.dispose();
    fixture.destroy();
    expect((<any>q).toolbarsValue).withContext("#2").toBe(undefined);
  });
  it("renders the filter control in design mode", async () => {
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({ elements: [{ type: "filter", name: "f1", fields: [{ name: "age" }] }] });
    const fixture = renderSurvey(survey);
    await fixture.whenStable();
    fixture.detectChanges();
    expect(!!fixture.nativeElement.querySelector(".sd-filter")).toBe(true);
    fixture.destroy();
    survey.dispose();
  });
});

describe("Filter list item", () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [SurveyModule] }).compileComponents();
  });
  const fields = [{ name: "country", fieldType: "dropdown", choices: [{ value: "de", text: "Germany" }, { value: "fr", text: "France" }] }];
  function renderItem(popup: FilterFieldPopup, title: string): ComponentFixture<any> {
    const item = popup.list.actions.filter((a: Action) => a.title === title)[0];
    return createByName("sv-filter-list-item", { model: item, listModel: popup.list });
  }
  it("an entry of a checkbox list is drawn with the checkbox question's checkbox", () => {
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1", fields: fields }] });
    const q = survey.getQuestionByName("f1") as QuestionFilterModel;
    q.setFieldCondition("country", "anyof", ["de"]);
    const popup = q.createFieldPopup("country", () => {});
    const checked = renderItem(popup, "Germany");
    expect(!!getRoot(checked).querySelector(".sd-checkbox.sd-checkbox--checked .sd-checkbox__decorator .sd-checkbox__svg")).withContext("#1: checked").toBe(true);
    expect(!!getRoot(checked).querySelector(".sd-checkbox--readonly")).withContext("#3: not read-only").toBe(false);
    checked.destroy();
    const unchecked = renderItem(popup, "France");
    expect(!!getRoot(unchecked).querySelector(".sd-checkbox:not(.sd-checkbox--checked) .sd-checkbox__decorator .sd-checkbox__svg")).withContext("#2: unchecked").toBe(true);
    unchecked.destroy();
    popup.dispose();
  });
  it("an entry of a read-only checkbox list is drawn with a read-only checkbox", () => {
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({ elements: [{ type: "filter", name: "f1", fields: fields }] });
    const q = survey.getQuestionByName("f1") as QuestionFilterModel;
    const popup = q.createFieldPopup("country", () => {});
    const fixture = renderItem(popup, "Germany");
    expect(!!getRoot(fixture).querySelector(".sd-checkbox.sd-checkbox--readonly .sd-checkbox__decorator")).toBe(true);
    fixture.destroy();
    popup.dispose();
  });
});
