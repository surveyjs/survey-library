import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SurveyModule } from "src/angular-ui.module";
import { SurveyComponent } from "src/survey.component";
import { AngularComponentFactory } from "src/component-factory";
import { Action, FilterEditorHolder, FilterFieldPopup, QuestionFilterModel, SurveyModel } from "survey-core";

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

// A model change is drawn in a microtask (BaseAngular.update), so the checks wait for it.
async function settle(fixture: ComponentFixture<any>): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 0));
  fixture.detectChanges();
  await new Promise((resolve) => setTimeout(resolve, 0));
}

describe("Filter dialogs", () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [SurveyModule] }).compileComponents();
  });
  it("the Filters dialog shows the search box, the presets and the fields", async () => {
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1", showSearch: true,
      fields: [{ name: "age" }], items: [{ name: "p", title: "Adults", expression: "{age} > 18" }] }] });
    const q = survey.getQuestionByName("f1") as QuestionFilterModel;
    const holder = new FilterEditorHolder();
    holder.cssClasses = q.cssClasses;
    holder.modal = q.createFilterModal();
    const fixture = createByName("sv-filter-modal", { holder: holder });
    await settle(fixture);
    const root = () => getRoot(fixture);
    expect(root().querySelector(".sd-filter-modal__section-title")?.textContent).withContext("#1").toBe("Filter Presets");
    expect(root().textContent).withContext("#2").toContain("Adults");
    expect(!!root().querySelector(".sd-filter-modal__section input")).withContext("#3: the search box").toBe(true);
    expect(!!root().querySelector(".sd-filter-modal__editor")).withContext("#4: the fields").toBe(true);
    expect(root().textContent).withContext("#4a: Add Preset").toContain("Add Preset");
    expect(!!root().querySelector(".sd-filter-modal__section-header [title='Edit Presets']")).withContext("#4b: the pencil").toBe(true);
    const modal = holder.modal;
    holder.modal = undefined as any;
    await settle(fixture);
    modal.dispose();
    expect(root().querySelector(".sd-filter-modal__content")).withContext("#5: an emptied holder unmounts the content").toBe(null);
    fixture.destroy();
  });
  it("Edit Presets shows the tabs, the form, the fields in a frame and the actions; another tab redraws them", async () => {
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1", fields: [{ name: "age" }],
      items: [{ name: "a", title: "Adults", expression: "{age} > 18" }, { name: "k", title: "Kids", expression: "{age} < 10" }] }] });
    const q = survey.getQuestionByName("f1") as QuestionFilterModel;
    const holder = new FilterEditorHolder();
    holder.cssClasses = q.cssClasses;
    const dialog = q.createEditPresetsDialog("a");
    holder.presetDialog = dialog;
    const fixture = createByName("sv-filter-preset-dialog", { holder: holder });
    await settle(fixture);
    const root = () => getRoot(fixture);
    expect(root().querySelector(".sd-filter-preset-dialog__tabs")?.textContent?.trim()).withContext("#1").toBe("AdultsKids");
    expect((<HTMLInputElement>root().querySelector(".sd-filter-preset-dialog__form input")).value).withContext("#2").toBe("Adults");
    expect(!!root().querySelector(".sd-filter-preset-dialog__fields .sd-filter-modal__editor")).withContext("#3: the fields").toBe(true);
    expect(root().textContent).withContext("#4").toContain("Preset Actions");
    const input = root().querySelector(".sd-filter-preset-dialog__form input");
    dialog.selectTab("k");
    await settle(fixture);
    expect((<HTMLInputElement>root().querySelector(".sd-filter-preset-dialog__form input")).value).withContext("#5").toBe("Kids");
    expect(root().querySelector(".sd-filter-preset-dialog__form input") !== input).withContext("#5a: a new form is drawn anew, not over the old one").toBe(true);
    holder.presetDialog = undefined as any;
    await settle(fixture);
    dialog.dispose();
    expect(root().querySelector(".sd-filter-preset-dialog__content")).withContext("#6: an emptied holder unmounts the content").toBe(null);
    fixture.destroy();
  });
  it("the search box of a badge's popup is drawn as the text question's formbox", async () => {
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1", fields: [
      { name: "product", fieldType: "dropdown", choices: ["a", "b", "c", "d", "e", "f", "g"] }] }] });
    const q = survey.getQuestionByName("f1") as QuestionFilterModel;
    const holder = new FilterEditorHolder();
    holder.fieldPopup = q.createFieldPopup("product", () => {});
    const fixture = createByName("sv-filter-field-popup", { holder: holder });
    await settle(fixture);
    expect(!!getRoot(fixture).querySelector(".sd-filter-popup__search.sd-formbox input")).toBe(true);
    fixture.destroy();
    holder.fieldPopup.dispose();
  });
});

describe("Filter AI dialog", () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [SurveyModule] }).compileComponents();
  });
  function setup(json: any = {}): { q: QuestionFilterModel, calls: Array<any> } {
    const survey = new SurveyModel({ elements: [Object.assign({ type: "filter", name: "f1",
      fields: [{ name: "age", fieldType: "text", inputType: "number" }] }, json)] });
    const calls: Array<any> = [];
    survey.onAIFilterRequest.add((_: any, options: any) => { calls.push(options); });
    return { q: survey.getQuestionByName("f1") as QuestionFilterModel, calls: calls };
  }
  it("Create custom filter: the description and its button; the fields' editors once the model answered", async () => {
    const { q, calls } = setup();
    const holder = new FilterEditorHolder();
    holder.cssClasses = q.cssClasses;
    const dialog = q.createAIDialog();
    holder.aiDialog = dialog;
    const fixture = createByName("sv-filter-ai-dialog", { holder: holder });
    await settle(fixture);
    const content = () => <HTMLElement>getRoot(fixture).querySelector(".sd-filter-ai-dialog__content");
    expect(content().querySelector(".sd-filter-ai-prompt__title")?.textContent?.trim()).withContext("#1").toBe("Describe what you need - AI will do the rest.");
    expect(!!content().querySelector(".sd-filter-ai-prompt__form textarea")).withContext("#2: the description").toBe(true);
    expect(content().querySelector(".sd-filter-ai-prompt__request")?.textContent).withContext("#3").toContain("Create new filter");
    expect(!!content().querySelector(".sd-filter-modal__editor")).withContext("#4: no fields yet").toBe(false);
    dialog.aiPrompt.form.setValue("prompt", "adults");
    dialog.aiPrompt.request();
    await settle(fixture);
    calls[0].callback({ data: { expression: "{age} > 18", title: "Adults", explanation: "" } });
    await settle(fixture);
    expect(!!content().querySelector(".sd-filter-modal__editor")).withContext("#5: the fields").toBe(true);
    expect(content().querySelector(".sd-filter-ai-prompt__request")?.textContent).withContext("#6").toContain("Make Changes");
    expect(content().querySelector(".sd-filter-ai-prompt__title")?.textContent?.trim()).withContext("#7").toBe("Describe what to change - if needed.");
    dialog.aiPrompt.errorText = "Something went wrong";
    await settle(fixture);
    expect(content().querySelector(".sd-filter-ai-prompt__error")?.textContent?.trim()).withContext("#8").toBe("Something went wrong");
    holder.aiDialog = undefined as any;
    await settle(fixture);
    dialog.dispose();
    expect(getRoot(fixture).querySelector(".sd-filter-ai-dialog__content")).withContext("#9: an emptied holder unmounts the content").toBe(null);
    fixture.destroy();
  });
  it("the Filters dialog shows Create with AI while the application answers AI requests", async () => {
    const { q } = setup({ items: [{ name: "a", title: "Adults", expression: "{age} > 18" }] });
    const holder = new FilterEditorHolder();
    holder.cssClasses = q.cssClasses;
    holder.modal = q.createFilterModal();
    const fixture = createByName("sv-filter-modal", { holder: holder });
    await settle(fixture);
    expect(getRoot(fixture).textContent).toContain("Create with AI...");
    const modal = holder.modal;
    holder.modal = undefined as any;
    await settle(fixture);
    modal.dispose();
    fixture.destroy();
  });
  it("Edit Presets shows the description and Make Changes in the tab of an AI preset", async () => {
    const { q } = setup({ items: [{ name: "a", title: "Adults", type: "ai", prompt: "grown-ups", expression: "{age} > 18" }] });
    const holder = new FilterEditorHolder();
    holder.cssClasses = q.cssClasses;
    const dialog = q.createEditPresetsDialog("a");
    holder.presetDialog = dialog;
    const fixture = createByName("sv-filter-preset-dialog", { holder: holder });
    await settle(fixture);
    const block = <HTMLElement>getRoot(fixture).querySelector(".sd-filter-preset-dialog__content .sd-filter-ai-prompt");
    expect(!!block).withContext("#1").toBe(true);
    expect((<HTMLTextAreaElement>block.querySelector("textarea")).value).withContext("#2").toBe("grown-ups");
    expect(block.querySelector(".sd-filter-ai-prompt__request")?.textContent).withContext("#3").toContain("Make Changes");
    holder.presetDialog = undefined as any;
    await settle(fixture);
    dialog.dispose();
    fixture.destroy();
  });
});
