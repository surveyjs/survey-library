import { ITextProcessor, SurveyElement } from "../src/base";
import { SurveyModel } from "../src/survey";
import { Question } from "../src/question";
import { ChoicesRestfull } from "../src/choicesRestfull";
import { QuestionDropdownModel } from "../src/question_dropdown";
import { QuestionCheckboxModel } from "../src/question_checkbox";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import { QuestionPanelDynamicModel } from "../src/question_paneldynamic";
import {
  MatrixDropdownRowModelBase,
  MatrixDropdownColumn,
} from "../src/question_matrixdropdownbase";
import { ItemValue } from "../src/itemvalue";
import { JsonObject, Serializer } from "../src/jsonobject";
import { QuestionRadiogroupModel } from "../src/question_radiogroup";
import { settings } from "../src/settings";

export default QUnit.module("choicesRestfull");

class ChoicesRestfullTester extends ChoicesRestfull {
  private delaySentRequestValue: boolean = false;
  private nonProceedUrls = {};
  public noCaching: boolean = false;
  public lastProcesedUrl: string;
  public items: any = null;
  public sentRequestCounter: number = 0;
  public get testProcessedUrl() {
    return this.processedUrl;
  }
  public get delaySentRequest(): boolean {
    return this.delaySentRequestValue;
  }
  public set delaySentRequest(val: boolean) {
    if (this.delaySentRequest == val) return;
    this.delaySentRequestValue = val;
    if (!val) {
      for (var key in this.nonProceedUrls) {
        this.callResultCallback(this.nonProceedUrls[key], key);
      }
      this.nonProceedUrls = {};
    }
  }
  protected sendRequest() {
    this.beforeSendRequest();
    this.sentRequestCounter++;
    this.lastProcesedUrl = this.processedUrl;
    if (this.processedUrl.indexOf("empty") > -1) this.onLoad([]);
    if (this.processedUrl.indexOf("countries") > -1)
      this.onLoad(getCountries());
    if (!!this.items) {
      this.onLoad(this.items);
      return;
    }
    if (this.processedUrl.indexOf("ca_cities") > -1) this.onLoad(getCACities());
    if (this.processedUrl.indexOf("tx_cities") > -1) this.onLoad(getTXCities());
    if (this.processedUrl.indexOf("xml") > -1)
      this.onLoad(this.parseResponse(getXmlResponse()));
    if (this.processedUrl.indexOf("text") > -1)
      this.onLoad(this.parseResponse(getTextResponse()));
  }
  protected useChangedItemsResults(): boolean {
    if (this.noCaching) return false;
    return super.useChangedItemsResults();
  }
  protected callResultCallback(
    items: Array<ItemValue>,
    loadingObjHash: string
  ) {
    if (this.delaySentRequest) {
      this.nonProceedUrls[loadingObjHash] = items;
    } else {
      super.callResultCallback(items, loadingObjHash);
    }
  }
}

class TextProcessorTester implements ITextProcessor {
  processText(text: string, returnDisplayValue: boolean): string {
    return this.processTextEx(text, returnDisplayValue, true).text;
  }
  processTextEx(
    text: string,
    returnDisplayValue: boolean,
    doEncoding: boolean
  ): any {
    return { text: text, hasAllValuesOnLastRun: true };
  }
}

class QuestionDropdownModelTester extends QuestionDropdownModel {
  oldGetResultCallback: any;
  public loadingFromChoicesCounter: number = 0;
  constructor(name: string) {
    super(name);
    this.oldGetResultCallback = this.choicesByUrl.getResultCallback;
    var self = this;
    this.choicesByUrl.getResultCallback = function (items: Array<ItemValue>) {
      self.newGetResultCallback(items);
    };
  }
  public getType(): string {
    return "dropdownrestfulltester";
  }
  public get restFullTest(): ChoicesRestfullTester {
    return <ChoicesRestfullTester>this.choicesByUrl;
  }
  protected createRestfull(): ChoicesRestfull {
    var res = new ChoicesRestfullTester();
    res.noCaching = true;
    return res;
  }
  protected onLoadChoicesFromUrl(array: Array<ItemValue>) {
    super.onLoadChoicesFromUrl(array);
    this.loadingFromChoicesCounter++;
  }
  public hasItemsCallbackDelay: boolean = false;
  private loadedItems: Array<ItemValue>;
  public doResultsCallback() {
    if (this.loadedItems) {
      this.oldGetResultCallback(this.loadedItems);
    }
    this.loadedItems = null;
  }
  protected newGetResultCallback(items: Array<ItemValue>) {
    this.loadedItems = items;
    if (!this.hasItemsCallbackDelay) {
      this.doResultsCallback();
    }
  }
  processor: ITextProcessor;
  protected get textProcessor(): ITextProcessor {
    if (!this.processor) this.processor = new TextProcessorTester();
    return this.processor;
  }
}

class QuestionCheckboxModelTester extends QuestionCheckboxModel {
  oldGetResultCallback: any;
  constructor(name: string) {
    super(name);
    this.oldGetResultCallback = this.choicesByUrl.getResultCallback;
    var self = this;
    this.choicesByUrl.getResultCallback = function (items: Array<ItemValue>) {
      self.newGetResultCallback(items);
    };
  }
  public getType(): string {
    return "dropdownrestfulltester";
  }
  public get restFullTest(): ChoicesRestfullTester {
    return <ChoicesRestfullTester>this.choicesByUrl;
  }
  protected createRestfull(): ChoicesRestfull {
    var res = new ChoicesRestfullTester();
    res.noCaching = true;
    return res;
  }
  public hasItemsCallbackDelay: boolean = false;
  private loadedItems: Array<ItemValue>;
  public doResultsCallback() {
    if (this.loadedItems) {
      this.oldGetResultCallback(this.loadedItems);
    }
    this.loadedItems = null;
  }
  protected newGetResultCallback(items: Array<ItemValue>) {
    this.loadedItems = items;
    if (!this.hasItemsCallbackDelay) {
      this.doResultsCallback();
    }
  }
  processor: ITextProcessor;
  protected get textProcessor(): ITextProcessor {
    if (!this.processor) this.processor = new TextProcessorTester();
    return this.processor;
  }
}

Serializer.addClass(
  "dropdownrestfulltester",
  [],
  function () {
    return new QuestionDropdownModelTester("");
  },
  "dropdown"
);

class QuestionMatrixDynamicModelTester extends QuestionMatrixDynamicModel {
  constructor(name: string) {
    super(name);
  }
  protected createQuestionCore(
    row: MatrixDropdownRowModelBase,
    column: MatrixDropdownColumn
  ): Question {
    var question = super.createQuestionCore(row, column);
    if (column.cellType == "dropdown") {
      var newQuestion = new QuestionDropdownModelTester(name);
      var json = new JsonObject().toJsonObject(question);
      new JsonObject().toObject(json, newQuestion);
      newQuestion.setSurveyImpl(row);
      return newQuestion;
    }
    return question;
  }

  processor: ITextProcessor;
  protected get textProcessor(): ITextProcessor {
    if (!this.processor) this.processor = new TextProcessorTester();
    return this.processor;
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
  public getType(): string {
    return "dropdown_image";
  }
  processor: ITextProcessor;
  protected get textProcessor(): ITextProcessor {
    if (!this.processor) this.processor = new TextProcessorTester();
    return this.processor;
  }
}

Serializer.addClass(
  "dropdown_image",
  [],
  function () {
    return new QuestionDropdownImageTester("");
  },
  "dropdown"
);
Serializer.addClass(
  "imageitemvalues_choicesrest",
  ["alpha3_code", "customProperty"],
  null,
  "itemvalue"
);
Serializer.addClass(
  "imagepicker_choicesrest",
  [
    {
      name: "choices:imageitemvalues_choicesrest",
      onGetValue: function (obj) {
        return ItemValue.getData(obj.choices);
      },
      onSetValue: function (obj, value) {
        obj.choices = value;
      },
    },
  ],
  null,
  "dropdown_image"
);

QUnit.test("Load countries", function (assert) {
  var test = new ChoicesRestfullTester();
  var items = [];
  test.getResultCallback = function (res: Array<ItemValue>) {
    items = res;
  };
  test.url = "allcountries";
  test.path = "RestResponse;result";
  test.run();
  assert.equal(items.length, 5, "there are 5 countries");
  assert.equal(
    items[0].value,
    "Afghanistan",
    "the first country is Afghanistan"
  );
  assert.equal(
    items[4].value,
    "American Samoa",
    "the fifth country is American Samoa"
  );
});

QUnit.test("attachOriginalItems", function (assert) {
  var test = new ChoicesRestfullTester();
  var items: Array<ItemValue> = [];
  test.getResultCallback = function (res: Array<ItemValue>) {
    items = res;
  };
  test.noCaching = true;
  test.url = "allcountries";
  test.path = "RestResponse;result";
  test.attachOriginalItems = true;
  test.run();
  assert.equal(items.length, 5, "there are 5 countries");
  assert.equal(
    items[0].value,
    "Afghanistan",
    "the first country is Afghanistan"
  );
  assert.deepEqual(
    items[0].originalItem,
    {
      name: "Afghanistan",
      locName: { en: "Afghanistan" },
      alpha2_code: "AF",
      alpha3_code: "AFG",
    },
    "keeps the original item"
  );
});

QUnit.test("attachOriginalItems in question", function(assert) {
  var question = new QuestionDropdownModelTester("q1");
  question.fromJSON({
    choicesByUrl: {
      url: "allcountries",
      path: "RestResponse;result",
      attachOriginalItems: true
    }
  });
  question.onSurveyLoad();
  assert.equal(question.visibleChoices.length, 5, "Choices has been loaded");
  assert.deepEqual(
    question.visibleChoices[0].originalItem,
    {
      name: "Afghanistan",
      locName: { en: "Afghanistan" },
      alpha2_code: "AF",
      alpha3_code: "AFG",
    },
    "keeps the original item"
  );
});

QUnit.test("Load attachOriginalItems value from JSON", function(assert) {
  var test = new ChoicesRestfull();
  assert.notOk(test.attachOriginalItems, "attachOriginalItems initially false");
  test.fromJSON({
    url: "allcountries",
    path: "RestResponse;result",
    attachOriginalItems: true
  });
  assert.ok(test.attachOriginalItems, "attachOriginalItems has been loaded");

  var question = new QuestionDropdownModel("q1");
  assert.notOk(question.choicesByUrl.attachOriginalItems, "question: attachOriginalItems initially false");
  question.fromJSON({
    choicesByUrl: {
      url: "allcountries",
      path: "RestResponse;result",
      attachOriginalItems: true
    }
  });
  assert.equal(question.choicesByUrl.url, "allcountries", "question: url has been loaded");
  assert.ok(question.choicesByUrl.attachOriginalItems, "question: attachOriginalItems has been loaded");
});

QUnit.test(
  "Do not run same request several times at the same time. Wait for the first one",
  function (assert) {
    ChoicesRestfull.clearCache();
    var test1 = new ChoicesRestfullTester();
    var test2 = new ChoicesRestfullTester();
    var items1 = [],
      items2 = [];
    test1.getResultCallback = function (res: Array<ItemValue>) {
      items1 = res;
    };
    test2.getResultCallback = function (res: Array<ItemValue>) {
      items2 = res;
    };
    test1.url = "allcountries";
    test1.path = "RestResponse;result";
    test2.url = "allcountries";
    test2.path = "RestResponse;result";
    test1.delaySentRequest = true;
    test1.run();
    test2.run();
    test1.delaySentRequest = false;

    assert.equal(items1.length, 5, "there are 5 countries in items1");
    assert.equal(items2.length, 5, "there are 5 countries in items2");
    assert.equal(test1.sentRequestCounter, 1, "test1 send request one time");
    assert.equal(test2.sentRequestCounter, 0, "test2 use requests");
  }
);

QUnit.test("encode parameters", function (assert) {
  var survey = new SurveyModel();
  survey.setValue("q1", "R&D");
  var test = new ChoicesRestfullTester();
  test.url = "TestUrl/{q1}";
  test.getResultCallback = function (res: Array<ItemValue>) { };
  test.run(survey);
  assert.equal(test.testProcessedUrl, "TestUrl/R%26D", "Encode the string");
  settings.webserviceEncodeParameters = false;
  test.run(survey);
  assert.equal(test.testProcessedUrl, "TestUrl/R&D", "stop encoding");
  settings.webserviceEncodeParameters = true;
});

QUnit.test("Process text in event", function (assert) {
  var survey = new SurveyModel();
  survey.onProcessTextValue.add(function (sender, options) {
    if (options.name == "q1") {
      options.value = "R&D";
      //options.isExists = true;
    }
  });
  var test = new ChoicesRestfullTester();
  test.url = "TestUrl/{q1}";
  test.getResultCallback = function (res: Array<ItemValue>) { };
  test.run(survey);
  assert.equal(test.testProcessedUrl, "TestUrl/R%26D");
});

QUnit.test("Load from plain text", function (assert) {
  var test = new ChoicesRestfullTester();
  var items = [];
  test.getResultCallback = function (res: Array<ItemValue>) {
    items = res;
  };
  test.url = "text";
  test.run();
  assert.equal(items.length, 5, "there are 5 items");
  assert.equal(items[0].value, "1", "the item is empty");
  assert.equal(
    items[4].calculatedText,
    "Optimizes Work Processes",
    "the 5th item text is 'Optimizes Work Processes'"
  );
});

QUnit.test("Load countries, complex valueName property, Issue#459", function (
  assert
) {
  var test = new ChoicesRestfullTester();
  var items = [];
  test.getResultCallback = function (res: Array<ItemValue>) {
    items = res;
  };
  test.url = "allcountries";
  test.path = "RestResponse;result";
  test.valueName = "locName.en";
  test.run();
  assert.equal(items.length, 5, "there are 5 countries");
  assert.equal(
    items[0].value,
    "Afghanistan",
    "the first country is Afghanistan"
  );
  assert.equal(
    items[4].value,
    "American Samoa",
    "the fifth country is American Samoa"
  );
});

QUnit.test("Test dropdown", function (assert) {
  var question = new QuestionDropdownModelTester("q1");
  assert.equal(question.choices.length, 0, "There is no choices by default");
  assert.equal(
    question.visibleChoices.length,
    0,
    "There is no visible choices by default"
  );
  question.choicesByUrl.url = "allcountries";
  question.choicesByUrl.path = "RestResponse;result";
  question.onSurveyLoad();
  assert.equal(question.choices.length, 0, "Choices do not used");
  assert.equal(question.visibleChoices.length, 5, "There are 5 countries now");
});

QUnit.test(
  "Do not show error or change the question value if quesiton is readOnly, Bug #1819",
  function (assert) {
    var question = new QuestionDropdownModelTester("q1");
    question.value = "test";
    question.readOnly = true;

    assert.equal(
      question.visibleChoices.length,
      0,
      "There is no visible choices by default"
    );
    question.choicesByUrl.url = "empty";
    question.choicesByUrl.path = "RestResponse;result";
    question.onSurveyLoad();
    assert.equal(question.visibleChoices.length, 0, "Get no items");
    assert.equal(question.value, "test", "Value do not changed");
    assert.equal(question.errors.length, 0, "We do not have any errors");
  }
);

QUnit.test("Use variables", function (assert) {
  var survey = new SurveyModel();
  survey.addNewPage("1");
  var question = new QuestionDropdownModelTester("q1");
  survey.pages[0].addQuestion(question);
  var stateQuestion = <Question>survey.pages[0].addNewQuestion("text", "state");
  question.choicesByUrl.url = "{state}";
  question.onSurveyLoad();
  assert.equal(question.visibleChoices.length, 0, "It is empty");
  stateQuestion.value = "ca_cities";
  assert.equal(question.visibleChoices.length, 2, "We have two cities now, CA");
  stateQuestion.value = "tx_cities";
  assert.equal(
    question.visibleChoices.length,
    3,
    "We have three cities now, TX"
  );
  stateQuestion.value = "";
  assert.equal(question.visibleChoices.length, 0, "It is empty again");
  stateQuestion.value = "tx_cities";
  assert.equal(
    question.visibleChoices.length,
    3,
    "We have three cities again, TX"
  );
});

QUnit.test("Do not set items with old variable, Bug #2197", function (assert) {
  var survey = new SurveyModel();
  survey.addNewPage("1");
  var question = new QuestionDropdownModelTester("q1");
  survey.pages[0].addQuestion(question);
  var stateQuestion = <Question>survey.pages[0].addNewQuestion("text", "state");
  question.choicesByUrl.url = "{state}";
  question.restFullTest.delaySentRequest = true;
  question.onSurveyLoad();
  assert.equal(question.visibleChoices.length, 0, "It is empty");
  stateQuestion.value = "ca_cities";
  stateQuestion.value = "tx_cities";
  question.restFullTest.delaySentRequest = false;
  assert.equal(
    question.visibleChoices.length,
    3,
    "We have three cities now, TX"
  );
  assert.equal(
    question.loadingFromChoicesCounter,
    2,
    "Loaded choices one time + one time empty"
  );
  ChoicesRestfull.clearCache();
});
/*
QUnit.test("Clear choices on changing variables", function (assert) {
  var survey = new SurveyModel();
  survey.addNewPage("1");
  var question = new QuestionDropdownModelTester("q1");
  survey.pages[0].addQuestion(question);
  var stateQuestion = <Question>survey.pages[0].addNewQuestion("text", "state");
  question.choicesByUrl.url = "{state}";
  question.onSurveyLoad();
  assert.equal(question.visibleChoices.length, 0, "It is empty");
  stateQuestion.value = "ca_cities";
  assert.equal(question.visibleChoices.length, 2, "We have two cities now, CA");
  question.restFullTest.delaySentRequest = true;
  stateQuestion.value = "tx_cities";
  assert.equal(
    question.visibleChoices.length,
    0,
    "Clear choices on changing variables"
  );
  question.restFullTest.delaySentRequest = false;
  assert.equal(
    question.visibleChoices.length,
    3,
    "We have three cities now, TX"
  );
  ChoicesRestfull.clearCache();
});
*/

QUnit.test("onLoadItemsFromServer event", function (assert) {
  var survey = new SurveyModel();
  survey.addNewPage("1");
  var question = new QuestionDropdownModelTester("q1");
  survey.pages[0].addQuestion(question);
  var stateQuestion = <Question>survey.pages[0].addNewQuestion("text", "state");
  question.choicesByUrl.url = "{state}";

  survey.onLoadChoicesFromServer.add(function (survey, options) {
    if (options.question.name != "q1") return;
    options.question.visible = options.choices.length > 0;
    if (options.choices.length > 1) {
      options.choices.shift();
    }
  });
  question.onSurveyLoad();
  assert.equal(question.visibleChoices.length, 0, "It is empty");
  assert.equal(question.visible, false, "make it invisible on event");
  stateQuestion.value = "ca_cities";
  assert.equal(
    question.visibleChoices.length,
    1,
    "We have two cities and we remove on event one, CA"
  );
  assert.equal(question.visible, true, "make it visible on event");
  stateQuestion.value = "tx_cities";
  assert.equal(
    question.visibleChoices.length,
    2,
    "We have three cities now and we remove on event one, TX"
  );
  stateQuestion.value = "";
  assert.equal(question.visibleChoices.length, 0, "It is empty again");
  assert.equal(question.visible, false, "And it is again invisible");
});

QUnit.test(
  "disable/enable on loading items, settings.disableOnGettingChoicesFromWeb",
  function (assert) {
    settings.disableOnGettingChoicesFromWeb = true;
    var survey = new SurveyModel();
    survey.addNewPage("page1");
    var question = new QuestionDropdownModelTester("q1");
    var isReadOnly = question.isReadOnly;
    assert.equal(isReadOnly, false, "It is not readOnly by default");
    survey.onLoadChoicesFromServer.add(function (survey, options) {
      isReadOnly = question.isReadOnly;
    });
    question.choicesByUrl.url = "allcountries";
    question.choicesByUrl.path = "RestResponse;result";
    survey.pages[0].addQuestion(question);
    assert.equal(isReadOnly, true, "It was readOnly");
    assert.equal(
      question.isReadOnly,
      false,
      "It is not readOnly after getting choices"
    );
    settings.disableOnGettingChoicesFromWeb = false;
  }
);

QUnit.test("Set value before loading data, bug #1089", function (assert) {
  var survey = new SurveyModel();
  survey.addNewPage("1");
  var question = new QuestionDropdownModelTester("q1");
  question.choicesByUrl.url = "{state}";
  survey.pages[0].addQuestion(question);
  question.hasItemsCallbackDelay = true;
  question.onSurveyLoad();
  survey.setValue("q1", "CA");
  question.doResultsCallback();
  assert.equal(question.value, "CA", "'CA' value is still here");
});

QUnit.test(
  "Set value before loading data + storeOthersAsComment, bug #1089",
  function (assert) {
    var survey = new SurveyModel();
    survey.addNewPage("1");
    var question = new QuestionDropdownModelTester("q1");
    survey.storeOthersAsComment = false;
    question.choicesByUrl.url = "{state}";
    survey.pages[0].addQuestion(question);
    question.hasItemsCallbackDelay = true;
    question.onSurveyLoad();
    survey.setValue("q1", "CA");
    assert.equal(question.isOtherSelected, false, "There shuld not be other#1");
    question.doResultsCallback();
    assert.equal(question.isOtherSelected, false, "There shuld not be other#2");
    assert.equal(question.value, "CA", "'CA' value is still here");
  }
);

QUnit.test("preset data and same data from url", function (assert) {
  var survey = new SurveyModel();
  var counter = 0;
  survey.addNewPage("1");
  var question = new QuestionDropdownModelTester("q1");
  survey.storeOthersAsComment = false;

  survey.onValueChanging.add(function () {
    counter++;
  });

  survey.onValueChanged.add(function () {
    counter++;
  });

  question.choicesByUrl.url = "{state}";
  survey.pages[0].addQuestion(question);
  survey.data = { q1: "CA" };
  question["onLoadChoicesFromUrl"]([new ItemValue("CA"), new ItemValue("AA")]);

  assert.equal(counter, 0, "value doesn't change");
});

QUnit.test(
  "defaultValue for radiogroup where value is object for choices by url, bug: https://surveyjs.answerdesk.io/ticket/details/T2055",
  function (assert) {
    var json = {
      pages: [
        {
          name: "page1",
          elements: [
            {
              type: "radiogroup",
              name: "test",
              defaultValue: {
                id: 1023,
              },
              choicesByUrl: {
                url: "",
                valueName: "identity",
                titleName: "localizedData.id",
              },
            },
          ],
        },
      ],
    };
    var survey = new SurveyModel(json);
    var question = <QuestionRadiogroupModel>survey.getQuestionByName("test");
    var loadedItems = [
      { identity: { id: 1021 }, localizedData: { id: "A1" } },
      { identity: { id: 1022 }, localizedData: { id: "A2" } },
      { identity: { id: 1023 }, localizedData: { id: "A3" } },
      { identity: { id: 1024 }, localizedData: { id: "A4" } },
    ].map((i) => new ItemValue(i.identity, i.localizedData.id));
    question["onLoadChoicesFromUrl"](loadedItems);
    assert.equal(
      question.value,
      question["activeChoices"][2].value,
      "Chosen exactly choice item value"
    );
    survey.doComplete();
    assert.deepEqual(
      question.value,
      {
        id: 1023,
      },
      "Initial value is set correctly"
    );
    assert.deepEqual(
      survey.data,
      {
        test: {
          id: 1023,
        },
      },
      "Initial value is set correctly"
    );
  }
);

QUnit.test(
  "valueChanged shouldn't be risen on choicesByUrl loaded - T3372 - onValueChanging (bug)",
  function (assert) {
    var json = {
      pages: [
        {
          name: "page1",
          elements: [
            {
              type: "dropdown",
              name: "test",
              defaultValue: "A",
              choicesByUrl: {
                url: "",
                valueName: "identity",
                titleName: "localizedData.id",
              },
            },
          ],
        },
      ],
    };
    var survey = new SurveyModel(json);
    var question = <QuestionRadiogroupModel>survey.getQuestionByName("test");
    var loadedItems = ["A", "B", "C"].map((i) => new ItemValue(i));

    var changedCount = 0;
    survey.onValueChanging.add(() => {
      changedCount++;
    });

    question["onLoadChoicesFromUrl"](loadedItems);
    assert.equal(changedCount, 0, "No changed events has been risen");
  }
);

QUnit.test(
  "Set value before loading data where value is a complex value, bug https://surveyjs.answerdesk.io/ticket/details/T2055",
  function (assert) {
    var survey = new SurveyModel();
    survey.addNewPage("1");
    var question = new QuestionDropdownModelTester("q1");
    question.hasItemsCallbackDelay = true;
    question.choicesByUrl.url = "something";
    question.choicesByUrl.valueName = "identity";
    question.restFullTest.items = [
      { identity: { id: 1021 }, localizedData: { id: "A1" } },
      { identity: { id: 1022 }, localizedData: { id: "A2" } },
      { identity: { id: 1023 }, localizedData: { id: "A3" } },
      { identity: { id: 1024 }, localizedData: { id: "A4" } },
    ];
    survey.pages[0].addQuestion(question);
    question.onSurveyLoad();
    survey.setValue("q1", {
      id: 1023,
    });
    question.doResultsCallback();
    assert.equal(question.visibleChoices.length, 4, "Loaded Correctly");
    assert.deepEqual(
      question.value,
      {
        id: 1023,
      },
      "Complex value set correctly"
    );
  }
);

QUnit.test(
  "Set value before loading data where value is a complex value, bug https://surveyjs.answerdesk.io/ticket/details/T2350",
  function (assert) {
    var survey = new SurveyModel();
    survey.addNewPage("1");
    var question = new QuestionCheckboxModelTester("q1");
    question.hasItemsCallbackDelay = true;
    question.choicesByUrl.url = "something";
    question.choicesByUrl.valueName = "identity";
    question.restFullTest.items = [
      { identity: { id: 1021 }, localizedData: { id: "A1" } },
      { identity: { id: 1022 }, localizedData: { id: "A2" } },
      { identity: { id: 1023 }, localizedData: { id: "A3" } },
      { identity: { id: 1024 }, localizedData: { id: "A4" } },
    ];
    survey.pages[0].addQuestion(question);
    question.onSurveyLoad();
    question.doResultsCallback();
    assert.equal(question.choices.length, 0, "choices are empty");
    assert.equal(question.visibleChoices.length, 4, "Loaded Correctly");
    survey.setValue("q1", [{ id: 1023 }]);
    assert.ok(
      question.value[0] === question["activeChoices"][2].value,
      "Chosen exactly choice item value"
    );
    survey.doComplete();
    assert.deepEqual(
      question.value,
      [{ id: 1023 }],
      "Complex value set correctly"
    );
  }
);

QUnit.test("Do not run conditions on resetting the value", function (assert) {
  var survey = new SurveyModel();
  survey.addNewPage("1");
  var question = new QuestionCheckboxModelTester("q1");
  question.hasItemsCallbackDelay = true;
  question.choicesByUrl.url = "something";
  question.choicesByUrl.valueName = "identity";
  question.restFullTest.items = [{ identity: 1 }, { identity: 2 }];
  survey.pages[0].addQuestion(question);
  survey.addNewPage("2");
  survey.pages[1].addNewQuestion("text", "q2");
  survey.pages[1].questions[0].visibleIf = "{q1} notempty";
  question.onSurveyLoad();
  question.value = [1];
  survey.currentPageNo = 1;
  assert.equal(survey.currentPageNo, 1, "The current page is second now");
  question.doResultsCallback();
  assert.deepEqual(question.value, [1], "Value is still here");
  assert.equal(survey.currentPageNo, 1, "The current page doesn't chagned");
});

QUnit.test("Use values and not text, Bug #627", function (assert) {
  var survey = new SurveyModel();
  survey.addNewPage("1");
  var question = new QuestionDropdownModelTester("q1");
  survey.pages[0].addQuestion(question);
  var stateQuestion = <QuestionDropdownModel>(
    survey.pages[0].addNewQuestion("dropdown", "state")
  );
  stateQuestion.choices = [
    { value: "ca_cities", text: "City from California" },
    { value: "tx_cities", text: "City from Texas" },
  ];
  question.choicesByUrl.url = "{state}";
  question.onSurveyLoad();
  assert.equal(question.visibleChoices.length, 0, "It is empty");
  stateQuestion.value = "ca_cities";
  assert.equal(question.visibleChoices.length, 2, "We have two cities now, CA");
  stateQuestion.value = "tx_cities";
  assert.equal(
    question.visibleChoices.length,
    3,
    "We have three cities now, TX"
  );
  stateQuestion.value = "";
  assert.equal(question.visibleChoices.length, 0, "It is empty again");
});

QUnit.test("Process text in url as case insensitive, Bug #997", function (
  assert
) {
  var survey = new SurveyModel();
  survey.addNewPage("1");
  var question = new QuestionDropdownModelTester("q1");
  survey.pages[0].addQuestion(question);
  var stateQuestion = <QuestionDropdownModel>(
    survey.pages[0].addNewQuestion("dropdown", "State")
  );
  stateQuestion.choices = [
    { value: "ca_cities", text: "City from California" },
    { value: "tx_cities", text: "City from Texas" },
  ];
  question.choicesByUrl.url = "{state}";
  question.onSurveyLoad();
  assert.equal(question.visibleChoices.length, 0, "It is empty");
  stateQuestion.value = "ca_cities";
  assert.equal(question.visibleChoices.length, 2, "We have two cities now, CA");
  stateQuestion.value = "tx_cities";
  assert.equal(
    question.visibleChoices.length,
    3,
    "We have three cities now, TX"
  );
  stateQuestion.value = "";
  assert.equal(question.visibleChoices.length, 0, "It is empty again");
});

QUnit.test("Process text in url with default text, bug#1000", function (
  assert
) {
  var json = {
    elements: [
      {
        type: "dropdownrestfulltester",
        name: "q1",
        choicesByUrl: { url: "{state}" },
        defaultValue: "Los Angeles",
      },
      {
        type: "text",
        name: "state",
        defaultValue: "ca_cities",
      },
    ],
  };
  var survey = new SurveyModel(json);
  var question = <QuestionDropdownModelTester>survey.getQuestionByName("q1");
  assert.equal(
    question.visibleChoices.length,
    2,
    "We have two cities on loading survey, CA"
  );
  assert.equal(
    question.value,
    "Los Angeles",
    "The value is set correctly from defaultValue"
  );
});

QUnit.test("Cascad dropdown in matrix dynamic", function (assert) {
  var survey = new SurveyModel();
  survey.addNewPage("1");
  var question = new QuestionMatrixDynamicModelTester("q1");
  question.rowCount = 2;
  question.addColumn("state");
  var dropdownColumn = question.addColumn("city");
  dropdownColumn["choicesByUrl"].url = "{row.state}";
  survey.pages[0].addQuestion(question);
  question.onSurveyLoad();
  var rows = question.visibleRows;
  var cellDropdown = <QuestionDropdownModel>rows[0].cells[1].question;
  assert.equal(cellDropdown.visibleChoices.length, 0, "It is empty");
  rows[0].cells[0].question.value = "ca_cities";
  assert.equal(
    cellDropdown.visibleChoices.length,
    2,
    "We have two cities now, CA"
  );
  rows[0].cells[0].question.value = "tx_cities";
  assert.equal(
    cellDropdown.visibleChoices.length,
    3,
    "We have three cities now, TX"
  );
  rows[0].cells[0].question.value = "";
  assert.equal(cellDropdown.visibleChoices.length, 0, "It is empty again");
});

QUnit.test("Cascad dropdown in panel dynamic", function (assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("1");
  var question = new QuestionPanelDynamicModel("panel");
  question.template.addNewQuestion("text", "state");
  var dropDown = new QuestionDropdownModelTester("q1");
  dropDown.choicesByUrl.url = "{panel.state}";
  question.template.addQuestion(dropDown);
  page.addElement(question);
  question.panelCount = 1;

  var qState = <Question>question.panels[0].questions[0];
  var qCity = <QuestionDropdownModelTester>question.panels[0].questions[1];

  assert.equal(qCity.visibleChoices.length, 0, "It is empty");
  qState.value = "ca_cities";
  assert.equal(qCity.visibleChoices.length, 2, "We have two cities now, CA");
  qState.value = "tx_cities";
  assert.equal(qCity.visibleChoices.length, 3, "We have three cities now, TX");
  qState.value = "";
  assert.equal(qCity.visibleChoices.length, 0, "It is empty again");
});

QUnit.test(
  "Question in panel dynamic where url is depend on value outside panel, bug#1064",
  function (assert) {
    var survey = new SurveyModel();
    var page = survey.addNewPage("1");
    page.addNewQuestion("text", "state");
    var question = new QuestionPanelDynamicModel("panel");
    var dropDown = new QuestionDropdownModelTester("q1");
    dropDown.choicesByUrl.url = "{state}";
    question.template.addQuestion(dropDown);
    page.addElement(question);
    question.panelCount = 1;

    var qCity = <QuestionDropdownModelTester>question.panels[0].questions[0];

    assert.equal(qCity.visibleChoices.length, 0, "It is empty");
    survey.setValue("state", "ca_cities");
    assert.equal(qCity.visibleChoices.length, 2, "We have two cities now, CA");
    survey.setValue("state", "tx_cities");
    assert.equal(
      qCity.visibleChoices.length,
      3,
      "We have three cities now, TX"
    );
    survey.clearValue("state");
    assert.equal(qCity.visibleChoices.length, 0, "It is empty again");
  }
);

QUnit.test("Use complex variable, bug#T2705", function (assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("1");
  var dropDown = new QuestionDropdownModelTester("q1");
  dropDown.choicesByUrl.url = "{obj.state}";
  page.addQuestion(dropDown);

  assert.equal(dropDown.visibleChoices.length, 0, "It is empty");
  survey.setVariable("obj", { state: "ca_cities" });
  assert.equal(dropDown.visibleChoices.length, 2, "We have two cities now, CA");
  survey.setVariable("obj", { state: "tx_cities" });
  assert.equal(
    dropDown.visibleChoices.length,
    3,
    "We have three cities now, TX"
  );
  survey.setVariable("obj", null);
  assert.equal(dropDown.visibleChoices.length, 0, "It is empty again");
});

QUnit.test(
  "Question in panel dynamic where url is depend on value outside panel, bug#1089",
  function (assert) {
    var survey = new SurveyModel();
    var page = survey.addNewPage("1");
    var dropDown = new QuestionDropdownModelTester("q1");
    dropDown.choicesByUrl.url = "{state}";
    page.addQuestion(dropDown);
    assert.equal(dropDown.visibleChoices.length, 0, "It is empty");
    survey.data = { state: "ca_cities" };
    assert.equal(
      dropDown.visibleChoices.length,
      2,
      "We have two cities now, CA"
    );
  }
);

QUnit.test("Load countries, custom properties, #615", function (assert) {
  var test = new ChoicesRestfullTester();
  test.noCaching = true;
  var items = [];
  Serializer.addProperty("itemvalue", "alpha2_code");
  test.getResultCallback = function (res: Array<ItemValue>) {
    items = res;
  };
  test.url = "allcountries";
  test.path = "RestResponse;result";
  test.run();
  assert.equal(items.length, 5, "there are 5 countries");
  assert.equal(items[0]["alpha2_code"], "AF", "the first alpha2_code is AF");
  assert.equal(items[4]["alpha2_code"], "AS", "the fifth alpha2_code is AS");
  Serializer.removeProperty("itemvalue", "alpha2_code");
});

QUnit.test("Load countries, custom itemvalue class", function (assert) {
  Serializer.addProperty("itemvalue", "alpha3_code");
  Serializer.addProperty("itemvalue", "customProperty");
  var question = <QuestionDropdownImageTester>(
    Serializer.createClass("imagepicker_choicesrest")
  );
  question.choicesByUrl.url = "allcountries";
  question.choicesByUrl.path = "RestResponse;result";
  question.choicesByUrl["customPropertyName"] = "alpha2_code";
  question.onSurveyLoad();
  assert.equal(question.choices.length, 0, "Choices do not used");
  assert.equal(question.visibleChoices.length, 5, "There are 5 countries now");
  assert.equal(
    question.visibleChoices[0]["alpha3_code"],
    "AFG",
    "Custom property is set"
  );
  assert.equal(
    question.visibleChoices[0]["customProperty"],
    "AF",
    "Custom property is set via propertyName is set"
  );
  Serializer.removeProperty("itemvalue", "customProperty");
  Serializer.removeProperty("itemvalue", "alpha3_code");
});

QUnit.test(
  "choicesByUrl + custom itemvalue class, save/load to/from json",
  function (assert) {
    var question = <QuestionDropdownImageTester>(
      Serializer.createClass("imagepicker_choicesrest")
    );
    question.choicesByUrl.url = "allcountries";
    question.choicesByUrl.path = "RestResponse;result";
    question.choicesByUrl["customPropertyName"] = "alpha2_code";
    question.name = "q";
    var savedJson = new JsonObject().toJsonObject(question);
    var json = {
      name: "q",
      choicesByUrl: {
        url: "allcountries",
        path: "RestResponse;result",
        customPropertyName: "alpha2_code",
      },
    };
    assert.deepEqual(
      savedJson,
      json,
      "choicesByUrl + custom itemvalue class restore correctly"
    );

    var loadedQuestion = <QuestionDropdownImageTester>(
      Serializer.createClass("imagepicker_choicesrest")
    );
    new JsonObject().toObject(json, loadedQuestion);
    assert.equal(
      loadedQuestion.choicesByUrl["customPropertyName"],
      "alpha2_code",
      "Restore customproperty correctly from json"
    );
  }
);

QUnit.test(
  "choicesByUrl + clear value if it doesn't exists any more, #1",
  function (assert) {
    var question = new QuestionDropdownModelTester("q1");
    question.value = "Algeria";
    question.choicesByUrl.url = "allcountries";
    question.choicesByUrl.path = "RestResponse;result";
    question.onSurveyLoad();
    assert.equal(
      question.value,
      "Algeria",
      "Value should not be changed, before choices were empty and value exists"
    );
    question.value = "Algeria1";
    question.onSurveyLoad();
    assert.equal(
      question.value,
      "Algeria1",
      "Value should not be changed, the value doesn't exists in choices before as well"
    );
  }
);

QUnit.test(
  "choicesByUrl + clear value if it doesn't exists any more, #2",
  function (assert) {
    var question = new QuestionDropdownModelTester("q1");
    question.choices = ["USA", "UK"];
    question.value = "UK";
    question.choicesByUrl.url = "allcountries";
    question.choicesByUrl.path = "RestResponse;result";
    question.onSurveyLoad();
    assert.notOk(
      question.value,
      "Value is empty, it existed before and it doesn't exists now"
    );
  }
);

QUnit.test(
  "choicesByUrl + checkbox + clear value if it doesn't exists any more",
  function (assert) {
    var question = new QuestionCheckboxModelTester("q1");
    question.choices = ["USA", "UK"];
    question.value = ["UK", "Algeria", "UnknownCountry"];
    question.choicesByUrl.url = "allcountries";
    question.choicesByUrl.path = "RestResponse;result";
    question.onSurveyLoad();
    assert.deepEqual(
      question.value,
      ["Algeria", "UnknownCountry"],
      "Remove 'UK' and leave the value that exists in the new or doesn't exists in the old"
    );
  }
);

QUnit.test("choicesByUrl + isReady", function (assert) {
  var question = new QuestionDropdownModelTester("q1");
  question.value = "Algeria";
  question.choicesByUrl.url = "allcountries";
  question.choicesByUrl.path = "RestResponse;result";
  question.onSurveyLoad();
  assert.equal(
    question.isReady,
    true,
    "IsReady should be true after load survey"
  );
});

function getCACities() {
  return ["Los Angeles", "San Francisco"];
}
function getTXCities() {
  return ["Houston", "San Antonio", "Dallas"];
}

function getCountries(): any {
  return {
    RestResponse: {
      messages: [
        "More webservices are available at http://www.groupkt.com/post/f2129b88/services.htm",
        "Total [249] records found.",
      ],
      result: [
        {
          name: "Afghanistan",
          locName: { en: "Afghanistan" },
          alpha2_code: "AF",
          alpha3_code: "AFG",
        },
        {
          name: "Åland Islands",
          locName: { en: "Åland Islands" },
          alpha2_code: "AX",
          alpha3_code: "ALA",
        },
        {
          name: "Albania",
          locName: { en: "Albania" },
          alpha2_code: "AL",
          alpha3_code: "ALB",
        },
        {
          name: "Algeria",
          locName: { en: "Algeria" },
          alpha2_code: "DZ",
          alpha3_code: "DZA",
        },
        {
          name: "American Samoa",
          locName: { en: "American Samoa" },
          alpha2_code: "AS",
          alpha3_code: "ASM",
        },
      ],
    },
  };
}

function getTextResponse(): any {
  return `
  1
  2
  3
  4
  Optimizes Work Processes
  `;
}

function getXmlResponse(): any {
  return `<?xml version="1.0" standalone="yes"?>
  <NSurveyDataSource xmlns="http://www.nsurvey.org/NSurveyDataSource.xsd">
    <XmlDataSource>
      <XmlAnswers>
        <XmlAnswer>
          <AnswerValue></AnswerValue>
          <AnswerDescription>[Select Competencies]</AnswerDescription>
        </XmlAnswer>
        <XmlAnswer>
          <AnswerValue>1</AnswerValue>
          <AnswerDescription>Decision Quality</AnswerDescription>
        </XmlAnswer>
        <XmlAnswer>
          <AnswerValue>2</AnswerValue>
          <AnswerDescription>Customer Focus</AnswerDescription>
        </XmlAnswer>
        <XmlAnswer>
          <AnswerValue>3</AnswerValue>
          <AnswerDescription>Situational Agility</AnswerDescription>
        </XmlAnswer>
        <XmlAnswer>
          <AnswerValue>4</AnswerValue>
          <AnswerDescription>Communication Effectively</AnswerDescription>
        </XmlAnswer>
        <XmlAnswer>
          <AnswerValue>5</AnswerValue>
          <AnswerDescription>Optimizes Work Processes</AnswerDescription>
        </XmlAnswer>
      </XmlAnswers>
    </XmlDataSource>
  </NSurveyDataSource>`;
}
