import { Base, ArrayChanges } from "../src/base";
import { IQuestion, ITextProcessor, ITextProcessorProp, ITextProcessorResult } from "../src/base-interfaces";
import { SurveyModel } from "../src/survey";
import { Question } from "../src/question";
import { ChoicesRestful } from "../src/choicesRestful";
import { QuestionDropdownModel } from "../src/question_dropdown";
import { QuestionCheckboxModel } from "../src/question_checkbox";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import { QuestionPanelDynamicModel } from "../src/question_paneldynamic";
import { MatrixDropdownRowModelBase } from "../src/question_matrixdropdownbase";
import { ItemValue } from "../src/itemvalue";
import { JsonObject, Serializer } from "../src/jsonobject";
import { QuestionRadiogroupModel } from "../src/question_radiogroup";
import { settings } from "../src/settings";
import { MatrixDropdownColumn } from "../src/question_matrixdropdowncolumn";
import { SurveyError } from "../src/survey-error";
import {
  QuestionCustomModel,
  QuestionCompositeModel,
  ComponentCollection,
} from "../src/question_custom";
import { ListModel } from "../src/list";
import { ChoiceItem } from "../src/question_baseselect";

import { describe, test, expect } from "vitest";
describe("choicesRestful", () => {
  class ChoicesRestfulTester extends ChoicesRestful {
    private delaySentRequestValue: boolean = false;
    public static doNotSendRequest = false;
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
    public isRequestRunning: boolean;
    public getIsRunning(): boolean {
      if (this.isRequestRunning !== undefined) return this.isRequestRunning;
      return super.getIsRunning();
    }
    public blockSendingRequest: boolean = ChoicesRestfulTester.doNotSendRequest;
    public unblockSendRequest() {
      this.blockSendingRequest = undefined;
      this.sendRequest();
    }
    protected sendRequest() {
      this.beforeSendRequest();
      if (this.blockSendingRequest === true) return;
      this.sentRequestCounter++;
      this.lastProcesedUrl = this.processedUrl;
      if (this.processedUrl.indexOf("empty") > -1)this.onLoad([]);
      if (this.processedUrl.indexOf("countries") > -1) {
        this.onLoad(getCountries());
      }
      if (this.processedUrl.indexOf("localizedstrings") > -1) {
        this.onLoad(getLocalized());
      }
      if (!!this.items) {
        this.onLoad(this.items);
        return;
      }
      if (this.processedUrl.indexOf("ca_cities") > -1)this.onLoad(getCACities());
      if (this.processedUrl.indexOf("tx_cities") > -1)this.onLoad(getTXCities());
      if (this.processedUrl.indexOf("xml") > -1)
        this.onLoad(this.parseResponse(getXmlResponse()));
      if (this.processedUrl.indexOf("text") > -1)
        this.onLoad(this.parseResponse(getTextResponse()));
    }
    public doLoad(result: Array<any>) {
      this.onLoad(result);
    }
    protected onLoad(result: any, loadingObjHash: string = null) {
      this.beforeLoadRequest();
      super.onLoad(result, loadingObjHash);
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
      return this.processTextEx({ text: text, doEncoding: true }).text;
    }
    processTextEx(params: ITextProcessorProp): ITextProcessorResult {
      return { text: params.text, hasAllValuesOnLastRun: true };
    }
  }

  class QuestionDropdownModelTester extends QuestionDropdownModel {
    oldGetResultCallback: any;
    public loadingFromChoicesCounter: number = 0;
    constructor(name: string) {
      super(name);
      this.oldGetResultCallback = this.choicesByUrl.getResultCallback;
      var self = this;
      this.choicesByUrl.getResultCallback = function(items: Array<ItemValue>) {
        self.newGetResultCallback(items);
      };
    }
    public getType(): string {
      return "dropdownrestfultester";
    }
    public get restFulTest(): ChoicesRestfulTester {
      return <ChoicesRestfulTester>this.choicesByUrl;
    }
    protected createRestful(): ChoicesRestful {
      var res = new ChoicesRestfulTester();
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
      if (!this.processor)this.processor = new TextProcessorTester();
      return this.processor;
    }
  }

  class QuestionCheckboxModelTester extends QuestionCheckboxModel {
    oldGetResultCallback: any;
    constructor(name: string) {
      super(name);
      this.oldGetResultCallback = this.choicesByUrl.getResultCallback;
      var self = this;
      this.choicesByUrl.getResultCallback = function(items: Array<ItemValue>) {
        self.newGetResultCallback(items);
      };
    }
    public getType(): string {
      return "dropdownrestfultester";
    }
    public get restFulTest(): ChoicesRestfulTester {
      return <ChoicesRestfulTester>this.choicesByUrl;
    }
    protected createRestful(): ChoicesRestful {
      var res = new ChoicesRestfulTester();
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
      if (!this.processor)this.processor = new TextProcessorTester();
      return this.processor;
    }
  }

  Serializer.addClass(
    "dropdownrestfultester",
    [],
    function() {
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
      if (column.cellType == "dropdown") {
        var newQuestion = new QuestionDropdownModelTester(this.name);
        newQuestion.hasItemsCallbackDelay = true;
        var json = column.templateQuestion.toJSON();
        new JsonObject().toObject(json, newQuestion);
        newQuestion.setSurveyImpl(row);
        return newQuestion;
      }
      return super.createQuestionCore(row, column);
    }

    processor: ITextProcessor;
    protected get textProcessor(): ITextProcessor {
      if (!this.processor)this.processor = new TextProcessorTester();
      return this.processor;
    }
  }

  class QuestionDropdownImageTester extends QuestionDropdownModel {
    constructor(name: string) {
      super(name);
    }
    protected createRestful(): ChoicesRestful {
      var res = new ChoicesRestfulTester();
      res.noCaching = true;
      return res;
    }
    public getType(): string {
      return "dropdown_image";
    }
    processor: ITextProcessor;
    protected get textProcessor(): ITextProcessor {
      if (!this.processor)this.processor = new TextProcessorTester();
      return this.processor;
    }
  }

  Serializer.addClass(
    "dropdown_image",
    [],
    function() {
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
        onGetValue: function(obj) {
          return ItemValue.getData(obj.choices);
        },
        onSetValue: function(obj, value) {
          obj.choices = value;
        },
      },
    ],
    null,
    "dropdown_image"
  );

  test("Load countries", () => {
    var test = new ChoicesRestfulTester();
    var items = [];
    test.getResultCallback = function(res: Array<ItemValue>) {
      items = res;
    };
    test.url = "allcountries";
    test.path = "RestResponse;result";
    test.run();
    expect(items.length, "there are 5 countries").toBe(5);
    expect(items[0].value, "the first country is Afghanistan").toBe("Afghanistan");
    expect(items[4].value, "the fifth country is American Samoa").toBe("American Samoa");
  });

  test("Load countries, support dot '.' as path separator", () => {
    var test = new ChoicesRestfulTester();
    var items: Array<ItemValue> = [];
    test.getResultCallback = function (res: Array<ItemValue>) {
      items = res;
    };
    test.url = "allcountries";
    test.path = "RestResponse.result";
    test.run();
    expect(items.length, "there are 5 countries").toBe(5);
    expect(items[0].value, "the first country is Afghanistan").toBe("Afghanistan");
    expect(items[4].value, "the fifth country is American Samoa").toBe("American Samoa");
  });

  test("Check isRunning for restfull class that wait request from another restfull class, Bug#3039", () => {
    ChoicesRestful.clearCache();
    var test = new ChoicesRestfulTester();
    var items = [];
    test.getResultCallback = function(res: Array<ItemValue>) {
      items = res;
    };
    test.blockSendingRequest = true;
    test.url = "allcountries";
    test.path = "RestResponse;result";
    test.run();
    expect(test.isRunning, "We are running").toBe(true);
    var test2 = new ChoicesRestfulTester();
    test2.getResultCallback = function(res: Array<ItemValue>) {
      items = res;
    };
    test2.url = "allcountries";
    test2.path = "RestResponse;result";
    test2.run();
    expect(test2.isRunning, "We are running, test2").toBe(true);
    test.unblockSendRequest();
    expect(test.isRunning, "We are done").toBe(false);
    expect(test2.isRunning, "We are done, test2").toBe(false);
    ChoicesRestful.clearCache();
  });

  test("attachData", () => {
    var test = new ChoicesRestfulTester();
    var items: Array<ItemValue> = [];
    test.getResultCallback = function(res: Array<ItemValue>) {
      items = res;
    };
    test.noCaching = true;
    test.url = "allcountries";
    test.path = "RestResponse;result";
    test.attachData = true;
    test.run();
    expect(items.length, "there are 5 countries").toBe(5);
    expect(items[0].value, "the first country is Afghanistan").toBe("Afghanistan");
    const originalItem = {
      name: "Afghanistan",
      locName: { en: "Afghanistan" },
      alpha2_code: "AF",
      alpha3_code: "AFG",
    };
    expect(items[0].originalItem, "keeps the original item").toEqualValues(originalItem);
    expect(items[0].data, "keeps the original item").toEqualValues(originalItem);
  });

  test("attachData in question", () => {
    var question = new QuestionDropdownModelTester("q1");
    question.fromJSON({
      choicesByUrl: {
        url: "allcountries",
        path: "RestResponse;result",
        attachData: true,
      },
    });
    question.onSurveyLoad();
    expect(question.visibleChoices.length, "Choices has been loaded").toBe(5);
    const originalItem = {
      name: "Afghanistan",
      locName: { en: "Afghanistan" },
      alpha2_code: "AF",
      alpha3_code: "AFG",
    };
    expect(question.visibleChoices[0].originalItem, "keeps the original item").toEqualValues(originalItem);
    expect(question.visibleChoices[0].data, "keeps the original item").toEqualValues(originalItem);
  });

  test("attachData in question", () => {
    var question = new QuestionDropdownModelTester("q1");
    question.fromJSON({
      choicesByUrl: {
        url: "allcountries",
        path: "RestResponse;result",
        attachData: true,
      },
    });
    question.onSurveyLoad();
    expect(question.visibleChoices.length, "Choices has been loaded").toBe(5);
    const originalItem = {
      name: "Afghanistan",
      locName: { en: "Afghanistan" },
      alpha2_code: "AF",
      alpha3_code: "AFG",
    };
    expect(question.visibleChoices[0].originalItem, "keeps the original item").toEqualValues(originalItem);
    expect(question.visibleChoices[0].data, "keeps the original item").toEqualValues(originalItem);
  });

  test("Load attachData value from JSON", () => {
    var test = new ChoicesRestful();
    expect(test.attachData, "attachData initially false").toBeFalsy();
    test.fromJSON({
      url: "allcountries",
      path: "RestResponse;result",
      attachData: true,
    });
    expect(test.attachData, "attachData has been loaded").toBeTruthy();

    var question = new QuestionDropdownModel("q1");
    expect(question.choicesByUrl.attachData, "question: attachData initially false").toBeFalsy();
    question.fromJSON({
      choicesByUrl: {
        url: "allcountries",
        path: "RestResponse;result",
        attachData: true,
      },
    });
    expect(question.choicesByUrl.url, "question: url has been loaded").toBe("allcountries");
    expect(question.choicesByUrl.attachData, "question: attachData has been loaded").toBeTruthy();
  });

  test("Load attachData value from JSON", () => {
    var test = new ChoicesRestful();
    expect(test.attachData, "attachData initially false").toBeFalsy();
    expect(test.attachOriginalItems, "attachOriginalItems initially false").toBeFalsy();
    test.fromJSON({
      url: "allcountries",
      path: "RestResponse;result",
      attachData: true,
    });
    expect(test.attachData, "attachData has been loaded").toBeTruthy();
    expect(test.attachOriginalItems, "attachOriginalItems has been loaded").toBeTruthy();

    var question = new QuestionDropdownModel("q1");
    expect(question.choicesByUrl.attachData, "question: attachData initially false").toBeFalsy();
    expect(question.choicesByUrl.attachOriginalItems, "question: attachOriginalItems initially false").toBeFalsy();
    question.fromJSON({
      choicesByUrl: {
        url: "allcountries",
        path: "RestResponse;result",
        attachData: true,
      },
    });
    expect(question.choicesByUrl.url, "question: url has been loaded").toBe("allcountries");
    expect(question.choicesByUrl.attachData, "question: attachData has been loaded").toBeTruthy();
    expect(question.choicesByUrl.attachOriginalItems, "question: attachOriginalItems has been loaded").toBeTruthy();
  });

  test("Do not run same request several times at the same time. Wait for the first one", () => {
    ChoicesRestful.clearCache();
    var test1 = new ChoicesRestfulTester();
    var test2 = new ChoicesRestfulTester();
    var items1 = [],
      items2 = [];
    test1.getResultCallback = function(res: Array<ItemValue>) {
      items1 = res;
    };
    test2.getResultCallback = function(res: Array<ItemValue>) {
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

    expect(items1.length, "there are 5 countries in items1").toBe(5);
    expect(items2.length, "there are 5 countries in items2").toBe(5);
    expect(test1.sentRequestCounter, "test1 send request one time").toBe(1);
    expect(test2.sentRequestCounter, "test2 use requests").toBe(0);
  });

  test("encode parameters", () => {
    var survey = new SurveyModel();
    survey.setValue("q1", "R&D");
    var test = new ChoicesRestfulTester();
    test.url = "TestUrl/{q1}";
    test.getResultCallback = function(res: Array<ItemValue>) {};
    test.run(survey);
    expect(test.testProcessedUrl, "Encode the string").toBe("TestUrl/R%26D");
    settings.webserviceEncodeParameters = false;
    test.run(survey);
    expect(test.testProcessedUrl, "stop encoding").toBe("TestUrl/R&D");
    settings.webserviceEncodeParameters = true;
  });

  test("Process text in event", () => {
    var survey = new SurveyModel();
    survey.onProcessDynamicText.add(function (sender, options) {
      if (options.name == "q1") {
        options.value = "R&D";
      //options.isExists = true;
      }
    });
    var test = new ChoicesRestfulTester();
    test.url = "TestUrl/{q1}";
    test.getResultCallback = function(res: Array<ItemValue>) {};
    test.run(survey);
    expect(test.testProcessedUrl).toBe("TestUrl/R%26D");
  });

  test("Load from plain text", () => {
    var test = new ChoicesRestfulTester();
    var items = [];
    test.getResultCallback = function(res: Array<ItemValue>) {
      items = res;
    };
    test.url = "text";
    test.run();
    expect(items.length, "there are 5 items").toBe(5);
    expect(items[0].value, "the item is empty").toBe("1");
    expect(items[4].calculatedText, "the 5th item text is 'Optimizes Work Processes'").toBe("Optimizes Work Processes");
  });

  test("Load countries, complex valueName property, Issue#459", () => {
    var test = new ChoicesRestfulTester();
    var items = [];
    test.getResultCallback = function(res: Array<ItemValue>) {
      items = res;
    };
    test.url = "allcountries";
    test.path = "RestResponse;result";
    test.valueName = "locName.en";
    test.run();
    expect(items.length, "there are 5 countries").toBe(5);
    expect(items[0].value, "the first country is Afghanistan").toBe("Afghanistan");
    expect(items[4].value, "the fifth country is American Samoa").toBe("American Samoa");
  });

  test("Test dropdown", () => {
    var question = new QuestionDropdownModelTester("q1");
    expect(question.choices.length, "There is no choices by default").toBe(0);
    expect(question.visibleChoices.length, "There is no visible choices by default").toBe(0);
    question.choicesByUrl.url = "allcountries";
    question.choicesByUrl.path = "RestResponse;result";
    question.onSurveyLoad();
    expect(question.choices.length, "Choices do not used").toBe(0);
    expect(question.visibleChoices.length, "There are 5 countries now").toBe(5);
  });
  test("Test dropdown in CreatorV2", () => {
    settings.showDefaultItemsInCreator = false;
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    const page = survey.addNewPage("p1");
    const question = new QuestionDropdownModelTester("q1");
    question.choicesByUrl.url = "allcountries";
    question.choicesByUrl.path = "RestResponse;result";
    expect(question.choices.length, "Choices do not used, #1").toBe(0);
    page.addQuestion(question);
    expect(question.choices.length, "Choices do not used, #2").toBe(0);
    expect(question.visibleChoices.length, "Do not load countries, #2").toBe(0);
    settings.showDefaultItemsInCreator = true;
  });

  test("Do not show error or change the question value if quesiton is readOnly, Bug #1819", () => {
    var question = new QuestionDropdownModelTester("q1");
    question.value = "test";
    question.readOnly = true;

    expect(question.visibleChoices.length, "There is no visible choices by default").toBe(0);
    question.choicesByUrl.url = "empty";
    question.choicesByUrl.path = "RestResponse;result";
    question.onSurveyLoad();
    expect(question.visibleChoices.length, "Get no items").toBe(0);
    expect(question.value, "Value do not changed").toBe("test");
    expect(question.errors.length, "We do not have any errors").toBe(0);
  });

  test("Use variables", () => {
    var survey = new SurveyModel();
    survey.addNewPage("1");
    var question = new QuestionDropdownModelTester("q1");
    survey.pages[0].addQuestion(question);
    var stateQuestion = <Question>survey.pages[0].addNewQuestion("text", "state");
    question.choicesByUrl.url = "{state}";
    question.onSurveyLoad();
    expect(question.visibleChoices.length, "It is empty").toBe(0);
    stateQuestion.value = "ca_cities";
    expect(question.visibleChoices.length, "We have two cities now, CA").toBe(2);
    stateQuestion.value = "tx_cities";
    expect(question.visibleChoices.length, "We have three cities now, TX").toBe(3);
    stateQuestion.value = "";
    expect(question.visibleChoices.length, "It is empty again").toBe(0);
    stateQuestion.value = "tx_cities";
    expect(question.visibleChoices.length, "We have three cities again, TX").toBe(3);
  });

  test("Do not set items with old variable, Bug #2197", () => {
    var survey = new SurveyModel();
    survey.addNewPage("1");
    var question = new QuestionDropdownModelTester("q1");
    survey.pages[0].addQuestion(question);
    var stateQuestion = <Question>survey.pages[0].addNewQuestion("text", "state");
    question.choicesByUrl.url = "{state}";
    question.restFulTest.delaySentRequest = true;
    question.onSurveyLoad();
    expect(question.visibleChoices.length, "It is empty").toBe(0);
    stateQuestion.value = "ca_cities";
    stateQuestion.value = "tx_cities";
    question.restFulTest.delaySentRequest = false;
    expect(question.visibleChoices.length, "We have three cities now, TX").toBe(3);
    expect(question.loadingFromChoicesCounter, "Loaded choices one time + one time empty").toBe(2);
    ChoicesRestful.clearCache();
  });
  test("Load choices from url on changing locale", () => {
    var survey = new SurveyModel();
    survey.addNewPage("1");
    var question = new QuestionDropdownModelTester("q1");
    survey.pages[0].addQuestion(question);
    var stateQuestion = <Question>survey.pages[0].addNewQuestion("text", "state");
    question.choicesByUrl.url = "{state}/{locale}";
    question.onSurveyLoad();
    expect(question.visibleChoices.length, "It is empty").toBe(0);
    stateQuestion.value = "ca_cities";
    expect(question.restFulTest.sentRequestCounter, "Loaded choices one time").toBe(1);
    survey.locale = "de";
    expect(question.restFulTest.sentRequestCounter, "Loaded choices on changing locale").toBe(2);
    survey.locale = "";
    ChoicesRestful.clearCache();
  });
  test("Keep choices on changing locale Bug#10921", () => {
    const survey = new SurveyModel();
    survey.locale = "fr";
    survey.addNewPage("1");
    var question = new QuestionDropdownModelTester("q1");
    question.hasItemsCallbackDelay = true;
    question.choicesByUrl.url = "something";
    question.choicesByUrl.titleName = "text";
    question.restFulTest.items = [
      { value: "A", text: "AAA" },
      { value: "B", text: "BBB" }
    ];
    const page = survey.pages[0];
    page.addQuestion(question);
    question.onSurveyLoad();
    question.doResultsCallback();
    expect(question.visibleChoices.length).toBe(2);
    expect(question.visibleChoices[0].text, "Load choices #1").toBe("AAA");
    expect(question.visibleChoices[0].toJSON(), "Data is correct").toEqualValues({ value: "A", text: "AAA" });
    survey.locale = "de";
    expect(question.visibleChoices.length).toBe(2);
    expect(question.visibleChoices[0].text, "Load choices #2").toBe("AAA");
  });
  /*
test("Clear choices on changing variables", () => {
  var survey = new SurveyModel();
  survey.addNewPage("1");
  var question = new QuestionDropdownModelTester("q1");
  survey.pages[0].addQuestion(question);
  var stateQuestion = <Question>survey.pages[0].addNewQuestion("text", "state");
  question.choicesByUrl.url = "{state}";
  question.onSurveyLoad();
  expect(question.visibleChoices.length, "It is empty").toBe(0);
  stateQuestion.value = "ca_cities";
  expect(question.visibleChoices.length, "We have two cities now, CA").toBe(2);
  question.restFulTest.delaySentRequest = true;
  stateQuestion.value = "tx_cities";
  expect(question.visibleChoices.length, "Clear choices on changing variables").toBe(0);
  question.restFulTest.delaySentRequest = false;
  expect(question.visibleChoices.length, "We have three cities now, TX").toBe(3);
  ChoicesRestful.clearCache();
});
*/

  test("onLoadItemsFromServer event", () => {
    var survey = new SurveyModel();
    survey.addNewPage("1");
    var question = new QuestionDropdownModelTester("q1");
    survey.pages[0].addQuestion(question);
    var stateQuestion = <Question>survey.pages[0].addNewQuestion("text", "state");
    question.choicesByUrl.url = "{state}";

    survey.onChoicesLoaded.add(function (survey, options) {
      if (options.question.name != "q1") return;
      options.question.visible = options.choices.length > 0;
      if (options.choices.length > 1) {
        options.choices.shift();
      }
    });
    question.onSurveyLoad();
    expect(question.visibleChoices.length, "It is empty").toBe(0);
    expect(question.visible, "make it invisible on event").toBe(false);
    stateQuestion.value = "ca_cities";
    expect(question.visibleChoices.length, "We have two cities and we remove on event one, CA").toBe(1);
    expect(question.visible, "make it visible on event").toBe(true);
    stateQuestion.value = "tx_cities";
    expect(question.visibleChoices.length, "We have three cities now and we remove on event one, TX").toBe(2);
    stateQuestion.value = "";
    expect(question.visibleChoices.length, "It is empty again").toBe(0);
    expect(question.visible, "And it is again invisible").toBe(false);
  });

  test("disable/enable on loading items, settings.disableOnGettingChoicesFromWeb", () => {
    settings.disableOnGettingChoicesFromWeb = true;
    var survey = new SurveyModel();
    survey.addNewPage("page1");
    var question = new QuestionDropdownModelTester("q1");
    var isReadOnly = question.isReadOnly;
    expect(isReadOnly, "It is not readOnly by default").toBe(false);
    survey.onChoicesLoaded.add(function (survey, options) {
      isReadOnly = question.isReadOnly;
    });
    question.choicesByUrl.url = "allcountries";
    question.choicesByUrl.path = "RestResponse;result";
    survey.pages[0].addQuestion(question);
    expect(isReadOnly, "It was readOnly").toBe(true);
    expect(question.isReadOnly, "It is not readOnly after getting choices").toBe(false);
    settings.disableOnGettingChoicesFromWeb = false;
  });

  test("Set value before loading data, bug #1089", () => {
    var survey = new SurveyModel();
    survey.addNewPage("1");
    var question = new QuestionDropdownModelTester("q1");
    question.choicesByUrl.url = "{state}";
    survey.pages[0].addQuestion(question);
    question.hasItemsCallbackDelay = true;
    question.onSurveyLoad();
    survey.setValue("q1", "CA");
    question["onLoadChoicesFromUrl"]([new ItemValue("CA")]);
    expect(question.value, "'CA' value is still here").toBe("CA");
    expect(question.selectedItem.value, "selectedItem is correct").toBe("CA");
  });
  test("Set value before loading data + defaultValue", () => {
    const survey = new SurveyModel();
    survey.addNewPage("1");
    const question = new QuestionDropdownModelTester("q1");
    question.defaultValue = "CA";
    question.choicesByUrl.url = "{state}";
    survey.pages[0].addQuestion(question);
    question.hasItemsCallbackDelay = true;
    question.onSurveyLoad();
    question.restFulTest.isRequestRunning = true;
    expect(question.restFulTest.isRunning, "request should be running").toBe(true);
    expect(question.value, "Set default Value").toBe("CA");
    survey.mergeData({ "q1": "TX" });
    question.restFulTest.isRequestRunning = false;
    question["onLoadChoicesFromUrl"]([new ItemValue("CA"), new ItemValue("TX")]);
    expect(question.value, "'TX' value is here").toBe("TX");
    expect(question.selectedItem.value, "selectedItem is correct").toBe("TX");
  });
  test("Clear value on getting empty array, bug #6251", () => {
    var survey = new SurveyModel();
    survey.addNewPage("1");
    var question = new QuestionDropdownModelTester("q1");
    question.choicesByUrl.url = "{state}";
    survey.pages[0].addQuestion(question);
    question.hasItemsCallbackDelay = true;
    question.onSurveyLoad();
    survey.setValue("q1", "CA");
    question.choicesByUrl.error = new SurveyError("Empty request");
    question["onLoadChoicesFromUrl"]([]);
    expect(question.isEmpty(), "value is empty").toBe(true);
    const isSelected = !!question.selectedItem;
    expect(isSelected, "selectedItem is null").toBe(false);
    expect(question.errors.length, "It shows error on empty result").toBe(1);
  });
  test("Do not call loadedChoicesFromServer on setting same items", () => {
    var survey = new SurveyModel();
    let counter = 0;
    survey.loadedChoicesFromServer = (question: IQuestion) => {
      counter ++;
    };
    survey.addNewPage("1");
    var question = new QuestionDropdownModelTester("q1");
    question.choicesByUrl.url = "{state}";
    survey.pages[0].addQuestion(question);
    question.hasItemsCallbackDelay = true;
    question.onSurveyLoad();
    question["onLoadChoicesFromUrl"]([]);
    expect(counter, "#1").toBe(1);
    question["onLoadChoicesFromUrl"]([]);
    question["onLoadChoicesFromUrl"]([]);
    expect(counter, "#2").toBe(1);
    question["onLoadChoicesFromUrl"]([new ItemValue("CA"), new ItemValue("TX")]);
    expect(counter, "#3").toBe(2);
    question["onLoadChoicesFromUrl"]([new ItemValue("CA"), new ItemValue("TX")]);
    question["onLoadChoicesFromUrl"]([new ItemValue("CA"), new ItemValue("TX")]);
    expect(counter, "#4").toBe(2);
    question["onLoadChoicesFromUrl"]([]);
    expect(counter, "#5").toBe(3);
    question["onLoadChoicesFromUrl"]([]);
    expect(counter, "#6").toBe(3);
    survey.setValue("q1", "CA");
    question["onLoadChoicesFromUrl"]([]);
    expect(counter, "#7").toBe(4);
  });
  test("Set value before loading data + storeOthersAsComment, bug #1089", () => {
    var survey = new SurveyModel();
    survey.addNewPage("1");
    var question = new QuestionDropdownModelTester("q1");
    survey.storeOthersAsComment = false;
    question.choicesByUrl.url = "{state}";
    survey.pages[0].addQuestion(question);
    question.hasItemsCallbackDelay = true;
    question.onSurveyLoad();
    survey.setValue("q1", "CA");
    expect(question.isOtherSelected, "There shuld not be other#1").toBe(false);
    question["onLoadChoicesFromUrl"]([new ItemValue("CA")]);
    expect(question.isOtherSelected, "There shuld not be other#2").toBe(false);
    expect(question.value, "'CA' value is still here").toBe("CA");
    expect(question.selectedItem.value, "selectedItem is correct").toBe("CA");
  });

  test("preset data and same data from url", () => {
    var survey = new SurveyModel();
    var counter = 0;
    survey.addNewPage("1");
    var question = new QuestionDropdownModelTester("q1");
    survey.storeOthersAsComment = false;
    question.hasItemsCallbackDelay = true;
    question.choicesByUrl.url = "{state}";
    survey.pages[0].addQuestion(question);
    question.onSurveyLoad();
    survey.data = { q1: "CA" };
    survey.onValueChanging.add(function() {
      counter++;
    });
    survey.onValueChanged.add(function() {
      counter++;
    });
    expect(question.value, "value is here").toBe("CA");
    question["onLoadChoicesFromUrl"]([new ItemValue("CA"), new ItemValue("AA")]);
    expect(question.value, "value is still here").toBe("CA");
    expect(question.selectedItem.value, "selecteditem is correct").toBe("CA");
    expect(counter, "value doesn't change").toBe(0);
  });

  test("defaultValue for radiogroup where value is object for choices by url, bug: https://surveyjs.answerdesk.io/ticket/details/T2055", () => {
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
    expect(question.value, "Chosen exactly choice item value").toBe(question["activeChoices"][2].value);
    survey.doComplete();
    expect(question.value, "Initial value is set correctly").toEqualValues({
      id: 1023,
    });
    expect(survey.data, "Initial value is set correctly").toEqualValues({
      test: {
        id: 1023,
      },
    });
  });

  test("Map isExclusive, showCommentArea, isCommentRequired, visibleIf, enableIf property from restful automatically, #10865", () => {
    const test = new ChoicesRestfulTester();
    const question = new QuestionCheckboxModel("q1");
    test.createItemValue = (item: any): ItemValue => {
      const res = new ChoiceItem(item.value, item.text);
      res.locOwner = question;
      return res;
    };
    let choices: Array<ItemValue> = [];
    test.getResultCallback = function(res: Array<ItemValue>) {
      choices = res;
    };
    var loadedItems = [
      { value: 1, text: "A", isExclusive: true, visibleIf: "{q1} notcontains 2" },
      { value: 2, text: "B", showCommentArea: true, isCommentRequired: true },
      { value: 3, text: "C", showCommentArea: true, enableIf: "{q1} contains 2" },
    ];
    test.doLoad(loadedItems);
    expect(choices.length, "There are 3 choices loaded").toBe(3);
    expect(choices[0].getType(), "It is choice item").toBe("choiceitem");
    expect(choices[0].isExclusive, "isExclusive is set correctly [0]").toBeTruthy();
    expect(choices[0].visibleIf, "visibleIf is set correctly [0]").toBe("{q1} notcontains 2");
    expect(choices[0].enableIf, "enableIf is not set [0]").toBeFalsy();
    expect(choices[0].showCommentArea, "showCommentArea is set correctly [0]").toBe(false);
    expect(choices[0].isCommentRequired, "isCommentRequired is set correctly [0]").toBe(false);

    expect(choices[1].isExclusive, "isExclusive is set correctly [1]").toBeFalsy();
    expect(choices[1].showCommentArea, "showCommentArea is set correctly [1]").toBe(true);
    expect(choices[1].isCommentRequired, "isCommentRequired is set correctly [1]").toBe(true);
    expect(choices[1].visibleIf, "visibleIf is not set [1]").toBeFalsy();
    expect(choices[1].enableIf, "enableIf is not set [1]").toBeFalsy();

    expect(choices[2].isExclusive, "isExclusive is set correctly [2]").toBeFalsy();
    expect(choices[2].showCommentArea, "showCommentArea is set correctly [2]").toBe(true);
    expect(choices[2].isCommentRequired, "isCommentRequired is set correctly [2]").toBe(false);
    expect(choices[2].visibleIf, "visibleIf is not set [2]").toBeFalsy();
    expect(choices[2].enableIf, "enableIf is set correctly [2]").toBe("{q1} contains 2");
  });

  test("valueChanged shouldn't be risen on choicesByUrl loaded - T3372 - onValueChanging (bug)", () => {
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
    expect(changedCount, "No changed events has been risen").toBe(0);
  });

  test("Set value before loading data where value is a complex value, bug https://surveyjs.answerdesk.io/ticket/details/T2055", () => {
    var survey = new SurveyModel();
    survey.addNewPage("1");
    var question = new QuestionDropdownModelTester("q1");
    question.hasItemsCallbackDelay = true;
    question.choicesByUrl.url = "something";
    question.choicesByUrl.valueName = "identity";
    question.restFulTest.items = [
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
    expect(question.visibleChoices.length, "Loaded Correctly").toBe(4);
    expect(question.value, "Complex value set correctly").toEqualValues({
      id: 1023,
    });
  });

  test("Set value before loading data where value is a complex value, bug https://surveyjs.answerdesk.io/ticket/details/T2350", () => {
    var survey = new SurveyModel();
    survey.addNewPage("1");
    var question = new QuestionCheckboxModelTester("q1");
    question.hasItemsCallbackDelay = true;
    question.choicesByUrl.url = "something";
    question.choicesByUrl.valueName = "identity";
    question.restFulTest.items = [
      { identity: { id: 1021 }, localizedData: { id: "A1" } },
      { identity: { id: 1022 }, localizedData: { id: "A2" } },
      { identity: { id: 1023 }, localizedData: { id: "A3" } },
      { identity: { id: 1024 }, localizedData: { id: "A4" } },
    ];
    survey.pages[0].addQuestion(question);
    question.onSurveyLoad();
    question.doResultsCallback();
    expect(question.choices.length, "choices are empty").toBe(0);
    expect(question.visibleChoices.length, "Loaded Correctly").toBe(4);
    survey.setValue("q1", [{ id: 1023 }]);
    expect(question.value[0] === question["activeChoices"][2].value, "Chosen exactly choice item value").toBeTruthy();
    survey.doComplete();
    expect(question.value, "Complex value set correctly").toEqualValues([{ id: 1023 }]);
  });

  test("Update display value on loading data", () => {
    const survey = new SurveyModel();
    survey.addNewPage("1");
    const titleQuestion = survey.pages[0].addNewQuestion("text", "q2");
    var question = new QuestionDropdownModelTester("q1");
    question.hasItemsCallbackDelay = true;
    question.choicesByUrl.url = "something";
    question.choicesByUrl.titleName = "text";
    question.restFulTest.items = [
      { value: "A", text: "AAA" },
      { value: "B", text: "BBB" }
    ];
    const page = survey.pages[0];
    page.addQuestion(question);
    page.title = "pagetest:{q1}";
    titleQuestion.title = "test:{q1}";
    question.value = "A";
    question.onSurveyLoad();
    expect(titleQuestion.locTitle.renderedHtml, "Use value, items are not loaded").toBe("test:A");
    var onStrChangedCounter = 0;
    var onPageStrChangedCounter = 0;
    titleQuestion.locTitle.onChanged = () => {
      if (titleQuestion.locTitle.renderedHtml == "test:AAA") {
        onStrChangedCounter ++;
      }
    };
    page.locTitle.onChanged = () => {
      if (page.locTitle.renderedHtml == "pagetest:AAA") {
        onPageStrChangedCounter ++;
      }
    };
    question.doResultsCallback();
    expect(question.visibleChoices.length).toBe(2);
    expect(question.visibleChoices[0].text).toBe("AAA");
    expect(onStrChangedCounter).toBe(1);
    expect(titleQuestion.locTitle.renderedHtml, "Use title, items are loaded").toBe("test:AAA");
    expect(onPageStrChangedCounter, "for page and for navigation").toBe(2);
    expect(page.locTitle.renderedHtml, "Use title, items are loaded, for page").toBe("pagetest:AAA");
    question.value = "B";
    expect(titleQuestion.locTitle.renderedHtml, "Use title, set new value").toBe("test:BBB");
    expect(page.locTitle.renderedHtml, "Use title, set new value, for page").toBe("pagetest:BBB");
  });

  test("Do not run conditions on resetting the value", () => {
    var survey = new SurveyModel();
    survey.addNewPage("1");
    var question = new QuestionCheckboxModelTester("q1");
    question.hasItemsCallbackDelay = true;
    question.choicesByUrl.url = "something";
    question.choicesByUrl.valueName = "identity";
    question.restFulTest.items = [{ identity: 1 }, { identity: 2 }];
    survey.pages[0].addQuestion(question);
    survey.addNewPage("2");
    survey.pages[1].addNewQuestion("text", "q2");
    survey.pages[1].questions[0].visibleIf = "{q1} notempty";
    question.onSurveyLoad();
    question.value = [1];
    survey.currentPageNo = 1;
    expect(survey.currentPageNo, "The current page is second now").toBe(1);
    question.doResultsCallback();
    expect(question.value, "Value is still here").toEqualValues([1]);
    expect(survey.currentPageNo, "The current page doesn't chagned").toBe(1);
  });

  test("Do not set comments on running values", () => {
    var survey = new SurveyModel();
    survey.addNewPage("1");
    var question = new QuestionCheckboxModelTester("q1");
    question.showOtherItem = true;
    question.hasItemsCallbackDelay = true;
    question.choicesByUrl.url = "something";
    question.choicesByUrl.valueName = "id";
    question.restFulTest.items = [{ id: "id1" }, { id: "id2" }, { id: "id3" }];
    survey.pages[0].addQuestion(question);
    question.restFulTest.isRequestRunning = true;
    question.onSurveyLoad();
    expect(question.visibleChoices.length, "Choices are not loaded yet, we have other").toBe(1);
    survey.data = { q1: ["id2", "id3"] };
    question.restFulTest.isRequestRunning = false;
    question.doResultsCallback();
    expect(question.value, "Value is set correctly").toEqualValues(["id2", "id3"]);
    expect(question.comment, "Comment is empty").toBeFalsy();
  });

  test("Set comment on incorrect value", () => {
    var survey = new SurveyModel();
    survey.storeOthersAsComment = false;
    survey.addNewPage("1");
    var question = new QuestionDropdownModelTester("q1");
    question.showOtherItem = true;
    question.hasItemsCallbackDelay = true;
    question.choicesByUrl.url = "something";
    question.choicesByUrl.valueName = "id";
    question.restFulTest.items = [{ id: "id1" }, { id: "id2" }, { id: "id3" }];
    survey.pages[0].addQuestion(question);
    question.restFulTest.isRequestRunning = true;
    question.onSurveyLoad();
    expect(question.visibleChoices.length, "Choices are not loaded yet, we have other").toBe(1);
    survey.data = { q1: "id_unknown" };
    question.restFulTest.isRequestRunning = false;
    question.doResultsCallback();
    expect(question.value, "Value is set correctly").toBe("id_unknown");
    expect(question.comment).toBe("id_unknown");
  });
  test("Set comment on incorrect value and empty results", () => {
    var survey = new SurveyModel();
    survey.storeOthersAsComment = false;
    survey.addNewPage("1");
    var question = new QuestionDropdownModelTester("q1");
    question.showOtherItem = true;
    question.hasItemsCallbackDelay = true;
    question.choicesByUrl.url = "something";
    question.choicesByUrl.valueName = "id";
    question.choicesByUrl.allowEmptyResponse = true;
    question.restFulTest.items = [];
    survey.pages[0].addQuestion(question);
    question.restFulTest.isRequestRunning = true;
    question.onSurveyLoad();
    expect(question.visibleChoices.length, "Choices are not loaded yet, we have other").toBe(1);
    survey.data = { q1: "id_unknown" };
    question.restFulTest.isRequestRunning = false;
    question.doResultsCallback();
    expect(question.value, "Value is set correctly").toBe("id_unknown");
    expect(question.comment).toBe("id_unknown");
  });

  test("Use values and not text, Bug #627", () => {
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
    expect(question.visibleChoices.length, "It is empty").toBe(0);
    stateQuestion.value = "ca_cities";
    expect(question.visibleChoices.length, "We have two cities now, CA").toBe(2);
    stateQuestion.value = "tx_cities";
    expect(question.visibleChoices.length, "We have three cities now, TX").toBe(3);
    stateQuestion.value = "";
    expect(question.visibleChoices.length, "It is empty again").toBe(0);
  });

  test("Process text in url as case insensitive, Bug #997", () => {
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
    expect(question.visibleChoices.length, "It is empty").toBe(0);
    stateQuestion.value = "ca_cities";
    expect(question.visibleChoices.length, "We have two cities now, CA").toBe(2);
    stateQuestion.value = "tx_cities";
    expect(question.visibleChoices.length, "We have three cities now, TX").toBe(3);
    stateQuestion.value = "";
    expect(question.visibleChoices.length, "It is empty again").toBe(0);
  });

  test("Process text in url with default text, bug#1000", () => {
    var json = {
      elements: [
        {
          type: "dropdownrestfultester",
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
    expect(question.visibleChoices.length, "We have two cities on loading survey, CA").toBe(2);
    expect(question.value, "The value is set correctly from defaultValue").toBe("Los Angeles");
  });
  test("Process text in url with default text & showOtherItem, bug#10926", () => {
    ChoicesRestfulTester.doNotSendRequest = true;
    const survey = new SurveyModel({
      elements: [
        {
          type: "dropdownrestfultester",
          name: "q1",
          choicesByUrl: { url: "ca_cities" },
          defaultValue: "Los Angeles",
          showOtherItem: true
        }
      ],
    });
    const question = <QuestionDropdownModelTester>survey.getQuestionByName("q1");
    expect(question.visibleChoices.length, "We have only other item on loading survey").toBe(1);
    (<any>question.choicesByUrl).unblockSendRequest();
    expect(question.value, "The value is set correctly from defaultValue").toBe("Los Angeles");
    expect(question.visibleChoices.length, "We have two cities + other on loading survey, CA").toBe(3);
    ChoicesRestfulTester.doNotSendRequest = false;
  });
  test("Cascad dropdown in matrix dynamic", () => {
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
    expect(cellDropdown.visibleChoices.length, "It is empty").toBe(0);
    rows[0].cells[0].question.value = "ca_cities";
    expect(cellDropdown.visibleChoices.length, "We have two cities now, CA").toBe(2);
    rows[0].cells[0].question.value = "tx_cities";
    expect(cellDropdown.visibleChoices.length, "We have three cities now, TX").toBe(3);
    rows[0].cells[0].question.value = "";
    expect(cellDropdown.visibleChoices.length, "It is empty again").toBe(0);
  });

  test("Cascad dropdown in panel dynamic", () => {
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

    expect(qCity.visibleChoices.length, "It is empty").toBe(0);
    qState.value = "ca_cities";
    expect(qCity.visibleChoices.length, "We have two cities now, CA").toBe(2);
    qState.value = "tx_cities";
    expect(qCity.visibleChoices.length, "We have three cities now, TX").toBe(3);
    qState.value = "";
    expect(qCity.visibleChoices.length, "It is empty again").toBe(0);
  });

  test("Question in panel dynamic where url is depend on value outside panel, bug#1064", () => {
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

    expect(qCity.visibleChoices.length, "It is empty").toBe(0);
    survey.setValue("state", "ca_cities");
    expect(qCity.visibleChoices.length, "We have two cities now, CA").toBe(2);
    survey.setValue("state", "tx_cities");
    expect(qCity.visibleChoices.length, "We have three cities now, TX").toBe(3);
    survey.clearValue("state");
    expect(qCity.visibleChoices.length, "It is empty again").toBe(0);
  });

  test("Use complex variable, bug#T2705", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("1");
    var dropDown = new QuestionDropdownModelTester("q1");
    dropDown.choicesByUrl.url = "{obj.state}";
    page.addQuestion(dropDown);

    expect(dropDown.visibleChoices.length, "It is empty").toBe(0);
    survey.setVariable("obj", { state: "ca_cities" });
    expect(dropDown.visibleChoices.length, "We have two cities now, CA").toBe(2);
    survey.setVariable("obj", { state: "tx_cities" });
    expect(dropDown.visibleChoices.length, "We have three cities now, TX").toBe(3);
    survey.setVariable("obj", null);
    expect(dropDown.visibleChoices.length, "It is empty again").toBe(0);
  });

  test("Question in panel dynamic where url is depend on value outside panel, bug#1089", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("1");
    var dropDown = new QuestionDropdownModelTester("q1");
    dropDown.choicesByUrl.url = "{state}";
    page.addQuestion(dropDown);
    expect(dropDown.visibleChoices.length, "It is empty").toBe(0);
    survey.data = { state: "ca_cities" };
    expect(dropDown.visibleChoices.length, "We have two cities now, CA").toBe(2);
  });

  test("Load countries, custom properties, #615", () => {
    var test = new ChoicesRestfulTester();
    test.noCaching = true;
    var items = [];
    Serializer.addProperty("itemvalue", "alpha2_code");
    test.getResultCallback = function(res: Array<ItemValue>) {
      items = res;
    };
    test.url = "allcountries";
    test.path = "RestResponse;result";
    test.run();
    expect(items.length, "there are 5 countries").toBe(5);
    expect(items[0]["alpha2_code"], "the first alpha2_code is AF").toBe("AF");
    expect(items[4]["alpha2_code"], "the fifth alpha2_code is AS").toBe("AS");
    Serializer.removeProperty("itemvalue", "alpha2_code");
  });

  test("Load countries, custom itemvalue class", () => {
    Serializer.addProperty("itemvalue", "alpha3_code");
    Serializer.addProperty("itemvalue", "customProperty");
    var question = <QuestionDropdownImageTester>(
    Serializer.createClass("imagepicker_choicesrest")
  );
    question.choicesByUrl.url = "allcountries";
    question.choicesByUrl.path = "RestResponse;result";
    question.choicesByUrl["customPropertyName"] = "alpha2_code";
    question.onSurveyLoad();
    expect(question.choices.length, "Choices do not used").toBe(0);
    expect(question.visibleChoices.length, "There are 5 countries now").toBe(5);
    expect(question.visibleChoices[0]["alpha3_code"], "Custom property is set").toBe("AFG");
    expect(question.visibleChoices[0]["customProperty"], "Custom property is set via propertyName is set").toBe("AF");
    Serializer.removeProperty("itemvalue", "customProperty");
    Serializer.removeProperty("itemvalue", "alpha3_code");
  });

  test("choicesByUrl + custom itemvalue class, save/load to/from json", () => {
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
    expect(savedJson, "choicesByUrl + custom itemvalue class restore correctly").toEqualValues(json);

    var loadedQuestion = <QuestionDropdownImageTester>(
      Serializer.createClass("imagepicker_choicesrest")
    );
    new JsonObject().toObject(json, loadedQuestion);
    expect(loadedQuestion.choicesByUrl["customPropertyName"], "Restore customproperty correctly from json").toBe("alpha2_code");
  });

  test("choicesByUrl + clear value if it doesn't exists any more, #1", () => {
    var question = new QuestionDropdownModelTester("q1");
    question.value = "Algeria";
    question.choicesByUrl.url = "allcountries";
    question.choicesByUrl.path = "RestResponse;result";
    question.onSurveyLoad();
    expect(question.value, "Value should not be changed, before choices were empty and value exists").toBe("Algeria");
    question.value = "Algeria1";
    question.onSurveyLoad();
    expect(question.value, "Value should not be changed, the value doesn't exists in choices before as well").toBe("Algeria1");
  });

  test("choicesByUrl + clear value if it doesn't exists any more, #2", () => {
    var question = new QuestionDropdownModelTester("q1");
    question.choices = ["USA", "UK"];
    question.value = "UK";
    question.choicesByUrl.url = "allcountries";
    question.choicesByUrl.path = "RestResponse;result";
    question.onSurveyLoad();
    expect(question.value, "Value is empty, it existed before and it doesn't exists now").toBeFalsy();
  });

  test("choicesByUrl + checkbox + clear value if it doesn't exists any more", () => {
    var question = new QuestionCheckboxModelTester("q1");
    question.choices = ["USA", "UK"];
    question.value = ["UK", "Algeria", "UnknownCountry"];
    question.choicesByUrl.url = "allcountries";
    question.choicesByUrl.path = "RestResponse;result";
    question.onSurveyLoad();
    expect(question.value, "Remove 'UK' and leave the value that exists in the new or doesn't exists in the old").toEqualValues(["Algeria", "UnknownCountry"]);
  });

  test("choicesByUrl + isReady (not ready before call and ready after)", () => {
    var question = new QuestionCheckboxModelTester("q1");
    question.hasItemsCallbackDelay = true;
    question.choicesByUrl.url = "something";
    question.choicesByUrl.valueName = "identity";
    question.restFulTest.items = [
      { identity: { id: 1021 }, localizedData: { id: "A1" } },
      { identity: { id: 1022 }, localizedData: { id: "A2" } },
      { identity: { id: 1023 }, localizedData: { id: "A3" } },
      { identity: { id: 1024 }, localizedData: { id: "A4" } },
    ];
    const survey = new SurveyModel();
    survey.addNewPage("q1");
    survey.pages[0].addQuestion(question);
    question.onSurveyLoad();
    expect(question.isReady, "It is not ready yet").toBe(false);
    question.doResultsCallback();
    expect(question.isReady, "IsReady should be true after load survey").toBe(true);
  });

  test("choicesByUrl + isReady for questions with the same valueName (not ready before call and ready after)", () => {
    const survey = new SurveyModel();
    survey.addNewPage("p1");
    const panel = new QuestionPanelDynamicModel("q2");
    panel.template.addNewQuestion("text", "q2_2");
    panel.valueName = "q1";
    survey.pages[0].addQuestion(panel);
    var question = new QuestionCheckboxModelTester("q1");
    question.valuePropertyName = "val1";
    survey.pages[0].addQuestion(question);
    expect(question.isReady, "Question is not loaded yet").toBe(true);
    question.hasItemsCallbackDelay = true;
    question.choicesByUrl.url = "something";
    question.choicesByUrl.valueName = "identity";
    question.restFulTest.items = ["item1", "item2", "item3", "item4", "item5"];
    question.onSurveyLoad();
    expect(question.isReady, "It is not ready yet").toBe(false);
    expect(panel.isReady, "Related question is not ready").toBe(false);
    question.doResultsCallback();
    expect(question.isReady, "IsReady should be true after load survey").toBe(true);
    expect(panel.isReady, "Related question is ready").toBe(true);
  });
  test("choicesByUrl + isReady for carry-forward)", () => {
    const survey = new SurveyModel();
    survey.addNewPage("p1");
    var question = new QuestionCheckboxModelTester("q1");
    survey.pages[0].addQuestion(question);
    const dropdown = new QuestionDropdownModel("q2");
    survey.pages[0].addQuestion(dropdown);
    dropdown.choicesFromQuestion = "q1";
    expect(question.isReady, "Question is not loaded yet").toBe(true);
    question.hasItemsCallbackDelay = true;
    question.choicesByUrl.url = "something";
    question.choicesByUrl.valueName = "identity";
    question.restFulTest.items = ["item1", "item2", "item3", "item4", "item5"];
    question.onSurveyLoad();
    expect(question.isReady, "It is not ready yet").toBe(false);
    expect(dropdown.isReady, "Related question is not ready").toBe(false);
    question.doResultsCallback();
    expect(question.isReady, "IsReady should be true after load survey").toBe(true);
    expect(dropdown.isReady, "Related question is ready").toBe(true);
  });
  test("choicesByUrl & carry-forward & value)", () => {
    const survey = new SurveyModel();
    survey.addNewPage("p1");
    var question = new QuestionCheckboxModelTester("q1");
    survey.pages[0].addQuestion(question);
    const dropdown = new QuestionCheckboxModel("q2");
    survey.pages[0].addQuestion(dropdown);
    dropdown.choicesFromQuestion = "q1";
    expect(question.isReady, "Question is not loaded yet").toBe(true);
    question.hasItemsCallbackDelay = true;
    question.choicesByUrl.url = "something";
    question.choicesByUrl.valueName = "identity";
    question.restFulTest.items = ["item1", "item2", "item3", "item4", "item5"];
    question.onSurveyLoad();
    survey.data = { q1: ["item2", "item3"], q2: ["item1", "item4"] };
    question.doResultsCallback();
    expect(question.value, "question.value").toEqualValues(["item2", "item3"]);
    expect(dropdown.value, "dropdown.value").toEqualValues(["item1", "item4"]);
  });

  test("isUsing cache", () => {
    var question = new QuestionDropdownModelTester("q1");
    question.choicesByUrl.url = "someurl";
    question.onSurveyLoad();
    expect(question.choicesByUrl.isUsingCache, "Use cache by default").toBe(true);
    settings.useCachingForChoicesRestful = false;
    expect(question.choicesByUrl.isUsingCache, "Do not use cache by default").toBe(false);
    settings.useCachingForChoicesRestful = true;
    question.choicesByUrl.url = "someurl{NOCACHE}";
    expect(question.choicesByUrl.isUsingCache, "Do not use cache by {NOCACHE}").toBe(false);
    expect(question.restFulTest.testProcessedUrl, "Remove {NOCACHE} from Url").toBe("someurl");
    settings.useCachingForChoicesRestful = false;
    question.choicesByUrl.url = "someurl{CACHE}";
    expect(question.choicesByUrl.isUsingCache, "Use cache by {CACHE}").toBe(true);
    expect(question.restFulTest.testProcessedUrl, "Remove {CACHE} from Url").toBe("someurl");
    settings.useCachingForChoicesRestful = true;
  });

  test("Do not call survey.onPropertyValueChangedCallback on loading choicesByUrl, Bug#2563", () => {
    var counter = 0;
    var survey = new SurveyModel();
    survey.gridLayoutEnabled = false;
    survey.onPropertyValueChangedCallback = function(
      name: string,
      oldValue: any,
      newValue: any,
      sender: Base,
      arrayChanges: ArrayChanges
    ) {
      if (!Serializer.findProperty(sender.getType(), name)) return;
      counter++;
    };
    var json = {
      elements: [
        {
          type: "dropdownrestfultester",
          name: "q1",
          choicesByUrl: { url: "{state}" },
        },
      ],
    };
    counter = 0;
    survey.fromJSON(json);
    expect(counter, "We should call onPropertyValueChangedCallback on loading from JSON").toBe(0);
    var q = <QuestionDropdownModel>survey.getQuestionByName("q1");
    q.choicesByUrl.url = "{state}{city}";
    expect(counter, "call onPropertyValueChangedCallback this time").toBe(1);
  });

  test("Load localized itemvalue text, bug#2735", () => {
    var survey = new SurveyModel();
    survey.addNewPage("1");
    var question = new QuestionDropdownModelTester("q1");
    question.choicesByUrl.url = "{state}";
    survey.onChoicesLoaded.add(function (survey, options) {
      if (options.question.name != "q1") return;
      var item = new ItemValue(1);
      item.locText.setJson({ default: "item en", de: "item de" });
      options.choices = [item];
    });
    survey.pages[0].addQuestion(question);
    survey.currentPageNo = 0;
    question.onSurveyLoad();
    expect(question.visibleChoices.length, "We have loaded visible choices").toBe(1);
    var loctText = question.visibleChoices[0].locText;
    var hasChanged = false;
    loctText.onChanged = () => {
      hasChanged = true;
    };
    expect(loctText.renderedHtml, "Default locale").toBe("item en");
    survey.locale = "de";
    expect(hasChanged, "localized string is changed").toBe(true);
    expect(loctText.renderedHtml, "de locale").toBe("item de");
    survey.locale = "";
  });

  test("Load localized strings", () => {
    var survey = new SurveyModel();
    survey.addNewPage("1");
    var question = new QuestionDropdownModelTester("q1");
    question.choicesByUrl.url = "localizedstrings";
    question.choicesByUrl.path = "RestResponse;result";
    survey.pages[0].addQuestion(question);
    survey.currentPageNo = 0;
    question.onSurveyLoad();
    expect(question.visibleChoices.length, "We have loaded visible choices").toBe(1);
    var loctText = question.visibleChoices[0].locText;
    expect(loctText.renderedHtml, "Default locale").toBe("item1 en");
    survey.locale = "de";
    expect(loctText.renderedHtml, "de locale").toBe("item1 de");
    survey.locale = "";
  });

  test("choicesByUrl + clear invsible values", () => {
    var survey = new SurveyModel();
    survey.addNewPage("p1");
    var question = new QuestionDropdownModelTester("q1");
    survey.pages[0].addQuestion(question);
    question.value = "Unknown";
    question.choicesByUrl.url = "allcountries";
    question.choicesByUrl.path = "RestResponse;result";
    question.onSurveyLoad();
    var question2 = new QuestionDropdownModel("q2");
    survey.pages[0].addQuestion(question2);
    question2.value = "Unknown";
    question2.choices = ["item1", "item2"];
    expect(question.value, "Value is here, choices from web").toBe("Unknown");
    expect(question.value, "Value is here, locale choices").toBe("Unknown");
    survey.doComplete();
    expect(question.isEmpty(), "Value is empty, choices from web").toBe(true);
    expect(question2.isEmpty(), "Value is empty, locale choices").toBe(true);
  });

  test("matrix dynamic and has other, Bug #2854", () => {
    var survey = new SurveyModel();
    survey.addNewPage("1");
    var question = new QuestionMatrixDynamicModelTester("q1");
    question.rowCount = 1;
    var column = question.addColumn("country");
    column.cellType = "dropdown";
    column.showOtherItem = true;
    column["choicesByUrl"].url = "allcountries";
    column["choicesByUrl"].path = "RestResponse;result";
    survey.pages[0].addQuestion(question);
    var data = {
      q1: [{ country: "Afghanistan", "country-Comment": "Comment" }],
    };
    survey.data = data;
    question.onSurveyLoad();
    var rows = question.visibleRows;
    var cellDropdown = <QuestionDropdownModelTester>rows[0].cells[0].question;
    expect(cellDropdown.visibleChoices.length, "Choices are not loaded yet, 0 + other").toBe(1);
    cellDropdown.doResultsCallback();
    expect(cellDropdown.visibleChoices.length, "Choices are loaded, + showOtherItem").toBe(5 + 1);
    expect(cellDropdown.value).toBe("Afghanistan");
    survey.doComplete();
    expect(survey.data, "value is not changed").toEqualValues(data);
  });

  test("Change default value for allowEmptyResponse property", () => {
    let choicesRest = new ChoicesRestful();
    expect(choicesRest.allowEmptyResponse).toBe(false);
    Serializer.findProperty("choicesByUrl", "allowEmptyResponse").defaultValue = true;
    choicesRest = new ChoicesRestful();
    expect(choicesRest.allowEmptyResponse).toBe(true);
    Serializer.findProperty("choicesByUrl", "allowEmptyResponse").defaultValue = undefined;
    choicesRest = new ChoicesRestful();
    expect(choicesRest.allowEmptyResponse).toBe(false);
  });
  test("Single: execute choicesByUrl in design time", () => {
    const json = {
      name: "urltest",
      questionJSON: {
        type: "dropdownrestfultester",
        choicesByUrl: { url: "{state}" },
      }
    };
    ComponentCollection.Instance.add(json);

    const survey = new SurveyModel();
    survey.onChoicesLoaded.add((sender, options) => {
      options.choices = [new ItemValue(1), new ItemValue(2)];
    });
    survey.setDesignMode(true);
    survey.fromJSON({
      elements: [{ type: "urltest", name: "q1", isRequired: true }],
    });
    const q1 = <QuestionCustomModel>survey.getQuestionByName("q1");
    expect(q1.contentQuestion.survey, "survey is set").toBeTruthy();
    expect(q1.contentQuestion.visibleChoices.length, "event is executed").toBe(2);
  });
  test("Composite: execute choicesByUrl in design time", () => {
    const json = {
      name: "urltest",
      elementsJSON: [{
        type: "dropdownrestfultester",
        name: "q1",
        choicesByUrl: { url: "{state}" },
      }]
    };
    ComponentCollection.Instance.add(json);

    const survey = new SurveyModel();
    survey.onChoicesLoaded.add((sender, options) => {
      options.choices = [new ItemValue(1), new ItemValue(2)];
    });
    survey.setDesignMode(true);
    survey.fromJSON({
      elements: [{ type: "urltest", name: "q1", isRequired: true }],
    });
    const q1 = <QuestionCompositeModel>survey.getQuestionByName("q1");
    expect(q1.contentPanel.getQuestionByName("q1").visibleChoices.length, "event is executed").toBe(2);
  });

  test("allowCustomChoices: Add custom value into dropdown", () => {
    const question = new QuestionDropdownModelTester("q1");
    const survey = new SurveyModel();
    survey.addNewPage("1");
    survey.pages[0].addQuestion(question);
    const dropdownListModel = question.dropdownListModel;
    const listModel: ListModel = question.dropdownListModel.popupModel.contentComponentData.model as ListModel;
    const testCustomValue = "cuba";

    question.allowCustomChoices = true;
    question.fromJSON({
      choicesByUrl: {
        url: "allcountries",
        path: "RestResponse;result",
        attachData: true,
      },
    });
    question.onSurveyLoad();
    expect(question.visibleChoices.length, "Choices has been loaded").toBe(5);

    dropdownListModel.inputStringRendered = testCustomValue;
    expect(dropdownListModel.customValue, "#1 customValue").toBe(testCustomValue);
    expect(listModel.actions.length, "#1 listModel.actions").toBe(6);
    expect(listModel.actions[5].id, "#1 custom item id").toBe("newCustomItem");
    expect(listModel.actions[5].visible, "#1 custom item visible").toBe(true);
    expect(question.value, "#1 question.value").toBeUndefined();
    expect(question.selectedItem, "#1 question.selectedItem").toBeNull();
    expect(question.visibleChoices.length, "#1 question.visibleChoices").toBe(5);
    expect(survey.data, "#1 survey.data").toEqualValues({});

    listModel.onItemClick(listModel.getActionById("newCustomItem"));
    expect(dropdownListModel.inputStringRendered, "#2 inputStringRendered").toBe(testCustomValue);
    expect(dropdownListModel.customValue, "#2 customValue").toBeUndefined();
    expect(listModel.actions.length, "#2 listModel.actions").toBe(7);
    expect(listModel.actions[0].id, "#2 custom value add into list - id").toBe(testCustomValue);
    expect(listModel.actions[0].title, "#2 custom value add into list - title").toBe(testCustomValue);
    expect(listModel.actions[6].id, "#2 custom item id").toBe("newCustomItem");
    expect(listModel.actions[6].visible, "#2 custom item invisible").toBe(false);
    expect(question.value, "#2 question.value").toBe(testCustomValue);
    expect(question.selectedItem.id, "#2 question.selectedItem").toBe(testCustomValue);
    expect(question.visibleChoices.length, "#2 question.visibleChoices").toBe(6);
    expect(question.visibleChoices[0].value, "#2 question.visibleChoices[0]").toBe(testCustomValue);
    expect(survey.data, "#2 survey.data").toEqualValues({ q1: testCustomValue });

    survey.tryComplete();
    expect(survey.data, "#3 survey.data").toEqualValues({ q1: testCustomValue });
  });
  test("Check objHash, Bug#10463", () => {
    const question = new QuestionDropdownModelTester("q1");
    const restful: any = question.choicesByUrl;
    restful.url = "allcountries";
    const cache1 = restful.objHash;
    restful.valueName = "alpha2_code";
    const cache2 = restful.objHash;
    restful.titleName = "abc";
    const cache3 = restful.objHash;
    expect(cache1, "change valueName -> change cache").not.toBe(cache2);
    expect(cache2, "change path -> change cache").not.toBe(cache3);
    restful.attachData = true;
    const cache4 = restful.objHash;
    expect(cache3, "change attachData -> change cache").not.toBe(cache4);
    restful.attachData = false;
    const cache5 = restful.objHash;
    expect(cache3, "change attachData back -> do not change cache").toBe(cache5);
  });

  test("Don't request options via choicesByUrl if onChoicesLazyLoad is enabled.", () => {
    const question = new QuestionDropdownModelTester("q1");
    const survey = new SurveyModel();
    survey.addNewPage("1");
    survey.pages[0].addQuestion(question);

    question.fromJSON({
      choicesLazyLoadEnabled: true,
      choicesByUrl: {
        url: "allcountries",
        path: "RestResponse;result",
        attachData: true,
      },
    });
    question.onSurveyLoad();
    expect(question.visibleChoices.length, "Choices has not loaded").toBe(0);
  });
  test("Create choicesByUrl on demand only", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "dropdown", name: "q1", choices: [1, 2, 3] }]
    });
    const question = <QuestionDropdownModel>survey.getQuestionByName("q1");
    expect(question.getPropertyValue("choicesByUrl"), "choicesByUrl is not created by default").toBeUndefined();
    survey.toJSON();
    expect(question.getPropertyValue("choicesByUrl"), "choicesByUrl is not created by toJSON").toBeUndefined();
    question.choicesByUrl.url = "allcountries";
    expect(question.getPropertyValue("choicesByUrl"), "choicesByUrl is created on demand").not.toBeUndefined();
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
            name: "Åland Islands", // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
            locName: { en: "Åland Islands" }, // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
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

  function getLocalized(): any {
    return {
      RestResponse: {
        result: [
          {
            value: 1,
            title: { en: "item1 en", de: "item1 de" },
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
});
