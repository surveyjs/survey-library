import { SurveyModel } from "../src/survey";
import { SurveyTimer, surveyTimerFunctions, SurveyTimerEvent } from "../src/surveytimer";
import { defaultCss } from "../src/defaultCss/defaultCss";
import { setOldTheme } from "./oldTheme";

import { describe, test, expect, vi } from "vitest";
describe("SurveyTimer", () => {
  surveyTimerFunctions.setTimeout = function(func: () => any): number {
    return 1;
  };
  surveyTimerFunctions.clearTimeout = function(timerId: number) {};
  let nowValue = 1000000000;
  surveyTimerFunctions.now = function(): number { nowValue += 1000; return nowValue; };

  test("Test timer event", () => {
    var counter = 0;
    var func = function(sender: SurveyTimer, event: SurveyTimerEvent) {
      counter++;
    };
    SurveyTimer.instance.start(func);
    doTimer(5);
    expect(counter, "Timer called 5 times").toBe(5);
    SurveyTimer.instance.stop(func);
    doTimer(3);
    expect(counter, "Timer was stopped nothing happened").toBe(5);
  });

  function doTimer(count: number, suspendedSeconds: number = 0) {
    nowValue += suspendedSeconds * 1000;
    for (var i = 0; i < count; i++) {
      SurveyTimer.instance.doTimer();
    }
  }

  test("Test suspended timer event", () => {
    var seconds = 0;
    var func = function(sender: SurveyTimer, options: SurveyTimerEvent) {
      seconds += options.seconds;
    };
    SurveyTimer.instance.start(func);
    doTimer(5);
    expect(seconds, "#1").toBe(5);
    doTimer(1, 7);
    expect(seconds, "#2").toBe(5 + 1 + 7);
  });

  test("Spent time on survey", () => {
    var survey = new SurveyModel();
    survey.startTimer();
    expect(survey.timeSpent, "Timer was  not started").toBe(0);
    doTimer(5);
    expect(survey.timeSpent, "Timer called 5 times").toBe(5);
    doTimer(5);
    expect(survey.timeSpent, "Timer called 10 times").toBe(10);
    survey.stopTimer();
    doTimer(5);
    expect(survey.timeSpent, "Timer still called 10 times").toBe(10);
    survey.startTimer();
    doTimer(5);
    expect(survey.timeSpent, "Timer called 15 times").toBe(15);
    survey.doComplete();
    doTimer(5);
    expect(survey.timeSpent, "Timer called still 15 times").toBe(15);
    survey.clear();
    expect(survey.timeSpent, "reset value").toBe(0);
    survey.stopTimer();
  });

  test("Spent time on survey with suspended timer", () => {
    var survey = new SurveyModel();
    survey.startTimer();
    expect(survey.timeSpent, "Timer was  not started").toBe(0);
    doTimer(1, 4);
    expect(survey.timeSpent, "Timer called 5 times").toBe(5);
    doTimer(1, 4);
    expect(survey.timeSpent, "Timer called 10 times").toBe(10);
    survey.stopTimer();
    doTimer(1, 4);
    expect(survey.timeSpent, "Timer still called 10 times").toBe(10);
    survey.startTimer();
    doTimer(1, 4);
    expect(survey.timeSpent, "Timer called 15 times").toBe(15);
    survey.doComplete();
    doTimer(1, 4);
    expect(survey.timeSpent, "Timer called still 15 times").toBe(15);
    survey.clear();
    expect(survey.timeSpent, "reset value").toBe(0);
    survey.stopTimer();
  });

  test("Spent time on pages", () => {
    var survey = new SurveyModel();
    var page1 = survey.addNewPage();
    var page2 = survey.addNewPage();
    page1.addNewQuestion("text");
    page2.addNewQuestion("text");
    survey.startTimer();
    expect(page1.timeSpent, "Timer was  not started").toBe(0);
    doTimer(5);
    expect(page1.timeSpent, "Timer called 5 times").toBe(5);
    doTimer(5);
    expect(page1.timeSpent, "Timer called 10 times").toBe(10);
    survey.stopTimer();
    doTimer(5);
    expect(page1.timeSpent, "Timer still called 10 times").toBe(10);
    survey.startTimer();
    doTimer(5);
    expect(page1.timeSpent, "Timer called 15 times").toBe(15);
    survey.nextPage();
    expect(page1.timeSpent, "page1, Timer called 15 times").toBe(15);
    expect(page2.timeSpent, "page2, Timer was not called yet").toBe(0);
    doTimer(30);
    expect(page1.timeSpent, "page1, Timer called 15 times").toBe(15);
    expect(page2.timeSpent, "page2, Timer called 30 times").toBe(30);
    survey.doComplete();
    expect(page1.timeSpent, "page1, after complete Timer called 15 times").toBe(15);
    expect(page2.timeSpent, "page2, after complete Timer called 30 times").toBe(30);
    survey.clear();
    expect(page1.timeSpent, "page1, reset value").toBe(0);
    expect(page2.timeSpent, "page2, reset value").toBe(0);
    survey.stopTimer();
  });

  test("Spent time on pages with suspended timer, #1", () => {
    var survey = new SurveyModel();
    var page1 = survey.addNewPage();
    var page2 = survey.addNewPage();
    page1.addNewQuestion("text");
    page2.addNewQuestion("text");
    page1.timeLimit = 9;
    page2.timeLimit = 8;
    survey.startTimer();
    expect(page1.timeSpent, "page1.timeSpent #1").toBe(0);
    expect(survey.timeSpent, "survey.timeSpent #1").toBe(0);
    doTimer(1, 4);
    expect(page1.timeSpent, "page1.timeSpent #2").toBe(5);
    expect(survey.timeSpent, "survey.timeSpent #2").toBe(5);
    doTimer(1, 10);
    expect(page1.timeSpent, "page1.timeSpent #3").toBe(9);
    expect(survey.timeSpent, "survey.timeSpent #3").toBe(9);
    expect(survey.currentPageNo, "survey.currentPageNo #1").toBe(1);
    expect(page2.timeSpent, "page2, timeSpent #1").toBe(0);
    doTimer(1, 20);
    expect(page2.timeSpent, "page2, timeSpent #2").toBe(8);
    expect(survey.timeSpent, "survey.timeSpent #4").toBe(17);
    expect(survey.state, "The survey is completed").toBe("completed");
    survey.stopTimer();
  });
  test("Spent time on pages with suspended timer, #2", () => {
    var survey = new SurveyModel();
    survey.timeLimit = 15;
    var page1 = survey.addNewPage();
    var page2 = survey.addNewPage();
    page1.addNewQuestion("text");
    page2.addNewQuestion("text");
    page1.timeLimit = 9;
    page2.timeLimit = 8;
    survey.startTimer();
    expect(page1.timeSpent, "page1.timeSpent #1").toBe(0);
    expect(survey.timeSpent, "survey.timeSpent #1").toBe(0);
    doTimer(1);
    doTimer(1);
    doTimer(1, 40);
    expect(page1.timeSpent, "page1.timeSpent #2").toBe(9);
    expect(survey.timeSpent, "survey.timeSpent #2").toBe(9);
    expect(survey.currentPageNo, "survey.currentPageNo #1").toBe(1);
    expect(page2.timeSpent, "page2, timeSpent #1").toBe(0);
    expect(survey.state, "The survey is completed").toBe("running");
    survey.stopTimer();
  });
  test("Spent time on pages with suspended timer, #3", () => {
    var survey = new SurveyModel();
    survey.timeLimit = 15;
    survey.timeLimitPerPage = 10;
    var page1 = survey.addNewPage();
    var page2 = survey.addNewPage();
    page1.addNewQuestion("text");
    page2.addNewQuestion("text");
    survey.startTimer();
    expect(page1.timeSpent, "page1.timeSpent #1").toBe(0);
    expect(survey.timeSpent, "survey.timeSpent #1").toBe(0);
    doTimer(1);
    doTimer(1);
    doTimer(1, 40);
    expect(page1.timeSpent, "page1.timeSpent #2").toBe(10);
    expect(survey.timeSpent, "survey.timeSpent #2").toBe(10);
    expect(survey.currentPageNo, "survey.currentPageNo #1").toBe(1);
    expect(page2.timeSpent, "page2, timeSpent #1").toBe(0);
    expect(survey.state, "The survey is completed").toBe("running");
    survey.stopTimer();
  });
  test("Complete survey by timer", () => {
    var survey = new SurveyModel();
    survey.addNewPage();
    survey.addNewPage();
    survey.pages[0].addNewQuestion("text");
    survey.pages[1].addNewQuestion("text");
    survey.timeLimit = 10;
    survey.startTimer();
    expect(survey.state, "The state is running").toBe("running");
    doTimer(5);
    expect(survey.state, "The state is still running").toBe("running");
    expect(survey.timeSpent, "Timer called 5 times").toBe(5);
    doTimer(6);
    expect(survey.state, "The state is completed").toBe("completed");
    expect(survey.timeSpent, "Timer called 5 times").toBe(10);
    survey.stopTimer();
  });

  test("Complete survey by timer with suspended", () => {
    var survey = new SurveyModel();
    survey.addNewPage();
    survey.addNewPage();
    survey.pages[0].addNewQuestion("text");
    survey.pages[1].addNewQuestion("text");
    survey.timeLimit = 10;
    survey.startTimer();
    expect(survey.state, "The state is running").toBe("running");
    doTimer(1, 4);
    expect(survey.state, "The state is still running").toBe("running");
    expect(survey.timeSpent, "Timer called 5 times").toBe(5);
    doTimer(1, 5);
    expect(survey.state, "The state is completed").toBe("completed");
    expect(survey.timeSpent, "Timer called 10 times").toBe(10);
    survey.stopTimer();
  });

  test("Complete pages by timer", () => {
    var survey = new SurveyModel();
    survey.addNewPage("p1");
    survey.addNewPage("p2");
    survey.pages[0].addNewQuestion("text");
    survey.pages[1].addNewQuestion("text");
    survey.timeLimitPerPage = 10;
    survey.pages[1].timeLimit = 5;
    survey.startTimer();
    expect(survey.state, "The state is running").toBe("running");
    expect(survey.currentPage.name, "The first page").toBe("p1");
    doTimer(5);
    expect(survey.state, "The state is still running").toBe("running");
    expect(survey.currentPage.name, "The first page").toBe("p1");
    doTimer(5);
    expect(survey.state, "The state is still running").toBe("running");
    expect(survey.currentPage.name, "The second first page").toBe("p2");
    doTimer(5);
    expect(survey.state, "The survey is completed").toBe("completed");
    survey.stopTimer();
  });

  test("Complete pages by timer with suspended", () => {
    var survey = new SurveyModel();
    survey.addNewPage("p1");
    survey.addNewPage("p2");
    survey.pages[0].addNewQuestion("text");
    survey.pages[1].addNewQuestion("text");
    survey.timeLimitPerPage = 10;
    survey.pages[1].timeLimit = 5;
    survey.startTimer();
    expect(survey.state, "The state is running").toBe("running");
    expect(survey.currentPage.name, "The first page").toBe("p1");
    doTimer(1, 4);
    expect(survey.state, "The state is still running").toBe("running");
    expect(survey.currentPage.name, "The first page").toBe("p1");
    doTimer(1, 4);
    expect(survey.state, "The state is still running").toBe("running");
    expect(survey.currentPage.name, "The second first page").toBe("p2");
    doTimer(1, 4);
    expect(survey.state, "The survey is completed").toBe("completed");
    survey.stopTimer();
  });

  test("Showing prev button", () => {
    var survey = new SurveyModel();
    survey.addNewPage("p1");
    survey.addNewPage("p2");
    survey.addNewPage("p3");
    survey.pages[0].addNewQuestion("text");
    survey.pages[1].addNewQuestion("text");
    survey.pages[2].addNewQuestion("text");
    survey.timeLimitPerPage = 10;
    survey.pages[1].timeLimit = -1;
    expect(survey.currentPageNo, "Init current page").toBe(0);
    expect(survey.isShowPrevButton, "First page").toBe(false);
    survey.nextPage();
    expect(survey.isShowPrevButton, "timeLimitPerPage is working").toBe(false);
    survey.nextPage();
    expect(survey.isShowPrevButton, "timeLimitPerPage is override").toBe(true);
    survey.stopTimer();
  });

  test("Showing prev button, showTimerInfo='all'", () => {
    var survey = new SurveyModel();
    survey.addNewPage("p1");
    survey.addNewPage("p2");
    survey.pages[0].addNewQuestion("text");
    survey.pages[1].addNewQuestion("text");
    expect(survey.timerInfoText, "Timer is not started").toBe("You have spent 0 sec on this page and 0 sec in total.");
    expect(survey.timerClock, "timerClock #1").toEqualValues({ majorText: "0:00", minorText: "0:00" });
    survey.startTimer();
    expect(survey.timerInfoText, "Timer just started").toBe("You have spent 0 sec on this page and 0 sec in total.");
    expect(survey.timerClock, "timerClock #2").toEqualValues({ majorText: "0:00", minorText: "0:00" });
    doTimer(62);
    expect(survey.timerInfoText, "62 sec passed").toBe("You have spent 1 min 2 sec on this page and 1 min 2 sec in total.");
    expect(survey.timerClock, "timerClock #3").toEqualValues({ majorText: "1:02", minorText: "1:02" });
    survey.nextPage();
    doTimer(3);
    expect(survey.timerInfoText, "next page 65 sec passed").toBe("You have spent 3 sec on this page and 1 min 5 sec in total.");
    expect(survey.timerClock, "timerClock #4").toEqualValues({ majorText: "0:03", minorText: "1:05" });
    survey.timeLimit = 120;
    expect(survey.timerInfoText, "survey limit, next page 65 sec passed").toBe("You have spent 3 sec on this page. You have spent 1 min 5 sec of 2 min in total.");
    expect(survey.timerClock, "timerClock #5").toEqualValues({ majorText: "0:55", minorText: "0:03" });
    survey.timeLimitPerPage = 60;
    expect(survey.timerInfoText, "survey and page limit, next page 65 sec passed").toBe("You have spent 3 sec of 1 min on this page and 1 min 5 sec of 2 min in total.");
    expect(survey.timerClock, "timerClock #6").toEqualValues({ majorText: "0:57", minorText: "0:55" });
    survey.timeLimit = 0;
    expect(survey.timerInfoText, "page limit, next page 65 sec passed").toBe("You have spent 3 sec of 1 min on this page. You have spent 1 min 5 sec in total.");
    survey.onTimerPanelInfoText.add(function(survey, options) {
      options.text = "*" + String(survey.timeSpent) + "*";
    });
    expect(survey.timerInfoText, "use onTimerPanelInfoText event.").toBe("*65*");
    survey.onTextMarkdown.add(function(survey, options) {
      options.html = options.text.replace("*", "!").replace("*", "!");
    });
    expect(survey.timerInfoText, "use onTextMarkdown event.").toBe("!65!");
    survey.stopTimer();
  });
  test("syrvey.timerClock, no negative value", () => {
    var survey = new SurveyModel();
    survey.addNewPage("p1");
    survey.pages[0].addNewQuestion("text");
    survey.timeLimit = 60;
    survey.timeLimitPerPage = 50;
    survey.startTimer();
    expect(survey.timerClock, "timerClock #1").toEqualValues({ majorText: "0:50", minorText: "1:00" });
    survey.timeSpent = 20;
    survey.currentPage.timeSpent = 20;
    expect(survey.timerClock, "timerClock #2").toEqualValues({ majorText: "0:30", minorText: "0:40" });
    survey.timeSpent = 60;
    survey.currentPage.timeSpent = 60;
    expect(survey.timerClock, "timerClock #3").toEqualValues({ majorText: "0:00", minorText: "0:00" });
    survey.timeSpent = 600;
    survey.currentPage.timeSpent = 600;
    expect(survey.timerClock, "timerClock #4").toEqualValues({ majorText: "0:00", minorText: "0:00" });
    survey.stopTimer();
  });

  test("Start timer automatically if there is the start page", () => {
    var survey = new SurveyModel();
    survey.addNewPage("p1");
    survey.addNewPage("p2");
    survey.pages[0].addNewQuestion("text");
    survey.pages[1].addNewQuestion("text");
    survey.firstPageIsStartPage = true;
    survey.showTimer = true;
    survey.start();
    doTimer(3);
    expect(survey.timeSpent, "Timer was started").toBe(3);
    survey.stopTimer();
  });

  test("Allow to modify timeSpent property", () => {
    var survey = new SurveyModel();
    survey.addNewPage("p1");
    survey.pages[0].addNewQuestion("text");
    survey.showTimer = true;
    survey.timeSpent = 100;
    survey.startTimer();
    expect(survey.timeSpent, "Timer has initial value").toBe(100);
    doTimer(30);
    expect(survey.timeSpent, "Add to initial value").toBe(130);
    survey.timeSpent = 10;
    expect(survey.timeSpent, "Timer has been changed on running").toBe(10);
    doTimer(10);
    expect(survey.timeSpent, "Timer has been updated successfully").toBe(20);
    survey.stopTimer();
  });

  test("Test SurveyTimerModel", () => {
    const survey = new SurveyModel();
    survey.addNewPage("p1");
    survey.addNewPage("p2");
    survey.pages[0].addNewQuestion("text");
    survey.pages[1].addNewQuestion("text");
    const timerModel = survey.timerModel;
    survey.startTimer();
    expect(timerModel.spent, "just started spent").toBe(0);
    expect(timerModel.text, "just started text").toBe("You have spent 0 sec on this page and 0 sec in total.");
    doTimer(62);
    expect(timerModel.spent, "62 spent").toBe(62);
    expect(timerModel.text, "62 text").toBe("You have spent 1 min 2 sec on this page and 1 min 2 sec in total.");
    survey.nextPage();
    doTimer(3);
    expect(timerModel.spent, "62 + 3 spent").toBe(62 + 3);
    expect(timerModel.text, "62 + 3 text").toBe("You have spent 3 sec on this page and 1 min 5 sec in total.");
    survey.stopTimer();
  });

  test("Test SurveyTimerModel with clock", () => {
    vi.useFakeTimers();
    try {
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
      expect(timerModel.clockMajorText).toBe("0:10");
      expect(timerModel.clockMinorText).toBe("0:25");
      expect(timerModel.progress).toBe(0);
      vi.advanceTimersByTime(1);
      expect(timerModel.progress, "Should start animation to first second").toBe(0.1);
      doTimer(3);
      expect(timerModel.clockMajorText).toBe("0:07");
      expect(timerModel.clockMinorText).toBe("0:22");
      expect(timerModel.progress, "Should start animation to next second (3 + 1)/10").toBe(0.4);
      doTimer(6);
      expect(timerModel.clockMajorText).toBe("0:01");
      expect(timerModel.clockMinorText).toBe("0:16");
      expect(timerModel.progress).toBe(1);
      survey.nextPage();
      expect(timerModel.clockMajorText).toBe("0:10");
      expect(timerModel.clockMinorText).toBe("0:16");
      expect(timerModel.progress, "Timer should be reset after page switch").toBe(0);
      doTimer(9);
      expect(timerModel.clockMajorText).toBe("0:01");
      expect(timerModel.clockMinorText).toBe("0:07");
      expect(timerModel.progress).toBe(1);
      survey.nextPage();
      expect(timerModel.clockMajorText).toBe("0:10");
      expect(timerModel.clockMinorText).toBe("0:07");
      survey.stopTimer();
    } finally {
      vi.useRealTimers();
    }
  });

  test("Test showTimerAsClock flag", () => {
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
    expect(timerModel.showTimerAsClock).toBeFalsy();
    survey.css = defaultCss;
    expect(timerModel.showTimerAsClock).toBeTruthy();
    survey.stopTimer();
  });
  test("Check timer when limits are not specified", () => {
    const createSurvey = (showTimerModelMode: string, timeLimit: number, timeLimitPerPage: number): SurveyModel => {
      var survey = new SurveyModel();
      survey.timerInfoMode = showTimerModelMode;
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
    expect(timerModel.progress).toBe(undefined);
    expect(timerModel.clockMajorText).toBe("0:00");
    expect(timerModel.clockMinorText).toBe("0:00");
    expect(timerModel.showProgress).toBeFalsy();
    doTimer(1);
    expect(timerModel.clockMajorText).toBe("0:01");
    expect(timerModel.clockMinorText).toBe("0:01");
    survey.stopTimer();

    survey = createSurvey("all", 0, 10);
    survey.startTimer();
    timerModel = survey.timerModel;
    timerModel["update"]();
    expect(timerModel.progress).toBe(0);
    expect(timerModel.clockMajorText).toBe("0:10");
    expect(timerModel.clockMinorText).toBe("0:00");
    expect(timerModel.showProgress).toBeTruthy();
    doTimer(1);
    expect(timerModel.progress).toBe(0.2);
    expect(timerModel.clockMajorText).toBe("0:09");
    expect(timerModel.clockMinorText).toBe("0:01");
    survey.stopTimer();

    survey = createSurvey("all", 25, 0);
    survey.startTimer();
    timerModel = survey.timerModel;
    timerModel["update"]();
    expect(timerModel.progress).toBe(0);
    expect(timerModel.clockMajorText).toBe("0:25");
    expect(timerModel.clockMinorText).toBe("0:00");
    expect(timerModel.showProgress).toBeTruthy();
    doTimer(1);
    expect(timerModel.progress).toBe(0.08);
    expect(timerModel.clockMajorText).toBe("0:24");
    expect(timerModel.clockMinorText).toBe("0:01");
    survey.stopTimer();

    survey = createSurvey("survey", 0, 0);
    survey.startTimer();
    timerModel = survey.timerModel;
    timerModel["update"]();
    expect(timerModel.progress).toBe(undefined);
    expect(timerModel.clockMajorText).toBe("0:00");
    expect(timerModel.clockMinorText).toBe(undefined);
    expect(timerModel.showProgress).toBeFalsy();
    doTimer(1);
    expect(timerModel.clockMajorText).toBe("0:01");
    expect(timerModel.clockMinorText).toBe(undefined);
    survey.stopTimer();

    survey = createSurvey("page", 0, 0);
    survey.startTimer();
    timerModel = survey.timerModel;
    timerModel["update"]();
    expect(timerModel.progress).toBe(undefined);
    expect(timerModel.clockMajorText).toBe("0:00");
    expect(timerModel.clockMinorText).toBe(undefined);
    expect(timerModel.showProgress).toBeFalsy();
    doTimer(1);
    expect(timerModel.clockMajorText).toBe("0:01");
    expect(timerModel.clockMinorText).toBe(undefined);
    survey.stopTimer();
  });

  test("Progress shouldn't be more than 1", () => {
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
    expect(survey.timerInfo.limit).toBe(3);
    expect(survey.timerInfo.spent, "initial spent").toBe(0);
    expect(timerModel.progress, "initial progress").toBe(0);
    doTimer(1);
    expect(survey.timerInfo.limit).toBe(3);
    expect(survey.timerInfo.spent, "spent 1").toBe(1);
    expect(timerModel.progress, "progress 1").toBe(0.66);
    doTimer(1);
    expect(survey.timerInfo.limit).toBe(3);
    expect(survey.timerInfo.spent, "spent 2").toBe(2);
    expect(timerModel.progress, "progress 2").toBe(1);
    doTimer(1);
    expect(survey.timerInfo.limit).toBe(3);
    expect(survey.timerInfo.spent, "spent 3").toBe(3);
    expect(timerModel.progress, "progress 3").toBeUndefined();
    doTimer(1);
    expect(survey.timerInfo.limit).toBe(3);
    expect(survey.timerInfo.spent, "spent 4").toBe(3);
    expect(timerModel.progress, "progress 4").toBeUndefined();
  });

  test("Do not start timer if the survey in the display mode", () => {
    var survey = new SurveyModel();
    survey.addNewPage("p1");
    survey.pages[0].addNewQuestion("text");
    survey.timeLimit = 10;
    survey.timeLimitPerPage = 7;
    survey.readOnly = true;
    survey.startTimer();
    doTimer(5);
    expect(survey.timeSpent, "Timmer is not started").toBe(0);
  });
  test("timerInfoMode -> timerInfoMode", () => {
    const survey = new SurveyModel();
    expect(survey.timerInfoMode, "timerInfoMode, #1").toBe("combined");
    expect(survey.timerInfoMode, "timerInfoMode, #1").toBe("combined");
    survey.timerInfoMode = "survey";
    expect(survey.timerInfoMode, "timerInfoMode, #2").toBe("survey");
    expect(survey.timerInfoMode, "timerInfoMode, #2").toBe("survey");
    survey.timerInfoMode = "page";
    expect(survey.timerInfoMode, "timerInfoMode, #3").toBe("page");
    expect(survey.timerInfoMode, "timerInfoMode, #3").toBe("page");
    survey.timerInfoMode = "combined";
    expect(survey.timerInfoMode, "timerInfoMode, #4").toBe("combined");
    expect(survey.timerInfoMode, "timerInfoMode, #4").toBe("combined");

    survey.timerInfoMode = "survey";
    expect(survey.timerInfoMode, "timerInfoMode, #5").toBe("survey");
    expect(survey.timerInfoMode, "timerInfoMode, #5").toBe("survey");
    survey.timerInfoMode = "page";
    expect(survey.timerInfoMode, "timerInfoMode, #6").toBe("page");
    expect(survey.timerInfoMode, "timerInfoMode, #6").toBe("page");
    survey.timerInfoMode = "all";
    expect(survey.timerInfoMode, "timerInfoMode, #7").toBe("combined");
    expect(survey.timerInfoMode, "timerInfoMode, #7").toBe("combined");

    survey.fromJSON({ timerInfoMode: "survey" });
    expect(survey.timerInfoMode, "timerInfoMode, #8").toBe("survey");
    expect(survey.timerInfoMode, "timerInfoMode, #8").toBe("survey");
    survey.fromJSON({ timerInfoMode: "page" });
    expect(survey.timerInfoMode, "timerInfoMode, #9").toBe("page");
    expect(survey.timerInfoMode, "timerInfoMode, #9").toBe("page");
    survey.fromJSON({ timerInfoMode: "combined" });
    expect(survey.timerInfoMode, "timerInfoMode, #10").toBe("combined");
    expect(survey.timerInfoMode, "timerInfoMode, #10").toBe("combined");
  });
  test("showTimerPanel -> showTimer & timerLocation", () => {
    const survey = new SurveyModel();
    let number = 1;
    const testValues = (showTimerPanel: string, showTimer: boolean, timerLocation: string,
      isOnTop: boolean, isOnBottom: boolean): void => {
      expect(survey.showTimerPanel, "showTimerPanel, #" + number).toBe(showTimerPanel);
      expect(survey.showTimer, "showTimer, #" + number).toBe(showTimer);
      expect(survey.timerLocation, "timerLocation, #" + number).toBe(timerLocation);
      expect(survey.isTimerPanelShowingOnTop, "isTimerPanelShowingOnTop, #" + number).toBe(isOnTop);
      expect(survey.isTimerPanelShowingOnBottom, "isTimerPanelShowingOnBottom, #" + number).toBe(isOnBottom);
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
});
