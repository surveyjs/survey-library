import {SurveyModel} from "../src/survey";
import {SurveyTimer, surveyTimerFunctions} from "../src/surveytimer";

export default QUnit.module("Survey");

surveyTimerFunctions.setInterval = function(func: () => any): number {return 1;};
surveyTimerFunctions.clearInterval = function(timerId: number) {};

QUnit.test("Test timer event", function (assert) {
    var counter = 0;
    var func = function() {counter ++;}
    SurveyTimer.instance.start(func);
    doTimer(5);
    assert.equal(counter, 5, "Timer called 5 times");
    SurveyTimer.instance.stop(func);
    doTimer(3);
    assert.equal(counter, 5, "Timer was stopped nothing happend");
});

QUnit.test("Spent time on survey", function (assert) {
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
});

QUnit.test("Spent time on pages", function (assert) {
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
    assert.equal(page1.timeSpent, 15, "page1, after complete Timer called 15 times");
    assert.equal(page2.timeSpent, 30, "page2, after complete Timer called 30 times");
    survey.clear();
    assert.equal(page1.timeSpent, 0, "page1, reset value");
    assert.equal(page2.timeSpent, 0, "page2, reset value");
});

function doTimer(count: number) {
    for(var i = 0; i < count; i ++) {
        SurveyTimer.instance.doTimer();
    }
}
