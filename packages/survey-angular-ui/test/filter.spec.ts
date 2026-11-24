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
// The content drawn next to the host is not destroyed with the fixture: left in the body, its inputs
// would answer another test's lookup by id - a survey numbers its ids anew, so "text_0i" repeats.
function destroy(fixture: ComponentFixture<any>): void {
  fixture.destroy();
  (<any>fixture.componentInstance).embeddedView?.destroy();
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
    destroy(fixture);
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
    destroy(fixture);
    survey.dispose();
  });
  it("a change of the chips measures the row again", async () => {
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1", fields: [{ name: "age" }],
      presets: [{ name: "a", title: "Adults", expression: "{age} > 18" }, { name: "k", title: "Kids", expression: "{age} < 10" }] }] });
    const q = survey.getQuestionByName("f1") as QuestionFilterModel;
    const fixture = renderSurvey(survey);
    await settle(fixture);
    const update = spyOn(q.chipsLayout, "update").and.callThrough();
    q.presets.splice(0, 2);
    await settle(fixture);
    await fixture.whenStable();
    expect(update).toHaveBeenCalled();
    destroy(fixture);
    survey.dispose();
  });
  it("typing in the search box sets the search string and the filter expression; its cross clears it", async () => {
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1", showSearchBar: true, fields: [{ name: "name" }] }] });
    const q = survey.getQuestionByName("f1") as QuestionFilterModel;
    const fixture = renderSurvey(survey);
    await settle(fixture);
    const input = <HTMLInputElement>fixture.nativeElement.querySelector(".sd-filter__search input");
    expect(!!input).withContext("#1: the search box").toBe(true);
    expect([q.combinedExpression, !!fixture.nativeElement.querySelector(".sd-filter__search .sd-filter__search-clear")]).withContext("#2").toEqual(["", false]);
    input.value = "ab";
    input.dispatchEvent(new Event("input"));
    await settle(fixture);
    expect(q.searchString).withContext("#3").toBe("ab");
    expect(q.combinedExpression).withContext("#4: the search filters the records").toContain("ab");
    expect((<HTMLInputElement>fixture.nativeElement.querySelector(".sd-filter__search input")).value).withContext("#5").toBe("ab");
    const clear = <HTMLButtonElement>fixture.nativeElement.querySelector(".sd-filter__search .sd-filter__search-clear");
    expect(clear.getAttribute("title")).withContext("#6: the cross").toBe("Clear");
    clear.click();
    await settle(fixture);
    expect([q.searchString, !!fixture.nativeElement.querySelector(".sd-filter__search .sd-filter__search-clear")]).withContext("#7").toEqual(["", false]);
    destroy(fixture);
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
    destroy(checked);
    const unchecked = renderItem(popup, "France");
    expect(!!getRoot(unchecked).querySelector(".sd-checkbox:not(.sd-checkbox--checked) .sd-checkbox__decorator .sd-checkbox__svg")).withContext("#2: unchecked").toBe(true);
    destroy(unchecked);
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
    destroy(fixture);
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
    destroy(fixture);
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
  it("the Filters dialog shows the search box, the presets with Add New and Edit Selected, a preset's text and the fields", async () => {
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1", showSearchBar: true, allowAddPresets: true, allowEditPresets: true,
      fields: [{ name: "age", title: "Age" }],
      presets: [{ name: "p", title: "Adults", expression: "{age} > 18" }, { name: "raw", title: "Edges", expression: "{age} < 1 or {age} > 99" }] }] });
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
    expect([root().textContent.indexOf("Add New...") > -1, root().textContent.indexOf("Edit Selected...") > -1]).withContext("#4a").toEqual([true, false]);
    const section = root().querySelector(".sd-filter-modal__section[role='group']") as HTMLElement;
    expect(!!section && section.querySelector("#" + section.getAttribute("aria-labelledby"))?.textContent).withContext("#4b: the section is named by its title").toBe("Filter Presets");
    holder.modal.togglePreset(q.getPresetByName("raw"));
    await settle(fixture);
    const expression = root().querySelector(".sd-filter-modal__expression") as HTMLElement;
    expect([root().textContent.indexOf("Edit Selected...") > -1, !!root().querySelector(".sd-filter-modal__preset.sd-action--active")]).withContext("#4c").toEqual([true, true]);
    expect([expression.querySelector(".sd-filter-modal__section-title")?.textContent, expression.querySelector(".sd-filter-modal__expression-text")?.textContent,
      (expression.querySelector("button")?.textContent || "").trim()]).withContext("#4d: the text").toEqual(["Edges Expression", "{age} < 1 or {age} > 99", "Edit..."]);
    const modal = holder.modal;
    holder.modal = undefined as any;
    await settle(fixture);
    modal.dispose();
    expect(root().querySelector(".sd-filter-modal__content")).withContext("#5: an emptied holder unmounts the content").toBe(null);
    destroy(fixture);
  });
  it("Edit Preset shows the form and the fields in a frame - no tabs, no actions; a new form is drawn anew", async () => {
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1", allowEditPresets: true, fields: [{ name: "age" }, { name: "name" }],
      presets: [{ name: "a", title: "Adults", expression: "{age} > 18" },
        { name: "k", title: "Kids", expression: "{age} < 10 and {name} = 'x'" }] }] });
    survey.onAIFilterRequest.add(() => { });
    const q = survey.getQuestionByName("f1") as QuestionFilterModel;
    const holder = new FilterEditorHolder();
    holder.cssClasses = q.cssClasses;
    const dialog = q.createEditPresetDialog("k");
    holder.presetDialog = dialog;
    const fixture = createByName("sv-filter-preset-dialog", { holder: holder });
    await settle(fixture);
    const root = () => getRoot(fixture);
    // The fields' panels in the frame, and the description after it, once each.
    const fields = (): Array<string> => queryAll(fixture, ".sd-filter-modal__editor .sd-filter-preset-dialog__fields .sd-panel__title")
      .map((el: HTMLElement): string => (el.textContent || "").trim());
    const prompts = (): number => queryAll(fixture, ".sd-filter-modal__editor .sd-filter-ai-prompt").length;
    expect([root().querySelector(".sd-filter-preset-dialog__tabs"), root().querySelector(".sd-filter-modal__section")]).withContext("#1: no tabs, no actions")
      .toEqual([null, null]);
    expect((<HTMLInputElement>root().querySelector(".sd-filter-preset-dialog__form input")).value).withContext("#2").toBe("Kids");
    expect([fields(), prompts()]).withContext("#3: the fields and the description").toEqual([["age", "name"], 1]);
    const input = root().querySelector(".sd-filter-preset-dialog__form input");
    dialog.aiPrompt.prompt = "kids only";
    dialog.editAsText();
    await settle(fixture);
    expect(root().querySelector(".sd-filter-preset-dialog__form input") !== input).withContext("#4: a new form is drawn anew, not over the old one").toBe(true);
    const text = (<HTMLTextAreaElement>root().querySelector(".sd-filter-preset-dialog__form textarea")).value;
    expect([text.indexOf("{age} < 10") > -1, fields(), prompts()]).withContext("#5: the text, no fields").toEqual([true, [], 1]);
    expect((<HTMLTextAreaElement>root().querySelector(".sd-filter-ai-prompt textarea")).value).withContext("#5a: the description stays").toBe("kids only");
    holder.presetDialog = undefined as any;
    await settle(fixture);
    dialog.dispose();
    expect(root().querySelector(".sd-filter-preset-dialog__content")).withContext("#6: an emptied holder unmounts the content").toBe(null);
    destroy(fixture);
  });
  it("Save as draws the name and Save; Save adds the preset and closes the popup", async () => {
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1", allowAddPresets: true, fields: [{ name: "age", fieldType: "text", inputType: "number" }] }] });
    const q = survey.getQuestionByName("f1") as QuestionFilterModel;
    q.setFieldCondition("age", "greater", 60);
    let closed = 0;
    const holder = new FilterEditorHolder();
    holder.saveAsPopup = q.createSaveAsPopup(() => { closed++; });
    const fixture = createByName("sv-filter-save-as-popup", { holder: holder });
    await settle(fixture);
    const root = getRoot(fixture);
    expect(!!root.querySelector(".sd-filter-popup .sd-filter-popup__body .sd-filter-editor input")).withContext("#1: the name").toBe(true);
    const save = root.querySelector(".sd-filter-popup__footer button") as HTMLButtonElement;
    expect((save.textContent || "").trim()).withContext("#2").toBe("Save");
    holder.saveAsPopup.survey.setValue("presetTitle", "Seniors");
    save.click();
    expect([q.visiblePresets.map((item) => item.title), q.selectedPreset, closed]).withContext("#3").toEqual([["Seniors"], "userPreset1", 1]);
    destroy(fixture);
    holder.saveAsPopup.dispose();
  });
  // survey-core empties a holder's slot and disposes what it held right after (FilterToolbars.release):
  // drawn later, the content would read a disposed survey - Save as... closing its own popup did.
  it("an emptied holder unmounts its content at once, before what it held is disposed", async () => {
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1", allowAddPresets: true, fields: [{ name: "age", fieldType: "text", inputType: "number" }] }] });
    const q = survey.getQuestionByName("f1") as QuestionFilterModel;
    q.setFieldCondition("age", "greater", 60);
    const holder = new FilterEditorHolder();
    const popup = q.createSaveAsPopup(() => { });
    holder.saveAsPopup = popup;
    const fixture = createByName("sv-filter-save-as-popup", { holder: holder });
    await settle(fixture);
    expect(!!getRoot(fixture).querySelector(".sd-filter-popup .sd-filter-editor input")).withContext("#1").toBe(true);
    holder.saveAsPopup = undefined as any;
    expect(getRoot(fixture).querySelector(".sd-filter-popup")).withContext("#2: gone at once").toBe(null);
    popup.dispose();
    await settle(fixture);
    expect(getRoot(fixture).querySelector(".sd-filter-popup")).withContext("#3").toBe(null);
    destroy(fixture);
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
    destroy(fixture);
    holder.fieldPopup.dispose();
  });
  it("Search in Filters looks among the filters, not the records; nothing found says so; its cross clears it", async () => {
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1", showSearchBar: true, fields: [{ name: "name" }] }] });
    const q = survey.getQuestionByName("f1") as QuestionFilterModel;
    const holder = new FilterEditorHolder();
    holder.cssClasses = q.cssClasses;
    holder.modal = q.createFilterModal();
    const fixture = createByName("sv-filter-modal", { holder: holder });
    await settle(fixture);
    const input = <HTMLInputElement>getRoot(fixture).querySelector(".sd-filter-modal__section input");
    expect(input.getAttribute("placeholder")).withContext("#0").toBe("Search in filters and presets");
    input.value = "zzz";
    input.dispatchEvent(new Event("input"));
    await settle(fixture);
    expect([holder.modal.filterText, holder.modal.searchString, q.searchString]).withContext("#1: not the records' search").toEqual(["zzz", "", ""]);
    expect((<HTMLInputElement>getRoot(fixture).querySelector(".sd-filter-modal__section input")).value).withContext("#2").toBe("zzz");
    expect((getRoot(fixture).querySelector(".sd-filter-modal__nothing-found")?.textContent || "").trim()).withContext("#3").toBe("Nothing found, try different keywords");
    (<HTMLButtonElement>getRoot(fixture).querySelector(".sd-filter-modal__section .sd-filter__search-clear")).click();
    await settle(fixture);
    expect([holder.modal.filterText, !!getRoot(fixture).querySelector(".sd-filter-modal__nothing-found")]).withContext("#4: the cross").toEqual(["", false]);
    const modal = holder.modal;
    holder.modal = undefined as any;
    await settle(fixture);
    modal.dispose();
    destroy(fixture);
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
    destroy(fixture);
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
    destroy(fixture);
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
    destroy(fixture);
    holder.fieldPopup.dispose();
  });
});

describe("The AI description of the preset dialogs", () => {
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
  it("New Preset draws the description and its button; the fields and the name once the model answered", async () => {
    const { q, calls } = setup({ presets: [{ name: "a", title: "Adults", expression: "{age} > 18" }] });
    const holder = new FilterEditorHolder();
    holder.cssClasses = q.cssClasses;
    const dialog = q.createAddPresetDialog([]);
    holder.presetDialog = dialog;
    const fixture = createByName("sv-filter-preset-dialog", { holder: holder });
    await settle(fixture);
    const prompt = (): HTMLElement => queryAll(fixture, ".sd-filter-preset-dialog__content .sd-filter-modal__editor .sd-panel.sd-filter-ai-prompt")[0];
    const fields = (): Array<string> => queryAll(fixture, ".sd-filter-preset-dialog__content .sd-filter-modal__editor .sd-filter-preset-dialog__fields .sd-panel__title")
      .map((el: HTMLElement): string => (el.textContent || "").trim());
    expect(prompt().querySelector(".sd-panel__title")?.textContent).withContext("#1").toContain("Generate a filter with AI");
    expect(prompt().querySelector(".sd-filter-ai-prompt__request")?.textContent).withContext("#2").toContain("Generate Filter");
    expect(fields()).withContext("#3: no fields yet").toEqual([]);
    dialog.aiPrompt.prompt = "adults";
    dialog.aiPrompt.request();
    calls[0].callback({ data: { expression: "{age} > 18", title: "Grown-ups", explanation: "" } });
    await settle(fixture);
    expect(fields()).withContext("#4").toEqual(["age"]);
    expect(queryAll(fixture, ".sd-filter-preset-dialog__form .sd-tagbox-item .sv-string-viewer")
      .map((el: HTMLElement): string => (el.textContent || "").trim())).withContext("#4a: the tagbox of Contains").toEqual(["age"]);
    expect(prompt().querySelector(".sd-filter-ai-prompt__request")?.textContent).withContext("#5").toContain("Edit");
    expect((<HTMLInputElement>queryAll(fixture, ".sd-filter-preset-dialog__form input")[0]).value).withContext("#6: the model's title").toBe("Grown-ups");
    dialog.aiPrompt.errorText = "Something went wrong";
    await settle(fixture);
    expect(prompt().querySelector(".sd-question__erbox")?.textContent).withContext("#7").toContain("Something went wrong");
    holder.presetDialog = undefined as any;
    await settle(fixture);
    dialog.dispose();
    destroy(fixture);
  });
  it("Edit Preset shows the description and Edit", async () => {
    const { q } = setup({ allowEditPresets: true, presets: [{ name: "a", title: "Adults", expression: "{age} > 18" }] });
    const holder = new FilterEditorHolder();
    holder.cssClasses = q.cssClasses;
    const dialog = q.createEditPresetDialog("a");
    holder.presetDialog = dialog;
    const fixture = createByName("sv-filter-preset-dialog", { holder: holder });
    await settle(fixture);
    // In the dialog's survey, after the fields' frame.
    const panels = queryAll(fixture, ".sd-filter-preset-dialog__content .sd-filter-modal__editor :is(.sd-filter-preset-dialog__fields, .sd-filter-ai-prompt)");
    expect(panels.map((el: HTMLElement): boolean => el.classList.contains("sd-filter-ai-prompt"))).withContext("#1").toEqual([false, true]);
    const block = panels[1];
    expect((<HTMLTextAreaElement>block.querySelector("textarea")).value).withContext("#2").toBe("");
    expect(block.querySelector(".sd-filter-ai-prompt__request")?.textContent).withContext("#3").toContain("Edit");
    holder.presetDialog = undefined as any;
    await settle(fixture);
    dialog.dispose();
    destroy(fixture);
  });
});
