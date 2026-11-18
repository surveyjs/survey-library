import { SurveyModel } from "../src/survey";
import { QuestionMatrixModel } from "../src/question_matrix";
import { QuestionPanelDynamicModel } from "../src/question_paneldynamic";

import { describe, test, expect } from "vitest";
describe("SurveySnapshotTests", () => {
  test("getSnapshot/restoreSnapshot round-trip restores data, variables and uiState", () => {
    const plainConfig: any = {
      pages: [
        { name: "page1", elements: [{ type: "text", name: "q1", inputType: "number" }] },
        { name: "page2", elements: [{ type: "text", name: "q2", inputType: "number" }] },
        {
          name: "page3",
          elements: [
            { type: "text", name: "q3", visibleIf: "{q1} = 5" },
            { type: "text", name: "q4", state: "collapsed" },
            {
              type: "paneldynamic", name: "q5", panelCount: 3, displayMode: "tab",
              templateElements: [{ type: "text", name: "q6" }]
            }
          ]
        }
      ],
      calculatedValues: [{ name: "total", expression: "{q1} + {q2}", includeIntoResult: true }]
    };
    const survey = new SurveyModel(plainConfig);
    survey.setValue("q1", 5);
    survey.setValue("q2", 7);
    survey.setVariable("myVar", "hello");
    survey.currentPageNo = 2;
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("q5");
    panel.currentIndex = 1;
    survey.whenQuestionFocusIn(survey.getQuestionByName("q3"));

    const snapshot = survey.getSnapshot();
    expect(snapshot.data["q1"], "snapshot has q1").toBe(5);
    expect(snapshot.data["q2"], "snapshot has q2").toBe(7);
    expect(snapshot.data["total"], "snapshot has the calculated value").toBe(12);
    expect(snapshot.variables["myvar"], "snapshot has the variable").toBe("hello");
    expect(snapshot.uiState.currentPageName, "snapshot has the current page").toBe("page3");
    expect(snapshot.uiState.activeElementName, "snapshot has the last active question").toBe("q3");
    expect(survey.getQuestionByName("q3").visible, "q3 is visible while q1 = 5").toBe(true);

    const restored = new SurveyModel(plainConfig);
    restored.restoreSnapshot(snapshot);
    expect(restored.data, "restored data matches the snapshot").toEqual(snapshot.data);
    expect(restored.getVariable("myVar"), "restored variable matches the snapshot").toBe("hello");
    expect(restored.uiState, "restored uiState matches the snapshot").toEqual(snapshot.uiState);
    expect(restored.currentPageNo, "restored current page").toBe(2);
    expect(restored.getQuestionByName("q3").visible, "expressions ran on restore").toBe(true);
    expect((<QuestionPanelDynamicModel>restored.getQuestionByName("q5")).currentIndex, "restored dynamic panel tab").toBe(1);
    expect(restored.getQuestionByName("q4").isExpanded, "restored collapsed question stays collapsed").toBe(false);
    expect(restored.getVariable("total"), "calculated value is recalculated on restore").toBe(12);
    expect(restored.data["total"], "calculated value is in the restored data").toBe(12);
  });

  test("restoreSnapshot replaces data and variables", () => {
    const survey = new SurveyModel({
      elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }]
    });
    survey.setValue("q1", "old");
    survey.setValue("q2", "keep-me-out");
    survey.setVariable("oldVar", 1);
    survey.setVariable("sharedVar", "old");

    const other = new SurveyModel({
      elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }]
    });
    other.setValue("q1", "new");
    other.setVariable("sharedVar", "new");
    const snapshot = other.getSnapshot();

    survey.restoreSnapshot(snapshot);
    expect(survey.data, "snapshot data replaces the current data").toEqual({ q1: "new" });
    expect(survey.getVariable("oldVar"), "snapshot variables replace the current variables").toBeUndefined();
    expect(survey.getVariable("sharedVar"), "shared variable is replaced").toBe("new");
  });

  test("restoreSnapshot does not fire triggers or value/variable events", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2" }
      ],
      triggers: [
        { type: "setvaluetrigger", expression: "{myVar} = 'x'", setToName: "q2", setValue: "triggered" },
        { type: "completetrigger", expression: "{q1} = 'yes'" }
      ]
    });
    let valueChangedCount = 0;
    let variableChangedCount = 0;
    survey.onValueChanged.add(() => { valueChangedCount++; });
    survey.onVariableChanged.add(() => { variableChangedCount++; });

    const source = new SurveyModel({
      elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }]
    });
    source.setValue("q1", "yes");
    source.setVariable("myVar", "x");
    const snapshot = source.getSnapshot();

    survey.restoreSnapshot(snapshot);
    expect(survey.getValue("q2"), "the setvalue trigger did not run during restore").toBeUndefined();
    expect(survey.isCompleted, "the complete trigger did not complete the survey during restore").toBe(false);
    expect(valueChangedCount, "no onValueChanged during restore").toBe(0);
    expect(variableChangedCount, "no onVariableChanged during restore").toBe(0);

    survey.setValue("q1", "changed");
    expect(valueChangedCount, "events still work after restore").toBe(1);
  });

  test("restoreSnapshot applies randomSeed before the expressions run", () => {
    const config = {
      pages: [{
        name: "p1",
        elements: [{
          type: "matrix", name: "q1", columns: ["c1", "c2"],
          rows: ["r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8", "r9"],
          rowsOrder: "random"
        }]
      }]
    };
    const survey = new SurveyModel(config);
    survey.randomSeed = 12345;
    const order = (<QuestionMatrixModel>survey.getQuestionByName("q1")).visibleRows.map(r => r.name);
    expect(order, "rows order for seed 12345").toEqual(["r8", "r4", "r2", "r5", "r7", "r1", "r6", "r9", "r3"]);
    const snapshot = survey.getSnapshot();
    expect(snapshot.uiState.randomSeed, "snapshot has the seed").toBe(12345);

    const restored = new SurveyModel(config);
    restored.randomSeed = 999;
    restored.restoreSnapshot(snapshot);
    expect((<QuestionMatrixModel>restored.getQuestionByName("q1")).visibleRows.map(r => r.name),
      "restored rows order matches the snapshot seed").toEqual(order);
  });

  test("restoreSnapshot restores the start page state", () => {
    const config = {
      pages: [
        { name: "p1", elements: [{ type: "html", name: "info" }] },
        { name: "p2", elements: [{ type: "text", name: "q1" }] },
        { name: "p3", elements: [{ type: "text", name: "q2" }] }
      ],
      firstPageIsStartPage: true
    };
    const beforeStart = new SurveyModel(config);
    expect(beforeStart.isStartPageActive, "start page is active before start()").toBe(true);
    const snapshotBeforeStart = beforeStart.getSnapshot();
    expect(snapshotBeforeStart.uiState.isStartPageActive, "snapshot records the start page").toBe(true);

    const started = new SurveyModel(config);
    started.start();
    expect(started.isStartPageActive, "start page is gone after start()").toBe(false);
    started.restoreSnapshot(snapshotBeforeStart);
    expect(started.isStartPageActive, "restore returns to the start page").toBe(true);
    expect(started.activePage.name, "active page is the start page").toBe("p1");

    const afterStart = new SurveyModel(config);
    afterStart.start();
    const snapshotAfterStart = afterStart.getSnapshot();
    expect(snapshotAfterStart.uiState.isStartPageActive, "snapshot after start has no start page flag").toBeUndefined();
    const fresh = new SurveyModel(config);
    fresh.restoreSnapshot(snapshotAfterStart);
    expect(fresh.isStartPageActive, "restore of a started survey stays past the start page").toBe(false);
    expect(fresh.state, "restored survey is running").toBe("running");
  });

  test("restoreSnapshot restores the preview", () => {
    const config = {
      showPreviewBeforeComplete: true,
      pages: [
        { name: "p1", elements: [{ type: "text", name: "q1" }] },
        { name: "p2", elements: [{ type: "text", name: "q2" }] }
      ]
    };
    const survey = new SurveyModel(config);
    survey.setValue("q1", "a");
    survey.currentPageNo = 1;
    expect(survey.showPreview(), "preview shows").toBe(true);
    expect(survey.state, "survey is previewing").toBe("preview");
    const snapshot = survey.getSnapshot();
    expect(snapshot.uiState.isShowingPreview, "snapshot records the preview").toBe(true);
    // During preview currentPage is the synthetic preview container page, so no currentPageName
    // is recorded: cancelling the preview returns to the last page, which is where the
    // respondent entered the preview from.
    const restored = new SurveyModel(config);
    restored.restoreSnapshot(snapshot);
    expect(restored.state, "restored survey is previewing").toBe("preview");
    expect(restored.data["q1"], "restored data").toBe("a");
    restored.cancelPreview();
    expect(restored.currentPageNo, "after cancelling the preview, back on the last page").toBe(1);
    expect(restored.state, "survey is running again after cancelling the preview").toBe("running");
  });

  test("restoreSnapshot restores the current question in questionPerPage mode", () => {
    const config = {
      questionsOnPageMode: "questionPerPage",
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2" },
        { type: "text", name: "q3" }
      ]
    };
    const survey = new SurveyModel(config);
    survey.performNext();
    survey.performNext();
    expect(survey.currentSingleQuestion.name, "third question is current").toBe("q3");
    const snapshot = survey.getSnapshot();
    expect(snapshot.uiState.currentElementName, "snapshot records the current question").toBe("q3");

    const restored = new SurveyModel(config);
    restored.restoreSnapshot(snapshot);
    expect(restored.currentSingleQuestion.name, "restored current question").toBe("q3");
  });

  test("restoreSnapshot restores the current input in inputPerPage mode", () => {
    const config = {
      questionsOnPageMode: "inputPerPage",
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2" }
      ]
    };
    const survey = new SurveyModel(config);
    survey.performNext();
    expect(survey.currentSingleQuestion.name, "second input is current").toBe("q2");
    const snapshot = survey.getSnapshot();
    expect(snapshot.uiState.currentElementName, "snapshot records the current input").toBe("q2");

    const restored = new SurveyModel(config);
    restored.restoreSnapshot(snapshot);
    expect(restored.currentSingleQuestion.name, "restored current input").toBe("q2");
  });

  test("restoreSnapshot focuses the last active question only when asked", () => {
    const config = {
      pages: [
        { elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }] },
        { elements: [{ type: "text", name: "q3" }, { type: "text", name: "q4" }] },
        { elements: [{ type: "text", name: "q5" }, { type: "text", name: "q6" }] }
      ]
    };
    const survey = new SurveyModel(config);
    survey.whenQuestionFocusIn(survey.getQuestionByName("q5"));
    survey.currentPageNo = 1;
    const snapshot = survey.getSnapshot();
    expect(snapshot.uiState.activeElementName, "snapshot has the last active question").toBe("q5");
    expect(snapshot.uiState.currentPageName, "snapshot has the current page").toBe("page2");

    const restored = new SurveyModel(config);
    restored.restoreSnapshot(snapshot);
    expect(restored.currentPageNo, "default restore keeps the restored page").toBe(1);
    expect(restored.uiState.activeElementName, "default restore remembers the last active question").toBe("q5");

    const focused = new SurveyModel(config);
    focused.restoreSnapshot(snapshot, { focusLastActiveQuestion: true });
    expect(focused.currentPageNo, "focus restore moves to the last active question's page").toBe(2);
  });

  test("restoreSnapshot with a partial snapshot leaves the rest alone, and ignores bad input", () => {
    const survey = new SurveyModel({
      elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }]
    });
    survey.setValue("q1", "old");
    survey.setVariable("keepMe", 42);
    survey.currentPageNo = 0;

    survey.restoreSnapshot({ data: { q1: "new" } });
    expect(survey.data["q1"], "partial restore writes the data").toBe("new");
    expect(survey.getVariable("keepMe"), "partial restore leaves variables alone").toBe(42);

    survey.restoreSnapshot(undefined);
    survey.restoreSnapshot(null);
    survey.restoreSnapshot("not-an-object" as any);
    expect(survey.data["q1"], "bad input is ignored").toBe("new");
  });
});
