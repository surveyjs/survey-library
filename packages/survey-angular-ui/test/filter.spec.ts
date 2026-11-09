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
function queryAll(fixture: ComponentFixture<any>, selector: string): Array<HTMLElement> {
  const res: Array<HTMLElement> = [];
  getRootNodes(fixture).forEach((node: HTMLElement) => {
    if (node.matches(selector)) res.push(node);
    node.querySelectorAll(selector).forEach((el: Element) => { res.push(<HTMLElement>el); });
  });
  return res;
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
  it("a change of the chips measures the row again", async () => {
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1", fields: [{ name: "age" }],
      items: [{ name: "a", title: "Adults", expression: "{age} > 18" }, { name: "k", title: "Kids", expression: "{age} < 10" }] }] });
    const q = survey.getQuestionByName("f1") as QuestionFilterModel;
    const fixture = renderSurvey(survey);
    await settle(fixture);
    const update = spyOn(q.chipsLayout, "update").and.callThrough();
    q.items.splice(1, 1);
    await settle(fixture);
    await fixture.whenStable();
    expect(update).toHaveBeenCalled();
    fixture.destroy();
    survey.dispose();
  });
  it("typing in the search box sets the search string and the filter expression", async () => {
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1", showSearch: true, fields: [{ name: "name" }] }] });
    const q = survey.getQuestionByName("f1") as QuestionFilterModel;
    const fixture = renderSurvey(survey);
    await settle(fixture);
    const input = <HTMLInputElement>fixture.nativeElement.querySelector(".sd-filter__search input");
    expect(!!input).withContext("#1: the search box").toBe(true);
    expect(q.filterExpression).withContext("#2").toBe("");
    input.value = "ab";
    input.dispatchEvent(new Event("input"));
    await settle(fixture);
    expect(q.searchString).withContext("#3").toBe("ab");
    expect(q.filterExpression).withContext("#4: the search filters the records").toContain("ab");
    expect((<HTMLInputElement>fixture.nativeElement.querySelector(".sd-filter__search input")).value).withContext("#5").toBe("ab");
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
  it("a typed value is drawn checked, with no button inside the option; unchecked, it is gone at the next open", () => {
    const custom = [{ name: "country", fieldType: "dropdown", allowCustomChoices: true, choices: [{ value: "de", text: "Germany" }] }];
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1", fields: custom }] });
    const q = survey.getQuestionByName("f1") as QuestionFilterModel;
    q.setFieldCondition("country", "anyof", ["de", "zz"]);
    const popup = q.createFieldPopup("country", () => {});
    const fixture = renderItem(popup, "zz");
    expect(!!getRoot(fixture).querySelector(".sd-checkbox.sd-checkbox--checked")).withContext("#1: checked").toBe(true);
    expect(getRoot(fixture).querySelector("button")).withContext("#2: no nested button").toBe(null);
    fixture.destroy();
    popup.list.onItemClick(popup.list.actions.filter((a: Action) => a.title === "zz")[0]);
    popup.apply();
    popup.dispose();
    const next = q.createFieldPopup("country", () => {});
    expect(next.list.actions.map((a: Action) => a.title)).withContext("#3").toEqual(["Germany"]);
    next.dispose();
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
    const section = root().querySelector(".sd-filter-modal__section[role='group']") as HTMLElement;
    expect(!!section && section.querySelector("#" + section.getAttribute("aria-labelledby"))?.textContent).withContext("#4c: the section is named by its title").toBe("Filter Presets");
    const modal = holder.modal;
    holder.modal = undefined as any;
    await settle(fixture);
    modal.dispose();
    expect(root().querySelector(".sd-filter-modal__content")).withContext("#5: an emptied holder unmounts the content").toBe(null);
    fixture.destroy();
  });
  it("Edit Presets shows the tabs, the form, the fields in a frame and the actions; another tab redraws them", async () => {
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1", fields: [{ name: "age" }, { name: "name" }],
      items: [{ name: "a", title: "Adults", kind: "ai", prompt: "grown-ups", expression: "{age} > 18" },
        { name: "k", title: "Kids", expression: "{age} < 10 and {name} = 'x'" }] }] });
    survey.onAIFilterRequest.add(() => { });
    const q = survey.getQuestionByName("f1") as QuestionFilterModel;
    const holder = new FilterEditorHolder();
    holder.cssClasses = q.cssClasses;
    const dialog = q.createEditPresetsDialog("a");
    holder.presetDialog = dialog;
    const fixture = createByName("sv-filter-preset-dialog", { holder: holder });
    await settle(fixture);
    const root = () => getRoot(fixture);
    // The fields' panels in the frame, and the description after it, once each.
    const fields = (): Array<string> => queryAll(fixture, ".sd-filter-modal__editor .sd-filter-preset-dialog__fields .sd-panel__title")
      .map((el: HTMLElement): string => (el.textContent || "").trim());
    const prompts = (): number => queryAll(fixture, ".sd-filter-modal__editor .sd-filter-ai-prompt").length;
    expect(root().querySelector(".sd-filter-preset-dialog__tabs")?.textContent?.trim()).withContext("#1").toBe("AdultsKids");
    expect((<HTMLInputElement>root().querySelector(".sd-filter-preset-dialog__form input")).value).withContext("#2").toBe("Adults");
    expect([fields(), prompts()]).withContext("#3: the fields and the description").toEqual([["age"], 1]);
    expect(root().textContent).withContext("#4").toContain("Preset Actions");
    const input = root().querySelector(".sd-filter-preset-dialog__form input");
    dialog.selectTab("k");
    await settle(fixture);
    expect((<HTMLInputElement>root().querySelector(".sd-filter-preset-dialog__form input")).value).withContext("#5").toBe("Kids");
    expect(root().querySelector(".sd-filter-preset-dialog__form input") !== input).withContext("#5a: a new form is drawn anew, not over the old one").toBe(true);
    expect([fields(), prompts()]).withContext("#5b: a plain tab has no description").toEqual([["age", "name"], 0]);
    dialog.selectTab("a");
    await settle(fixture);
    expect([fields(), prompts()]).withContext("#5c: back to the AI tab").toEqual([["age"], 1]);
    expect((<HTMLTextAreaElement>root().querySelector(".sd-filter-ai-prompt textarea")).value).withContext("#5d").toBe("grown-ups");
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
  it("typing in the Filters dialog's search box sets the dialog's search string", async () => {
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1", showSearch: true, fields: [{ name: "name" }] }] });
    const q = survey.getQuestionByName("f1") as QuestionFilterModel;
    const holder = new FilterEditorHolder();
    holder.cssClasses = q.cssClasses;
    holder.modal = q.createFilterModal();
    const fixture = createByName("sv-filter-modal", { holder: holder });
    await settle(fixture);
    const input = <HTMLInputElement>getRoot(fixture).querySelector(".sd-filter-modal__section input");
    input.value = "ab";
    input.dispatchEvent(new Event("input"));
    await settle(fixture);
    expect(holder.modal.searchString).withContext("#1").toBe("ab");
    expect(q.searchString).withContext("#2: the question's search string waits for Apply").toBe("");
    expect((<HTMLInputElement>getRoot(fixture).querySelector(".sd-filter-modal__section input")).value).withContext("#3").toBe("ab");
    const modal = holder.modal;
    holder.modal = undefined as any;
    await settle(fixture);
    modal.dispose();
    fixture.destroy();
  });
  it("an editor page gives its survey's root element back on unmount, unless another one was set", async () => {
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1", fields: [{ name: "age" }] }] });
    const q = survey.getQuestionByName("f1") as QuestionFilterModel;
    const holder = new FilterEditorHolder();
    holder.cssClasses = q.cssClasses;
    holder.modal = q.createFilterModal();
    const fixture = createByName("sv-filter-modal", { holder: holder });
    await settle(fixture);
    const modal = holder.modal;
    const editorSurvey = modal.editor.survey;
    expect(editorSurvey.rootElement).withContext("#1: set on mount").toBe(getRoot(fixture).querySelector(".sd-filter-modal__editor") as HTMLElement);
    holder.modal = undefined as any;
    await settle(fixture);
    expect(editorSurvey.isDisposed).withContext("#2: not disposed yet").toBe(false);
    expect(editorSurvey.rootElement).withContext("#3: cleared on unmount").toBeUndefined();
    modal.dispose();
    const other = q.createFilterModal();
    holder.modal = other;
    await settle(fixture);
    const otherSurvey = other.editor.survey;
    expect(!!otherSurvey.rootElement).withContext("#4: set on mount").toBe(true);
    const elsewhere = document.createElement("div");
    otherSurvey.rootElement = elsewhere;
    holder.modal = undefined as any;
    await settle(fixture);
    expect(otherSurvey.rootElement).withContext("#5: set elsewhere in the meantime, kept").toBe(elsewhere);
    other.dispose();
    fixture.destroy();
    survey.dispose();
  });
  async function renderPopup(): Promise<{ holder: FilterEditorHolder, fixture: ComponentFixture<any>, input: HTMLInputElement }> {
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1", fields: [
      { name: "product", fieldType: "dropdown", choices: ["apple", "banana", "cherry", "date", "elder", "fig", "grape"] }] }] });
    const q = survey.getQuestionByName("f1") as QuestionFilterModel;
    const holder = new FilterEditorHolder();
    holder.fieldPopup = q.createFieldPopup("product", () => {});
    const fixture = createByName("sv-filter-field-popup", { holder: holder });
    await settle(fixture);
    return { holder: holder, fixture: fixture, input: <HTMLInputElement>getRoot(fixture).querySelector(".sd-filter-popup__search-input") };
  }
  it("typing in the search box of a badge's popup filters its list", async () => {
    const { holder, fixture, input } = await renderPopup();
    const list = holder.fieldPopup.list;
    expect(list.visibleItems.length).withContext("#1").toBe(7);
    input.value = "an";
    input.dispatchEvent(new Event("input"));
    await settle(fixture);
    expect(list.filterString).withContext("#2").toBe("an");
    expect(list.visibleItems.map((a: Action) => a.title)).withContext("#3").toEqual(["banana"]);
    expect((<HTMLInputElement>getRoot(fixture).querySelector(".sd-filter-popup__search-input")).value).withContext("#4").toBe("an");
    fixture.destroy();
    holder.fieldPopup.dispose();
  });
  it("ArrowDown in the search box of a badge's popup focuses the first item of the list", async () => {
    const { holder, fixture, input } = await renderPopup();
    input.focus();
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
    await settle(fixture);
    const first = getRoot(fixture).querySelector(".sd-filter-popup ul > li");
    expect(!!first).withContext("#1").toBe(true);
    expect(document.activeElement).withContext("#2").toBe(first);
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
  it("Create custom filter is the dialog's survey drawn as any survey: the description and its button; the fields' editors once the model answered", async () => {
    const { q, calls } = setup();
    const dialog = q.createAIDialog();
    // The component the dialog host is given: "survey", with the dialog's survey as the model.
    const fixture = createByName("survey", { model: dialog.survey, survey: dialog.survey });
    await settle(fixture);
    const root = <HTMLElement>getRoot(fixture).querySelector(".sd-root-modern.sd-filter-editor.sd-filter-modal__editor");
    expect(!!root).withContext("#0: the editors' classes on the survey's root").toBe(true);
    const prompt = () => <HTMLElement>root.querySelector(".sd-panel.sd-filter-ai-prompt");
    expect(prompt().querySelector(".sd-panel__title")?.textContent).withContext("#1").toContain("Describe what you need - AI will do the rest.");
    expect(!!prompt().querySelector("textarea")).withContext("#2: the description").toBe(true);
    expect(prompt().querySelector(".sd-filter-ai-prompt__request")?.textContent).withContext("#3").toContain("Create new filter");
    expect(root.querySelectorAll(".sd-panel").length).withContext("#4: no fields yet").toBe(1);
    dialog.aiPrompt.prompt = "adults";
    dialog.aiPrompt.request();
    await settle(fixture);
    calls[0].callback({ data: { expression: "{age} > 18", title: "Adults", explanation: "" } });
    await settle(fixture);
    expect(root.querySelectorAll(".sd-panel").length).withContext("#5: the field's panel").toBe(2);
    expect(root.querySelector(".sd-panel")?.textContent).withContext("#5a: over the description").toContain("age");
    expect(prompt().querySelector(".sd-filter-ai-prompt__request")?.textContent).withContext("#6").toContain("Make Changes");
    expect(prompt().querySelector(".sd-panel__title")?.textContent).withContext("#7").toContain("Describe what to change - if needed.");
    dialog.aiPrompt.errorText = "Something went wrong";
    await settle(fixture);
    expect(prompt().querySelector(".sd-question__erbox")?.textContent).withContext("#8").toContain("Something went wrong");
    // The survey's content is drawn next to its host, right in the document body, and stays there when
    // the fixture is destroyed - in a dialog it goes with the popup. A textarea left behind would be
    // found by the id of another test's question.
    const nodes = getRootNodes(fixture);
    fixture.destroy();
    nodes.forEach((node: HTMLElement) => node.remove());
    dialog.dispose();
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
    const { q } = setup({ items: [{ name: "a", title: "Adults", kind: "ai", prompt: "grown-ups", expression: "{age} > 18" }] });
    const holder = new FilterEditorHolder();
    holder.cssClasses = q.cssClasses;
    const dialog = q.createEditPresetsDialog("a");
    holder.presetDialog = dialog;
    const fixture = createByName("sv-filter-preset-dialog", { holder: holder });
    await settle(fixture);
    // In the dialog's survey, after the fields' frame.
    const panels = queryAll(fixture, ".sd-filter-preset-dialog__content .sd-filter-modal__editor :is(.sd-filter-preset-dialog__fields, .sd-filter-ai-prompt)");
    expect(panels.map((el: HTMLElement): boolean => el.classList.contains("sd-filter-ai-prompt"))).withContext("#1").toEqual([false, true]);
    const block = panels[1];
    expect((<HTMLTextAreaElement>block.querySelector("textarea")).value).withContext("#2").toBe("grown-ups");
    expect(block.querySelector(".sd-filter-ai-prompt__request")?.textContent).withContext("#3").toContain("Make Changes");
    holder.presetDialog = undefined as any;
    await settle(fixture);
    dialog.dispose();
    fixture.destroy();
  });
});
