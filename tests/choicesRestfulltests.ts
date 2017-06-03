import {SurveyModel} from "../src/survey";
import {Question} from "../src/question";
import {ChoicesRestfull} from "../src/choicesRestfull";
import {QuestionDropdownModel} from "../src/question_dropdown";
import {ItemValue} from "../src/itemvalue";

export default QUnit.module("choicesRestfull");

class ChoicesRestfullTester extends ChoicesRestfull {
    protected sendRequest() {
        if(this.processedUrl.indexOf("countries") > -1) this.onLoad(getCountries());
        if(this.processedUrl.indexOf("ca_cities") > -1) this.onLoad(getCACities());
        if(this.processedUrl.indexOf("tx_cities") > -1) this.onLoad(getTXCities());
    }
}

class QuestionDropdownModelTester extends QuestionDropdownModel {
    constructor(name: string) {
        super(name);
    }
    protected createRestfull(): ChoicesRestfull { return new ChoicesRestfullTester(); }
}

QUnit.test("Load countries", function (assert) {
    var test = new ChoicesRestfullTester();
    var items = [];
    test.getResultCallback = function (res: Array<ItemValue>) { items = res; };
    test.url = "allcountries";
    test.path = "RestResponse;result";
    test.run();
    assert.equal(items.length, 5, "there are 5 countries");
    assert.equal(items[0].value, "Afghanistan", "the first country is Afghanistan");
    assert.equal(items[4].value, "American Samoa", "the fifth country is American Samoa");
});

QUnit.test("Test dropdown", function (assert) {
    var question = new QuestionDropdownModelTester("q1");
    assert.equal(question.choices.length, 0, "There is no choices by default");
    assert.equal(question.visibleChoices.length, 0, "There is no visible choices by default");
    question.choicesByUrl.url = "allcountries";
    question.choicesByUrl.path = "RestResponse;result";
    question.onSurveyLoad();
    assert.equal(question.choices.length, 0, "Choices do not used");
    assert.equal(question.visibleChoices.length, 5, "There are 5 countries now");
});

QUnit.test("Use variables", function (assert) {
    var survey = new SurveyModel();
    survey.addNewPage("1")
    var question = new QuestionDropdownModelTester("q1");
    survey.pages[0].addQuestion(question);
    var stateQuestion = <Question>survey.pages[0].addNewQuestion("text", "state");
    question.choicesByUrl.url = "{state}";
    question.onSurveyLoad();
    assert.equal(question.visibleChoices.length, 0, "It is empty");
    stateQuestion.value = "ca_cities";
    assert.equal(question.visibleChoices.length, 2, "We have two cities now, CA");
    stateQuestion.value = "tx_cities";
    assert.equal(question.visibleChoices.length, 3, "We have three cities now, TX");
    stateQuestion.value = "";
    assert.equal(question.visibleChoices.length, 0, "It is empty again");
});

function getCACities() {
    return [
      "Los Angeles", "San Francisco"
    ];
}
function getTXCities() {
    return [
      "Houston", "San Antonio", "Dallas"
    ];
}

function getCountries(): any {
    return {
        "RestResponse": {
            "messages": ["More webservices are available at http://www.groupkt.com/post/f2129b88/services.htm", "Total [249] records found."],
            "result": [{
                "name": "Afghanistan",
                "alpha2_code": "AF",
                "alpha3_code": "AFG"
            }, {
                "name": "Åland Islands",
                "alpha2_code": "AX",
                "alpha3_code": "ALA"
            }, {
                "name": "Albania",
                "alpha2_code": "AL",
                "alpha3_code": "ALB"
            }, {
                "name": "Algeria",
                "alpha2_code": "DZ",
                "alpha3_code": "DZA"
            }, {
                "name": "American Samoa",
                "alpha2_code": "AS",
                "alpha3_code": "ASM"
            }]
        }
    };
}
