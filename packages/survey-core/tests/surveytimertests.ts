import { SurveyModel } from "../src/survey";
import { SurveyTimer, surveyTimerFunctions, SurveyTimerEvent } from "../src/surveytimer";
import { defaultCss } from "../src/defaultCss/defaultCss";
import { setOldTheme } from "./oldTheme";

export default QUnit.module("SurveyTimer");

surveyTimerFunctions.setTimeout = function(func: () => any): number {
  return 1;
};
surveyTimerFunctions.clearTimeout = function(timerId: number) {};
let nowValue = 1000000000;
surveyTimerFunctions.now = function(): number { nowValue += 1000; return nowValue; };

QUnit.test("Test timer event", function(assert) {
  var counter = 0;
  var func = function(sender: SurveyTimer, event: SurveyTimerEvent) {
    counter++;
  };
  SurveyTimer.instance.start(func);
  doTimer(5);
  assert.equal(counter, 5, "Timer called 5 times");
  SurveyTimer.instance.stop(func);
  doTimer(3);
  assert.equal(counter, 5, "Timer was stopped nothing happened");
});

function doTimer(count: number, suspendedSeconds: number = 0) {
  nowValue += suspendedSeconds * 1000;
  for (var i = 0; i < count; i++) {
    SurveyTimer.instance.doTimer();
  }
}

QUnit.test("Test suspended timer event", function(assert) {
  var seconds = 0;
  var func = function(sender: SurveyTimer, options: SurveyTimerEvent) {
    seconds += options.seconds;
  };
  SurveyTimer.instance.start(func);
  doTimer(5);
  assert.equal(seconds, 5, "#1");
  doTimer(1, 7);
  assert.equal(seconds, 5 + 1 + 7, "#2");
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

QUnit.test("Spent time on survey with suspended timer", function(assert) {
  var survey = new SurveyModel();
  survey.startTimer();
  assert.equal(survey.timeSpent, 0, "Timer was  not started");
  doTimer(1, 4);
  assert.equal(survey.timeSpent, 5, "Timer called 5 times");
  doTimer(1, 4);
  assert.equal(survey.timeSpent, 10, "Timer called 10 times");
  survey.stopTimer();
  doTimer(1, 4);
  assert.equal(survey.timeSpent, 10, "Timer still called 10 times");
  survey.startTimer();
  doTimer(1, 4);
  assert.equal(survey.timeSpent, 15, "Timer called 15 times");
  survey.doComplete();
  doTimer(1, 4);
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

QUnit.test("Spent time on pages with suspended timer, #1", function(assert) {
  var survey = new SurveyModel();
  var page1 = survey.addNewPage();
  var page2 = survey.addNewPage();
  page1.addNewQuestion("text");
  page2.addNewQuestion("text");
  page1.timeLimit = 9;
  page2.timeLimit = 8;
  survey.startTimer();
  assert.equal(page1.timeSpent, 0, "page1.timeSpent #1");
  assert.equal(survey.timeSpent, 0, "survey.timeSpent #1");
  doTimer(1, 4);
  assert.equal(page1.timeSpent, 5, "page1.timeSpent #2");
  assert.equal(survey.timeSpent, 5, "survey.timeSpent #2");
  doTimer(1, 10);
  assert.equal(page1.timeSpent, 9, "page1.timeSpent #3");
  assert.equal(survey.timeSpent, 9, "survey.timeSpent #3");
  assert.equal(survey.currentPageNo, 1, "survey.currentPageNo #1");
  assert.equal(page2.timeSpent, 0, "page2, timeSpent #1");
  doTimer(1, 20);
  assert.equal(page2.timeSpent, 8, "page2, timeSpent #2");
  assert.equal(survey.timeSpent, 17, "survey.timeSpent #4");
  assert.equal(survey.state, "completed", "The survey is completed");
  survey.stopTimer();
});
QUnit.test("Spent time on pages with suspended timer, #2", function(assert) {
  var survey = new SurveyModel();
  survey.timeLimit = 15;
  var page1 = survey.addNewPage();
  var page2 = survey.addNewPage();
  page1.addNewQuestion("text");
  page2.addNewQuestion("text");
  page1.timeLimit = 9;
  page2.timeLimit = 8;
  survey.startTimer();
  assert.equal(page1.timeSpent, 0, "page1.timeSpent #1");
  assert.equal(survey.timeSpent, 0, "survey.timeSpent #1");
  doTimer(1);
  doTimer(1);
  doTimer(1, 40);
  assert.equal(page1.timeSpent, 9, "page1.timeSpent #2");
  assert.equal(survey.timeSpent, 9, "survey.timeSpent #2");
  assert.equal(survey.currentPageNo, 1, "survey.currentPageNo #1");
  assert.equal(page2.timeSpent, 0, "page2, timeSpent #1");
  assert.equal(survey.state, "running", "The survey is completed");
  survey.stopTimer();
});
QUnit.test("Spent time on pages with suspended timer, #3", function(assert) {
  var survey = new SurveyModel();
  survey.timeLimit = 15;
  survey.timeLimitPerPage = 10;
  var page1 = survey.addNewPage();
  var page2 = survey.addNewPage();
  page1.addNewQuestion("text");
  page2.addNewQuestion("text");
  survey.startTimer();
  assert.equal(page1.timeSpent, 0, "page1.timeSpent #1");
  assert.equal(survey.timeSpent, 0, "survey.timeSpent #1");
  doTimer(1);
  doTimer(1);
  doTimer(1, 40);
  assert.equal(page1.timeSpent, 10, "page1.timeSpent #2");
  assert.equal(survey.timeSpent, 10, "survey.timeSpent #2");
  assert.equal(survey.currentPageNo, 1, "survey.currentPageNo #1");
  assert.equal(page2.timeSpent, 0, "page2, timeSpent #1");
  assert.equal(survey.state, "running", "The survey is completed");
  survey.stopTimer();
});
QUnit.test("Complete survey by timer", function(assert) {
  var survey = new SurveyModel();
  survey.addNewPage();
  survey.addNewPage();
  survey.pages[0].addNewQuestion("text");
  survey.pages[1].addNewQuestion("text");
  survey.timeLimit = 10;
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

QUnit.test("Complete survey by timer with suspended", function(assert) {
  var survey = new SurveyModel();
  survey.addNewPage();
  survey.addNewPage();
  survey.pages[0].addNewQuestion("text");
  survey.pages[1].addNewQuestion("text");
  survey.timeLimit = 10;
  survey.startTimer();
  assert.equal(survey.state, "running", "The state is running");
  doTimer(1, 4);
  assert.equal(survey.state, "running", "The state is still running");
  assert.equal(survey.timeSpent, 5, "Timer called 5 times");
  doTimer(1, 5);
  assert.equal(survey.state, "completed", "The state is completed");
  assert.equal(survey.timeSpent, 10, "Timer called 10 times");
  survey.stopTimer();
});

QUnit.test("Complete pages by timer", function(assert) {
  var survey = new SurveyModel();
  survey.addNewPage("p1");
  survey.addNewPage("p2");
  survey.pages[0].addNewQuestion("text");
  survey.pages[1].addNewQuestion("text");
  survey.timeLimitPerPage = 10;
  survey.pages[1].timeLimit = 5;
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

QUnit.test("Complete pages by timer with suspended", function(assert) {
  var survey = new SurveyModel();
  survey.addNewPage("p1");
  survey.addNewPage("p2");
  survey.pages[0].addNewQuestion("text");
  survey.pages[1].addNewQuestion("text");
  survey.timeLimitPerPage = 10;
  survey.pages[1].timeLimit = 5;
  survey.startTimer();
  assert.equal(survey.state, "running", "The state is running");
  assert.equal(survey.currentPage.name, "p1", "The first page");
  doTimer(1, 4);
  assert.equal(survey.state, "running", "The state is still running");
  assert.equal(survey.currentPage.name, "p1", "The first page");
  doTimer(1, 4);
  assert.equal(survey.state, "running", "The state is still running");
  assert.equal(survey.currentPage.name, "p2", "The second first page");
  doTimer(1, 4);
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
  survey.timeLimitPerPage = 10;
  survey.pages[1].timeLimit = -1;
  assert.equal(survey.currentPageNo, 0, "Init current page");
  assert.equal(survey.isShowPrevButton, false, "First page");
  survey.nextPage();
  assert.equal(
    survey.isShowPrevButton,
    false,
    "timeLimitPerPage is working"
  );
  survey.nextPage();
  assert.equal(
    survey.isShowPrevButton,
    true,
    "timeLimitPerPage is override"
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
  assert.deepEqual(survey.timerClock, { majorText: "0:00", minorText: "0:00" }, "timerClock #1");
  survey.startTimer();
  assert.equal(
    survey.timerInfoText,
    "You have spent 0 sec on this page and 0 sec in total.",
    "Timer just started"
  );
  assert.deepEqual(survey.timerClock, { majorText: "0:00", minorText: "0:00" }, "timerClock #2");
  doTimer(62);
  assert.equal(
    survey.timerInfoText,
    "You have spent 1 min 2 sec on this page and 1 min 2 sec in total.",
    "62 sec passed"
  );
  assert.deepEqual(survey.timerClock, { majorText: "1:02", minorText: "1:02" }, "timerClock #3");
  survey.nextPage();
  doTimer(3);
  assert.equal(
    survey.timerInfoText,
    "You have spent 3 sec on this page and 1 min 5 sec in total.",
    "next page 65 sec passed"
  );
  assert.deepEqual(survey.timerClock, { majorText: "0:03", minorText: "1:05" }, "timerClock #4");
  survey.timeLimit = 120;
  assert.equal(
    survey.timerInfoText,
    "You have spent 3 sec on this page. You have spent 1 min 5 sec of 2 min in total.",
    "survey limit, next page 65 sec passed"
  );
  assert.deepEqual(survey.timerClock, { majorText: "0:55", minorText: "0:03" }, "timerClock #5");
  survey.timeLimitPerPage = 60;
  assert.equal(
    survey.timerInfoText,
    "You have spent 3 sec of 1 min on this page and 1 min 5 sec of 2 min in total.",
    "survey and page limit, next page 65 sec passed"
  );
  assert.deepEqual(survey.timerClock, { majorText: "0:57", minorText: "0:55" }, "timerClock #6");
  survey.timeLimit = 0;
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
QUnit.test("syrvey.timerClock, no negative value", function(assert) {
  var survey = new SurveyModel();
  survey.addNewPage("p1");
  survey.pages[0].addNewQuestion("text");
  survey.timeLimit = 60;
  survey.timeLimitPerPage = 50;
  survey.startTimer();
  assert.deepEqual(survey.timerClock, { majorText: "0:50", minorText: "1:00" }, "timerClock #1");
  survey.timeSpent = 20;
  survey.currentPage.timeSpent = 20;
  assert.deepEqual(survey.timerClock, { majorText: "0:30", minorText: "0:40" }, "timerClock #2");
  survey.timeSpent = 60;
  survey.currentPage.timeSpent = 60;
  assert.deepEqual(survey.timerClock, { majorText: "0:00", minorText: "0:00" }, "timerClock #3");
  survey.timeSpent = 600;
  survey.currentPage.timeSpent = 600;
  assert.deepEqual(survey.timerClock, { majorText: "0:00", minorText: "0:00" }, "timerClock #4");
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
  survey.firstPageIsStartPage = true;
  survey.showTimerPanel = "top";
  survey.start();
  doTimer(3);
  assert.equal(survey.timeSpent, 3, "Timer was started");
  survey.stopTimer();
});

QUnit.test("Allow to modify timeSpent property", (assert) => {
  var survey = new SurveyModel();
  survey.addNewPage("p1");
  survey.pages[0].addNewQuestion("text");
  survey.showTimerPanel = "top";
  survey.timeSpent = 100;
  survey.startTimer();
  assert.equal(survey.timeSpent, 100, "Timer has initial value");
  doTimer(30);
  assert.equal(survey.timeSpent, 130, "Add to initial value");
  survey.timeSpent = 10;
  assert.equal(survey.timeSpent, 10, "Timer has been changed on running");
  doTimer(10);
  assert.equal(survey.timeSpent, 20, "Timer has been updated successfully");
  survey.stopTimer();
});

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
  survey.timeLimit = 25;
  survey.timeLimitPerPage = 10;
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
  const createSurvey = (timeLimit: number, timeLimitPerPage: number): SurveyModel => {
    var survey = new SurveyModel();
    setOldTheme(survey);
    survey.timeLimit = timeLimit;
    survey.timeLimitPerPage = timeLimitPerPage;
    survey.addNewPage("p1");
    survey.pages[0].addNewQuestion("text");
    return survey;
  };
  var survey = createSurvey(25, 10);
  survey.startTimer();
  let timerModel = survey.timerModel;
  assert.notOk(timerModel.showTimerAsClock);
  survey.css = defaultCss;
  assert.ok(timerModel.showTimerAsClock);
  survey.stopTimer();
});
QUnit.test("Check timer when limits are not specified", function(assert) {
  const createSurvey = (showTimerModelMode: string, timeLimit: number, timeLimitPerPage: number): SurveyModel => {
    var survey = new SurveyModel();
    survey.showTimerPanelMode = showTimerModelMode;
    survey.timeLimit = timeLimit;
    survey.timeLimitPerPage = timeLimitPerPage;
    survey.addNewPage("p1");
    survey.pages[0].addNewQuestion("text");
    return survey;
  };
  let survey = createSurvey("all", 0, 0);
  survey.startTimer();
  let timerModel = survey.timerModel;
  timerModel["update"]();
  assert.strictEqual(timerModel.progress, undefined);
  assert.strictEqual(timerModel.clockMajorText, "0:00");
  assert.strictEqual(timerModel.clockMinorText, "0:00");
  assert.notOk(timerModel.showProgress);
  doTimer(1);
  assert.strictEqual(timerModel.clockMajorText, "0:01");
  assert.strictEqual(timerModel.clockMinorText, "0:01");
  survey.stopTimer();

  survey = createSurvey("all", 0, 10);
  survey.startTimer();
  timerModel = survey.timerModel;
  timerModel["update"]();
  assert.strictEqual(timerModel.progress, 0);
  assert.strictEqual(timerModel.clockMajorText, "0:10");
  assert.strictEqual(timerModel.clockMinorText, "0:00");
  assert.ok(timerModel.showProgress);
  doTimer(1);
  assert.strictEqual(timerModel.progress, 0.2);
  assert.strictEqual(timerModel.clockMajorText, "0:09");
  assert.strictEqual(timerModel.clockMinorText, "0:01");
  survey.stopTimer();

  survey = createSurvey("all", 25, 0);
  survey.startTimer();
  timerModel = survey.timerModel;
  timerModel["update"]();
  assert.strictEqual(timerModel.progress, 0);
  assert.strictEqual(timerModel.clockMajorText, "0:25");
  assert.strictEqual(timerModel.clockMinorText, "0:00");
  assert.ok(timerModel.showProgress);
  doTimer(1);
  assert.strictEqual(timerModel.progress, 0.08);
  assert.strictEqual(timerModel.clockMajorText, "0:24");
  assert.strictEqual(timerModel.clockMinorText, "0:01");
  survey.stopTimer();

  survey = createSurvey("survey", 0, 0);
  survey.startTimer();
  timerModel = survey.timerModel;
  timerModel["update"]();
  assert.strictEqual(timerModel.progress, undefined);
  assert.strictEqual(timerModel.clockMajorText, "0:00");
  assert.strictEqual(timerModel.clockMinorText, undefined);
  assert.notOk(timerModel.showProgress);
  doTimer(1);
  assert.strictEqual(timerModel.clockMajorText, "0:01");
  assert.strictEqual(timerModel.clockMinorText, undefined);
  survey.stopTimer();

  survey = createSurvey("page", 0, 0);
  survey.startTimer();
  timerModel = survey.timerModel;
  timerModel["update"]();
  assert.strictEqual(timerModel.progress, undefined);
  assert.strictEqual(timerModel.clockMajorText, "0:00");
  assert.strictEqual(timerModel.clockMinorText, undefined);
  assert.notOk(timerModel.showProgress);
  doTimer(1);
  assert.strictEqual(timerModel.clockMajorText, "0:01");
  assert.strictEqual(timerModel.clockMinorText, undefined);
  survey.stopTimer();
});

QUnit.test("Progress shouldn't be more than 1", function (assert) {
  const createSurvey = (timeLimit: number, timeLimitPerPage: number): SurveyModel => {
    var survey = new SurveyModel();
    survey.timeLimit = timeLimit;
    survey.timeLimitPerPage = timeLimitPerPage;
    survey.addNewPage("p1");
    survey.pages[0].addNewQuestion("text");
    return survey;
  };
  var survey = createSurvey(3, 3);
  const timerModel = survey.timerModel;
  survey.startTimer();
  assert.equal(survey.timerInfo.limit, 3);
  assert.equal(survey.timerInfo.spent, 0, "initial spent");
  assert.equal(timerModel.progress, 0, "initial progress");
  doTimer(1);
  assert.equal(survey.timerInfo.limit, 3);
  assert.equal(survey.timerInfo.spent, 1, "spent 1");
  assert.equal(timerModel.progress, 0.66, "progress 1");
  doTimer(1);
  assert.equal(survey.timerInfo.limit, 3);
  assert.equal(survey.timerInfo.spent, 2, "spent 2");
  assert.equal(timerModel.progress, 1, "progress 2");
  doTimer(1);
  assert.equal(survey.timerInfo.limit, 3);
  assert.equal(survey.timerInfo.spent, 3, "spent 3");
  assert.equal(timerModel.progress, undefined, "progress 3");
  doTimer(1);
  assert.equal(survey.timerInfo.limit, 3);
  assert.equal(survey.timerInfo.spent, 3, "spent 4");
  assert.equal(timerModel.progress, undefined, "progress 4");
});

QUnit.test("Do not start timer if the survey in the display mode", function (assert) {
  var survey = new SurveyModel();
  survey.addNewPage("p1");
  survey.pages[0].addNewQuestion("text");
  survey.timeLimit = 10;
  survey.timeLimitPerPage = 7;
  survey.mode = "display";
  survey.startTimer();
  doTimer(5);
  assert.equal(survey.timeSpent, 0, "Timmer is not started");
});
QUnit.test("showTimerPanelMode -> timerInfoMode", function (assert) {
  const survey = new SurveyModel();
  assert.equal(survey.timerInfoMode, "combined", "timerInfoMode, #1");
  assert.equal(survey.showTimerPanelMode, "all", "showTimerPanelMode, #1");
  survey.timerInfoMode = "survey";
  assert.equal(survey.timerInfoMode, "survey", "timerInfoMode, #2");
  assert.equal(survey.showTimerPanelMode, "survey", "showTimerPanelMode, #2");
  survey.timerInfoMode = "page";
  assert.equal(survey.timerInfoMode, "page", "timerInfoMode, #3");
  assert.equal(survey.showTimerPanelMode, "page", "showTimerPanelMode, #3");
  survey.timerInfoMode = "combined";
  assert.equal(survey.timerInfoMode, "combined", "timerInfoMode, #4");
  assert.equal(survey.showTimerPanelMode, "all", "showTimerPanelMode, #4");

  survey.showTimerPanelMode = "survey";
  assert.equal(survey.timerInfoMode, "survey", "timerInfoMode, #5");
  assert.equal(survey.showTimerPanelMode, "survey", "showTimerPanelMode, #5");
  survey.showTimerPanelMode = "page";
  assert.equal(survey.timerInfoMode, "page", "timerInfoMode, #6");
  assert.equal(survey.showTimerPanelMode, "page", "showTimerPanelMode, #6");
  survey.showTimerPanelMode = "all";
  assert.equal(survey.timerInfoMode, "combined", "timerInfoMode, #7");
  assert.equal(survey.showTimerPanelMode, "all", "showTimerPanelMode, #7");

  survey.fromJSON({ showTimerPanelMode: "survey" });
  assert.equal(survey.timerInfoMode, "survey", "timerInfoMode, #8");
  assert.equal(survey.showTimerPanelMode, "survey", "showTimerPanelMode, #8");
  survey.fromJSON({ showTimerPanelMode: "page" });
  assert.equal(survey.timerInfoMode, "page", "timerInfoMode, #9");
  assert.equal(survey.showTimerPanelMode, "page", "showTimerPanelMode, #9");
  survey.fromJSON({ showTimerPanelMode: "all" });
  assert.equal(survey.timerInfoMode, "combined", "timerInfoMode, #10");
  assert.equal(survey.showTimerPanelMode, "all", "showTimerPanelMode, #10");
});
QUnit.test("showTimerPanel -> showTimer & timerLocation", function (assert) {
  const survey = new SurveyModel();
  let number = 1;
  const testValues = (showTimerPanel: string, showTimer: boolean, timerLocation: string,
    isOnTop: boolean, isOnBottom: boolean): void => {
    assert.equal(survey.showTimerPanel, showTimerPanel, "showTimerPanel, #" + number);
    assert.equal(survey.showTimer, showTimer, "showTimer, #" + number);
    assert.equal(survey.timerLocation, timerLocation, "timerLocation, #" + number);
    assert.equal(survey.isTimerPanelShowingOnTop, isOnTop, "isTimerPanelShowingOnTop, #" + number);
    assert.equal(survey.isTimerPanelShowingOnBottom, isOnBottom, "isTimerPanelShowingOnBottom, #" + number);
    number ++;
  };
  testValues("none", false, "top", false, false);

  survey.showTimerPanel = "top";
  testValues("top", true, "top", true, false);

  survey.showTimerPanel = "bottom";
  testValues("bottom", true, "bottom", false, true);

  survey.showTimerPanel = "none";
  testValues("none", false, "bottom", false, false);

  survey.timerLocation = "top";
  testValues("none", false, "top", false, false);

  survey.timerLocation = "bottom";
  testValues("none", false, "bottom", false, false);

  survey.showTimer = true;
  testValues("bottom", true, "bottom", false, true);

  survey.showTimer = false;
  testValues("none", false, "bottom", false, false);

  survey.fromJSON({ showTimerPanel: "top" });
  testValues("top", true, "top", true, false);

  survey.fromJSON({ showTimerPanel: "bottom" });
  testValues("bottom", true, "bottom", false, true);

  survey.fromJSON({ showTimerPanel: "none" });
  testValues("none", false, "bottom", false, false);
});