import {SurveyModel} from "../src/survey";
import {Question} from "../src/question";
import {ChoicesRestfull} from "../src/choicesRestfull";
import {QuestionDropdownModel} from "../src/question_dropdown";
import {QuestionMatrixDynamicModel} from "../src/question_matrixdynamic";
import {QuestionMatrixDropdownModelBase} from "../src/question_matrixdropdownbase";
import {ItemValue} from "../src/itemvalue";
import {JsonObject} from "../src/jsonobject";

export default QUnit.module("choicesRestfull");

class ChoicesRestfullTester extends ChoicesRestfull {
    public noCaching: boolean = false;
    protected sendRequest() {
        if(this.processedUrl.indexOf("countries") > -1) this.onLoad(getCountries());
        if(this.processedUrl.indexOf("ca_cities") > -1) this.onLoad(getCACities());
        if(this.processedUrl.indexOf("tx_cities") > -1) this.onLoad(getTXCities());
    }
    protected useChangedItemsResults() : boolean {
        if(this.noCaching) return false;
        return super.useChangedItemsResults();
    }
}

class QuestionDropdownModelTester extends QuestionDropdownModel {
    constructor(name: string) {
        super(name);
    }
    protected createRestfull(): ChoicesRestfull { return new ChoicesRestfullTester(); }
}

class QuestionMatrixDynamicModelTester extends QuestionMatrixDynamicModel {
    constructor(name: string) {
        super(name);
    }
    protected createCellQuestion(questionType: string, name: string): Question {
        if(questionType == "dropdown") return new QuestionDropdownModelTester(name);
        return super.createCellQuestion(questionType, name);
    }
}

class QuestionDropdownImageTester extends QuestionDropdownModel {
    constructor(name: string) {
        super(name);
    }
    protected createRestfull(): ChoicesRestfull { 
        var res = new ChoicesRestfullTester(); 
        res.noCaching = true;
        return res;
    }
    public getType(): string { return "dropdown_image"; }
}

JsonObject.metaData.addClass("dropdown_image", [], function () { return new QuestionDropdownImageTester(""); }, "dropdown");
JsonObject.metaData.addClass("imageitemvalues_choicesrest", ["alpha3_code", "customProperty"], null, "itemvalue");
JsonObject.metaData.addClass("imagepicker_choicesrest", [{name: "choices:imageitemvalues_choicesrest", onGetValue: function (obj) { return ItemValue.getData(obj.choices); }, onSetValue: function (obj, value) { obj.choices = value; }}], null, "dropdown_image");

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

QUnit.test("Load countries, complext valueName property, Issue#459", function (assert) {
    var test = new ChoicesRestfullTester();
    var items = [];
    test.getResultCallback = function (res: Array<ItemValue>) { items = res; };
    test.url = "allcountries";
    test.path = "RestResponse;result";
    test.valueName = "locName.en";
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

QUnit.test("Cascad dropdown in matrix dynamic", function (assert) {
    var survey = new SurveyModel();
    survey.addNewPage("1")
    var question = new QuestionMatrixDynamicModelTester("q1");
    question.rowCount = 2;
    question.addColumn("state");
    var dropdownColumn = question.addColumn("city");
    dropdownColumn.choicesByUrl.url = "{row.state}";
    survey.pages[0].addQuestion(question);
    question.onSurveyLoad();
    var rows = question.visibleRows;
    var cellDropdown = <QuestionDropdownModel>rows[0].cells[1].question;
    assert.equal(cellDropdown.visibleChoices.length, 0, "It is empty");
    rows[0].cells[0].question.value = "ca_cities";
    assert.equal(cellDropdown.visibleChoices.length, 2, "We have two cities now, CA");
    rows[0].cells[0].question.value = "tx_cities";
    assert.equal(cellDropdown.visibleChoices.length, 3, "We have three cities now, TX");
    rows[0].cells[0].question.value = "";
    assert.equal(cellDropdown.visibleChoices.length, 0, "It is empty again");
}); 

QUnit.test("Load countries, custom properties, #615", function (assert) {
    var test = new ChoicesRestfullTester();
    test.noCaching = true;
    var items = [];
    JsonObject.metaData.addProperty("itemvalue", "alpha2_code");
    test.getResultCallback = function (res: Array<ItemValue>) { items = res; };
    test.url = "allcountries";
    test.path = "RestResponse;result";
    test.run();
    assert.equal(items.length, 5, "there are 5 countries");
    assert.equal(items[0]["alpha2_code"], "AF", "the first alpha2_code is AF");
    assert.equal(items[4]["alpha2_code"], "AS", "the fifth alpha2_code is AS");
    JsonObject.metaData.removeProperty("itemvalue", "alpha2_code");
});

QUnit.test("Load countries, custom itemvalue class", function (assert) {
    var question = <QuestionDropdownImageTester>JsonObject.metaData.createClass("imagepicker_choicesrest");
    question.choicesByUrl.url = "allcountries";
    question.choicesByUrl.path = "RestResponse;result";
    question.choicesByUrl["customPropertyName"] = "alpha2_code";
    question.onSurveyLoad();
    assert.equal(question.choices.length, 0, "Choices do not used");
    assert.equal(question.visibleChoices.length, 5, "There are 5 countries now");
    assert.equal(question.visibleChoices[0]["alpha3_code"], "AFG", "Custom property is set");
    assert.equal(question.visibleChoices[0]["customProperty"], "AF", "Custom property is set via propertyName is set");
});

QUnit.test("choicesByUrl + custom itemvalue class, save/load to/from json", function (assert) {
    var question = <QuestionDropdownImageTester>JsonObject.metaData.createClass("imagepicker_choicesrest");
    question.choicesByUrl.url = "allcountries";
    question.choicesByUrl.path = "RestResponse;result";
    question.choicesByUrl["customPropertyName"] = "alpha2_code";
    question.name = "q";
    var savedJson = new JsonObject().toJsonObject(question);
    var json = { name: "q", choicesByUrl: { url: "allcountries", path: "RestResponse;result", customPropertyName: "alpha2_code" } };
    assert.deepEqual(savedJson, json, "choicesByUrl + custom itemvalue class restore correctly");

    var loadedQuestion = <QuestionDropdownImageTester>JsonObject.metaData.createClass("imagepicker_choicesrest");
    new JsonObject().toObject(json, loadedQuestion);
    assert.equal(loadedQuestion.choicesByUrl["customPropertyName"], "alpha2_code", "Restore customproperty correctly from json");
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
                "locName": {"en": "Afghanistan"},
                "alpha2_code": "AF",
                "alpha3_code": "AFG"
            }, {
                "name": "Åland Islands",
                "locName": {"en": "Åland Islands"},
                "alpha2_code": "AX",
                "alpha3_code": "ALA"
            }, {
                "name": "Albania",
                "locName": {"en": "Albania"},
                "alpha2_code": "AL",
                "alpha3_code": "ALB"
            }, {
                "name": "Algeria",
                "locName": {"en": "Algeria"},
                "alpha2_code": "DZ",
                "alpha3_code": "DZA"
            }, {
                "name": "American Samoa",
                "locName": {"en": "American Samoa"},
                "alpha2_code": "AS",
                "alpha3_code": "ASM"
            }]
        }
    };
}
