import { SurveyModel } from "../src/survey";
import { Question } from "../src/question";
import { PanelModel } from "../src/panel";
import { ComponentCollection } from "../src/question_custom";
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
        ...(paged ? { rowsPerPage: 1 } : {})
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
        ...(paged ? { panelsPerPage: 1 } : {})
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
  // detail panel: getAllErrors() without paging reads the cells. total row and hidden item: not read. custom, composite and
  // select questions do not override getAllErrors(): they report their own errors.
  "getAllErrors": {
    reached: ["md.cell", "md.hiddenRowCell", "mx.cell", "mx.hiddenRowCell", "pd.item", "pd.static", "mt.editor"]
  },
  // hidden rows, detail panel, total row: a matrix clears the errors of the cells of its visible rows. custom, composite
  // and select questions do not override clearErrors().
  "clearErrors": {
    reached: ["md.cell", "mx.cell", "pd.item", "pd.hiddenItem", "pd.static", "mt.editor"]
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
  // hidden rows, detail panel, total row: localeChanged() never reached them. choice panels: a select question does not forward it.
  "localeChanged": {
    reached: ["md.cell", "mx.cell", "pd.item", "pd.hiddenItem", "pd.static", "mt.editor", "cu.content", "cp.content", "cp.nested"]
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
  // matrices, multiple text, select: they do not forward setIsMobile().
  "setIsMobile": {
    reached: ["pd.item", "pd.hiddenItem", "pd.static", "pd.choicePanel", "cu.content", "cp.content", "cp.nested"]
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
    reached: ["md.cell", "mx.cell", "pd.item"]
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
  // dynamic panel items, the one in a detail panel included: nothing disposes them.
  "dispose": {
    reached: ["md.cell", "md.hiddenRowCell", "md.detail", "md.total", "mx.cell", "mx.hiddenRowCell", "mt.editor", "cu.content", "cp.content", "cp.nested", "cb.shownPanel", "cb.hiddenPanel", "rg.panel"]
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
