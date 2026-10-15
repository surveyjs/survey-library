# Screen-position progress Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** In `questionPerPage` and `inputPerPage`, the progress bar shows the current screen divided by the screens the survey already walks.

**Architecture:** `SurveyModel.getProgressPosition()` walks the same element list as Next and Previous. `questionPerPage` counts each visible top-level element as one screen. `inputPerPage` asks each question how many input screens it currently has, including answered inputs and a records summary. The linear bar component stays `sv-progress-questions`. `progressBarType` is ignored at runtime in these modes and hidden in the property grid. `standard` and `singlePage` are unchanged.

**Tech Stack:** TypeScript, Vitest, `survey-core` only. No UI package or SCSS changes.

## Global Constraints

- Percentage is `Math.floor(current * 100 / total)` with `current` starting at 1.
- New English string only: `questionPositionProgressText: "Question {0} of {1}"` in `packages/survey-core/src/localization/english.ts`. Do not edit other locale files.
- `getProgressTypeComponent()` stays `sv-progress-questions`. Root CSS modifier stays `sd-progress--questions`. `getEffectiveProgressBarType()` returns `"questions"` while screen-position progress is active. That return value selects the bar, not the answered-question formula.
- A stored `progressBarType` is not deleted and applies again in `standard`.
- Design mode keeps page progress. `singlePage` keeps its current hide rule, including the explicit `"questions"` exception.
- `questionPerPage` and `inputPerPage` show and hide the bar under the same conditions. `progressBarType` does not affect that visibility.
- Do not add `/** */` API doccomments.
- Spec: `docs/superpowers/specs/2026-10-14-question-per-page-progress-design.md`.

---

### Task 1: questionPerPage screen position

**Files:**
- Modify: `packages/survey-core/src/localization/english.ts` (next to `questionsProgressText`)
- Modify: `packages/survey-core/src/survey.ts` (`getEffectiveProgressBarType` near line 3156, `getProgress` near line 4378)
- Modify: `packages/survey-core/src/surveyProgressTextModel.ts` (`getProgressTextCore` near line 126)
- Test: `packages/survey-core/tests/surveytests.ts` (the Bug#11773 progress tests near line 876)

**Interfaces:**
- Consumes: `SurveyModel.getSingleElements()` (private, same class), `SurveyModel.isSingleVisibleQuestionVal()`, `SurveyModel.currentSingleElement`, `Base.getLocalizationFormatString(strName, ...args)`
- Produces:
  - `SurveyModel.isScreenPositionProgress(): boolean` — true for a running `questionPerPage` or legacy `questionOnPage` survey. Task 2 widens this to `inputPerPage`.
  - `SurveyModel.getProgressPosition(): { current: number; total: number }` — `current` is 1-based, or `0` when the current element is missing from the list. Task 2 adds the inner-input walk; until then this method counts top-level elements only and is called only for `questionPerPage`.

- [ ] **Step 1: Write the failing tests**

In `packages/survey-core/tests/surveytests.ts`, replace the Bug#11773 progress tests from `"progressText and getProgress use answered questions in questionPerPage mode"` through `"getRootCss and getProgressTypeComponent use the effective progress type"` with the tests below. Leave the `requiredQuestions` matrix test and everything after it unchanged.

```typescript
test("progressText and getProgress follow the screen in questionPerPage", () => {
  const survey = new SurveyModel({
    showProgressBar: true,
    questionsOnPageMode: "questionPerPage",
    elements: [
      { type: "text", name: "q1" },
      { type: "text", name: "q2" },
      { type: "text", name: "q3" }
    ]
  });
  expect(survey.progressBarType, "the property itself is not modified").toBe("pages");
  expect(survey.getEffectiveProgressBarType(), "effective type selects the linear bar").toBe("questions");
  expect(survey.getProgressPosition(), "screen 1 of 3").toEqual({ current: 1, total: 3 });
  expect(survey.progressText, "text #1").toBe("Question 1 of 3");
  expect(survey.getProgress(), "progress #1").toBe(33);
  survey.setValue("q1", "a");
  expect(survey.progressText, "answering does not move the screen").toBe("Question 1 of 3");
  expect(survey.getProgress(), "progress stays on the first screen").toBe(33);
  survey.performNext();
  expect(survey.getProgressPosition(), "screen 2 of 3").toEqual({ current: 2, total: 3 });
  expect(survey.progressText, "text #2").toBe("Question 2 of 3");
  expect(survey.getProgress(), "progress #2").toBe(66);
  survey.performNext();
  expect(survey.progressText, "text #3").toBe("Question 3 of 3");
  expect(survey.getProgress(), "progress #3").toBe(100);
});
test("progressText counts screens on all pages in questionPerPage", () => {
  const survey = new SurveyModel({
    showProgressBar: true,
    questionsOnPageMode: "questionPerPage",
    pages: [
      { elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }] },
      { elements: [{ type: "text", name: "q3" }, { type: "text", name: "q4" }] }
    ]
  });
  expect(survey.progressText, "#1").toBe("Question 1 of 4");
  expect(survey.getProgress(), "1 of 4").toBe(25);
  survey.performNext();
  survey.performNext();
  survey.performNext();
  expect(survey.progressText, "last screen").toBe("Question 4 of 4");
  expect(survey.getProgress(), "4 of 4").toBe(100);
});
test("progress follows the screen when an optional question is skipped", () => {
  const survey = new SurveyModel({
    showProgressBar: true,
    questionsOnPageMode: "questionPerPage",
    elements: [
      { type: "text", name: "q1" },
      { type: "text", name: "q2" },
      { type: "text", name: "q3" }
    ]
  });
  expect(survey.currentSingleQuestion.name, "the first question is current").toBe("q1");
  survey.performNext();
  expect(survey.currentSingleQuestion.name, "moved to the second question").toBe("q2");
  expect(survey.progressText, "position moved").toBe("Question 2 of 3");
  expect(survey.getProgress(), "progress moved").toBe(66);
});
test("a panel is one screen and a hidden element is outside the total", () => {
  const survey = new SurveyModel({
    showProgressBar: true,
    questionsOnPageMode: "questionPerPage",
    elements: [
      { type: "text", name: "q1" },
      { type: "panel", name: "p1", elements: [{ type: "text", name: "q2" }, { type: "text", name: "q3" }] },
      { type: "html", name: "info", html: "<span>info</span>" },
      { type: "text", name: "q4", visibleIf: "{q1} = 'show'" }
    ]
  });
  expect(survey.getProgressPosition(), "hidden q4 is excluded").toEqual({ current: 1, total: 3 });
  survey.performNext();
  expect(survey.currentSingleElement.name, "the panel is the second screen").toBe("p1");
  expect(survey.progressText, "panel screen").toBe("Question 2 of 3");
  survey.setValue("q1", "show");
  expect(survey.getProgressPosition(), "q4 joined the list").toEqual({ current: 2, total: 4 });
});
test("one screen fills the bar, and an empty survey has no progress text", () => {
  const one = new SurveyModel({
    showProgressBar: true,
    questionsOnPageMode: "questionPerPage",
    elements: [{ type: "text", name: "q1" }]
  });
  expect(one.progressText).toBe("Question 1 of 1");
  expect(one.getProgress()).toBe(100);
  const empty = new SurveyModel({ showProgressBar: true, questionsOnPageMode: "questionPerPage" });
  expect(empty.getProgress()).toBe(0);
  expect(empty.progressText).toBe("");
});
test("the start page is not a screen", () => {
  const survey = new SurveyModel({
    showProgressBar: true,
    questionsOnPageMode: "questionPerPage",
    firstPageIsStartPage: true,
    pages: [
      { elements: [{ type: "html", name: "intro", html: "start" }] },
      { elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }] }
    ]
  });
  survey.start();
  expect(survey.getProgressPosition()).toEqual({ current: 1, total: 2 });
  expect(survey.progressText).toBe("Question 1 of 2");
});
test("questionOnPage uses the same screen position", () => {
  const survey = new SurveyModel({
    showProgressBar: true,
    questionsOnPageMode: "questionOnPage",
    elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }]
  });
  expect(survey.progressText).toBe("Question 1 of 2");
  expect(survey.getProgress()).toBe(50);
});
test("inputPerPage mode keeps the page progress type, the bar itself is hidden, Bug#11773", () => {
  const survey = new SurveyModel({
    showProgressBar: true,
    questionsOnPageMode: "inputPerPage",
    pages: [
      { elements: [{ type: "text", name: "q1" }] },
      { elements: [{ type: "text", name: "q2" }] }
    ]
  });
  expect(survey.getEffectiveProgressBarType(), "effective type").toBe("pages");
  expect(survey.progressText, "text").toBe("Page 1 of 2");
});
test("An explicit questions progress type still works in inputPerPage mode, Bug#11773", () => {
  const survey = new SurveyModel({
    showProgressBar: true,
    progressBarType: "questions",
    questionsOnPageMode: "inputPerPage",
    elements: [
      { type: "text", name: "q1" },
      {
        type: "matrixdynamic", name: "matrix", rowCount: 1,
        columns: [{ cellType: "text", name: "col1" }, { cellType: "text", name: "col2" }]
      }
    ]
  });
  expect(survey.progressText, "#1").toBe("Answered 0/3 questions");
  survey.setValue("q1", "a");
  expect(survey.progressText, "#2").toBe("Answered 1/3 questions");
  expect(survey.getProgressInfo().questionCount, "#3").toBe(3);
  (<QuestionMatrixDynamicModel>survey.getQuestionByName("matrix")).addRow();
  expect(survey.getProgressInfo().questionCount, "the new row cells are counted").toBe(5);
  survey.updateProgressText();
  expect(survey.progressText, "#4").toBe("Answered 1/5 questions");
});
test("explicit progressBarType is ignored in questionPerPage and kept in the JSON", () => {
  const json = {
    showProgressBar: true,
    progressBarType: "requiredQuestions",
    elements: [
      { type: "text", name: "q1", isRequired: true },
      { type: "text", name: "q2" },
      { type: "text", name: "q3", isRequired: true }
    ]
  };
  const survey = new SurveyModel({ ...json, questionsOnPageMode: "questionPerPage" });
  expect(survey.progressBarType, "stored value").toBe("requiredQuestions");
  expect(survey.getEffectiveProgressBarType(), "questionPerPage, effective type").toBe("questions");
  expect(survey.progressText, "questionPerPage, text").toBe("Question 1 of 3");
  expect(survey.getProgress(), "questionPerPage, progress").toBe(33);
  expect(survey.getProgressTypeComponent(), "questionPerPage, component").toBe("sv-progress-questions");
  expect(survey.toJSON().progressBarType, "JSON keeps the stored type").toBe("requiredQuestions");

  const survey2 = new SurveyModel({ ...json, questionsOnPageMode: "inputPerPage" });
  expect(survey2.getEffectiveProgressBarType(), "inputPerPage, effective type").toBe("requiredQuestions");
  expect(survey2.progressText, "inputPerPage, text").toBe("Answered 0/2 questions");

  const survey3 = new SurveyModel({ ...json, progressBarType: "questions", questionsOnPageMode: "questionPerPage" });
  expect(survey3.progressText, "questions type is ignored").toBe("Question 1 of 3");
  survey3.questionsOnPageMode = "standard";
  expect(survey3.progressText, "standard uses the stored questions type").toBe("Answered 0/3 questions");
});
test("answering recalculates questionPerPage progress without moving the screen", () => {
  const survey = new SurveyModel({
    showProgressBar: true,
    questionsOnPageMode: "questionPerPage",
    elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }]
  });
  expect(survey.progressText, "#1").toBe("Question 1 of 2");
  survey.getQuestionByName("q1").value = "a";
  expect(survey.progressText, "#2").toBe("Question 1 of 2");
});
test("progressText follows a runtime questionsOnPageMode change", () => {
  const survey = new SurveyModel({
    showProgressBar: true,
    pages: [
      { elements: [{ type: "text", name: "q1" }] },
      { elements: [{ type: "text", name: "q2" }] }
    ]
  });
  expect(survey.progressText, "standard").toBe("Page 1 of 2");
  survey.questionsOnPageMode = "questionPerPage";
  expect(survey.progressText, "questionPerPage").toBe("Question 1 of 2");
  survey.questionsOnPageMode = "standard";
  expect(survey.progressText, "back to standard").toBe("Page 1 of 2");
});
test("onGetProgressText can replace the position text and still receives question counts", () => {
  const survey = new SurveyModel({
    showProgressBar: true,
    questionsOnPageMode: "questionPerPage",
    elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }]
  });
  let counts: any = undefined;
  survey.onGetProgressText.add((sender, options) => {
    counts = { questionCount: options.questionCount, answeredQuestionCount: options.answeredQuestionCount, text: options.text };
    options.text = "custom text";
  });
  survey.updateProgressText();
  expect(survey.progressText, "the event overrides the text").toBe("custom text");
  expect(counts.questionCount, "question count").toBe(2);
  expect(counts.answeredQuestionCount, "answered count").toBe(0);
  expect(counts.text, "default text is the position").toBe("Question 1 of 2");
});
test("design mode keeps the page progress in questionPerPage mode", () => {
  const survey = new SurveyModel({
    showProgressBar: true,
    questionsOnPageMode: "questionPerPage",
    pages: [
      { elements: [{ type: "text", name: "q1" }] },
      { elements: [{ type: "text", name: "q2" }] }
    ]
  });
  survey.setDesignMode(true);
  expect(survey.isScreenPositionProgress(), "design mode is not screen progress").toBe(false);
  expect(survey.getEffectiveProgressBarType(), "effective type").toBe("pages");
  expect(survey.progressText, "text").toBe("Page 1 of 2");
});
test("getRootCss and getProgressTypeComponent use the linear bar in questionPerPage", () => {
  const survey = new SurveyModel({
    showProgressBar: true,
    questionsOnPageMode: "questionPerPage",
    elements: [{ type: "text", name: "q1" }]
  });
  expect(survey.getProgressTypeComponent(), "component").toBe("sv-progress-questions");
  expect(survey.getRootCss().indexOf("sd-progress--questions") > -1, "root css modifier").toBe(true);
  expect(survey.getRootCss().indexOf("sd-progress--pages") > -1, "no pages modifier").toBe(false);
});
```

`QuestionMatrixDynamicModel` is already imported in this test file. Do not add a new import.

- [ ] **Step 2: Run the new questionPerPage test to verify it fails**

Run from `packages/survey-core`:

```bash
npx vitest run tests/surveytests.ts -t "progressText and getProgress follow the screen in questionPerPage"
```

Expected: FAIL. `progressText` is `"Answered 0/3 questions"`, not `"Question 1 of 3"`.

- [ ] **Step 3: Implement questionPerPage position**

In `packages/survey-core/src/localization/english.ts`, add the key directly after `questionsProgressText`:

```typescript
  questionsProgressText: "Answered {0}/{1} questions",
  questionPositionProgressText: "Question {0} of {1}",
```

Replace the comment and body of `getEffectiveProgressBarType` in `packages/survey-core/src/survey.ts`:

```typescript
  // questionPerPage walks one element per screen, so the linear bar shows that position.
  // inputPerPage is still excluded here; Task 2 of the screen-position plan widens this.
  // The returned "questions" value selects sv-progress-questions. It does not select
  // the answered-question formula. The stored progressBarType is left unchanged.
  public isScreenPositionProgress(): boolean {
    return !this.isDesignMode && this.isSingleVisibleQuestionVal(this.questionsOnPageMode);
  }
  public getProgressPosition(): { current: number; total: number } {
    const elements = this.getSingleElements();
    const index = elements.indexOf(this.currentSingleElement);
    if (index < 0) return { current: 0, total: elements.length };
    return { current: index + 1, total: elements.length };
  }
  public getEffectiveProgressBarType(): string {
    if (this.isScreenPositionProgress()) return "questions";
    return this.progressBarType;
  }
```

At the start of `getProgress()`, after the `currentPage == null` return, add:

```typescript
    if (this.isScreenPositionProgress()) {
      const position = this.getProgressPosition();
      if (position.current < 1 || position.total < 1) return 0;
      return Math.floor((position.current * 100) / position.total);
    }
```

In `surveyProgressTextModel.ts`, at the start of `getProgressTextCore`, before the `"questions"` branch:

```typescript
    if (this.survey.isScreenPositionProgress()) {
      const position = this.survey.getProgressPosition();
      if (position.current < 1 || position.total < 1) return "";
      return (this.survey as any).getLocalizationFormatString("questionPositionProgressText", position.current, position.total);
    }
```

`getEffectiveProgressBarType()` is `"questions"` in this mode, so `updateProgressText(true)` already recalculates on value changes. Do not add an early return for screen-position progress.

- [ ] **Step 4: Run the questionPerPage progress tests**

Run from `packages/survey-core`:

```bash
npx vitest run tests/surveytests.ts -t "progressText and getProgress follow the screen in questionPerPage"
npx vitest run tests/surveytests.ts -t "progressText counts screens on all pages"
npx vitest run tests/surveytests.ts -t "progress follows the screen when an optional question is skipped"
npx vitest run tests/surveytests.ts -t "a panel is one screen"
npx vitest run tests/surveytests.ts -t "one screen fills the bar"
npx vitest run tests/surveytests.ts -t "the start page is not a screen"
npx vitest run tests/surveytests.ts -t "questionOnPage uses the same screen position"
npx vitest run tests/surveytests.ts -t "explicit progressBarType is ignored in questionPerPage"
npx vitest run tests/surveytests.ts -t "answering recalculates questionPerPage progress"
npx vitest run tests/surveytests.ts -t "progressText follows a runtime questionsOnPageMode change"
npx vitest run tests/surveytests.ts -t "onGetProgressText can replace the position text"
npx vitest run tests/surveytests.ts -t "design mode keeps the page progress"
npx vitest run tests/surveytests.ts -t "getRootCss and getProgressTypeComponent use the linear bar"
npx vitest run tests/surveytests.ts -t "inputPerPage mode keeps the page progress type"
```

Expected: PASS. The last command still expects the old `inputPerPage` behavior.

- [ ] **Step 5: Commit**

```bash
git add packages/survey-core/src/localization/english.ts packages/survey-core/src/survey.ts packages/survey-core/src/surveyProgressTextModel.ts packages/survey-core/tests/surveytests.ts
git commit -m "feat(core): show the current screen in questionPerPage progress"
```

---

### Task 2: inputPerPage screens and the same visibility

**Files:**
- Modify: `packages/survey-core/src/question_singleinput_behavior.ts` (`QuestionSingleInputBehavior`)
- Modify: `packages/survey-core/src/question.ts` (next to `getSingleInputElementPos`)
- Modify: `packages/survey-core/src/question_records.ts` (`QuestionRecordsSingleInputBehavior`)
- Modify: `packages/survey-core/src/survey.ts` (`isScreenPositionProgress`, `getProgressPosition`, `getEffectiveProgressBarType`)
- Modify: `packages/survey-core/src/surveyProgressTextModel.ts` (`isProgressBarInContainer`)
- Test: `packages/survey-core/tests/surveytests.ts`
- Test: `packages/survey-core/tests/layoutElementModelTests.ts`
- Test: `packages/survey-core/tests/surveyProgressButtonsTest.ts`

**Interfaces:**
- Consumes: `SurveyModel.isScreenPositionProgress()`, `SurveyModel.getProgressPosition()`, `SurveyModel.getSingleElements()`, `QuestionSingleInputBehavior.getSingleInputQuestions()`, `QuestionRecordsSingleInputBehavior.getRecords()`
- Produces:
  - `QuestionSingleInputBehavior.getProgressScreenCount(): number`
  - `QuestionSingleInputBehavior.getProgressScreenIndex(): number` — 0-based index inside that question
  - `Question.getProgressScreenCount(): number`
  - `Question.getProgressScreenIndex(): number`
  - `SurveyModel.isScreenPositionProgress()` is true for running `questionPerPage`, `questionOnPage`, and `inputPerPage`
  - `SurveyModel.getProgressPosition()` counts inner input screens when `isSingleVisibleInput` is true

- [ ] **Step 1: Write the failing tests**

Replace the two `inputPerPage` Bug#11773 tests kept in Task 1 (`"inputPerPage mode keeps the page progress type"` and `"An explicit questions progress type still works in inputPerPage mode"`) and the `inputPerPage` half of `"explicit progressBarType is ignored in questionPerPage and kept in the JSON"`.

Replace the `survey2` expects in that third test with:

```typescript
  const survey2 = new SurveyModel({ ...json, questionsOnPageMode: "inputPerPage" });
  expect(survey2.progressBarType, "inputPerPage stored value").toBe("requiredQuestions");
  expect(survey2.getEffectiveProgressBarType(), "inputPerPage, effective type").toBe("questions");
  expect(survey2.progressText, "inputPerPage, text").toBe("Question 1 of 3");
  expect(survey2.getProgress(), "inputPerPage, progress").toBe(33);
  survey2.questionsOnPageMode = "standard";
  expect(survey2.progressText, "standard uses the stored required type").toBe("Answered 0/2 questions");
```

Add these tests in `surveytests.ts` next to them:

```typescript
test("inputPerPage progress follows each input, including answered ones and the summary", () => {
  const survey = new SurveyModel({
    showProgressBar: true,
    questionsOnPageMode: "inputPerPage",
    elements: [
      {
        type: "paneldynamic", name: "panel1", panelCount: 1,
        templateElements: [
          { type: "text", name: "q1" },
          { type: "text", name: "q2" }
        ]
      },
      { type: "text", name: "q3" }
    ]
  });
  const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel1");
  expect(survey.getProgressPosition(), "q1, q2, summary, q3").toEqual({ current: 1, total: 4 });
  expect(survey.progressText).toBe("Question 1 of 4");
  expect(survey.getProgress()).toBe(25);
  panel.singleInputQuestion.value = "a";
  expect(survey.getProgressPosition(), "an answered input stays in the total").toEqual({ current: 1, total: 4 });
  survey.performNext();
  expect(panel.singleInputQuestion.name, "second input").toBe("q2");
  expect(survey.progressText).toBe("Question 2 of 4");
  expect(survey.getProgress()).toBe(50);
  survey.performNext();
  expect(panel.singleInputQuestion.name, "summary").toBe("panel1");
  expect(survey.progressText).toBe("Question 3 of 4");
  survey.performNext();
  expect(survey.currentSingleQuestion.name, "question after the panel").toBe("q3");
  expect(survey.progressText).toBe("Question 4 of 4");
  expect(survey.getProgress()).toBe(100);
});
test("inputPerPage adds a screen when a matrix row is added", () => {
  const survey = new SurveyModel({
    showProgressBar: true,
    questionsOnPageMode: "inputPerPage",
    elements: [
      { type: "text", name: "q1" },
      {
        type: "matrixdynamic", name: "matrix", rowCount: 1,
        columns: [{ cellType: "text", name: "col1" }]
      }
    ]
  });
  expect(survey.getProgressPosition(), "q1, one cell, summary").toEqual({ current: 1, total: 3 });
  (<QuestionMatrixDynamicModel>survey.getQuestionByName("matrix")).addRow();
  survey.updateProgressText();
  expect(survey.getProgressPosition(), "the new cell is a screen").toEqual({ current: 1, total: 4 });
});
test("a static matrix row is one inputPerPage screen and a plain question is one screen", () => {
  const survey = new SurveyModel({
    showProgressBar: true,
    questionsOnPageMode: "inputPerPage",
    elements: [
      { type: "text", name: "q1" },
      { type: "matrix", name: "m1", columns: ["a", "b"], rows: ["r1", "r2"] }
    ]
  });
  expect(survey.getProgressPosition(), "text plus two rows").toEqual({ current: 1, total: 3 });
  survey.performNext();
  expect(survey.progressText).toBe("Question 2 of 3");
});
test("inputPerPage counts questions inside a static panel separately", () => {
  const survey = new SurveyModel({
    showProgressBar: true,
    questionsOnPageMode: "inputPerPage",
    elements: [
      { type: "panel", name: "p1", elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }] },
      { type: "text", name: "q3" }
    ]
  });
  expect(survey.currentSingleQuestion.name).toBe("q1");
  expect(survey.getProgressPosition()).toEqual({ current: 1, total: 3 });
});
test("inputPerPage counts each Multiple Text item and a nested choice question", () => {
  const multipleText = new SurveyModel({
    showProgressBar: true,
    questionsOnPageMode: "inputPerPage",
    elements: [
      { type: "multipletext", name: "mt", items: [{ name: "a" }, { name: "b" }] },
      { type: "text", name: "q1" }
    ]
  });
  expect(multipleText.getProgressPosition(), "two items plus q1").toEqual({ current: 1, total: 3 });
  const choice = new SurveyModel({
    showProgressBar: true,
    questionsOnPageMode: "inputPerPage",
    elements: [
      { type: "radiogroup", name: "q1", choices: ["item1", { value: "item2", elements: [{ type: "text", name: "nested1" }] }] },
      { type: "text", name: "q2" }
    ]
  });
  expect(choice.getProgressPosition(), "nested question is hidden until selected").toEqual({ current: 1, total: 2 });
  choice.setValue("q1", "item2");
  choice.updateProgressText();
  expect(choice.getProgressPosition(), "q1, nested1, q2").toEqual({ current: 1, total: 3 });
});
```

Add the `QuestionPanelDynamicModel` import next to the existing `QuestionMatrixDynamicModel` import in `surveytests.ts` if it is not already imported.

In `packages/survey-core/tests/layoutElementModelTests.ts`, change the `questionPerPage` test's `inputPerPage` expects:

```typescript
      survey.questionsOnPageMode = "inputPerPage";
      expect(questionsElement.isInContainer("center"), "inputPerPage shows the same bar").toBe(true);
      expect(buttonsElement.isInContainer("center"), "inputPerPage hides the page buttons").toBe(false);
```

Replace the body of `"SurveyProgressTextModel: inputPerPage hides the progress bar like singlePage does, Bug#11773"` so the survey JSON and the expects are:

```typescript
  test("SurveyProgressTextModel: inputPerPage shows the same bar as questionPerPage", () => {
    const oldLegacyProgressBarView = settings.legacyProgressBarView;
    const oldCssType = surveyCss.currentType;
    settings.legacyProgressBarView = false;
    surveyCss.currentType = "default";

    try {
      const survey = new SurveyModel({
        headerView: "basic",
        showProgressBar: true,
        progressBarLocation: "topBottom",
        questionsOnPageMode: "inputPerPage",
        pages: [
          { elements: [{ type: "text", name: "q1" }] },
          { elements: [{ type: "text", name: "q2" }] }
        ]
      });

      const elements = survey.progressTextModel.createLayoutElements();
      const buttonsElement = elements.find(el => el.id === "progress-buttons");
      const questionsElement = elements.find(el => el.id === "progress-questions");
      const pagesElement = elements.find(el => el.id === "progress-pages");

      expect(questionsElement.isInContainer("center"), "bar on top").toBe(true);
      expect(questionsElement.isInContainer("footer"), "bar at the bottom").toBe(true);
      expect(buttonsElement.isInContainer("center"), "no page buttons").toBe(false);
      expect(pagesElement.isInContainer("center"), "no pages bar").toBe(false);

      survey.progressBarType = "requiredQuestions";
      expect(questionsElement.isInContainer("center"), "stored type does not hide the bar").toBe(true);

      survey.questionsOnPageMode = "questionPerPage";
      expect(questionsElement.isInContainer("center"), "questionPerPage shows the same bar").toBe(true);
      expect(buttonsElement.isInContainer("center"), "questionPerPage hides page buttons").toBe(false);
    } finally {
      settings.legacyProgressBarView = oldLegacyProgressBarView;
      surveyCss.currentType = oldCssType;
    }
  });
```

Leave `"SurveyProgressTextModel: singlePage suppression rule is unchanged, Bug#11773"` as it is.

In `packages/survey-core/tests/surveyProgressButtonsTest.ts`, replace the `inputPerPage` lines of `"The page buttons view is not used in the questionPerPage mode, Bug#11773"`:

```typescript
    survey.questionsOnPageMode = "inputPerPage";
    expect(survey.getProgressTypeComponent(), "inputPerPage").toBe("sv-progress-questions");
```

- [ ] **Step 2: Run the inputPerPage progress test to verify it fails**

Run from `packages/survey-core`:

```bash
npx vitest run tests/surveytests.ts -t "inputPerPage progress follows each input"
```

Expected: FAIL. `progressText` is `"Page 1 of 2"` or an answered-question string, not `"Question 1 of 4"`.

- [ ] **Step 3: Count input screens and show the bar**

In `QuestionSingleInputBehavior` (`question_singleinput_behavior.ts`), add:

```typescript
  public getProgressScreenCount(): number {
    return Math.max(1, this.getProgressScreens().length);
  }
  public getProgressScreenIndex(): number {
    const screens = this.getProgressScreens();
    if (screens.length < 2) return 0;
    const current = this.singleInputQuestion;
    if (!current) return 0;
    const index = screens.indexOf(current);
    return index < 0 ? 0 : index;
  }
  protected getProgressScreens(): Array<Question> {
    if (!this.supportNestedSingleInput()) return [];
    return this.getSingleInputQuestions();
  }
```

`getSingleInputQuestions()` is the navigation list for a static matrix, Multiple Text, and a choice with nested questions. An empty list means the question is one screen. Do not use this default for records questions.

In `question.ts`, next to `getSingleInputElementPos`:

```typescript
  public getProgressScreenCount(): number {
    return this.singleInputBehavior.getProgressScreenCount();
  }
  public getProgressScreenIndex(): number {
    return this.singleInputBehavior.getProgressScreenIndex();
  }
```

In `QuestionRecordsSingleInputBehavior` (`question_records.ts`), override the screen list. This includes every visible question of every record, plus the summary screen. It must not call `getDynamicSingleInputQuestions`, because that list drops completed records.

```typescript
  protected getProgressScreens(): Array<Question> {
    const res = new Array<Question>();
    this.getRecords().forEach(record => {
      record.visibleQuestions.forEach(q => res.push(q));
    });
    res.push(this.question);
    return res;
  }
```

`Question` is already imported in `question_records.ts`. If the compiler cannot see `getProgressScreens` as overridable, change the base method from `protected` only if the records class is outside the subclass relationship. It is a subclass, so `protected` is enough.

In `survey.ts`, replace `isScreenPositionProgress` and `getProgressPosition`:

```typescript
  public isScreenPositionProgress(): boolean {
    return this.isSingleVisibleQuestion;
  }
  public getProgressPosition(): { current: number; total: number } {
    const elements = this.getSingleElements();
    if (!this.isSingleVisibleInput) {
      const index = elements.indexOf(this.currentSingleElement);
      if (index < 0) return { current: 0, total: elements.length };
      return { current: index + 1, total: elements.length };
    }
    let total = 0;
    let current = 0;
    let found = false;
    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      const question = el.isQuestion ? <Question>el : undefined;
      const count = question ? question.getProgressScreenCount() : 1;
      if (!found && el === this.currentSingleElement) {
        const inner = question ? question.getProgressScreenIndex() : 0;
        current = total + inner + 1;
        found = true;
      }
      total += count;
    }
    if (!found) return { current: 0, total: total };
    return { current: current, total: total };
  }
```

`getEffectiveProgressBarType` already returns `"questions"` when `isScreenPositionProgress()` is true. No further change there. Delete the Task 2 sentence from the comment above that method, and state that both modes use screen position.

In `surveyProgressTextModel.ts`, replace the meaningless-progress check:

```typescript
    // singlePage has no screen sequence. questionPerPage and inputPerPage share the
    // screen-position bar, so inputPerPage is not hidden here.
    const isProgressMeaningless = this.survey.questionsOnPageMode == "singlePage";
    if (isProgressMeaningless && this.survey.progressBarType != "questions") return false;
```

- [ ] **Step 4: Run the inputPerPage and visibility tests**

Run from `packages/survey-core`:

```bash
npx vitest run tests/surveytests.ts -t "inputPerPage progress follows each input"
npx vitest run tests/surveytests.ts -t "inputPerPage adds a screen when a matrix row is added"
npx vitest run tests/surveytests.ts -t "a static matrix row is one inputPerPage screen"
npx vitest run tests/surveytests.ts -t "inputPerPage counts questions inside a static panel"
npx vitest run tests/surveytests.ts -t "inputPerPage counts each Multiple Text item"
npx vitest run tests/surveytests.ts -t "explicit progressBarType is ignored in questionPerPage"
npx vitest run tests/layoutElementModelTests.ts -t "SurveyProgressTextModel"
npx vitest run tests/surveyProgressButtonsTest.ts -t "The page buttons view is not used"
npx vitest run tests/surveytests.ts -t "progressText and getProgress follow the screen in questionPerPage"
```

Expected: PASS. The `singlePage` layout test still hides the bar unless `progressBarType` is `"questions"`.

- [ ] **Step 5: Commit**

```bash
git add packages/survey-core/src/question_singleinput_behavior.ts packages/survey-core/src/question.ts packages/survey-core/src/question_records.ts packages/survey-core/src/survey.ts packages/survey-core/src/surveyProgressTextModel.ts packages/survey-core/tests/surveytests.ts packages/survey-core/tests/layoutElementModelTests.ts packages/survey-core/tests/surveyProgressButtonsTest.ts
git commit -m "feat(core): show screen-position progress in inputPerPage"
```

---

### Task 3: Hide progress type settings in the property grid

**Files:**
- Modify: `packages/survey-core/src/survey.ts` (serializer block near line 9383, and `isStrCiEqual` near line 9231)
- Test: `packages/survey-core/tests/surveytests.ts` (next to the belowheader progress test near line 22025)

**Interfaces:**
- Consumes: `questionsOnPageMode`, `showProgressBar`, `progressBarType`, `headerView`
- Produces: `isScreenPositionProgressMode(obj: any): boolean` — true when `questionsOnPageMode` is `"questionPerPage"`, `"inputPerPage"`, or `"questionOnPage"`

- [ ] **Step 1: Write the failing test**

Add this test in `surveytests.ts` immediately after `"belowheader is hidden for question progress in an advanced header"`:

```typescript
test("screen-position modes hide progress type and page-button settings", () => {
  const showProgressBar = Serializer.findProperty("survey", "showProgressBar");
  expect(showProgressBar.visibleIf, "showProgressBar is not given a screen-mode hide rule").toBeFalsy();
  const type = Serializer.findProperty("survey", "progressBarType");
  const navigationText = Serializer.findProperty("survey", "progressBarShowNavigationText");
  const pageNumbers = Serializer.findProperty("survey", "progressBarShowPageNumbers");
  const textLocation = Serializer.findProperty("survey", "progressBarNavigationTextLocation");
  const inheritWidth = Serializer.findProperty("survey", "progressBarInheritWidthFrom");
  const location = Serializer.findProperty("survey", "progressBarLocation");
  const survey = new SurveyModel({
    showProgressBar: true,
    progressBarType: "pages",
    progressBarShowNavigationText: true,
    headerView: "advanced",
    questionsOnPageMode: "questionPerPage"
  });
  expect(type.visibleIf(survey), "type hidden").toBe(false);
  expect(navigationText.visibleIf(survey), "navigation text hidden").toBe(false);
  expect(pageNumbers.visibleIf(survey), "page numbers hidden").toBe(false);
  expect(textLocation.visibleIf(survey), "text location hidden").toBe(false);
  expect(inheritWidth.visibleIf(survey), "inherit width hidden").toBe(false);
  expect(location.visibleIf(survey), "location stays").toBe(true);
  expect(location.getChoices(survey), "advanced header omits belowheader").toEqual(["auto", "aboveheader", "bottom", "topbottom"]);
  expect(survey.progressBarType, "stored type remains").toBe("pages");

  survey.questionsOnPageMode = "inputPerPage";
  expect(type.visibleIf(survey), "inputPerPage hides the type").toBe(false);
  expect(location.getChoices(survey), "inputPerPage omits belowheader").toEqual(["auto", "aboveheader", "bottom", "topbottom"]);

  survey.questionsOnPageMode = "questionOnPage";
  expect(type.visibleIf(survey), "legacy mode hides the type").toBe(false);

  survey.questionsOnPageMode = "standard";
  expect(type.visibleIf(survey), "standard shows the type").toBe(true);
  expect(navigationText.visibleIf(survey), "standard shows navigation text for pages").toBe(true);
  expect(location.getChoices(survey), "standard pages keep belowheader").toEqual(["auto", "aboveheader", "belowheader", "bottom", "topbottom"]);

  survey.headerView = "basic";
  survey.questionsOnPageMode = "questionPerPage";
  expect(location.getChoices(survey), "basic header keeps belowheader").toEqual(["auto", "aboveheader", "belowheader", "bottom", "topbottom"]);
});
```

`Serializer` is already imported in `surveytests.ts`.

- [ ] **Step 2: Run the property-grid test to verify it fails**

Run from `packages/survey-core`:

```bash
npx vitest run tests/surveytests.ts -t "screen-position modes hide progress type"
```

Expected: FAIL. `progressBarType.visibleIf` returns true for `questionPerPage`.

- [ ] **Step 3: Hide the settings**

Above `function isStrCiEqual` in `survey.ts`, add:

```typescript
function isScreenPositionProgressMode(obj: any): boolean {
  const mode = obj && obj.questionsOnPageMode;
  return mode === "questionPerPage" || mode === "inputPerPage" || mode === "questionOnPage";
}
```

Change `progressBarType.visibleIf` to:

```typescript
    visibleIf: (obj: any) => { return obj.showProgressBar && !isScreenPositionProgressMode(obj); }
```

Add `&& !isScreenPositionProgressMode(obj)` to the existing `visibleIf` of `progressBarShowNavigationText`, `progressBarShowPageNumbers`, `progressBarNavigationTextLocation`, and `progressBarInheritWidthFrom`. Keep their current `progressBarType === "pages"` checks.

In the `progressBarLocation` choices function, treat a screen-position mode like the linear bar:

```typescript
      const isQuestionProgress = isScreenPositionProgressMode(obj)
        || type === "questions"
        || type === "requiredquestions" || type === "requiredquestion"
        || type === "correctquestions" || type === "correctquestion";
```

Do not clear a stored `progressBarLocation` of `"belowheader"`.

- [ ] **Step 4: Run the property-grid test and the existing belowheader test**

Run from `packages/survey-core`:

```bash
npx vitest run tests/surveytests.ts -t "screen-position modes hide progress type"
npx vitest run tests/surveytests.ts -t "belowheader is hidden for question progress"
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/survey-core/src/survey.ts packages/survey-core/tests/surveytests.ts
git commit -m "feat(core): hide progress type settings for per-screen modes"
```

---

### Task 4: Refresh progress when the current input changes

**Files:**
- Modify: `packages/survey-core/src/survey.ts` (`updateNavigationElements` near line 5392)
- Test: `packages/survey-core/tests/surveytests.ts`

**Interfaces:**
- Consumes: `SurveyModel.isSingleVisibleInput`, `SurveyModel.updateProgressText()`, `QuestionSingleInputBehavior.onSingleInputChanged()` which already calls `survey.updateNavigationElements()`
- Produces: `updateNavigationElements()` recalculates progress in `inputPerPage` after refreshing the navigation buttons

- [ ] **Step 1: Write the failing test**

Add this test in `surveytests.ts` after the inputPerPage progress tests from Task 2:

```typescript
test("inputPerPage progress updates when the current input changes without a value change", () => {
  const survey = new SurveyModel({
    showProgressBar: true,
    questionsOnPageMode: "inputPerPage",
    elements: [
      {
        type: "matrix", name: "m1",
        columns: ["a", "b"],
        rows: ["r1", "r2"]
      }
    ]
  });
  expect(survey.progressText, "first row").toBe("Question 1 of 2");
  const calls: Array<string> = [];
  const original = survey.updateProgressText.bind(survey);
  survey.updateProgressText = (onValueChanged?: boolean) => {
    calls.push("update");
    original(onValueChanged);
  };
  survey.performNext();
  expect(survey.currentSingleQuestion.name, "still the matrix").toBe("m1");
  expect(survey.progressText, "second row").toBe("Question 2 of 2");
  expect(survey.getProgress(), "full bar").toBe(100);
  expect(calls.length > 0, "progress was refreshed by the input change").toBe(true);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run from `packages/survey-core`:

```bash
npx vitest run tests/surveytests.ts -t "inputPerPage progress updates when the current input changes"
```

Expected: FAIL. After `performNext()`, `progressText` is still `"Question 1 of 2"` because the inner step change does not reset progress text.

- [ ] **Step 3: Refresh progress from navigation updates**

In `updateNavigationElements`:

```typescript
  public updateNavigationElements(): void {
    this.updateButtonsVisibility();
    if (this.isSingleVisibleInput) {
      this.updateProgressText();
    }
  }
```

`questionPerPage` already refreshes through `onCurrentPageChanged` when the current element changes. Do not call `updateProgressText` for that mode from this method.

- [ ] **Step 4: Run the refresh test and the inputPerPage position test**

Run from `packages/survey-core`:

```bash
npx vitest run tests/surveytests.ts -t "inputPerPage progress updates when the current input changes"
npx vitest run tests/surveytests.ts -t "inputPerPage progress follows each input"
npx vitest run tests/surveytests.ts -t "a static matrix row is one inputPerPage screen"
```

Expected: PASS.

- [ ] **Step 5: Run the progress regression set**

Run from `packages/survey-core`:

```bash
npx vitest run tests/surveytests.ts -t "progress"
npx vitest run tests/layoutElementModelTests.ts -t "SurveyProgressTextModel"
npx vitest run tests/surveyProgressButtonsTest.ts -t "page buttons view"
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add packages/survey-core/src/survey.ts packages/survey-core/tests/surveytests.ts
git commit -m "feat(core): refresh inputPerPage progress when the current input changes"
```
