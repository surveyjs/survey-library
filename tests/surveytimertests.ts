import { PageModel } from "../src/page";
import { SurveyModel } from "../src/survey";
import { SurveyTimer, surveyTimerFunctions } from "../src/surveytimer";
import { SurveyTimerModel } from "../src/surveyTimerModel";
import { defaultV2Css } from "../src/defaultCss/defaultV2Css";

export default QUnit.module("SurveyTimer");

surveyTimerFunctions.setTimeout = function(func: () => any): number {
  return 1;
};
surveyTimerFunctions.clearTimeout = function(timerId: number) {};

QUnit.test("Test timer event", function(assert) {
  var counter = 0;
  var func = function() {
    counter++;
  };
  SurveyTimer.instance.start(func);
  doTimer(5);
  assert.equal(counter, 5, "Timer called 5 times");
  SurveyTimer.instance.stop(func);
  doTimer(3);
  assert.equal(counter, 5, "Timer was stopped nothing happened");
});

QUnit.test("Spent time on survey", function(assert) {
  var survey = new SurveyModel();
  survey.startTimer();
  assert.equal(survey.timeSpent, 0, "Timer was  not started");
  doTimer(5);
  assert.equal(survey.timeSpent, 5, "Timer called 5 times");
  doTimer(5);
  assert.equal(survey.timeSpent, 10, "Timer called 10 times");
  survey.stopTimer();
  doTimer(5);
  assert.equal(survey.timeSpent, 10, "Timer still called 10 times");
  survey.startTimer();
  doTimer(5);
  assert.equal(survey.timeSpent, 15, "Timer called 15 times");
  survey.doComplete();
  doTimer(5);
  assert.equal(survey.timeSpent, 15, "Timer called still 15 times");
  survey.clear();
  assert.equal(survey.timeSpent, 0, "reset value");
  survey.stopTimer();
});

QUnit.test("Spent time on pages", function(assert) {
  var survey = new SurveyModel();
  var page1 = survey.addNewPage();
  var page2 = survey.addNewPage();
  page1.addNewQuestion("text");
  page2.addNewQuestion("text");
  survey.startTimer();
  assert.equal(page1.timeSpent, 0, "Timer was  not started");
  doTimer(5);
  assert.equal(page1.timeSpent, 5, "Timer called 5 times");
  doTimer(5);
  assert.equal(page1.timeSpent, 10, "Timer called 10 times");
  survey.stopTimer();
  doTimer(5);
  assert.equal(page1.timeSpent, 10, "Timer still called 10 times");
  survey.startTimer();
  doTimer(5);
  assert.equal(page1.timeSpent, 15, "Timer called 15 times");
  survey.nextPage();
  assert.equal(page1.timeSpent, 15, "page1, Timer called 15 times");
  assert.equal(page2.timeSpent, 0, "page2, Timer was not called yet");
  doTimer(30);
  assert.equal(page1.timeSpent, 15, "page1, Timer called 15 times");
  assert.equal(page2.timeSpent, 30, "page2, Timer called 30 times");
  survey.doComplete();
  assert.equal(
    page1.timeSpent,
    15,
    "page1, after complete Timer called 15 times"
  );
  assert.equal(
    page2.timeSpent,
    30,
    "page2, after complete Timer called 30 times"
  );
  survey.clear();
  assert.equal(page1.timeSpent, 0, "page1, reset value");
  assert.equal(page2.timeSpent, 0, "page2, reset value");
  survey.stopTimer();
});

QUnit.test("Complete survey by timer", function(assert) {
  var survey = new SurveyModel();
  survey.addNewPage();
  survey.addNewPage();
  survey.pages[0].addNewQuestion("text");
  survey.pages[1].addNewQuestion("text");
  survey.maxTimeToFinish = 10;
  survey.startTimer();
  assert.equal(survey.state, "running", "The state is running");
  doTimer(5);
  assert.equal(survey.state, "running", "The state is still running");
  assert.equal(survey.timeSpent, 5, "Timer called 5 times");
  doTimer(6);
  assert.equal(survey.state, "completed", "The state is completed");
  assert.equal(survey.timeSpent, 10, "Timer called 5 times");
  survey.stopTimer();
});

QUnit.test("Complete pages by timer", function(assert) {
  var survey = new SurveyModel();
  survey.addNewPage("p1");
  survey.addNewPage("p2");
  survey.pages[0].addNewQuestion("text");
  survey.pages[1].addNewQuestion("text");
  survey.maxTimeToFinishPage = 10;
  survey.pages[1].maxTimeToFinish = 5;
  survey.startTimer();
  assert.equal(survey.state, "running", "The state is running");
  assert.equal(survey.currentPage.name, "p1", "The first page");
  doTimer(5);
  assert.equal(survey.state, "running", "The state is still running");
  assert.equal(survey.currentPage.name, "p1", "The first page");
  doTimer(5);
  assert.equal(survey.state, "running", "The state is still running");
  assert.equal(survey.currentPage.name, "p2", "The second first page");
  doTimer(5);
  assert.equal(survey.state, "completed", "The survey is completed");
  survey.stopTimer();
});

QUnit.test("Showing prev button", function(assert) {
  var survey = new SurveyModel();
  survey.addNewPage("p1");
  survey.addNewPage("p2");
  survey.addNewPage("p3");
  survey.pages[0].addNewQuestion("text");
  survey.pages[1].addNewQuestion("text");
  survey.pages[2].addNewQuestion("text");
  survey.maxTimeToFinishPage = 10;
  survey.pages[1].maxTimeToFinish = -1;
  assert.equal(survey.currentPageNo, 0, "Init current page");
  assert.equal(survey.isShowPrevButton, false, "First page");
  survey.nextPage();
  assert.equal(
    survey.isShowPrevButton,
    false,
    "maxTimeToFinishPage is working"
  );
  survey.nextPage();
  assert.equal(
    survey.isShowPrevButton,
    true,
    "maxTimeToFinishPage is override"
  );
  survey.stopTimer();
});

QUnit.test("Showing prev button, showTimerInfo='all'", function(assert) {
  var survey = new SurveyModel();
  survey.addNewPage("p1");
  survey.addNewPage("p2");
  survey.pages[0].addNewQuestion("text");
  survey.pages[1].addNewQuestion("text");
  assert.equal(
    survey.timerInfoText,
    "You have spent 0 sec on this page and 0 sec in total.",
    "Timer is not started"
  );
  survey.startTimer();
  assert.equal(
    survey.timerInfoText,
    "You have spent 0 sec on this page and 0 sec in total.",
    "Timer just started"
  );
  doTimer(62);
  assert.equal(
    survey.timerInfoText,
    "You have spent 1 min 2 sec on this page and 1 min 2 sec in total.",
    "62 sec passed"
  );
  survey.nextPage();
  doTimer(3);
  assert.equal(
    survey.timerInfoText,
    "You have spent 3 sec on this page and 1 min 5 sec in total.",
    "next page 65 sec passed"
  );
  survey.maxTimeToFinish = 120;
  assert.equal(
    survey.timerInfoText,
    "You have spent 3 sec on this page. You have spent 1 min 5 sec of 2 min in total.",
    "survey limit, next page 65 sec passed"
  );
  survey.maxTimeToFinishPage = 60;
  assert.equal(
    survey.timerInfoText,
    "You have spent 3 sec of 1 min on this page and 1 min 5 sec of 2 min in total.",
    "survey and page limit, next page 65 sec passed"
  );
  survey.maxTimeToFinish = 0;
  assert.equal(
    survey.timerInfoText,
    "You have spent 3 sec of 1 min on this page. You have spent 1 min 5 sec in total.",
    "page limit, next page 65 sec passed"
  );
  survey.onTimerPanelInfoText.add(function(survey, options) {
    options.text = "*" + String(survey.timeSpent) + "*";
  });
  assert.equal(survey.timerInfoText, "*65*", "use onTimerPanelInfoText event.");
  survey.onTextMarkdown.add(function(survey, options) {
    options.html = options.text.replace("*", "!").replace("*", "!");
  });
  assert.equal(survey.timerInfoText, "!65!", "use onTextMarkdown event.");
  survey.stopTimer();
});

QUnit.test("Start timer automatically if there is the start page", function(
  assert
) {
  var survey = new SurveyModel();
  survey.addNewPage("p1");
  survey.addNewPage("p2");
  survey.pages[0].addNewQuestion("text");
  survey.pages[1].addNewQuestion("text");
  survey.firstPageIsStarted = true;
  survey.showTimerPanel = "top";
  survey.start();
  doTimer(3);
  assert.equal(survey.timeSpent, 3, "Timer was started");
  survey.stopTimer();
});

function doTimer(count: number) {
  for (var i = 0; i < count; i++) {
    SurveyTimer.instance.doTimer();
  }
}

QUnit.test("Test SurveyTimerModel", function(assert) {
  const survey = new SurveyModel();
  survey.addNewPage("p1");
  survey.addNewPage("p2");
  survey.pages[0].addNewQuestion("text");
  survey.pages[1].addNewQuestion("text");
  const timerModel = survey.timerModel;
  survey.startTimer();
  assert.equal(timerModel.spent, 0, "just started spent");
  assert.equal(timerModel.text, "You have spent 0 sec on this page and 0 sec in total.", "just started text");
  doTimer(62);
  assert.equal(timerModel.spent, 62, "62 spent");
  assert.equal(timerModel.text, "You have spent 1 min 2 sec on this page and 1 min 2 sec in total.", "62 text");
  survey.nextPage();
  doTimer(3);
  assert.equal(timerModel.spent, 62 + 3, "62 + 3 spent");
  assert.equal(timerModel.text, "You have spent 3 sec on this page and 1 min 5 sec in total.", "62 + 3 text");
  survey.stopTimer();
});

QUnit.test("Test SurveyTimerModel with clock", function(assert) {
  var survey = new SurveyModel();
  survey.maxTimeToFinish = 25;
  survey.maxTimeToFinishPage = 10;
  survey.addNewPage("p1");
  survey.addNewPage("p2");
  survey.addNewPage("p3");
  survey.pages[0].addNewQuestion("text");
  survey.pages[1].addNewQuestion("text");
  survey.pages[2].addNewQuestion("text");
  survey.startTimer();
  let timerModel = survey.timerModel;
  let done = assert.async();
  assert.equal(timerModel.clockMajorText, "0:10");
  assert.equal(timerModel.clockMinorText, "0:25");
  assert.equal(timerModel.progress, 0);
  setTimeout(() => {
    assert.equal(timerModel.progress, 0.1, "Should start animation to first second");
    doTimer(3);
    assert.equal(timerModel.clockMajorText, "0:07");
    assert.equal(timerModel.clockMinorText, "0:22");
    assert.equal(timerModel.progress, 0.4, "Should start animation to next second (3 + 1)/10");
    doTimer(6);
    assert.equal(timerModel.clockMajorText, "0:01");
    assert.equal(timerModel.clockMinorText, "0:16");
    assert.equal(timerModel.progress, 1);
    survey.nextPage();
    assert.equal(timerModel.clockMajorText, "0:10");
    assert.equal(timerModel.clockMinorText, "0:16");
    assert.equal(timerModel.progress, 0, "Timer should be reset after page switch");
    doTimer(9);
    assert.equal(timerModel.clockMajorText, "0:01");
    assert.equal(timerModel.clockMinorText, "0:07");
    assert.equal(timerModel.progress, 1);
    survey.nextPage();
    assert.equal(timerModel.clockMajorText, "0:10");
    assert.equal(timerModel.clockMinorText, "0:07");
    survey.stopTimer();
    done();
  }, 1);

});

QUnit.test("Test showTimerAsClock flag", function(assert) {
  const createSurvey = (maxTimeToFinish: number, maxTimeToFinishPage: number): SurveyModel => {
    var survey = new SurveyModel();
    survey.maxTimeToFinish = maxTimeToFinish;
    survey.maxTimeToFinishPage = maxTimeToFinishPage;
    survey.addNewPage("p1");
    survey.pages[0].addNewQuestion("text");
    return survey;
  };
  var survey = createSurvey(25, 10);
  survey.startTimer();
  let timerModel = survey.timerModel;
  assert.notOk(timerModel.showTimerAsClock);
  survey.css = defaultV2Css;
  assert.ok(timerModel.showTimerAsClock);
  survey.stopTimer();

  survey = createSurvey(0, 0);
  survey.css = defaultV2Css;
  survey.startTimer();
  timerModel = survey.timerModel;
  timerModel["update"]();
  assert.strictEqual(timerModel.progress, undefined);
  assert.strictEqual(timerModel.clockMajorText, undefined);
  assert.notOk(timerModel.showTimerAsClock);
  survey.stopTimer();

  survey = createSurvey(0, 10);
  survey.startTimer();
  survey.css = defaultV2Css;
  timerModel = survey.timerModel;
  timerModel["update"]();
  assert.strictEqual(timerModel.progress, 0);
  assert.strictEqual(timerModel.clockMajorText, "0:10");
  assert.ok(timerModel.showTimerAsClock);
  survey.stopTimer();

  survey = createSurvey(25, 0);
  survey.css = defaultV2Css;
  timerModel = survey.timerModel;
  timerModel["update"]();
  assert.strictEqual(timerModel.progress, 0);
  assert.strictEqual(timerModel.clockMajorText, "0:25");
  assert.ok(timerModel.showTimerAsClock);
  survey.stopTimer();
});