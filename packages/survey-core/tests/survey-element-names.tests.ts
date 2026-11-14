import { describe, test, expect, vi } from "vitest";
import { SurveyModel } from "../src/survey";
import { PanelModel } from "../src/panel";
import { PageModel } from "../src/page";
import { QuestionPanelDynamicModel } from "../src/question_paneldynamic";

// Compared by id: a failed toBe on a survey element prints the whole survey
const id = (el: any): any => !el ? el : el.getType() + ":" + el.name + "#" + el.id;

const treeJson = (): any => ({
  pages: [
    { name: "page1", elements: [
      { type: "panel", name: "panel1", title: "Panel 1 title", elements: [
        { type: "text", name: "q1" },
        { type: "panel", name: "panel2", elements: [{ type: "text", name: "q2" }] }
      ] }
    ] },
    { name: "page2", title: "Page 2 title", elements: [
      { type: "text", name: "q3" },
      { type: "paneldynamic", name: "dp", panelCount: 1, templateElements: [
        { type: "panel", name: "tpanel", elements: [{ type: "text", name: "tq" }] }
      ] }
    ] }
  ]
});

describe("Survey element names: one hash for questions, panels and pages", () => {
  test("each getter finds its element by name; letter case", () => {
    const survey = new SurveyModel(treeJson());
    const page1 = survey.pages[0];
    const panel1 = survey.getAllPanels()[0];
    expect(id(survey.getPageByName("page1"))).toBe(id(page1));
    expect(id(survey.getPanelByName("panel1"))).toBe(id(panel1));
    expect(survey.getQuestionByName("q1").name).toBe("q1");
    expect(id(survey.getElementByName("page1"))).toBe(id(page1));
    expect(id(survey.getElementByName("panel1"))).toBe(id(panel1));
    expect(id(survey.getElementByName("q1"))).toBe(id(survey.getQuestionByName("q1")));

    expect(id(survey.getPanelByName("PANEL1", true)), "a panel ignoring letter case").toBe(id(panel1));
    expect(id(survey.getPanelByName("PANEL1")), "a panel by exact name").toBeNull();
    expect(survey.getQuestionByName("Q1", true).name, "a question ignoring letter case").toBe("q1");
    expect(id(survey.getQuestionByName("Q1")), "a question by exact name").toBeNull();
    expect(id(survey.getPageByName("PAGE1")), "getPageByName is case-sensitive").toBeNull();

    expect(id(survey.getPageByName("panel1")), "a panel is not a page").toBeNull();
    expect(id(survey.getPanelByName("page1")), "a page is not a panel").toBeNull();
    expect(id(survey.getPanelByName("q1")), "a question is not a panel").toBeNull();
    expect(id(survey.getQuestionByName("panel1")), "a panel is not a question").toBeNull();

    expect(id(survey.getPageByName("nothing"))).toBeNull();
    expect(id(survey.getPanelByName("nothing"))).toBeNull();
    expect(id(survey.getPanelByName("nothing", true))).toBeNull();
    expect(id(survey.getQuestionByName("nothing"))).toBeNull();
    expect(id(survey.getElementByName("nothing"))).toBeNull();
    expect(id(survey.getElementByName(""))).toBeNull();
  });
  test("a name that is an Object.prototype member finds nothing", () => {
    const survey = new SurveyModel(treeJson());
    expect(id(survey.getPageByName("constructor"))).toBeNull();
    expect(id(survey.getPanelByName("toString", true))).toBeNull();
    expect(id(survey.getElementByName("valueOf"))).toBeNull();
  });
  test("a panel and a question share a name; a page and a panel share a name", () => {
    const survey = new SurveyModel({
      pages: [
        { name: "page1", elements: [
          { type: "panel", name: "q1", elements: [{ type: "text", name: "inner" }] },
          { type: "text", name: "q1" },
          { type: "panel", name: "page2", elements: [{ type: "text", name: "inner2" }] }
        ] },
        { name: "page2", elements: [{ type: "text", name: "q3" }] }
      ]
    });
    const panelQ1 = survey.getAllPanels()[0];
    const panelPage2 = survey.getAllPanels()[1];
    const question = survey.pages[0].elements[1];
    expect(id(survey.getQuestionByName("q1"))).toBe(id(question));
    expect(id(survey.getPanelByName("q1"))).toBe(id(panelQ1));
    expect(id(survey.getElementByName("q1")), "a panel before a question").toBe(id(panelQ1));
    expect(id(survey.getQuestionByName("Q1", true))).toBe(id(question));
    expect(id(survey.getPanelByName("Q1", true))).toBe(id(panelQ1));

    expect(id(survey.getPageByName("page2"))).toBe(id(survey.pages[1]));
    expect(id(survey.getPanelByName("page2"))).toBe(id(panelPage2));
    expect(id(survey.getElementByName("page2")), "a page before a panel").toBe(id(survey.pages[1]));
  });
  test("two panels under one name: the first one wins", () => {
    const survey = new SurveyModel({
      pages: [
        { name: "page1", elements: [{ type: "panel", name: "p", elements: [{ type: "text", name: "q1" }] }] },
        { name: "page2", elements: [{ type: "panel", name: "P", elements: [{ type: "text", name: "q2" }] }] }
      ]
    });
    const panels = survey.getAllPanels();
    expect(id(survey.getPanelByName("p"))).toBe(id(panels[0]));
    expect(id(survey.getPanelByName("P"))).toBe(id(panels[1]));
    expect(id(survey.getPanelByName("P", true)), "ignoring letter case, the first one in document order").toBe(id(panels[0]));
  });
  test("renaming a panel and a page at runtime", () => {
    const survey = new SurveyModel(treeJson());
    const panel1 = survey.getPanelByName("panel1");
    const page1 = survey.getPageByName("page1");
    panel1.name = "renamedPanel";
    page1.name = "renamedPage";
    expect(id(survey.getPanelByName("renamedPanel"))).toBe(id(panel1));
    expect(id(survey.getPanelByName("RENAMEDPANEL", true))).toBe(id(panel1));
    expect(id(survey.getPanelByName("panel1"))).toBeNull();
    expect(id(survey.getPanelByName("PANEL1", true))).toBeNull();
    expect(id(survey.getElementByName("renamedPanel"))).toBe(id(panel1));
    expect(id(survey.getElementByName("panel1"))).toBeNull();
    expect(id(survey.getPageByName("renamedPage"))).toBe(id(page1));
    expect(id(survey.getPageByName("page1"))).toBeNull();
    expect(id(survey.getElementByName("renamedPage"))).toBe(id(page1));
    expect(id(survey.getElementByName("page1"))).toBeNull();
  });
  test("a page and a panel loaded with an empty name are found once they get one", () => {
    const survey = new SurveyModel({
      pages: [{ name: "", title: "Page title", elements: [{ type: "panel", name: "", elements: [{ type: "text", name: "q1" }] }] }]
    });
    const page = survey.pages[0];
    const panel = survey.getAllPanels()[0];
    expect(page.name).toBe("");
    expect(panel.name).toBe("");
    expect(id(survey.getPageByName(""))).toBeNull();
    expect(id(survey.getPanelByName(""))).toBeNull();
    expect(id(survey.getPageByName("page1")), "the name generated on adding is not kept").toBeNull();
    expect(id(survey.getPanelByName("panel1"))).toBeNull();
    page.name = "pX";
    panel.name = "panelX";
    expect(id(survey.getPageByName("pX"))).toBe(id(page));
    expect(id(survey.getElementByName("pX"))).toBe(id(page));
    expect(survey.runExpression("{$px.title}")).toBe("Page title");
    expect(id(survey.getPanelByName("panelX"))).toBe(id(panel));
    expect(id(survey.getPanelByName("PANELX", true))).toBe(id(panel));
    panel.name = "";
    panel.name = "panelY";
    expect(id(survey.getPanelByName("panelY")), "renamed through an empty name").toBe(id(panel));
  });
  test("a duplicate inserted at runtime before an existing one: the existing one stays first", () => {
    // The hash keeps insertion order for elements added at runtime; scanning gave document order (report-12).
    const survey = new SurveyModel(treeJson());
    const oldPage = survey.pages[0];
    const oldPanel = survey.getPanelByName("panel2");
    survey.addPage(new PageModel("page1"), 0);
    survey.pages[1].addElement(new PanelModel("panel2"), 0);
    expect(survey.pages[0].name).toBe("page1");
    expect(id(survey.getPageByName("page1"))).toBe(id(oldPage));
    expect(id(survey.getPanelByName("panel2"))).toBe(id(oldPanel));
  });
  test("renaming a question at runtime; questionRenamed still works for an outside caller", () => {
    const survey = new SurveyModel(treeJson());
    const q1 = survey.getQuestionByName("q1");
    q1.name = "newQ1";
    expect(id(survey.getQuestionByName("newQ1"))).toBe(id(q1));
    expect(id(survey.getQuestionByName("q1"))).toBeNull();
    expect(id(survey.getElementByName("newQ1"))).toBe(id(q1));
    // A caller that changes the name without the notification and then reports it
    (<any>q1).setPropertyValueDirectly("name", "q1Again");
    survey.questionRenamed(q1, "newQ1", "newQ1");
    expect(id(survey.getQuestionByName("q1Again"))).toBe(id(q1));
    expect(id(survey.getQuestionByName("newQ1"))).toBeNull();
  });
  test("a panel renamed inside a dynamic panel's template is not found", () => {
    const survey = new SurveyModel(treeJson());
    const dp = <QuestionPanelDynamicModel>survey.getQuestionByName("dp");
    const tpanel = <PanelModel>dp.template.getElementByName("tpanel");
    tpanel.name = "tpanel2";
    expect(id(survey.getPanelByName("tpanel2"))).toBeNull();
    expect(id(survey.getPanelByName("tpanel"))).toBeNull();
  });
  test("adding and removing a panel with a panel and a question inside", () => {
    const survey = new SurveyModel(treeJson());
    const outer = new PanelModel("outer");
    const inner = new PanelModel("inner");
    outer.addElement(inner);
    inner.addNewQuestion("text", "innerQ");
    survey.pages[0].addElement(outer);
    expect(id(survey.getPanelByName("outer"))).toBe(id(outer));
    expect(id(survey.getPanelByName("inner"))).toBe(id(inner));
    expect(survey.getQuestionByName("innerQ").name).toBe("innerQ");
    expect(id(survey.getPanelByName("INNER", true))).toBe(id(inner));

    survey.pages[0].removeElement(outer);
    expect(id(survey.getPanelByName("outer"))).toBeNull();
    expect(id(survey.getPanelByName("inner"))).toBeNull();
    expect(id(survey.getPanelByName("INNER", true))).toBeNull();
    expect(id(survey.getQuestionByName("innerQ"))).toBeNull();
    expect(id(survey.getElementByName("innerQ"))).toBeNull();
    expect(id(survey.getQuestionByValueName("innerQ"))).toBeNull();

    survey.pages[1].addElement(outer);
    expect(id(survey.getPanelByName("outer")), "added again").toBe(id(outer));
    expect(id(survey.getPanelByName("inner"))).toBe(id(inner));
    expect(survey.getQuestionByName("innerQ").name).toBe("innerQ");
  });
  test("panel.delete() removes the panel and everything inside", () => {
    const survey = new SurveyModel(treeJson());
    survey.getPanelByName("panel1").delete();
    expect(id(survey.getPanelByName("panel1"))).toBeNull();
    expect(id(survey.getPanelByName("panel2"))).toBeNull();
    expect(id(survey.getQuestionByName("q1"))).toBeNull();
    expect(id(survey.getQuestionByName("q2"))).toBeNull();
  });
  test("adding a panel at runtime by addNewPanel and a question into it", () => {
    const survey = new SurveyModel(treeJson());
    const panel = survey.pages[1].addNewPanel("newPanel");
    panel.addNewQuestion("text", "newQ");
    const sub = panel.addNewPanel("sub");
    expect(id(survey.getPanelByName("newPanel"))).toBe(id(panel));
    expect(id(survey.getPanelByName("sub"))).toBe(id(sub));
    expect(survey.getQuestionByName("newQ").name).toBe("newQ");
    expect(id(survey.getElementByName("sub"))).toBe(id(sub));
  });
  test("a panel added without a name gets one and is found by it", () => {
    const survey = new SurveyModel(treeJson());
    const panel = new PanelModel();
    survey.pages[0].addElement(panel);
    expect(panel.name).toBeTruthy();
    expect(id(survey.getPanelByName(panel.name))).toBe(id(panel));
  });
  test("removing a page removes its panels and questions", () => {
    const survey = new SurveyModel(treeJson());
    const page1 = survey.pages[0];
    survey.removePage(page1);
    expect(id(survey.getPageByName("page1"))).toBeNull();
    expect(id(survey.getElementByName("page1"))).toBeNull();
    expect(id(survey.getPanelByName("panel1"))).toBeNull();
    expect(id(survey.getPanelByName("panel2"))).toBeNull();
    expect(id(survey.getQuestionByName("q1"))).toBeNull();
    expect(id(survey.getQuestionByName("q2"))).toBeNull();
    expect(id(survey.getQuestionByValueName("q2")), "the value name goes too").toBeNull();
    expect(survey.getQuestionByName("q3").name, "another page's question stays").toBe("q3");

    survey.pages.push(page1);
    expect(id(survey.getPageByName("page1")), "added again").toBe(id(page1));
    expect(survey.getPanelByName("panel2")).toBeTruthy();
    expect(survey.getQuestionByName("q2").name).toBe("q2");
  });
  test("adding and deleting a page at runtime", () => {
    const survey = new SurveyModel(treeJson());
    const page = survey.addNewPage("page3");
    const panel = page.addNewPanel("panel3");
    panel.addNewQuestion("text", "q30");
    expect(id(survey.getPageByName("page3"))).toBe(id(page));
    expect(id(survey.getPanelByName("panel3"))).toBe(id(panel));
    expect(id(survey.getElementByName("page3"))).toBe(id(page));
    page.delete();
    expect(id(survey.getPageByName("page3"))).toBeNull();
    expect(id(survey.getPanelByName("panel3"))).toBeNull();
    expect(id(survey.getQuestionByName("q30"))).toBeNull();
  });
  test("a page added without a name gets one and is found by it", () => {
    const survey = new SurveyModel(treeJson());
    const page = new PageModel();
    survey.addPage(page);
    expect(page.name).toBe("page3");
    expect(id(survey.getPageByName("page3"))).toBe(id(page));
  });
  test("moving a panel from one page to another keeps it found", () => {
    const survey = new SurveyModel(treeJson());
    const panel1 = <PanelModel>survey.getPanelByName("panel1");
    const panel2 = survey.getPanelByName("panel2");
    panel1.moveTo(survey.pages[1]);
    expect(id(panel1.page)).toBe(id(survey.pages[1]));
    expect(id(survey.getPanelByName("panel1"))).toBe(id(panel1));
    expect(id(survey.getPanelByName("panel2"))).toBe(id(panel2));
    expect(survey.getQuestionByName("q2").name).toBe("q2");

    panel1.page = survey.pages[0];
    expect(id(panel1.page)).toBe(id(survey.pages[0]));
    expect(id(survey.getPanelByName("panel1"))).toBe(id(panel1));
    expect(id(survey.getPanelByName("panel2"))).toBe(id(panel2));
    expect(survey.getQuestionByName("q1").name).toBe("q1");

    panel2.moveTo(survey.pages[1]);
    expect(id(survey.getPanelByName("panel2"))).toBe(id(panel2));
  });
  test("a panel inside a dynamic panel's template or panels is not found", () => {
    const survey = new SurveyModel(treeJson());
    const dp = <QuestionPanelDynamicModel>survey.getQuestionByName("dp");
    expect(dp.panels.length).toBe(1);
    expect(id(survey.getPanelByName("tpanel"))).toBeNull();
    expect(id(survey.getPanelByName("tpanel", true))).toBeNull();
    expect(id(survey.getElementByName("tpanel"))).toBeNull();
    dp.template.addNewPanel("tpanel2");
    dp.addPanel();
    expect(id(survey.getPanelByName("tpanel2"))).toBeNull();
    expect(id(survey.getQuestionByName("tq"))).toBeNull();
  });
  test("loading a new JSON clears the old names", () => {
    const survey = new SurveyModel(treeJson());
    survey.fromJSON({ pages: [{ name: "pageA", elements: [{ type: "panel", name: "panelA", elements: [{ type: "text", name: "qA" }] }] }] });
    expect(id(survey.getPageByName("page1"))).toBeNull();
    expect(id(survey.getPanelByName("panel1"))).toBeNull();
    expect(id(survey.getQuestionByName("q1"))).toBeNull();
    expect(id(survey.getPageByName("pageA"))).toBe(id(survey.pages[0]));
    expect(survey.getPanelByName("panelA")).toBeTruthy();
    expect(survey.getQuestionByName("qA").name).toBe("qA");
  });
  test("loading a JSON without pages keeps the pages and their panels found", () => {
    const survey = new SurveyModel(treeJson());
    survey.fromJSON({ title: "new title" });
    expect(survey.pages.length).toBe(2);
    expect(id(survey.getPageByName("page1"))).toBe(id(survey.pages[0]));
    expect(id(survey.getPanelByName("panel2"))).toBe(id(survey.getAllPanels()[1]));
    expect(id(survey.getElementByName("panel1"))).toBe(id(survey.getAllPanels()[0]));
  });
  test("a nesting survey (dataNesting written after the pages) keeps every name", () => {
    const survey = new SurveyModel(Object.assign(treeJson(), { dataNesting: "panelAndPage" }));
    expect(id(survey.getPageByName("page1"))).toBe(id(survey.pages[0]));
    expect(survey.getPanelByName("panel2")).toBeTruthy();
    expect(survey.getQuestionByName("q2").name).toBe("q2");
    survey.dataNesting = "none";
    expect(survey.getPanelByName("panel2")).toBeTruthy();
    expect(id(survey.getPageByName("page2"))).toBe(id(survey.pages[1]));
    expect(survey.getQuestionByName("q2").name).toBe("q2");
  });
  test("getPanelByName does not call getAllPanels", () => {
    const survey = new SurveyModel(treeJson());
    const spy = vi.spyOn(survey, "getAllPanels");
    expect(survey.getPanelByName("panel2")).toBeTruthy();
    expect(survey.getPanelByName("PANEL2", true)).toBeTruthy();
    expect(survey.getElementByName("panel2")).toBeTruthy();
    expect(survey.runExpression("{$PANEL1.title}")).toBe("Panel 1 title");
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
  describe("questionsOnPageMode", () => {
    for (const mode of ["standard", "singlePage", "questionPerPage"]) {
      test("getPageByName / getPanelByName give today's results: " + mode, () => {
        const survey = new SurveyModel(treeJson());
        survey.questionsOnPageMode = mode;
        if (mode === "singlePage") {
          expect(survey.visiblePages.length).toBe(1);
          expect(survey.pages[0].isPage, "a page inside the single-page container is not a page").toBe(false);
        }
        expect(id(survey.getPageByName("page1"))).toBe(id(survey.pages[0]));
        expect(id(survey.getPageByName("page2"))).toBe(id(survey.pages[1]));
        expect(id(survey.getPanelByName("page1"))).toBeNull();
        expect(id(survey.getPanelByName("page1", true))).toBeNull();
        expect(id(survey.getElementByName("page1"))).toBe(id(survey.pages[0]));
        expect(id(survey.getPanelByName("panel1"))).toBe(id(survey.getAllPanels()[0]));
        expect(id(survey.getPanelByName("panel2"))).toBe(id(survey.getAllPanels()[1]));
        expect(id(survey.getElementByName("panel2"))).toBe(id(survey.getAllPanels()[1]));
        expect(id(survey.getPageByName("panel1"))).toBeNull();
        expect(id(survey.getPageByName("single-page")), "the single-page container").toBeNull();
        expect(id(survey.getPanelByName("single-page"))).toBeNull();
        expect(id(survey.getElementByName("single-page"))).toBeNull();
        expect(survey.getQuestionByName("q2").name).toBe("q2");
        expect(survey.runExpression("{$PAGE2.title}")).toBe("Page 2 title");

        const panel = survey.pages[1].addNewPanel("added");
        expect(id(survey.getPanelByName("added")), "a panel added in this mode").toBe(id(panel));
        survey.questionsOnPageMode = "standard";
        expect(id(survey.getPageByName("page1"))).toBe(id(survey.pages[0]));
        expect(id(survey.getPanelByName("page1"))).toBeNull();
        expect(id(survey.getPanelByName("added"))).toBe(id(panel));
        expect(id(survey.getPanelByName("panel2"))).toBe(id(survey.getAllPanels()[1]));
      });
    }
  });
  describe("a property path in an expression", () => {
    test("{$page.<prop>} and {$panel.<prop>} ignore letter case", () => {
      const survey = new SurveyModel(treeJson());
      expect(survey.runExpression("{$page2.title}")).toBe("Page 2 title");
      expect(survey.runExpression("{$PAGE2.title}")).toBe("Page 2 title");
      expect(survey.runExpression("{$panel1.title}")).toBe("Panel 1 title");
      expect(survey.runExpression("{$Panel1.title}")).toBe("Panel 1 title");
      expect(survey.runExpression("{$q1.name}")).toBe("q1");
    });
    test("a page before a panel under one name", () => {
      const survey = new SurveyModel({
        pages: [
          { name: "same", title: "page title", elements: [{ type: "panel", name: "Same", title: "panel title", elements: [{ type: "text", name: "q1" }] }] }
        ]
      });
      expect(survey.runExpression("{$same.title}")).toBe("page title");
      expect(survey.runExpression("{$SAME.title}")).toBe("page title");
    });
    test("a renamed panel and page", () => {
      const survey = new SurveyModel(treeJson());
      survey.getPanelByName("panel1").name = "Address";
      survey.getPageByName("page2").name = "Second";
      expect(survey.runExpression("{$address.title}")).toBe("Panel 1 title");
      expect(survey.runExpression("{$ADDRESS.title}")).toBe("Panel 1 title");
      expect(survey.runExpression("{$panel1.title}")).toBe(survey.runExpression("{$nothing.title}"));
      expect(survey.runExpression("{$second.title}")).toBe("Page 2 title");
      expect(survey.runExpression("{$page2.title}")).toBe(survey.runExpression("{$nothing.title}"));
    });
    test("a panel added at runtime", () => {
      const survey = new SurveyModel(treeJson());
      const panel = survey.pages[0].addNewPanel("runtimePanel");
      panel.title = "runtime";
      const q = survey.pages[0].addNewQuestion("expression", "exp");
      (<any>q).expression = "{$RuntimePanel.title}";
      expect(q.value).toBe("runtime");
    });
  });
});
