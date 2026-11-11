import { describe, test, expect, beforeEach, afterEach } from "vitest";
import { SurveyModel } from "../src/survey";
import { PanelModelBase } from "../src/panel";
import { QuestionPanelDynamicModel } from "../src/question_paneldynamic";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import { ComponentCollection } from "../src/question_custom";
import { ContainerDataNesting } from "../src/container-data-nesting";
import { getDataNestingKindAt } from "../src/data-nesting-key";

// Where a container sits for nested data (its data nesting place), pinned for every kind of place: on the
// survey, in a records question's template, in a record, in a composite's content. The owners of a panel's data
// answer the place (ContainerDataNesting); these answers must not change.

const json = {
  dataNesting: "panelAndPage",
  pages: [{ name: "page1", elements: [
    { type: "panel", name: "top", elements: [{ type: "panel", name: "deep", elements: [{ type: "text", name: "q1" }] }] },
    { type: "paneldynamic", name: "pd", panelCount: 1, templateElements: [
      { type: "panel", name: "pin", elements: [{ type: "panel", name: "pin2", elements: [{ type: "text", name: "q2" }] }] },
      { type: "paneldynamic", name: "pdInner", panelCount: 1, templateElements: [
        { type: "panel", name: "pin3", elements: [{ type: "text", name: "q3" }] }] }
    ] },
    { type: "matrixdynamic", name: "m", rowCount: 1, detailPanelMode: "underRow", columns: [{ name: "c1" }],
      detailElements: [{ type: "panel", name: "din", elements: [{ type: "panel", name: "din2", elements: [{ type: "text", name: "q4" }] }] }] },
    { type: "pinnestingcomp", name: "comp" }
  ] }]
};

interface IPlaceInfo {
  place: string;
  ignored: boolean;
  owner: string;
  keyByName: string;
  keyByValueName: string;
  recordKey: string;
}
const describePanel = (panel: PanelModelBase): IPlaceInfo => {
  const p: any = panel;
  const owner = panel.getRecordsOwner();
  return {
    place: p["getDataNestingPlace"](),
    ignored: p.isDataNestingIgnored(),
    owner: !!owner ? owner.name : null,
    keyByName: panel.getDataNestingKeyFor("", "n"),
    keyByValueName: panel.getDataNestingKeyFor("v", "n"),
    recordKey: (() => {
      const prev = panel.valueName;
      p.setPropertyValueDirectly("valueName", "rv");
      const res = panel.getRecordDataNestingKey();
      p.setPropertyValueDirectly("valueName", prev);
      return res;
    })()
  };
};
const onSurvey: IPlaceInfo = { place: "survey", ignored: false, owner: null, keyByName: "n", keyByValueName: "v", recordKey: "rv" };
const recordPanel = (owner: string): IPlaceInfo => ({ place: "", ignored: true, owner: owner, keyByName: "", keyByValueName: "", recordKey: "rv" });
const inTemplate: IPlaceInfo = { place: "template", ignored: false, owner: null, keyByName: "", keyByValueName: "v", recordKey: "rv" };
const inRecord: IPlaceInfo = { place: "record", ignored: false, owner: null, keyByName: "", keyByValueName: "v", recordKey: "rv" };
const inComposite: IPlaceInfo = { place: "", ignored: true, owner: null, keyByName: "", keyByValueName: "", recordKey: "rv" };

describe("container data nesting: the place of a container", () => {
  beforeEach(() => {
    ComponentCollection.Instance.add({ name: "pinnestingcomp", elementsJSON: [
      { type: "panel", name: "cin", elements: [{ type: "panel", name: "cin2", elements: [{ type: "text", name: "cq" }] }] }
    ] });
  });
  afterEach(() => {
    ComponentCollection.Instance.clear();
  });
  [false, true].forEach(isDesign => {
    test((isDesign ? "design" : "runtime") + ": every place keeps its pinned answer", () => {
      const survey = new SurveyModel();
      if (isDesign) survey.setDesignMode(true);
      survey.fromJSON(json);
      const actual: { [name: string]: IPlaceInfo } = {};
      const expected: { [name: string]: IPlaceInfo } = {};
      const checked: { [name: string]: PanelModelBase } = {};
      const check = (label: string, panel: PanelModelBase, info: IPlaceInfo) => {
        checked[label] = panel;
        actual[label] = describePanel(panel);
        expected[label] = info;
      };
      const page = survey.pages[0];
      check("page", page, onSurvey);
      check("top", <PanelModelBase>page.getElementByName("top"), onSurvey);
      check("deep", <PanelModelBase>page.getElementByName("deep"), onSurvey);

      const pd = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
      check("pd.template", pd.template, recordPanel("pd"));
      check("pd.template/pin", <PanelModelBase>pd.template.getElementByName("pin"), inTemplate);
      check("pd.template/pin2", <PanelModelBase>pd.template.getElementByName("pin2"), inTemplate);
      const pdInnerOfTemplate = <QuestionPanelDynamicModel>pd.template.getQuestionByName("pdInner");
      check("pd.template/pdInner.template", pdInnerOfTemplate.template, recordPanel("pdInner"));
      check("pd.template/pdInner.template/pin3", <PanelModelBase>pdInnerOfTemplate.template.getElementByName("pin3"), inTemplate);
      if (!isDesign) {
        const record = pd.panels[0];
        check("pd.panels[0]", record, recordPanel("pd"));
        check("pd.panels[0]/pin", <PanelModelBase>record.getElementByName("pin"), inRecord);
        check("pd.panels[0]/pin2", <PanelModelBase>record.getElementByName("pin2"), inRecord);
        const pdInner = <QuestionPanelDynamicModel>record.getQuestionByName("pdInner");
        check("pd.panels[0]/pdInner.template", pdInner.template, recordPanel("pdInner"));
        check("pd.panels[0]/pdInner.panels[0]", pdInner.panels[0], recordPanel("pdInner"));
        check("pd.panels[0]/pdInner.panels[0]/pin3", <PanelModelBase>pdInner.panels[0].getElementByName("pin3"), inRecord);
      }

      const m = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
      check("m.detailPanel", m.detailPanel, recordPanel("m"));
      check("m.detailPanel/din", <PanelModelBase>m.detailPanel.getElementByName("din"), inTemplate);
      check("m.detailPanel/din2", <PanelModelBase>m.detailPanel.getElementByName("din2"), inTemplate);
      if (!isDesign) {
        const row = m.visibleRows[0];
        row.showDetailPanel();
        check("row.detailPanel", row.detailPanel, recordPanel("m"));
        check("row.detailPanel/din", <PanelModelBase>row.detailPanel.getElementByName("din"), inRecord);
        check("row.detailPanel/din2", <PanelModelBase>row.detailPanel.getElementByName("din2"), inRecord);
      }

      const content: PanelModelBase = (<any>survey.getQuestionByName("comp")).contentPanel;
      check("comp.contentPanel", content, inComposite);
      check("comp.contentPanel/cin", <PanelModelBase>content.getElementByName("cin"), inComposite);
      check("comp.contentPanel/cin2", <PanelModelBase>content.getElementByName("cin2"), inComposite);

      expect(actual).toEqual(expected);
      for (const label of Object.keys(checked)) {
        expect(ContainerDataNesting.getPlace(checked[label]), label).toBe(expected[label].place);
      }
    });
  });
  test("a page with valueName nests its panels on the survey's data", () => {
    const survey = new SurveyModel({ pages: [{ name: "p", valueName: "pg", elements: [
      { type: "panel", name: "inner", valueName: "address", elements: [{ type: "text", name: "street" }] }] }] });
    const inner = <PanelModelBase>survey.getPanelByName("inner");
    expect(inner["getDataNestingPlace"]()).toBe("survey");
    expect(inner.getDataScopeKey()).toBe("address");
    expect(survey.pages[0].getDataScopeKey()).toBe("pg");
  });
  test("one mapping from a place to the kind the dataNesting table looks up", () => {
    const rows = (["survey", "record", "template", ""] as const).map(place =>
      [place, getDataNestingKindAt(place, "page", false), getDataNestingKindAt(place, "page", true)]);
    expect(rows).toEqual([
      ["survey", "page", "page"],
      ["record", "record", "record"],
      ["template", "", "record"],
      ["", "", ""]
    ]);
  });
  test("a panel's data that answers the place decides it", () => {
    const survey = new SurveyModel({ elements: [
      { type: "panel", name: "root", elements: [{ type: "panel", name: "inner", elements: [{ type: "text", name: "q1" }] }] }] });
    const root = <PanelModelBase>survey.getPanelByName("root");
    const inner = <PanelModelBase>survey.getPanelByName("inner");
    const owner = { getChildDataNestingPlace: (panel: any): string => panel === root ? "record" : undefined };
    root.parent = null;
    Object.defineProperty(root, "data", { get: () => owner, configurable: true });
    expect(ContainerDataNesting.getPlace(root), "the panel the owner holds").toBe("");
    expect(ContainerDataNesting.getPlace(inner), "a panel inside it").toBe("record");
    expect(root.isDataNestingIgnored()).toBe(true);
  });
  [false, true].forEach(isDesign => {
    test((isDesign ? "design" : "runtime") + ", dataNesting none: a template's key is looked up on its owner's survey, also for a choice panel", () => {
      const survey = new SurveyModel();
      if (isDesign) survey.setDesignMode(true);
      survey.fromJSON({ dataNesting: "none", elements: [
        { type: "matrixdynamic", name: "m", rowCount: 1, detailPanelMode: "underRow", columns: [{ name: "c1" }],
          detailElements: [
            { type: "panel", name: "din", elements: [{ type: "text", name: "q4" }] },
            { type: "radiogroup", name: "rg", choices: ["a", { value: "b", elements: [
              { type: "panel", name: "cp", elements: [{ type: "text", name: "q5" }] }] }] }
          ] }
      ] });
      const m = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
      const din = <PanelModelBase>m.detailPanel.getElementByName("din");
      expect(describePanel(din), "a panel in the detail panel template").toEqual(
        { place: "template", ignored: false, owner: null, keyByName: "", keyByValueName: "", recordKey: "" });
      const choicePanel: PanelModelBase = (<any>m.detailPanel.getQuestionByName("rg")).choices[1].panel;
      const cp = <PanelModelBase>choicePanel.getElementByName("cp");
      expect(describePanel(choicePanel), "the choice panel").toEqual(
        { place: "survey", ignored: false, owner: null, keyByName: "", keyByValueName: "", recordKey: "" });
      expect(describePanel(cp), "a panel in the choice panel").toEqual(
        { place: "survey", ignored: false, owner: null, keyByName: "", keyByValueName: "", recordKey: "" });
    });
  });
  test("dataNesting panel: a choice panel in a detail panel template nests by name on its owner's survey", () => {
    const survey = new SurveyModel({ dataNesting: "panel", elements: [
      { type: "matrixdynamic", name: "m", rowCount: 1, detailPanelMode: "underRow", columns: [{ name: "c1" }],
        detailElements: [{ type: "radiogroup", name: "rg", choices: ["a", { value: "b", elements: [
          { type: "panel", name: "cp", elements: [{ type: "text", name: "q5" }] }] }] }] }
    ] });
    const m = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    const choicePanel: PanelModelBase = (<any>m.detailPanel.getQuestionByName("rg")).choices[1].panel;
    expect(choicePanel.getDataNestingKeyFor("", "n")).toBe("n");
    expect((<PanelModelBase>choicePanel.getElementByName("cp")).getDataNestingKeyFor("", "n")).toBe("n");
  });
  test("a dynamic panel's new panel has no records owner before its record is created", () => {
    const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "pd", templateElements: [{ type: "text", name: "q1" }] }] });
    const pd = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
    const panel: PanelModelBase = pd["createAndSetupNewPanelObject"]();
    expect(panel.getRecordsOwner()).toBeNull();
    expect(panel["getDataNestingPlace"]()).toBe("");
  });
});
