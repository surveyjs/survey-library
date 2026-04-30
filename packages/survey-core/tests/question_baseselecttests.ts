import { SurveyModel } from "../src/survey";
import { ChoiceItem, QuestionSelectBase } from "../src/question_baseselect";
import { settings } from "../src/settings";
import { QuestionRadiogroupModel } from "../src/question_radiogroup";
import { QuestionCheckboxModel } from "../src/question_checkbox";
import { QuestionDropdownModel } from "../src/question_dropdown";
import { Serializer } from "../src/jsonobject";
import { QuestionPanelDynamicModel } from "../src/question_paneldynamic";
import { defaultCss } from "../src/defaultCss/defaultCss";
import { IAction } from "../src/actions/action";
import { surveyLocalization } from "../src/surveyStrings";
import { Base } from "../src/base";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import { ItemValue } from "../src/itemvalue";
import { SurveyElement } from "../src/survey-element";

import { describe, test, expect } from "vitest";
describe("baseselect", () => {
  function getValuesInColumns(question: QuestionSelectBase) {
    return question.columns.map((column) => column.map((choice) => choice.id));
  }

  test("Check QuestionSelectBase columns property", () => {
    const json = {
      elements: [
        {
          type: "checkbox",
          name: "Question 1",
          choices: ["Item1", "Item2", "Item3", "Item4", "Item5"],
          colCount: 3,
        },
      ],
    };
    const survey = new SurveyModel(json);

    settings.itemFlowDirection = "row";
    const question = <QuestionSelectBase>survey.getAllQuestions()[0];
    let columns = getValuesInColumns(question);
    expect(columns, "check itemFlowDirection row").toEqualValues([["Item1", "Item4"], ["Item2", "Item5"], ["Item3"]]);
    settings.itemFlowDirection = "column";
    columns = getValuesInColumns(question);
    expect(columns, "check itemFlowDirection column").toEqualValues([["Item1", "Item2"], ["Item3", "Item4"], ["Item5"]]);
  });
  test("Check QuestionSelectBase columns property and creator V2", () => {
    var json = {
      elements: [
        {
          type: "checkbox",
          name: "Question 1",
          colCount: 2,
        },
      ],
    };

    var survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON(json);
    const question = <QuestionSelectBase>survey.getAllQuestions()[0];
    let columns = getValuesInColumns(question);
    expect(columns, "one column").toEqualValues([[], []]);
    let headItems = question.headItems.map((item) => item.id);
    let footItems = question.footItems.map((item) => item.id);

    expect(headItems, "check head items").toEqualValues(["selectall"]);
    expect(footItems, "check foot items").toEqualValues(["newitem", "none", "other"]);
  });

  test("Check QuestionSelectBase head and foot items property", () => {
    var json = {
      elements: [
        {
          type: "checkbox",
          name: "Question 1",
          choices: ["Item1", "Item2", "Item3", "Item4", "Item5"],
          colCount: 3,
        },
      ],
    };
    var survey = new SurveyModel(json);

    var question = <QuestionSelectBase>survey.getAllQuestions()[0];
    expect(question.hasHeadItems).toBeFalsy();
    expect(question.hasFootItems).toBeFalsy();

    settings.itemFlowDirection = "column";
    let columns = getValuesInColumns(question);
    expect(columns, "check itemFlowDirection col - runtime").toEqualValues([["Item1", "Item2"], ["Item3", "Item4"], ["Item5"]]);

    survey.setDesignMode(true);

    (<any>question).updateVisibleChoices();
    expect(question.hasHeadItems).toBeTruthy();
    expect(question.hasFootItems).toBeTruthy();
    columns = getValuesInColumns(question);
    expect(columns, "check itemFlowDirection col - design").toEqualValues([["Item1", "Item2"], ["Item3", "Item4"], ["Item5"]]);
    let headItems = question.headItems.map((item) => item.id);
    let footItems = question.footItems.map((item) => item.id);

    expect(headItems, "check head items").toEqualValues(["selectall"]);
    expect(footItems, "check foot items").toEqualValues(["newitem", "none", "other"]);
    settings.itemFlowDirection = "row";
  });

  test("Check QuestionSelectBase head and foot items property vs refuse and dontknow properties", () => {
    const refuseProp = Serializer.findProperty("selectbase", "showRefuseItem");
    const dontKnowProp = Serializer.findProperty("selectbase", "showDontKnowItem");
    refuseProp.visible = true;
    dontKnowProp.visible = true;
    const json = {
      elements: [
        {
          type: "checkbox",
          name: "Question 1",
          choices: ["Item1", "Item2", "Item3", "Item4", "Item5"],
          colCount: 3,
        },
      ],
    };
    const survey = new SurveyModel(json);

    var question = <QuestionSelectBase>survey.getAllQuestions()[0];
    expect(question.hasHeadItems).toBeFalsy();
    expect(question.hasFootItems).toBeFalsy();

    settings.itemFlowDirection = "column";
    let columns = getValuesInColumns(question);
    expect(columns, "check itemFlowDirection col - runtime").toEqualValues([["Item1", "Item2"], ["Item3", "Item4"], ["Item5"]]);

    survey.setDesignMode(true);

    (<any>question).updateVisibleChoices();
    expect(question.hasHeadItems).toBeTruthy();
    expect(question.hasFootItems).toBeTruthy();
    columns = getValuesInColumns(question);
    expect(columns, "check itemFlowDirection col - design").toEqualValues([["Item1", "Item2"], ["Item3", "Item4"], ["Item5"]]);
    let headItems = question.headItems.map((item) => item.id);
    let footItems = question.footItems.map((item) => item.id);

    expect(headItems, "check head items").toEqualValues(["selectall"]);
    expect(footItems, "check foot items").toEqualValues(["newitem", "none", "refused", "dontknow", "other"]);
    settings.itemFlowDirection = "row";
    refuseProp.visible = false;
    dontKnowProp.visible = false;
  });

  test("Check QuestionSelectBase and separateSpecialChoices option", () => {
    var json = {
      elements: [
        {
          type: "checkbox",
          name: "Question 1",
          choices: ["Item1", "Item2"],
          showOtherItem: true,
          showSelectAllItem: true,
          showNoneItem: true,
          colCount: 2
        },
      ],
    };
    var survey = new SurveyModel(json);

    var question = <QuestionSelectBase>survey.getAllQuestions()[0];
    question.separateSpecialChoices = false;
    expect(question.hasHeadItems).toBeFalsy();
    expect(question.hasFootItems).toBeFalsy();

    let columns = getValuesInColumns(question);
    settings.itemFlowDirection = "column";
    expect(columns, "check columns with no separateSpecialChoices").toEqualValues([["selectall", "Item2", "other"], ["Item1", "none"]]);

    question.separateSpecialChoices = true;
    expect(question.hasHeadItems).toBeTruthy();
    expect(question.hasFootItems).toBeTruthy();

    columns = getValuesInColumns(question);
    expect(columns, "check columns with separateSpecialChoices").toEqualValues([["Item1"], ["Item2"]]);
    let headItems = question.headItems.map((item) => item.id);
    let footItems = question.footItems.map((item) => item.id);

    expect(headItems, "check head items").toEqualValues(["selectall"]);
    expect(footItems, "check foot items").toEqualValues(["none", "other"]);
    settings.itemFlowDirection = "row";
  });
  test("settings.noneItemValue", () => {
    settings.noneItemValue = "n/a";
    const json = {
      elements: [
        { name: "q1", type: "dropdown", choices: [1, 2, 3], showNoneItem: true },
        { name: "q1", type: "checkbox", choices: [1, 2, 3], showNoneItem: true }
      ],
    };
    const survey = new SurveyModel(json);
    const q1 = <QuestionSelectBase>survey.getAllQuestions()[0];
    q1.value = "n/a";
    expect(q1.isNoneSelected, "dropdown none is selected").toLooseEqual(true);
    const q2 = <QuestionSelectBase>survey.getAllQuestions()[1];
    q2.value = ["n/a"];
    expect(q2.isNoneSelected, "checkbox none is selected").toLooseEqual(true);
    settings.noneItemValue = "none";
  });

  test("Set choicesByUrl for checkbox", () => {
    var json = {
      elements: [
        {
          type: "checkbox",
          name: "q1",
          choicesByUrl: {
            path: "path1",
            valueName: "val1",
          },
        },
        {
          type: "checkbox",
          name: "q2",
          choicesByUrl: {
            path: "path2",
            titleName: "title1",
          },
        },
      ],
    };
    var survey = new SurveyModel(json);
    var q1 = <QuestionSelectBase>survey.getQuestionByName("q1");
    var q2 = <QuestionSelectBase>survey.getQuestionByName("q2");
    q2.choicesByUrl = q1.choicesByUrl;
    expect(q2.choicesByUrl.path, "path set correctly").toLooseEqual("path1");
    expect(q2.choicesByUrl.valueName, "valueName set correctly").toLooseEqual("val1");
    expect(q2.choicesByUrl.titleName, "titleName is cleard").toLooseEqual("");
  });
  test("Bind two checkboxes by valueName, Bug#10344", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "checkbox",
          name: "q1",
          valueName: "data",
          choices: ["a"]
        },
        {
          type: "checkbox",
          name: "q2",
          valueName: "data",
          choices: ["b"]
        }
      ]
    });
    const q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    const q2 = <QuestionCheckboxModel>survey.getQuestionByName("q2");
    q1.clickItemHandler(q1.choices[0], true);
    expect(survey.data, "check q1").toEqualValues({ data: ["a"] });
    q2.clickItemHandler(q2.choices[0], true);
    expect(survey.data, "check q2").toEqualValues({ data: ["a", "b"] });
    expect(q1.value, "q1 value is correct").toEqualValues(["a", "b"]);
    expect(q2.value, "q2 value is correct").toEqualValues(["a", "b"]);
    expect(q1.isItemSelected(q1.choices[0]), "q1 item is selected").toLooseEqual(true);
    expect(q2.isItemSelected(q2.choices[0]), "q2 item is selected").toLooseEqual(true);
  });
  test("Bind two checkboxes by valueName & storeOthersAsComment= false, Bug#10344", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "checkbox",
          name: "q1",
          valueName: "data",
          choices: ["a"]
        },
        {
          type: "checkbox",
          name: "q2",
          valueName: "data",
          choices: ["b"]
        },
      ],
      storeOthersAsComment: false
    });
    const q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    const q2 = <QuestionCheckboxModel>survey.getQuestionByName("q2");
    q1.clickItemHandler(q1.choices[0], true);
    expect(survey.data, "check q1").toEqualValues({ data: ["a"] });
    q2.clickItemHandler(q2.choices[0], true);
    expect(survey.data, "check q2").toEqualValues({ data: ["a", "b"] });
    expect(q1.value, "q1 value is correct").toEqualValues(["a", "b"]);
    expect(q2.value, "q2 value is correct").toEqualValues(["a", "b"]);
    expect(q1.isItemSelected(q1.choices[0]), "q1 item is selected").toLooseEqual(true);
    expect(q2.isItemSelected(q2.choices[0]), "q2 item is selected").toLooseEqual(true);
  });
  test("check allowhover class in design mode", () => {
    var json = {
      elements: [
        {
          type: "checkbox",
          name: "q1",
          choices: ["Item 1"],
        },
      ],
    };
    const survey = new SurveyModel(json);
    const q1 = <QuestionSelectBase>survey.getQuestionByName("q1");
    q1.cssClasses.itemHover = "sv_q_checkbox_hover";
    const item = q1.visibleChoices[0];
    expect(q1.getItemClass(item).indexOf("sv_q_checkbox_hover") != -1).toBeTruthy();
    survey.setDesignMode(true);
    expect(q1.getItemClass(item).indexOf("sv_q_checkbox_hover") == -1).toBeTruthy();
  });
  test("check item value type", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "dropdown",
          name: "q1",
          choices: ["Item 1"],
        },
        {
          type: "imagepicker",
          name: "q2",
          choices: ["Item 1"],
        },
        {
          type: "buttongroup",
          name: "q3",
          choices: ["Item 1"],
        },
      ],
    });
    const q1 = <QuestionSelectBase>survey.getQuestionByName("q1");
    const q2 = <QuestionSelectBase>survey.getQuestionByName("q2");
    const q3 = <QuestionSelectBase>survey.getQuestionByName("q3");
    expect(q1.choices[0].getType(), "load dropdown").toLooseEqual("choiceitem");
    expect(q1.choices[0].value, "load dropdown, value").toLooseEqual("Item 1");
    expect(q2.choices[0].getType(), "load imagepicker").toLooseEqual("imageitemvalue");
    expect(q2.choices[0].value, "load imagepicker value").toLooseEqual("Item 1");
    expect(q3.choices[0].getType(), "load buttongroup").toLooseEqual("buttongroupitemvalue");
    expect(q3.choices[0].value, "load buttongroup value").toLooseEqual("Item 1");
    expect(q1.createItemValue(1).getType(), "create dropdown item").toLooseEqual("choiceitem");
    expect(q1.createItemValue(1).value, "create dropdown, value").toLooseEqual(1);
    expect(q2.createItemValue(1).getType(), "create imagepicker item").toLooseEqual("imageitemvalue");
    expect(q2.createItemValue(1).value, "create imagepicker, value").toLooseEqual(1);
    expect(q3.createItemValue(1).getType(), "create buttongroup item").toLooseEqual("buttongroupitemvalue");
    expect(q3.createItemValue(1).value, "create buttongroup, value").toLooseEqual(1);
  });

  test("check item locstring owner and name", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "radiogroup",
          name: "q1",
          choices: ["Item 1"],
        }]
    });

    var question = survey.getQuestionByName("q1") as any;
    expect(question.locTitle.owner.getType(), "Owner for radio question title is radiogroup").toLooseEqual("radiogroup");
    expect(question.locTitle.name, "Name for radio question title is title").toLooseEqual("title");
    var itemValue = (question.choices[0]);
    expect(itemValue.locText.owner.getType(), "Owner for radio question item text is itemvalue").toLooseEqual("choiceitem");
    expect(itemValue.locText.name, "Name for radio question item text is text").toLooseEqual("text");
  });

  test("check onShowingChoiceItem event", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "radiogroup",
          name: "q1",
          choices: [{ value: "Item1", visibleIf: "1 = 2" }, "Item2", "Item3"],
          showNoneItem: true,
          showOtherItem: true
        }]
    });

    const question = <QuestionRadiogroupModel>survey.getQuestionByName("q1");
    expect(question.visibleChoices.length).toLooseEqual(4);
    expect(question.visibleChoices[0].value).toLooseEqual("Item2");
    expect(question.visibleChoices[1].value).toLooseEqual("Item3");
    expect(question.visibleChoices[2].value).toLooseEqual("none");
    expect(question.visibleChoices[3].value).toLooseEqual("other");

    survey.onShowingChoiceItem.add((sender, options) => {
      if (options.question.name !== "q1") return;
      options.visible = ["Item1", "Item2"].indexOf(options.item.value) > -1;
    });

    expect(question.visibleChoices.length).toLooseEqual(2);
    expect(question.visibleChoices[0].value).toLooseEqual("Item1");
    expect(question.visibleChoices[1].value).toLooseEqual("Item2");
  });
  test("check onShowingChoiceItem event & showRefuseItem & showDontKnowItem", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "radiogroup",
          name: "q1",
          choices: [{ value: "Item1", visibleIf: "1 = 2" }, "Item2", "Item3"],
          showNoneItem: true,
          showRefuseItem: true,
          showDontKnowItem: true,
          showOtherItem: true
        }]
    });

    const question = <QuestionRadiogroupModel>survey.getQuestionByName("q1");
    expect(question.visibleChoices.length).toLooseEqual(6);
    expect(question.visibleChoices[0].value).toLooseEqual("Item2");
    expect(question.visibleChoices[1].value).toLooseEqual("Item3");
    expect(question.visibleChoices[2].value).toLooseEqual("none");
    expect(question.visibleChoices[3].value).toLooseEqual("refused");
    expect(question.visibleChoices[4].value).toLooseEqual("dontknow");
    expect(question.visibleChoices[5].value).toLooseEqual("other");

    survey.onShowingChoiceItem.add((sender, options) => {
      if (options.question.name !== "q1") return;
      options.visible = ["Item1", "Item2"].indexOf(options.item.value) > -1;
    });

    expect(question.visibleChoices.length).toLooseEqual(2);
    expect(question.visibleChoices[0].value).toLooseEqual("Item1");
    expect(question.visibleChoices[1].value).toLooseEqual("Item2");
  });

  test("check focus comment of other select", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "checkbox",
          name: "q1",
          showOtherItem: true,
          choices: ["item1"]
        }
      ]
    });
    let counter = 0;
    const q = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    q["focusOtherComment"] = () => {
      counter++;
    };
    expect(counter).toLooseEqual(0);
    q.selectItem(q.otherItem, true);
    expect(counter).toLooseEqual(1);
    q.value = ["other", "item1"];
    q.selectItem(q.choices[0], true);
    expect(counter).toLooseEqual(1);
    q.selectItem(q.otherItem, false);
    expect(counter).toLooseEqual(1);
    q.selectItem(q.otherItem, true);
    expect(q.value, "other is selected in question value").toEqualValues(["item1", "other"]);
    expect(counter).toLooseEqual(2);
  });
  test("Do not focus element on setting defaultValue & on setting value to survey.data, Bug#9700", () => {
    const oldFunc = SurveyElement.FocusElement;
    let counter = 0;
    SurveyElement.FocusElement = function (elId: string): boolean {
      counter ++;
      return true;
    };

    let survey = new SurveyModel({
      elements: [
        {
          "type": "checkbox",
          "name": "q1",
          "defaultValue": ["Item 2", "Some other value"],
          "choices": ["Item 1", "Item 2", "Item 3"],
          "showOtherItem": true
        }
      ]
    });
    expect(counter, "Do not focus element on setting defaultValue").toLooseEqual(0);
    survey = new SurveyModel({
      elements: [
        {
          "type": "checkbox",
          "name": "q1",
          "choices": ["Item 1", "Item 2", "Item 3"],
          "showOtherItem": true
        }
      ]
    });
    survey.data = { q1: ["Item 1", "other"] };
    expect(counter, "Do not focus element on setting survey.data").toLooseEqual(0);
    const question = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    question.value = ["Item 1"];
    question.selectItem(question.otherItem, true);
    expect(question.value, "question value is correct").toEqualValues(["Item 1", "other"]);
    expect(counter, "Focus on setting the question value").toLooseEqual(1);
    SurveyElement.FocusElement = oldFunc;
  });

  test("check separateSpecialChoices property visibility", () => {
    expect(Serializer.findProperty("selectbase", "separateSpecialChoices").visible).toBeFalsy();
    expect(Serializer.findProperty("checkbox", "separateSpecialChoices").visible).toBeTruthy();
    expect(Serializer.findProperty("radiogroup", "separateSpecialChoices").visible).toBeTruthy();
    expect(Serializer.findProperty("imagepicker", "separateSpecialChoices").visible).toBeFalsy();
    expect(Serializer.findProperty("dropdown", "separateSpecialChoices").visible).toBeFalsy();
  });
  test("Apply choice visibleIf correctly on setting survey.data", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "checkbox",
          name: "q1",
          choices: ["apple", "banana", "orange"],
        },
        {
          type: "radiogroup",
          name: "q2",
          choices: [
            "item1",
            {
              value: "item2",
              visibleIf: "{q1} = ['apple']",
            },
            "item3",
          ],
          showOtherItem: true,
        },
      ],
    });
    survey.data = {
      q2: "item2",
      q1: ["apple"],
    };
    const q = <QuestionRadiogroupModel>survey.getQuestionByName("q2");
    expect(q.value, "Other is not selected").not.toLooseEqual(q.otherItem.value);
    expect(q.value, "item2 is selected").toLooseEqual("item2");
  });
  test("checkbox and valuePropertyName", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "checkbox",
          name: "q1",
          choices: ["apple", "banana", "orange"],
        }
      ]
    });
    const q = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    q.valuePropertyName = "fruit";
    q.renderedValue = ["apple"];
    expect(q.value, "#1").toEqualValues([{ fruit: "apple" }]);
    expect(q.renderedValue, "#2").toEqualValues(["apple"]);
    expect(q.isItemSelected(q.choices[0]), "#2.1").toLooseEqual(true);
    expect(q.isItemSelected(q.choices[1]), "#2.2").toLooseEqual(false);
    expect(q.isItemSelected(q.choices[2]), "#2.3").toLooseEqual(false);
    q.value = [{ fruit: "apple" }, { fruit: "orange" }];
    expect(q.renderedValue, "#3").toEqualValues(["apple", "orange"]);
    expect(survey.data, "convert to data correctly, #4").toEqualValues({ q1: [{ fruit: "apple" }, { fruit: "orange" }] });
    expect(q.isItemSelected(q.choices[0]), "#3.1").toLooseEqual(true);
    expect(q.isItemSelected(q.choices[1]), "#3.2").toLooseEqual(false);
    expect(q.isItemSelected(q.choices[2]), "#3.3").toLooseEqual(true);
    survey.doComplete();
    expect(survey.data, "survey.data is correct on complete, #5").toEqualValues({ q1: [{ fruit: "apple" }, { fruit: "orange" }] });
  });
  test("checkbox valuePropertyName and shared data vs panel dynamic ", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "checkbox",
          name: "q1",
          valueName: "data",
          valuePropertyName: "fruit",
          choices: ["apple", "banana", "orange"],
        },
        {
          type: "paneldynamic",
          name: "q2",
          panelCount: 0,
          valueName: "data",
          templateElements: [
            {
              type: "text",
              name: "name"
            }
          ]
        }
      ]
    });
    const q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    const q2 = <QuestionPanelDynamicModel>survey.getQuestionByName("q2");
    q1.renderedValue = ["apple", "orange"];
    expect(q2.panelCount, "#1, Panel count is changed").toLooseEqual(2);
    q2.panels[0].getQuestionByName("name").value = "text1";
    q2.panels[1].getQuestionByName("name").value = "text2";
    expect(survey.data, "#2, combine results").toEqualValues({
      data: [
        { fruit: "apple", name: "text1" },
        { fruit: "orange", name: "text2" }]
    });
    q1.renderedValue = ["apple"];
    expect(survey.data, "#3, keep results").toEqualValues({
      data: [
        { fruit: "apple", name: "text1" }]
    });
    q1.renderedValue = ["apple", "orange"];
    expect(survey.data, "#4, add new value").toEqualValues({
      data: [
        { fruit: "apple", name: "text1" },
        { fruit: "orange" }]
    });
    q2.removePanel(0);
    expect(survey.data, "#5, remove panel, data").toEqualValues({
      data: [
        { fruit: "orange" }]
    });
    expect(q1.renderedValue, "#6, remove panel, renderedValue").toEqualValues(["orange"]);
  });
  test("checkbox vs valuePropertyName, check selectAll and none", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "checkbox",
          name: "q1",
          choices: ["apple", "banana", "orange"],
          valuePropertyName: "fruit",
          showNoneItem: true,
          showSelectAllItem: true
        }
      ]
    });
    const q = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    q.toggleSelectAll();
    expect(q.renderedValue, "#1").toEqualValues(["apple", "banana", "orange"]);
    expect(q.value, "#2").toEqualValues([{ fruit: "apple" }, { fruit: "banana" }, { fruit: "orange" }]);
    expect(q.isAllSelected, "#3, all is selected").toLooseEqual(true);
    q.clickItemHandler(q.noneItem, true);
    expect(q.value, "#4").toEqualValues([{ fruit: "none" }]);
    expect(q.isAllSelected, "#5, all is not selected").toLooseEqual(false);
  });
  test("checkbox vs valuePropertyName, check selectAll and none & refuse & dontknow", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "checkbox",
          name: "q1",
          choices: ["apple", "banana", "orange"],
          valuePropertyName: "fruit",
          showNoneItem: true,
          showRefuseItem: true,
          showDontKnowItem: true,
          showSelectAllItem: true
        }
      ]
    });
    const q = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    q.toggleSelectAll();
    expect(q.renderedValue, "#1").toEqualValues(["apple", "banana", "orange"]);
    expect(q.value, "#2").toEqualValues([{ fruit: "apple" }, { fruit: "banana" }, { fruit: "orange" }]);
    expect(q.isAllSelected, "#3, all is selected").toLooseEqual(true);
    q.clickItemHandler(q.refuseItem, true);
    expect(q.value, "#4").toEqualValues([{ fruit: "refused" }]);
    expect(q.isAllSelected, "#5, all is not selected").toLooseEqual(false);
    q.clickItemHandler(q.selectAllItem, true);
    expect(q.renderedValue, "#6").toEqualValues(["apple", "banana", "orange"]);
    q.clickItemHandler(q.dontKnowItem, true);
    expect(q.value, "#7").toEqualValues([{ fruit: "dontknow" }]);
    q.clickItemHandler(q.refuseItem, true);
    expect(q.value, "#8").toEqualValues([{ fruit: "refused" }]);
    q.clickItemHandler(q.noneItem, true);
    expect(q.value, "#9").toEqualValues([{ fruit: "none" }]);
    q.clickItemHandler(q.choices[0], true);
    expect(q.value, "#10").toEqualValues([{ fruit: "apple" }]);
    q.renderedValue = ["refused"];
    expect(q.value, "#11").toEqualValues([{ fruit: "refused" }]);
    q.clickItemHandler(q.choices[0], true);
    expect(q.value, "#12").toEqualValues([{ fruit: "apple" }]);

    q.renderedValue = ["apple", "none"];
    expect(q.value, "#13").toEqualValues([{ fruit: "none" }]);
    q.renderedValue = ["none", "refused"];
    expect(q.value, "#14").toEqualValues([{ fruit: "refused" }]);
    q.renderedValue = ["refused", "dontknow"];
    expect(q.value, "#15").toEqualValues([{ fruit: "dontknow" }]);
    q.renderedValue = ["dontknow", "none"];
    expect(q.value, "#16").toEqualValues([{ fruit: "none" }]);
    q.renderedValue = ["none", "apple"];
    expect(q.value, "#17").toEqualValues([{ fruit: "apple" }]);
  });
  test("checkbox:readonly:clickItemHandler", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "checkbox",
          name: "q1",
          choices: ["apple", "banana", "orange"],
          valuePropertyName: "fruit",
          showNoneItem: true,
          defaultValue: ["banana"],
          readOnly: true,
          showSelectAllItem: true
        }
      ]
    });
    const q = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    q.clickItemHandler(q.choices[2], true);
    expect(q.value, "nothing changed").toEqualValues([{ fruit: "banana" }]);
  });
  test("checkbox vs valuePropertyName, check showOtherItem", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "checkbox",
          name: "q1",
          choices: ["apple", "banana", "orange"],
          valuePropertyName: "fruit",
          showOtherItem: true
        }
      ]
    });
    const q = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    expect(q.getStoreOthersAsComment(), "It becomes false because of valuePropertyName").toLooseEqual(false);
    q.renderedValue = ["other"];
    expect(q.value, "#1").toEqualValues([{ fruit: "other" }]);
    q.otherValue = "text1";
    expect(survey.data, "2").toEqualValues({ q1: [{ fruit: "text1" }] });
  });
  test("checkbox vs valuePropertyName, getDisplayValue", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "checkbox",
          name: "q1",
          choices: [{ value: 1, text: "apple" }, { value: 2, text: "banana" }, { value: 3, text: "orange" }],
          valuePropertyName: "fruit"
        }
      ]
    });
    const q = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    expect(q.getDisplayValue(false, [{ fruit: 1 }, { fruit: 3 }]), "display value for all values").toEqualValues("apple, orange");
  });
  test("checkbox vs valuePropertyName, getDisplayValue & value name uses uppercase letters, Bug#10707", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "checkbox",
          name: "q1",
          choices: [{ value: 1, text: "apple" }, { value: 2, text: "banana" }, { value: 3, text: "orange" }],
          valuePropertyName: "fruitID"
        },
        {
          type: "text",
          name: "q2",
          title: "{q1}"
        }
      ]
    });
    const q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    expect(q1.getDisplayValue(false, [{ fruitID: 1 }, { fruitID: 3 }]), "display value for all values").toEqualValues("apple, orange");
    q1.value = [{ fruitID: 2 }];
    const q2 = survey.getQuestionByName("q2");
    expect(q2.locTitle.renderedHtml, "display value in text question").toLooseEqual("banana");
  });
  test("checkbox vs valuePropertyName, check showOtherItem vs storeOthersAsComment", () => {
    const survey = new SurveyModel({
      storeOthersAsComment: false,
      elements: [
        {
          type: "checkbox",
          name: "q1",
          choices: ["apple", "banana", "orange"],
          valuePropertyName: "fruit",
          showOtherItem: true
        }
      ]
    });
    const q = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    q.renderedValue = ["other"];
    expect(q.value, "#1").toEqualValues([{ fruit: "other" }]);
    q.otherValue = "text1";
    expect(q.value, "#2").toEqualValues([{ fruit: "text1" }]);
    expect(survey.data, "#3").toEqualValues({ q1: [{ fruit: "text1" }] });
  });
  test("checkbox vs valuePropertyName, check showOtherItem vs storeOthersAsComment & matrix", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "checkbox",
          name: "q1",
          choices: ["apple", "banana", "orange"],
          valuePropertyName: "fruit",
          showOtherItem: true
        },
        {
          type: "matrixdynamic",
          name: "q2",
          valueName: "q1",
          columns: [
            { cellType: "text", name: "col1" },
            { cellType: "expression", name: "col2", expression: "{row.fruit}" }
          ]
        }
      ]
    });
    const q = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    expect(q.getStoreOthersAsComment(), "it is false valuePropertyName is not empty").toLooseEqual(false);
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("q2");
    q.renderedValue = ["apple", "other"];
    const rows = matrix.visibleRows;
    expect(rows.length, "matrix rows").toLooseEqual(2);
    q.otherValue = "text1";
    expect(rows.length, "matrix rows").toLooseEqual(2);
    expect(rows[0].cells[1].question.value, "rows[0]").toLooseEqual("apple");
    expect(rows[1].cells[1].question.value, "rows[1]").toLooseEqual("text1");
    expect(survey.data, "survey.data").toEqualValues({ q1: [{ fruit: "apple", col2: "apple" }, { fruit: "text1", col2: "text1" }] });
  });
  test("checkbox vs valuePropertyName, use in expression", () => {
    const survey = new SurveyModel({
      storeOthersAsComment: false,
      elements: [
        {
          type: "checkbox",
          name: "q1",
          choices: ["apple", "banana", "orange"],
          valuePropertyName: "fruit"
        },
        {
          type: "text",
          name: "q2",
          visibleIf: "{q1-unwrapped} allof ['apple', 'orange']"
        }
      ]
    });
    const q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    const conds: any = [];
    q1.addConditionObjectsByContext(conds, undefined);
    expect(conds[0].name, "use filtered name").toLooseEqual("q1-unwrapped");
    const q2 = survey.getQuestionByName("q2");
    expect(q2.isVisible, "#1").toLooseEqual(false);
    q1.renderedValue = ["apple", "orange"];
    expect(q1.value, "q1.value. #1").toEqualValues([{ fruit: "apple" }, { fruit: "orange" }]);
    expect(q2.isVisible, "#2").toLooseEqual(true);
    q1.renderedValue = ["orange"];
    expect(q1.value, "q1.value. #2").toEqualValues([{ fruit: "orange" }]);
    expect(q2.isVisible, "#3").toLooseEqual(false);
  });

  test("checkbox vs valuePropertyName & defaultValue, Bug#8973", () => {
    const survey = new SurveyModel({
      storeOthersAsComment: false,
      elements: [
        {
          type: "checkbox",
          name: "q1",
          choices: ["apple", "banana", "orange"],
          valuePropertyName: "fruit",
          defaultValue: ["apple", "orange"]
        }
      ]
    });
    const q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    q1.renderedValue = ["apple", "orange"];
    expect(q1.value, "q1.value").toEqualValues([{ fruit: "apple" }, { fruit: "orange" }]);
  });
  test("checkbox vs valuePropertyName & defaultValueExpression, Bug#8973", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "checkbox",
          name: "q1",
          choices: ["apple", "banana", "orange"],
          valuePropertyName: "fruit",
          defaultValueExpression: "{q2}"
        },
        {
          type: "checkbox",
          name: "q2",
          choices: ["apple", "banana", "orange"]
        }
      ]
    });
    const q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    const q2 = <QuestionCheckboxModel>survey.getQuestionByName("q2");
    q2.renderedValue = ["apple", "orange"];
    expect(q2.value, "q2.value").toEqualValues(["apple", "orange"]);
    expect(q1.value, "q1.value").toEqualValues([{ fruit: "apple" }, { fruit: "orange" }]);
  });
  test("checkbox vs valuePropertyName & setValueExpression, Bug#8973", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "checkbox",
          name: "q1",
          choices: ["apple", "banana", "orange"],
          valuePropertyName: "fruit",
          setValueExpression: "{q2}"
        },
        {
          type: "checkbox",
          name: "q2",
          choices: ["apple", "banana", "orange"]
        }
      ]
    });
    const q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    const q2 = <QuestionCheckboxModel>survey.getQuestionByName("q2");
    q2.renderedValue = ["apple", "orange"];
    expect(q2.value, "q2.value, #1").toEqualValues(["apple", "orange"]);
    expect(q1.value, "q1.value, #2").toEqualValues([{ fruit: "apple" }, { fruit: "orange" }]);
    q2.renderedValue = ["banana", "orange"];
    expect(q2.value, "q2.value, #2").toEqualValues(["banana", "orange"]);
    expect(q1.value, "q1.value, #2").toEqualValues([{ fruit: "banana" }, { fruit: "orange" }]);
  });

  test("check radiogroup title actions", () => {
    let survey = new SurveyModel({
      elements: [
        {
          type: "radiogroup",
          name: "q1",
          choices: ["Item 1"],
          allowClear: true
        }]
    });
    let question = <QuestionRadiogroupModel>survey.getAllQuestions()[0];
    survey.css = defaultCss;
    question = <QuestionRadiogroupModel>survey.getAllQuestions()[0];
    const action = <IAction>question.getTitleActions()[0];
    expect(question.showClearButtonInContent).toBeFalsy();
    expect(action.title).toLooseEqual("Clear");
    expect(action.visible).toBeTruthy();

    question.allowClear = false;
    expect(action.visible).toBeFalsy();
  });

  test("checkbox and radio css", () => {
    let survey = new SurveyModel({
      elements: [
        {
          type: "radiogroup",
          name: "q1",
          choices: ["Item 1"],
          showNoneItem: true
        },
        {
          type: "checkbox",
          name: "q2",
          choices: ["Item 1"],
          allowClear: true,
          showSelectAllItem: true,
          showNoneItem: true
        }]
    });
    let question1 = <QuestionRadiogroupModel>survey.getAllQuestions()[0];
    let question2 = <QuestionCheckboxModel>survey.getAllQuestions()[1];
    survey.css = {
      radiogroup: {
        root: "css-root",
        rootRow: "css-root-row"
      },
      checkbox: {
        root: "css-root",
        rootRow: "css-root-row"
      }
    };

    expect(question1.getSelectBaseRootCss()).toLooseEqual("css-root");
    expect(question2.getSelectBaseRootCss()).toLooseEqual("css-root");

    expect(question1.dataChoices.map((item) => item.id)).toEqualValues(["Item 1"]);
    expect(question2.dataChoices.map((item) => item.id)).toEqualValues(["Item 1"]);

    expect(question1.bodyItems.map((item) => item.id)).toEqualValues(["Item 1", "none"]);
    expect(question2.bodyItems.map((item) => item.id)).toEqualValues(["selectall", "Item 1", "none"]);

    expect(question1.rowLayout).toEqualValues(false);
    expect(question2.rowLayout).toEqualValues(false);

    question1.colCount = 0;
    question2.colCount = 0;

    expect(question1.getSelectBaseRootCss()).toLooseEqual("css-root css-root-row");
    expect(question2.getSelectBaseRootCss()).toLooseEqual("css-root css-root-row");

    expect(question1.dataChoices.map((item) => item.id)).toEqualValues(["Item 1"]);
    expect(question2.dataChoices.map((item) => item.id)).toEqualValues(["Item 1"]);

    expect(question1.bodyItems.map((item) => item.id)).toEqualValues(["Item 1", "none"]);
    expect(question2.bodyItems.map((item) => item.id)).toEqualValues(["selectall", "Item 1", "none"]);

    expect(question1.rowLayout).toEqualValues(true);
    expect(question2.rowLayout).toEqualValues(true);

    expect(question1.blockedRow).toEqualValues(false);
    expect(question2.blockedRow).toEqualValues(false);

    question1.separateSpecialChoices = true;
    question2.separateSpecialChoices = true;

    expect(question1.getSelectBaseRootCss()).toLooseEqual("css-root");
    expect(question2.getSelectBaseRootCss()).toLooseEqual("css-root");

    expect(question1.dataChoices.map((item) => item.id)).toEqualValues(["Item 1"]);
    expect(question2.dataChoices.map((item) => item.id)).toEqualValues(["Item 1"]);

    expect(question1.bodyItems.map((item) => item.id)).toEqualValues(["Item 1"]);
    expect(question2.bodyItems.map((item) => item.id)).toEqualValues(["Item 1"]);

    expect(question1.rowLayout).toEqualValues(false);
    expect(question2.rowLayout).toEqualValues(false);

    expect(question1.blockedRow).toEqualValues(true);
    expect(question2.blockedRow).toEqualValues(true);

    question1.separateSpecialChoices = false;
    question2.separateSpecialChoices = false;

    survey["_isDesignMode"] = true;

    expect(question1.getSelectBaseRootCss()).toLooseEqual("css-root");
    expect(question2.getSelectBaseRootCss()).toLooseEqual("css-root");

    expect(question1.dataChoices.map((item) => item.id)).toEqualValues(["Item 1"]);
    expect(question2.dataChoices.map((item) => item.id)).toEqualValues(["Item 1"]);

    expect(question1.bodyItems.map((item) => item.id)).toEqualValues(["Item 1"]);
    expect(question2.bodyItems.map((item) => item.id)).toEqualValues(["Item 1"]);

    expect(question1.rowLayout).toEqualValues(false);
    expect(question2.rowLayout).toEqualValues(false);

    expect(question1.blockedRow).toEqualValues(true);
    expect(question2.blockedRow).toEqualValues(true);
  });
  test("autoOtherMode property, radiogroup", () => {
    const question = new QuestionRadiogroupModel("q1");
    question.showOtherItem = true;
    question.choices = [1, 2, 3];
    question.autoOtherMode = true;
    expect(question.isOtherSelected, "other is not selected by default").toLooseEqual(false);
    question.otherValue = "comment";
    expect(question.isOtherSelected, "other is selected by setting comments").toLooseEqual(true);
    question.otherValue = "";
    expect(question.isOtherSelected, "other is not selected by resetting comment").toLooseEqual(false);
    question.value = 1;
    question.otherValue = "comment";
    expect(question.value, "other is selected by setting comments, value").toLooseEqual("other");
    question.otherValue = "";
    expect(question.value, "other is not selected by resetting comment, value").toLooseEqual(undefined);
    question.otherValue = "comment";
    question.value = 1;
    expect(question.otherValue, "Clear comment on changing value").toLooseEqual("");
    question.storeOthersAsComment = false;
    question.otherValue = "comment1";
    expect(question.value, "other is selected by setting comments, value + storeOthersAsComment").toLooseEqual("comment1");
    question.otherValue = "";
    expect(question.value, "other is not selected by resetting comment, value + storeOthersAsComment").toLooseEqual(undefined);
  });
  test("autoOtherMode property, checkbox", () => {
    const survey = new SurveyModel();
    survey.addNewPage("p1");
    const question = new QuestionCheckboxModel("q1");
    survey.pages[0].addQuestion(question);
    question.showOtherItem = true;
    question.choices = [1, 2, 3];
    question.autoOtherMode = true;
    expect(question.isOtherSelected, "other is not selected by default").toLooseEqual(false);
    question.otherValue = "comment";
    expect(question.isOtherSelected, "other is selected by setting comments").toLooseEqual(true);
    question.otherValue = "";
    expect(question.isOtherSelected, "other is not selected by resetting comment").toLooseEqual(false);
    question.value = [1, 3];
    question.otherValue = "comment";
    expect(question.value, "other is selected by setting comments, value").toEqualValues([1, 3, "other"]);
    expect(survey.data, "survey: other is selected by setting comments, value").toEqualValues({ q1: [1, 3, "other"], "q1-Comment": "comment" });
    question.otherValue = "";
    expect(question.value, "other is not selected by resetting comment, value").toEqualValues([1, 3]);
    expect(survey.data, "survey: other is not selected by resetting comment, value").toEqualValues({ q1: [1, 3] });
    question.storeOthersAsComment = false;
    question.otherValue = "comment1";
    expect(question.value, "other is selected by setting comments, value + storeOthersAsComment").toEqualValues([1, 3, "comment1"]);
    expect(survey.data, "survey: other is selected by setting comments, value + storeOthersAsComment").toEqualValues({ q1: [1, 3, "comment1"] });
    question.otherValue = "";
    expect(question.value, "other is not selected by resetting comment, value + storeOthersAsComment").toEqualValues([1, 3]);
    expect(survey.data, "survey: other is not selected by resetting comment, value + storeOthersAsComment").toEqualValues({ q1: [1, 3] });
  });
  test("check locOwner for items", () => {
    const question = new QuestionCheckboxModel("q1");
    question.choices = [1, 2, 3];
    question.autoOtherMode = true;
    expect(question.noneItem.locText.owner, "none text owner is none item").toLooseEqual(question.noneItem);
    expect(question.otherItem.locText.owner, "other text owner is other item").toLooseEqual(question.otherItem);
    expect(question.selectAllItem.locText.owner, "selectAll text owner is selectAll item").toLooseEqual(question.selectAllItem);

    expect(question.choices[0].locText.owner, "item1 text owner is item1").toLooseEqual(question.choices[0]);
  });

  test("check renamed has... properties", () => {
    const question = new QuestionCheckboxModel("q1");
    expect(question.showNoneItem).toBeFalsy();
    expect(question.showSelectAllItem).toBeFalsy();
    expect(question.showOtherItem).toBeFalsy();
    expect(question.hasComment).toBeFalsy();
    expect(question.showCommentArea).toBeFalsy();

    expect(question.showNoneItem).toBeFalsy();
    expect(question.showSelectAllItem).toBeFalsy();
    expect(question.showOtherItem).toBeFalsy();
    expect(question.showCommentArea).toBeFalsy();

    question.showNoneItem = true;
    expect(question.showNoneItem).toBeTruthy();
    expect(question.showNoneItem).toBeTruthy();
    question.showNoneItem = false;
    expect(question.showNoneItem).toBeFalsy();
    expect(question.showNoneItem).toBeFalsy();

    question.showSelectAllItem = true;
    expect(question.showSelectAllItem).toBeTruthy();
    expect(question.showSelectAllItem).toBeTruthy();
    question.showSelectAllItem = false;
    expect(question.showSelectAllItem).toBeFalsy();
    expect(question.showSelectAllItem).toBeFalsy();

    question.showOtherItem = true;
    expect(question.showOtherItem).toBeTruthy();
    expect(question.showOtherItem).toBeTruthy();
    question.showOtherItem = false;
    expect(question.showOtherItem).toBeFalsy();
    expect(question.showOtherItem).toBeFalsy();

    question.showCommentArea = true;
    expect(question.showCommentArea).toBeTruthy();
    expect(question.hasComment).toBeTruthy();
    question.hasComment = false;
    expect(question.showCommentArea).toBeFalsy();
    expect(question.hasComment).toBeFalsy();
  });
  test("checkbox selectAllItem isEnabled and maxSelectedChoices", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "checkbox",
          name: "q1",
          choices: ["apple", "banana", "orange"],
          "showSelectAllItem": true
        }
      ]
    });
    const q = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    expect(q.selectAllItem.isEnabled, "selectAllItem is enabled").toLooseEqual(true);
    q.maxSelectedChoices = 2;
    expect(q.selectAllItem.isEnabled, "selectAllItem is disabled").toLooseEqual(false);
    q.maxSelectedChoices = 0;
    expect(q.selectAllItem.isEnabled, "selectAllItem is enabled again").toLooseEqual(true);
  });
  test("selectbase and otherValue/comment", () => {
    const survey = new SurveyModel({ elements: [{ type: "dropdown", name: "q1", showOtherItem: true, choices: [1, 2, 3] }] });
    const question = <QuestionSelectBase>survey.getQuestionByName("q1");
    expect(question.otherValue, "otherValue, #1").toBeFalsy();
    expect(question.comment, "comment, #2").toBeFalsy();
    question.otherValue = "val1";
    expect("val1", "other value, #3").toLooseEqual(question.otherValue);
    expect("val1", "comment, #4").toLooseEqual(question.comment);
    question.comment = "val2";
    expect("val2", "other value, #5").toLooseEqual(question.otherValue);
    expect("val2", "comment, #6").toLooseEqual(question.comment);
    question.showCommentArea = true;
    expect(true, "showCommentArea is true").toLooseEqual(question.showCommentArea);
    expect(true, "showOtherItem is true").toLooseEqual(question.showOtherItem);
    expect(false, "getStoreOthersAsComment() is false").toLooseEqual(question.getStoreOthersAsComment());
    expect(question.otherValue, "other value, #7").toBeFalsy();
    expect("val2", "comment, #8").toLooseEqual(question.comment);
    expect(question.selectedItem, "selectedItem #1").toBeFalsy();
    question.value = "other";
    question.otherValue = "val3";
    expect("val3", "other value, #9").toLooseEqual(question.otherValue);
    expect("val3", "question value, #10").toLooseEqual(question.value);
    expect("val2", "comment, #11").toLooseEqual(question.comment);
    expect(question.selectedItem.value, "selectedItem #2").toLooseEqual("other");
    question.comment = "val4";
    expect("val3", "other value, #12").toLooseEqual(question.otherValue);
    expect("val3", "question value, #13").toLooseEqual(question.value);
    expect(question.selectedItem.value, "selectedItem #3").toLooseEqual("other");
    expect("val4", "comment, #14").toLooseEqual(question.comment);

    question.otherValue = "";
    question.value = "other";
    expect(true, "isOtherSelected, #1").toLooseEqual(question.isOtherSelected);
    expect(question.selectedItem.value, "selectedItem #4").toLooseEqual("other");
    expect(question.otherValue, "other value, #15").toBeFalsy();
    expect(false, "supportGoNextPageError, #1").toLooseEqual(question.supportGoNextPageError());
    question.comment = "";
    expect(false, "supportGoNextPageError, #2").toLooseEqual(question.supportGoNextPageError());
    question.otherValue = "val5";
    expect(true, "supportGoNextPageError, #3").toLooseEqual(question.supportGoNextPageError());

    question.comment = "test";
    survey.data = { q1: "val6" };
    expect("val6", "other value, #16").toLooseEqual(question.otherValue);
    expect("val6", "question value, #17").toLooseEqual(question.value);
    expect("", "comment, #18").toLooseEqual(question.comment);
    expect(survey.data, "survey data, #1").toEqualValues({ q1: "val6" });

    question.showCommentArea = false;
    question.storeOthersAsComment = false;
    survey.data = { q1: "val7" };
    expect("val7", "other value, #19").toLooseEqual(question.otherValue);
    expect("val7", "question value, #20").toLooseEqual(question.value);
    expect("val7", "comment, #21").toLooseEqual(question.comment);
    expect(question.selectedItem.value, "selectedItem #5").toLooseEqual("other");
    expect(survey.data, "survey data, #2").toEqualValues({ q1: "val7" });

    question.showCommentArea = true;
    question.value = "other";
    question.otherValue = "a";
    expect("a", "other value, #22").toLooseEqual(question.otherValue);
    expect(question.selectedItem.value, "selectedItem #6").toLooseEqual("other");
    expect("a", "question value, #23").toLooseEqual(question.value);
    expect("", "comment, #24").toLooseEqual(question.comment);
  });
  test("selectbase and otherValue/comment + same values", () => {
    const survey = new SurveyModel({ elements: [
      { type: "dropdown", name: "q1", showOtherItem: true, showCommentArea: true, choices: ["item1", "item2", "item3"] },
      { type: "checkbox", name: "q2", showOtherItem: true, showCommentArea: true, choices: ["item1", "item2", "item3"] }
    ] });
    const q1 = <QuestionSelectBase>survey.getQuestionByName("q1");
    const q2 = <QuestionSelectBase>survey.getQuestionByName("q2");
    q1.renderedValue = "other";
    q1.otherValue = "a";
    expect("a", "q1 value, #1").toLooseEqual(q1.value);
    expect("a", "q1 otherValue, #2").toLooseEqual(q1.otherValue);
    q1.otherValue = "item2";
    expect("other", "q1 value, #3").toLooseEqual(q1.value);
    expect("item2", "q1 otherValue, #4").toLooseEqual(q1.otherValue);
    q1.otherValue = "item22";
    expect("item22", "q1 value, #5").toLooseEqual(q1.value);
    expect("item22", "q1 otherValue, #6").toLooseEqual(q1.otherValue);
    q2.renderedValue = ["other"];
    q2.otherValue = "a";
    expect(["a"], "q2 value, #1").toEqualValues(q2.value);
    expect("a", "q2 otherValue, #2").toLooseEqual(q2.otherValue);
    q2.otherValue = "item3";
    expect(["other"], "q2 value, #3").toEqualValues(q2.value);
    expect("item3", "q2 otherValue, #4").toLooseEqual(q2.otherValue);
    q2.otherValue = "item33";
    expect(["item33"], "q2 value, #5").toEqualValues(q2.value);
    expect("item33", "q2 otherValue, #6").toLooseEqual(q2.otherValue);
  });
  test("selectbase, showOtherItem & checkErrorsMode: 'onValueChanged'", () => {
    const survey = new SurveyModel({ elements: [
      { type: "radiogroup", name: "q1", showOtherItem: true, choices: ["item1", "item2", "item3"] },
    ], checkErrorsMode: "onValueChanged" });
    const q1 = <QuestionSelectBase>survey.getQuestionByName("q1");
    q1.renderedValue = "other";
    expect(q1.errors.length, "We do not have errors yet").toLooseEqual(0);
    survey.tryComplete();
    expect(q1.errors.length, "There is an error").toLooseEqual(1);
    expect(survey.state, "Still running").toLooseEqual("running");
  });
  test("selectbase, otherValue&question-Comment", () => {
    const survey = new SurveyModel({ elements: [
      { type: "dropdown", name: "q1", showOtherItem: true, choices: ["item1", "item2", "item3"] },
      { type: "checkbox", name: "q2", showOtherItem: true, choices: ["item1", "item2", "item3"] }
    ] });
    const q1 = <QuestionSelectBase>survey.getQuestionByName("q1");
    const q2 = <QuestionSelectBase>survey.getQuestionByName("q2");
    q1.renderedValue = "other";
    q1.otherValue = "val1";
    q2.renderedValue = ["other"];
    q2.otherValue = "val2";
    const data = { q1: "other", "q1-Comment": "val1", q2: ["other"], "q2-Comment": "val2" };
    expect(survey.data, "before complete").toEqualValues(data);
    survey.doComplete();
    expect(survey.data, "after complete").toEqualValues(data);
  });
  test("quesstion commentId/otherId", () => {
    const q1 = new QuestionCheckboxModel("q1");
    expect(q1.commentId, "Comment id").toLooseEqual(q1.id + "_comment");
    expect(q1.otherId, "Other id").toLooseEqual(q1.id + "_" + q1.otherItem.uniqueId);
  });
  test("selectbase, otherValue&question-Comment", () => {
    const survey = new SurveyModel({ elements: [
      { type: "dropdown", name: "q1", showNoneItem: true, choices: [1, 2, 3], noneText: "Not Available" }
    ] });
    const q1 = <QuestionDropdownModel>survey.getQuestionByName("q1");
    q1.noneItem.value = "no value";
    const item = q1.dropdownListModel["listModel"].actions[3];
    expect(item.id, "choice item is correct").toLooseEqual("no value");
    q1.renderedValue = item.id;
    expect(q1.isItemSelected(q1.noneItem), "non item is selected").toLooseEqual(true);
    survey.clearIncorrectValues();
    expect(q1.value, "question value is correct").toLooseEqual("no value");
    expect(survey.data, "survey.data is correct").toEqualValues({ q1: "no value" });
  });
  test("SelectBase visibleChoices order", () => {
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({ elements: [
      { type: "dropdown", name: "q1", choicesOrder: "asc", choices: ["B", "A", "D", "C"] }
    ] });
    const question = <QuestionSelectBase>survey.getQuestionByName("q1");
    expect(question.visibleChoices.length, "There are 4 items").toLooseEqual(7);
    expect(question.visibleChoices[0].value, "the first item").toLooseEqual("B");
    expect(question.visibleChoices[3].value, "the last item").toLooseEqual("C");
  });
  test("choicesFromQuestion & showNoneItem", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "checkbox", name: "q1", choices: [1, 2, 3], showNoneItem: true },
        { type: "checkbox", name: "q2", choicesFromQuestion: "q1", showNoneItem: true },
        { type: "checkbox", name: "q3", choicesFromQuestion: "q1" },
      ],
    });
    const q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    const q2 = <QuestionCheckboxModel>survey.getQuestionByName("q2");
    const q3 = <QuestionCheckboxModel>survey.getQuestionByName("q3");
    expect(q1.visibleChoices.length, "q1 length").toLooseEqual(4);
    expect(q2.visibleChoices.length, "q2 length").toLooseEqual(4);
    expect(q3.visibleChoices.length, "q3 length").toLooseEqual(3);
    expect(q1.visibleChoices[3].value, "q1 none").toLooseEqual("none");
    expect(q2.visibleChoices[3].value, "q2 none").toLooseEqual("none");
  });
  test("choicesFromQuestion & showOtherItem", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "checkbox", name: "q1", choices: [1, 2, 3], showOtherItem: true },
        { type: "checkbox", name: "q2", choicesFromQuestion: "q1", showOtherItem: true },
        { type: "checkbox", name: "q3", choicesFromQuestion: "q1" },
      ],
    });
    const q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    q1.value = [1, 2, "other"];
    q1.otherValue = "other comment";
    const q2 = <QuestionCheckboxModel>survey.getQuestionByName("q2");
    const q3 = <QuestionCheckboxModel>survey.getQuestionByName("q3");
    expect(q1.visibleChoices.length, "q1 length").toLooseEqual(4);
    expect(q2.visibleChoices.length, "q2 length").toLooseEqual(4);
    expect(q3.visibleChoices.length, "q3 length").toLooseEqual(3);
    expect(q1.visibleChoices[3].value, "q1 other").toLooseEqual("other");
    expect(q2.visibleChoices[3].value, "q2 other").toLooseEqual("other");
  });
  test("choicesFromQuestion & showNoneItem & mode=selected", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "checkbox", name: "q1", choices: [1, 2, 3], showNoneItem: true },
        { type: "checkbox", name: "q2", choicesFromQuestion: "q1", choicesFromQuestionMode: "selected", showNoneItem: true },
        { type: "checkbox", name: "q3", choicesFromQuestion: "q1", choicesFromQuestionMode: "selected" },
      ],
    });
    const q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    const q2 = <QuestionCheckboxModel>survey.getQuestionByName("q2");
    const q3 = <QuestionCheckboxModel>survey.getQuestionByName("q3");
    q1.value = [1, 2, 3];
    expect(q2.visibleChoices.length, "q2 length").toLooseEqual(4);
    expect(q3.visibleChoices.length, "q3 length").toLooseEqual(3);
    expect(q2.visibleChoices[3].value, "q2 none").toLooseEqual("none");
    q1.value = ["none"];
    expect(q2.visibleChoices.length, "q2 length, #1").toLooseEqual(1);
    expect(q3.visibleChoices.length, "q3 length, #2").toLooseEqual(0);
    expect(q2.visibleChoices[0].value, "q2 none").toLooseEqual("none");
  });
  test("choicesFromQuestion & choicesVisibleIf", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "checkbox", name: "q1", choices: [1, 2, 3] },
        { type: "checkbox", name: "q2", choicesFromQuestion: "q1", choicesVisibleIf: "{item} > 1" },
        { type: "checkbox", name: "q3", choicesFromQuestion: "q1", choicesVisibleIf: "{item} > 1", choicesFromQuestionMode: "selected" },
      ],
    });
    const q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    const q2 = <QuestionCheckboxModel>survey.getQuestionByName("q2");
    const q3 = <QuestionCheckboxModel>survey.getQuestionByName("q3");
    q1.value = [1, 2];
    expect(q2.visibleChoices.length, "q2 length").toLooseEqual(2);
    expect(q2.visibleChoices[0].value, "q2 choices[0]").toLooseEqual(2);
    expect(q2.visibleChoices[1].value, "q2 choices[1]").toLooseEqual(3);
    expect(q3.visibleChoices.length, "q3 length").toLooseEqual(1);
    expect(q3.visibleChoices[0].value, "q3 choices[0]").toLooseEqual(2);
    q1.value = [1, 2, 3];
    expect(q2.visibleChoices.length, "q2 length, #2").toLooseEqual(2);
    expect(q2.visibleChoices[0].value, "q2 choices[0], #2").toLooseEqual(2);
    expect(q2.visibleChoices[1].value, "q2 choices[1], #2").toLooseEqual(3);
    expect(q3.visibleChoices.length, "q3 length, #2").toLooseEqual(2);
    expect(q3.visibleChoices[0].value, "q3 choices[0], #2").toLooseEqual(2);
    expect(q3.visibleChoices[1].value, "q3 choices[1], #2").toLooseEqual(3);
  });
  test("Use {$item.prop} in expression", () => {
    Serializer.addProperty("itemvalue", "prop1:number");
    const survey = new SurveyModel({
      elements: [
        { type: "radiogroup", name: "q1", choices: [1, 2, 3] },
        { type: "checkbox", name: "q2", choices: [{ value: 1, prop1: 1 }, { value: 2, prop1: 2 }, { value: 3, prop1: 3 }], choicesVisibleIf: "{$item.prop1} = {q1}" }
      ],
    });
    const q1 = <QuestionRadiogroupModel>survey.getQuestionByName("q1");
    const q2 = <QuestionCheckboxModel>survey.getQuestionByName("q2");
    expect(q2.visibleChoices.length, "q2 visibleChoices length #1").toLooseEqual(0);
    q1.value = 2;
    expect(q2.visibleChoices.length, "q2 visibleChoices length #2").toLooseEqual(1);
    expect(q2.visibleChoices[0].value, "q2 visibleChoices[0] value").toLooseEqual(2);
    q1.value = 3;
    expect(q2.visibleChoices.length, "q2 visibleChoices length #3").toLooseEqual(1);
    expect(q2.visibleChoices[0].value, "q2 visibleChoices[0] value #2").toLooseEqual(3);
    Serializer.removeProperty("itemvalue", "prop1");
  });
  test("choicesFromQuestion & showOtherItem & mode=selected", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "checkbox", name: "q1", choices: [1, 2, 3], showOtherItem: true },
        { type: "checkbox", name: "q2", choicesFromQuestion: "q1", choicesFromQuestionMode: "selected", showOtherItem: true },
        { type: "checkbox", name: "q3", choicesFromQuestion: "q1", choicesFromQuestionMode: "selected" },
      ],
    });
    const q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    const q2 = <QuestionCheckboxModel>survey.getQuestionByName("q2");
    const q3 = <QuestionCheckboxModel>survey.getQuestionByName("q3");
    q1.value = [1, 2, 3];
    expect(q2.visibleChoices.length, "q2 length").toLooseEqual(4);
    expect(q3.visibleChoices.length, "q3 length").toLooseEqual(3);
    expect(q2.visibleChoices[3].value, "q2 other").toLooseEqual("other");
    q1.value = [1, 2, 3, "other"];
    q1.otherValue = "other comment";
    expect(q2.visibleChoices.length, "q2 length").toLooseEqual(4);
    expect(q3.visibleChoices.length, "q3 length").toLooseEqual(4);
    expect(q2.visibleChoices[3].value, "q2 other").toLooseEqual("other");
    expect(q3.visibleChoices[3].value, "q3 other").toLooseEqual("other");
  });
  test("Check isUsingCarryForward on changing question name", () => {
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({ elements: [
      { type: "dropdown", name: "q1", choices: ["B", "A", "D", "C"] },
      { type: "dropdown", name: "q2", choicesFromQuestion: "q1" }
    ] });
    const q1 = <QuestionSelectBase>survey.getQuestionByName("q1");
    const q2 = <QuestionSelectBase>survey.getQuestionByName("q2");
    survey.onPropertyValueChangedCallback = (name: string, oldValue: any, newValue: any, target: any, arrayChanges: any) => {
      if (target === q1 && name === "name") {
        q2.choicesFromQuestion = newValue;
      }
    };
    expect(q2.isUsingCarryForward, "Carryforward flag is set, #1").toLooseEqual(true);
    q1.name = "q111";
    expect(q2.choicesFromQuestion, "property is updated with new question name").toLooseEqual("q111");
    expect(q2.isUsingCarryForward, "Carryforward flag is set, #2").toLooseEqual(true);
  });
  test("Carry Forward and localization, bug#6352", () => {
    surveyLocalization.defaultLocale = "de";
    const survey = new SurveyModel({ locale: "en", elements: [
      { type: "dropdown", name: "q1", choices: [{ value: "A", text: { default: "A de", en: "A en" } }] },
      { type: "dropdown", name: "q2", choicesFromQuestion: "q1" }
    ] });
    const q2 = <QuestionSelectBase>survey.getQuestionByName("q2");
    expect(q2.visibleChoices.length).toLooseEqual(1);
    expect(q2.visibleChoices[0].locText.getJson()).toEqualValues({ default: "A de", en: "A en" });
    expect(q2.visibleChoices[0].text).toLooseEqual("A en");
    let counter = 0;
    q2.visibleChoices[0].locText.onStringChanged.add((sender, options) => {
      counter ++;
    });
    survey.locale = "de";
    expect(counter, "Fire str changed").toLooseEqual(1);
    surveyLocalization.defaultLocale = "en";
  });
  test("Carry Forward and keepIncorrectValues, bug#6490", () => {
    const survey = new SurveyModel({ elements: [
      { type: "dropdown", name: "q1", choices: ["A", "B", "C", "D"] },
      { type: "dropdown", name: "q2", choicesFromQuestion: "q1" }
    ] });
    survey.keepIncorrectValues = true;
    survey.data = { q1: "A", q2: "X" };
    const q1 = survey.getQuestionByName("q1");
    const q2 = <QuestionSelectBase>survey.getQuestionByName("q2");
    q1.value = "B";
    expect(q2.value, "keep value").toLooseEqual("X");
    survey.doComplete();
    expect(survey.data, "keep value on compete").toEqualValues({ q1: "B", q2: "X" });
  });
  test("Check isUsingCarryForward on deleting question", () => {
    const survey = new SurveyModel();
    const defaultValueProp = Serializer.findProperty("dropdown", "defaultValue");
    const correctAnswerProp = Serializer.findProperty("dropdown", "correctAnswer");
    survey.setDesignMode(true);
    survey.fromJSON({ elements: [
      { type: "dropdown", name: "q1", choices: ["B", "A", "D", "C"] },
      { type: "dropdown", name: "q2", choicesFromQuestion: "q1" }
    ] });
    const q1 = <QuestionSelectBase>survey.getQuestionByName("q1");
    const q2 = <QuestionSelectBase>survey.getQuestionByName("q2");
    expect(q2.choicesFromQuestion, "set correctly").toLooseEqual("q1");
    expect(q2.isUsingCarryForward, "Carryforward flag is set").toLooseEqual(true);
    expect(defaultValueProp.isVisible("", q2), "defaultValueProp.isVisible #1").toLooseEqual(false);
    expect(correctAnswerProp.isVisible("", q2), "correctAnswerProp.isVisible #1").toLooseEqual(false);

    q1.delete();
    expect(q2.choicesFromQuestion, "it is empty").toBeFalsy();
    expect(q2.isUsingCarryForward, "Carryforward flag is unset").toLooseEqual(false);
    expect(defaultValueProp.isVisible("", q2), "defaultValueProp.isVisible #2").toLooseEqual(true);
    expect(correctAnswerProp.isVisible("", q2), "correctAnswerProp.isVisible #2").toLooseEqual(true);
  });
  test("Do not notify survey on changing newItem.value", () => {

    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({
      elements: [{ type: "checkbox", name: "q", choices: [1] }]
    });
    const q = <QuestionCheckboxModel>survey.getQuestionByName("q");
    expect(q.visibleChoices.length, "#0").toLooseEqual(1 + 4);
    let counter = 0;
    survey.onPropertyValueChangedCallback = (
      name: string,
      oldValue: any,
      newValue: any,
      sender: Base,
      arrayChanges: any
    ) => {
      counter++;
    };
    expect(counter, "#1").toLooseEqual(0);
    q.choices[0].value = 2;
    expect(counter, "#2").toLooseEqual(1);
    q.selectAllItem.text = "Sel";
    expect(counter, "#3").toLooseEqual(2);
    q.newItem.text = "item 2";
    expect(counter, "Do not react on newItem properties changes, #4").toLooseEqual(2);
  });
  test("Remove newItem from the list if it is false", () => {

    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({
      elements: [{ type: "checkbox", name: "q", choices: [1] }]
    });
    const q = <QuestionCheckboxModel>survey.getQuestionByName("q");
    expect(q.visibleChoices.length, "#1").toLooseEqual(1 + 4);
    q.newItem.setIsVisible(false);
    expect(q.visibleChoices.length, "#2").toLooseEqual(1 + 3);
    q.newItem.setIsVisible(true);
    expect(q.visibleChoices.length, "#3").toLooseEqual(1 + 4);
  });
  test("displayValue & otherItem", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "dropdown", name: "q1", choices: [1], showOtherItem: true },
        { type: "checkbox", name: "q2", choices: [1], showOtherItem: true }
      ]
    });
    const q1 = <QuestionDropdownModel>survey.getQuestionByName("q1");
    const q2 = <QuestionCheckboxModel>survey.getQuestionByName("q2");
    q1.value = "other";
    expect(q1.displayValue, "#1").toLooseEqual("Other (describe)");
    q1.otherValue = "Some comments";
    expect(q1.displayValue, "#2").toLooseEqual("Some comments");
    q2.value = ["other", 1];
    q2.otherValue = "";
    expect(q2.displayValue, "#3").toLooseEqual("Other (describe), 1");
    q2.otherValue = "Some comments";
    expect(q2.displayValue, "#4").toLooseEqual("Some comments, 1");
  });
  test("Use carryForward with matrix dynamic", () => {
    const survey = new SurveyModel({ elements: [
      { type: "matrixdynamic", name: "q1", columns: [{ name: "col1", cellType: "text" }] },
      { type: "checkbox", name: "q2", choicesFromQuestion: "q1" }
    ] });
    const q1 = <QuestionMatrixDynamicModel>survey.getQuestionByName("q1");
    const q2 = <QuestionSelectBase>survey.getQuestionByName("q2");
    expect(q2.choicesFromQuestion, "choicesFromQuestion is set").toLooseEqual("q1");
    expect(q2.isUsingCarryForward, "Carryforward flag is set").toLooseEqual(true);
    expect(q2.visibleChoices.length, "There is no choices").toLooseEqual(0);
    expect(q2.visibleChoices.length, "There is no choices, row is empty").toLooseEqual(0);
    q1.visibleRows[0].cells[0].value = "A";
    expect(survey.data, "survey.data is correct").toEqualValues({ q1: [{ col1: "A" }, {}] });
    expect(q2.visibleChoices.length, "There is one choice").toLooseEqual(1);
    expect(q2.visibleChoices[0].value, "the first value is correct").toLooseEqual("A");
    q1.visibleRows[1].cells[0].value = "B";
    expect(q2.visibleChoices.length, "There are two choice").toLooseEqual(2);
    expect(q2.visibleChoices[1].value, "the second value is correct").toLooseEqual("B");
    q1.addRow();
    expect(q2.visibleChoices.length, "There are two choice, new row is empty").toLooseEqual(2);
    q1.visibleRows[2].cells[0].value = "C";
    expect(survey.data, "survey.data is correct, #2").toEqualValues({ q1: [{ col1: "A" }, { col1: "B" }, { col1: "C" }] });
    expect(q2.visibleChoices.length, "There are three choice").toLooseEqual(3);
    expect(q2.visibleChoices[2].value, "the third value is correct").toLooseEqual("C");
  });

  test("Use carryForward with matrix dynamic + choiceValuesFromQuestion", () => {
    const survey = new SurveyModel({ elements: [
      { type: "matrixdynamic", name: "q1", columns: [{ name: "col1", cellType: "text" }, { name: "col2", cellType: "text" }] },
      { type: "checkbox", name: "q2", choicesFromQuestion: "q1", choiceValuesFromQuestion: "col2" }
    ] });
    const q1 = <QuestionMatrixDynamicModel>survey.getQuestionByName("q1");
    const q2 = <QuestionSelectBase>survey.getQuestionByName("q2");
    expect(q2.choicesFromQuestion, "choicesFromQuestion is set").toLooseEqual("q1");
    expect(q2.choiceValuesFromQuestion, "choiceValuesFromQuestion is set").toLooseEqual("col2");
    expect(q2.isUsingCarryForward, "Carryforward flag is set").toLooseEqual(true);
    expect(q2.visibleChoices.length, "There is no choices").toLooseEqual(0);
    expect(q2.visibleChoices.length, "There is no choices, row is empty").toLooseEqual(0);
    q1.visibleRows[0].cells[0].value = "A";
    expect(q2.visibleChoices.length, "There is no choices, col2 is empty").toLooseEqual(0);
    q1.visibleRows[0].cells[1].value = "AA";
    expect(q2.visibleChoices.length, "There is one choice").toLooseEqual(1);
    expect(q2.visibleChoices[0].value, "the first value is correct").toLooseEqual("AA");
    q1.visibleRows[1].cells[0].value = "B";
    q1.visibleRows[1].cells[1].value = "BB";
    expect(q2.visibleChoices.length, "There are two choice").toLooseEqual(2);
    expect(q2.visibleChoices[1].value, "the second value is correct").toLooseEqual("BB");
    q1.addRow();
    expect(q2.visibleChoices.length, "There are two choice, new row is empty").toLooseEqual(2);
    q1.visibleRows[2].cells[0].value = "C";
    expect(q2.visibleChoices.length, "There are two choice, col2 is empty").toLooseEqual(2);
    q1.visibleRows[2].cells[1].value = "CC";
    expect(q2.visibleChoices.length, "There are three choice").toLooseEqual(3);
    expect(q2.visibleChoices[2].value, "the third value is correct").toLooseEqual("CC");
  });
  test("Use carryForward with matrix dynamic & expression value + choiceValuesFromQuestion, Bug#10859", () => {
    const survey = new SurveyModel({ elements: [
      { type: "matrixdynamic", name: "q1",
        columns: [
          { name: "col1", cellType: "text" },
          { name: "col2", cellType: "text" },
          { name: "col3", cellType: "expression", expression: "iif({row.col1} notempty and {row.col2} notempty, {row.col1} + '-' + {row.col2}, '')" }
        ] },
      { type: "checkbox", name: "q2", choicesFromQuestion: "q1", choiceValuesFromQuestion: "col3" }
    ] });
    const q1 = <QuestionMatrixDynamicModel>survey.getQuestionByName("q1");
    const q2 = <QuestionSelectBase>survey.getQuestionByName("q2");
    expect(q2.choicesFromQuestion, "choicesFromQuestion is set").toLooseEqual("q1");
    expect(q2.choiceValuesFromQuestion, "choiceValuesFromQuestion is set").toLooseEqual("col3");
    expect(q2.visibleChoices.length, "There is no choices").toLooseEqual(0);
    q1.visibleRows[0].cells[0].value = "A";
    expect(q2.visibleChoices.length, "There is no choices, col2 is empty").toLooseEqual(0);
    q1.visibleRows[0].cells[1].value = "AA";
    expect(q1.visibleRows[0].getValue("col3"), "The expression value is correct").toLooseEqual("A-AA");
    expect(q2.visibleChoices.length, "There is one choice").toLooseEqual(1);
    expect(q2.visibleChoices[0].value, "the first value is correct").toLooseEqual("A-AA");
    q1.visibleRows[1].cells[0].value = "B";
    q1.visibleRows[1].cells[1].value = "BB";
    expect(q2.visibleChoices.length, "There are two choice").toLooseEqual(2);
    expect(q2.visibleChoices[1].value, "the second value is correct").toLooseEqual("B-BB");
    q1.addRow();
    expect(q2.visibleChoices.length, "There are two choice, new row is empty").toLooseEqual(2);
    q1.visibleRows[2].cells[0].value = "C";
    expect(q2.visibleChoices.length, "There are two choice, col2 is empty").toLooseEqual(2);
    q1.visibleRows[2].cells[1].value = "CC";
    expect(q2.visibleChoices.length, "There are three choice").toLooseEqual(3);
    expect(q2.visibleChoices[2].value, "the third value is correct").toLooseEqual("C-CC");
  });
  test("Use carryForward with panel dynamic & expression value + choiceValuesFromQuestion, Bug#10859", () => {
    const survey = new SurveyModel({ elements: [
      { type: "paneldynamic", name: "q1",
        templateElements: [
          { name: "col1", type: "text" },
          { name: "col2", type: "text" },
          { name: "col3", type: "expression", expression: "iif({panel.col1} notempty and {panel.col2} notempty, {panel.col1} + '-' + {panel.col2}, '')" }
        ] },
      { type: "checkbox", name: "q2", choicesFromQuestion: "q1", choiceValuesFromQuestion: "col3" }
    ] });
    const q1 = <QuestionPanelDynamicModel>survey.getQuestionByName("q1");
    const q2 = <QuestionSelectBase>survey.getQuestionByName("q2");
    expect(q2.choicesFromQuestion, "choicesFromQuestion is set").toLooseEqual("q1");
    expect(q2.choiceValuesFromQuestion, "choiceValuesFromQuestion is set").toLooseEqual("col3");
    expect(q2.visibleChoices.length, "There is no choices").toLooseEqual(0);
    let panel = q1.addPanel();
    panel.questions[0].value = "A";
    expect(q2.visibleChoices.length, "There is no choices, col2 is empty").toLooseEqual(0);
    panel.questions[1].value = "AA";
    expect(panel.getQuestionByName("col3").value, "The expression value is correct").toLooseEqual("A-AA");
    expect(q2.visibleChoices.length, "There is one choice").toLooseEqual(1);
    expect(q2.visibleChoices[0].value, "the first value is correct").toLooseEqual("A-AA");
    panel = q1.addPanel();
    panel.questions[0].value = "B";
    panel.questions[1].value = "BB";
    expect(q2.visibleChoices.length, "There are two choice").toLooseEqual(2);
    expect(q2.visibleChoices[1].value, "the second value is correct").toLooseEqual("B-BB");
    panel = q1.addPanel();
    expect(q2.visibleChoices.length, "There are two choice, new panel is empty").toLooseEqual(2);
    panel.questions[0].value = "C";
    expect(q2.visibleChoices.length, "There are two choice, col2 is empty").toLooseEqual(2);
    panel.questions[1].value = "CC";
    expect(q2.visibleChoices.length, "There are three choice").toLooseEqual(3);
    expect(q2.visibleChoices[2].value, "the third value is correct").toLooseEqual("C-CC");
  });
  test("Use carryForward with panel dynamic + choiceValuesFromQuestion&choiceTextsFromQuestion", () => {
    const survey = new SurveyModel({ elements: [
      { type: "paneldynamic", name: "q1", panelCount: 2,
        templateElements: [{ name: "q1-q1", type: "text" }, { name: "q1-q2", type: "text" }, { name: "q1-q3", type: "text" }]
      },
      { type: "checkbox", name: "q2", choicesFromQuestion: "q1", choiceValuesFromQuestion: "q1-q2", choiceTextsFromQuestion: "q1-q3" }
    ] });
    const q1 = <QuestionPanelDynamicModel>survey.getQuestionByName("q1");
    const q2 = <QuestionSelectBase>survey.getQuestionByName("q2");
    expect(q2.choicesFromQuestion, "choicesFromQuestion is set").toLooseEqual("q1");
    expect(q2.choiceValuesFromQuestion, "choiceValuesFromQuestion is set").toLooseEqual("q1-q2");
    expect(q2.choiceTextsFromQuestion, "choiceTextsFromQuestion is set").toLooseEqual("q1-q3");
    expect(q2.isUsingCarryForward, "Carryforward flag is set").toLooseEqual(true);
    expect(q2.visibleChoices.length, "There is no choices").toLooseEqual(0);
    q1.panels[0].getQuestionByName("q1-q1").value = "A";
    expect(q2.visibleChoices.length, "There is no choices, q1-q2 is empty").toLooseEqual(0);
    q1.panels[0].getQuestionByName("q1-q2").value = "AA";
    q1.panels[0].getQuestionByName("q1-q3").value = "AA-aa";
    expect(q2.visibleChoices.length, "There is one choice").toLooseEqual(1);
    expect(q2.visibleChoices[0].value, "the first value is correct").toLooseEqual("AA");
    expect(q2.visibleChoices[0].text, "the first text is correct").toLooseEqual("AA-aa");
    q1.panels[1].getQuestionByName("q1-q1").value = "B";
    q1.panels[1].getQuestionByName("q1-q2").value = "BB";
    q1.panels[1].getQuestionByName("q1-q3").value = "BB-bb";
    expect(q2.visibleChoices.length, "There are two choice").toLooseEqual(2);
    expect(q2.visibleChoices[1].value, "the second value is correct").toLooseEqual("BB");
    expect(q2.visibleChoices[1].text, "the second text is correct").toLooseEqual("BB-bb");
    q1.addPanel();
    expect(q2.visibleChoices.length, "There are two choice, new panel is empty").toLooseEqual(2);
    q1.panels[2].getQuestionByName("q1-q1").value = "C";
    expect(q2.visibleChoices.length, "There are two choice, q1-q2 is empty").toLooseEqual(2);
    q1.panels[2].getQuestionByName("q1-q2").value = "CC";
    q1.panels[2].getQuestionByName("q1-q3").value = "CC-cc";
    expect(q2.visibleChoices.length, "There are three choice").toLooseEqual(3);
    expect(q2.visibleChoices[2].value, "the third value is correct").toLooseEqual("CC");
    expect(q2.visibleChoices[2].text, "the third text is correct").toLooseEqual("CC-cc");
  });
  test("Check isUsingCarryForward on deleting matrix dynamic question", () => {
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({ elements: [
      { type: "matrixdynamic", name: "q1" },
      { type: "dropdown", name: "q2", choicesFromQuestion: "q1" }
    ] });
    const q1 = <QuestionSelectBase>survey.getQuestionByName("q1");
    const q2 = <QuestionSelectBase>survey.getQuestionByName("q2");
    expect(q2.choicesFromQuestion, "set correctly").toLooseEqual("q1");
    expect(q2.isUsingCarryForward, "Carryforward flag is set").toLooseEqual(true);
    q1.delete();
    expect(q2.choicesFromQuestion, "it is empty").toBeFalsy();
    expect(q2.isUsingCarryForward, "Carryforward flag is unset").toLooseEqual(false);
  });
  test("Check isUsingCarryForward on deleting matrix dynamic question with doDispose = false parameter", () => {
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({ elements: [
      { type: "matrixdynamic", name: "q1" },
      { type: "dropdown", name: "q2", choicesFromQuestion: "q1" }
    ] });
    const q1 = <QuestionSelectBase>survey.getQuestionByName("q1");
    const q2 = <QuestionSelectBase>survey.getQuestionByName("q2");
    expect(q2.choicesFromQuestion, "set correctly").toLooseEqual("q1");
    expect(q2.isUsingCarryForward, "Carryforward flag is set").toLooseEqual(true);
    q1.delete(false);
    expect(q2.choicesFromQuestion, "it is empty").toBeFalsy();
    expect(q2.isUsingCarryForward, "Carryforward flag is unset").toLooseEqual(false);
  });
  test("Use carryForward with panel dynamic + update data on survey.data=data;", () => {
    const survey = new SurveyModel({ elements: [
      { type: "checkbox", name: "q2", choicesFromQuestion: "q1", choiceValuesFromQuestion: "q1-q2", choiceTextsFromQuestion: "q1-q3" },
      { type: "paneldynamic", name: "q1", panelCount: 2,
        templateElements: [{ name: "q1-q1", type: "text" }, { name: "q1-q2", type: "text" }, { name: "q1-q3", type: "text" }]
      }
    ] });
    const q1 = <QuestionPanelDynamicModel>survey.getQuestionByName("q1");
    const q2 = <QuestionSelectBase>survey.getQuestionByName("q2");
    survey.data = { q1: [{ "q1-q2": 1, "q1-q3": "Item 1" }, { "q1-q2": 2, "q1-q3": "Item 2" }] };
    expect(q2.visibleChoices.length, "Create choices").toLooseEqual(2);
    expect(q2.visibleChoices[0].value, "the first value is correct").toLooseEqual(1);
    expect(q2.visibleChoices[0].text, "the first text is correct").toLooseEqual("Item 1");
    expect(q2.visibleChoices[1].value, "the second value is correct").toLooseEqual(2);
    expect(q2.visibleChoices[1].text, "the second text is correct").toLooseEqual("Item 2");
  });
  test("Use carryForward with matrix dynamic & choicesVisibleIf", () => {
    const survey = new SurveyModel({ elements: [
      { type: "matrixdynamic", name: "q1", columns: [{ name: "col1", cellType: "text" }] },
      { type: "checkbox", name: "q2", choicesFromQuestion: "q1", choicesVisibleIf: "{item} != 'A'" }
    ] });
    const q1 = <QuestionMatrixDynamicModel>survey.getQuestionByName("q1");
    const q2 = <QuestionSelectBase>survey.getQuestionByName("q2");
    expect(q2.choicesFromQuestion, "choicesFromQuestion is set").toLooseEqual("q1");
    expect(q2.isUsingCarryForward, "Carryforward flag is set").toLooseEqual(true);
    expect(q2.visibleChoices.length, "There is no choices").toLooseEqual(0);
    expect(q2.visibleChoices.length, "There is no choices, row is empty").toLooseEqual(0);
    q1.visibleRows[0].cells[0].value = "A";
    expect(survey.data, "survey.data is correct").toEqualValues({ q1: [{ col1: "A" }, {}] });
    expect(q2.visibleChoices.length, "There is one choice, filtering").toLooseEqual(0);
    q1.visibleRows[1].cells[0].value = "B";
    expect(q2.visibleChoices.length, "There is one choice").toLooseEqual(1);
    expect(q2.visibleChoices[0].value, "the second value is correct").toLooseEqual("B");
    q1.addRow();
    expect(q2.visibleChoices.length, "There is one choice, new row is empty").toLooseEqual(1);
    q1.visibleRows[2].cells[0].value = "C";
    expect(survey.data, "survey.data is correct, #2").toEqualValues({ q1: [{ col1: "A" }, { col1: "B" }, { col1: "C" }] });
    expect(q2.visibleChoices.length, "There are three choice").toLooseEqual(2);
    expect(q2.visibleChoices[1].value, "the third value is correct").toLooseEqual("C");
  });

  test("Allow to override default value fro choicesByUrl.path Bug#6766", () => {
    const prop = Serializer.findProperty("choicesByUrl", "path");
    prop.defaultValue = "list";
    const q1 = new QuestionDropdownModel("q1");
    expect(q1.choicesByUrl.path, "get new default value for path").toLooseEqual("list");
    prop.defaultValue = undefined;
  });
  test("Infinitive loop error by using carryForward, Bug#8232", () => {
    const survey = new SurveyModel({ elements: [
      {
        type: "checkbox",
        name: "q1",
        visibleIf: "{q1} notempty",
        choices: [{ value: 1, text: "Item 1" }, { value: 2, text: "Item 2" }, { value: 3, text: "Item 3" },
          { value: 4, text: "Item 4" }, { value: 5, text: "Item 5" }],
        choicesFromQuestionMode: "selected",
        hideIfChoicesEmpty: true,
      },
      {
        type: "checkbox",
        name: "q2",
        choicesFromQuestion: "q1",
        choicesFromQuestionMode: "unselected",
        hideIfChoicesEmpty: true,
      }],
    });
    const q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    const q2 = <QuestionCheckboxModel>survey.getQuestionByName("q2");
    expect(q1, "q1 exists").toBeTruthy();
    expect(q2, "q2 exists").toBeTruthy();
    expect(q1.visibleChoices.length, "q1.visibleChoices").toLooseEqual(5);
    expect(q2.visibleChoices.length, "q2.visibleChoices").toLooseEqual(5);
    expect(q2.isVisible, "q2 is visible").toLooseEqual(true);
  });
  test("Change carryForwardQuestionType to let question banner in creator that something is changed, Bug#5495-in-Creator", () => {
    const survey = new SurveyModel({ elements: [
      {
        type: "checkbox",
        name: "q1",
      },
      {
        type: "checkbox",
        name: "q2",
      },
      {
        type: "checkbox",
        name: "q3",
        choicesFromQuestion: "q1"
      }],
    });
    survey.setDesignMode(true);
    const q3 = <QuestionCheckboxModel>survey.getQuestionByName("q3");
    let counterOn = 0;
    let counterOff = 0;
    q3.registerFunctionOnPropertyValueChanged("carryForwardQuestionType", () => {
      if (q3.isUsingCarryForward) {
        counterOn++;
      } else {
        counterOff ++;
      }
    });
    q3.choicesFromQuestion = "q2";
    expect(counterOn, "counterOn #1").toLooseEqual(1);
    expect(counterOff, "counterOff #1").toLooseEqual(1);
    q3.choicesFromQuestion = "q1";
    expect(counterOn, "counterOn #2").toLooseEqual(2);
    expect(counterOff, "counterOff #2").toLooseEqual(2);
    survey.setDesignMode(false);
    q3.choicesFromQuestion = "q2";
    expect(counterOn, "counterOn #3").toLooseEqual(2);
    expect(counterOff, "counterOff #3").toLooseEqual(2);
    q3.choicesFromQuestion = "";
    survey.setDesignMode(false);
    q3.choicesFromQuestion = "q2";
    counterOn = 0;
    counterOff = 0;
    expect(counterOn, "counterOn #4").toLooseEqual(0);
    expect(counterOff, "counterOff #4").toLooseEqual(0);
  });
  test("Use carryForward with panel dynamic + choiceValuesFromQuestion + valueName, Bug#6948-1", () => {
    const survey = new SurveyModel({ elements: [
      { type: "paneldynamic", name: "q1", valueName: "sharedData",
        templateElements: [{ name: "q1-q1", type: "text" }]
      },
      { type: "checkbox", name: "q2", choicesFromQuestion: "q1", choiceValuesFromQuestion: "q1-q1" }
    ] });
    const q1 = <QuestionPanelDynamicModel>survey.getQuestionByName("q1");
    const q2 = <QuestionCheckboxModel>survey.getQuestionByName("q2");
    q1.addPanel();
    q1.panels[0].getQuestionByName("q1-q1").value = "aaa";
    q1.addPanel();
    q1.panels[1].getQuestionByName("q1-q1").value = "bbb";
    expect(q2.visibleChoices.length, "There are two choice").toLooseEqual(2);
    expect(q2.visibleChoices[0].value, "the first value is correct").toLooseEqual("aaa");
    expect(q2.visibleChoices[1].value, "the second value is correct").toLooseEqual("bbb");
  });

  test("Use carryForward with panel dynamic + choiceValuesFromQuestion + removing the value, Bug#9399", () => {
    const survey = new SurveyModel({ elements: [
      { type: "paneldynamic", name: "q1", valueName: "sharedData",
        templateElements: [{ name: "q1-q1", type: "text" }]
      },
      { type: "dropdown", name: "q2", choicesFromQuestion: "q1", choiceValuesFromQuestion: "q1-q1" }
    ] });
    const q1 = <QuestionPanelDynamicModel>survey.getQuestionByName("q1");
    const q2 = <QuestionCheckboxModel>survey.getQuestionByName("q2");
    q1.addPanel();
    q1.panels[0].getQuestionByName("q1-q1").value = "aaa";
    q1.addPanel();
    q1.panels[1].getQuestionByName("q1-q1").value = "bbb";
    expect(q2.visibleChoices.length, "There are two choices").toLooseEqual(2);
    q2.value = "bbb";
    expect(q2.isEmpty(), "q2 is not empty").toLooseEqual(false);
    q1.removePanel(1);
    expect(q2.visibleChoices.length, "There is one choice").toLooseEqual(1);
    expect(q2.isEmpty(), "q2 is empty").toLooseEqual(true);
  });

  test("Use carryForward with panel dynamic + choiceValuesFromQuestion + valueName, Bug#6948-2", () => {
    const survey = new SurveyModel({ elements: [
      { type: "paneldynamic", name: "q1", valueName: "sharedData",
        templateElements: [{ name: "q1-q1", type: "text" }]
      },
      { type: "paneldynamic", name: "q2", valueName: "sharedData",
        templateElements: [{ name: "q2-q2", type: "checkbox", choicesFromQuestion: "q1", choiceValuesFromQuestion: "q1-q1" }]
      }
    ] });
    const q1 = <QuestionPanelDynamicModel>survey.getQuestionByName("q1");
    const q2 = <QuestionPanelDynamicModel>survey.getQuestionByName("q2");
    q1.addPanel();
    q1.panels[0].getQuestionByName("q1-q1").value = "aaa";
    q1.addPanel();
    q1.panels[1].getQuestionByName("q1-q1").value = "bbb";
    const q2_q2 = q2.panels[0].getQuestionByName("q2-q2");
    expect(q2_q2.visibleChoices.length, "There are two choice").toLooseEqual(2);
    expect(q2_q2.visibleChoices[0].value, "the first value is correct").toLooseEqual("aaa");
    expect(q2_q2.visibleChoices[1].value, "the second value is correct").toLooseEqual("bbb");
  });
  test("Use carryForward with panel dynamic + incorrect values, Bug#9478", () => {
    const survey = new SurveyModel({ pages: [
      {
        elements: [
          {
            type: "paneldynamic",
            name: "question1",
            templateElements: [
              {
                type: "text",
                name: "question2",
              },
            ],
          },
        ],
      },
      {
        elements: [
          {
            type: "paneldynamic",
            name: "question4",
            templateElements: [
              {
                type: "paneldynamic",
                name: "question5",
                templateElements: [
                  {
                    type: "dropdown",
                    name: "question3",
                    isRequired: true,
                    choicesFromQuestion: "question1",
                    choiceValuesFromQuestion: "question2",
                    choiceTextsFromQuestion: "question2",
                  },
                  {
                    type: "text",
                    name: "question11",
                    defaultValueExpression: "{panel.question3} empty",
                  },
                ],
              },
            ],
            panelCount: 1,
          },
        ],
      },
    ] });
    survey.data = {
      "question1": [
        {
          "question2": "Item1*"
        },
        {
          "question2": "Item2*"
        }
      ],
      "question4": [
        {
          "question5": [
            {
              "question11": false,
              "question3": "Item2"
            }
          ]
        }
      ]
    };
    survey.nextPage();
    expect(survey.tryComplete(), "The value is incorrect").toLooseEqual(false);
  });
  test("SelectBase visibleChoices order & locale change", () => {
    const survey = new SurveyModel({ elements: [
      { type: "dropdown", name: "q1", choicesOrder: "asc",
        choices: [{ value: "A", text: { default: "AA", de: "BAA" } },
          { value: "B", text: { default: "BB", de: "ABB" } }] }
    ] });
    const question = <QuestionSelectBase>survey.getQuestionByName("q1");
    expect(question.visibleChoices.length, "There are 4 items").toLooseEqual(2);
    expect(question.visibleChoices[0].value, "the first item").toLooseEqual("A");
    expect(question.visibleChoices[1].value, "the second item").toLooseEqual("B");
    survey.locale = "de";
    expect(question.choicesOrder, "The order is correct").toLooseEqual("asc");
    expect(question.getLocale(), "question locale is correct").toLooseEqual("de");
    expect(question.choices[0].calculatedText, "the first item calculatedText, de").toLooseEqual("BAA");
    expect(question.choices[1].calculatedText, "the second item calculatedText, de").toLooseEqual("ABB");
    expect(question.choices[0].getLocale(), "ItemValue locText locale is correct").toLooseEqual("de");
    expect(question.visibleChoices[0].value, "the first item, de").toLooseEqual("B");
    expect(question.visibleChoices[1].value, "the second item, de").toLooseEqual("A");
    expect(question.visibleChoices[0].calculatedText, "the first visible item calculatedText, de").toLooseEqual("ABB");
    expect(question.visibleChoices[1].calculatedText, "the second visible item calculatedText, de").toLooseEqual("BAA");
  });
  test("SelectBase visibleChoices for selectAll, none and showOtherItem", () => {
    const json = { elements: [
      { type: "checkbox", name: "q1", choices: ["a", "b", "c"], showSelectAllItem: true, showNoneItem: true, showOtherItem: true }
    ] };
    const survey = new SurveyModel(json);
    const question = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    let choices = question.visibleChoices;
    expect(choices.length, "6 items, #1").toLooseEqual(6);
    expect(choices[0].id, "all index #1").toLooseEqual("selectall");
    expect(choices[4].value, "none index #1").toLooseEqual("none");
    expect(choices[5].value, "other index #1").toLooseEqual("other");

    settings.specialChoicesOrder.noneItem = [5];
    question.showNoneItem = false;
    question.showNoneItem = true;
    choices = question.visibleChoices;
    expect(choices.length, "6 items, #2").toLooseEqual(6);
    expect(choices[0].id, "all index #2").toLooseEqual("selectall");
    expect(choices[4].value, "other index #2").toLooseEqual("other");
    expect(choices[5].value, "none index #2").toLooseEqual("none");

    settings.specialChoicesOrder.noneItem = [-5, 5];
    question.showNoneItem = false;
    question.showNoneItem = true;
    choices = question.visibleChoices;
    expect(choices.length, "7 items, #3").toLooseEqual(7);
    expect(choices[0].value, "none index (up) #3").toLooseEqual("none");
    expect(choices[1].id, "all index #3").toLooseEqual("selectall");
    expect(choices[5].value, "other index #3").toLooseEqual("other");
    expect(choices[6].value, "none index (bottom) #3").toLooseEqual("none");

    settings.specialChoicesOrder.selectAllItem = [-1];
    settings.specialChoicesOrder.noneItem = [1];
    settings.specialChoicesOrder.otherItem = [4];
  });
  test("Double noneItem and SelectAllItem", () => {
    settings.specialChoicesOrder.noneItem = [-3, 3];
    const json = { elements: [
      { type: "checkbox", name: "q1", choices: ["a", "b", "c"], showSelectAllItem: true, showNoneItem: true, showOtherItem: true }
    ] };
    const survey = new SurveyModel(json);
    const question = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    question.selectAll();
    expect(question.isItemSelected(question.selectAllItem), "Select Item is selected").toLooseEqual(true);
    expect(question.isAllSelected, "isAllSelected #1").toLooseEqual(true);
    question.value = ["a", "b"];
    expect(question.isItemSelected(question.selectAllItem), "Select Item is not selected").toLooseEqual(false);
    expect(question.isAllSelected, "isAllSelected #2").toLooseEqual(false);
    settings.specialChoicesOrder.selectAllItem = [-1];
    settings.specialChoicesOrder.noneItem = [1];
    settings.specialChoicesOrder.otherItem = [4];
  });
  test("Double noneItem & selectAllItem and headItems/footItems", () => {
    settings.specialChoicesOrder.noneItem = [-2, 4];
    settings.specialChoicesOrder.otherItem = [1];
    settings.specialChoicesOrder.selectAllItem = [-2, 3];
    const json = { elements: [
      { type: "checkbox", name: "q1", choices: ["a", "b", "c"], showSelectAllItem: true, showNoneItem: true, showOtherItem: true }
    ] };
    const survey = new SurveyModel(json);
    const question = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    question.separateSpecialChoices = true;

    expect(question.visibleChoices.length, "There are 8 items").toLooseEqual(8);
    expect(question.headItems.length, "There are two items in head items").toLooseEqual(2);
    expect(question.headItems[0].value, "head none").toLooseEqual("none");
    expect(question.headItems[1].id, "head selectall").toLooseEqual("selectall");
    expect(question.footItems.length, "There are three items in footer items").toLooseEqual(3);
    expect(question.footItems[0].value, "foot other").toLooseEqual("other");
    expect(question.footItems[1].id, "foot selectall").toLooseEqual("selectall");
    expect(question.footItems[2].value, "foot none").toLooseEqual("none");

    settings.specialChoicesOrder.selectAllItem = [-1];
    settings.specialChoicesOrder.noneItem = [1];
    settings.specialChoicesOrder.otherItem = [4];
  });
  test("Select all disable/enabled", () => {
    const json = { elements: [
      { type: "checkbox", name: "q1",
        choices: [{ value: "a", visibleIf: "{val1}=1" }, { value: "b", enableIf: "{val2}=1" }],
        showSelectAllItem: true, showNoneItem: true }
    ] };
    const survey = new SurveyModel(json);
    const question = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    const selectAll = question.selectAllItem;
    expect(selectAll.isEnabled, "#1").toLooseEqual(false);
    expect(question.isItemSelected(selectAll), "#1.1").toLooseEqual(false);
    survey.setVariable("val1", 1);
    expect(selectAll.isEnabled, "#2").toLooseEqual(true);
    expect(question.isItemSelected(selectAll), "#2.1").toLooseEqual(false);
    survey.setVariable("val1", 2);
    expect(selectAll.isEnabled, "#3").toLooseEqual(false);
    expect(question.isItemSelected(selectAll), "#3.1").toLooseEqual(false);
    survey.setVariable("val2", 1);
    expect(selectAll.isEnabled, "#4").toLooseEqual(true);
    expect(question.isItemSelected(selectAll), "#4.1").toLooseEqual(false);
    survey.setVariable("val2", 2);
    expect(selectAll.isEnabled, "#5").toLooseEqual(false);
    expect(question.isItemSelected(selectAll), "#5.1").toLooseEqual(false);
  });
  test("question.selectAll() disable/enabled and visible", () => {
    const json = { elements: [
      { type: "checkbox", name: "q1",
        choices: [{ value: "a", visibleIf: "{val1}=1" }, { value: "b", enableIf: "{val2}=1" }, "c"],
        showSelectAllItem: true, showNoneItem: true }
    ] };
    const survey = new SurveyModel(json);
    const question = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    const selectAll = question.selectAllItem;
    expect(question.isItemSelected(selectAll), "#1.1").toLooseEqual(false);
    question.selectAll();
    expect(question.value, "#1.2").toEqualValues(["c"]);
    expect(question.isItemSelected(selectAll), "#1.3").toLooseEqual(true);

    survey.setVariable("val1", 1);
    expect(question.isItemSelected(selectAll), "#2.1").toLooseEqual(false);
    question.selectAll();
    expect(question.value, "#2.2").toEqualValues(["a", "c"]);
    expect(question.isItemSelected(selectAll), "#2.3").toLooseEqual(true);

    survey.setVariable("val2", 1);
    expect(question.isItemSelected(selectAll), "#3.1").toLooseEqual(false);
    question.selectAll();
    expect(question.value, "#3.2").toEqualValues(["a", "b", "c"]);
    expect(question.isItemSelected(selectAll), "#3.3").toLooseEqual(true);
  });
  test("Select all disable/enabled showOtherItem=true", () => {
    const json = { elements: [
      { type: "checkbox", name: "q1", showSelectAllItem: true, showOtherItem: true }
    ] };
    const survey = new SurveyModel(json);
    const question = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    const selectAll = question.selectAllItem;
    expect(selectAll.isEnabled, "#1").toLooseEqual(false);
    expect(question.isItemSelected(selectAll), "#2").toLooseEqual(false);
  });
  test("Select all and clickItemHandler", () => {
    const json = { elements: [
      { type: "checkbox", name: "q1", choices: [1, 2, 3], showSelectAllItem: true }
    ] };
    const survey = new SurveyModel(json);
    const question = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    expect(question.selectAllItem.value, "select all equals empty value").toLooseEqual("");
    expect(question.isAllSelected, "#1").toLooseEqual(false);
    question.clickItemHandler(question.selectAllItem, true);
    expect(question.isAllSelected, "#2").toLooseEqual(true);
    question.clickItemHandler(question.selectAllItem, false);
    expect(question.isAllSelected, "#3").toLooseEqual(false);
    question.clickItemHandler(question.selectAllItem);
    expect(question.isAllSelected, "#4").toLooseEqual(true);
    question.clickItemHandler(question.selectAllItem);
    expect(question.isAllSelected, "#5").toLooseEqual(false);
  });
  test("Test dropdown in CreatorV2 & restful", () => {
    const json = { elements: [
      { type: "checkbox", name: "q1", choices: [1, 2, 3, 4, 5] }
    ] };
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON(json);
    const question = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    expect(question.isUsingRestful, "isUsingRestful #1").toLooseEqual(false);
    expect(question.visibleChoices.length, "3 built-in + 5 choices + 1 add item, #1").toLooseEqual(3 + 5 + 1);
    question.choicesByUrl.url = "test_url";
    expect(question.isUsingRestful, "isUsingRestful #2").toLooseEqual(true);
    expect(question.visibleChoices.length, "3 built-in + do not show default choices, #2").toLooseEqual(3);
    question.choicesByUrl.url = "";
    expect(question.isUsingRestful, "isUsingRestful #3").toLooseEqual(false);
    expect(question.visibleChoices.length, "3 built-in + 5 choices + 1 add item, #3").toLooseEqual(3 + 5 + 1);
  });
  test("isUsingRestful & loading", () => {
    const json = { elements: [
      { type: "checkbox", name: "q1", choicesByUrl: { url: "abc" } },
      { type: "checkbox", name: "q2" }
    ] };
    const survey = new SurveyModel(json);
    const q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    const q2 = <QuestionCheckboxModel>survey.getQuestionByName("q2");
    expect(q1.isUsingRestful, "q1 #1").toLooseEqual(true);
    expect(q2.isUsingRestful, "q2 #1").toLooseEqual(false);
    q1.choicesByUrl.url = "";
    expect(q1.isUsingRestful, "q1 #2").toLooseEqual(false);
    q1.choicesByUrl.url = "edf";
    expect(q1.isUsingRestful, "q1 #3").toLooseEqual(true);
  });
  test("checkbox max(min)SelectedChoices validation", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "checkbox",
          name: "q1"
        }
      ]
    });
    const q = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    q.minSelectedChoices = 10;
    expect(q.minSelectedChoices, "q.minSelectedChoices, #1").toLooseEqual(10);
    q.maxSelectedChoices = 5;
    expect(q.maxSelectedChoices, "q.maxSelectedChoices, #2").toLooseEqual(10);
    q.minSelectedChoices = 20;
    expect(q.minSelectedChoices, "q.minSelectedChoices, #3").toLooseEqual(10);
    q.maxSelectedChoices = 0;
    q.minSelectedChoices = 20;
    expect(q.minSelectedChoices, "q.minSelectedChoices, #4").toLooseEqual(20);
    q.minSelectedChoices = 0;
    q.maxSelectedChoices = 5;
    expect(q.maxSelectedChoices, "q.maxSelectedChoices, #5").toLooseEqual(5);
  });
  test("minSelectedChoices in checkbox & known & other one selection, Bug#9830", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "checkbox",
          name: "q1",
          choices: [1, 2, 3, 4, 5],
          showOtherItem: true,
          showNoneItem: true,
          showRefuseItem: true,
          showDontKnowItem: true,
        },
      ],
    });
    const question = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    question.minSelectedChoices = 3;
    question.value = [2, 3];
    expect(question.validate(), "validate #1").toLooseEqual(false);
    question.clickItemHandler(question.noneItem, true);
    expect(question.value, "value #2").toEqualValues(["none"]);
    expect(question.validate(), "validate #2").toLooseEqual(true);
    question.value = [2, 3];
    expect(question.validate(), "validate #3").toLooseEqual(false);
    question.clickItemHandler(question.refuseItem, true);
    expect(question.value, "value #4").toEqualValues(["refused"]);
    expect(question.validate(), "validate #4").toLooseEqual(true);
    question.value = [2];
    expect(question.validate(), "validate #5").toLooseEqual(false);
    question.clickItemHandler(question.dontKnowItem, true);
    expect(question.value, "value #6").toEqualValues(["dontknow"]);
    expect(question.validate(), "validate #6").toLooseEqual(true);
  });
  test("checkbox, selectAll & survey.data, bug#7657", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "checkbox",
          "name": "q1",
          "isRequired": true,
          "choices": [
            "One",
            "Two",
            "Three"
          ],
          "showNoneItem": true,
          "showSelectAllItem": true
        }
      ]
    });
    const q = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    q.selectAll();
    q.clickItemHandler(q.choices[2]);
    expect(q.value, "q.value, #1").toEqualValues(["One", "Two"]);
    expect(survey.data, "survey.data, #1").toEqualValues({ q1: ["One", "Two"] });
    survey.doComplete();
    expect(q.value, "q.value, #2").toEqualValues(["One", "Two"]);
    expect(survey.data, "survey.data, #2").toEqualValues({ q1: ["One", "Two"] });
  });
  test("Do not show show choices in designer", () => {
    const json = { elements: [
      { type: "checkbox", name: "q1", choices: [1, 2, 3, 4, 5] }
    ] };
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON(json);
    const question = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    expect(question.visibleChoices.length, "Show choices in designer, #1").toLooseEqual(5 + 1 + 3);
    question.isMessagePanelVisible = true;
    expect(question.visibleChoices.length, "Hide choices in designer, #2").toLooseEqual(3);
    question.isMessagePanelVisible = false;
    expect(question.visibleChoices.length, "Show choices in designer, #1").toLooseEqual(5 + 1 + 3);
  });
  test("question checkbox displayValue() with other and comment", () => {
    const q1 = new QuestionCheckboxModel("q1");
    q1.fromJSON({
      "type": "checkbox",
      "name": "q1",
      "showCommentArea": true,
      "commentText": "Comment",
      "choices": [
        "Item 1",
        "Item 2",
        "Item 3"
      ],
      "showOtherItem": true
    });
    q1.value = ["Item 1", "Item 2", "Other Value"];
    expect(q1.displayValue, "Other value should be kept").toEqualValues("Item 1, Item 2, Other Value");
  });
  test("Default comment & otherItem text, Bug#9733", () => {
    const q1 = new QuestionCheckboxModel("q1");
    expect(q1.commentText, "Default comment text is correct").toLooseEqual("Please leave a comment");
    expect(q1.otherText, "Default other item text is correct").toLooseEqual("Other (describe)");
  });

  test("checkbox with incorrect defaultValue, other & survey.data Bug#7943", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "checkbox",
          "name": "q1",
          "defaultValue": [
            "101"
          ],
          "choices": [1, 2],
          "showOtherItem": true,
        }
      ]
    });
    const q = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    expect(q.value, "q.value").toEqualValues(["other"]);
    expect(q.comment, "q.comment").toLooseEqual("101");
    expect(survey.data, "survey.data").toEqualValues({ q1: ["other"], "q1-Comment": "101" });
    survey.doComplete(false);
    expect(survey.data, "survey.data").toEqualValues({ q1: ["other"], "q1-Comment": "101" });
  });
  test("radiogroup with incorrect defaultValue, other & survey.data Bug#7943", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "radiogroup",
          "name": "q1",
          "defaultValue": [
            "101"
          ],
          "choices": [1, 2],
          "showOtherItem": true,
        }
      ]
    });
    const q = <QuestionRadiogroupModel>survey.getQuestionByName("q1");
    expect(q.value, "q.value").toEqualValues("other");
    expect(q.comment, "q.comment").toLooseEqual("101");
    expect(survey.data, "survey.data").toEqualValues({ q1: "other", "q1-Comment": "101" });
    survey.doComplete(false);
    expect(survey.data, "survey.data on complete").toEqualValues({ q1: "other", "q1-Comment": "101" });
  });
  test("On value changed, comment and valueName Bug#8137", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "radiogroup",
          "name": "q1",
          "valueName": "val1",
          "choices": [1, 2],
          "showOtherItem": true,
        }
      ]
    });
    let counter = 0;
    let questionName = "";
    let name = "";
    let value = undefined;
    survey.onValueChanged.add((sender, options) => {
      counter ++;
      questionName = options.question.name;
      name = options.name;
      value = options.value;
    });
    const q = <QuestionRadiogroupModel>survey.getQuestionByName("q1");
    q.value = 1;
    expect(counter, "counter #1").toLooseEqual(1);
    expect(questionName, "question.name #1").toLooseEqual("q1");
    expect(name, "name #1").toLooseEqual("val1");
    expect(value, "value #1").toLooseEqual(1);
    q.value = "other";
    expect(counter, "counter #2").toLooseEqual(2);
    questionName = "";
    name = "";
    value = undefined;
    q.otherValue = "comment1";
    expect(counter, "counter #3").toLooseEqual(3);
    expect(questionName, "question name #3").toLooseEqual("q1");
    expect(name, "name #3").toLooseEqual("val1-Comment");
    expect(value, "value #3").toLooseEqual("comment1");
  });
  test("maxSelectedChoices & getItemClass, bug#8159", () => {
    var json = {
      elements: [
        {
          type: "checkbox",
          name: "q1",
          choices: ["Item1", "Item2", "Item3"],
          maxSelectedChoices: 2
        },
      ],
    };
    const survey = new SurveyModel(json);
    const q1 = <QuestionSelectBase>survey.getQuestionByName("q1");
    const disableStyle = "sv_q_disable";
    const readOnlyStyle = "sv_q_disable";
    q1.cssClasses.itemDisabled = disableStyle;
    q1.cssClasses.itemReadOnly = readOnlyStyle;
    q1.renderedValue = ["Item1", "Item3"];
    expect(q1.visibleChoices[0].enabled, "Item1 enabled #1").toBeTruthy();
    expect(q1.visibleChoices[1].enabled, "Item2 enabled #2").toBeFalsy();

    expect(q1.getItemClass(q1.visibleChoices[0]).indexOf(disableStyle) >= 0, "Item1 disabled #1").toBeFalsy();
    expect(q1.getItemClass(q1.visibleChoices[1]).indexOf(disableStyle) >= 0, "Item2 disabled #2").toBeTruthy();
    expect(q1.getItemClass(q1.visibleChoices[2]).indexOf(disableStyle) >= 0, "Item3 disabled #3").toBeFalsy();

    expect(q1.getItemClass(q1.visibleChoices[0]).indexOf(readOnlyStyle) >= 0, "Item1 read-only #1").toBeFalsy();
    expect(q1.getItemClass(q1.visibleChoices[1]).indexOf(readOnlyStyle) >= 0, "Item2 read-only #2").toBeTruthy();
    expect(q1.getItemClass(q1.visibleChoices[2]).indexOf(readOnlyStyle) >= 0, "Item3 read-only #3").toBeFalsy();
  });
  test("radiogroup.getConditionJson, bug#8226", () => {
    var json = {
      elements: [
        { type: "radiogroup", name: "q1", allowClear: true, choices: ["Item1"] },
        { type: "radiogroup", name: "q2", choices: ["Item1"] }
      ],
    };
    const survey = new SurveyModel(json);
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    const res = { type: "radiogroup", name: "q1", choices: ["Item1"] };
    expect(q1.getConditionJson(), "q1").toEqualValues(res);
    res.name = "q2";
    expect(q2.getConditionJson(), "q2").toEqualValues(res);
  });
  test("dropdown.clearValue(true) for showCommentArea & showOtherItem, bug#8226", () => {
    var json = {
      elements: [
        { type: "dropdown", name: "q1", showCommentArea: true, choices: [1, 2] },
        { type: "dropdown", name: "q2", showOtherItem: true, choices: [1, 2] },
        { type: "dropdown", name: "q3", showCommentArea: true, showOtherItem: true, choices: [1, 2] },
        { type: "dropdown", name: "q4", showOtherItem: true, storeOthersAsComment: false, choices: [1, 2] }
      ],
    };
    const survey = new SurveyModel(json);
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    const q3 = survey.getQuestionByName("q3");
    const q4 = survey.getQuestionByName("q4");
    q1.value = 1;
    q1.comment = "abc";
    q1.clearValue(true);
    q2.value = "other";
    q2.otherValue = "abc";
    q2.clearValue(true);
    q3.value = "val";
    q3.comment = "abc";
    q3.clearValue(true);
    q4.value = "val";
    q4.clearValue(true);

    expect(q1.value, "q1.value").toLooseEqual(undefined);
    expect(q1.comment, "q1.comment").toLooseEqual("abc");
    expect(q2.value, "q2.value").toLooseEqual(undefined);
    expect(q2.comment, "q2.comment").toBeFalsy();
    expect(q3.value, "q3.value").toLooseEqual(undefined);
    expect(q3.comment, "q3.comment").toLooseEqual("abc");
    expect(q4.value, "q4.value").toLooseEqual(undefined);
    expect(q4.comment, "q4.comment").toBeFalsy();
  });
  test("storeOthersAsComment & entering comment equals to the value in the choice, bug#9619", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "radiogroup", name: "q1", choices: ["red", "yellow", "green"], "showOtherItem": true },
        { type: "checkbox", name: "q2", choices: ["red", "yellow", "green"], "showOtherItem": true }
      ],
      storeOthersAsComment: false
    });
    const q1 = <QuestionRadiogroupModel>survey.getQuestionByName("q1");
    q1.value = "other";
    expect(q1.isOtherSelected, "q1, isOther is selected").toLooseEqual(true);
    q1.otherValue = "red";
    expect(q1.value, "q1, value is red").toLooseEqual("red");
    expect(q1.selectedItem.value, "q1, Make the red item seleted").toLooseEqual("red");
    expect(q1.isOtherSelected, "q1, isOther is not selected").toLooseEqual(false);
    const q2 = <QuestionCheckboxModel>survey.getQuestionByName("q2");
    q2.value = ["green", "other"];
    expect(q2.isOtherSelected, "q2, isOther is selected, #1").toLooseEqual(true);
    q2.otherValue = "red";
    expect(q2.value, "q2, Make the red item seleted, #1").toEqualValues(["green", "red"]);
    expect(q2.isOtherSelected, "q2, isOther is not selected, #1").toLooseEqual(false);
    q2.value = ["green", "other"];
    expect(q2.isOtherSelected, "q2, isOther is selected, #2").toLooseEqual(true);
    q2.otherValue = "green";
    expect(q2.value, "q2, Make the red item seleted, #2").toEqualValues(["green"]);
    expect(q2.isOtherSelected, "q2, isOther is not selected, #2").toLooseEqual(false);
  });
  test("valuePropertyName & complete trigger, bug#8434", () => {
    const survey = new SurveyModel({
      "pages": [
        {
          "name": "page1",
          "elements": [
            {
              "type": "checkbox",
              "name": "models",
              "choices": [1, 2, 3],
              "showNoneItem": true,
              "valuePropertyName": "model_id"
            }
          ]
        },
        {
          "name": "page2",
          "elements": [
            {
              "type": "text",
              "name": "question1"
            }
          ]
        }
      ],
      "triggers": [
        {
          "type": "complete",
          "expression": "{models-unwrapped} = ['none']"
        }
      ]
    });
    const q = <QuestionCheckboxModel>survey.getQuestionByName("models");
    expect(survey.calcIsCompleteButtonVisible(), "#1").toLooseEqual(false);
    q.renderedValue = ["none"];
    expect(survey.calcIsCompleteButtonVisible(), "#2").toLooseEqual(true);
    q.renderedValue = [1];
    expect(survey.calcIsCompleteButtonVisible(), "#3").toLooseEqual(false);
    q.renderedValue = ["none"];
    expect(survey.calcIsCompleteButtonVisible(), "#4").toLooseEqual(true);
  });
  test("Unselect none item, bug#8438", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "checkbox",
          "name": "q1",
          "choices": [1, 2, 3],
          "showNoneItem": true
        }
      ]
    });
    const q = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    q.clickItemHandler(q.noneItem, true);
    expect(q.value, "#1").toEqualValues(["none"]);
    q.clickItemHandler(q.noneItem, false);
    expect(q.isEmpty(), "#2").toLooseEqual(true);
    q.clickItemHandler(q.noneItem, true);
    expect(q.value, "#3").toEqualValues(["none"]);
  });

  test("Add condition custom property", () => {
    Serializer.addProperty("itemvalue", {
      name: "customExp:expression",
      onExecuteExpression: (obj, res) => {
        obj.setPropertyValue("customVal", res);
      }
    });
    const survey = new SurveyModel({
      elements: [
        {
          type: "checkbox",
          name: "q1",
          choices: [1, 2, { value: 3, customExp: "{q1.length}" }]
        }
      ]
    });
    const q = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    const item3 = q.choices[2];
    expect(item3.getPropertyValue("customVal"), "#1").toLooseEqual(0);
    q.value = [1, 2, 3];
    expect(item3.getPropertyValue("customVal"), "#2").toLooseEqual(3);
    q.value = [2];
    expect(item3.getPropertyValue("customVal"), "#3").toLooseEqual(1);

    Serializer.removeProperty("itemvalue", "customExp");
  });
  test("question checkbox add a custom property into choicesByUrl, Bug#8783", () => {
    Serializer.addProperty("choicesByUrl", "jsonpath");
    const survey = new SurveyModel({
      elements: [
        { type: "checkbox", name: "q1",
          choicesByUrl: { valueName: "name", jsonpath: "mypath" }
        }
      ]
    });
    const q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    expect(q1.choicesByUrl.valueName, "valueName").toLooseEqual("name");
    expect(q1.choicesByUrl["jsonpath"], "load jsonpath").toLooseEqual("mypath");
    q1.choicesByUrl["jsonpath"] = "newpath";
    expect(q1.toJSON(), "#2").toEqualValues({ name: "q1", choicesByUrl: { valueName: "name", jsonpath: "newpath" } });
    Serializer.removeProperty("choicesByUrl", "jsonpath");
  });
  test("Clear action in locale & survey.locale change, Bug#9113", () => {
    const survey = new SurveyModel();
    survey.css = survey.css = { root: "sd-root-modern" };
    survey.fromJSON({
      elements: [{ type: "radiogroup", name: "q1", allowClear: true }]
    });
    const q1 = <QuestionRadiogroupModel>survey.getQuestionByName("q1");
    expect(q1.getTitleToolbar()).toBeTruthy();
    expect(q1.titleActions.length, "one action").toLooseEqual(1);
    const item = q1.titleActions[0];
    expect(item.locTitle.localizationName, "locName").toLooseEqual("clearCaption");
    expect(item.locTitle.locale, "locale #1").toLooseEqual("");
    survey.locale = "de";
    expect(item.locTitle.locale, "locale #2").toLooseEqual("de");
  });
  test("ItemValue tooltip, #9269", () => {
    const item = new ItemValue(1);
    expect(item.getTooltip(), "#1").toLooseEqual("1");
    item.text = "abc";
    expect(item.getTooltip(), "#2").toLooseEqual("abc");
    item.tooltip = "edf";
    expect(item.getTooltip(), "#3").toLooseEqual("edf");
  });

  test("Check QuestionSelectBase Columns Arragement", () => {
  // https://github.com/surveyjs/survey-library/issues/9487
    let json = {
      elements: [
        {
          "type": "radiogroup",
          "name": "q1",
          "choices": [
            "Item1",
            "Item2",
            "Item3",
            "Item4",
            "Item5",
            "Item6",
            "Item7",
            "Item8",
            "Item9",
            "Item10"
          ],
          "colCount": 3
        }
      ],
    };
    let survey = new SurveyModel(json);
    let question = <QuestionSelectBase>survey.getAllQuestions()[0];
    settings.itemFlowDirection = "column";
    let columns = getValuesInColumns(question);
    expect(columns, "check itemFlowDirection column").toEqualValues([["Item1", "Item2", "Item3", "Item4"], ["Item5", "Item6", "Item7", "Item8"], ["Item9", "Item10"]]);

    json = {
      elements: [{
        "type": "radiogroup",
        "name": "q2",
        "choices": [
          "Item1",
          "Item2",
          "Item3",
          "Item4"
        ],
        "colCount": 3
      }]
    };
    survey = new SurveyModel(json);
    question = <QuestionSelectBase>survey.getAllQuestions()[0];
    settings.itemFlowDirection = "column";
    columns = getValuesInColumns(question);
    expect(columns, "check itemFlowDirection column (2)").toEqualValues([["Item1", "Item2"], ["Item3"], ["Item4"]]);
  });
  test("Dropdown question show selected item incorrectly if choices set after the question value is set, Bug#9791", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "dropdown",
          "name": "q1",
          "showOtherItem": true,
        }
      ]
    });
    survey.data = { q1: "val2" };
    survey.getQuestionByName("q1").choices = [
      { value: "val1", text: "Item 1" },
      { value: "val2", text: "Item 2" },
      { value: "val3", text: "Item 3" },
    ];
    const q1 = <QuestionDropdownModel>survey.getQuestionByName("q1");
    expect(q1.value, "q1.value is correct").toLooseEqual("val2");
    expect(q1.isOtherSelected, "q1.isOtherSelected is false").toLooseEqual(false);
    expect(q1.selectedItem?.value, "q1.selectedItem is correct").toLooseEqual("val2");
  });
  test("Checkbox question show selected item incorrectly if choices set after the question value is set, Bug#9791", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "checkbox",
          "name": "q1",
          "showOtherItem": true,
        }
      ]
    });
    survey.data = { q1: ["val2", "val4"] };
    survey.getQuestionByName("q1").choices = [
      { value: "val1", text: "Item 1" },
      { value: "val2", text: "Item 2" },
      { value: "val3", text: "Item 3" },
      { value: "val4", text: "Item 4" },
    ];
    const q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    expect(q1.value, "q1.value is correct").toEqualValues(["val2", "val4"]);
    expect(q1.isOtherSelected, "q1.isOtherSelected is false").toLooseEqual(false);
    expect(q1.selectedChoices.length, "q1.selectedChoices.length is correct").toLooseEqual(2);
  });
  test("Dropdown question and choiceitem type", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "dropdown",
          "name": "q1",
          "choices": [1, 2, 3],
          "showOtherItem": true,
        }
      ]
    });
    const q1 = <QuestionDropdownModel>survey.getQuestionByName("q1");
    expect(q1.choices[0].getType(), "choiceitem type for choices[0]").toLooseEqual("choiceitem");
    expect(q1.choices[2].getType(), "choiceitem type for choices[2]").toLooseEqual("choiceitem");
    expect(q1.otherItem.getType(), "choiceitem type for otherItem").toLooseEqual("choiceitem");
  });
  test("Radiogroup question and choices has comment", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "radiogroup",
          "name": "q1",
          "choices": [1, { value: 2, showCommentArea: true }, 3],
          "showOtherItem": true,
        }
      ]
    });
    const q1 = <QuestionRadiogroupModel>survey.getQuestionByName("q1");
    expect(q1.comment, "comment is empty by default").toLooseEqual("");
    expect(q1.choices[0].showCommentArea, "choices[0].showCommentArea").toLooseEqual(false);
    expect(q1.choices[1].showCommentArea, "choices[1].showCommentArea").toLooseEqual(true);
    expect(q1.otherItem.showCommentArea, "choices[1].showCommentArea").toLooseEqual(true);
    expect(q1.isCommentShowing(q1.choices[0]), "isCommentShowing for choices[0], #1").toLooseEqual(false);
    expect(q1.isCommentShowing(q1.choices[1]), "isCommentShowing for choices[1], #1").toLooseEqual(false);
    expect(q1.isCommentShowing(q1.otherItem), "isCommentShowing for otherItem, #1").toLooseEqual(false);
    expect(q1.choices[0].isCommentShowing, "isCommentShowing for choices[0], #1").toLooseEqual(false);
    expect(q1.choices[1].isCommentShowing, "isCommentShowing for choices[1], #1").toLooseEqual(false);
    q1.clickItemHandler(q1.otherItem);
    expect(q1.isCommentShowing(q1.choices[1]), "isCommentShowing for choices[1], #2").toLooseEqual(false);
    expect(q1.isCommentShowing(q1.otherItem), "isCommentShowing for otherItem, #2").toLooseEqual(true);
    expect(q1.otherItem.isCommentShowing, "isCommentShowing for otherItem, #2").toLooseEqual(true);
    q1.clickItemHandler(q1.choices[1]);
    expect(q1.isCommentShowing(q1.choices[1]), "isCommentShowing for choices[1], #3").toLooseEqual(true);
    expect(q1.choices[1].isCommentShowing, "isCommentShowing for choices[1], #3").toLooseEqual(true);
    expect(q1.isCommentShowing(q1.otherItem), "isCommentShowing for otherItem, #3").toLooseEqual(false);
    expect(q1.otherItem.isCommentShowing, "isCommentShowing for otherItem, #3").toLooseEqual(false);
    q1.setCommentValue(q1.choices[0], "test comment, #1");
    expect(q1.comment, "comment is empty if we set comment for choices[0], #1").toBeFalsy();
    expect(q1.renderedValue, "renderedValue, #1").toLooseEqual(2);
    expect(q1.isCommentShowing(q1.choices[1]), "comment is showing, #1").toLooseEqual(true);
    q1.setCommentValue(q1.choices[1], "test comment");
    expect(q1.comment, "comment is not used for choices[1], #2").toBeFalsy();
    expect(q1.getCommentValue(q1.choices[0]), "getCommentValue for choices[0], #2").toLooseEqual("");
    expect(q1.getCommentValue(q1.choices[1]), "getCommentValue for choices[1], #2").toLooseEqual("test comment");
    expect(q1.getCommentValue(q1.otherItem), "getCommentValue for otherItem, #2").toLooseEqual("");
    q1.setCommentValue(q1.otherItem, "test comment 2");
    expect(q1.getCommentValue(q1.choices[1]), "getCommentValue for choices[1], #3").toLooseEqual("test comment");
    expect(q1.getCommentValue(q1.otherItem), "getCommentValue for otherItem, #3").toLooseEqual("");
    q1.clickItemHandler(q1.otherItem);
    expect(q1.getCommentValue(q1.choices[1]), "getCommentValue for choices[1], #4").toLooseEqual("");
    expect(q1.getCommentValue(q1.otherItem), "getCommentValue for otherItem, #4").toLooseEqual("");
    q1.setCommentValue(q1.otherItem, "test comment 3");
    expect(q1.getCommentValue(q1.choices[1]), "getCommentValue for choices[1], #5").toLooseEqual("");
    expect(q1.getCommentValue(q1.otherItem), "getCommentValue for otherItem, #5").toLooseEqual("test comment 3");
  });
  test("Radiogroup/dropdown questions and choices has comment: do not remove comment on complete", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "radiogroup",
          "name": "q1",
          "choices": [1, { value: 2, showCommentArea: true }, 3]
        },
        {
          "type": "dropdown",
          "name": "q2",
          "choices": [1, { value: 2, showCommentArea: true }, 3]
        }
      ]
    });
    const q1 = <QuestionRadiogroupModel>survey.getQuestionByName("q1");
    const q2 = <QuestionRadiogroupModel>survey.getQuestionByName("q2");
    q1.clickItemHandler(q1.choices[1]);
    q1.setCommentValue(q1.choices[1], "test comment1");
    q2.renderedValue = 2;
    q2.setCommentValue(q1.choices[1], "test comment2");
    survey.doComplete();
    expect(survey.data, "survey.data after complete").toEqualValues({ q1: { value: 2, comment: "test comment1" }, q2: { value: 2, comment: "test comment2" } });
  });
  test("Radiogroup question, choices has comment and defaultValue", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "radiogroup",
          "name": "q1",
          "choices": [1, { value: 2, showCommentArea: true }, 3],
          "showOtherItem": true,
          defaultValue: "other",
        }
      ]
    });
    const q1 = <QuestionRadiogroupModel>survey.getQuestionByName("q1");
    expect(q1.value, "q1.value is 'other'").toLooseEqual("other");
    expect(q1.isOtherSelected, "q1.isOtherSelected is true").toLooseEqual(true);
    expect(q1.isCommentShowing(q1.otherItem), "isCommentShowing for otherItem, #1").toLooseEqual(true);
    expect(q1.otherItem.isCommentShowing, "isCommentShowing for otherItem, #1").toLooseEqual(true);
    expect(q1.renderedValue, "q1.renderedValue is 'other'").toLooseEqual("other");
  });
  function testCheckboxQuestionWithSeveralCommentChoices(q1: QuestionCheckboxModel): void {
    expect(q1.choices[0].showCommentArea, "choices[0].showCommentArea").toLooseEqual(false);
    expect(q1.choices[1].showCommentArea, "choices[1].showCommentArea").toLooseEqual(true);
    expect(q1.choices[2].showCommentArea, "choices[2].showCommentArea").toLooseEqual(true);
    expect(q1.otherItem.showCommentArea, "choices[1].showCommentArea").toLooseEqual(true);
    expect(q1.isCommentShowing(q1.choices[0]), "isCommentShowing for choices[0], #1").toLooseEqual(false);
    expect(q1.isCommentShowing(q1.choices[1]), "isCommentShowing for choices[1], #1").toLooseEqual(false);
    expect(q1.isCommentShowing(q1.otherItem), "isCommentShowing for otherItem, #1").toLooseEqual(false);
    q1.clickItemHandler(q1.otherItem, true);
    expect(q1.isCommentShowing(q1.choices[1]), "isCommentShowing for choices[1], #2").toLooseEqual(false);
    expect(q1.isCommentShowing(q1.otherItem), "isCommentShowing for otherItem, #2").toLooseEqual(true);
    q1.clickItemHandler(q1.choices[1], true);
    expect(q1.isCommentShowing(q1.choices[1]), "isCommentShowing for choices[1], #3").toLooseEqual(true);
    expect(q1.isCommentShowing(q1.otherItem), "isCommentShowing for otherItem, #3").toLooseEqual(true);
    q1.setCommentValue(q1.choices[1], "test comment, #1");
    q1.setCommentValue(q1.choices[2], "test comment, #2");
    q1.setCommentValue(q1.otherItem, "test comment, #other");
    expect(q1.getCommentValue(q1.choices[0]), "getCommentValue for choices[0], #4").toLooseEqual("");
    expect(q1.getCommentValue(q1.choices[1]), "getCommentValue for choices[1], #4").toLooseEqual("test comment, #1");
    expect(q1.getCommentValue(q1.choices[2]), "getCommentValue for choices[2], #4").toLooseEqual("");
    expect(q1.getCommentValue(q1.otherItem), "getCommentValue for otherItem, #4").toLooseEqual("test comment, #other");
    q1.clickItemHandler(q1.choices[2], true);
    q1.setCommentValue(q1.choices[2], "test comment, #2");
    expect(q1.getCommentValue(q1.choices[0]), "getCommentValue for choices[0], #5").toLooseEqual("");
    expect(q1.getCommentValue(q1.choices[1]), "getCommentValue for choices[1], #5").toLooseEqual("test comment, #1");
    expect(q1.getCommentValue(q1.choices[2]), "getCommentValue for choices[2], #5").toLooseEqual("test comment, #2");
    expect(q1.getCommentValue(q1.otherItem), "getCommentValue for otherItem, #5").toLooseEqual("test comment, #other");
    q1.clickItemHandler(q1.otherItem, false);
    q1.clickItemHandler(q1.choices[0], false);
    q1.clickItemHandler(q1.choices[1], false);
    expect(q1.getCommentValue(q1.choices[0]), "getCommentValue for choices[0], #6").toLooseEqual("");
    expect(q1.getCommentValue(q1.choices[1]), "getCommentValue for choices[1], #6").toLooseEqual("");
    expect(q1.getCommentValue(q1.choices[2]), "getCommentValue for choices[2], #6").toLooseEqual("test comment, #2");
    expect(q1.getCommentValue(q1.otherItem), "getCommentValue for otherItem, #6").toLooseEqual("");
  }
  test("checbox question and choices has comment", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "checkbox",
          "name": "q1",
          "choices": [1, { value: 2, showCommentArea: true }, { value: 3, showCommentArea: true }],
          "showOtherItem": true,
        }
      ]
    });
    const q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    testCheckboxQuestionWithSeveralCommentChoices(q1);
  });
  test("checbox question and choices has comment and storeOthersAsComment = false", () => {
    const survey = new SurveyModel({
      storeOthersAsComment: false,
      "elements": [
        {
          "type": "checkbox",
          "name": "q1",
          "choices": [1, { value: 2, showCommentArea: true }, { value: 3, showCommentArea: true }],
          "showOtherItem": true,
        }
      ]
    });
    const q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    testCheckboxQuestionWithSeveralCommentChoices(q1);
  });
  test("checbox question and choices has comment vs renderedValue", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "checkbox",
          "name": "q1",
          "choices": [1, { value: 2, showCommentArea: true }, 3]
        }
      ]
    });
    const q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    q1.renderedValue = [1, 2];
    q1.setCommentValue(q1.choices[1], "test comment");
    expect(q1.getCommentValue(q1.choices[1]), "getCommentValue for choices[1], #1").toLooseEqual("test comment");
    expect(q1.comment, "comment is not set for choices[1], #1").toBeFalsy();
  });
  test("checbox question and choices has comment: clear comment on unselecting choice", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "checkbox",
          "name": "q1",
          "choices": [1, { value: 2, showCommentArea: true }, 3],
          "showOtherItem": true,
          "showNoneItem": true
        }
      ]
    });
    const q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    q1.renderedValue = [1, 2];
    const textArea1 = q1.getCommentTextAreaModel(q1.choices[1]);
    q1.setCommentValue(q1.choices[1], "test comment");
    expect(q1.getCommentValue(q1.choices[1]), "getCommentValue for choices[1], #1").toLooseEqual("test comment");
    const propName = "other_" + q1.choices[1].uniqueId;
    expect(q1.getPropertyValue(propName), "comment property value, #1").toLooseEqual("test comment");
    q1.renderedValue = [1];
    expect(q1.getCommentValue(q1.choices[1]), "getCommentValue for choices[1], #2").toLooseEqual("");
    expect(q1.getPropertyValue(propName), "comment property value, #2").toLooseEqual(undefined);
    expect(textArea1.getTextValue(), "No value in text area").toLooseEqual("");
    q1.renderedValue = [1, 2];
    q1.setCommentValue(q1.choices[1], "test comment");
    expect(q1.getCommentValue(q1.choices[1]), "getCommentValue for choices[1], #3").toLooseEqual("test comment");
    q1.clickItemHandler(q1.noneItem, true);
    expect(q1.getCommentValue(q1.choices[1]), "getCommentValue for choices[1], #4").toLooseEqual("");
  });
  test("checbox question and choices has comment with other value", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "checkbox",
          "name": "q1",
          "choices": [1, { value: "other", showCommentArea: true }, 3]
        }
      ]
    });
    const q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    q1.renderedValue = [1, "other"];
    q1.setCommentValue(q1.choices[1], "test comment");
    expect(q1.getCommentValue(q1.choices[1]), "getCommentValue for choices[1], #1").toLooseEqual("test comment");
    expect(q1.comment, "comment is set for choices[1], #1").toLooseEqual("test comment");
    q1.comment = "test comment 2";
    expect(q1.getCommentValue(q1.choices[1]), "getCommentValue for choices[1], #2").toLooseEqual("test comment 2");
  });
  test("checkbox vs multiple comment choices - question.value", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "checkbox",
          "name": "q1",
          "choices": [1, { value: 2, showCommentArea: true }, { value: 3, showCommentArea: true }],
          "showOtherItem": true
        }
      ]
    });
    const q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    expect(q1.getValuePropertyName(), "getValuePropertyName").toLooseEqual("value");
    q1.renderedValue = [1, 2, "other"];
    expect(q1.value, "q1.value, #1").toEqualValues([{ value: 1 }, { value: 2 }, { value: "other" }]);
    q1.setCommentValue(q1.choices[1], "choices comment1");
    q1.setCommentValue(q1.otherItem, "other comment1");
    expect(q1.value, "q1.value, #2").toEqualValues([{ value: 1 }, { value: 2, comment: "choices comment1" }, { value: "other comment1" }]);
    q1.value = [{ value: 1 }, { value: 3, comment: "choice comment3" }, { value: "other comment2" }];
    expect(q1.renderedValue, "q1.renderedValue, #3").toEqualValues([1, 3, "other"]);
    expect(q1.value, "q1.value, #3").toEqualValues([{ value: 1 }, { value: 3, comment: "choice comment3" }, { value: "other comment2" }]);
    expect(q1.getCommentValue(q1.choices[0]), "getCommentValue for choices[0], #3").toLooseEqual("");
    expect(q1.getCommentValue(q1.choices[1]), "getCommentValue for choices[1], #3").toLooseEqual("");
    expect(q1.getCommentValue(q1.choices[2]), "getCommentValue for choices[2], #3").toLooseEqual("choice comment3");
    expect(q1.getCommentValue(q1.otherItem), "getCommentValue for otherItem, #3").toLooseEqual("other comment2");
  });
  test("checkbox vs multiple comment choices - question.value - set incorrect value", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "checkbox",
          "name": "q1",
          "choices": [1, { value: 2, showCommentArea: true }, { value: 3, showCommentArea: true }],
          "showOtherItem": true
        }
      ]
    });
    const q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    expect(q1.getValuePropertyName(), "getValuePropertyName").toLooseEqual("value");
    q1.value = [1, 2, "other"];
    expect(q1.value, "q1.value, #1").toEqualValues([{ value: 1 }, { value: 2 }, { value: "other" }]);
    expect(q1.renderedValue, "q1.renderedValue, #1").toEqualValues([1, 2, "other"]);
  });
  test("Radiogroup question and choices has comment, storeOthersAsComment: false", () => {
    const survey = new SurveyModel({
      storeOthersAsComment: false,
      "elements": [
        {
          "type": "radiogroup",
          "name": "q1",
          "choices": [1, 2, 3]
        },
        {
          "type": "radiogroup",
          "name": "q2",
          "choices": [1, 2, 3],
          "showCommentArea": true,
          "showOtherItem": true,
        },
        {
          "type": "radiogroup",
          "name": "q3",
          "choices": [1, { value: 2, showCommentArea: true }, 3],
          "showOtherItem": true,
        },
        {
          "type": "radiogroup",
          "name": "q4",
          "choices": [1, { value: 2, showCommentArea: true }, 3],
          "showCommentArea": true,
          "showOtherItem": true,
        }
      ]
    });
    const checkFunc = (name: string, res: boolean, no: number) => {
      const q = <QuestionRadiogroupModel>survey.getQuestionByName(name);
      expect(q.getStoreOthersAsComment(), "getStoreOthersAsComment() #" + no.toString()).toLooseEqual(res);
    };
    checkFunc("q1", false, 1);
    checkFunc("q2", false, 2);
    checkFunc("q3", true, 3);
    checkFunc("q4", false, 4);
  });
  test("storeOthersAsComment: false, add dynamic question vs survey.data, Bug#10327", () => {
    const survey = new SurveyModel({
      storeOthersAsComment: false,
      "elements": [
        {
          "type": "dropdown",
          "name": "q1",
          "choices": [1, 2, 3]
        }
      ]
    });
    survey.data = {
      q1: 2,
      q2: 2,
      q3: 3
    };
    const page = survey.pages[0];
    const q1 = survey.getQuestionByName("q1");
    survey.onValueChanged.add((sender, options) => {
      if (options.name === "q1" && options.value === 1) {
        const q2 = page.addNewQuestion("radiogroup", "q2");
        q2.fromJSON({ choices: [1, 2, 3] });
        const q3 = page.addNewQuestion("radiogroup", "q3");
        q3.fromJSON({ choices: [1, 2, 3] });
      }
    });
    q1.value = 1;
    const q2 = <QuestionRadiogroupModel>survey.getQuestionByName("q2");
    const q3 = survey.getQuestionByName("q3");
    expect(q1.value, "q1 is correct").toLooseEqual(1);
    expect(q2.value, "q2 is correct").toLooseEqual(2);
    expect(q3.value, "q3 is correct").toLooseEqual(3);
    expect(q2.selectedItem.value, "q2 selectedItem.value is correct").toLooseEqual(2);
    expect(q2.renderedValue, "q2 renderedValue is correct").toLooseEqual(2);
    expect(q2.isItemSelected(q2.choices[1]), "q2 isItemSelected(1) is correct").toLooseEqual(true);
    expect(q2.isOtherSelected, "q2 isOtherSelected is correct").toLooseEqual(false);
  });
  test("Create multiple choice item for checkbox", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "checkbox",
          name: "q1",
          showOtherItem: true,
          choices: [1, 2, 3]
        }
      ]
    });
    const q = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    expect(q.choices[0].getType(), "choice 0 is checkboxitem").toLooseEqual("checkboxitem");
    expect(q.choices[2].getType(), "choice 2 is checkboxitem").toLooseEqual("checkboxitem");
    expect(q.selectAllItem.getType(), "selectAllItem is checkboxitem").toLooseEqual("checkboxitem");
    expect(q.noneItem.getType(), "noneItem is checkboxitem").toLooseEqual("checkboxitem");
    expect(q.otherItem.getType(), "otherItem is checkboxitem").toLooseEqual("checkboxitem");
    expect(q.refuseItem.getType(), "refuseItem is checkboxitem").toLooseEqual("checkboxitem");
    expect(q.dontKnowItem.getType(), "dontKnowItem is checkboxitem").toLooseEqual("checkboxitem");
    expect(q.selectAllItem.isExclusive, "selectAllItem => isExclusive").toLooseEqual(false);
    expect(q.noneItem.isExclusive, "noneItem => isExclusive").toLooseEqual(true);
    expect(q.otherItem.isExclusive, "otherItem  => isExclusive").toLooseEqual(false);
    expect(q.refuseItem.isExclusive, "refuseItem => isExclusive").toLooseEqual(true);
    expect(q.dontKnowItem.isExclusive, "dontKnowItem => isExclusive").toLooseEqual(true);
  });
  test("checkbox vs selectAll and isExclusive", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "checkbox",
          name: "q1",
          choices: ["apple", "banana", { value: "none2", isExclusive: true }, "orange"],
          showNoneItem: true,
          showSelectAllItem: true
        }
      ]
    });
    const q = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    q.toggleSelectAll();
    expect(q.value, "#1").toEqualValues(["apple", "banana", "orange"]);
    expect(q.isAllSelected, "#3, all is selected").toLooseEqual(true);
    q.clickItemHandler(q.choices[2], true);
    expect(q.value, "#4").toEqualValues(["none2"]);
    expect(q.isAllSelected, "#5, all is not selected").toLooseEqual(false);
    q.clickItemHandler(q.selectAllItem, true);
    expect(q.value, "#6").toEqualValues(["apple", "banana", "orange"]);
    q.clickItemHandler(q.noneItem, true);
    expect(q.value, "#7").toEqualValues(["none"]);
    q.clickItemHandler(q.choices[2], true);
    expect(q.value, "#8").toEqualValues(["none2"]);
    q.clickItemHandler(q.choices[0], true);
    expect(q.value, "#10").toEqualValues(["apple"]);

    q.renderedValue = ["apple", "none2"];
    expect(q.value, "#11").toEqualValues(["none2"]);
    q.renderedValue = ["none2", "none"];
    expect(q.value, "#12").toEqualValues(["none"]);
  });
  test("checkbox vs selectAll and enableIf, Bug#10895", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "checkbox",
          name: "q1",
          choices: ["item1", { value: "item2", enableIf: "{q2} = 1" }, { value: "item3", enableIf: "{q2} = 2" }, "item4"],
          showSelectAllItem: true
        },
        { type: "radiogroup", name: "q2", choices: [1, 2] }
      ]
    });
    const q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    const q2 = <QuestionRadiogroupModel>survey.getQuestionByName("q2");
    q1.toggleSelectAll();
    expect(q1.value, "#1").toEqualValues(["item1", "item4"]);
    expect(q1.isAllSelected, "#1, all is selected").toLooseEqual(true);
    q2.value = 1;
    expect(q1.isAllSelected, "#2, all is not selected").toLooseEqual(false);
    q1.toggleSelectAll();
    expect(q1.value, "#3").toEqualValues(["item1", "item2", "item4"]);
    q2.value = 2;
    expect(q1.isAllSelected, "#4, all is not selected").toLooseEqual(false);
    q1.toggleSelectAll();
    expect(q1.value, "#5").toEqualValues(["item1", "item2", "item3", "item4"]);
    q1.toggleSelectAll();
    expect(q1.value, "#6").toEqualValues(["item2"]);
  });
  test("Focus element on selecting showCommentArea element", () => {
    const oldFunc = SurveyElement.FocusElement;
    const els = new Array<string>();
    SurveyElement.FocusElement = function (elId: string): boolean {
      const index = elId.lastIndexOf("_");
      els.push(elId.substring(index + 1));
      return true;
    };

    let survey = new SurveyModel({
      elements: [
        {
          "type": "checkbox",
          "name": "q1",
          "choices": [{ value: 1, showCommentArea: true }, 2, { value: 3, showCommentArea: true }],
          "showOtherItem": true
        },
        {
          "type": "radiogroup",
          "name": "q2",
          "choices": [{ value: 1, showCommentArea: true }, 2, { value: 3, showCommentArea: true }],
          "showOtherItem": true
        }
      ]
    });
    const q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    let otherId = q1.otherItem.uniqueId.toString();
    let choice1Id = q1.choices[0].uniqueId.toString();
    let choice3Id = q1.choices[2].uniqueId.toString();
    q1.selectItem(q1.otherItem, true);
    expect(els, "q1.focus #1").toEqualValues([otherId]);
    q1.selectItem(q1.otherItem, false);
    expect(els, "q1.focus #2").toEqualValues([otherId]);
    q1.selectItem(q1.choices[0], true);
    expect(els, "q1.focus #3").toEqualValues([otherId, choice1Id]);
    q1.selectItem(q1.choices[0], false);
    q1.selectItem(q1.choices[1], true);
    expect(els, "q1.focus #4").toEqualValues([otherId, choice1Id]);
    q1.selectItem(q1.choices[2], true);
    expect(els, "q1.focus #5").toEqualValues([otherId, choice1Id, choice3Id]);

    const q2 = <QuestionRadiogroupModel>survey.getQuestionByName("q2");
    otherId = q2.otherItem.uniqueId.toString();
    choice1Id = q2.choices[0].uniqueId.toString();
    choice3Id = q2.choices[2].uniqueId.toString();
    els.length = 0;
    q2.selectItem(q2.otherItem);
    expect(els, "q2.focus #1").toEqualValues([otherId]);
    q2.selectItem(q2.choices[0]);
    expect(els, "q2.focus #2").toEqualValues([otherId, choice1Id]);
    q2.selectItem(q2.choices[1]);
    expect(els, "q2.focus #3").toEqualValues([otherId, choice1Id]);
    q2.selectItem(q2.choices[2]);
    expect(els, "q2.focus #4").toEqualValues([otherId, choice1Id, choice3Id]);

    els.length = 0;
    q1.autoOtherMode = true;
    q2.autoOtherMode = true;
    q1.selectItem(q1.otherItem, true);
    q2.selectItem(q2.otherItem);
    expect(els, "autoOtherMode, focus is not called").toEqualValues([]);
    SurveyElement.FocusElement = oldFunc;
  });
  test("Radiogroup/dropdown showCommentArea validation", () => {
    const survey = new SurveyModel({
      elements: [
        {
          "type": "radiogroup",
          "name": "q1",
          "choices": [{ value: 1, showCommentArea: true, isCommentRequired: true }, 2, { value: 3, showCommentArea: true }],
          "showOtherItem": true
        },
        {
          "type": "dropdown",
          "name": "q2",
          "choices": [{ value: 1, showCommentArea: true, isCommentRequired: true }, 2, { value: 3, showCommentArea: true }],
          "showOtherItem": true
        },
      ]
    });
    const q1 = <QuestionRadiogroupModel>survey.getQuestionByName("q1");
    const q2 = <QuestionDropdownModel>survey.getQuestionByName("q2");
    expect(q1.validate(), "q1 validation, #1").toLooseEqual(true);
    expect(q2.validate(), "q1 validation, #1").toLooseEqual(true);
    q1.value = 1;
    q2.value = 1;
    expect(q1.validate(), "q1 validation, #2").toLooseEqual(false);
    expect(q2.validate(), "q2 validation, #2").toLooseEqual(false);
    q1.setCommentValue(q1.choices[0], "test comment");
    q2.setCommentValue(q1.choices[0], "test comment");
    expect(q1.validate(), "q1 validation, #3").toLooseEqual(true);
    expect(q2.validate(), "q2 validation, #3").toLooseEqual(true);
    q1.value = 2;
    q2.value = 2;
    expect(q1.validate(), "q1 validation, #4").toLooseEqual(true);
    expect(q2.validate(), "q2 validation, #4").toLooseEqual(true);
    q1.value = 3;
    q2.value = 3;
    expect(q1.validate(), "q1 validation, #5").toLooseEqual(true);
    expect(q2.validate(), "q2 validation, #5").toLooseEqual(true);
    q1.setCommentValue(q1.choices[2], "test comment");
    q2.setCommentValue(q1.choices[2], "test comment");
    expect(q1.validate(), "q1 validation, #6").toLooseEqual(true);
    expect(q2.validate(), "q2 validation, #6").toLooseEqual(true);
    expect(q1.otherValue, "q1 otherValue, #6").toBeFalsy();
    expect(q2.otherValue, "q2 otherValue, #6").toBeFalsy();
    q1.renderedValue = "other";
    q2.renderedValue = "other";
    expect(q1.otherValue, "q1 otherValue, #7").toBeFalsy();
    expect(q2.otherValue, "q2 otherValue, #7").toBeFalsy();
    expect(q1.validate(), "q1 validation, #7").toLooseEqual(false);
    expect(q2.validate(), "q2 validation, #7").toLooseEqual(false);
    q1.otherValue = "test comment";
    q2.otherValue = "test comment";
    expect(q1.validate(), "q1 validation, #8").toLooseEqual(true);
    expect(q2.validate(), "q2 validation, #8").toLooseEqual(true);
  });
  test("Checkbox showCommentArea validation", () => {
    const survey = new SurveyModel({
      elements: [
        {
          "type": "checkbox",
          "name": "q1",
          "choices": [{ value: 1, showCommentArea: true, isCommentRequired: true }, 2, { value: 3, showCommentArea: true }],
          "showOtherItem": true
        }
      ]
    });
    const q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    expect(q1.validate(), "q1 validation, #1").toLooseEqual(true);
    q1.clickItemHandler(q1.choices[0], true);
    expect(q1.validate(), "q1 validation, #2").toLooseEqual(false);
    q1.setCommentValue(q1.choices[0], "test comment");
    expect(q1.validate(), "q1 validation, #3").toLooseEqual(true);
    q1.clickItemHandler(q1.choices[1], true);
    expect(q1.validate(), "q1 validation, #4").toLooseEqual(true);
    q1.clickItemHandler(q1.choices[2], true);
    expect(q1.validate(), "q1 validation, #5").toLooseEqual(true);
    q1.setCommentValue(q1.choices[2], "test comment");
    expect(q1.validate(), "q1 validation, #6").toLooseEqual(true);
    q1.clickItemHandler(q1.otherItem, true);
    expect(q1.otherItem.showCommentArea, "q1 otherItem showCommentArea").toLooseEqual(true);
    expect(q1.otherItem.isCommentShowing, "q1 otherItem isCommentShowing, #7").toLooseEqual(true);
    expect(q1.validate(), "q1 validation, #7").toLooseEqual(false);
    q1.setCommentValue(q1.otherItem, "test comment");
    expect(q1.validate(), "q1 validation, #8").toLooseEqual(true);
  });
  test("Radiogroup/dropdown showCommentArea supportAutoAdvance", () => {
    const survey = new SurveyModel({
      elements: [
        {
          "type": "radiogroup",
          "name": "q1",
          "choices": [{ value: 1, showCommentArea: true, isCommentRequired: true }, 2, { value: 3, showCommentArea: true }],
          "showOtherItem": true
        },
        {
          "type": "dropdown",
          "name": "q2",
          "choices": [{ value: 1, showCommentArea: true, isCommentRequired: true }, 2, { value: 3, showCommentArea: true }],
          "showOtherItem": true
        },
      ]
    });
    const q1 = <QuestionRadiogroupModel>survey.getQuestionByName("q1");
    const q2 = <QuestionDropdownModel>survey.getQuestionByName("q2");
    q1.onMouseDown();
    expect(q1.supportAutoAdvance(), "q1 supportAutoAdvance, #1").toLooseEqual(true);
    expect(q2.supportAutoAdvance(), "q2 supportAutoAdvance, #1").toLooseEqual(true);
    q1.value = 1;
    q2.value = 1;
    q1.onMouseDown();
    expect(q1.supportAutoAdvance(), "q1 supportAutoAdvance, #2").toLooseEqual(false);
    expect(q2.supportAutoAdvance(), "q2 supportAutoAdvance, #2").toLooseEqual(false);
    q1.value = 2;
    q2.value = 2;
    q1.onMouseDown();
    expect(q1.supportAutoAdvance(), "q1 supportAutoAdvance, #3").toLooseEqual(true);
    expect(q2.supportAutoAdvance(), "q2 supportAutoAdvance, #3").toLooseEqual(true);
    q1.value = "other";
    q2.value = "other";
    q1.onMouseDown();
    expect(q1.supportAutoAdvance(), "q1 supportAutoAdvance, #4").toLooseEqual(false);
    expect(q2.supportAutoAdvance(), "q2 supportAutoAdvance, #4").toLooseEqual(false);
  });
  test("checkbox/radiogroup showCommentArea & isCommentRequired", () => {
    const survey = new SurveyModel({
      elements: [
        {
          "type": "radiogroup",
          "name": "q1",
          "choices": [{ value: 1, showCommentArea: true, isCommentRequired: true }, 2, { value: 3, showCommentArea: true }]
        },
        {
          "type": "checkbox",
          "name": "q2",
          "choices": [{ value: 1, showCommentArea: true, isCommentRequired: true }, 2, { value: 3, showCommentArea: true }]
        },
      ]
    });
    const q1 = <QuestionRadiogroupModel>survey.getQuestionByName("q1");
    const q2 = <QuestionCheckboxModel>survey.getQuestionByName("q2");
    q1.renderedValue = 1;
    expect(q1.renderedValue, "q1 renderedValue, #1").toLooseEqual(1);
    q2.renderedValue = [1, 2];
    expect(q1.validate(), "q1 validate, #1").toLooseEqual(false);
    expect(q2.validate(), "q2 validate, #1").toLooseEqual(false);
    q1.renderedValue = 3;
    q2.renderedValue = [2, 3];
    expect(q1.validate(), "q1 validate, #2").toLooseEqual(true);
    expect(q2.validate(), "q2 validate, #2").toLooseEqual(true);
    q2.setCommentValue(q2.choices[2], "");
    expect(q2.value, "q2.value #1").toEqualValues([{ value: 2 }, { value: 3 }]);
    q1.setCommentValue(q2.choices[2], "test comment1");
    q2.setCommentValue(q2.choices[2], "test comment2");
    expect(q2.validate(), "q2 validate, #3").toLooseEqual(true);
    expect(q1.value, "q1.value #2").toEqualValues({ value: 3, comment: "test comment1" });
    expect(q2.value, "q2.value #2").toEqualValues([{ value: 2 }, { value: 3, comment: "test comment2" }]);
  });
  test("radiogroup showCommentArea & renderedValue/value", () => {
    const survey = new SurveyModel({
      elements: [
        {
          "type": "radiogroup",
          "name": "q1",
          "choices": [{ value: 1, showCommentArea: true }, 2, { value: 3, showCommentArea: true }]
        }
      ]
    });
    const q1 = <QuestionRadiogroupModel>survey.getQuestionByName("q1");
    q1.value = 1;
    expect(q1.renderedValue, "q1.renderedValue #1").toLooseEqual(1);
    q1.setCommentValue(q1.choices[0], "test comment1");
    expect(q1.renderedValue, "q1.renderedValue #2").toLooseEqual(1);
    expect(q1.value, "q1.value #2").toEqualValues({ value: 1, comment: "test comment1" });
    q1.renderedValue = 3;
    expect(q1.value, "q1.value #3").toLooseEqual(3);
    q1.value = { value: 1, comment: "test comment2" };
    expect(q1.renderedValue, "q1.renderedValue #3").toLooseEqual(1);
    expect(q1.getCommentValue(q1.choices[0]), "q1.getCommentValue #4").toLooseEqual("test comment2");
  });
  test("isCommentRequired serialization", () => {
    const q = new QuestionRadiogroupModel("q1");
    q.choices = [{ value: 1 }];
    const choice = q.choices[0];
    expect(choice.isCommentRequired, "isCommentRequired is false by default").toLooseEqual(false);
    expect(choice.toJSON().isCommentRequired, "isCommentRequired is undefined by default in JSON").toLooseEqual(undefined);
    choice.isCommentRequired = true;
    expect(choice.toJSON().isCommentRequired, "isCommentRequired is true after setting it").toLooseEqual(true);
  });
  test("commentPlaceholder serialization", () => {
    const survey = new SurveyModel({
      elements: [{ name: "q1", type: "radiogroup", choices: [1] }] });
    const q = survey.getQuestionByName("q1");
    expect(q.toJSON(), "serialization without commentPlaceholder").toEqualValues({ name: "q1", choices: [1] });
    q.choices[0].commentPlaceholder = "val1";
    expect(q.choices[0].locCommentPlaceholder.text, "locCommentPlaceholder.text is set").toLooseEqual("val1");
    expect(q.toJSON(), "serialization vs commentPlaceholder").toEqualValues({ name: "q1", choices: [{ value: 1, commentPlaceholder: "val1" }] });
    q.fromJSON({ name: "q1", type: "radiogroup", choices: [{ value: 1, commentPlaceholder: { default: "en-val", de: "de-val" } }] });
    expect(q.choices[0].locCommentPlaceholder.text, "locCommentPlaceholder.text for locale 'default'").toLooseEqual("en-val");
    survey.locale = "de";
    expect(q.choices[0].locCommentPlaceholder.text, "locCommentPlaceholder.text for locale 'de'").toLooseEqual("de-val");
    survey.locale = "fr";
    expect(q.choices[0].locCommentPlaceholder.text, "locCommentPlaceholder.text for locale 'fr #1'").toLooseEqual("en-val");
    q.choices[0].locCommentPlaceholder.text = "fr-val";
    expect(q.choices[0].locCommentPlaceholder.text, "locCommentPlaceholder.text for locale 'fr #2'").toLooseEqual("fr-val");
    expect(q.toJSON(), "serialization vs commentPlaceholder&locales").toEqualValues({ name: "q1", choices: [{ value: 1, commentPlaceholder: { "default": "en-val", "de": "de-val", fr: "fr-val" } }] });
    q.choices[0].locCommentPlaceholder.clear();
    expect(q.toJSON(), "serialization without commentPlaceholder #2").toEqualValues({ name: "q1", choices: [1] });
  });
  test("Do not remove spaces in other area, bug#10875", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "radiogroup",
          name: "q1",
          showOtherItem: true,
          choices: [
            "Item 1",
            "Item 2",
            "Item 3"
          ]
        }
      ]
    });

    const q1 = <QuestionRadiogroupModel>survey.getQuestionByName("q1");
    q1.value = "other";
    const otherArea = q1.otherTextAreaModel;
    expect(!!otherArea, "otherText is created").toBeTruthy();
    otherArea.onTextAreaBlur({ target: { value: "   some text   " } });
    expect(q1.otherValue, "do not trim spaces").toLooseEqual("   some text   ");
    expect(survey.data, "data is correct").toEqualValues({ q1: "other", "q1-Comment": "   some text   " });
    expect(q1.validate(), "no error on validation").toLooseEqual(true);
    otherArea.onTextAreaBlur({ target: { value: "      " } });
    expect(q1.otherValue, "trim spaces to empty, #2").toLooseEqual("");
    expect(q1.validate(), "there is an error on validation").toLooseEqual(false);
    expect(survey.data, "There is no comment in data").toEqualValues({ q1: "other" });
  });
  test("checbox question and choices has comment - custom placeholder", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "checkbox",
          "name": "q1",
          "choices": [{ value: 1, showCommentArea: true, text: "Item 1" }, { value: 2, showCommentArea: true, commentPlaceholder: "Please add comment" }, 3],
          "showOtherItem": true,
          "showNoneItem": true,
          "commentPlaceholder": "Some comment for {item}"
        }
      ]
    });
    const q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    q1.renderedValue = [1, 2];
    expect(q1.choices[1].commentPlaceholder, "commentPlaceholder for choices[1], #1").toLooseEqual("Please add comment");
    const textArea1 = q1.getCommentTextAreaModel(q1.choices[0]);
    const textArea2 = q1.getCommentTextAreaModel(q1.choices[1]);
    expect(textArea1.placeholder, "textArea1 placeholder").toLooseEqual("Some comment for Item 1");
    expect(textArea2.placeholder, "textArea2 placeholders").toLooseEqual("Please add comment");
  });
  test("checbox question and choices has comment - default value", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "checkbox",
          "name": "q1",
          "defaultValue": [{ value: 1, comment: "abc" }, { value: 2, comment: "edf" }],
          "choices": [{ value: 1, showCommentArea: true }, { value: 2, showCommentArea: true }],
          "showOtherItem": true,
          "showNoneItem": true,
          otherPlaceholder: "Some comment"
        }
      ]
    });
    const q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    expect(q1.renderedValue, "q1.renderedValue").toEqualValues([1, 2]);
    expect(q1.getCommentValue(q1.choices[0]), "getCommentValue for choices[0], #1").toLooseEqual("abc");
    expect(q1.getCommentValue(q1.choices[1]), "getCommentValue for choices[1], #1").toLooseEqual("edf");
  });
  test("checbox question and choices has comment - set value", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "checkbox",
          "name": "q1",
          "choices": [{ value: 1, showCommentArea: true }, { value: 2, showCommentArea: true }],
          "showOtherItem": true,
          "showNoneItem": true,
          otherPlaceholder: "Some comment"
        }
      ]
    });
    const q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    q1.value = [{ value: 1, comment: "abc" }, { value: 2, comment: "edf" }];
    expect(q1.renderedValue, "q1.renderedValue").toEqualValues([1, 2]);
    expect(q1.getCommentValue(q1.choices[0]), "getCommentValue for choices[0], #1").toLooseEqual("abc");
    expect(q1.getCommentValue(q1.choices[1]), "getCommentValue for choices[1], #1").toLooseEqual("edf");
  });
  test("radiogroup question and choices has comment - default value", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "radiogroup",
          "name": "q1",
          "defaultValue": [{ value: 1, comment: "abc" }, { value: 2, comment: "edf" }],
          "choices": { value: 1, showCommentArea: true },
          "showOtherItem": true,
          "showNoneItem": true,
          otherPlaceholder: "Some comment"
        }
      ]
    });
    const q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    expect(q1.renderedValue, "q1.renderedValue").toEqualValues(1);
    expect(q1.getCommentValue(q1.choices[0]), "getCommentValue for choices[0], #1").toLooseEqual("abc");
  });
  test("checkbox vs dataItems and isExclusive, Bug10002", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "checkbox",
          name: "q1",
          choices: ["apple", "banana", { value: "none2", isExclusive: true }, "orange"],
          showNoneItem: true,
          showSelectAllItem: true
        }
      ]
    });
    const q = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    expect(q.dataChoices.length, "dataChoices length").toLooseEqual(4);
    expect(q.dataChoices[2].value, "none2 is here").toLooseEqual("none2");
  });
  test("radiogroup question showOtherItem - lost focus on empty", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "radiogroup",
          "name": "q1",
          "choices": [1, 2, 3],
          "showOtherItem": true
        }
      ]
    });
    const q1 = <QuestionRadiogroupModel>survey.getQuestionByName("q1");
    q1.clickItemHandler(q1.otherItem);
    const textArea = q1.getCommentTextAreaModel(q1.otherItem);
    expect(textArea.getTextValue(), "text area is empty #1").toLooseEqual("");
    const event: any = { target: { value: "" } };
    textArea.onTextAreaBlur(event);
    expect(event.target.value, "event.target.value is empty").toBe("");
    expect(textArea.getTextValue(), "text area is empty #2").toLooseEqual("");
  });
  test("showOtherItem & textUpdateMode = 'onTyping' , Bug#10402", () => {
    const survey = new SurveyModel({
      "textUpdateMode": "onTyping",
      "elements": [
        {
          "type": "radiogroup",
          "name": "q1",
          "choices": ["item1", "item2"],
          "showOtherItem": true
        }
      ]
    });
    const q1 = <QuestionRadiogroupModel>survey.getQuestionByName("q1");
    q1.clickItemHandler(q1.otherItem);
    q1.getCommentTextAreaModel(q1.otherItem).onTextAreaInput({ target: { value: "abc " } });
    expect(q1.otherValue, "q1.otherValue #1").toLooseEqual("abc ");
    expect(survey.getComment("q1"), "survey.data #1").toLooseEqual("abc ");
    q1.getCommentTextAreaModel(q1.otherItem).onTextAreaChange({ target: { value: "abc xy " } });
    expect(q1.otherValue, "q1.otherValue #2").toLooseEqual("abc xy ");
  });
  test("radiogroup & checkbox questions and choices has comment - display value, Bug#10193", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "radiogroup",
          "name": "q1",
          "defaultValue": { value: 1, comment: "abc" },
          "choices": { value: 1, showCommentArea: true, text: "Item 1" }
        },
        {
          "type": "checkbox",
          "name": "q2",
          "defaultValue": [{ value: 1, comment: "abc" }],
          "choices": { value: 1, showCommentArea: true, text: "Item 1" }
        }
      ]
    });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    expect(q1.displayValue, "q1.displayValue, #1").toLooseEqual("Item 1");
    expect(q2.displayValue, "q2.displayValue, #2").toLooseEqual("Item 1");
  });
  test("checkbox choices vs showComment & isExclusive - display value, Bug#10236", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "checkbox",
          "name": "q1",
          "choices": [{ value: "item1", showCommentArea: true, isExclusive: true }, "item2", "item3"]
        }
      ]
    });
    const q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    q1.renderedValue = ["item2", "item3"];
    q1.clickItemHandler(q1.choices[0], true);
    expect(q1.renderedValue, "q1.renderedValue, #1").toEqualValues(["item1"]);
    expect(q1.value, "q1.value, #1").toEqualValues([{ value: "item1" }]);
    const textArea = q1.getCommentTextAreaModel(q1.choices[0]);
    textArea.onTextAreaBlur({ target: { value: "" } });
    expect(q1.renderedValue, "q1.renderedValue, #2").toEqualValues(["item1"]);
    expect(q1.value, "q1.value, #2").toEqualValues([{ value: "item1" }]);
    textArea.onTextAreaBlur({ target: { value: "abc" } });
    expect(q1.renderedValue, "q1.renderedValue, #3").toEqualValues(["item1"]);
    expect(q1.value, "q1.value, #3").toEqualValues([{ value: "item1", comment: "abc" }]);
  });
  test("checkbox choices vs showComment & selection, Bug#10243", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "checkbox",
          "name": "q1",
          "choices": [{ value: "item1", showCommentArea: true }, "item2"]
        }
      ]
    });
    const q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    survey.data = { q1: [{ value: "item1", comment: "abc" }, "item2"] };
    expect(q1.value, "q1.value, #1").toEqualValues([{ value: "item1", comment: "abc" }, "item2"]);
    expect(q1.renderedValue, "q1.renderedValue, #1").toEqualValues(["item1", "item2"]);
    expect(q1.getCommentTextAreaModel(q1.choices[0]).getTextValue(), "comment text area value, #1").toLooseEqual("abc");
  });
  test("radiogroup choices vs showComment & showOther & question showComment , Bug#10272", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "radiogroup",
          "name": "q1",
          "choices": [{ value: "item1", showCommentArea: true }, "item2"],
          "showOtherItem": true,
          "showCommentArea": true
        }
      ]
    });
    const q1 = <QuestionRadiogroupModel>survey.getQuestionByName("q1");
    q1.clickItemHandler(q1.otherItem);
    q1.getCommentTextAreaModel(q1.otherItem).onTextAreaBlur({ target: { value: "abc" } });
    q1.comment = "edf";
    expect(q1.value, "q1.value #1").toLooseEqual("abc");
    expect(q1.comment, "q1.comment #1").toLooseEqual("edf");
    q1.value = "abc2";
    expect(q1.value, "q1.value #2").toLooseEqual("abc2");
    expect(q1.comment, "q1.comment #2").toLooseEqual("edf");
    expect(survey.data, "survey.data #1").toEqualValues({ q1: "abc2", "q1-Comment": "edf" });
    q1.clickItemHandler(q1.choices[0]);
    q1.getCommentTextAreaModel(q1.choices[0]).onTextAreaBlur({ target: { value: "xyz" } });
    expect(q1.value, "q1.value #3").toEqualValues({ value: "item1", comment: "xyz" });
    expect(q1.comment, "q1.comment #3").toLooseEqual("edf");
    expect(survey.data, "survey.data #2").toEqualValues({ q1: { value: "item1", comment: "xyz" }, "q1-Comment": "edf" });
  });
  test("getComment function, Issue#10378", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "checkbox",
          "name": "q1",
          "choices": [{ value: "item1", showCommentArea: true }, { value: "item2", showCommentArea: true }, "item3"],
          "showOtherItem": true
        },
        {
          "type": "radiogroup",
          "name": "q2",
          "choices": ["item1", "item2", "item3"],
          "showOtherItem": true
        },
        {
          "type": "radiogroup",
          "name": "q3",
          "choices": ["item1", "item2", "item3"],
          "showComment": true
        },
        {
          "type": "radiogroup",
          "name": "q4",
          "choices": ["item1", "item2", "item3"]
        },
        { type: "expression", name: "exp1", expression: "getComment('q1', 'item1')" },
        { type: "expression", name: "exp2", expression: "getComment('q1', 'item2')" },
        { type: "expression", name: "exp3", expression: "getComment('q1', 'item3')" },
        { type: "expression", name: "exp4", expression: "getComment('q1', 'item4')" },
        { type: "expression", name: "exp5", expression: "getComment('q1')" },
        { type: "expression", name: "exp6", expression: "getComment('q2', 'item1')" },
        { type: "expression", name: "exp7", expression: "getComment('q2', 'item4')" },
        { type: "expression", name: "exp8", expression: "getComment('q2')" },
        { type: "expression", name: "exp9", expression: "getComment('q3')" },
        { type: "expression", name: "exp10", expression: "getComment('q4')" }
      ]
    });
    survey.data = {
      q1: [{ value: "item1", comment: "comment1_1" }, { value: "item2", comment: "comment1_2" }],
      q2: "item1",
      "q2-Comment": "comment2",
      q3: "item2",
      q4: "item3",
      "q4-Comment": "comment4"
    };
    const q3 = survey.getQuestionByName("q3");
    q3.otherValue = "comment3";
    expect(survey.getValue("exp1"), "q1, item1").toLooseEqual("comment1_1");
    expect(survey.getValue("exp2"), "q1, item2").toLooseEqual("comment1_2");
    expect(survey.getValue("exp3"), "q1, item3").toLooseEqual(null);
    expect(survey.getValue("exp4"), "q1, item4").toLooseEqual(null);
    expect(survey.getValue("exp5"), "q1, other").toLooseEqual(null);
    expect(survey.getValue("exp6"), "q2, item1").toLooseEqual(null);
    expect(survey.getValue("exp7"), "q2, item4").toLooseEqual(null);
    expect(survey.getValue("exp8"), "q2, other").toLooseEqual("comment2");
    expect(survey.getValue("exp9"), "q3, comment").toLooseEqual("comment3");
    expect(survey.getValue("exp10"), "q4, other").toLooseEqual(null);
  });
  test("choice item & elements , Issue#10384", () => {
    const survey = new SurveyModel({
      "title": "ttt",
      "elements": [
        {
          "type": "checkbox",
          "name": "q1",
          "choices": ["item1", { value: "item2", elements: [{ type: "text", name: "q1_1" }] }, "item3"]
        }
      ]
    });
    const q1_1 = survey.getQuestionByName("q1_1");
    const q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    const item1 = q1.choices[0];
    expect(item1.hasElements, "There is no elements in item1").toLooseEqual(false);
    expect(item1["panelValue"], "item1, panelValue is null").toBeFalsy();
    const item2 = q1.choices[1];
    expect(item2.hasElements, "There are elements in item2").toLooseEqual(true);
    expect(item2["panelValue"], "item2, panelValue is not null").toBeTruthy();
    expect(item2.panel.getSurvey().title, "item2, panel.survey is not null").toLooseEqual("ttt");
    expect(item2.panel.elements.length, "item2, panel has one element").toLooseEqual(1);
    expect(item2.panel.elements[0].name, "item2, panel has element q1_1").toLooseEqual("q1_1");
    expect(item2.panel.elements[0].survey?.title, "item2, panel has element q1_1 with survey").toLooseEqual("ttt");
    expect(item2.panel.elements[0].parent.getType(), "item2, panel has element q1_1 of parent panel").toLooseEqual("panel");
    const item3 = q1.choices[2];
    item3.panel.addNewQuestion("text", "q1_3");
    expect(item3.panel.getSurvey(), "item3, panel.survey is not null").toBeTruthy();
    expect(q1.toJSON(), "toJSON is correct").toEqualValues({ name: "q1", choices: [
      "item1",
      { value: "item2", elements: [{ type: "text", name: "q1_1" }] },
      { value: "item3", elements: [{ type: "text", name: "q1_3" }] }
    ] });
    expect(item1["panelValue"], "item1, panelValue is null after serialization").toBeFalsy();
  });
  test("choice item & supportElements , Issue#10384", () => {
    const q1 = new QuestionCheckboxModel("q1");
    q1.choices = ["item1"];
    expect(q1.choices[0].supportElements, "checkbox: item supportElements").toLooseEqual(true);
    const q2 = new QuestionRadiogroupModel("q2");
    q2.choices = ["item1"];
    expect(q2.choices[0].supportElements, "radiogroup: item1 supportElements").toLooseEqual(true);
    const q3 = new QuestionDropdownModel("q3");
    q3.choices = ["item1"];
    expect(q3.choices[0].supportElements, "dropdown: item supportElements").toLooseEqual(false);
  });
  test("choice item & isPanelShowing, Issue#10384", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "checkbox",
          "name": "q1",
          "choices": ["item1", { value: "item2", elements: [{ type: "text", name: "q1_1" }] }, "item3"]
        },
        {
          "type": "dropdown",
          "name": "q2",
          "choices": ["item1", "item2", "item3"]
        }
      ]
    });
    const q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    const q2 = <QuestionDropdownModel>survey.getQuestionByName("q2");
    const item1 = q1.choices[0];
    const item2 = q1.choices[1];
    const item3 = q2.choices[0];
    expect(item1.isPanelShowing, "item1: isPanelShowing false").toLooseEqual(false);
    expect(item2.isPanelShowing, "item2: isPanelShowing false").toLooseEqual(false);
    expect(item3.isPanelShowing, "item3: isPanelShowing false").toLooseEqual(false);
    q1.clickItemHandler(item1, true);
    expect(item1.isPanelShowing, "item1: isPanelShowing false #2").toLooseEqual(false);
    expect(item2.isPanelShowing, "item2: isPanelShowing false #2").toLooseEqual(false);
    q1.clickItemHandler(item2, true);
    expect(item1.isPanelShowing, "item1: isPanelShowing false #3").toLooseEqual(false);
    expect(item2.isPanelShowing, "item2: isPanelShowing true #1").toLooseEqual(true);
    q1.clickItemHandler(item2, false);
    expect(item1.isPanelShowing, "item1: isPanelShowing false #5").toLooseEqual(false);
  });

  test("choice item elements & getAllQuestions, Issue#10384", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "checkbox",
          "name": "q1",
          "choices": ["item1", { value: "item2", elements: [{ type: "text", name: "q1_1" }] }, "item3"]
        }
      ]
    });
    const q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    let qs = survey.getAllQuestions(false, false, true);
    expect(qs.length, "There are two questions: q1 and q1_1, #1").toLooseEqual(2);
    expect(qs[0].name, "the first question is q1").toLooseEqual("q1");
    expect(qs[1].name, "the second question is q1_1").toLooseEqual("q1_1");
    survey.setDesignMode(true);
    qs = survey.getAllQuestions(false, true, true);
    expect(qs.length, "There are two questions: q1 and q1_1, #2").toLooseEqual(2);
    survey.setDesignMode(false);
    qs = survey.getAllQuestions(true, true, true);
    expect(qs.length, "There is one question: q1").toLooseEqual(1);
    q1.clickItemHandler(q1.choices[1], true);
    qs = survey.getAllQuestions(true, true, true);
    expect(qs.length, "There are two questions: q1 and q1_1, #3").toLooseEqual(2);
  });
  test("choice item elements & getElementsInDesign, Issue#10384", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "checkbox",
          "name": "q1",
          "choices": [{ value: "item1", elements: [{ type: "text", name: "q1_1" }] },
            { value: "item2", elements: [{ type: "text", name: "q1_2" }] }, "item3"]
        }
      ]
    });
    const q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    expect(q1.choices.length, "There are three choices").toLooseEqual(3);
    let els = q1.getElementsInDesign(true);
    expect(els.length, "There are two elements: q1, #1").toLooseEqual(2);
    expect(els[0].getType(), "the element is panel, #1").toLooseEqual("panel");
    els = q1.getElementsInDesign(false);
    expect(els.length, "There are two elements, #2").toLooseEqual(2);
    expect(els[0].name, "the element is q1_1, #2").toLooseEqual("q1_1");
  });
  test("choice item & elements, survey.onQuestionCreated/Added & getQuestionByName Issue#10384", () => {
    const survey = new SurveyModel();
    const questionCreated = new Array<string>();
    const questionAdded = new Array<string>();
    survey.onQuestionCreated.add((survey, options) => {
      questionCreated.push(options.question.name);
    });
    survey.onQuestionAdded.add((survey, options) => {
      questionAdded.push(options.question.name);
    });
    survey.fromJSON({
      "elements": [
        {
          "type": "checkbox",
          "name": "q1",
          "choices": ["item1", { value: "item2", elements: [{ type: "text", name: "q1_1" }] }, "item3"]
        }
      ]
    });
    const q1_1 = survey.getQuestionByName("q1_1");
    expect(q1_1?.name, "getQuestionByName works correctly").toLooseEqual("q1_1");
    expect(q1_1?.page.name, "The question is on the correct page").toLooseEqual("page1");
    expect(questionCreated.length, "There are two questions created").toLooseEqual(2);
    expect(questionCreated[0], "the first question is q1").toLooseEqual("q1");
    expect(questionCreated[1], "the second question is q1_1").toLooseEqual("q1_1");
    expect(questionAdded.length, "There are two questions added").toLooseEqual(2);
    expect(questionAdded[0], "the first question is q1").toLooseEqual("q1");
    expect(questionAdded[1], "the second question is q1_1").toLooseEqual("q1_1");
  });
  test("choice item elements & item.panel.visibleRows, Issue#10384", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "checkbox",
          "name": "q1",
          "choices": [{ value: "item1", elements: [{ type: "text", name: "q1_1" }] },
            { value: "item2", elements: [{ type: "text", name: "q1_2" }] }, "item3"]
        }
      ]
    });
    const q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    const panel1 = q1.choices[0].panel;
    expect(panel1.wasRendered, "the panel was not rendered").toLooseEqual(false);
    q1.clickItemHandler(q1.choices[0], true);
    expect(panel1.wasRendered, "the panel was rendered").toLooseEqual(true);
    expect(panel1.visibleRows.length, "There is one visible row").toLooseEqual(1);
    expect(panel1.visibleRows[0].elements.length, "There is one element in the visible row").toLooseEqual(1);
    const panel2 = q1.choices[1].panel;
    expect(panel2.visibleRows.length, "There is no visible row in the panel2").toLooseEqual(0);
    expect(panel2.wasRendered, "the panel2 was not rendered").toLooseEqual(false);
    q1.clickItemHandler(q1.choices[1], true);
    expect(panel2.wasRendered, "the panel2 was rendered").toLooseEqual(true);
    expect(panel2.visibleRows.length, "There is one visible row in the panel2").toLooseEqual(1);
    expect(panel2.visibleRows[0].elements.length, "There is one element in the visible row in the panel2").toLooseEqual(1);
  });
  test("choice item elements & getElementByName, Issue#10384", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "checkbox",
          "name": "q1",
          "choices": [{ value: "item1", elements: [{ type: "text", name: "q1_1" }] },
            { value: "item2", elements: [{ type: "text", name: "q1_2" }] }, "item3"]
        }
      ]
    });
    const q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    const panel1 = q1.choices[0].panel;
    expect(panel1.getElementByName("q1_1")?.name, "getElementByName works correctly").toLooseEqual("q1_1");
    const page = survey.pages[0];
    expect(page.getElementByName("q1_1")?.name, "page.getElementByName works correctly").toLooseEqual("q1_1");
    const name = "choicePanel" + panel1.uniqueId;
    expect(panel1.name, "panel1.name is correct").toLooseEqual(name);
    expect(page.getElementByName(name)?.name, "page.getElementByName works correctly for panel1").toLooseEqual(name);
  });
  test("choice item elements & nested elements, Issue#10384", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "checkbox",
          "name": "q1",
          "choices": [{ value: "item1", elements: [{ type: "text", name: "q1_1" }] },
            { value: "item2", elements: [
              { type: "checkbox", name: "q1_2",
                choices: [{ value: "item21", elements: [{ type: "text", name: "q1_2_1" }] }, "item22"]
              }
            ] }, "item3"]
        }
      ]
    });
    const q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    const panel2 = q1.choices[1].panel;
    expect(panel2.wasRendered, "the panel2 was not rendered").toLooseEqual(false);
    q1.clickItemHandler(q1.choices[1], true);
    expect(panel2.wasRendered, "the panel2 was rendered").toLooseEqual(true);
    const q1_2 = panel2.getQuestionByName("q1_2");
    expect(q1_2, "q1_2 is here").toBeTruthy();
    expect(q1_2.getType(), "q1_2 is a checkbox").toLooseEqual("checkbox");
    expect(q1_2.choices.length, "q1_2 has two choices").toLooseEqual(2);
    expect(q1_2.visibleChoices.length, "q1_2 has two visible choices").toLooseEqual(2);
    expect(q1_2.renderedChoices.length, "q1_2 has two rendered choices").toLooseEqual(2);
    expect(q1_2.wasRendered, "q1_2 was rendered").toLooseEqual(true);
  });
  test("choice item elements & validation, Issue#10384", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "checkbox",
          "name": "q1",
          "choices": [{ value: "item1", elements: [{ type: "text", name: "q1_1", isRequired: true }] },
            { value: "item2", elements: [{ type: "text", name: "q1_2", isRequired: true }] }, "item3"]
        }
      ]
    });
    const q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    const q1_1 = q1.choices[0].panel.getQuestionByName("q1_1");
    const q1_2 = q1.choices[1].panel.getQuestionByName("q1_2");
    expect(q1.validate(true), "q1 is valid, #1").toLooseEqual(true);
    q1.clickItemHandler(q1.choices[0], true);
    expect(q1.validate(true), "q1 is not valid, q1_1 is required, #2").toLooseEqual(false);
    expect(q1_1.errors.length, "q1_1 errors #2").toLooseEqual(1);
    expect(q1_2.errors.length, "q1_2 errors #2").toLooseEqual(0);
    q1_1.value = "abc";
    expect(q1.validate(true), "q1 is valid, #3").toLooseEqual(true);
    expect(q1_1.errors.length, "q1_1 errors #3").toLooseEqual(0);
    q1.clickItemHandler(q1.choices[1], true);
    expect(q1.validate(true), "q1 is not valid, q1_2 is required, #4").toLooseEqual(false);
    expect(q1_1.errors.length, "q1_1 errors #4").toLooseEqual(0);
    expect(q1_2.errors.length, "q1_2 errors #4").toLooseEqual(1);
    q1_2.value = "edf";
    expect(q1.validate(true), "q1 is valid, #5").toLooseEqual(true);
    expect(q1_2.errors.length, "q1_2 errors #5").toLooseEqual(0);
  });
  test("choice item elements & validation, Issue#10384", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          type: "checkbox",
          name: "q1",
          choices: [{ value: "item1", elements: [{ type: "text", name: "q1_1" }, { type: "text", name: "q1_2", visibleIf: "{q1_1} notempty" }] },
            { value: "item2", elements: [{ type: "text", name: "q1_3" }, { type: "text", name: "q1_4", visibleIf: "{q2} notempty" }] }, "item3"]
        },
        { type: "text", name: "q2" }
      ]
    });
    const q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    const q1_1 = survey.getQuestionByName("q1_1");
    const q1_2 = survey.getQuestionByName("q1_2");
    const q1_4 = survey.getQuestionByName("q1_4");
    q1.clickItemHandler(q1.choices[1], true);
    q1.clickItemHandler(q1.choices[2], true);
    expect(q1_2.isVisible, "q1_2 visibility, #1").toLooseEqual(false);
    expect(q1_4.isVisible, "q1_4 visibility, #1").toLooseEqual(false);
    q1_1.value = "abc";
    expect(q1_2.isVisible, "q1_2 visibility, #2").toLooseEqual(true);
    q1_2.value = "edf";
    expect(q1_4.isVisible, "q1_4 visibility, #2").toLooseEqual(false);
    survey.setValue("q2", "xyz");
    expect(q1_4.isVisible, "q1_4 visibility, #3").toLooseEqual(true);
  });
  test("choice item elements & localization, Issue#10384", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "checkbox",
          "name": "q1",
          "choices": [{ value: "item1", elements: [{ type: "text", name: "q1_1", title: { default: "q1_1_t", de: "q1_1_t_de" } }] },
            { value: "item2", elements: [
              { type: "checkbox", name: "q1_2", title: { default: "q1_2_t", de: "q1_2_t_de" },
                choices: [{ value: "item21", elements: [{ type: "text", name: "q1_2_1", title: { default: "q1_2_1_t", de: "q1_2_1_t_de" } }] }, "item22"]
              }
            ] }, "item3"]
        }
      ]
    });
    const q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    expect(survey.getUsedLocales(), "There is one non-default locale").toEqualValues(["en", "de"]);
    const q1_1 = survey.getQuestionByName("q1_1");
    const q1_2 = survey.getQuestionByName("q1_2");
    const q1_2_1 = survey.getQuestionByName("q1_2_1");
    q1.clickItemHandler(q1.choices[0], true);
    survey.locale = "de";
    expect(q1_1.locTitle.textOrHtml, "q1_1 title in de, #1").toLooseEqual("q1_1_t_de");
    expect(q1_2.locTitle.textOrHtml, "q1_2 title in de, #1").toLooseEqual("q1_2_t_de");
    expect(q1_2_1.locTitle.textOrHtml, "q1_2_1 title in de, #1").toLooseEqual("q1_2_1_t_de");
    q1.clickItemHandler(q1.choices[1], true);
    expect(q1_1.locTitle.textOrHtml, "q1_1 title in de, #2").toLooseEqual("q1_1_t_de");
    expect(q1_2.locTitle.textOrHtml, "q1_2 title in de, #2").toLooseEqual("q1_2_t_de");
    q1_2.clickItemHandler(q1_2.choices[0], true);
    expect(q1_2_1.locTitle.textOrHtml, "q1_2_1 title in de, #2").toLooseEqual("q1_2_1_t_de");
    survey.locale = "";
    expect(q1_1.locTitle.textOrHtml, "q1_1 title in default locale").toLooseEqual("q1_1_t");
    expect(q1_2.locTitle.textOrHtml, "q1_2 title in default locale").toLooseEqual("q1_2_t");
  });
  test("choice item elements & nested/withFrame styles, Issue#10384", () => {
    const survey = new SurveyModel();
    survey.css = { panel: { nested: "p-nested", withFrame: "p-frame" }, question: { nested: "q-nested", withFrame: "q-frame" } };
    survey.fromJSON({
      "elements": [
        {
          type: "checkbox",
          name: "q1",
          choices: [{ value: "item1", elements: [{ type: "text", name: "q1_1" }] }]
        }
      ]
    });
    const q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    const q1_1 = survey.getQuestionByName("q1_1");
    const panel1 = q1.choices[0].panel;
    q1.clickItemHandler(q1.choices[0], true);
    expect(panel1.cssClasses.panel.nested, "panel nested class is here").toLooseEqual("p-nested");
    expect(panel1.cssClasses.panel.withFrame, "panel withFrame class is here").toLooseEqual("p-frame");
    const panelCss = panel1.getContainerCss();
    expect(panelCss.indexOf("p-frame") > -1, "panelCss has p-frame, #1").toLooseEqual(false);
    expect(panelCss.indexOf("p-nested") > -1, "panelCss has p-nested, #1").toLooseEqual(true);

    expect(q1_1.cssClasses.nested, "question nested class is here").toLooseEqual("q-nested");
    expect(q1_1.cssClasses.withFrame, "question withFrame class is here").toLooseEqual("q-frame");
    const q1_1Css = q1_1.getRootCss();
    expect(q1_1Css.indexOf("q-frame") > -1, "q1_1Css has q-frame, #1").toLooseEqual(false);
    expect(q1_1Css.indexOf("q-nested") > -1, "q1_1Css has q-nested, #1").toLooseEqual(true);
  });
  test("choice item & clearInvisible values, Issue#10384", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "checkbox",
          "name": "q1",
          "choices": [{ value: "item1", elements: [{ type: "text", name: "q1_1" }] },
            { value: "item2", elements: [{ type: "text", name: "q1_2" }] }, "item3"]
        }
      ]
    });
    const q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    const q1_1 = survey.getQuestionByName("q1_1");
    const q1_2 = survey.getQuestionByName("q1_2");
    q1.clickItemHandler(q1.choices[0], true);
    q1_1.value = "abc";
    q1.clickItemHandler(q1.choices[0], false);
    q1.clickItemHandler(q1.choices[1], true);
    q1_2.value = "edf";
    expect(q1_1.value, "q1_1 value is set").toLooseEqual("abc");
    expect(q1_2.value, "q1_2 value is set").toLooseEqual("edf");
    expect(q1_1.value, "q1_1 value is not cleared by default").toLooseEqual("abc");
    expect(survey.data, "survey.data #1").toEqualValues({ q1: ["item2"], "q1_1": "abc", "q1_2": "edf" });
    survey.doComplete();
    expect(q1_1.value, "q1_1 value is cleared").toBeFalsy();
    expect(q1_2.value, "q1_2 value is not cleared").toLooseEqual("edf");
    expect(survey.data, "survey.data #2").toEqualValues({ q1: ["item2"], "q1_2": "edf" });
  });
  test("choice item elements & clearInvisible values in nested panels, Issue#10384", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "checkbox",
          "name": "q1",
          "choices": [
            { value: "item1", elements: [
              { type: "radiogroup", name: "q2", choices: [
                { value: "item1", elements: [{ type: "text", name: "q2_1" }] }, { value: "item2" }
              ] }] },
            { value: "item2", elements: [{ type: "text", name: "q1_2" }] },
            "item3"
          ]
        }
      ]
    });
    const q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    const q2_1 = survey.getQuestionByName("q2_1");
    q1.clickItemHandler(q1.choices[0], true);
    const q2 = <QuestionRadiogroupModel>survey.getQuestionByName("q2");
    q2.clickItemHandler(q2.choices[0]);
    q2_1.value = "abc";
    q1.clickItemHandler(q1.choices[0], false);
    survey.doComplete();
    expect(survey.data, "survey.data is empty").toEqualValues({});
  });
  test("choice item elements  vs nested panels & clearInvisible is 'onHiddenContainer', Issue#10530", () => {
    const survey = new SurveyModel({
      "clearInvisibleValues": "onHiddenContainer",
      "elements": [
        {
          "type": "checkbox",
          "name": "q1",
          "choices": [
            { value: "item1", elements: [
              { type: "radiogroup", name: "q2", choices: [
                { value: "item1", elements: [{ type: "text", name: "q2_1" }] }, { value: "item2" }
              ] }] },
            { value: "item2", elements: [{ type: "text", name: "q1_2" }] },
            "item3"
          ]
        }
      ]
    });
    const q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    const q2_1 = survey.getQuestionByName("q2_1");
    q1.clickItemHandler(q1.choices[0], true);
    const q2 = <QuestionRadiogroupModel>survey.getQuestionByName("q2");
    q2.clickItemHandler(q2.choices[0]);
    q2_1.value = "abc";
    q1.clickItemHandler(q1.choices[0], false);
    expect(survey.data, "survey.data is empty").toEqualValues({});
  });
  test("choice item & dispose, Issue#10384", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "checkbox",
          "name": "q1",
          "choices": [{ value: "item1", elements: [{ type: "text", name: "q1_1" }] },
            { value: "item2", elements: [{ type: "text", name: "q1_2" }] }, "item3"]
        }
      ]
    });
    const q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    const item1 = q1.choices[0];
    const item2 = q1.choices[1];
    const item3 = q1.choices[2];
    expect(item1.isPanelCreated, "item1 panel is here").toBeTruthy();
    expect(item2.isPanelCreated, "item2 panel is here").toBeTruthy();
    expect(item3.isPanelCreated, "item3 panel is not here").toBeFalsy();
    q1.dispose();
    expect(item1.panel.isDisposed, "item1 panel is disposed").toLooseEqual(true);
    expect(item2.panel.isDisposed, "item2 panel is disposed").toLooseEqual(true);
    expect(item3.isPanelCreated, "item3 panel is not here").toBeFalsy();
  });
  test("choice item elements & survey.data, Issue#10384, Bug#10506", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "checkbox",
          "name": "q1",
          "choices": [
            { value: "item1", elements: [
              { type: "radiogroup", name: "q2", choices: [
                { value: "item1", elements: [{ type: "text", name: "q2_1" }] }, { value: "item2" }
              ] }] },
            { value: "item2", elements: [{ type: "text", name: "q1_2" }] },
            "item3"
          ]
        }
      ]
    });
    survey.data = { q1: ["item1", "item2"], q2: "item1", q2_1: "abc", q1_2: "edf" };
    const q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    const q2 = <QuestionRadiogroupModel>survey.getQuestionByName("q2");
    const q2_1 = survey.getQuestionByName("q2_1");
    const q1_2 = survey.getQuestionByName("q1_2");
    expect(q1.value, "q1.value is correct").toEqualValues(["item1", "item2"]);
    expect(q2.value, "q2.value is correct").toLooseEqual("item1");
    expect(q2_1.value, "q2_1.value is correct").toLooseEqual("abc");
    expect(q1_2.value, "q1_2.value is correct").toLooseEqual("edf");
    const panel1 = q1.choices[0].panel;
    expect(panel1.wasRendered, "panel1 is was rendered").toLooseEqual(true);
    expect(panel1.rows.length, "panel1 has one row").toLooseEqual(1);
    const panel2 = q2.choices[0].panel;
    expect(panel2.wasRendered, "panel2 is was rendered").toLooseEqual(true);
    expect(panel2.rows.length, "panel2 has one row").toLooseEqual(1);
  });
  test("choice item elements & defaultValue, Issue#10506", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "checkbox",
          "name": "q1",
          "defaultValue": ["item1", "item2"],
          "choices": [
            { value: "item1", elements: [
              { type: "radiogroup", name: "q2", defaultValue: "item1", choices: [
                { value: "item1", elements: [{ type: "text", name: "q2_1", defaultValue: "abc" }] }, { value: "item2" }
              ] }] },
            { value: "item2", elements: [{ type: "text", name: "q1_2", defaultValue: "edf" }] },
            "item3"
          ]
        }
      ]
    });
    const q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    const q2 = <QuestionRadiogroupModel>survey.getQuestionByName("q2");
    const q2_1 = survey.getQuestionByName("q2_1");
    const q1_2 = survey.getQuestionByName("q1_2");
    expect(q1.value, "q1.value is correct").toEqualValues(["item1", "item2"]);
    expect(q2.value, "q2.value is correct").toLooseEqual("item1");
    expect(q2_1.value, "q2_1.value is correct").toLooseEqual("abc");
    expect(q1_2.value, "q1_2.value is correct").toLooseEqual("edf");
    const panel1 = q1.choices[0].panel;
    expect(panel1.wasRendered, "panel1 is was rendered").toLooseEqual(true);
    expect(panel1.rows.length, "panel1 has one row").toLooseEqual(1);
    const panel2 = q2.choices[0].panel;
    expect(panel2.wasRendered, "panel2 is was rendered").toLooseEqual(true);
    expect(panel2.rows.length, "panel2 has one row").toLooseEqual(1);
  });
  test("choice item elements & item.expandPanelAtDesign, Issue#10384", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "checkbox",
          "name": "q1",
          "choices": ["item1"]
        }
      ]
    });
    const choiceItem = <ChoiceItem>survey.getQuestionByName("q1").choices[0];
    let counter = 0;
    choiceItem.onExpandPanelAtDesign.add((_, opt) => counter++);
    choiceItem.onExpandPanelAtDesign.fire(choiceItem, {});
    expect(counter, "onExpandPanelAtDesign should be called once").toLooseEqual(1);
    choiceItem.onExpandPanelAtDesign.fire(choiceItem, {});
    expect(counter, "onExpandPanelAtDesign should be called twice").toLooseEqual(2);
  });
  test("Checkbox question, defaultValue, skip trigger, Bug#10728", () => {
    const survey = new SurveyModel({
      "clearInvisibleValues": "none",
      "pages": [
        {
          "elements": [
            {
              "type": "text",
              "name": "q1"
            }
          ]
        },
        {
          "elements": [
            {
              "type": "checkbox",
              "name": "q2",
              "defaultValue": ["item1"]
            }
          ]
        },
        {
          "elements": [
            {
              "type": "text",
              "name": "q3"
            }
          ]
        }
      ],
      "triggers": [
        {
          "type": "skip",
          "expression": "{q1} = 1",
          "gotoName": "q3"
        }
      ]
    });
    survey.setValue("q1", 1);
    expect(survey.currentPage.name, "the survey is on the page3").toLooseEqual("page3");
    survey.tryComplete();
    expect(survey.data, "the data is correct").toEqualValues({ q1: 1, q2: ["item1"] });
  });
  test("Create noneItem, refuseItem,  dontKnowItem and otherItem on demand", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "radiogroup",
          name: "q1",
          choices: ["item1", "item2", "item3"]
        }
      ]
    });
    const q1 = <QuestionRadiogroupModel>survey.getQuestionByName("q1");
    const obj = q1 as any;
    expect(obj.refuseItemValue, "refuseItem is undefined by default").toLooseEqual(undefined);
    expect(obj.dontKnowItemValue, "dontKnowItem is undefined by default").toLooseEqual(undefined);
    expect(obj.noneItemValue, "noneItem is undefined by default").toLooseEqual(undefined);
    expect(obj.otherItemValue, "otherItem is undefined by default").toLooseEqual(undefined);

    expect(q1.visibleChoices.length, "There are three choices initially").toLooseEqual(3);
    expect(obj.refuseItemValue, "refuseItem is undefined on calculating visibleChoices").toLooseEqual(undefined);
    expect(obj.dontKnowItemValue, "dontKnowItem is undefined on calculating visibleChoices").toLooseEqual(undefined);
    expect(obj.noneItemValue, "noneItem is undefined on calculating visibleChoices").toLooseEqual(undefined);
    expect(obj.otherItemValue, "otherItem is undefined on calculating visibleChoices").toLooseEqual(undefined);
    q1.toJSON();
    expect(obj.refuseItemValue, "refuseItem is undefined on serialization").toLooseEqual(undefined);
    expect(obj.dontKnowItemValue, "dontKnowItem is undefined on serialization").toLooseEqual(undefined);
    expect(obj.noneItemValue, "noneItem is undefined on serialization").toLooseEqual(undefined);
    expect(obj.otherItemValue, "otherItem is undefined on serialization").toLooseEqual(undefined);
  });
  test("Check noneText, refuseText, dontKnowText and otherItemText", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "radiogroup",
          name: "q1",
          choices: ["item1", "item2", "item3"],
          showNoneItem: true, noneText: "Not Available",
          showRefuseItem: true, refuseText: "No Answer!",
          showDontKnowItem: true, dontKnowText: "Don't Know!",
          showOtherItem: true, otherText: "Other please specify"
        }
      ]
    });
    const q1 = <QuestionRadiogroupModel>survey.getQuestionByName("q1");
    expect(q1.visibleChoices.length, "There are seven choices initially").toLooseEqual(7);
    const noneItem = q1.visibleChoices[3];
    expect(noneItem.value, "noneItem value is correct").toLooseEqual("none");
    expect(noneItem.locText.textOrHtml, "noneItem text is correct").toLooseEqual("Not Available");
    const refuseItem = q1.visibleChoices[4];
    expect(refuseItem.value, "refuseItem value is correct").toLooseEqual("refused");
    expect(refuseItem.locText.textOrHtml, "refuseItem text is correct").toLooseEqual("No Answer!");
    const dontKnowItem = q1.visibleChoices[5];
    expect(dontKnowItem.value, "dontKnowItem value is correct").toLooseEqual("dontknow");
    expect(dontKnowItem.locText.textOrHtml, "dontKnowItem text is correct").toLooseEqual("Don't Know!");
    const otherItem = q1.visibleChoices[6];
    expect(otherItem.value, "otherItem value is correct").toLooseEqual("other");
    expect(otherItem.locText.textOrHtml, "otherItem text is correct").toLooseEqual("Other please specify");
    q1.noneText = "N/A";
    expect(noneItem.locText.textOrHtml, "noneItem text is changed correctly").toLooseEqual("N/A");
  });
  test("Check selectAllItem and otherItemText on demand in checkbox", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "checkbox",
          name: "q1",
          choices: ["item1", "item2", "item3"]
        }
      ]
    });
    const q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    const obj = q1 as any;
    expect(obj.selectAllItemValue, "selectAllItem is undefined by default").toLooseEqual(undefined);
    expect(obj.otherItemValue, "otherItem is undefined by default").toLooseEqual(undefined);
    expect(q1.visibleChoices.length, "There are three choices initially").toLooseEqual(3);
    expect(obj.selectAllItemValue, "selectAllItem is undefined on calculating visibleChoices").toLooseEqual(undefined);
    expect(obj.otherItemValue, "otherItem is undefined on calculating visibleChoices").toLooseEqual(undefined);
    q1.toJSON();
    expect(obj.selectAllItemValue, "selectAllItem is undefined on serialization").toLooseEqual(undefined);
    expect(obj.otherItemValue, "otherItem is undefined on serialization").toLooseEqual(undefined);
  });
  test("Check selectAllText and otherItemText in checkbox", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "checkbox",
          name: "q1",
          choices: ["item1", "item2", "item3"],
          showSelectAllItem: true, selectAllText: "Select All!",
          showOtherItem: true, otherText: "Other please specify"
        }
      ]
    });
    const q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    expect(q1.visibleChoices.length, "There are five choices initially").toLooseEqual(5);
    const selectAllItem = q1.visibleChoices[0];
    expect(selectAllItem.locText.textOrHtml, "selectAllItem text is correct").toLooseEqual("Select All!");
    const otherItem = q1.visibleChoices[4];
    expect(otherItem.value, "otherItem value is correct").toLooseEqual("other");
    expect(otherItem.locText.textOrHtml, "otherItem text is correct").toLooseEqual("Other please specify");
    expect(q1.otherItem.showCommentArea, "otherItem showCommentArea is true").toLooseEqual(true);
  });
  test("Do not send notifications on changing built-in choices properties on creating question", () => {
    const survey = new SurveyModel({
      pages: [{ name: "page1" }]
    });
    survey.setDesignMode(true);
    survey.pages[0].addElement(new QuestionCheckboxModel("q1"));
    const modified = new Array<string>();
    survey.onPropertyValueChangedCallback = (name, oldValue, newValue, sender) => {
      if (sender.isDescendantOf("itemvalue")) {
        modified.push(name);
      }
    };
    const question = new QuestionCheckboxModel("q2");
    survey.pages[0].addElement(question);
    expect(modified.length, "one property is modified").toLooseEqual(0);
  });
  test("Radiogroup question with choice comment should not break visibleIf", () => {
    const survey = new SurveyModel({
      "pages": [
        {
          "elements": [
            {
              "type": "radiogroup",
              "name": "q1",
              "choices": [
                {
                  "value": 1,
                  "showCommentArea": true,
                  "isCommentRequired": true,
                },
                2
              ]
            },
            {
              "type": "radiogroup",
              "name": "q2",
              "visibleIf": "{q1} = 1",
              "choices": [1, 2, 3]
            }
          ]
        }
      ]
    });
    const q1 = <QuestionRadiogroupModel>survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    expect(q2.isVisible, "q2 is not visible initially").toLooseEqual(false);
    q1.clickItemHandler(q1.choices[0]);
    expect(q2.isVisible, "q2 is visible after selecting 1").toLooseEqual(true);
    q1.setCommentValue(q1.choices[0], "test comment");
    expect(q2.isVisible, "q2 should stay visible after setting comment on choice 1").toLooseEqual(true);
    expect(q1.value, "q1 value has comment").toEqualValues({ value: 1, comment: "test comment" });
  });
  test("Checkbox question with choice comment should not break visibleIf", () => {
    const survey = new SurveyModel({
      "pages": [
        {
          "elements": [
            {
              "type": "checkbox",
              "name": "q1",
              "choices": [
                {
                  "value": 1,
                  "showCommentArea": true,
                },
                { value: 2, showCommentArea: true },
                3
              ]
            },
            {
              "type": "radiogroup",
              "name": "q2",
              "visibleIf": "{q1} contains 1",
              "choices": [1, 2, 3]
            }
          ]
        }
      ]
    });
    const q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    expect(q2.isVisible, "q2 is not visible initially").toLooseEqual(false);
    q1.value = [1];
    expect(q2.isVisible, "q2 is visible after selecting 1").toLooseEqual(true);
    q1.setCommentValue(q1.choices[0], "test comment");
    expect(q2.isVisible, "q2 should stay visible after setting comment on choice 1").toLooseEqual(true);
    expect(q1.value, "q1 value has comment").toEqualValues([{ value: 1, comment: "test comment" }]);
    q1.clickItemHandler(q1.choices[1], true);
    q1.setCommentValue(q1.choices[1], "test comment 2");
    expect(q2.isVisible, "q2 should stay visible after setting comment on choice 2").toLooseEqual(true);
    expect(q1.value, "q1 value has two comments").toEqualValues([{ value: 1, comment: "test comment" }, { value: 2, comment: "test comment 2" }]);
  });
});
