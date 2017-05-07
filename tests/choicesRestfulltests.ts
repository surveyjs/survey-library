import {ChoicesRestfull} from "../src/choicesRestfull";
import {QuestionDropdownModel} from "../src/question_dropdown";
import {ItemValue} from "../src/itemvalue";

export default QUnit.module("choicesRestfull");

class ChoicesRestfullTester extends ChoicesRestfull {
    public runJson(json: any) {
        this.onLoad(json);
    }
}

class QuestionDropdownModelTester extends QuestionDropdownModel {
    constructor(name: string) {
        super(name);
    }
    protected createRestfull(): ChoicesRestfull { return new ChoicesRestfullTester(); }
    public runChoicesByUrl(json: any) {
        (<ChoicesRestfullTester>this.choicesByUrl).runJson(json);
    }
}

QUnit.test("Load countries", function (assert) {
    var test = new ChoicesRestfullTester();
    var items = [];
    test.getResultCallback = function (res: Array<ItemValue>) { items = res; };
    var json = getCountries();
    test.path = "RestResponse;result";
    test.runJson(json);
    assert.equal(items.length, 5, "there are 5 countries");
    assert.equal(items[0].value, "Afghanistan", "the first country is Afghanistan");
    assert.equal(items[4].value, "American Samoa", "the fifth country is American Samoa");
});

QUnit.test("Test dropdown", function (assert) {
    var question = new QuestionDropdownModelTester("q1");
    assert.equal(question.choices.length, 0, "There is no choices by default");
    assert.equal(question.visibleChoices.length, 0, "There is no visible choices by default");
    var json = getCountries();
    question.choicesByUrl.path = "RestResponse;result";
    question.runChoicesByUrl(json);
    assert.equal(question.choices.length, 0, "Choices do not used");
    assert.equal(question.visibleChoices.length, 5, "There are 5 countries now");
});

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
