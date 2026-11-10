import { SurveyModel } from "../src/survey";
import { Question } from "../src/question";
import { PanelModel } from "../src/panel";
import { ComponentCollection } from "../src/question_custom";
import { SurveyElement } from "../src/survey-element";
import { SurveyVariablePresets } from "../src/variablePresets";
import { tryFocusPage } from "../src/surveyToc";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

// One marker question in every child slot a container question owns.
function createJson(paged: boolean = false): any {
  return {
    elements: [
      { type: "text", name: "root" },
      {
        type: "matrixdynamic", name: "md", rowsVisibleIf: "{row.mdCell} != 'hidden'",
        columns: [{ name: "mdCell", cellType: "text", totalType: "count" }],
        detailPanelMode: "underRow",
        detailElements: [
          { type: "text", name: "mdDetail" },
          { type: "paneldynamic", name: "mdDetailPd", templateElements: [{ type: "text", name: "mdDetailPdItem" }] }
        ],
        ...(paged ? { pageSize: 1 } : {})
      },
      {
        type: "matrixdropdown", name: "mx", rows: ["r1", "r2"], rowsVisibleIf: "{item} != 'r2'",
        columns: [{ name: "mxCell", cellType: "text" }]
      },
      {
        type: "paneldynamic", name: "pd", templateVisibleIf: "{panel.pdItem} != 'hidden'",
        templateElements: [
          { type: "text", name: "pdItem" },
          { type: "panel", name: "pdStatic", elements: [{ type: "text", name: "pdStaticQ" }] },
          { type: "checkbox", name: "pdChoice", choices: [{ value: "a", elements: [{ type: "text", name: "pdChoiceInner" }] }] }
        ],
        ...(paged ? { pageSize: 1 } : {})
      },
      { type: "multipletext", name: "mt", items: [{ name: "mtEditor" }] },
      { type: "nwcustom", name: "cu" },
      { type: "nwcomposite", name: "cp" },
      {
        type: "checkbox", name: "cb",
        choices: [
          { value: "a", elements: [{ type: "text", name: "cbShown" }] },
          { value: "b", elements: [{ type: "text", name: "cbHidden" }] },
          "c",
          { value: "d", elements: [{ type: "text", name: "cbRemoved" }] }
        ]
      },
      { type: "radiogroup", name: "rg", choices: [{ value: "a", elements: [{ type: "text", name: "rgInner" }] }, "b"] }
    ]
  };
}
function createData(suffix: string = ""): any {
  return {
    root: "r" + suffix,
    md: [
      { mdCell: "a" + suffix, mdDetail: "d" + suffix, mdDetailPd: [{ mdDetailPdItem: "x" + suffix }] },
      { mdCell: "hidden", mdDetail: "dh" + suffix },
      { mdCell: "b" + suffix, mdDetail: "d3" + suffix }
    ],
    mx: { r1: { mxCell: "a" + suffix }, r2: { mxCell: "b" + suffix } },
    pd: [{ pdItem: "a" + suffix, pdStaticQ: "s" + suffix, pdChoice: ["a"] }, { pdItem: "hidden", pdStaticQ: "sh" + suffix }],
    pdChoiceInner: "pi" + suffix,
    mt: { mtEditor: "e" + suffix },
    cu: "c" + suffix,
    cp: { cpInner: "i" + suffix, cpNested: "n" + suffix },
    cb: ["a"],
    cbShown: "s" + suffix,
    cbHidden: "h" + suffix,
    rg: "a",
    rgInner: "g" + suffix
  };
}
const containerNames = ["md", "mx", "pd", "mt", "cu", "cp", "cb", "rg"];

// The created-but-empty choice panels: one read and never given elements, one whose last element was removed.
function prepareEmptyChoicePanels(survey: SurveyModel): { read: PanelModel, emptied: PanelModel } {
  const cb: any = survey.getQuestionByName("cb");
  const read: PanelModel = cb.choices[2].panel;
  const emptied: PanelModel = cb.choices[3].panel;
  emptied.removeElement(emptied.elements[0]);
  return { read, emptied };
}
function createSurvey(paged: boolean = false): SurveyModel {
  const survey = new SurveyModel(createJson(paged));
  survey.data = createData();
  // Three visible panels, so that the dynamic panel has a page 2.
  if (paged) survey.setValue("pd", [{ pdItem: "p1" }, { pdItem: "p2" }, { pdItem: "p3" }]);
  prepareEmptyChoicePanels(survey);
  return survey;
}
// What rendering a survey with everything expanded creates.
function buildAll(survey: SurveyModel): void {
  const md: any = survey.getQuestionByName("md");
  md.allRows.forEach((row: any) => {
    row.ensureDetailPanel();
    const inner: any = row.detailPanel?.getQuestionByName("mdDetailPd");
    inner?.panels;
  });
  (<any>survey.getQuestionByName("mx")).allRows;
  (<any>survey.getQuestionByName("pd")).panels;
}

/* The slot of an instance, from the instance tree only. It never builds: the walks decide what gets
   built. Definition objects (the template of a dynamic panel, the template questions of the columns,
   the detail panel template) have no slot. */
function mapInstances(survey: SurveyModel): Map<any, string> {
  const res = new Map<any, string>();
  const add = (q: any, slot: string) => { if (!!q && !res.has(q)) res.set(q, slot); };
  const md: any = survey.getQuestionByName("md");
  (md.generatedVisibleRows || []).forEach((row: any) => {
    const isVisible = row.isVisible;
    row.cells.forEach((cell: any) => add(cell.question, isVisible ? "md.cell" : "md.hiddenRowCell"));
    if (!isVisible || !row.detailPanel) return;
    add(row.detailPanel.getQuestionByName("mdDetail"), "md.detail");
    const inner: any = row.detailPanel.getQuestionByName("mdDetailPd");
    (inner?.["panelsCore"] || []).forEach((p: PanelModel) => add(p.getQuestionByName("mdDetailPdItem"), "md.detail.pd.item"));
  });
  md.generatedTotalRow?.cells.forEach((cell: any) => add(cell.question, "md.total"));
  const mx: any = survey.getQuestionByName("mx");
  (mx.generatedVisibleRows || []).forEach((row: any) => {
    row.cells.forEach((cell: any) => add(cell.question, row.isVisible ? "mx.cell" : "mx.hiddenRowCell"));
  });
  const pd: any = survey.getQuestionByName("pd");
  (pd["panelsCore"] || []).forEach((p: PanelModel) => {
    if (p.getQuestionByName("pdItem").value === "hidden") {
      add(p.getQuestionByName("pdItem"), "pd.hiddenItem");
      return;
    }
    add(p.getQuestionByName("pdItem"), "pd.item");
    add(p.getQuestionByName("pdStaticQ"), "pd.static");
    const choice: any = p.getQuestionByName("pdChoice");
    if (choice.choices[0].isPanelCreated) add(choice.choices[0].panel.getQuestionByName("pdChoiceInner"), "pd.choicePanel");
  });
  const mt: any = survey.getQuestionByName("mt");
  mt.items.forEach((item: any) => add(item.editor, "mt.editor"));
  add((<any>survey.getQuestionByName("cu")).contentQuestion, "cu.content");
  const cp: any = survey.getQuestionByName("cp");
  add(cp.contentPanel?.getQuestionByName("cpInner"), "cp.content");
  add(cp.contentPanel?.getQuestionByName("cpNested"), "cp.nested");
  const cb: any = survey.getQuestionByName("cb");
  if (cb.choices[0].isPanelCreated) add(cb.choices[0].panel.getQuestionByName("cbShown"), "cb.shownPanel");
  if (cb.choices[1].isPanelCreated) add(cb.choices[1].panel.getQuestionByName("cbHidden"), "cb.hiddenPanel");
  const rg: any = survey.getQuestionByName("rg");
  if (rg.choices[0].isPanelCreated) add(rg.choices[0].panel.getQuestionByName("rgInner"), "rg.panel");
  return res;
}
const allSlots = [
  "md.cell", "md.hiddenRowCell", "md.detail", "md.detail.pd.item", "md.total",
  "mx.cell", "mx.hiddenRowCell",
  "pd.item", "pd.hiddenItem", "pd.static", "pd.choicePanel",
  "mt.editor", "cu.content", "cp.content", "cp.nested",
  "cb.shownPanel", "cb.hiddenPanel", "rg.panel"
];

function registerComponents(): void {
  ComponentCollection.Instance.add({ name: "nwcustom", questionJSON: { type: "text" } });
  ComponentCollection.Instance.add({
    name: "nwcomposite",
    elementsJSON: [
      { type: "text", name: "cpInner" },
      { type: "panel", name: "cpPanel", elements: [{ type: "text", name: "cpNested" }] }
    ]
  });
}
// The setup file clears the component collection after every test.
beforeEach(() => {
  registerComponents();
  vi.spyOn(console, "warn").mockImplementation(() => { });
});
afterEach(() => {
  vi.restoreAllMocks();
  ComponentCollection.Instance.clear();
});

/* The names getNestedQuestions(visibleOnly, includeNested, includeItSelf) returns for every container, in
   every combination, and the nested lists of the survey, captured before the walk was shared. */
const parityExpected: { [state: string]: any } = {
  "never rendered": {
    md: { "all": "mdCell,mdCell", "all+self": "md,mdCell,mdCell", "all+nested": "mdCell,mdCell", "all+nested+self": "md,mdCell,mdCell", "visible": "mdCell,mdCell", "visible+self": "md,mdCell,mdCell", "visible+nested": "mdCell,mdCell", "visible+nested+self": "md,mdCell,mdCell" },
    mx: { "all": "mxCell", "all+self": "mx,mxCell", "all+nested": "mxCell", "all+nested+self": "mx,mxCell", "visible": "mxCell", "visible+self": "mx,mxCell", "visible+nested": "mxCell", "visible+nested+self": "mx,mxCell" },
    pd: { "all": "pdItem,pdStaticQ,pdChoice,pdItem,pdStaticQ,pdChoice", "all+self": "pd,pdItem,pdStaticQ,pdChoice,pdItem,pdStaticQ,pdChoice", "all+nested": "pdItem,pdStaticQ,pdChoice,pdChoiceInner,pdItem,pdStaticQ,pdChoice,pdChoiceInner", "all+nested+self": "pd,pdItem,pdStaticQ,pdChoice,pdChoiceInner,pdItem,pdStaticQ,pdChoice,pdChoiceInner", "visible": "pdItem,pdStaticQ,pdChoice", "visible+self": "pd,pdItem,pdStaticQ,pdChoice", "visible+nested": "pdItem,pdStaticQ,pdChoice,pdChoiceInner", "visible+nested+self": "pd,pdItem,pdStaticQ,pdChoice,pdChoiceInner" },
    mt: { "all": "mtEditor", "all+self": "mt,mtEditor", "all+nested": "mtEditor", "all+nested+self": "mt,mtEditor", "visible": "mtEditor", "visible+self": "mt,mtEditor", "visible+nested": "mtEditor", "visible+nested+self": "mt,mtEditor" },
    cu: { "all": "", "all+self": "cu", "all+nested": "", "all+nested+self": "cu", "visible": "", "visible+self": "cu", "visible+nested": "", "visible+nested+self": "cu" },
    cp: { "all": "cpInner,cpNested", "all+self": "cp,cpInner,cpNested", "all+nested": "cpInner,cpNested", "all+nested+self": "cp,cpInner,cpNested", "visible": "cpInner,cpNested", "visible+self": "cp,cpInner,cpNested", "visible+nested": "cpInner,cpNested", "visible+nested+self": "cp,cpInner,cpNested" },
    cb: { "all": "", "all+self": "cb", "all+nested": "cb,cbShown,cbHidden", "all+nested+self": "cb,cbShown,cbHidden", "visible": "", "visible+self": "cb", "visible+nested": "cb,cbShown", "visible+nested+self": "cb,cbShown" },
    rg: { "all": "", "all+self": "rg", "all+nested": "rg,rgInner", "all+nested+self": "rg,rgInner", "visible": "", "visible+self": "rg", "visible+nested": "rg,rgInner", "visible+nested+self": "rg,rgInner" },
    "survey: all": "root,md,mdCell,mdCell,mx,mxCell,pd,pdItem,pdStaticQ,pdChoice,pdChoiceInner,pdItem,pdStaticQ,pdChoice,pdChoiceInner,mt,mtEditor,cu,cp,cpInner,cpNested,cb,cbShown,cbHidden,rg,rgInner",
    "survey: visible": "root,md,mdCell,mdCell,mx,mxCell,pd,pdItem,pdStaticQ,pdChoice,pdChoiceInner,mt,mtEditor,cu,cp,cpInner,cpNested,cb,cbShown,rg,rgInner"
  },
  "rendered": {
    md: { "all": "mdCell,mdDetail,mdDetailPd,mdCell,mdDetail,mdDetailPd", "all+self": "md,mdCell,mdDetail,mdDetailPd,mdCell,mdDetail,mdDetailPd", "all+nested": "mdCell,mdDetail,mdDetailPdItem,mdCell,mdDetail", "all+nested+self": "md,mdCell,mdDetail,mdDetailPd,mdDetailPdItem,mdCell,mdDetail,mdDetailPd", "visible": "mdCell,mdDetail,mdDetailPd,mdCell,mdDetail,mdDetailPd", "visible+self": "md,mdCell,mdDetail,mdDetailPd,mdCell,mdDetail,mdDetailPd", "visible+nested": "mdCell,mdDetail,mdDetailPdItem,mdCell,mdDetail", "visible+nested+self": "md,mdCell,mdDetail,mdDetailPd,mdDetailPdItem,mdCell,mdDetail,mdDetailPd" },
    mx: { "all": "mxCell", "all+self": "mx,mxCell", "all+nested": "mxCell", "all+nested+self": "mx,mxCell", "visible": "mxCell", "visible+self": "mx,mxCell", "visible+nested": "mxCell", "visible+nested+self": "mx,mxCell" },
    pd: { "all": "pdItem,pdStaticQ,pdChoice,pdItem,pdStaticQ,pdChoice", "all+self": "pd,pdItem,pdStaticQ,pdChoice,pdItem,pdStaticQ,pdChoice", "all+nested": "pdItem,pdStaticQ,pdChoice,pdChoiceInner,pdItem,pdStaticQ,pdChoice,pdChoiceInner", "all+nested+self": "pd,pdItem,pdStaticQ,pdChoice,pdChoiceInner,pdItem,pdStaticQ,pdChoice,pdChoiceInner", "visible": "pdItem,pdStaticQ,pdChoice", "visible+self": "pd,pdItem,pdStaticQ,pdChoice", "visible+nested": "pdItem,pdStaticQ,pdChoice,pdChoiceInner", "visible+nested+self": "pd,pdItem,pdStaticQ,pdChoice,pdChoiceInner" },
    mt: { "all": "mtEditor", "all+self": "mt,mtEditor", "all+nested": "mtEditor", "all+nested+self": "mt,mtEditor", "visible": "mtEditor", "visible+self": "mt,mtEditor", "visible+nested": "mtEditor", "visible+nested+self": "mt,mtEditor" },
    cu: { "all": "", "all+self": "cu", "all+nested": "", "all+nested+self": "cu", "visible": "", "visible+self": "cu", "visible+nested": "", "visible+nested+self": "cu" },
    cp: { "all": "cpInner,cpNested", "all+self": "cp,cpInner,cpNested", "all+nested": "cpInner,cpNested", "all+nested+self": "cp,cpInner,cpNested", "visible": "cpInner,cpNested", "visible+self": "cp,cpInner,cpNested", "visible+nested": "cpInner,cpNested", "visible+nested+self": "cp,cpInner,cpNested" },
    cb: { "all": "", "all+self": "cb", "all+nested": "cb,cbShown,cbHidden", "all+nested+self": "cb,cbShown,cbHidden", "visible": "", "visible+self": "cb", "visible+nested": "cb,cbShown,cbHidden", "visible+nested+self": "cb,cbShown,cbHidden" },
    rg: { "all": "", "all+self": "rg", "all+nested": "rg,rgInner", "all+nested+self": "rg,rgInner", "visible": "", "visible+self": "rg", "visible+nested": "rg,rgInner", "visible+nested+self": "rg,rgInner" },
    "survey: all": "root,md,mdCell,mdDetail,mdDetailPd,mdDetailPdItem,mdCell,mdDetail,mdDetailPd,mx,mxCell,pd,pdItem,pdStaticQ,pdChoice,pdChoiceInner,pdItem,pdStaticQ,pdChoice,pdChoiceInner,mt,mtEditor,cu,cp,cpInner,cpNested,cb,cbShown,cbHidden,rg,rgInner",
    "survey: visible": "root,md,mdCell,mdDetail,mdDetailPd,mdDetailPdItem,mdCell,mdDetail,mdDetailPd,mx,mxCell,pd,pdItem,pdStaticQ,pdChoice,pdChoiceInner,mt,mtEditor,cu,cp,cpInner,cpNested,cb,cbShown,cbHidden,rg,rgInner"
  },
  "matrix update locked": {
    md: { "all": "", "all+self": "md", "all+nested": "", "all+nested+self": "md", "visible": "", "visible+self": "md", "visible+nested": "", "visible+nested+self": "md" },
    mx: { "all": "mxCell", "all+self": "mx,mxCell", "all+nested": "mxCell", "all+nested+self": "mx,mxCell", "visible": "mxCell", "visible+self": "mx,mxCell", "visible+nested": "mxCell", "visible+nested+self": "mx,mxCell" },
    pd: { "all": "pdItem,pdStaticQ,pdChoice,pdItem,pdStaticQ,pdChoice", "all+self": "pd,pdItem,pdStaticQ,pdChoice,pdItem,pdStaticQ,pdChoice", "all+nested": "pdItem,pdStaticQ,pdChoice,pdChoiceInner,pdItem,pdStaticQ,pdChoice,pdChoiceInner", "all+nested+self": "pd,pdItem,pdStaticQ,pdChoice,pdChoiceInner,pdItem,pdStaticQ,pdChoice,pdChoiceInner", "visible": "pdItem,pdStaticQ,pdChoice", "visible+self": "pd,pdItem,pdStaticQ,pdChoice", "visible+nested": "pdItem,pdStaticQ,pdChoice,pdChoiceInner", "visible+nested+self": "pd,pdItem,pdStaticQ,pdChoice,pdChoiceInner" },
    mt: { "all": "mtEditor", "all+self": "mt,mtEditor", "all+nested": "mtEditor", "all+nested+self": "mt,mtEditor", "visible": "mtEditor", "visible+self": "mt,mtEditor", "visible+nested": "mtEditor", "visible+nested+self": "mt,mtEditor" },
    cu: { "all": "", "all+self": "cu", "all+nested": "", "all+nested+self": "cu", "visible": "", "visible+self": "cu", "visible+nested": "", "visible+nested+self": "cu" },
    cp: { "all": "cpInner,cpNested", "all+self": "cp,cpInner,cpNested", "all+nested": "cpInner,cpNested", "all+nested+self": "cp,cpInner,cpNested", "visible": "cpInner,cpNested", "visible+self": "cp,cpInner,cpNested", "visible+nested": "cpInner,cpNested", "visible+nested+self": "cp,cpInner,cpNested" },
    cb: { "all": "", "all+self": "cb", "all+nested": "cb,cbShown,cbHidden", "all+nested+self": "cb,cbShown,cbHidden", "visible": "", "visible+self": "cb", "visible+nested": "cb,cbShown", "visible+nested+self": "cb,cbShown" },
    rg: { "all": "", "all+self": "rg", "all+nested": "rg,rgInner", "all+nested+self": "rg,rgInner", "visible": "", "visible+self": "rg", "visible+nested": "rg,rgInner", "visible+nested+self": "rg,rgInner" },
    "survey: all": "root,md,mx,mxCell,pd,pdItem,pdStaticQ,pdChoice,pdChoiceInner,pdItem,pdStaticQ,pdChoice,pdChoiceInner,mt,mtEditor,cu,cp,cpInner,cpNested,cb,cbShown,cbHidden,rg,rgInner",
    "survey: visible": "root,md,mx,mxCell,pd,pdItem,pdStaticQ,pdChoice,pdChoiceInner,mt,mtEditor,cu,cp,cpInner,cpNested,cb,cbShown,rg,rgInner"
  },
  "matrix update released": {
    md: { "all": "mdCell,mdCell", "all+self": "md,mdCell,mdCell", "all+nested": "mdCell,mdCell", "all+nested+self": "md,mdCell,mdCell", "visible": "mdCell,mdCell", "visible+self": "md,mdCell,mdCell", "visible+nested": "mdCell,mdCell", "visible+nested+self": "md,mdCell,mdCell" },
    mx: { "all": "mxCell", "all+self": "mx,mxCell", "all+nested": "mxCell", "all+nested+self": "mx,mxCell", "visible": "mxCell", "visible+self": "mx,mxCell", "visible+nested": "mxCell", "visible+nested+self": "mx,mxCell" },
    pd: { "all": "pdItem,pdStaticQ,pdChoice,pdItem,pdStaticQ,pdChoice", "all+self": "pd,pdItem,pdStaticQ,pdChoice,pdItem,pdStaticQ,pdChoice", "all+nested": "pdItem,pdStaticQ,pdChoice,pdChoiceInner,pdItem,pdStaticQ,pdChoice,pdChoiceInner", "all+nested+self": "pd,pdItem,pdStaticQ,pdChoice,pdChoiceInner,pdItem,pdStaticQ,pdChoice,pdChoiceInner", "visible": "pdItem,pdStaticQ,pdChoice", "visible+self": "pd,pdItem,pdStaticQ,pdChoice", "visible+nested": "pdItem,pdStaticQ,pdChoice,pdChoiceInner", "visible+nested+self": "pd,pdItem,pdStaticQ,pdChoice,pdChoiceInner" },
    mt: { "all": "mtEditor", "all+self": "mt,mtEditor", "all+nested": "mtEditor", "all+nested+self": "mt,mtEditor", "visible": "mtEditor", "visible+self": "mt,mtEditor", "visible+nested": "mtEditor", "visible+nested+self": "mt,mtEditor" },
    cu: { "all": "", "all+self": "cu", "all+nested": "", "all+nested+self": "cu", "visible": "", "visible+self": "cu", "visible+nested": "", "visible+nested+self": "cu" },
    cp: { "all": "cpInner,cpNested", "all+self": "cp,cpInner,cpNested", "all+nested": "cpInner,cpNested", "all+nested+self": "cp,cpInner,cpNested", "visible": "cpInner,cpNested", "visible+self": "cp,cpInner,cpNested", "visible+nested": "cpInner,cpNested", "visible+nested+self": "cp,cpInner,cpNested" },
    cb: { "all": "", "all+self": "cb", "all+nested": "cb,cbShown,cbHidden", "all+nested+self": "cb,cbShown,cbHidden", "visible": "", "visible+self": "cb", "visible+nested": "cb,cbShown", "visible+nested+self": "cb,cbShown" },
    rg: { "all": "", "all+self": "rg", "all+nested": "rg,rgInner", "all+nested+self": "rg,rgInner", "visible": "", "visible+self": "rg", "visible+nested": "rg,rgInner", "visible+nested+self": "rg,rgInner" },
    "survey: all": "root,md,mdCell,mdCell,mx,mxCell,pd,pdItem,pdStaticQ,pdChoice,pdChoiceInner,pdItem,pdStaticQ,pdChoice,pdChoiceInner,mt,mtEditor,cu,cp,cpInner,cpNested,cb,cbShown,cbHidden,rg,rgInner",
    "survey: visible": "root,md,mdCell,mdCell,mx,mxCell,pd,pdItem,pdStaticQ,pdChoice,pdChoiceInner,mt,mtEditor,cu,cp,cpInner,cpNested,cb,cbShown,rg,rgInner"
  },
  "one detail panel": {
    md: { "all": "mdCell,mdDetail,mdDetailPd,mdCell", "all+self": "md,mdCell,mdDetail,mdDetailPd,mdCell", "all+nested": "mdCell,mdDetail,mdCell", "all+nested+self": "md,mdCell,mdDetail,mdDetailPd,mdCell", "visible": "mdCell,mdDetail,mdDetailPd,mdCell", "visible+self": "md,mdCell,mdDetail,mdDetailPd,mdCell", "visible+nested": "mdCell,mdDetail,mdCell", "visible+nested+self": "md,mdCell,mdDetail,mdDetailPd,mdCell" },
    mx: { "all": "mxCell", "all+self": "mx,mxCell", "all+nested": "mxCell", "all+nested+self": "mx,mxCell", "visible": "mxCell", "visible+self": "mx,mxCell", "visible+nested": "mxCell", "visible+nested+self": "mx,mxCell" },
    pd: { "all": "pdItem,pdStaticQ,pdChoice,pdItem,pdStaticQ,pdChoice", "all+self": "pd,pdItem,pdStaticQ,pdChoice,pdItem,pdStaticQ,pdChoice", "all+nested": "pdItem,pdStaticQ,pdChoice,pdChoiceInner,pdItem,pdStaticQ,pdChoice,pdChoiceInner", "all+nested+self": "pd,pdItem,pdStaticQ,pdChoice,pdChoiceInner,pdItem,pdStaticQ,pdChoice,pdChoiceInner", "visible": "pdItem,pdStaticQ,pdChoice", "visible+self": "pd,pdItem,pdStaticQ,pdChoice", "visible+nested": "pdItem,pdStaticQ,pdChoice,pdChoiceInner", "visible+nested+self": "pd,pdItem,pdStaticQ,pdChoice,pdChoiceInner" },
    mt: { "all": "mtEditor", "all+self": "mt,mtEditor", "all+nested": "mtEditor", "all+nested+self": "mt,mtEditor", "visible": "mtEditor", "visible+self": "mt,mtEditor", "visible+nested": "mtEditor", "visible+nested+self": "mt,mtEditor" },
    cu: { "all": "", "all+self": "cu", "all+nested": "", "all+nested+self": "cu", "visible": "", "visible+self": "cu", "visible+nested": "", "visible+nested+self": "cu" },
    cp: { "all": "cpInner,cpNested", "all+self": "cp,cpInner,cpNested", "all+nested": "cpInner,cpNested", "all+nested+self": "cp,cpInner,cpNested", "visible": "cpInner,cpNested", "visible+self": "cp,cpInner,cpNested", "visible+nested": "cpInner,cpNested", "visible+nested+self": "cp,cpInner,cpNested" },
    cb: { "all": "", "all+self": "cb", "all+nested": "cb,cbShown,cbHidden", "all+nested+self": "cb,cbShown,cbHidden", "visible": "", "visible+self": "cb", "visible+nested": "cb,cbShown", "visible+nested+self": "cb,cbShown" },
    rg: { "all": "", "all+self": "rg", "all+nested": "rg,rgInner", "all+nested+self": "rg,rgInner", "visible": "", "visible+self": "rg", "visible+nested": "rg,rgInner", "visible+nested+self": "rg,rgInner" },
    "survey: all": "root,md,mdCell,mdDetail,mdDetailPd,mdCell,mx,mxCell,pd,pdItem,pdStaticQ,pdChoice,pdChoiceInner,pdItem,pdStaticQ,pdChoice,pdChoiceInner,mt,mtEditor,cu,cp,cpInner,cpNested,cb,cbShown,cbHidden,rg,rgInner",
    "survey: visible": "root,md,mdCell,mdDetail,mdDetailPd,mdCell,mx,mxCell,pd,pdItem,pdStaticQ,pdChoice,pdChoiceInner,mt,mtEditor,cu,cp,cpInner,cpNested,cb,cbShown,rg,rgInner"
  },
  "paged": {
    md: { "all": "mdCell,mdDetail,mdDetailPd", "all+self": "md,mdCell,mdDetail,mdDetailPd", "all+nested": "mdCell,mdDetail", "all+nested+self": "md,mdCell,mdDetail,mdDetailPd", "visible": "mdCell,mdDetail,mdDetailPd", "visible+self": "md,mdCell,mdDetail,mdDetailPd", "visible+nested": "mdCell,mdDetail", "visible+nested+self": "md,mdCell,mdDetail,mdDetailPd" },
    mx: { "all": "mxCell", "all+self": "mx,mxCell", "all+nested": "mxCell", "all+nested+self": "mx,mxCell", "visible": "mxCell", "visible+self": "mx,mxCell", "visible+nested": "mxCell", "visible+nested+self": "mx,mxCell" },
    pd: { "all": "pdItem,pdStaticQ,pdChoice", "all+self": "pd,pdItem,pdStaticQ,pdChoice", "all+nested": "pdItem,pdStaticQ,pdChoice,pdChoiceInner", "all+nested+self": "pd,pdItem,pdStaticQ,pdChoice,pdChoiceInner", "visible": "pdItem,pdStaticQ,pdChoice", "visible+self": "pd,pdItem,pdStaticQ,pdChoice", "visible+nested": "pdItem,pdStaticQ,pdChoice", "visible+nested+self": "pd,pdItem,pdStaticQ,pdChoice" },
    mt: { "all": "mtEditor", "all+self": "mt,mtEditor", "all+nested": "mtEditor", "all+nested+self": "mt,mtEditor", "visible": "mtEditor", "visible+self": "mt,mtEditor", "visible+nested": "mtEditor", "visible+nested+self": "mt,mtEditor" },
    cu: { "all": "", "all+self": "cu", "all+nested": "", "all+nested+self": "cu", "visible": "", "visible+self": "cu", "visible+nested": "", "visible+nested+self": "cu" },
    cp: { "all": "cpInner,cpNested", "all+self": "cp,cpInner,cpNested", "all+nested": "cpInner,cpNested", "all+nested+self": "cp,cpInner,cpNested", "visible": "cpInner,cpNested", "visible+self": "cp,cpInner,cpNested", "visible+nested": "cpInner,cpNested", "visible+nested+self": "cp,cpInner,cpNested" },
    cb: { "all": "", "all+self": "cb", "all+nested": "cb,cbShown,cbHidden", "all+nested+self": "cb,cbShown,cbHidden", "visible": "", "visible+self": "cb", "visible+nested": "cb,cbShown", "visible+nested+self": "cb,cbShown" },
    rg: { "all": "", "all+self": "rg", "all+nested": "rg,rgInner", "all+nested+self": "rg,rgInner", "visible": "", "visible+self": "rg", "visible+nested": "rg,rgInner", "visible+nested+self": "rg,rgInner" },
    "survey: all": "root,md,mdCell,mdDetail,mdDetailPd,mx,mxCell,pd,pdItem,pdStaticQ,pdChoice,pdChoiceInner,mt,mtEditor,cu,cp,cpInner,cpNested,cb,cbShown,cbHidden,rg,rgInner",
    "survey: visible": "root,md,mdCell,mdDetail,mdDetailPd,mx,mxCell,pd,pdItem,pdStaticQ,pdChoice,mt,mtEditor,cu,cp,cpInner,cpNested,cb,cbShown,rg,rgInner"
  }
};

describe("getNestedQuestions(): the lists every container gives", () => {
  function names(questions: Array<Question>): string {
    return questions.map(q => q.name).join(",");
  }
  function collect(survey: SurveyModel): any {
    const res: any = {};
    containerNames.forEach(name => {
      const q = survey.getQuestionByName(name);
      const lists: any = {};
      [false, true].forEach(visibleOnly => [false, true].forEach(includeNested => [false, true].forEach(includeItSelf => {
        const key = (visibleOnly ? "visible" : "all") + (includeNested ? "+nested" : "") + (includeItSelf ? "+self" : "");
        lists[key] = names(q.getNestedQuestions(visibleOnly, includeNested, includeItSelf));
      })));
      res[name] = lists;
    });
    res["survey: all"] = names(survey.getAllQuestions(false, false, true));
    res["survey: visible"] = names(survey.getAllQuestions(true, false, true));
    return res;
  }
  test("a survey that was never rendered", () => {
    // A matrix generates its rows on the first getNestedQuestions() call: visibleRows builds them, as it always has.
    const survey = createSurvey();
    expect(collect(survey)).toEqual(parityExpected["never rendered"]);
  });
  test("a rendered survey with every row, item, detail panel and choice panel built and showing", () => {
    const survey = createSurvey();
    buildAll(survey);
    survey.setValue("cb", ["a", "b"]);
    expect(collect(survey)).toEqual(parityExpected["rendered"]);
  });
  test("a matrix under beginUpdate() and after endUpdate()", () => {
    const survey = createSurvey();
    buildAll(survey);
    const md: any = survey.getQuestionByName("md");
    md.beginUpdate();
    expect(collect(survey)).toEqual(parityExpected["matrix update locked"]);
    md.endUpdate();
    expect(collect(survey)).toEqual(parityExpected["matrix update released"]);
  });
  test("one detail panel created and another not", () => {
    const survey = createSurvey();
    const md: any = survey.getQuestionByName("md");
    md.visibleRows[0].ensureDetailPanel();
    expect(collect(survey)).toEqual(parityExpected["one detail panel"]);
  });
  test("a paged dynamic panel and a paged matrix on page 2, where a position is not a record index", () => {
    const survey = createSurvey(true);
    const md: any = survey.getQuestionByName("md");
    const pd: any = survey.getQuestionByName("pd");
    md.visibleRows;
    pd.panels;
    md.pageIndex = 1;
    pd.pageIndex = 1;
    buildAll(survey);
    expect(collect(survey)).toEqual(parityExpected["paged"]);
  });
});

/* Conformance: which walk reaches which slot. A walk is triggered the way a survey triggers it, and a
   slot is reached when the walk calls the observed method on an instance in it. A walk runs twice: on
   a survey nobody rendered, where a slot reached through an instance the walk created is "builds", and
   on a survey with everything built. */
type Reach = boolean | "builds";
interface IWalk {
  methods?: Array<string>;
  trigger: (survey: SurveyModel) => void;
  // The instances a walk returns instead of calling them.
  result?: (survey: SurveyModel) => Array<any>;
  // A walk that runs on a survey nobody rendered only.
  freshOnly?: boolean;
  // A walk the survey runs while it is created: what it reaches then is reached, not built.
  duringCreation?: boolean;
}
function forEachContainer(survey: SurveyModel, func: (q: any) => void): void {
  containerNames.forEach(name => func(survey.getQuestionByName(name)));
}
const walks: { [name: string]: IWalk } = {
  "getNestedQuestions": { trigger: () => { }, result: (survey) => survey.getAllQuestions(false, false, true) },
  "initializeForVerification": { methods: ["initializeForVerification"], trigger: (survey) => survey.setData(createData("2")) },
  "verifyData": { methods: ["verifyDataCore"], trigger: (survey) => survey.setData(createData("2")) },
  "clearIncorrectValues": { methods: ["clearIncorrectValues"], trigger: (survey) => survey.clearIncorrectValues(true) },
  "runCondition": { methods: ["runCondition"], trigger: (survey) => survey.setVariable("nwv", 1) },
  "validate": { methods: ["validateElement", "validate"], trigger: (survey) => survey.validate(false, false) },
  "getAllErrors": { methods: ["getAllErrors"], trigger: (survey) => forEachContainer(survey, q => q.getAllErrors()) },
  "clearErrors": { methods: ["clearErrors"], trigger: (survey) => forEachContainer(survey, q => q.clearErrors()) },
  "onAnyValueChanged": { methods: ["onAnyValueChanged"], trigger: (survey) => survey.setValue("root", "changed") },
  "runTriggers": { methods: ["runTriggers"], trigger: (survey) => survey.setValue("root", "changed") },
  "runTriggersOnFirstBuild": {
    methods: ["runTriggers"], freshOnly: true,
    // A value assigned before the rows and panels exist arms the triggers they run once built.
    trigger: (survey) => { const data = createData("2"); ["md", "mx", "pd"].forEach(name => survey.setValue(name, data[name])); buildAll(survey); }
  },
  "onSurveyValueChanged": {
    methods: ["onSurveyValueChanged"],
    trigger: (survey) => { const data = createData("2"); containerNames.forEach(name => survey.setValue(name, data[name])); }
  },
  "updateValueFromSurvey": { methods: ["updateValueFromSurvey"], trigger: (survey) => { survey.data = createData("2"); } },
  "clearValueIfInvisible": { methods: ["clearValueIfInvisible"], trigger: (survey) => (<any>survey).clearInvisibleQuestionValues() },
  "setSurveyImpl": { methods: ["setSurveyImpl"], trigger: (survey) => forEachContainer(survey, q => q.setSurveyImpl(survey)) },
  "locStrsChanged": { methods: ["locStrsChanged"], trigger: (survey) => survey.locStrsChanged() },
  "localeChanged": { methods: ["localeChanged"], trigger: (survey) => { survey.locale = "de"; } },
  "addUsedLocales": { methods: ["addUsedLocales"], trigger: (survey) => survey.getUsedLocales() },
  "onSurveyLoad": { methods: ["onSurveyLoad"], trigger: (survey) => forEachContainer(survey, q => q.onSurveyLoad()) },
  // A survey renders its current page when it is created.
  "onFirstRendering": { methods: ["onFirstRendering"], freshOnly: true, duringCreation: true, trigger: () => { } },
  "onHidingContent": { methods: ["onHidingContent"], trigger: (survey) => forEachContainer(survey, q => q.onHidingContent()) },
  "updateElementCss": { methods: ["updateElementCss"], trigger: (survey) => forEachContainer(survey, q => q.updateElementCss(true)) },
  "setIsMobile": { methods: ["setIsMobile"], trigger: (survey) => survey.setIsMobile(true) },
  "themeChanged": { methods: ["themeChanged"], trigger: (survey) => survey.applyTheme({ cssVariables: {} }) },
  "setVisibleIndex": { methods: ["setVisibleIndex"], trigger: (survey) => (<any>survey).updateVisibleIndexes() },
  "getProgressInfo": { methods: ["getProgressInfo"], trigger: (survey) => survey.getProgressInfo() },
  "getFirstInputElementId": {
    trigger: () => { },
    // A container returns the input id of a nested question.
    result: (survey) => {
      const ids: Array<string> = [];
      forEachContainer(survey, q => ids.push(q.getFirstInputElementId()));
      return Array.from(mapInstances(survey).keys()).filter(q => ids.indexOf(q.inputId) > -1);
    }
  },
  "focus": { methods: ["focus"], trigger: (survey) => forEachContainer(survey, q => q.focus()) },
  "getQuestionFromArray": {
    trigger: () => { },
    result: (survey) => {
      const res: Array<any> = [];
      ["md", "pd"].forEach(name => {
        const q: any = survey.getQuestionByName(name);
        ["mdCell", "mdDetail", "pdItem", "pdStaticQ", "pdChoiceInner"].forEach(qName => [0, 1, 2].forEach(index => res.push(q.getQuestionFromArray(qName, index))));
      });
      return res;
    }
  },
  "getPanels": {
    trigger: () => { },
    result: (survey) => {
      const res: Array<any> = [];
      forEachContainer(survey, q => (q.getPanels() || []).forEach((p: any) => p.questions.forEach((pq: any) => res.push(pq))));
      return res;
    }
  },
  "onReadOnlyChanged": { methods: ["onReadOnlyChanged"], trigger: (survey) => { survey.readOnly = true; } },
  "dispose": { methods: ["dispose"], trigger: (survey) => survey.dispose() },
};
function runWalk(walk: IWalk, isBuilt: boolean): { reached: Set<string>, built: Set<string> } {
  const touched = new Set<any>();
  const spy = () => (walk.methods || []).forEach(method => {
    const proto: any = Question.prototype;
    const original = proto[method];
    vi.spyOn(proto, method).mockImplementation(function (this: any, ...args: Array<any>) {
      touched.add(this);
      return original.apply(this, args);
    });
  });
  if (walk.duringCreation) spy();
  const survey = createSurvey();
  if (isBuilt) buildAll(survey);
  const before = walk.duringCreation ? new Map<any, string>() : mapInstances(survey);
  if (!walk.duringCreation) spy();
  walk.trigger(survey);
  if (walk.result) walk.result(survey).forEach(q => touched.add(q));
  vi.restoreAllMocks();
  let after = before;
  try { after = mapInstances(survey); } catch{ /* a disposed survey */ }
  const reached = new Set<string>();
  const built = new Set<string>();
  touched.forEach(q => {
    const slot = before.get(q) || after.get(q);
    if (!slot) return;
    reached.add(slot);
    if (!before.has(q) && !walk.duringCreation) built.add(slot);
  });
  return { reached, built };
}
function getReach(walk: IWalk): { [slot: string]: Reach } {
  const fresh = runWalk(walk, false);
  const built = walk.freshOnly ? { reached: new Set<string>(), built: new Set<string>() } : runWalk(walk, true);
  const res: { [slot: string]: Reach } = {};
  allSlots.forEach(slot => {
    res[slot] = fresh.built.has(slot) ? "builds" : (built.reached.has(slot) || fresh.reached.has(slot));
  });
  return res;
}

/* What every walk reaches today. A slot that is not listed is not reached; the comment above a walk
   says why for each such slot. "builds": the walk creates the instance it reaches (rows, detail panels).
   A walk that loses a slot, or reaches a new one, fails here: change the table together with the walk. */
const expectedReach: { [walk: string]: { reached: Array<string>, builds?: Array<string> } } = {
  // hidden rows: visibleRows drops them. total row: not listed. custom content: holds the wrapper's value, never listed.
  "getNestedQuestions": {
    reached: ["md.detail", "md.detail.pd.item", "pd.item", "pd.hiddenItem", "pd.static", "pd.choicePanel", "mt.editor", "cp.content", "cp.nested", "cb.shownPanel", "cb.hiddenPanel", "rg.panel"],
    builds: ["md.cell", "mx.cell"]
  },
  // total row: not a value holder for verification.
  "initializeForVerification": {
    reached: ["pd.item", "pd.hiddenItem", "pd.static", "pd.choicePanel", "mt.editor", "cu.content", "cp.content", "cp.nested", "cb.shownPanel", "cb.hiddenPanel", "rg.panel"],
    builds: ["md.cell", "md.hiddenRowCell", "md.detail", "md.detail.pd.item", "mx.cell", "mx.hiddenRowCell"]
  },
  // total row: not a value holder for verification.
  "verifyData": {
    reached: ["pd.item", "pd.hiddenItem", "pd.static", "pd.choicePanel", "mt.editor", "cu.content", "cp.content", "cp.nested", "cb.shownPanel", "cb.hiddenPanel", "rg.panel"],
    builds: ["md.cell", "md.hiddenRowCell", "md.detail", "md.detail.pd.item", "mx.cell", "mx.hiddenRowCell"]
  },
  // total row: not cleaned. dropdown matrix hidden row: the matrix drops the answer of a hidden row, so no cell of it is judged.
  "clearIncorrectValues": {
    reached: ["md.detail.pd.item", "pd.item", "pd.hiddenItem", "pd.static", "pd.choicePanel", "mt.editor", "cu.content", "cp.content", "cp.nested", "cb.shownPanel", "cb.hiddenPanel", "rg.panel"],
    builds: ["md.cell", "md.hiddenRowCell", "md.detail", "mx.cell"]
  },
  "runCondition": {
    reached: ["md.cell", "md.hiddenRowCell", "md.detail", "md.detail.pd.item", "md.total", "mx.cell", "mx.hiddenRowCell", "pd.item", "pd.hiddenItem", "pd.static", "pd.choicePanel", "mt.editor", "cu.content", "cp.content", "cp.nested", "cb.shownPanel", "cb.hiddenPanel", "rg.panel"]
  },
  // hidden rows, the hidden item and the panel of an unselected choice: only what is visible is validated. total row: not validated.
  "validate": {
    reached: ["pd.item", "pd.static", "pd.choicePanel", "mt.editor", "cu.content", "cp.content", "cp.nested", "cb.shownPanel", "rg.panel"],
    builds: ["md.cell", "md.detail", "md.detail.pd.item", "mx.cell"]
  },
  // total row and hidden item: not read. a hidden row's cells are read, its detail panel is not. panel of an unselected
  // choice: not shown. custom questions do not override getAllErrors(): the wrapper copies the content question's errors.
  "getAllErrors": {
    reached: ["md.cell", "md.hiddenRowCell", "md.detail", "md.detail.pd.item", "mx.cell", "mx.hiddenRowCell", "pd.item", "pd.static", "pd.choicePanel", "mt.editor", "cp.content", "cp.nested", "cb.shownPanel", "rg.panel"]
  },
  // total row: a matrix clears the cells and the detail panel of every row it created, a hidden row's included. composite
  // and select questions clear every element they created, the panel of an unselected choice included.
  "clearErrors": {
    reached: ["md.cell", "md.hiddenRowCell", "md.detail", "md.detail.pd.item", "mx.cell", "mx.hiddenRowCell", "pd.item", "pd.hiddenItem", "pd.static", "pd.choicePanel", "mt.editor", "cu.content", "cp.content", "cp.nested", "cb.shownPanel", "cb.hiddenPanel", "rg.panel"]
  },
  // choice panels: their questions are survey questions and get the change from the survey. multiple text: the editors
  // read the item values when the value changes.
  "onAnyValueChanged": {
    reached: ["md.cell", "md.hiddenRowCell", "md.detail", "md.detail.pd.item", "md.total", "mx.cell", "mx.hiddenRowCell", "pd.item", "pd.hiddenItem", "pd.static", "cu.content", "cp.content", "cp.nested"]
  },
  // hidden rows and hidden item: triggers run on visible items. detail panel, total row: not reached by triggers.
  // multiple text, custom, composite, select: only records containers forward runTriggers().
  "runTriggers": {
    reached: ["md.cell", "mx.cell", "pd.item", "pd.static"]
  },
  // the dynamic panel runs them on visible panels only, a matrix on all its rows, the detail panel and the total row excluded.
  // multiple text, custom, composite, select: they have no items to build.
  "runTriggersOnFirstBuild": {
    reached: ["pd.item", "pd.static"],
    builds: ["md.cell", "md.hiddenRowCell", "mx.cell", "mx.hiddenRowCell"]
  },
  // total row: computed. choice panels: their questions are survey questions with their own value.
  "onSurveyValueChanged": {
    reached: ["md.cell", "md.hiddenRowCell", "md.detail", "md.detail.pd.item", "mx.cell", "mx.hiddenRowCell", "pd.item", "pd.hiddenItem", "pd.static", "mt.editor", "cu.content", "cp.content", "cp.nested"]
  },
  // custom and composite content: set through the wrapper's value, not through updateValueFromSurvey().
  "updateValueFromSurvey": {
    reached: ["md.cell", "md.hiddenRowCell", "md.detail", "md.detail.pd.item", "md.total", "mx.cell", "mx.hiddenRowCell", "pd.item", "pd.hiddenItem", "pd.static", "pd.choicePanel", "mt.editor", "cb.shownPanel", "cb.hiddenPanel", "rg.panel"]
  },
  // matrices: the records model judges cell values by record. hidden item: cleared as a whole. multiple text, custom: the
  // container clears its own value. showing choice panels: their questions are visible survey questions, cleared by the survey.
  "clearValueIfInvisible": {
    reached: ["pd.item", "pd.static", "cp.content", "cp.nested", "cb.hiddenPanel"]
  },
  // matrices: a row gives its cells the survey when it is built. choice panels: a panel is bound to the survey when it is created.
  "setSurveyImpl": {
    reached: ["pd.item", "pd.hiddenItem", "pd.static", "mt.editor", "cu.content", "cp.content", "cp.nested"]
  },
  // choice panels: a select question does not forward locStrsChanged() to them.
  "locStrsChanged": {
    reached: ["md.cell", "md.hiddenRowCell", "md.detail", "md.detail.pd.item", "md.total", "mx.cell", "mx.hiddenRowCell", "pd.item", "pd.hiddenItem", "pd.static", "mt.editor", "cu.content", "cp.content", "cp.nested"]
  },
  // choice panels: a select question does not forward localeChanged().
  "localeChanged": {
    reached: ["md.cell", "md.hiddenRowCell", "md.detail", "md.detail.pd.item", "md.total", "mx.cell", "mx.hiddenRowCell", "pd.item", "pd.hiddenItem", "pd.static", "mt.editor", "cu.content", "cp.content", "cp.nested"]
  },
  // matrices and dynamic panel: the locales come from the definition (columns, template), not from the instances.
  "addUsedLocales": {
    reached: ["mt.editor", "cu.content", "cp.content", "cp.nested", "cb.shownPanel", "cb.hiddenPanel", "rg.panel"]
  },
  // matrices and dynamic panel: the instances are built after the load and load themselves.
  "onSurveyLoad": {
    reached: ["mt.editor", "cu.content", "cp.content", "cp.nested", "cb.shownPanel", "cb.hiddenPanel", "rg.panel"]
  },
  // matrices: rows render when the table renders. multiple text: editors render with their items. unselected choice: rendered when shown.
  "onFirstRendering": {
    reached: ["pd.item", "pd.hiddenItem", "pd.static", "pd.choicePanel", "cu.content", "cp.content", "cp.nested", "cb.shownPanel", "rg.panel"]
  },
  // hidden rows, total row, hidden item: not visible. multiple text, select: they do not forward onHidingContent().
  "onHidingContent": {
    reached: ["md.cell", "md.detail", "md.detail.pd.item", "mx.cell", "pd.item", "pd.static", "cu.content", "cp.content", "cp.nested"]
  },
  // matrices: the cells take their css from the rendered table. multiple text, select: they do not forward updateElementCss().
  "updateElementCss": {
    reached: ["pd.item", "pd.hiddenItem", "pd.static", "cu.content", "cp.content", "cp.nested"]
  },
  // every slot: forwarded through the nested walk; nothing is built.
  "setIsMobile": {
    reached: ["md.cell", "md.hiddenRowCell", "md.detail", "md.detail.pd.item", "md.total", "mx.cell", "mx.hiddenRowCell", "pd.item", "pd.hiddenItem", "pd.static", "pd.choicePanel", "mt.editor", "cu.content", "cp.content", "cp.nested", "cb.shownPanel", "cb.hiddenPanel", "rg.panel"]
  },
  // only the dynamic panel forwards themeChanged().
  "themeChanged": {
    reached: ["pd.item", "pd.hiddenItem", "pd.static", "pd.choicePanel"]
  },
  // only the dynamic panel numbers its questions; the hidden item and a choice panel are not numbered.
  "setVisibleIndex": {
    reached: ["pd.item", "pd.static"]
  },
  // hidden rows, detail panel, total row, hidden item, choice panels: progress counts the visible inputs of rows, items and editors.
  "getProgressInfo": {
    reached: ["pd.item", "pd.static", "mt.editor", "cu.content", "cp.content", "cp.nested"],
    builds: ["md.cell", "mx.cell"]
  },
  // stop at first: the first input of the first visible row or item. the rest: their own input.
  "getFirstInputElementId": {
    reached: ["md.cell", "mx.cell", "pd.item", "mt.editor", "cp.content"]
  },
  // only a custom question focuses a nested question; the others focus their own input.
  "focus": {
    reached: ["cu.content"]
  },
  // a lookup by name in the records of a dynamic matrix and a dynamic panel. A choice panel question is not in the record.
  "getQuestionFromArray": {
    reached: ["md.detail", "pd.item", "pd.hiddenItem", "pd.static"],
    builds: ["md.cell"]
  },
  // only a select question returns its choice panels.
  "getPanels": {
    reached: ["cb.shownPanel", "cb.hiddenPanel", "rg.panel"]
  },
  // total row: never editable. custom content: reads the wrapper's state. choice panels, multiple text: they do not
  // forward onReadOnlyChanged().
  "onReadOnlyChanged": {
    reached: ["md.cell", "md.hiddenRowCell", "md.detail", "md.detail.pd.item", "mx.cell", "mx.hiddenRowCell", "pd.item", "pd.hiddenItem", "pd.static", "cp.content", "cp.nested"]
  },
  // every slot: the dynamic panel disposes its items, the one in a detail panel included.
  "dispose": {
    reached: ["md.cell", "md.hiddenRowCell", "md.detail", "md.detail.pd.item", "md.total", "mx.cell", "mx.hiddenRowCell", "pd.item", "pd.hiddenItem", "pd.static", "pd.choicePanel", "mt.editor", "cu.content", "cp.content", "cp.nested", "cb.shownPanel", "cb.hiddenPanel", "rg.panel"]
  }
};

describe("Conformance: which walk reaches which nested slot", () => {
  test("every walk has a row in the table", () => {
    expect(Object.keys(expectedReach)).toEqual(Object.keys(walks));
  });
  Object.keys(walks).forEach(walkName => {
    test("the slots " + walkName + " reaches", () => {
      const row = expectedReach[walkName];
      const expected: { [slot: string]: Reach } = {};
      allSlots.forEach(slot => {
        expected[slot] = (row.builds || []).indexOf(slot) > -1 ? "builds" : row.reached.indexOf(slot) > -1;
      });
      expect(getReach(walks[walkName])).toEqual(expected);
    });
  });
});

describe("Design mode", () => {
  test("a dynamic panel shows its template, which is not an item's panel: it lists the template's questions", () => {
    // Survey Creator adds a survey this way: built at runtime, its page moved into the designer's survey.
    const source = new SurveyModel({
      elements: [{
        type: "paneldynamic", name: "outer",
        templateElements: [{ type: "paneldynamic", name: "inner", templateElements: [{ type: "text", name: "q" }] }]
      }]
    });
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.addPage(source.pages[0]);
    const outer: any = survey.getQuestionByName("outer");
    expect(outer.panels.length === 1 && outer.panels[0] === outer.template, "the template is the panel shown").toBe(true);
    expect(survey.getAllQuestions(false, false, true).map((q: Question) => q.name)).toEqual(["outer", "inner", "q"]);
  });
});

describe("Choice panels that are created and empty", () => {
  test("getPanels(), conditions, locales, loading and disposal reach a panel that was read and one whose last element was removed", () => {
    const survey = createSurvey();
    const cb: any = survey.getQuestionByName("cb");
    const read: PanelModel = cb.choices[2].panel;
    const emptied: PanelModel = cb.choices[3].panel;
    expect(read.elements.length, "read, never given elements").toBe(0);
    expect(emptied.elements.length, "its last element removed").toBe(0);
    expect(cb.getPanels().indexOf(read) > -1, "getPanels() returns the read panel").toBe(true);
    expect(cb.getPanels().indexOf(emptied) > -1, "getPanels() returns the emptied panel").toBe(true);
    const calls: Array<string> = [];
    [["read", read], ["emptied", emptied]].forEach(([label, panel]: [string, any]) => {
      ["runCondition", "addUsedLocales", "onSurveyLoad", "dispose"].forEach(method => {
        const original = panel[method];
        vi.spyOn(panel, method).mockImplementation((...args: Array<any>) => {
          calls.push(label + ": " + method);
          return original.apply(panel, args);
        });
      });
    });
    survey.setVariable("nwv", 1);
    survey.getUsedLocales();
    cb.onSurveyLoad();
    survey.dispose();
    ["read", "emptied"].forEach(label => ["runCondition", "addUsedLocales", "onSurveyLoad", "dispose"].forEach(method => {
      expect(calls.indexOf(label + ": " + method) > -1, label + ": " + method).toBe(true);
    }));
  });
});

/* The questions of a choice panel are bound to the survey (their panel's survey is the survey), and a
   select question updates them from its own data. Inside a dynamic panel item its data is the item, so
   the root key does not reach them and a key in the item's record does. Kept as it is: this only shows it. */
describe("A select question in a dynamic panel item updates its choice panel from the item", () => {
  test("the question reads the item's record, not the root key its panel writes to", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "paneldynamic", name: "pd",
        templateElements: [{ type: "checkbox", name: "pdChoice", choices: [{ value: "a", elements: [{ type: "text", name: "inner" }] }] }]
      }]
    });
    survey.data = { pd: [{ pdChoice: ["a"] }], inner: "x" };
    const pd: any = survey.getQuestionByName("pd");
    const inner = (): Question => pd.panels[0].getQuestionByName("pdChoice").choices[0].panel.getQuestionByName("inner");
    expect(inner().value, "the root key is not read").toBeUndefined();
    survey.data = { pd: [{ pdChoice: ["a"], inner: "fromItem" }], inner: "z" };
    expect(inner().value, "the item's key is read").toBe("fromItem");
    survey.setValue("inner", "w");
    expect(inner().value, "a root change is not seen").toBe("fromItem");
  });
});

describe("forEachNestedElement(): the instances every container yields", () => {
  function yielded(q: any, build: string, visibleOnly: boolean = false): Array<string> {
    const res: Array<string> = [];
    q.forEachNestedElement((info: any) => {
      const el = info.element;
      const name = el.isPanel ? "panel(" + el.questions.map((pq: Question) => pq.name).join(",") + ")" : el.name;
      res.push([info.role, name, String(info.segment), info.location, info.visible ? "visible" : "hidden"].join(" "));
    }, { build: build, visibleOnly: visibleOnly });
    return res;
  }
  test("a role, a record segment, where the value lives and whether the container shows it", () => {
    const survey = createSurvey();
    buildAll(survey);
    const get = (name: string): any => survey.getQuestionByName(name);
    expect(yielded(get("md"), "none")).toEqual([
      "cell mdCell 0 nested visible", "detail panel(mdDetail,mdDetailPd) 0 nested visible",
      "cell mdCell 1 nested hidden", "detail panel(mdDetail,mdDetailPd) 1 nested hidden",
      "cell mdCell 2 nested visible", "detail panel(mdDetail,mdDetailPd) 2 nested visible",
      "total mdCell undefined nested visible"
    ]);
    expect(yielded(get("md"), "rows"), "visibleRows drops the hidden row whatever visibleOnly says").toEqual([
      "cell mdCell 0 nested visible", "detail panel(mdDetail,mdDetailPd) 0 nested visible",
      "cell mdCell 2 nested visible", "detail panel(mdDetail,mdDetailPd) 2 nested visible",
      "total mdCell undefined nested visible"
    ]);
    expect(yielded(get("mx"), "none"), "a dropdown matrix row's segment is its row value").toEqual([
      "cell mxCell r1 nested visible", "cell mxCell r2 nested hidden"
    ]);
    expect(yielded(get("pd"), "none")).toEqual([
      "item panel(pdItem,pdStaticQ,pdChoice) 0 nested visible", "item panel(pdItem,pdStaticQ,pdChoice) 1 nested hidden"
    ]);
    expect(yielded(get("pd"), "none", true), "visibleOnly").toEqual(["item panel(pdItem,pdStaticQ,pdChoice) 0 nested visible"]);
    expect(yielded(get("mt"), "none")).toEqual(["editor mtEditor undefined nested visible"]);
    expect(yielded(get("cu"), "none")).toEqual(["content " + get("cu").contentQuestion.name + " undefined same visible"]);
    expect(yielded(get("cp"), "none")).toEqual(["content panel(cpInner,cpNested) undefined nested visible"]);
    expect(yielded(get("cb"), "none"), "every created choice panel, empty ones included").toEqual([
      "choicePanel panel(cbShown) undefined root visible", "choicePanel panel(cbHidden) undefined root hidden",
      "choicePanel panel() undefined root hidden", "choicePanel panel() undefined root hidden"
    ]);
    expect(yielded(get("rg"), "none"), "showing a choice reads its panel, which creates it").toEqual([
      "choicePanel panel(rgInner) undefined root visible", "choicePanel panel() undefined root hidden"
    ]);
    expect(yielded(get("root"), "all"), "a question without nested instances yields nothing").toEqual([]);
  });
  test("build modes: \"none\" builds nothing, \"rows\" generates the rows, \"all\" creates the detail panels and the panels", () => {
    const survey = createSurvey();
    const md: any = survey.getQuestionByName("md");
    expect(yielded(md, "none"), "no rows yet; the total row exists").toEqual(["total mdCell undefined nested visible"]);
    expect(yielded(md, "rows"), "rows, no detail panels").toEqual([
      "cell mdCell 0 nested visible", "cell mdCell 2 nested visible", "total mdCell undefined nested visible"
    ]);
    expect(yielded(md, "all")).toEqual([
      "cell mdCell 0 nested visible", "detail panel(mdDetail,mdDetailPd) 0 nested visible",
      "cell mdCell 1 nested hidden", "detail panel(mdDetail,mdDetailPd) 1 nested hidden",
      "cell mdCell 2 nested visible", "detail panel(mdDetail,mdDetailPd) 2 nested visible",
      "total mdCell undefined nested visible"
    ]);
    md.beginUpdate();
    expect(yielded(md, "rows"), "visibleRows gives nothing under beginUpdate()").toEqual(["total mdCell undefined nested visible"]);
    md.endUpdate();
  });
  test("under paging a segment is the record a row or a panel holds, not its position on the page", () => {
    const survey = createSurvey(true);
    const md: any = survey.getQuestionByName("md");
    const pd: any = survey.getQuestionByName("pd");
    md.visibleRows;
    pd.panels;
    md.pageIndex = 1;
    pd.pageIndex = 1;
    expect(yielded(md, "rows")).toEqual(["cell mdCell 2 nested visible", "total mdCell undefined nested visible"]);
    expect(yielded(pd, "all")).toEqual(["item panel(pdItem,pdStaticQ,pdChoice) 1 nested visible"]);
  });
});

describe("Disposal and a locale change reach the instances a container owns", () => {
  test("disposing a matrix row disposes its detail panel, and disposing the matrix disposes its total row", () => {
    const survey = createSurvey();
    const md: any = survey.getQuestionByName("md");
    const row = md.visibleRows[0];
    row.ensureDetailPanel();
    const panel: PanelModel = row.detailPanel;
    const totalRow = md.generatedTotalRow;
    expect(!!totalRow, "the total row exists").toBe(true);
    row.dispose();
    expect(panel.isDisposed, "the detail panel").toBe(true);
    survey.dispose();
    expect(totalRow.cells[0].question.isDisposed, "the total row's cell").toBe(true);
  });
  test("in design mode a row shows the matrix's detail panel and does not dispose it", () => {
    const survey = new SurveyModel(createJson());
    survey.setDesignMode(true);
    const md: any = survey.getQuestionByName("md");
    const row = md.visibleRows[0];
    row.ensureDetailPanel();
    expect(row.detailPanel, "the matrix's detail panel").toBe(md.detailPanel);
    row.dispose();
    expect(md.detailPanel.isDisposed, "still alive").toBe(false);
  });
  test("custom and composite questions dispose their content, multiple text its editors", () => {
    const survey = createSurvey();
    const content: Question = (<any>survey.getQuestionByName("cu")).contentQuestion;
    const contentPanel: PanelModel = (<any>survey.getQuestionByName("cp")).contentPanel;
    const editor: Question = (<any>survey.getQuestionByName("mt")).items[0].editor;
    survey.dispose();
    expect(content.isDisposed, "custom content").toBe(true);
    expect(contentPanel.isDisposed, "composite content panel").toBe(true);
    expect(contentPanel.questions[0].isDisposed, "composite content panel's question").toBe(true);
    expect(editor.isDisposed, "multiple text editor").toBe(true);
  });
  test("a custom question runs its own locale change, then its content's", () => {
    const survey = createSurvey();
    const cu: any = survey.getQuestionByName("cu");
    const calls: Array<string> = [];
    cu.localeChangedCallback = () => calls.push("wrapper");
    cu.contentQuestion.localeChangedCallback = () => calls.push("content");
    survey.locale = "de";
    expect(calls).toEqual(["wrapper", "content"]);
  });

  // The order of the sorted choices differs between the locales, not only their texts.
  const localizedChoices = [{ value: "a", text: { default: "Apple", de: "Zebra" } }, { value: "b", text: { default: "Zebra", de: "Apfel" } }];
  const sortedCheckbox = { type: "checkbox", name: "sorted", choicesOrder: "asc", choices: localizedChoices };
  const numberMask = { maskType: "numeric", maskSettings: { precision: 2 } };
  const savedMask = { maskType: "numeric", maskSettings: { saveMaskedValue: true, precision: 2 } };
  const choiceValues = (q: any): Array<any> => q.visibleChoices.map((item: any) => item.value);
  function createDetailPanelSurvey(detailElement: any, value: any, showPanel: boolean = true): { survey: SurveyModel, row: any, question: any } {
    const survey = new SurveyModel({
      elements: [{ type: "matrixdynamic", name: "m", columns: [{ name: "c", cellType: "text" }], detailPanelMode: "underRow", detailElements: [detailElement] }]
    });
    survey.data = { m: [{ c: "1", [detailElement.name]: value }] };
    const row = (<any>survey.getQuestionByName("m")).visibleRows[0];
    if (showPanel) row.showDetailPanel();
    return { survey, row, question: row.detailPanel?.getQuestionByName(detailElement.name) };
  }
  test("the choices of a detail panel question follow the new locale's order", () => {
    const { survey, question } = createDetailPanelSurvey(sortedCheckbox, undefined);
    expect(choiceValues(question), "the default locale").toEqual(["a", "b"]);
    survey.locale = "de";
    expect(choiceValues(question), "de").toEqual(["b", "a"]);
  });
  test("a mask in a detail panel follows the new locale", () => {
    const { survey, question } = createDetailPanelSurvey({ type: "text", name: "num", ...numberMask }, 1234.56);
    expect(question.inputValue, "the default locale").toBe("1,234.56");
    survey.locale = "de";
    expect(question.value, "the stored value").toBe(1234.56);
    expect(question.inputValue, "the shown value").toBe("1.234,56");
  });

  // A panel is created on first open, so its saved text may be in an older locale's format: it is never rewritten.
  const savedDetailShapes: Array<{ name: string, element: any, value: any, stored: (value: any) => any }> = [
    { name: "a text question", element: { type: "text", name: "saved", ...savedMask }, value: "1,234.56", stored: v => v },
    { name: "a dynamic panel question", element: { type: "paneldynamic", name: "saved", templateElements: [{ type: "text", name: "i", ...savedMask }] }, value: [{ i: "1,234.56" }], stored: v => v[0].i },
    { name: "a custom question", element: { type: "nwsaved", name: "saved" }, value: "1,234.56", stored: v => v },
    { name: "a custom question over a multiple text", element: { type: "nwsavedmt", name: "saved" }, value: { i: "1,234.56" }, stored: v => v.i },
    { name: "a custom question in a dynamic panel", element: { type: "paneldynamic", name: "saved", templateElements: [{ type: "nwsaved", name: "i" }] }, value: [{ i: "1,234.56" }], stored: v => v[0].i }
  ];
  function registerSavedComponents(): void {
    ComponentCollection.Instance.add({ name: "nwsaved", questionJSON: { type: "text", ...savedMask } });
    ComponentCollection.Instance.add({ name: "nwsavedmt", questionJSON: { type: "multipletext", items: [{ name: "i", ...savedMask }] } });
  }
  // A dynamic panel creates its panels when they are read.
  function bindSavedQuestions(row: any): void {
    const question: any = row.detailPanel.getQuestionByName("saved");
    question.panels;
  }
  savedDetailShapes.forEach(shape => {
    test("a saved masked value of " + shape.name + " in a detail panel opened before the switch keeps its text", () => {
      registerSavedComponents();
      const { survey, row } = createDetailPanelSurvey(shape.element, shape.value);
      bindSavedQuestions(row);
      const changes: Array<string> = [];
      survey.onValueChanged.add((_, options) => changes.push(options.name));
      survey.locale = "de";
      expect(shape.stored(survey.data.m[0].saved), "de").toBe("1,234.56");
      expect(changes, "no value change").toEqual([]);
      survey.locale = "";
      expect(shape.stored(survey.data.m[0].saved), "back").toBe("1,234.56");
    });
    test("a saved masked value of " + shape.name + " in a detail panel opened after the switch keeps its text", () => {
      registerSavedComponents();
      const { survey } = createDetailPanelSurvey(shape.element, shape.value, false);
      const row = (<any>survey.getQuestionByName("m")).visibleRows[0];
      survey.locale = "de";
      row.showDetailPanel();
      bindSavedQuestions(row);
      const steps: Array<any> = [];
      ["", "de", ""].forEach(locale => {
        survey.locale = locale;
        steps.push(shape.stored(survey.data.m[0].saved));
      });
      expect(steps).toEqual(["1,234.56", "1,234.56", "1,234.56"]);
    });
  });
  test("an expression reads a saved masked value of a detail panel opened before the switch", () => {
    const { survey, question } = createDetailPanelSurvey({ type: "text", name: "saved", ...savedMask }, "1,234.56");
    survey.locale = "de";
    expect(question.value).toBe("1,234.56");
    expect(question.getFilteredValue()).toBe(1234.56);
  });
  test("a saved masked value converts in a visible cell and a custom cell, and keeps its text in a hidden row's cell", () => {
    registerSavedComponents();
    const survey = new SurveyModel({
      elements: [{
        type: "matrixdynamic", name: "m", rowsVisibleIf: "{row.k} != 'h'",
        columns: [{ name: "k", cellType: "text" }, { name: "s", cellType: "text", ...savedMask }, { name: "cu", cellType: "nwsaved" }]
      }]
    });
    survey.data = { m: [{ k: "a", s: "1,234.56", cu: "1,234.56" }, { k: "h", s: "2,222.22", cu: "2,222.22" }] };
    (<any>survey.getQuestionByName("m")).visibleRows;
    survey.locale = "de";
    expect(survey.data.m).toEqual([{ k: "a", s: "1.234,56", cu: "1.234,56" }, { k: "h", s: "2,222.22", cu: "2,222.22" }]);
    survey.locale = "";
    expect(survey.data.m).toEqual([{ k: "a", s: "1,234.56", cu: "1,234.56" }, { k: "h", s: "2,222.22", cu: "2,222.22" }]);
  });
  test("a regional format change converts a saved cell, keeps a saved detail text and updates a detail mask", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "matrixdynamic", name: "m", detailPanelMode: "underRow",
        columns: [{ name: "c", cellType: "text", ...savedMask }],
        detailElements: [{ type: "text", name: "saved", ...savedMask }, { type: "text", name: "num", ...numberMask }]
      }]
    });
    survey.data = { m: [{ c: "1,234.56", saved: "1,234.56", num: 1234.56 }] };
    const row = (<any>survey.getQuestionByName("m")).visibleRows[0];
    row.showDetailPanel();
    survey.regionalFormat.decimalSeparator = ",";
    survey.regionalFormat.thousandsSeparator = ".";
    expect(survey.data.m).toEqual([{ c: "1.234,56", saved: "1,234.56", num: 1234.56 }]);
    expect(row.detailPanel.getQuestionByName("num").inputValue, "the detail mask").toBe("1.234,56");
    expect(row.detailPanel.getQuestionByName("saved").getFilteredValue(), "the saved detail text").toBe(1234.56);
  });
  test("a row hidden during the change shows the new locale once it is visible again", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "matrixdropdown", name: "m", rows: ["r1", "r2"], rowsVisibleIf: "{item} = 'r1' or {show} = 1",
        columns: [{ name: "c", cellType: "checkbox", choicesOrder: "asc", choices: localizedChoices }]
      }]
    });
    const row = (<any>survey.getQuestionByName("m")).allRows[1];
    expect(row.isVisible, "hidden first").toBe(false);
    survey.locale = "de";
    survey.setValue("show", 1);
    expect(row.isVisible, "visible again").toBe(true);
    expect(choiceValues(row.cells[0].question)).toEqual(["b", "a"]);
  });
  test("a cell, a detail panel question and a total cell get one call, not two", () => {
    const survey = createSurvey();
    buildAll(survey);
    const md: any = survey.getQuestionByName("md");
    const row = md.visibleRows[0];
    const calls: Array<string> = [];
    row.cells[0].question.localeChangedCallback = () => calls.push("cell");
    row.detailPanel.getQuestionByName("mdDetail").localeChangedCallback = () => calls.push("detail");
    md.generatedTotalRow.cells[0].question.localeChangedCallback = () => calls.push("total");
    survey.locale = "de";
    expect(calls).toEqual(["cell", "detail", "total"]);
  });
});

describe("A matrix takes a read-only change into the rows that exist", () => {
  test("nothing is built for it, and rows and detail panels built later are read-only", () => {
    const survey = createSurvey();
    const md: any = survey.getQuestionByName("md");
    survey.readOnly = true;
    expect(md.generatedVisibleRows === null, "no rows built").toBe(true);
    const row = md.visibleRows[0];
    row.ensureDetailPanel();
    expect(row.cells[0].question.isReadOnly, "a cell of a row built later").toBe(true);
    expect(row.detailPanel.isReadOnly, "a detail panel created later").toBe(true);
  });
  test("every row that exists gets the change, a hidden one included", () => {
    const survey = createSurvey();
    buildAll(survey);
    const md: any = survey.getQuestionByName("md");
    const rows = md.generatedVisibleRows;
    expect(rows[1].isVisible, "the second row is hidden").toBe(false);
    survey.readOnly = true;
    rows.forEach((row: any, index: number) => {
      expect(row.cells[0].question.getPropertyValue("isReadOnly"), "row " + index + ": its cell").toBe(true);
      expect(row.detailPanel.readOnly, "row " + index + ": its detail panel").toBe(true);
    });
    survey.readOnly = false;
    rows.forEach((row: any, index: number) => {
      expect(row.cells[0].question.getPropertyValue("isReadOnly"), "row " + index + ": its cell, editable again").toBe(false);
      expect(row.detailPanel.readOnly, "row " + index + ": its detail panel, editable again").toBe(false);
    });
  });
});

describe("setIsMobile reaches every nested question that exists", () => {
  function cellQuestions(matrix: any): Array<Question> {
    const res: Array<Question> = [];
    matrix.visibleRows.forEach((row: any) => row.cells.forEach((cell: any) => res.push(cell.question)));
    return res;
  }
  function expectMobile(questions: Array<Question>, val: boolean, label: string): void {
    expect(questions.length > 0, label + ": there are questions to check").toBe(true);
    questions.forEach(q => expect(q.isMobile, label + ": " + q.getType() + " " + q.name).toBe(val));
  }
  test("the cells of a dropdown matrix and of a dynamic matrix follow both switches", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "matrixdropdown", name: "mx", rows: ["r1", "r2"], columns: [{ name: "c1", cellType: "checkbox", choices: [1, 2] }, { name: "c2", cellType: "text" }] },
        { type: "matrixdynamic", name: "md", rowCount: 3, columns: [{ name: "c1", cellType: "checkbox", choices: [1, 2] }, { name: "c2", cellType: "text" }] }
      ]
    });
    const cells = [...cellQuestions(survey.getQuestionByName("mx")), ...cellQuestions(survey.getQuestionByName("md"))];
    expect(cells.length).toBe(10);
    survey.setIsMobile(true);
    expectMobile(cells, true, "mobile");
    survey.setIsMobile(false);
    expectMobile(cells, false, "desktop");
  });
  test("the question of a shown detail panel and the cells of the total row follow both switches", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "matrixdynamic", name: "md", rowCount: 2, detailPanelMode: "underRow",
        columns: [{ name: "c1", cellType: "text", totalType: "count" }],
        detailElements: [{ type: "text", name: "detailQ" }]
      }]
    });
    const md: any = survey.getQuestionByName("md");
    const row = md.visibleRows[0];
    row.showDetailPanel();
    const detailQ: Question = row.detailPanel.getQuestionByName("detailQ");
    const totalCells: Array<Question> = md.visibleTotalRow.cells.map((cell: any) => cell.question).filter((q: any) => !!q);
    survey.setIsMobile(true);
    expectMobile([detailQ], true, "detail, mobile");
    expectMobile(totalCells, true, "total, mobile");
    survey.setIsMobile(false);
    expectMobile([detailQ], false, "detail, desktop");
    expectMobile(totalCells, false, "total, desktop");
  });
  test("a row added after the switch has mobile cells", () => {
    const survey = new SurveyModel({
      elements: [{ type: "matrixdynamic", name: "md", rowCount: 1, columns: [{ name: "c1", cellType: "checkbox", choices: [1, 2] }, { name: "c2", cellType: "text" }] }]
    });
    const md: any = survey.getQuestionByName("md");
    md.visibleRows;
    survey.setIsMobile(true);
    md.addRow();
    expectMobile(md.visibleRows[1].cells.map((cell: any) => cell.question), true, "added row");
  });
  test("the editors of a multiple text and the questions of shown and hidden choice panels follow both switches", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "multipletext", name: "mt", items: [{ name: "e1" }, { name: "e2" }] },
        {
          type: "checkbox", name: "cb", defaultValue: ["a"],
          choices: [{ value: "a", elements: [{ type: "text", name: "shownQ" }] }, { value: "b", elements: [{ type: "text", name: "hiddenQ" }] }]
        }
      ]
    });
    const editors: Array<Question> = (<any>survey.getQuestionByName("mt")).items.map((item: any) => item.editor);
    const cb: any = survey.getQuestionByName("cb");
    expect(cb.choices[0].isPanelShowing, "the first choice panel shows").toBe(true);
    expect(cb.choices[1].isPanelShowing, "the second choice panel is hidden").toBe(false);
    const panelQuestions = [...cb.choices[0].panel.questions, ...cb.choices[1].panel.questions];
    survey.setIsMobile(true);
    expectMobile(editors, true, "editors, mobile");
    expectMobile(panelQuestions, true, "choice panels, mobile");
    survey.setIsMobile(false);
    expectMobile(editors, false, "editors, desktop");
    expectMobile(panelQuestions, false, "choice panels, desktop");
  });
  test("the switch builds no rows and no detail panels", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "matrixdropdown", name: "mx", rows: ["r1", "r2"], columns: [{ name: "c1", cellType: "text" }] },
        { type: "matrixdynamic", name: "md", rowCount: 2, detailPanelMode: "underRow", columns: [{ name: "c1", cellType: "text" }], detailElements: [{ type: "text", name: "detailQ" }] }
      ]
    });
    const mx: any = survey.getQuestionByName("mx");
    const md: any = survey.getQuestionByName("md");
    survey.setIsMobile(true);
    expect(mx.generatedVisibleRows, "dropdown matrix rows").toBeNull();
    expect(md.generatedVisibleRows, "dynamic matrix rows").toBeNull();
    md.visibleRows.forEach((row: any, index: number) => expect(!!row.detailPanel, "row " + index + ": no detail panel").toBe(false));
  });
  test("in design mode the matrix stays non-mobile, and a row built before the switch matches a row added after it", () => {
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({
      elements: [{ type: "matrixdynamic", name: "md", rowCount: 1, columns: [{ name: "c1", cellType: "checkbox", choices: [1, 2] }, { name: "c2", cellType: "text" }] }]
    });
    const md: any = survey.getQuestionByName("md");
    md.visibleRows;
    survey.setIsMobile(true);
    md.addRow();
    expect(md.isMobile, "the matrix").toBe(false);
    md.visibleRows.forEach((row: any, index: number) => {
      expect(row.cells.map((cell: any) => cell.question.isMobile), "row " + index + ": checkbox, text").toEqual([true, false]);
    });
  });
  test("the cells of a matrix in a dynamic panel's panel follow both switches", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "paneldynamic", name: "pd", panelCount: 2,
        templateElements: [{ type: "matrixdynamic", name: "md", rowCount: 2, columns: [{ name: "c1", cellType: "checkbox", choices: [1, 2] }] }]
      }]
    });
    const pd: any = survey.getQuestionByName("pd");
    const cells: Array<Question> = [];
    pd.panels.forEach((panel: PanelModel) => cells.push(...cellQuestions(panel.getQuestionByName("md"))));
    expect(cells.length).toBe(4);
    survey.setIsMobile(true);
    expectMobile(cells, true, "mobile");
    survey.setIsMobile(false);
    expectMobile(cells, false, "desktop");
  });
});

describe("The first question to focus and its input id", () => {
  const firstId = (question: any): any => question.getFirstInputElementId();
  const firstErrorId = (question: any): any => question.getFirstErrorInputElementId();

  test("a matrix skips the cells of a row rowsVisibleIf hides", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "matrixdropdown", name: "m", rowsVisibleIf: "{item} != 'r1'", rows: ["r1", "r2"],
        columns: [{ name: "c1", cellType: "text" }]
      }]
    });
    const matrix: any = survey.getQuestionByName("m");
    const visibleCell = matrix.visibleRows[0].cells[0].question;
    expect(matrix.getFirstQuestionToFocus(false)?.id).toBe(visibleCell.id);
    expect(firstId(matrix)).toBe(visibleCell.inputId);
  });
  test("a matrix skips a cell without an input", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "matrixdynamic", name: "m", rowCount: 1,
        columns: [{ name: "c1", cellType: "expression", expression: "1" }, { name: "c2", cellType: "text" }]
      }]
    });
    const matrix: any = survey.getQuestionByName("m");
    const cells = matrix.visibleRows[0].cells;
    expect(matrix.getFirstQuestionToFocus(false)?.id).toBe(cells[1].question.id);
  });
  test("a matrix skips a read-only cell", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "matrixdynamic", name: "m", rowCount: 1,
        columns: [{ name: "c1", cellType: "text", readOnly: true }, { name: "c2", cellType: "text" }]
      }]
    });
    const matrix: any = survey.getQuestionByName("m");
    const cells = matrix.visibleRows[0].cells;
    expect(matrix.getFirstQuestionToFocus(false)?.id).toBe(cells[1].question.id);
  });
  test("a matrix skips a cell of a hidden column", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "matrixdynamic", name: "m", rowCount: 1,
        columns: [{ name: "c1", cellType: "text", visibleIf: "{row.c2} = 'a'" }, { name: "c2", cellType: "text" }]
      }]
    });
    const matrix: any = survey.getQuestionByName("m");
    const cells = matrix.visibleRows[0].cells;
    expect(matrix.getFirstQuestionToFocus(false)?.id).toBe(cells[1].question.id);
  });
  test("a matrix without an editable cell gives the page's next question", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "matrixdynamic", name: "m", rowCount: 1, readOnly: true, columns: [{ name: "c1", cellType: "text" }] },
        { type: "text", name: "q2" }
      ]
    });
    (<any>survey.getQuestionByName("m")).visibleRows;
    expect(survey.currentPage.getFirstQuestionToFocus(false).name).toBe("q2");
  });
  test("a matrix does not focus the total row", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "matrixdynamic", name: "m", rowCount: 1,
        columns: [{ name: "c1", cellType: "text", readOnly: true, totalType: "count" }]
      }]
    });
    const matrix: any = survey.getQuestionByName("m");
    matrix.visibleRows;
    expect(matrix.getFirstQuestionToFocus(false)?.id).toBeUndefined();
  });
  test("a container gives the first input of a nested question, not its question id", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "matrixdynamic", name: "m", rowCount: 1, columns: [{ name: "c1", cellType: "radiogroup", choices: [1, 2] }] },
        { type: "paneldynamic", name: "pd", panelCount: 1, templateElements: [{ type: "radiogroup", name: "r", choices: [1, 2] }] }
      ]
    });
    const matrix: any = survey.getQuestionByName("m");
    const pd: any = survey.getQuestionByName("pd");
    const cell = matrix.visibleRows[0].cells[0].question;
    expect(firstId(matrix), "matrix").toBe(cell.inputId + "_0");
    expect(firstId(pd), "dynamic panel").toBe(pd.panels[0].questions[0].inputId + "_0");
  });
  test("a multiple text in a dynamic panel gives the input of its editor", () => {
    const survey = new SurveyModel({
      elements: [{ type: "paneldynamic", name: "pd", panelCount: 1, templateElements: [{ type: "multipletext", name: "mt", items: [{ name: "i1" }] }] }]
    });
    const pd: any = survey.getQuestionByName("pd");
    expect(firstId(pd)).toBe(pd.panels[0].questions[0].items[0].editor.inputId);
  });
  test("a multiple text gives the editor with an error to its page", () => {
    const focused = vi.spyOn(SurveyElement, "FocusElement").mockReturnValue(true);
    const survey = new SurveyModel({
      elements: [{ type: "multipletext", name: "mt", items: [{ name: "i1" }, { name: "i2", isRequired: true }] }]
    });
    const mt: any = survey.getQuestionByName("mt");
    survey.validate(true);
    focused.mockClear();
    survey.currentPage.focusFirstErrorQuestion();
    expect(survey.currentPage.getFirstQuestionToFocus(true)?.id).toBe(mt.items[1].editor.id);
    expect(focused.mock.calls[0][0]).toBe(mt.items[1].editor.inputId);
  });
  test("a composite gives its content, an error in a nested panel included", () => {
    const survey = new SurveyModel({ elements: [{ type: "nwcomposite", name: "cp" }] });
    const cp: any = survey.getQuestionByName("cp");
    const inner = cp.contentPanel.getQuestionByName("cpInner");
    const nested = cp.contentPanel.getQuestionByName("cpNested");
    nested.isRequired = true;
    expect(survey.currentPage.getFirstQuestionToFocus(false)?.id, "first").toBe(inner.id);
    expect(firstId(cp), "first id").toBe(inner.inputId);
    survey.validate(true);
    expect(survey.currentPage.getFirstQuestionToFocus(true)?.id, "error").toBe(nested.id);
    expect(firstErrorId(cp), "error id").toBe(nested.inputId);
  });
  test("a custom question stays the one the focus goes to", () => {
    const survey = new SurveyModel({ elements: [{ type: "nwcustom", name: "cu" }] });
    const cu: any = survey.getQuestionByName("cu");
    expect(survey.currentPage.getFirstQuestionToFocus(false)?.id).toBe(cu.id);
  });
  test("an error in a shown detail panel is focused, a detail panel that is not shown is not walked", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "matrixdynamic", name: "m", rowCount: 1, detailPanelMode: "underRow",
        columns: [{ name: "c1", cellType: "text" }],
        detailElements: [{ type: "text", name: "d1", isRequired: true }]
      }]
    });
    const matrix: any = survey.getQuestionByName("m");
    const row = matrix.visibleRows[0];
    row.showDetailPanel();
    survey.validate(true);
    const detailQuestion = row.detailPanel.questions[0];
    expect(survey.currentPage.getFirstQuestionToFocus(true)?.id, "shown").toBe(detailQuestion.id);
    expect(firstErrorId(matrix), "shown: id").toBe(detailQuestion.inputId);
    row.hideDetailPanel();
    expect(survey.currentPage.getFirstQuestionToFocus(true)?.id, "hidden").toBeUndefined();
  });
  test("a select question gives itself first and an error of a shown choice panel after it", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "radiogroup", name: "r", defaultValue: 1,
        choices: [{ value: 1, elements: [{ type: "text", name: "inner", isRequired: true }] }, { value: 2, elements: [{ type: "text", name: "other" }] }]
      }]
    });
    const radio: any = survey.getQuestionByName("r");
    const inner = survey.getQuestionByName("inner");
    expect(survey.currentPage.getFirstQuestionToFocus(false)?.id, "no error").toBe(radio.id);
    expect(firstId(radio), "no error: id").toBe(radio.inputId + "_0");
    survey.validate(true);
    expect(survey.currentPage.getFirstQuestionToFocus(true)?.id, "error").toBe(inner.id);
    expect(firstErrorId(radio), "error: id").toBe(inner.inputId);
  });
  test("a dynamic panel gives the add button when it has nothing else to focus", () => {
    const survey = new SurveyModel({
      elements: [{ type: "paneldynamic", name: "pd", isRequired: true, templateElements: [{ type: "text", name: "q1" }] }]
    });
    const pd: any = survey.getQuestionByName("pd");
    expect(pd.getFirstQuestionToFocus(false)?.id, "first").toBe(pd.id);
    expect(typeof firstId(pd), "first: the add button").toBe("function");
    survey.validate(true);
    expect(pd.getFirstQuestionToFocus(true)?.id, "error").toBe(pd.id);
    expect(typeof firstErrorId(pd), "error: the add button").toBe("function");
  });
  test("the TOC expands the panel around a nested question it focuses", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "panel", name: "p1", state: "collapsed", elements: [{ type: "multipletext", name: "mt", items: [{ name: "i1" }] }] },
        { type: "panel", name: "p2", state: "collapsed", elements: [{ type: "matrixdynamic", name: "m", rowCount: 1, columns: [{ name: "c1", cellType: "text" }] }] }
      ]
    });
    const p1 = <PanelModel>survey.getPanelByName("p1");
    tryFocusPage(survey, p1);
    expect(p1.isCollapsed, "multiple text").toBe(false);
    const p2 = <PanelModel>survey.getPanelByName("p2");
    (<any>survey.getQuestionByName("m")).visibleRows;
    tryFocusPage(survey, p2);
    expect(p2.isCollapsed, "matrix").toBe(false);
  });
});

describe("The walk stops at the first true a visitor gives", () => {
  beforeEach(() => {
    ComponentCollection.Instance.add(<any>{ name: "stopCp", elementsJSON: [{ type: "text", name: "cq" }] });
    ComponentCollection.Instance.add(<any>{ name: "stopCu", questionJSON: { type: "text" } });
  });
  function createStopSurvey(): SurveyModel {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic", name: "matrix", rowCount: 2, detailPanelMode: "underRow",
          columns: [{ name: "c1", cellType: "text", totalType: "count" }, { name: "c2", cellType: "text" }],
          detailElements: [{ type: "text", name: "d1" }]
        },
        { type: "multipletext", name: "mt", items: [{ name: "i1" }, { name: "i2" }] },
        { type: "paneldynamic", name: "pd", panelCount: 2, templateElements: [{ type: "text", name: "t1" }] },
        { type: "checkbox", name: "select", choices: [{ value: 1, elements: [{ type: "text", name: "n1" }] }, { value: 2, elements: [{ type: "text", name: "n2" }] }] },
        { type: "stopCp", name: "composite" },
        { type: "stopCu", name: "custom" }
      ]
    });
    const matrix: any = survey.getQuestionByName("matrix");
    matrix.visibleRows.forEach((row: any) => row.ensureDetailPanel());
    return survey;
  }
  ["matrix", "mt", "pd", "select", "composite", "custom"].forEach(name => {
    test(name + " visits nothing after it", () => {
      const q: any = createStopSurvey().getQuestionByName(name);
      if (name === "select") q.value = [1, 2];
      [false, true].forEach(visibleOnly => {
        const options = { build: "none", visibleOnly: visibleOnly };
        let count = 0;
        q.forEachNestedElement(() => { count++; }, options);
        expect(count > 0, "there is something to walk").toBe(true);
        for (let stopAt = 1; stopAt <= count; stopAt++) {
          let visited = 0;
          q.forEachNestedElement(() => ++visited === stopAt, options);
          expect(visited, "visibleOnly " + visibleOnly + ": stop at " + stopAt + " of " + count).toBe(stopAt);
        }
      });
    });
  });
});

describe("containsErrors of a question that holds nested elements", () => {
  beforeEach(() => {
    ComponentCollection.Instance.add(<any>{
      name: "errorCp",
      elementsJSON: [{ type: "panel", name: "inner", elements: [{ type: "text", name: "cq", isRequired: true }] }]
    });
    ComponentCollection.Instance.add(<any>{ name: "errorCu", questionJSON: { type: "text", isRequired: true } });
  });
  function checkErrorComesAndGoes(survey: SurveyModel, name: string, getNested: (q: any) => Question): void {
    survey.validationEnabled = true;
    const q: any = survey.getQuestionByName(name);
    const nested = getNested(q);
    expect(survey.validate(true), "invalid").toBe(false);
    expect(nested.containsErrors, "nested").toBe(true);
    expect(q.containsErrors, "reported").toBe(true);
    nested.value = "a";
    expect(nested.containsErrors, "nested is fixed").toBe(false);
    expect(q.containsErrors, "fixed").toBe(false);
  }
  test("a composite reports a question of its content panel", () => {
    const survey = new SurveyModel({ checkErrorsMode: "onValueChanged", elements: [{ type: "errorCp", name: "q" }] });
    checkErrorComesAndGoes(survey, "q", q => q.contentPanel.questions[0]);
  });
  test("a custom question reports its content question", () => {
    const survey = new SurveyModel({ elements: [{ type: "errorCu", name: "q" }] });
    checkErrorComesAndGoes(survey, "q", q => q.contentQuestion);
  });
  test("a select question reports a question of a choice panel", () => {
    const survey = new SurveyModel({ elements: [{ type: "checkbox", name: "q", choices: [{ value: 1, elements: [{ type: "text", name: "n1", isRequired: true }] }, 2] }] });
    survey.setValue("q", [1]);
    checkErrorComesAndGoes(survey, "q", () => <Question>survey.getQuestionByName("n1"));
  });
  test("a matrix reports a question of a detail panel", () => {
    const survey = new SurveyModel({
      checkErrorsMode: "onValueChanged",
      elements: [{
        type: "matrixdynamic", name: "q", rowCount: 1, detailPanelMode: "underRow",
        columns: [{ name: "c1", cellType: "text" }],
        detailElements: [{ type: "text", name: "d1", isRequired: true }]
      }]
    });
    const row = (<any>survey.getQuestionByName("q")).visibleRows[0];
    row.showDetailPanel();
    checkErrorComesAndGoes(survey, "q", () => row.detailPanel.questions[0]);
  });
  test("a matrix, a multiple text and a dynamic panel report what they did", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "matrixdynamic", name: "m", rowCount: 1, columns: [{ name: "c1", cellType: "text", isRequired: true }] },
        { type: "multipletext", name: "mt", items: [{ name: "i1", isRequired: true }] },
        { type: "paneldynamic", name: "pd", panelCount: 1, templateElements: [{ type: "text", name: "t1", isRequired: true }] }
      ]
    });
    checkErrorComesAndGoes(survey, "m", q => q.visibleRows[0].cells[0].question);
    checkErrorComesAndGoes(survey, "mt", q => q.items[0].editor);
    checkErrorComesAndGoes(survey, "pd", q => q.panels[0].questions[0]);
  });
  test("the panels around a fixed question follow it", () => {
    const survey = new SurveyModel({
      elements: [{ type: "panel", name: "outer", elements: [{ type: "panel", name: "p", elements: [{ type: "text", name: "q", isRequired: true }] }] }]
    });
    survey.validate(true);
    const outer = <PanelModel>survey.getPanelByName("outer");
    expect(outer.containsErrors, "reported").toBe(true);
    survey.setValue("q", "a");
    expect(outer.containsErrors, "fixed").toBe(false);
  });
  test("a hidden dynamic panel no longer counts: what it holds is stale", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "hide" },
        { type: "paneldynamic", name: "pd", panelCount: 1, templateVisibleIf: "{hide} empty", templateElements: [{ type: "text", name: "t1", isRequired: true }] }
      ]
    });
    const pd: any = survey.getQuestionByName("pd");
    survey.validate(true);
    expect(pd.containsErrors, "shown").toBe(true);
    survey.setValue("hide", "a");
    survey.validate(true);
    expect(pd.containsErrors, "hidden").toBe(false);
  });
  test("a hidden matrix row no longer counts: what it holds is stale", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "hide" },
        {
          type: "matrixdropdown", name: "m", rows: [{ value: "r1", visibleIf: "{hide} empty" }, "r2"],
          columns: [{ name: "c1", cellType: "text", isRequired: true }]
        }
      ]
    });
    const m: any = survey.getQuestionByName("m");
    const cell = m.visibleRows[0].cells[0].question;
    m.visibleRows[1].cells[0].question.value = "a";
    survey.validate(true);
    expect(cell.containsErrors, "the cell").toBe(true);
    expect(m.containsErrors, "shown").toBe(true);
    survey.setValue("hide", "a");
    survey.validate(true);
    expect(cell.isVisible, "the cell itself stays visible").toBe(true);
    expect(cell.containsErrors, "the cell keeps what it had").toBe(true);
    expect(m.containsErrors, "hidden").toBe(false);
  });
  test("a matrix is asked once by a validation without errors, not once per cell", () => {
    const survey = new SurveyModel({
      elements: [{ type: "matrixdynamic", name: "m", rowCount: 3, columns: [{ name: "c1", cellType: "text" }, { name: "c2", cellType: "text" }] }]
    });
    const m: any = survey.getQuestionByName("m");
    m.visibleRows;
    const spy = vi.spyOn(m, "getContainsErrors");
    survey.validate(true);
    expect(spy).toHaveBeenCalledTimes(1);
  });
});

describe("getAllErrors() and clearErrors() of composite and select questions", () => {
  beforeEach(() => {
    ComponentCollection.Instance.add(<any>{ name: "neCpOne", elementsJSON: [{ type: "text", name: "a", isRequired: true }] });
    ComponentCollection.Instance.add(<any>{
      name: "neCp",
      elementsJSON: [
        { type: "text", name: "a", isRequired: true },
        { type: "text", name: "b", isRequired: true },
        { type: "text", name: "c", inputType: "number", validators: [{ type: "numeric", minValue: 10 }] }
      ]
    });
    ComponentCollection.Instance.add(<any>{
      name: "neCpPanel",
      elementsJSON: [
        { type: "text", name: "hide" },
        { type: "panel", name: "p", visibleIf: "{composite.hide} empty", elements: [{ type: "text", name: "inner", isRequired: true }] }
      ]
    });
    ComponentCollection.Instance.add(<any>{
      name: "neCpShow",
      elementsJSON: [
        { type: "text", name: "show" },
        { type: "text", name: "r", isRequired: true, visibleIf: "{composite.show} notempty" },
        { type: "text", name: "a", isRequired: true }
      ]
    });
    ComponentCollection.Instance.add(<any>{
      name: "neCpHide",
      elementsJSON: [
        { type: "text", name: "hide" },
        { type: "text", name: "r", isRequired: true, visibleIf: "{composite.hide} empty" }
      ]
    });
    ComponentCollection.Instance.add(<any>{
      name: "neCpReqPanel",
      elementsJSON: [
        { type: "text", name: "show" },
        { type: "text", name: "a", isRequired: true },
        { type: "panel", name: "rp", isRequired: true, visibleIf: "{composite.show} notempty", elements: [{ type: "text", name: "rpq" }] }
      ]
    });
    ComponentCollection.Instance.add(<any>{
      name: "neCpReqPanelShown",
      elementsJSON: [
        { type: "text", name: "a", isRequired: true },
        { type: "text", name: "z" },
        { type: "panel", name: "rp", isRequired: true, elements: [{ type: "text", name: "rpq" }] }
      ]
    });
    ComponentCollection.Instance.add(<any>{ name: "neCu", questionJSON: { type: "text", isRequired: true } });
  });
  const selectJson = (mode?: string): any => ({
    checkErrorsMode: mode,
    elements: [{
      type: "checkbox", name: "sel",
      choices: [{ value: 1, elements: [{ type: "text", name: "n1", isRequired: true }] }, 2]
    }]
  });
  const nestedOf = (q: any, name: string): Question => q.contentPanel.getQuestionByName(name);
  const modes = ["onNextPage", "onValueChanged"];

  test("a composite reports its nested error, and a valid answer clears it in the default mode", () => {
    const survey = new SurveyModel({ elements: [{ type: "neCpOne", name: "q" }] });
    const q: any = survey.getQuestionByName("q");
    const a = nestedOf(q, "a");
    survey.validate(true);
    expect(q.getAllErrors().length, "reported").toBe(1);
    a.value = "x";
    expect(a.errors.length, "the nested question").toBe(0);
    expect(q.containsErrors, "containsErrors").toBe(false);
    expect(q.getAllErrors().length, "nothing reported").toBe(0);
  });
  test("a composite reports a question of a panel inside it, and a valid answer clears it", () => {
    const survey = new SurveyModel({ elements: [{ type: "neCpPanel", name: "q" }] });
    const q: any = survey.getQuestionByName("q");
    const inner = nestedOf(q, "inner");
    survey.validate(true);
    expect(q.getAllErrors().length, "reported").toBe(1);
    inner.value = "x";
    expect(inner.errors.length, "the nested question").toBe(0);
    expect(q.containsErrors, "containsErrors").toBe(false);
    expect(q.getAllErrors().length, "nothing reported").toBe(0);
  });
  test.each(modes)("a composite with two required errors: fixing one keeps the other, %s", (mode) => {
    const survey = new SurveyModel({ checkErrorsMode: mode, elements: [{ type: "neCp", name: "q" }] });
    const q: any = survey.getQuestionByName("q");
    survey.validate(true);
    expect(q.getAllErrors().length, "two errors").toBe(2);
    nestedOf(q, "a").value = "x";
    const b = nestedOf(q, "b");
    expect(b.isEmpty(), "b is still empty").toBe(true);
    expect(b.errors.length, "b keeps its error").toBe(1);
    expect(nestedOf(q, "a").errors.length, "a is fixed").toBe(0);
    expect(q.getAllErrors().length, "one reported").toBe(1);
  });
  test.each(modes)("a select: checking another choice keeps the error of a showing choice panel, %s", (mode) => {
    const survey = new SurveyModel(selectJson(mode));
    const sel: any = survey.getQuestionByName("sel");
    sel.value = [1];
    survey.validate(true);
    const n1 = <Question>survey.getQuestionByName("n1");
    expect(n1.errors.length, "n1 has the error").toBe(1);
    sel.value = [1, 2];
    expect(n1.isEmpty(), "n1 is still empty").toBe(true);
    expect(n1.errors.length, "n1 keeps its error").toBe(1);
  });
  test("a composite in onValueChanged mode: clearing a nested answer gives its required error", () => {
    const survey = new SurveyModel({ checkErrorsMode: "onValueChanged", elements: [{ type: "neCp", name: "q" }] });
    const q: any = survey.getQuestionByName("q");
    const a = nestedOf(q, "a");
    a.value = "x";
    nestedOf(q, "b").value = "y";
    a.clearValue();
    expect(a.errors.length, "a is required").toBe(1);
    expect(nestedOf(q, "b").errors.length, "b has a value").toBe(0);
  });
  test("a composite: a bad value next to an existing error shows at once, and the other error stays", () => {
    const survey = new SurveyModel({ elements: [{ type: "neCp", name: "q" }] });
    const q: any = survey.getQuestionByName("q");
    survey.validate(true);
    const c = nestedOf(q, "c");
    c.value = 5;
    expect(c.errors.length, "the bad value").toBe(1);
    expect(nestedOf(q, "b").errors.length, "b stays").toBe(1);
    c.value = 15;
    expect(c.errors.length, "the good value").toBe(0);
  });
  test("a composite: a question of a panel that a visibleIf hides keeps its error and is not reported", () => {
    const survey = new SurveyModel({ elements: [{ type: "neCpPanel", name: "q" }] });
    const q: any = survey.getQuestionByName("q");
    const inner = nestedOf(q, "inner");
    survey.validate(true);
    expect(q.getAllErrors().length, "shown").toBe(1);
    nestedOf(q, "hide").value = "x";
    expect(q.contentPanel.getElementByName("p").isVisible, "the panel is hidden").toBe(false);
    expect(inner.errors.length, "the question keeps its error").toBe(1);
    expect(q.getAllErrors().length, "not reported").toBe(0);
  });
  test("a composite: an empty question that had no error gains none on a value change", () => {
    const survey = new SurveyModel({ elements: [{ type: "neCpShow", name: "q" }] });
    const q: any = survey.getQuestionByName("q");
    survey.validate(true);
    expect(q.getAllErrors().length, "a only").toBe(1);
    nestedOf(q, "show").value = "x";
    const r = nestedOf(q, "r");
    expect(r.isVisible, "r is shown").toBe(true);
    expect(r.errors.length, "r gains no error").toBe(0);
    expect(nestedOf(q, "a").errors.length, "a keeps its error").toBe(1);
  });
  test("a select reports the error of a showing choice panel, and not once the choice is unselected", () => {
    const survey = new SurveyModel(selectJson());
    const sel: any = survey.getQuestionByName("sel");
    sel.value = [1];
    survey.validate(true);
    expect(sel.getAllErrors().length, "showing").toBe(1);
    sel.value = [2];
    expect(sel.getAllErrors().length, "unselected").toBe(0);
  });
  test("clearErrors() on a composite clears what it reports", () => {
    const survey = new SurveyModel({ elements: [{ type: "neCp", name: "q" }] });
    const q: any = survey.getQuestionByName("q");
    survey.validate(true);
    expect(q.containsErrors, "before").toBe(true);
    q.clearErrors();
    expect(q.getAllErrors().length, "nothing reported").toBe(0);
    expect(nestedOf(q, "a").errors.length, "a").toBe(0);
    expect(nestedOf(q, "a").containsErrors, "a containsErrors").toBe(false);
    expect(q.containsErrors, "q containsErrors").toBe(false);
    expect(survey.pages[0].containsErrors, "the page").toBe(false);
  });
  test("clearErrors() on a select clears its choice panels, a hidden one included", () => {
    const survey = new SurveyModel(selectJson());
    const sel: any = survey.getQuestionByName("sel");
    const n1 = <Question>survey.getQuestionByName("n1");
    sel.value = [1];
    survey.validate(true);
    sel.value = [2];
    expect(n1.errors.length, "the hidden panel keeps its error").toBe(1);
    sel.clearErrors();
    expect(n1.errors.length, "hidden").toBe(0);
    sel.value = [1];
    survey.validate(true);
    expect(sel.containsErrors, "shown, before").toBe(true);
    sel.clearErrors();
    expect(n1.errors.length, "shown").toBe(0);
    expect(n1.containsErrors, "n1 containsErrors").toBe(false);
    expect(sel.containsErrors, "sel containsErrors").toBe(false);
    expect(survey.pages[0].containsErrors, "the page").toBe(false);
  });
  test("a composite question that a visibleIf hides has its errors emptied, and containsErrors follows", () => {
    const survey = new SurveyModel({ elements: [{ type: "neCpHide", name: "q" }] });
    const q: any = survey.getQuestionByName("q");
    const r = nestedOf(q, "r");
    survey.validate(true);
    expect(q.containsErrors, "before").toBe(true);
    nestedOf(q, "hide").value = "x";
    expect(r.errors.length, "emptied").toBe(0);
    expect(r.containsErrors, "r").toBe(false);
    expect(q.containsErrors, "q").toBe(false);
  });
  test("a custom question reports one error, not two", () => {
    const survey = new SurveyModel({ elements: [{ type: "neCu", name: "q" }] });
    const q: any = survey.getQuestionByName("q");
    survey.validate(true);
    expect(q.getAllErrors().length).toBe(1);
  });
  test("clearErrors() on a custom question clears its content question", () => {
    const survey = new SurveyModel({ elements: [{ type: "neCu", name: "q" }] });
    const q: any = survey.getQuestionByName("q");
    survey.validate(true);
    q.clearErrors();
    expect(q.contentQuestion.errors.length, "content").toBe(0);
    expect(q.contentQuestion.containsErrors, "content containsErrors").toBe(false);
    expect(q.containsErrors, "q containsErrors").toBe(false);
    expect(survey.pages[0].containsErrors, "the page").toBe(false);
  });
  test("a hidden multiple text reports no errors", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "hide" },
        { type: "multipletext", name: "mt", visibleIf: "{hide} empty", items: [{ name: "i1", isRequired: true }] }
      ]
    });
    const mt: any = survey.getQuestionByName("mt");
    survey.validate(true);
    expect(mt.getAllErrors().length, "shown").toBe(1);
    survey.setValue("hide", "x");
    expect(mt.items[0].editor.errors.length, "the editor keeps its error").toBe(1);
    expect(mt.getAllErrors().length, "hidden").toBe(0);
  });
  test.each(modes)("a dynamic panel set from outside keeps the other required error and drops a stale validator error, %s", (mode) => {
    const survey = new SurveyModel({
      checkErrorsMode: mode,
      elements: [{
        type: "paneldynamic", name: "pd", panelCount: 1,
        templateElements: [
          { type: "text", name: "t1", isRequired: true },
          { type: "text", name: "t2", isRequired: true },
          { type: "text", name: "t3", inputType: "number", validators: [{ type: "numeric", minValue: 10 }] }
        ]
      }]
    });
    const pd: any = survey.getQuestionByName("pd");
    survey.setValue("pd", [{ t3: 5 }]);
    survey.validate(true);
    const panel = pd.panels[0];
    expect(panel.getQuestionByName("t2").errors.length, "t2 is required").toBe(1);
    expect(panel.getQuestionByName("t3").errors.length, "t3 is too small").toBe(1);
    pd.value = [{ t1: "x" }];
    expect(panel.getQuestionByName("t2").errors.length, "t2 keeps its error").toBe(1);
    expect(panel.getQuestionByName("t3").isEmpty(), "t3 is emptied").toBe(true);
    expect(panel.getQuestionByName("t3").errors.length, "t3 has no stale error").toBe(0);
  });
  test("a page question re-checked by a dependent validator keeps its required error", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1", isRequired: true, validators: [{ type: "expression", expression: "{q2} != 'bad'" }] },
        { type: "text", name: "q2" }
      ]
    });
    const q1 = survey.getQuestionByName("q1");
    survey.validate(true);
    expect(q1.errors.length, "required").toBe(1);
    survey.setValue("q2", "x");
    expect(q1.errors.length, "keeps it").toBe(1);
  });
  test.each(modes)("a required panel of a composite that a visibleIf shows after the validation gains no error, %s", (mode) => {
    const survey = new SurveyModel({ checkErrorsMode: mode, elements: [{ type: "neCpReqPanel", name: "q" }] });
    const q: any = survey.getQuestionByName("q");
    survey.validate(true);
    nestedOf(q, "show").value = "x";
    const rp = q.contentPanel.getElementByName("rp");
    expect(rp.isVisible, "shown").toBe(true);
    expect(rp.errors.length, "no error").toBe(0);
    nestedOf(q, "a").value = "y";
    expect(rp.errors.length, "still none").toBe(0);
  });
  test.each(modes)("a required panel of a composite keeps its error while empty, loses it once answered, gets it back when cleared, %s", (mode) => {
    const survey = new SurveyModel({ checkErrorsMode: mode, elements: [{ type: "neCpReqPanelShown", name: "q" }] });
    const q: any = survey.getQuestionByName("q");
    survey.validate(true);
    const rp = q.contentPanel.getElementByName("rp");
    expect(rp.errors.length, "required").toBe(1);
    // a keeps its error, so the composite is re-validated on each change: a panel error alone is not reported (NE17).
    nestedOf(q, "z").value = "x";
    expect(rp.errors.length, "kept while empty").toBe(1);
    const rpq = nestedOf(q, "rpq");
    rpq.value = "y";
    expect(rp.errors.length, "answered").toBe(0);
    rpq.clearValue();
    expect(rp.errors.length, "cleared").toBe(1);
  });
  test("variablePresets: a composite's nested error appears once, a choice panel error under the select", () => {
    const presets = new SurveyVariablePresets({
      definition: {
        elements: [
          { type: "neCp", name: "cp" },
          { type: "checkbox", name: "sel", choices: [{ value: 1, elements: [{ type: "text", name: "n1", isRequired: true }] }, 2] }
        ]
      }
    });
    const res = presets.validateVariables({ cp: { a: "x" }, sel: [1] });
    const cp = res.errors.filter(e => e.variable === "cp");
    expect(cp.length, "one entry for cp").toBe(1);
    expect(cp[0].errors.length, "the b error, once").toBe(1);
    const sel = res.errors.filter(e => e.variable === "sel");
    expect(sel.length, "one entry for sel").toBe(1);
    expect(sel[0].errors.length, "the n1 error").toBe(1);
    presets.dispose();
  });
});

describe("getAllErrors() and clearErrors() of a matrix with detail panels", () => {
  // A validator that does not read its row: an expression over {row.x} is re-checked by any value change of the row.
  const maxTen = { type: "text", name: "d", inputType: "number", validators: [{ type: "numeric", maxValue: 10 }] };
  const required = { type: "text", name: "d", isRequired: true };
  const requiredCell = { name: "c", cellType: "text", isRequired: true };
  const hidingCell = { name: "h", cellType: "text" };
  interface IMatrixOptions { mode?: string, paged?: boolean, matrix?: any, elements?: Array<any> }
  function createMatrixSurvey(detailElements: Array<any>, options: IMatrixOptions = {}): SurveyModel {
    return new SurveyModel({
      checkErrorsMode: options.mode,
      elements: [...(options.elements || []), {
        type: "matrixdynamic", name: "m", rowCount: 2, detailPanelMode: "underRow",
        columns: [{ name: "c", cellType: "text" }], detailElements: detailElements,
        ...(options.paged ? { pageSize: 2 } : {}), ...(options.matrix || {})
      }]
    });
  }
  const matrixOf = (survey: SurveyModel): any => survey.getQuestionByName("m");
  const detailOf = (row: any, name: string = "d"): Question => row.detailPanel.getQuestionByName(name);
  const panelsShowing = (rows: Array<any>): Array<boolean> => rows.map(row => row.isDetailPanelShowing);
  const ownerNames = (errors: Array<any>): Array<string> => errors.map(error => error.errorOwner.name);

  test("a detail question's error is reported, and a valid answer clears it in the default mode", () => {
    const survey = createMatrixSurvey([maxTen], { matrix: { rowCount: 1 } });
    const m = matrixOf(survey);
    const row = m.visibleRows[0];
    row.showDetailPanel();
    const d = detailOf(row);
    d.value = 20;
    survey.validate(true);
    expect(d.errors.length, "the detail question shows it").toBe(1);
    expect(m.getAllErrors().length, "reported").toBe(1);
    d.value = 5;
    expect(d.errors.length, "the detail question is fixed").toBe(0);
    expect(m.getAllErrors().length, "nothing reported").toBe(0);
  });
  test("two rows with two required detail questions each: answering one keeps the other three errors", () => {
    const survey = createMatrixSurvey([{ type: "text", name: "d1", isRequired: true }, { type: "text", name: "d2", isRequired: true }]);
    const m = matrixOf(survey);
    survey.validate(true);
    expect(m.getAllErrors().length, "four errors").toBe(4);
    const rows = m.visibleRows;
    detailOf(rows[0], "d1").value = "x";
    expect(detailOf(rows[0], "d1").errors.length, "answered").toBe(0);
    expect([detailOf(rows[0], "d2"), detailOf(rows[1], "d1"), detailOf(rows[1], "d2")].map(q => q.errors.length), "the others").toEqual([1, 1, 1]);
    expect(m.getAllErrors().length, "three reported").toBe(3);
  });
  test("clearErrors() clears the cells and the detail panels, a hidden row's included", () => {
    const survey = createMatrixSurvey([required], { matrix: { rowsVisibleIf: "{row.h} empty", columns: [requiredCell, hidingCell] } });
    const m = matrixOf(survey);
    const rows = m.visibleRows;
    expect(survey.validate(true), "invalid").toBe(false);
    rows[1].getQuestionByName("h").value = "hide";
    expect(rows[1].isVisible, "row 1 is hidden").toBe(false);
    const questions = [rows[0].getQuestionByName("c"), detailOf(rows[0]), rows[1].getQuestionByName("c"), detailOf(rows[1])];
    expect(questions.map(q => q.errors.length), "before").toEqual([1, 1, 1, 1]);
    m.clearErrors();
    expect(questions.map(q => q.errors.length), "cleared").toEqual([0, 0, 0, 0]);
    expect(m.getAllErrors().length, "nothing reported").toBe(0);
  });
  const hidingSubPanel = (variable: string): Array<any> => [
    { type: "text", name: "hide" },
    { type: "panel", name: "sp", visibleIf: "{" + variable + ".hide} empty", elements: [{ type: "text", name: "inner", isRequired: true }] }
  ];
  test.each([false, true])("a question of a detail sub-panel that a visibleIf hides keeps its error and is not reported, paged: %s", (paged) => {
    const survey = createMatrixSurvey(hidingSubPanel("row"), { paged, matrix: { rowCount: 1 } });
    const m = matrixOf(survey);
    const row = m.visibleRows[0];
    survey.validate(true);
    expect(m.getAllErrors().length, "shown").toBe(1);
    detailOf(row, "hide").value = "x";
    expect(row.detailPanel.getElementByName("sp").isVisible, "the sub-panel is hidden").toBe(false);
    expect(detailOf(row, "inner").errors.length, "the question keeps its error").toBe(1);
    expect(m.getAllErrors().length, "not reported").toBe(0);
  });
  test.each([false, true])("a question of a dynamic panel's sub-panel that a visibleIf hides keeps its error and is not reported, paged: %s", (paged) => {
    const survey = new SurveyModel({
      elements: [{ type: "paneldynamic", name: "pd", panelCount: 1, templateElements: hidingSubPanel("panel"), ...(paged ? { pageSize: 1 } : {}) }]
    });
    const pd: any = survey.getQuestionByName("pd");
    const panel = pd.panels[0];
    survey.validate(true);
    expect(pd.getAllErrors().length, "shown").toBe(1);
    panel.getQuestionByName("hide").value = "x";
    expect(panel.getElementByName("sp").isVisible, "the sub-panel is hidden").toBe(false);
    expect(panel.getQuestionByName("inner").errors.length, "the question keeps its error").toBe(1);
    expect(pd.getAllErrors().length, "not reported").toBe(0);
  });
  test("a hidden row reports the errors of its cells and not those of its detail panel", () => {
    const survey = createMatrixSurvey([required], { matrix: { rowCount: 1, rowsVisibleIf: "{row.h} empty", columns: [requiredCell, hidingCell] } });
    const m = matrixOf(survey);
    const row = m.visibleRows[0];
    survey.validate(true);
    expect(m.getAllErrors().length, "shown").toBe(2);
    row.getQuestionByName("h").value = "hide";
    expect(row.isVisible, "the row is hidden").toBe(false);
    expect(detailOf(row).errors.length, "the detail question keeps its error").toBe(1);
    expect(ownerNames(m.getAllErrors()), "the cell only").toEqual(["c"]);
  });
  // A container is hidden by its own visibleIf, or by the visibleIf of the panel around it.
  const hidingCases = [false, true].flatMap(paged => [{ by: "its own visibleIf", paged }, { by: "a parent panel", paged }]);
  const hideContainer = (by: string, container: any): Array<any> => {
    const hide = { type: "text", name: "hide" };
    if (by === "a parent panel") return [hide, { type: "panel", name: "p", visibleIf: "{hide} empty", elements: [container] }];
    return [hide, { ...container, visibleIf: "{hide} empty" }];
  };
  test.each(hidingCases)("a matrix hidden by $by reports no nested errors, and its questions keep them, paged: $paged", ({ by, paged }) => {
    const survey = new SurveyModel({
      elements: hideContainer(by, {
        type: "matrixdynamic", name: "m", rowCount: 1, detailPanelMode: "underRow",
        columns: [requiredCell], detailElements: [required], ...(paged ? { pageSize: 2 } : {})
      })
    });
    const m = matrixOf(survey);
    const row = m.visibleRows[0];
    survey.validate(true);
    expect(m.getAllErrors().length, "shown").toBe(2);
    survey.setValue("hide", "x");
    expect(m.isVisibleInSurvey, "the matrix is hidden").toBe(false);
    expect([row.getQuestionByName("c"), detailOf(row)].map(q => q.errors.length), "the questions keep their errors").toEqual([1, 1]);
    expect(m.getAllErrors().length, "hidden").toBe(0);
  });
  test.each(hidingCases)("a dynamic panel hidden by $by reports no nested errors, and its questions keep them, paged: $paged", ({ by, paged }) => {
    const survey = new SurveyModel({
      elements: hideContainer(by, {
        type: "paneldynamic", name: "pd", panelCount: 1, templateElements: [{ type: "text", name: "t1", isRequired: true }], ...(paged ? { pageSize: 1 } : {})
      })
    });
    const pd: any = survey.getQuestionByName("pd");
    const t1 = pd.panels[0].getQuestionByName("t1");
    survey.validate(true);
    expect(pd.getAllErrors().length, "shown").toBe(1);
    survey.setValue("hide", "x");
    expect(pd.isVisibleInSurvey, "the dynamic panel is hidden").toBe(false);
    expect(t1.errors.length, "the question keeps its error").toBe(1);
    expect(pd.getAllErrors().length, "hidden").toBe(0);
  });
  /* Without hidden rows. A hidden row breaks it: the unpaged matrix keeps reporting the hidden row's cells,
     and the paged one rebuilds the row objects of its page when a row is hidden, so it reports none. */
  test("a paged and an unpaged matrix report the same errors in the same order: a row's cells, then its detail panel", () => {
    const reported = [false, true].map(paged => {
      const survey = createMatrixSurvey([required], { paged, matrix: { columns: [requiredCell] } });
      survey.validate(true);
      return ownerNames(matrixOf(survey).getAllErrors());
    });
    expect(reported[0], "unpaged").toEqual(["c", "d", "c", "d"]);
    expect(reported[1], "paged").toEqual(reported[0]);
  });
  const valueChangeCases = [
    { name: "the default mode", mode: undefined, paged: false },
    { name: "onValueChanged", mode: "onValueChanged", paged: false },
    { name: "onValueChanging", mode: "onValueChanging", paged: false },
    { name: "a paged matrix", mode: undefined, paged: true }
  ];
  [
    { name: "a required detail question", detail: required, value: undefined },
    { name: "a detail validator with a failing value", detail: maxTen, value: 20 }
  ].forEach(failing => {
    test.each(valueChangeCases)(failing.name + ": a closed detail panel stays closed while cells change, $name", ({ mode, paged }) => {
      const survey = createMatrixSurvey([failing.detail], { mode, paged });
      const rows = matrixOf(survey).visibleRows;
      rows[0].showDetailPanel();
      if (failing.value !== undefined) detailOf(rows[0]).value = failing.value;
      expect(survey.validate(true), "invalid").toBe(false);
      expect(detailOf(rows[0]).errors.length, "row 0 shows the error").toBe(1);
      rows.forEach(row => row.hideDetailPanel());
      rows[0].getQuestionByName("c").value = "a";
      expect(panelsShowing(rows), "a cell of the same row").toEqual([false, false]);
      rows[1].getQuestionByName("c").value = "b";
      expect(panelsShowing(rows), "a cell of another row").toEqual([false, false]);
      expect(detailOf(rows[0]).errors.length, "row 0 keeps the error").toBe(1);
      survey.validate(true);
      expect(rows[0].isDetailPanelShowing, "a full validation opens it").toBe(true);
    });
  });
  test.each(valueChangeCases.filter(item => !item.paged))("a duplicate key in detail panels: both panels stay closed while a cell changes, $name", ({ mode }) => {
    const survey = createMatrixSurvey([{ type: "text", name: "k" }], { mode, matrix: { keyName: "k" } });
    survey.setValue("m", [{ k: "same" }, { k: "same" }]);
    const rows = matrixOf(survey).visibleRows;
    expect(survey.validate(true), "duplicated").toBe(false);
    expect(panelsShowing(rows), "the validation opens both").toEqual([true, true]);
    rows.forEach(row => row.hideDetailPanel());
    rows[1].getQuestionByName("c").value = "x";
    expect(panelsShowing(rows), "closed").toEqual([false, false]);
    expect(rows.map(row => detailOf(row, "k").errors.length), "each row keeps its duplicate error").toEqual([1, 1]);
    survey.validate(true);
    expect(panelsShowing(rows), "a full validation opens them").toEqual([true, true]);
  });
  // In onValueChanging mode the row validation creates no panel, so the duplicate check has to create it.
  test.each(["onValueChanged", "onValueChanging"])("a duplicate key set from code into detail panels never opened: both rows get the error and no panel opens, %s", (mode) => {
    const survey = createMatrixSurvey([{ type: "text", name: "k" }], { mode, matrix: { keyName: "k" } });
    const rows = matrixOf(survey).visibleRows;
    survey.setValue("m", [{ k: "same" }, { k: "same" }]);
    expect(panelsShowing(rows), "closed").toEqual([false, false]);
    expect(rows.map(row => detailOf(row, "k").errors.length), "each row has its duplicate error").toEqual([1, 1]);
  });
  test("underRowSingle: the panel the respondent opens stays open while the row with the error is re-validated", () => {
    const survey = createMatrixSurvey([maxTen], { matrix: { detailPanelMode: "underRowSingle" } });
    const rows = matrixOf(survey).visibleRows;
    rows[0].showDetailPanel();
    detailOf(rows[0]).value = 20;
    survey.validate(true);
    expect(detailOf(rows[0]).errors.length, "row 0 shows the error").toBe(1);
    rows[1].showDetailPanel();
    expect(panelsShowing(rows), "the respondent opens row 1").toEqual([false, true]);
    rows[1].getQuestionByName("c").value = "a";
    expect(panelsShowing(rows), "row 1 stays open").toEqual([false, true]);
    expect(detailOf(rows[0]).errors.length, "row 0 keeps the error").toBe(1);
  });
  test("an empty required detail question that a visibleIf shows after the validation gains no error", () => {
    const survey = createMatrixSurvey([
      { type: "text", name: "d1", isRequired: true },
      { type: "text", name: "show" },
      { type: "text", name: "d2", isRequired: true, visibleIf: "{row.show} notempty" }
    ], { matrix: { rowCount: 1 } });
    const row = matrixOf(survey).visibleRows[0];
    survey.validate(true);
    expect(detailOf(row, "d1").errors.length, "d1 is required").toBe(1);
    detailOf(row, "show").value = "x";
    expect(detailOf(row, "d2").isVisible, "d2 is shown").toBe(true);
    expect(detailOf(row, "d2").errors.length, "d2 gains no error").toBe(0);
    expect(detailOf(row, "d1").errors.length, "d1 keeps its error").toBe(1);
  });
  test("a filled detail question with a failing value gets its error at once next to an error in another row", () => {
    const survey = createMatrixSurvey([{ type: "text", name: "d1", isRequired: true }, maxTen]);
    survey.setValue("m", [{}, { d1: "y" }]);
    const rows = matrixOf(survey).visibleRows;
    survey.validate(true);
    expect([detailOf(rows[0], "d1"), detailOf(rows[1], "d1")].map(q => q.errors.length), "row 0 only").toEqual([1, 0]);
    detailOf(rows[1]).value = 20;
    expect(detailOf(rows[1]).errors.length, "the bad value shows at once").toBe(1);
    expect(detailOf(rows[0], "d1").errors.length, "row 0 keeps its error").toBe(1);
  });
});
