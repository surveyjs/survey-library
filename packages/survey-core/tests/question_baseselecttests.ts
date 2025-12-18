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

export default QUnit.module("baseselect");

function getValuesInColumns(question: QuestionSelectBase) {
  return question.columns.map((column) => column.map((choice) => choice.id));
}

QUnit.test("Check QuestionSelectBase columns property", function (assert) {
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
  assert.deepEqual(
    columns,
    [["Item1", "Item4"], ["Item2", "Item5"], ["Item3"]],
    "check itemFlowDirection row"
  );
  settings.itemFlowDirection = "column";
  columns = getValuesInColumns(question);
  assert.deepEqual(
    columns,
    [["Item1", "Item2"], ["Item3", "Item4"], ["Item5"]],
    "check itemFlowDirection column"
  );
});
QUnit.test("Check QuestionSelectBase columns property and creator V2", function (assert) {
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
  assert.deepEqual(
    columns,
    [[], []],
    "one column"
  );
  let headItems = question.headItems.map((item) => item.id);
  let footItems = question.footItems.map((item) => item.id);

  assert.deepEqual(
    headItems,
    ["selectall"],
    "check head items"
  );
  assert.deepEqual(
    footItems,
    ["newitem", "none", "other"],
    "check foot items"
  );
});

QUnit.test("Check QuestionSelectBase head and foot items property", function (assert) {
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
  assert.notOk(question.hasHeadItems);
  assert.notOk(question.hasFootItems);

  settings.itemFlowDirection = "column";
  let columns = getValuesInColumns(question);
  assert.deepEqual(
    columns,
    [["Item1", "Item2"], ["Item3", "Item4"], ["Item5"]],
    "check itemFlowDirection col - runtime"
  );

  survey.setDesignMode(true);

  (<any>question).updateVisibleChoices();
  assert.ok(question.hasHeadItems);
  assert.ok(question.hasFootItems);
  columns = getValuesInColumns(question);
  assert.deepEqual(
    columns,
    [["Item1", "Item2"], ["Item3", "Item4"], ["Item5"]],
    "check itemFlowDirection col - design"
  );
  let headItems = question.headItems.map((item) => item.id);
  let footItems = question.footItems.map((item) => item.id);

  assert.deepEqual(
    headItems,
    ["selectall"],
    "check head items"
  );
  assert.deepEqual(
    footItems,
    ["newitem", "none", "other"],
    "check foot items"
  );
  settings.itemFlowDirection = "row";
});

QUnit.test("Check QuestionSelectBase head and foot items property vs refuse and dontknow properties", function (assert) {
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
  assert.notOk(question.hasHeadItems);
  assert.notOk(question.hasFootItems);

  settings.itemFlowDirection = "column";
  let columns = getValuesInColumns(question);
  assert.deepEqual(
    columns,
    [["Item1", "Item2"], ["Item3", "Item4"], ["Item5"]],
    "check itemFlowDirection col - runtime"
  );

  survey.setDesignMode(true);

  (<any>question).updateVisibleChoices();
  assert.ok(question.hasHeadItems);
  assert.ok(question.hasFootItems);
  columns = getValuesInColumns(question);
  assert.deepEqual(
    columns,
    [["Item1", "Item2"], ["Item3", "Item4"], ["Item5"]],
    "check itemFlowDirection col - design"
  );
  let headItems = question.headItems.map((item) => item.id);
  let footItems = question.footItems.map((item) => item.id);

  assert.deepEqual(
    headItems,
    ["selectall"],
    "check head items"
  );
  assert.deepEqual(
    footItems,
    ["newitem", "none", "refused", "dontknow", "other"],
    "check foot items"
  );
  settings.itemFlowDirection = "row";
  refuseProp.visible = false;
  dontKnowProp.visible = false;
});

QUnit.test("Check QuestionSelectBase and separateSpecialChoices option", function (assert) {
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
  assert.notOk(question.hasHeadItems);
  assert.notOk(question.hasFootItems);

  let columns = getValuesInColumns(question);
  settings.itemFlowDirection = "column";
  assert.deepEqual(
    columns,
    [["selectall", "Item2", "other"], ["Item1", "none"]],
    "check columns with no separateSpecialChoices"
  );

  question.separateSpecialChoices = true;
  assert.ok(question.hasHeadItems);
  assert.ok(question.hasFootItems);

  columns = getValuesInColumns(question);
  assert.deepEqual(
    columns,
    [["Item1"], ["Item2"]],
    "check columns with separateSpecialChoices"
  );
  let headItems = question.headItems.map((item) => item.id);
  let footItems = question.footItems.map((item) => item.id);

  assert.deepEqual(
    headItems,
    ["selectall"],
    "check head items"
  );
  assert.deepEqual(
    footItems,
    ["none", "other"],
    "check foot items"
  );
  settings.itemFlowDirection = "row";
});
QUnit.test("settings.noneItemValue", function (assert) {
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
  assert.equal(q1.isNoneSelected, true, "dropdown none is selected");
  const q2 = <QuestionSelectBase>survey.getAllQuestions()[1];
  q2.value = ["n/a"];
  assert.equal(q2.isNoneSelected, true, "checkbox none is selected");
  settings.noneItemValue = "none";
});

QUnit.test("Set choicesByUrl for checkbox", function (assert) {
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
  assert.equal(q2.choicesByUrl.path, "path1", "path set correctly");
  assert.equal(q2.choicesByUrl.valueName, "val1", "valueName set correctly");
  assert.equal(q2.choicesByUrl.titleName, "", "titleName is cleard");
});
QUnit.test("Bind two checkboxes by valueName, Bug#10344", function (assert) {
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
  assert.deepEqual(survey.data, { data: ["a"] }, "check q1");
  q2.clickItemHandler(q2.choices[0], true);
  assert.deepEqual(survey.data, { data: ["a", "b"] }, "check q2");
  assert.deepEqual(q1.value, ["a", "b"], "q1 value is correct");
  assert.deepEqual(q2.value, ["a", "b"], "q2 value is correct");
  assert.equal(q1.isItemSelected(q1.choices[0]), true, "q1 item is selected");
  assert.equal(q2.isItemSelected(q2.choices[0]), true, "q2 item is selected");
});
QUnit.test("Bind two checkboxes by valueName & storeOthersAsComment= false, Bug#10344", function (assert) {
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
  assert.deepEqual(survey.data, { data: ["a"] }, "check q1");
  q2.clickItemHandler(q2.choices[0], true);
  assert.deepEqual(survey.data, { data: ["a", "b"] }, "check q2");
  assert.deepEqual(q1.value, ["a", "b"], "q1 value is correct");
  assert.deepEqual(q2.value, ["a", "b"], "q2 value is correct");
  assert.equal(q1.isItemSelected(q1.choices[0]), true, "q1 item is selected");
  assert.equal(q2.isItemSelected(q2.choices[0]), true, "q2 item is selected");
});
QUnit.test("check allowhover class in design mode", (assert) => {
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
  assert.ok(q1.getItemClass(item).indexOf("sv_q_checkbox_hover") != -1);
  survey.setDesignMode(true);
  assert.ok(q1.getItemClass(item).indexOf("sv_q_checkbox_hover") == -1);
});
QUnit.test("check item value type", (assert) => {
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
  assert.equal(q1.choices[0].getType(), "choiceitem", "load dropdown");
  assert.equal(q1.choices[0].value, "Item 1", "load dropdown, value");
  assert.equal(q2.choices[0].getType(), "imageitemvalue", "load imagepicker");
  assert.equal(q2.choices[0].value, "Item 1", "load imagepicker value");
  assert.equal(q3.choices[0].getType(), "buttongroupitemvalue", "load buttongroup");
  assert.equal(q3.choices[0].value, "Item 1", "load buttongroup value");
  assert.equal(q1.createItemValue(1).getType(), "choiceitem", "create dropdown item");
  assert.equal(q1.createItemValue(1).value, 1, "create dropdown, value");
  assert.equal(q2.createItemValue(1).getType(), "imageitemvalue", "create imagepicker item");
  assert.equal(q2.createItemValue(1).value, 1, "create imagepicker, value");
  assert.equal(q3.createItemValue(1).getType(), "buttongroupitemvalue", "create buttongroup item");
  assert.equal(q3.createItemValue(1).value, 1, "create buttongroup, value");
});

QUnit.test("check item locstring owner and name", (assert) => {
  const survey = new SurveyModel({
    elements: [
      {
        type: "radiogroup",
        name: "q1",
        choices: ["Item 1"],
      }]
  });

  var question = survey.getQuestionByName("q1") as any;
  assert.equal(question.locTitle.owner.getType(), "radiogroup", "Owner for radio question title is radiogroup");
  assert.equal(question.locTitle.name, "title", "Name for radio question title is title");
  var itemValue = (question.choices[0]);
  assert.equal(itemValue.locText.owner.getType(), "choiceitem", "Owner for radio question item text is itemvalue");
  assert.equal(itemValue.locText.name, "text", "Name for radio question item text is text");
});

QUnit.test("check onShowingChoiceItem event", (assert) => {
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
  assert.equal(question.visibleChoices.length, 4);
  assert.equal(question.visibleChoices[0].value, "Item2");
  assert.equal(question.visibleChoices[1].value, "Item3");
  assert.equal(question.visibleChoices[2].value, "none");
  assert.equal(question.visibleChoices[3].value, "other");

  survey.onShowingChoiceItem.add((sender, options) => {
    if (options.question.name !== "q1") return;
    options.visible = ["Item1", "Item2"].indexOf(options.item.value) > -1;
  });

  assert.equal(question.visibleChoices.length, 2);
  assert.equal(question.visibleChoices[0].value, "Item1");
  assert.equal(question.visibleChoices[1].value, "Item2");
});
QUnit.test("check onShowingChoiceItem event & showRefuseItem & showDontKnowItem", (assert) => {
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
  assert.equal(question.visibleChoices.length, 6);
  assert.equal(question.visibleChoices[0].value, "Item2");
  assert.equal(question.visibleChoices[1].value, "Item3");
  assert.equal(question.visibleChoices[2].value, "none");
  assert.equal(question.visibleChoices[3].value, "refused");
  assert.equal(question.visibleChoices[4].value, "dontknow");
  assert.equal(question.visibleChoices[5].value, "other");

  survey.onShowingChoiceItem.add((sender, options) => {
    if (options.question.name !== "q1") return;
    options.visible = ["Item1", "Item2"].indexOf(options.item.value) > -1;
  });

  assert.equal(question.visibleChoices.length, 2);
  assert.equal(question.visibleChoices[0].value, "Item1");
  assert.equal(question.visibleChoices[1].value, "Item2");
});

QUnit.test("check focus comment of other select", (assert) => {
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
  assert.equal(counter, 0);
  q.selectItem(q.otherItem, true);
  assert.equal(counter, 1);
  q.value = ["other", "item1"];
  q.selectItem(q.choices[0], true);
  assert.equal(counter, 1);
  q.selectItem(q.otherItem, false);
  assert.equal(counter, 1);
  q.selectItem(q.otherItem, true);
  assert.deepEqual(q.value, ["item1", "other"], "other is selected in question value");
  assert.equal(counter, 2);
});
QUnit.test("Do not focus element on setting defaultValue & on setting value to survey.data, Bug#9700", (assert) => {
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
  assert.equal(counter, 0, "Do not focus element on setting defaultValue");
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
  assert.equal(counter, 0, "Do not focus element on setting survey.data");
  const question = <QuestionCheckboxModel>survey.getQuestionByName("q1");
  question.value = ["Item 1"];
  question.selectItem(question.otherItem, true);
  assert.deepEqual(question.value, ["Item 1", "other"], "question value is correct");
  assert.equal(counter, 1, "Focus on setting the question value");
  SurveyElement.FocusElement = oldFunc;
});

QUnit.test("check separateSpecialChoices property visibility", (assert) => {
  assert.notOk(Serializer.findProperty("selectbase", "separateSpecialChoices").visible);
  assert.ok(Serializer.findProperty("checkbox", "separateSpecialChoices").visible);
  assert.ok(Serializer.findProperty("radiogroup", "separateSpecialChoices").visible);
  assert.notOk(Serializer.findProperty("imagepicker", "separateSpecialChoices").visible);
  assert.notOk(Serializer.findProperty("dropdown", "separateSpecialChoices").visible);
});
QUnit.test("Apply choice visibleIf correctly on setting survey.data", (assert) => {
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
  assert.notEqual(q.value, q.otherItem.value, "Other is not selected");
  assert.equal(q.value, "item2", "item2 is selected");
});
QUnit.test("checkbox and valuePropertyName", (assert) => {
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
  assert.deepEqual(q.value, [{ fruit: "apple" }], "#1");
  assert.deepEqual(q.renderedValue, ["apple"], "#2");
  assert.equal(q.isItemSelected(q.choices[0]), true, "#2.1");
  assert.equal(q.isItemSelected(q.choices[1]), false, "#2.2");
  assert.equal(q.isItemSelected(q.choices[2]), false, "#2.3");
  q.value = [{ fruit: "apple" }, { fruit: "orange" }];
  assert.deepEqual(q.renderedValue, ["apple", "orange"], "#3");
  assert.deepEqual(survey.data, { q1: [{ fruit: "apple" }, { fruit: "orange" }] }, "convert to data correctly, #4");
  assert.equal(q.isItemSelected(q.choices[0]), true, "#3.1");
  assert.equal(q.isItemSelected(q.choices[1]), false, "#3.2");
  assert.equal(q.isItemSelected(q.choices[2]), true, "#3.3");
  survey.doComplete();
  assert.deepEqual(survey.data, { q1: [{ fruit: "apple" }, { fruit: "orange" }] }, "survey.data is correct on complete, #5");
});
QUnit.test("checkbox valuePropertyName and shared data vs panel dynamic ", (assert) => {
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
  assert.equal(q2.panelCount, 2, "#1, Panel count is changed");
  q2.panels[0].getQuestionByName("name").value = "text1";
  q2.panels[1].getQuestionByName("name").value = "text2";
  assert.deepEqual(survey.data, {
    data: [
      { fruit: "apple", name: "text1" },
      { fruit: "orange", name: "text2" }]
  }, "#2, combine results");
  q1.renderedValue = ["apple"];
  assert.deepEqual(survey.data, {
    data: [
      { fruit: "apple", name: "text1" }]
  }, "#3, keep results");
  q1.renderedValue = ["apple", "orange"];
  assert.deepEqual(survey.data, {
    data: [
      { fruit: "apple", name: "text1" },
      { fruit: "orange" }]
  }, "#4, add new value");
  q2.removePanel(0);
  assert.deepEqual(survey.data, {
    data: [
      { fruit: "orange" }]
  }, "#5, remove panel, data");
  assert.deepEqual(q1.renderedValue, ["orange"], "#6, remove panel, renderedValue");
});
QUnit.test("checkbox vs valuePropertyName, check selectAll and none", (assert) => {
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
  assert.deepEqual(q.renderedValue, ["apple", "banana", "orange"], "#1");
  assert.deepEqual(q.value, [{ fruit: "apple" }, { fruit: "banana" }, { fruit: "orange" }], "#2");
  assert.equal(q.isAllSelected, true, "#3, all is selected");
  q.clickItemHandler(q.noneItem, true);
  assert.deepEqual(q.value, [{ fruit: "none" }], "#4");
  assert.equal(q.isAllSelected, false, "#5, all is not selected");
});
QUnit.test("checkbox vs valuePropertyName, check selectAll and none & refuse & dontknow", (assert) => {
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
  assert.deepEqual(q.renderedValue, ["apple", "banana", "orange"], "#1");
  assert.deepEqual(q.value, [{ fruit: "apple" }, { fruit: "banana" }, { fruit: "orange" }], "#2");
  assert.equal(q.isAllSelected, true, "#3, all is selected");
  q.clickItemHandler(q.refuseItem, true);
  assert.deepEqual(q.value, [{ fruit: "refused" }], "#4");
  assert.equal(q.isAllSelected, false, "#5, all is not selected");
  q.clickItemHandler(q.selectAllItem, true);
  assert.deepEqual(q.renderedValue, ["apple", "banana", "orange"], "#6");
  q.clickItemHandler(q.dontKnowItem, true);
  assert.deepEqual(q.value, [{ fruit: "dontknow" }], "#7");
  q.clickItemHandler(q.refuseItem, true);
  assert.deepEqual(q.value, [{ fruit: "refused" }], "#8");
  q.clickItemHandler(q.noneItem, true);
  assert.deepEqual(q.value, [{ fruit: "none" }], "#9");
  q.clickItemHandler(q.choices[0], true);
  assert.deepEqual(q.value, [{ fruit: "apple" }], "#10");
  q.renderedValue = ["refused"];
  assert.deepEqual(q.value, [{ fruit: "refused" }], "#11");
  q.clickItemHandler(q.choices[0], true);
  assert.deepEqual(q.value, [{ fruit: "apple" }], "#12");

  q.renderedValue = ["apple", "none"];
  assert.deepEqual(q.value, [{ fruit: "none" }], "#13");
  q.renderedValue = ["none", "refused"];
  assert.deepEqual(q.value, [{ fruit: "refused" }], "#14");
  q.renderedValue = ["refused", "dontknow"];
  assert.deepEqual(q.value, [{ fruit: "dontknow" }], "#15");
  q.renderedValue = ["dontknow", "none"];
  assert.deepEqual(q.value, [{ fruit: "none" }], "#16");
  q.renderedValue = ["none", "apple"];
  assert.deepEqual(q.value, [{ fruit: "apple" }], "#17");
});
QUnit.test("checkbox:readonly:clickItemHandler", (assert) => {
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
  assert.deepEqual(q.value, [{ fruit: "banana" }], "nothing changed");
});
QUnit.test("checkbox vs valuePropertyName, check showOtherItem", (assert) => {
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
  assert.equal(q.getStoreOthersAsComment(), false, "It becomes false because of valuePropertyName");
  q.renderedValue = ["other"];
  assert.deepEqual(q.value, [{ fruit: "other" }], "#1");
  q.otherValue = "text1";
  assert.deepEqual(survey.data, { q1: [{ fruit: "text1" }] }, "2");
});
QUnit.test("checkbox vs valuePropertyName, getDisplayValue", (assert) => {
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
  assert.deepEqual(q.getDisplayValue(false, [{ fruit: 1 }, { fruit: 3 }]), "apple, orange", "display value for all values");
});
QUnit.test("checkbox vs valuePropertyName, getDisplayValue & value name uses uppercase letters, Bug#10707", (assert) => {
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
  assert.deepEqual(q1.getDisplayValue(false, [{ fruitID: 1 }, { fruitID: 3 }]), "apple, orange", "display value for all values");
  q1.value = [{ fruitID: 2 }];
  const q2 = survey.getQuestionByName("q2");
  assert.equal(q2.locTitle.renderedHtml, "banana", "display value in text question");
});
QUnit.test("checkbox vs valuePropertyName, check showOtherItem vs storeOthersAsComment", (assert) => {
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
  assert.deepEqual(q.value, [{ fruit: "other" }], "#1");
  q.otherValue = "text1";
  assert.deepEqual(q.value, [{ fruit: "text1" }], "#2");
  assert.deepEqual(survey.data, { q1: [{ fruit: "text1" }] }, "#3");
});
QUnit.test("checkbox vs valuePropertyName, check showOtherItem vs storeOthersAsComment & matrix", (assert) => {
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
  assert.equal(q.getStoreOthersAsComment(), false, "it is false valuePropertyName is not empty");
  const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("q2");
  q.renderedValue = ["apple", "other"];
  const rows = matrix.visibleRows;
  assert.equal(rows.length, 2, "matrix rows");
  q.otherValue = "text1";
  assert.equal(rows.length, 2, "matrix rows");
  assert.equal(rows[0].cells[1].question.value, "apple", "rows[0]");
  assert.equal(rows[1].cells[1].question.value, "text1", "rows[1]");
  assert.deepEqual(survey.data, { q1: [{ fruit: "apple", col2: "apple" }, { fruit: "text1", col2: "text1" }] }, "survey.data");
});
QUnit.test("checkbox vs valuePropertyName, use in expression", (assert) => {
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
  assert.equal(conds[0].name, "q1-unwrapped", "use filtered name");
  const q2 = survey.getQuestionByName("q2");
  assert.equal(q2.isVisible, false, "#1");
  q1.renderedValue = ["apple", "orange"];
  assert.deepEqual(q1.value, [{ fruit: "apple" }, { fruit: "orange" }], "q1.value. #1");
  assert.equal(q2.isVisible, true, "#2");
  q1.renderedValue = ["orange"];
  assert.deepEqual(q1.value, [{ fruit: "orange" }], "q1.value. #2");
  assert.equal(q2.isVisible, false, "#3");
});

QUnit.test("checkbox vs valuePropertyName & defaultValue, Bug#8973", (assert) => {
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
  assert.deepEqual(q1.value, [{ fruit: "apple" }, { fruit: "orange" }], "q1.value");
});
QUnit.test("checkbox vs valuePropertyName & defaultValueExpression, Bug#8973", (assert) => {
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
  assert.deepEqual(q2.value, ["apple", "orange"], "q2.value");
  assert.deepEqual(q1.value, [{ fruit: "apple" }, { fruit: "orange" }], "q1.value");
});
QUnit.test("checkbox vs valuePropertyName & setValueExpression, Bug#8973", (assert) => {
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
  assert.deepEqual(q2.value, ["apple", "orange"], "q2.value, #1");
  assert.deepEqual(q1.value, [{ fruit: "apple" }, { fruit: "orange" }], "q1.value, #2");
  q2.renderedValue = ["banana", "orange"];
  assert.deepEqual(q2.value, ["banana", "orange"], "q2.value, #2");
  assert.deepEqual(q1.value, [{ fruit: "banana" }, { fruit: "orange" }], "q1.value, #2");
});

QUnit.test("check radiogroup title actions", (assert) => {
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
  assert.notOk(question.showClearButtonInContent);
  assert.equal(action.title, "Clear");
  assert.ok(action.visible);

  question.allowClear = false;
  assert.notOk(action.visible);
});

QUnit.test("checkbox and radio css", (assert) => {
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

  assert.equal(question1.getSelectBaseRootCss(), "css-root");
  assert.equal(question2.getSelectBaseRootCss(), "css-root");

  assert.deepEqual(question1.dataChoices.map((item) => item.id), ["Item 1"]);
  assert.deepEqual(question2.dataChoices.map((item) => item.id), ["Item 1"]);

  assert.deepEqual(question1.bodyItems.map((item) => item.id), ["Item 1", "none"]);
  assert.deepEqual(question2.bodyItems.map((item) => item.id), ["selectall", "Item 1", "none"]);

  assert.deepEqual(question1.rowLayout, false);
  assert.deepEqual(question2.rowLayout, false);

  question1.colCount = 0;
  question2.colCount = 0;

  assert.equal(question1.getSelectBaseRootCss(), "css-root css-root-row");
  assert.equal(question2.getSelectBaseRootCss(), "css-root css-root-row");

  assert.deepEqual(question1.dataChoices.map((item) => item.id), ["Item 1"]);
  assert.deepEqual(question2.dataChoices.map((item) => item.id), ["Item 1"]);

  assert.deepEqual(question1.bodyItems.map((item) => item.id), ["Item 1", "none"]);
  assert.deepEqual(question2.bodyItems.map((item) => item.id), ["selectall", "Item 1", "none"]);

  assert.deepEqual(question1.rowLayout, true);
  assert.deepEqual(question2.rowLayout, true);

  assert.deepEqual(question1.blockedRow, false);
  assert.deepEqual(question2.blockedRow, false);

  question1.separateSpecialChoices = true;
  question2.separateSpecialChoices = true;

  assert.equal(question1.getSelectBaseRootCss(), "css-root");
  assert.equal(question2.getSelectBaseRootCss(), "css-root");

  assert.deepEqual(question1.dataChoices.map((item) => item.id), ["Item 1"]);
  assert.deepEqual(question2.dataChoices.map((item) => item.id), ["Item 1"]);

  assert.deepEqual(question1.bodyItems.map((item) => item.id), ["Item 1"]);
  assert.deepEqual(question2.bodyItems.map((item) => item.id), ["Item 1"]);

  assert.deepEqual(question1.rowLayout, false);
  assert.deepEqual(question2.rowLayout, false);

  assert.deepEqual(question1.blockedRow, true);
  assert.deepEqual(question2.blockedRow, true);

  question1.separateSpecialChoices = false;
  question2.separateSpecialChoices = false;

  survey["_isDesignMode"] = true;

  assert.equal(question1.getSelectBaseRootCss(), "css-root");
  assert.equal(question2.getSelectBaseRootCss(), "css-root");

  assert.deepEqual(question1.dataChoices.map((item) => item.id), ["Item 1"]);
  assert.deepEqual(question2.dataChoices.map((item) => item.id), ["Item 1"]);

  assert.deepEqual(question1.bodyItems.map((item) => item.id), ["Item 1"]);
  assert.deepEqual(question2.bodyItems.map((item) => item.id), ["Item 1"]);

  assert.deepEqual(question1.rowLayout, false);
  assert.deepEqual(question2.rowLayout, false);

  assert.deepEqual(question1.blockedRow, true);
  assert.deepEqual(question2.blockedRow, true);
});
QUnit.test("autoOtherMode property, radiogroup", (assert) => {
  const question = new QuestionRadiogroupModel("q1");
  question.showOtherItem = true;
  question.choices = [1, 2, 3];
  question.autoOtherMode = true;
  assert.equal(question.isOtherSelected, false, "other is not selected by default");
  question.otherValue = "comment";
  assert.equal(question.isOtherSelected, true, "other is selected by setting comments");
  question.otherValue = "";
  assert.equal(question.isOtherSelected, false, "other is not selected by resetting comment");
  question.value = 1;
  question.otherValue = "comment";
  assert.equal(question.value, "other", "other is selected by setting comments, value");
  question.otherValue = "";
  assert.equal(question.value, undefined, "other is not selected by resetting comment, value");
  question.otherValue = "comment";
  question.value = 1;
  assert.equal(question.otherValue, "", "Clear comment on changing value");
  question.storeOthersAsComment = false;
  question.otherValue = "comment1";
  assert.equal(question.value, "comment1", "other is selected by setting comments, value + storeOthersAsComment");
  question.otherValue = "";
  assert.equal(question.value, undefined, "other is not selected by resetting comment, value + storeOthersAsComment");
});
QUnit.test("autoOtherMode property, checkbox", (assert) => {
  const survey = new SurveyModel();
  survey.addNewPage("p1");
  const question = new QuestionCheckboxModel("q1");
  survey.pages[0].addQuestion(question);
  question.showOtherItem = true;
  question.choices = [1, 2, 3];
  question.autoOtherMode = true;
  assert.equal(question.isOtherSelected, false, "other is not selected by default");
  question.otherValue = "comment";
  assert.equal(question.isOtherSelected, true, "other is selected by setting comments");
  question.otherValue = "";
  assert.equal(question.isOtherSelected, false, "other is not selected by resetting comment");
  question.value = [1, 3];
  question.otherValue = "comment";
  assert.deepEqual(question.value, [1, 3, "other"], "other is selected by setting comments, value");
  assert.deepEqual(survey.data, { q1: [1, 3, "other"], "q1-Comment": "comment" }, "survey: other is selected by setting comments, value");
  question.otherValue = "";
  assert.deepEqual(question.value, [1, 3], "other is not selected by resetting comment, value");
  assert.deepEqual(survey.data, { q1: [1, 3] }, "survey: other is not selected by resetting comment, value");
  question.storeOthersAsComment = false;
  question.otherValue = "comment1";
  assert.deepEqual(question.value, [1, 3, "comment1"], "other is selected by setting comments, value + storeOthersAsComment");
  assert.deepEqual(survey.data, { q1: [1, 3, "comment1"] }, "survey: other is selected by setting comments, value + storeOthersAsComment");
  question.otherValue = "";
  assert.deepEqual(question.value, [1, 3], "other is not selected by resetting comment, value + storeOthersAsComment");
  assert.deepEqual(survey.data, { q1: [1, 3] }, "survey: other is not selected by resetting comment, value + storeOthersAsComment");
});
QUnit.test("check locOwner for items", (assert) => {
  const question = new QuestionCheckboxModel("q1");
  question.choices = [1, 2, 3];
  question.autoOtherMode = true;
  assert.equal(question.noneItem.locText.owner, question.noneItem, "none text owner is none item");
  assert.equal(question.otherItem.locText.owner, question.otherItem, "other text owner is other item");
  assert.equal(question.selectAllItem.locText.owner, question.selectAllItem, "selectAll text owner is selectAll item");

  assert.equal(question.choices[0].locText.owner, question.choices[0], "item1 text owner is item1");
});

QUnit.test("check renamed has... properties", (assert) => {
  const question = new QuestionCheckboxModel("q1");
  assert.notOk(question.showNoneItem);
  assert.notOk(question.showSelectAllItem);
  assert.notOk(question.showOtherItem);
  assert.notOk(question.hasComment);
  assert.notOk(question.showCommentArea);

  assert.notOk(question.showNoneItem);
  assert.notOk(question.showSelectAllItem);
  assert.notOk(question.showOtherItem);
  assert.notOk(question.showCommentArea);

  question.showNoneItem = true;
  assert.ok(question.showNoneItem);
  assert.ok(question.showNoneItem);
  question.showNoneItem = false;
  assert.notOk(question.showNoneItem);
  assert.notOk(question.showNoneItem);

  question.showSelectAllItem = true;
  assert.ok(question.showSelectAllItem);
  assert.ok(question.showSelectAllItem);
  question.showSelectAllItem = false;
  assert.notOk(question.showSelectAllItem);
  assert.notOk(question.showSelectAllItem);

  question.showOtherItem = true;
  assert.ok(question.showOtherItem);
  assert.ok(question.showOtherItem);
  question.showOtherItem = false;
  assert.notOk(question.showOtherItem);
  assert.notOk(question.showOtherItem);

  question.showCommentArea = true;
  assert.ok(question.showCommentArea);
  assert.ok(question.hasComment);
  question.hasComment = false;
  assert.notOk(question.showCommentArea);
  assert.notOk(question.hasComment);
});
QUnit.test("checkbox selectAllItem isEnabled and maxSelectedChoices", (assert) => {
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
  assert.equal(q.selectAllItem.isEnabled, true, "selectAllItem is enabled");
  q.maxSelectedChoices = 2;
  assert.equal(q.selectAllItem.isEnabled, false, "selectAllItem is disabled");
  q.maxSelectedChoices = 0;
  assert.equal(q.selectAllItem.isEnabled, true, "selectAllItem is enabled again");
});
QUnit.test("selectbase and otherValue/comment", (assert) => {
  const survey = new SurveyModel({ elements: [{ type: "dropdown", name: "q1", showOtherItem: true, choices: [1, 2, 3] }] });
  const question = <QuestionSelectBase>survey.getQuestionByName("q1");
  assert.notOk(question.otherValue, "otherValue, #1");
  assert.notOk(question.comment, "comment, #2");
  question.otherValue = "val1";
  assert.equal("val1", question.otherValue, "other value, #3");
  assert.equal("val1", question.comment, "comment, #4");
  question.comment = "val2";
  assert.equal("val2", question.otherValue, "other value, #5");
  assert.equal("val2", question.comment, "comment, #6");
  question.showCommentArea = true;
  assert.equal(true, question.showCommentArea, "showCommentArea is true");
  assert.equal(true, question.showOtherItem, "showOtherItem is true");
  assert.equal(false, question.getStoreOthersAsComment(), "getStoreOthersAsComment() is false");
  assert.notOk(question.otherValue, "other value, #7");
  assert.equal("val2", question.comment, "comment, #8");
  assert.notOk(question.selectedItem, "selectedItem #1");
  question.value = "other";
  question.otherValue = "val3";
  assert.equal("val3", question.otherValue, "other value, #9");
  assert.equal("val3", question.value, "question value, #10");
  assert.equal("val2", question.comment, "comment, #11");
  assert.equal(question.selectedItem.value, "other", "selectedItem #2");
  question.comment = "val4";
  assert.equal("val3", question.otherValue, "other value, #12");
  assert.equal("val3", question.value, "question value, #13");
  assert.equal(question.selectedItem.value, "other", "selectedItem #3");
  assert.equal("val4", question.comment, "comment, #14");

  question.otherValue = "";
  question.value = "other";
  assert.equal(true, question.isOtherSelected, "isOtherSelected, #1");
  assert.equal(question.selectedItem.value, "other", "selectedItem #4");
  assert.notOk(question.otherValue, "other value, #15");
  assert.equal(false, question.supportGoNextPageError(), "supportGoNextPageError, #1");
  question.comment = "";
  assert.equal(false, question.supportGoNextPageError(), "supportGoNextPageError, #2");
  question.otherValue = "val5";
  assert.equal(true, question.supportGoNextPageError(), "supportGoNextPageError, #3");

  question.comment = "test";
  survey.data = { q1: "val6" };
  assert.equal("val6", question.otherValue, "other value, #16");
  assert.equal("val6", question.value, "question value, #17");
  assert.equal("", question.comment, "comment, #18");
  assert.deepEqual(survey.data, { q1: "val6" }, "survey data, #1");

  question.showCommentArea = false;
  question.storeOthersAsComment = false;
  survey.data = { q1: "val7" };
  assert.equal("val7", question.otherValue, "other value, #19");
  assert.equal("val7", question.value, "question value, #20");
  assert.equal("val7", question.comment, "comment, #21");
  assert.equal(question.selectedItem.value, "other", "selectedItem #5");
  assert.deepEqual(survey.data, { q1: "val7" }, "survey data, #2");

  question.showCommentArea = true;
  question.value = "other";
  question.otherValue = "a";
  assert.equal("a", question.otherValue, "other value, #22");
  assert.equal(question.selectedItem.value, "other", "selectedItem #6");
  assert.equal("a", question.value, "question value, #23");
  assert.equal("", question.comment, "comment, #24");
});
QUnit.test("selectbase and otherValue/comment + same values", (assert) => {
  const survey = new SurveyModel({ elements: [
    { type: "dropdown", name: "q1", showOtherItem: true, showCommentArea: true, choices: ["item1", "item2", "item3"] },
    { type: "checkbox", name: "q2", showOtherItem: true, showCommentArea: true, choices: ["item1", "item2", "item3"] }
  ] });
  const q1 = <QuestionSelectBase>survey.getQuestionByName("q1");
  const q2 = <QuestionSelectBase>survey.getQuestionByName("q2");
  q1.renderedValue = "other";
  q1.otherValue = "a";
  assert.equal("a", q1.value, "q1 value, #1");
  assert.equal("a", q1.otherValue, "q1 otherValue, #2");
  q1.otherValue = "item2";
  assert.equal("other", q1.value, "q1 value, #3");
  assert.equal("item2", q1.otherValue, "q1 otherValue, #4");
  q1.otherValue = "item22";
  assert.equal("item22", q1.value, "q1 value, #5");
  assert.equal("item22", q1.otherValue, "q1 otherValue, #6");
  q2.renderedValue = ["other"];
  q2.otherValue = "a";
  assert.deepEqual(["a"], q2.value, "q2 value, #1");
  assert.equal("a", q2.otherValue, "q2 otherValue, #2");
  q2.otherValue = "item3";
  assert.deepEqual(["other"], q2.value, "q2 value, #3");
  assert.equal("item3", q2.otherValue, "q2 otherValue, #4");
  q2.otherValue = "item33";
  assert.deepEqual(["item33"], q2.value, "q2 value, #5");
  assert.equal("item33", q2.otherValue, "q2 otherValue, #6");
});
QUnit.test("selectbase, showOtherItem & checkErrorsMode: 'onValueChanged'", (assert) => {
  const survey = new SurveyModel({ elements: [
    { type: "radiogroup", name: "q1", showOtherItem: true, choices: ["item1", "item2", "item3"] },
  ], checkErrorsMode: "onValueChanged" });
  const q1 = <QuestionSelectBase>survey.getQuestionByName("q1");
  q1.renderedValue = "other";
  assert.equal(q1.errors.length, 0, "We do not have errors yet");
  survey.tryComplete();
  assert.equal(q1.errors.length, 1, "There is an error");
  assert.equal(survey.state, "running", "Still running");
});
QUnit.test("selectbase, otherValue&question-Comment", (assert) => {
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
  assert.deepEqual(survey.data, data, "before complete");
  survey.doComplete();
  assert.deepEqual(survey.data, data, "after complete");
});
QUnit.test("quesstion commentId/otherId", (assert) => {
  const q1 = new QuestionCheckboxModel("q1");
  assert.equal(q1.commentId, q1.id + "_comment", "Comment id");
  assert.equal(q1.otherId, q1.id + "_" + q1.otherItem.uniqueId, "Other id");
});
QUnit.test("selectbase, otherValue&question-Comment", (assert) => {
  const survey = new SurveyModel({ elements: [
    { type: "dropdown", name: "q1", showNoneItem: true, choices: [1, 2, 3], noneText: "Not Available" }
  ] });
  const q1 = <QuestionDropdownModel>survey.getQuestionByName("q1");
  q1.noneItem.value = "no value";
  const item = q1.dropdownListModel["listModel"].actions[3];
  assert.equal(item.id, "no value", "choice item is correct");
  q1.renderedValue = item.id;
  assert.equal(q1.isItemSelected(q1.noneItem), true, "non item is selected");
  survey.clearIncorrectValues();
  assert.equal(q1.value, "no value", "question value is correct");
  assert.deepEqual(survey.data, { q1: "no value" }, "survey.data is correct");
});
QUnit.test("SelectBase visibleChoices order", function (assert) {
  const survey = new SurveyModel();
  survey.setDesignMode(true);
  survey.fromJSON({ elements: [
    { type: "dropdown", name: "q1", choicesOrder: "asc", choices: ["B", "A", "D", "C"] }
  ] });
  const question = <QuestionSelectBase>survey.getQuestionByName("q1");
  assert.equal(question.visibleChoices.length, 7, "There are 4 items");
  assert.equal(question.visibleChoices[0].value, "B", "the first item");
  assert.equal(question.visibleChoices[3].value, "C", "the last item");
});
QUnit.test("choicesFromQuestion & showNoneItem", function (assert) {
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
  assert.equal(q1.visibleChoices.length, 4, "q1 length");
  assert.equal(q2.visibleChoices.length, 4, "q2 length");
  assert.equal(q3.visibleChoices.length, 3, "q3 length");
  assert.equal(q1.visibleChoices[3].value, "none", "q1 none");
  assert.equal(q2.visibleChoices[3].value, "none", "q2 none");
});
QUnit.test("choicesFromQuestion & showOtherItem", function (assert) {
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
  assert.equal(q1.visibleChoices.length, 4, "q1 length");
  assert.equal(q2.visibleChoices.length, 4, "q2 length");
  assert.equal(q3.visibleChoices.length, 3, "q3 length");
  assert.equal(q1.visibleChoices[3].value, "other", "q1 other");
  assert.equal(q2.visibleChoices[3].value, "other", "q2 other");
});
QUnit.test("choicesFromQuestion & showNoneItem & mode=selected", function (assert) {
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
  assert.equal(q2.visibleChoices.length, 4, "q2 length");
  assert.equal(q3.visibleChoices.length, 3, "q3 length");
  assert.equal(q2.visibleChoices[3].value, "none", "q2 none");
  q1.value = ["none"];
  assert.equal(q2.visibleChoices.length, 1, "q2 length, #1");
  assert.equal(q3.visibleChoices.length, 0, "q3 length, #2");
  assert.equal(q2.visibleChoices[0].value, "none", "q2 none");
});
QUnit.test("choicesFromQuestion & choicesVisibleIf", function (assert) {
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
  assert.equal(q2.visibleChoices.length, 2, "q2 length");
  assert.equal(q2.visibleChoices[0].value, 2, "q2 choices[0]");
  assert.equal(q2.visibleChoices[1].value, 3, "q2 choices[1]");
  assert.equal(q3.visibleChoices.length, 1, "q3 length");
  assert.equal(q3.visibleChoices[0].value, 2, "q3 choices[0]");
  q1.value = [1, 2, 3];
  assert.equal(q2.visibleChoices.length, 2, "q2 length, #2");
  assert.equal(q2.visibleChoices[0].value, 2, "q2 choices[0], #2");
  assert.equal(q2.visibleChoices[1].value, 3, "q2 choices[1], #2");
  assert.equal(q3.visibleChoices.length, 2, "q3 length, #2");
  assert.equal(q3.visibleChoices[0].value, 2, "q3 choices[0], #2");
  assert.equal(q3.visibleChoices[1].value, 3, "q3 choices[1], #2");
});
QUnit.test("Use {$item.prop} in expression", function (assert) {
  Serializer.addProperty("itemvalue", "prop1:number");
  const survey = new SurveyModel({
    elements: [
      { type: "radiogroup", name: "q1", choices: [1, 2, 3] },
      { type: "checkbox", name: "q2", choices: [{ value: 1, prop1: 1 }, { value: 2, prop1: 2 }, { value: 3, prop1: 3 }], choicesVisibleIf: "{$item.prop1} = {q1}" }
    ],
  });
  const q1 = <QuestionRadiogroupModel>survey.getQuestionByName("q1");
  const q2 = <QuestionCheckboxModel>survey.getQuestionByName("q2");
  assert.equal(q2.visibleChoices.length, 0, "q2 visibleChoices length #1");
  q1.value = 2;
  assert.equal(q2.visibleChoices.length, 1, "q2 visibleChoices length #2");
  assert.equal(q2.visibleChoices[0].value, 2, "q2 visibleChoices[0] value");
  q1.value = 3;
  assert.equal(q2.visibleChoices.length, 1, "q2 visibleChoices length #3");
  assert.equal(q2.visibleChoices[0].value, 3, "q2 visibleChoices[0] value #2");
  Serializer.removeProperty("itemvalue", "prop1");
});
QUnit.test("choicesFromQuestion & showOtherItem & mode=selected", function (assert) {
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
  assert.equal(q2.visibleChoices.length, 4, "q2 length");
  assert.equal(q3.visibleChoices.length, 3, "q3 length");
  assert.equal(q2.visibleChoices[3].value, "other", "q2 other");
  q1.value = [1, 2, 3, "other"];
  q1.otherValue = "other comment";
  assert.equal(q2.visibleChoices.length, 4, "q2 length");
  assert.equal(q3.visibleChoices.length, 4, "q3 length");
  assert.equal(q2.visibleChoices[3].value, "other", "q2 other");
  assert.equal(q3.visibleChoices[3].value, "other", "q3 other");
});
QUnit.test("Check isUsingCarryForward on changing question name", function (assert) {
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
  assert.equal(q2.isUsingCarryForward, true, "Carryforward flag is set, #1");
  q1.name = "q111";
  assert.equal(q2.choicesFromQuestion, "q111", "property is updated with new question name");
  assert.equal(q2.isUsingCarryForward, true, "Carryforward flag is set, #2");
});
QUnit.test("Carry Forward and localization, bug#6352", function (assert) {
  surveyLocalization.defaultLocale = "de";
  const survey = new SurveyModel({ locale: "en", elements: [
    { type: "dropdown", name: "q1", choices: [{ value: "A", text: { default: "A de", en: "A en" } }] },
    { type: "dropdown", name: "q2", choicesFromQuestion: "q1" }
  ] });
  const q2 = <QuestionSelectBase>survey.getQuestionByName("q2");
  assert.equal(q2.visibleChoices.length, 1);
  assert.deepEqual(q2.visibleChoices[0].locText.getJson(), { default: "A de", en: "A en" });
  assert.equal(q2.visibleChoices[0].text, "A en");
  let counter = 0;
  q2.visibleChoices[0].locText.onStringChanged.add((sender, options) => {
    counter ++;
  });
  survey.locale = "de";
  assert.equal(counter, 1, "Fire str changed");
  surveyLocalization.defaultLocale = "en";
});
QUnit.test("Carry Forward and keepIncorrectValues, bug#6490", function (assert) {
  const survey = new SurveyModel({ elements: [
    { type: "dropdown", name: "q1", choices: ["A", "B", "C", "D"] },
    { type: "dropdown", name: "q2", choicesFromQuestion: "q1" }
  ] });
  survey.keepIncorrectValues = true;
  survey.data = { q1: "A", q2: "X" };
  const q1 = survey.getQuestionByName("q1");
  const q2 = <QuestionSelectBase>survey.getQuestionByName("q2");
  q1.value = "B";
  assert.equal(q2.value, "X", "keep value");
  survey.doComplete();
  assert.deepEqual(survey.data, { q1: "B", q2: "X" }, "keep value on compete");
});
QUnit.test("Check isUsingCarryForward on deleting question", function (assert) {
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
  assert.equal(q2.choicesFromQuestion, "q1", "set correctly");
  assert.equal(q2.isUsingCarryForward, true, "Carryforward flag is set");
  assert.equal(defaultValueProp.isVisible("", q2), false, "defaultValueProp.isVisible #1");
  assert.equal(correctAnswerProp.isVisible("", q2), false, "correctAnswerProp.isVisible #1");

  q1.delete();
  assert.notOk(q2.choicesFromQuestion, "it is empty");
  assert.equal(q2.isUsingCarryForward, false, "Carryforward flag is unset");
  assert.equal(defaultValueProp.isVisible("", q2), true, "defaultValueProp.isVisible #2");
  assert.equal(correctAnswerProp.isVisible("", q2), true, "correctAnswerProp.isVisible #2");
});
QUnit.test("Do not notify survey on changing newItem.value", function (
  assert
) {

  const survey = new SurveyModel();
  survey.setDesignMode(true);
  survey.fromJSON({
    elements: [{ type: "checkbox", name: "q", choices: [1] }]
  });
  const q = <QuestionCheckboxModel>survey.getQuestionByName("q");
  assert.equal(q.visibleChoices.length, 1 + 4, "#0");
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
  assert.equal(counter, 0, "#1");
  q.choices[0].value = 2;
  assert.equal(counter, 1, "#2");
  q.selectAllItem.text = "Sel";
  assert.equal(counter, 2, "#3");
  q.newItem.text = "item 2";
  assert.equal(counter, 2, "Do not react on newItem properties changes, #4");
});
QUnit.test("Remove newItem from the list if it is false", function (
  assert
) {

  const survey = new SurveyModel();
  survey.setDesignMode(true);
  survey.fromJSON({
    elements: [{ type: "checkbox", name: "q", choices: [1] }]
  });
  const q = <QuestionCheckboxModel>survey.getQuestionByName("q");
  assert.equal(q.visibleChoices.length, 1 + 4, "#1");
  q.newItem.setIsVisible(false);
  assert.equal(q.visibleChoices.length, 1 + 3, "#2");
  q.newItem.setIsVisible(true);
  assert.equal(q.visibleChoices.length, 1 + 4, "#3");
});
QUnit.test("displayValue & otherItem", function (assert) {
  const survey = new SurveyModel({
    elements: [
      { type: "dropdown", name: "q1", choices: [1], showOtherItem: true },
      { type: "checkbox", name: "q2", choices: [1], showOtherItem: true }
    ]
  });
  const q1 = <QuestionDropdownModel>survey.getQuestionByName("q1");
  const q2 = <QuestionCheckboxModel>survey.getQuestionByName("q2");
  q1.value = "other";
  assert.equal(q1.displayValue, "Other (describe)", "#1");
  q1.otherValue = "Some comments";
  assert.equal(q1.displayValue, "Some comments", "#2");
  q2.value = ["other", 1];
  q2.otherValue = "";
  assert.equal(q2.displayValue, "Other (describe), 1", "#3");
  q2.otherValue = "Some comments";
  assert.equal(q2.displayValue, "Some comments, 1", "#4");
});
QUnit.test("Use carryForward with matrix dynamic", function (assert) {
  const survey = new SurveyModel({ elements: [
    { type: "matrixdynamic", name: "q1", columns: [{ name: "col1", cellType: "text" }] },
    { type: "checkbox", name: "q2", choicesFromQuestion: "q1" }
  ] });
  const q1 = <QuestionMatrixDynamicModel>survey.getQuestionByName("q1");
  const q2 = <QuestionSelectBase>survey.getQuestionByName("q2");
  assert.equal(q2.choicesFromQuestion, "q1", "choicesFromQuestion is set");
  assert.equal(q2.isUsingCarryForward, true, "Carryforward flag is set");
  assert.equal(q2.visibleChoices.length, 0, "There is no choices");
  assert.equal(q2.visibleChoices.length, 0, "There is no choices, row is empty");
  q1.visibleRows[0].cells[0].value = "A";
  assert.deepEqual(survey.data, { q1: [{ col1: "A" }, {}] }, "survey.data is correct");
  assert.equal(q2.visibleChoices.length, 1, "There is one choice");
  assert.equal(q2.visibleChoices[0].value, "A", "the first value is correct");
  q1.visibleRows[1].cells[0].value = "B";
  assert.equal(q2.visibleChoices.length, 2, "There are two choice");
  assert.equal(q2.visibleChoices[1].value, "B", "the second value is correct");
  q1.addRow();
  assert.equal(q2.visibleChoices.length, 2, "There are two choice, new row is empty");
  q1.visibleRows[2].cells[0].value = "C";
  assert.deepEqual(survey.data, { q1: [{ col1: "A" }, { col1: "B" }, { col1: "C" }] }, "survey.data is correct, #2");
  assert.equal(q2.visibleChoices.length, 3, "There are three choice");
  assert.equal(q2.visibleChoices[2].value, "C", "the third value is correct");
});

QUnit.test("Use carryForward with matrix dynamic + choiceValuesFromQuestion", function (assert) {
  const survey = new SurveyModel({ elements: [
    { type: "matrixdynamic", name: "q1", columns: [{ name: "col1", cellType: "text" }, { name: "col2", cellType: "text" }] },
    { type: "checkbox", name: "q2", choicesFromQuestion: "q1", choiceValuesFromQuestion: "col2" }
  ] });
  const q1 = <QuestionMatrixDynamicModel>survey.getQuestionByName("q1");
  const q2 = <QuestionSelectBase>survey.getQuestionByName("q2");
  assert.equal(q2.choicesFromQuestion, "q1", "choicesFromQuestion is set");
  assert.equal(q2.choiceValuesFromQuestion, "col2", "choiceValuesFromQuestion is set");
  assert.equal(q2.isUsingCarryForward, true, "Carryforward flag is set");
  assert.equal(q2.visibleChoices.length, 0, "There is no choices");
  assert.equal(q2.visibleChoices.length, 0, "There is no choices, row is empty");
  q1.visibleRows[0].cells[0].value = "A";
  assert.equal(q2.visibleChoices.length, 0, "There is no choices, col2 is empty");
  q1.visibleRows[0].cells[1].value = "AA";
  assert.equal(q2.visibleChoices.length, 1, "There is one choice");
  assert.equal(q2.visibleChoices[0].value, "AA", "the first value is correct");
  q1.visibleRows[1].cells[0].value = "B";
  q1.visibleRows[1].cells[1].value = "BB";
  assert.equal(q2.visibleChoices.length, 2, "There are two choice");
  assert.equal(q2.visibleChoices[1].value, "BB", "the second value is correct");
  q1.addRow();
  assert.equal(q2.visibleChoices.length, 2, "There are two choice, new row is empty");
  q1.visibleRows[2].cells[0].value = "C";
  assert.equal(q2.visibleChoices.length, 2, "There are two choice, col2 is empty");
  q1.visibleRows[2].cells[1].value = "CC";
  assert.equal(q2.visibleChoices.length, 3, "There are three choice");
  assert.equal(q2.visibleChoices[2].value, "CC", "the third value is correct");
});
QUnit.test("Use carryForward with panel dynamic + choiceValuesFromQuestion&choiceTextsFromQuestion", function (assert) {
  const survey = new SurveyModel({ elements: [
    { type: "paneldynamic", name: "q1", panelCount: 2,
      templateElements: [{ name: "q1-q1", type: "text" }, { name: "q1-q2", type: "text" }, { name: "q1-q3", type: "text" }]
    },
    { type: "checkbox", name: "q2", choicesFromQuestion: "q1", choiceValuesFromQuestion: "q1-q2", choiceTextsFromQuestion: "q1-q3" }
  ] });
  const q1 = <QuestionPanelDynamicModel>survey.getQuestionByName("q1");
  const q2 = <QuestionSelectBase>survey.getQuestionByName("q2");
  assert.equal(q2.choicesFromQuestion, "q1", "choicesFromQuestion is set");
  assert.equal(q2.choiceValuesFromQuestion, "q1-q2", "choiceValuesFromQuestion is set");
  assert.equal(q2.choiceTextsFromQuestion, "q1-q3", "choiceTextsFromQuestion is set");
  assert.equal(q2.isUsingCarryForward, true, "Carryforward flag is set");
  assert.equal(q2.visibleChoices.length, 0, "There is no choices");
  q1.panels[0].getQuestionByName("q1-q1").value = "A";
  assert.equal(q2.visibleChoices.length, 0, "There is no choices, q1-q2 is empty");
  q1.panels[0].getQuestionByName("q1-q2").value = "AA";
  q1.panels[0].getQuestionByName("q1-q3").value = "AA-aa";
  assert.equal(q2.visibleChoices.length, 1, "There is one choice");
  assert.equal(q2.visibleChoices[0].value, "AA", "the first value is correct");
  assert.equal(q2.visibleChoices[0].text, "AA-aa", "the first text is correct");
  q1.panels[1].getQuestionByName("q1-q1").value = "B";
  q1.panels[1].getQuestionByName("q1-q2").value = "BB";
  q1.panels[1].getQuestionByName("q1-q3").value = "BB-bb";
  assert.equal(q2.visibleChoices.length, 2, "There are two choice");
  assert.equal(q2.visibleChoices[1].value, "BB", "the second value is correct");
  assert.equal(q2.visibleChoices[1].text, "BB-bb", "the second text is correct");
  q1.addPanel();
  assert.equal(q2.visibleChoices.length, 2, "There are two choice, new panel is empty");
  q1.panels[2].getQuestionByName("q1-q1").value = "C";
  assert.equal(q2.visibleChoices.length, 2, "There are two choice, q1-q2 is empty");
  q1.panels[2].getQuestionByName("q1-q2").value = "CC";
  q1.panels[2].getQuestionByName("q1-q3").value = "CC-cc";
  assert.equal(q2.visibleChoices.length, 3, "There are three choice");
  assert.equal(q2.visibleChoices[2].value, "CC", "the third value is correct");
  assert.equal(q2.visibleChoices[2].text, "CC-cc", "the third text is correct");
});
QUnit.test("Check isUsingCarryForward on deleting matrix dynamic question", function (assert) {
  const survey = new SurveyModel();
  survey.setDesignMode(true);
  survey.fromJSON({ elements: [
    { type: "matrixdynamic", name: "q1" },
    { type: "dropdown", name: "q2", choicesFromQuestion: "q1" }
  ] });
  const q1 = <QuestionSelectBase>survey.getQuestionByName("q1");
  const q2 = <QuestionSelectBase>survey.getQuestionByName("q2");
  assert.equal(q2.choicesFromQuestion, "q1", "set correctly");
  assert.equal(q2.isUsingCarryForward, true, "Carryforward flag is set");
  q1.delete();
  assert.notOk(q2.choicesFromQuestion, "it is empty");
  assert.equal(q2.isUsingCarryForward, false, "Carryforward flag is unset");
});
QUnit.test("Check isUsingCarryForward on deleting matrix dynamic question with doDispose = false parameter", function (assert) {
  const survey = new SurveyModel();
  survey.setDesignMode(true);
  survey.fromJSON({ elements: [
    { type: "matrixdynamic", name: "q1" },
    { type: "dropdown", name: "q2", choicesFromQuestion: "q1" }
  ] });
  const q1 = <QuestionSelectBase>survey.getQuestionByName("q1");
  const q2 = <QuestionSelectBase>survey.getQuestionByName("q2");
  assert.equal(q2.choicesFromQuestion, "q1", "set correctly");
  assert.equal(q2.isUsingCarryForward, true, "Carryforward flag is set");
  q1.delete(false);
  assert.notOk(q2.choicesFromQuestion, "it is empty");
  assert.equal(q2.isUsingCarryForward, false, "Carryforward flag is unset");
});
QUnit.test("Use carryForward with panel dynamic + update data on survey.data=data;", function (assert) {
  const survey = new SurveyModel({ elements: [
    { type: "checkbox", name: "q2", choicesFromQuestion: "q1", choiceValuesFromQuestion: "q1-q2", choiceTextsFromQuestion: "q1-q3" },
    { type: "paneldynamic", name: "q1", panelCount: 2,
      templateElements: [{ name: "q1-q1", type: "text" }, { name: "q1-q2", type: "text" }, { name: "q1-q3", type: "text" }]
    }
  ] });
  const q1 = <QuestionPanelDynamicModel>survey.getQuestionByName("q1");
  const q2 = <QuestionSelectBase>survey.getQuestionByName("q2");
  survey.data = { q1: [{ "q1-q2": 1, "q1-q3": "Item 1" }, { "q1-q2": 2, "q1-q3": "Item 2" }] };
  assert.equal(q2.visibleChoices.length, 2, "Create choices");
  assert.equal(q2.visibleChoices[0].value, 1, "the first value is correct");
  assert.equal(q2.visibleChoices[0].text, "Item 1", "the first text is correct");
  assert.equal(q2.visibleChoices[1].value, 2, "the second value is correct");
  assert.equal(q2.visibleChoices[1].text, "Item 2", "the second text is correct");
});
QUnit.test("Use carryForward with matrix dynamic & choicesVisibleIf", function (assert) {
  const survey = new SurveyModel({ elements: [
    { type: "matrixdynamic", name: "q1", columns: [{ name: "col1", cellType: "text" }] },
    { type: "checkbox", name: "q2", choicesFromQuestion: "q1", choicesVisibleIf: "{item} != 'A'" }
  ] });
  const q1 = <QuestionMatrixDynamicModel>survey.getQuestionByName("q1");
  const q2 = <QuestionSelectBase>survey.getQuestionByName("q2");
  assert.equal(q2.choicesFromQuestion, "q1", "choicesFromQuestion is set");
  assert.equal(q2.isUsingCarryForward, true, "Carryforward flag is set");
  assert.equal(q2.visibleChoices.length, 0, "There is no choices");
  assert.equal(q2.visibleChoices.length, 0, "There is no choices, row is empty");
  q1.visibleRows[0].cells[0].value = "A";
  assert.deepEqual(survey.data, { q1: [{ col1: "A" }, {}] }, "survey.data is correct");
  assert.equal(q2.visibleChoices.length, 0, "There is one choice, filtering");
  q1.visibleRows[1].cells[0].value = "B";
  assert.equal(q2.visibleChoices.length, 1, "There is one choice");
  assert.equal(q2.visibleChoices[0].value, "B", "the second value is correct");
  q1.addRow();
  assert.equal(q2.visibleChoices.length, 1, "There is one choice, new row is empty");
  q1.visibleRows[2].cells[0].value = "C";
  assert.deepEqual(survey.data, { q1: [{ col1: "A" }, { col1: "B" }, { col1: "C" }] }, "survey.data is correct, #2");
  assert.equal(q2.visibleChoices.length, 2, "There are three choice");
  assert.equal(q2.visibleChoices[1].value, "C", "the third value is correct");
});

QUnit.test("Allow to override default value fro choicesByUrl.path Bug#6766", function (assert) {
  const prop = Serializer.findProperty("choicesByUrl", "path");
  prop.defaultValue = "list";
  const q1 = new QuestionDropdownModel("q1");
  assert.equal(q1.choicesByUrl.path, "list", "get new default value for path");
  prop.defaultValue = undefined;
});
QUnit.test("Infinitive loop error by using carryForward, Bug#8232", function (assert) {
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
  assert.ok(q1, "q1 exists");
  assert.ok(q2, "q2 exists");
  assert.equal(q1.visibleChoices.length, 5, "q1.visibleChoices");
  assert.equal(q2.visibleChoices.length, 5, "q2.visibleChoices");
  assert.equal(q2.isVisible, true, "q2 is visible");
});
QUnit.test("Change carryForwardQuestionType to let question banner in creator that something is changed, Bug#5495-in-Creator", function (assert) {
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
  assert.equal(counterOn, 1, "counterOn #1");
  assert.equal(counterOff, 1, "counterOff #1");
  q3.choicesFromQuestion = "q1";
  assert.equal(counterOn, 2, "counterOn #2");
  assert.equal(counterOff, 2, "counterOff #2");
  survey.setDesignMode(false);
  q3.choicesFromQuestion = "q2";
  assert.equal(counterOn, 2, "counterOn #3");
  assert.equal(counterOff, 2, "counterOff #3");
  q3.choicesFromQuestion = "";
  survey.setDesignMode(false);
  q3.choicesFromQuestion = "q2";
  counterOn = 0;
  counterOff = 0;
  assert.equal(counterOn, 0, "counterOn #4");
  assert.equal(counterOff, 0, "counterOff #4");
});
QUnit.test("Use carryForward with panel dynamic + choiceValuesFromQuestion + valueName, Bug#6948-1", function (assert) {
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
  assert.equal(q2.visibleChoices.length, 2, "There are two choice");
  assert.equal(q2.visibleChoices[0].value, "aaa", "the first value is correct");
  assert.equal(q2.visibleChoices[1].value, "bbb", "the second value is correct");
});

QUnit.test("Use carryForward with panel dynamic + choiceValuesFromQuestion + removing the value, Bug#9399", function (assert) {
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
  assert.equal(q2.visibleChoices.length, 2, "There are two choices");
  q2.value = "bbb";
  assert.equal(q2.isEmpty(), false, "q2 is not empty");
  q1.removePanel(1);
  assert.equal(q2.visibleChoices.length, 1, "There is one choice");
  assert.equal(q2.isEmpty(), true, "q2 is empty");
});

QUnit.test("Use carryForward with panel dynamic + choiceValuesFromQuestion + valueName, Bug#6948-2", function (assert) {
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
  assert.equal(q2_q2.visibleChoices.length, 2, "There are two choice");
  assert.equal(q2_q2.visibleChoices[0].value, "aaa", "the first value is correct");
  assert.equal(q2_q2.visibleChoices[1].value, "bbb", "the second value is correct");
});
QUnit.test("Use carryForward with panel dynamic + incorrect values, Bug#9478", function (assert) {
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
  assert.equal(survey.tryComplete(), false, "The value is incorrect");
});
QUnit.test("SelectBase visibleChoices order & locale change", function (assert) {
  const survey = new SurveyModel({ elements: [
    { type: "dropdown", name: "q1", choicesOrder: "asc",
      choices: [{ value: "A", text: { default: "AA", de: "BAA" } },
        { value: "B", text: { default: "BB", de: "ABB" } }] }
  ] });
  const question = <QuestionSelectBase>survey.getQuestionByName("q1");
  assert.equal(question.visibleChoices.length, 2, "There are 4 items");
  assert.equal(question.visibleChoices[0].value, "A", "the first item");
  assert.equal(question.visibleChoices[1].value, "B", "the second item");
  survey.locale = "de";
  assert.equal(question.choicesOrder, "asc", "The order is correct");
  assert.equal(question.getLocale(), "de", "question locale is correct");
  assert.equal(question.choices[0].calculatedText, "BAA", "the first item calculatedText, de");
  assert.equal(question.choices[1].calculatedText, "ABB", "the second item calculatedText, de");
  assert.equal(question.choices[0].getLocale(), "de", "ItemValue locText locale is correct");
  assert.equal(question.visibleChoices[0].value, "B", "the first item, de");
  assert.equal(question.visibleChoices[1].value, "A", "the second item, de");
  assert.equal(question.visibleChoices[0].calculatedText, "ABB", "the first visible item calculatedText, de");
  assert.equal(question.visibleChoices[1].calculatedText, "BAA", "the second visible item calculatedText, de");
});
QUnit.test("SelectBase visibleChoices for selectAll, none and showOtherItem", function (assert) {
  const json = { elements: [
    { type: "checkbox", name: "q1", choices: ["a", "b", "c"], showSelectAllItem: true, showNoneItem: true, showOtherItem: true }
  ] };
  const survey = new SurveyModel(json);
  const question = <QuestionCheckboxModel>survey.getQuestionByName("q1");
  let choices = question.visibleChoices;
  assert.equal(choices.length, 6, "6 items, #1");
  assert.equal(choices[0].id, "selectall", "all index #1");
  assert.equal(choices[4].value, "none", "none index #1");
  assert.equal(choices[5].value, "other", "other index #1");

  settings.specialChoicesOrder.noneItem = [5];
  question.showNoneItem = false;
  question.showNoneItem = true;
  choices = question.visibleChoices;
  assert.equal(choices.length, 6, "6 items, #2");
  assert.equal(choices[0].id, "selectall", "all index #2");
  assert.equal(choices[4].value, "other", "other index #2");
  assert.equal(choices[5].value, "none", "none index #2");

  settings.specialChoicesOrder.noneItem = [-5, 5];
  question.showNoneItem = false;
  question.showNoneItem = true;
  choices = question.visibleChoices;
  assert.equal(choices.length, 7, "7 items, #3");
  assert.equal(choices[0].value, "none", "none index (up) #3");
  assert.equal(choices[1].id, "selectall", "all index #3");
  assert.equal(choices[5].value, "other", "other index #3");
  assert.equal(choices[6].value, "none", "none index (bottom) #3");

  settings.specialChoicesOrder.selectAllItem = [-1];
  settings.specialChoicesOrder.noneItem = [1];
  settings.specialChoicesOrder.otherItem = [4];
});
QUnit.test("Double noneItem and SelectAllItem", function (assert) {
  settings.specialChoicesOrder.noneItem = [-3, 3];
  const json = { elements: [
    { type: "checkbox", name: "q1", choices: ["a", "b", "c"], showSelectAllItem: true, showNoneItem: true, showOtherItem: true }
  ] };
  const survey = new SurveyModel(json);
  const question = <QuestionCheckboxModel>survey.getQuestionByName("q1");
  question.selectAll();
  assert.equal(question.isItemSelected(question.selectAllItem), true, "Select Item is selected");
  assert.equal(question.isAllSelected, true, "isAllSelected #1");
  question.value = ["a", "b"];
  assert.equal(question.isItemSelected(question.selectAllItem), false, "Select Item is not selected");
  assert.equal(question.isAllSelected, false, "isAllSelected #2");
  settings.specialChoicesOrder.selectAllItem = [-1];
  settings.specialChoicesOrder.noneItem = [1];
  settings.specialChoicesOrder.otherItem = [2];
});
QUnit.test("Double noneItem & selectAllItem and headItems/footItems", function (assert) {
  settings.specialChoicesOrder.noneItem = [-2, 4];
  settings.specialChoicesOrder.selectAllItem = [-2, 3];
  const json = { elements: [
    { type: "checkbox", name: "q1", choices: ["a", "b", "c"], showSelectAllItem: true, showNoneItem: true, showOtherItem: true }
  ] };
  const survey = new SurveyModel(json);
  const question = <QuestionCheckboxModel>survey.getQuestionByName("q1");
  question.separateSpecialChoices = true;

  assert.equal(question.visibleChoices.length, 8, "There are 8 items");
  assert.equal(question.headItems.length, 2, "There are two items in head items");
  assert.equal(question.headItems[0].value, "none", "head none");
  assert.equal(question.headItems[1].id, "selectall", "head selectall");
  assert.equal(question.footItems.length, 3, "There are three items in footer items");
  assert.equal(question.footItems[0].value, "other", "foot other");
  assert.equal(question.footItems[1].id, "selectall", "foot selectall");
  assert.equal(question.footItems[2].value, "none", "foot none");

  settings.specialChoicesOrder.selectAllItem = [-1];
  settings.specialChoicesOrder.noneItem = [1];
  settings.specialChoicesOrder.otherItem = [2];
});
QUnit.test("Select all disable/enabled", function (assert) {
  const json = { elements: [
    { type: "checkbox", name: "q1",
      choices: [{ value: "a", visibleIf: "{val1}=1" }, { value: "b", enableIf: "{val2}=1" }],
      showSelectAllItem: true, showNoneItem: true }
  ] };
  const survey = new SurveyModel(json);
  const question = <QuestionCheckboxModel>survey.getQuestionByName("q1");
  const selectAll = question.selectAllItem;
  assert.equal(selectAll.isEnabled, false, "#1");
  assert.equal(question.isItemSelected(selectAll), false, "#1.1");
  survey.setVariable("val1", 1);
  assert.equal(selectAll.isEnabled, true, "#2");
  assert.equal(question.isItemSelected(selectAll), false, "#2.1");
  survey.setVariable("val1", 2);
  assert.equal(selectAll.isEnabled, false, "#3");
  assert.equal(question.isItemSelected(selectAll), false, "#3.1");
  survey.setVariable("val2", 1);
  assert.equal(selectAll.isEnabled, true, "#4");
  assert.equal(question.isItemSelected(selectAll), false, "#4.1");
  survey.setVariable("val2", 2);
  assert.equal(selectAll.isEnabled, false, "#5");
  assert.equal(question.isItemSelected(selectAll), false, "#5.1");
});
QUnit.test("question.selectAll() disable/enabled and visible", function (assert) {
  const json = { elements: [
    { type: "checkbox", name: "q1",
      choices: [{ value: "a", visibleIf: "{val1}=1" }, { value: "b", enableIf: "{val2}=1" }, "c"],
      showSelectAllItem: true, showNoneItem: true }
  ] };
  const survey = new SurveyModel(json);
  const question = <QuestionCheckboxModel>survey.getQuestionByName("q1");
  const selectAll = question.selectAllItem;
  assert.equal(question.isItemSelected(selectAll), false, "#1.1");
  question.selectAll();
  assert.deepEqual(question.value, ["c"], "#1.2");
  assert.equal(question.isItemSelected(selectAll), true, "#1.3");

  survey.setVariable("val1", 1);
  assert.equal(question.isItemSelected(selectAll), false, "#2.1");
  question.selectAll();
  assert.deepEqual(question.value, ["a", "c"], "#2.2");
  assert.equal(question.isItemSelected(selectAll), true, "#2.3");

  survey.setVariable("val2", 1);
  assert.equal(question.isItemSelected(selectAll), false, "#3.1");
  question.selectAll();
  assert.deepEqual(question.value, ["a", "b", "c"], "#3.2");
  assert.equal(question.isItemSelected(selectAll), true, "#3.3");
});
QUnit.test("Select all disable/enabled showOtherItem=true", function (assert) {
  const json = { elements: [
    { type: "checkbox", name: "q1", showSelectAllItem: true, showOtherItem: true }
  ] };
  const survey = new SurveyModel(json);
  const question = <QuestionCheckboxModel>survey.getQuestionByName("q1");
  const selectAll = question.selectAllItem;
  assert.equal(selectAll.isEnabled, false, "#1");
  assert.equal(question.isItemSelected(selectAll), false, "#2");
});
QUnit.test("Select all and clickItemHandler", function (assert) {
  const json = { elements: [
    { type: "checkbox", name: "q1", choices: [1, 2, 3], showSelectAllItem: true }
  ] };
  const survey = new SurveyModel(json);
  const question = <QuestionCheckboxModel>survey.getQuestionByName("q1");
  assert.equal(question.selectAllItem.value, "", "select all equals empty value");
  assert.equal(question.isAllSelected, false, "#1");
  question.clickItemHandler(question.selectAllItem, true);
  assert.equal(question.isAllSelected, true, "#2");
  question.clickItemHandler(question.selectAllItem, false);
  assert.equal(question.isAllSelected, false, "#3");
  question.clickItemHandler(question.selectAllItem);
  assert.equal(question.isAllSelected, true, "#4");
  question.clickItemHandler(question.selectAllItem);
  assert.equal(question.isAllSelected, false, "#5");
});
QUnit.test("Test dropdown in CreatorV2 & restful", function (assert) {
  const json = { elements: [
    { type: "checkbox", name: "q1", choices: [1, 2, 3, 4, 5] }
  ] };
  const survey = new SurveyModel();
  survey.setDesignMode(true);
  survey.fromJSON(json);
  const question = <QuestionCheckboxModel>survey.getQuestionByName("q1");
  assert.equal(question.isUsingRestful, false, "isUsingRestful #1");
  assert.equal(question.visibleChoices.length, 3 + 5 + 1, "3 built-in + 5 choices + 1 add item, #1");
  question.choicesByUrl.url = "test_url";
  assert.equal(question.isUsingRestful, true, "isUsingRestful #2");
  assert.equal(question.visibleChoices.length, 3, "3 built-in + do not show default choices, #2");
  question.choicesByUrl.url = "";
  assert.equal(question.isUsingRestful, false, "isUsingRestful #3");
  assert.equal(question.visibleChoices.length, 3 + 5 + 1, "3 built-in + 5 choices + 1 add item, #3");
});
QUnit.test("isUsingRestful & loading", function(assert) {
  const json = { elements: [
    { type: "checkbox", name: "q1", choicesByUrl: { url: "abc" } },
    { type: "checkbox", name: "q2" }
  ] };
  const survey = new SurveyModel(json);
  const q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
  const q2 = <QuestionCheckboxModel>survey.getQuestionByName("q2");
  assert.equal(q1.isUsingRestful, true, "q1 #1");
  assert.equal(q2.isUsingRestful, false, "q2 #1");
  q1.choicesByUrl.url = "";
  assert.equal(q1.isUsingRestful, false, "q1 #2");
  q1.choicesByUrl.url = "edf";
  assert.equal(q1.isUsingRestful, true, "q1 #3");
});
QUnit.test("checkbox max(min)SelectedChoices validation", (assert) => {
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
  assert.equal(q.minSelectedChoices, 10, "q.minSelectedChoices, #1");
  q.maxSelectedChoices = 5;
  assert.equal(q.maxSelectedChoices, 10, "q.maxSelectedChoices, #2");
  q.minSelectedChoices = 20;
  assert.equal(q.minSelectedChoices, 10, "q.minSelectedChoices, #3");
  q.maxSelectedChoices = 0;
  q.minSelectedChoices = 20;
  assert.equal(q.minSelectedChoices, 20, "q.minSelectedChoices, #4");
  q.minSelectedChoices = 0;
  q.maxSelectedChoices = 5;
  assert.equal(q.maxSelectedChoices, 5, "q.maxSelectedChoices, #5");
});
QUnit.test("minSelectedChoices in checkbox & known & other one selection, Bug#9830", function (assert) {
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
  assert.equal(question.validate(), false, "validate #1");
  question.clickItemHandler(question.noneItem, true);
  assert.deepEqual(question.value, ["none"], "value #2");
  assert.equal(question.validate(), true, "validate #2");
  question.value = [2, 3];
  assert.equal(question.validate(), false, "validate #3");
  question.clickItemHandler(question.refuseItem, true);
  assert.deepEqual(question.value, ["refused"], "value #4");
  assert.equal(question.validate(), true, "validate #4");
  question.value = [2];
  assert.equal(question.validate(), false, "validate #5");
  question.clickItemHandler(question.dontKnowItem, true);
  assert.deepEqual(question.value, ["dontknow"], "value #6");
  assert.equal(question.validate(), true, "validate #6");
});
QUnit.test("checkbox, selectAll & survey.data, bug#7657", (assert) => {
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
  assert.deepEqual(q.value, ["One", "Two"], "q.value, #1");
  assert.deepEqual(survey.data, { q1: ["One", "Two"] }, "survey.data, #1");
  survey.doComplete();
  assert.deepEqual(q.value, ["One", "Two"], "q.value, #2");
  assert.deepEqual(survey.data, { q1: ["One", "Two"] }, "survey.data, #2");
});
QUnit.test("Do not show show choices in designer", function (assert) {
  const json = { elements: [
    { type: "checkbox", name: "q1", choices: [1, 2, 3, 4, 5] }
  ] };
  const survey = new SurveyModel();
  survey.setDesignMode(true);
  survey.fromJSON(json);
  const question = <QuestionCheckboxModel>survey.getQuestionByName("q1");
  assert.equal(question.visibleChoices.length, 5 + 1 + 3, "Show choices in designer, #1");
  question.isMessagePanelVisible = true;
  assert.equal(question.visibleChoices.length, 3, "Hide choices in designer, #2");
  question.isMessagePanelVisible = false;
  assert.equal(question.visibleChoices.length, 5 + 1 + 3, "Show choices in designer, #1");
});
QUnit.test("question checkbox displayValue() with other and comment", (assert) => {
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
  assert.deepEqual(q1.displayValue, "Item 1, Item 2, Other Value", "Other value should be kept");
});
QUnit.test("Default comment & otherItem text, Bug#9733", (assert) => {
  const q1 = new QuestionCheckboxModel("q1");
  assert.equal(q1.commentText, "Please leave a comment", "Default comment text is correct");
  assert.equal(q1.otherText, "Other (describe)", "Default other item text is correct");
});

QUnit.test("checkbox with incorrect defaultValue, other & survey.data Bug#7943", (assert) => {
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
  assert.deepEqual(q.value, ["other"], "q.value");
  assert.equal(q.comment, "101", "q.comment");
  assert.deepEqual(survey.data, { q1: ["other"], "q1-Comment": "101" }, "survey.data");
  survey.doComplete(false);
  assert.deepEqual(survey.data, { q1: ["other"], "q1-Comment": "101" }, "survey.data");
});
QUnit.test("radiogroup with incorrect defaultValue, other & survey.data Bug#7943", (assert) => {
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
  assert.deepEqual(q.value, "other", "q.value");
  assert.equal(q.comment, "101", "q.comment");
  assert.deepEqual(survey.data, { q1: "other", "q1-Comment": "101" }, "survey.data");
  survey.doComplete(false);
  assert.deepEqual(survey.data, { q1: "other", "q1-Comment": "101" }, "survey.data on complete");
});
QUnit.test("On value changed, comment and valueName Bug#8137", (assert) => {
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
  assert.equal(counter, 1, "counter #1");
  assert.equal(questionName, "q1", "question.name #1");
  assert.equal(name, "val1", "name #1");
  assert.equal(value, 1, "value #1");
  q.value = "other";
  assert.equal(counter, 2, "counter #2");
  questionName = "";
  name = "";
  value = undefined;
  q.otherValue = "comment1";
  assert.equal(counter, 3, "counter #3");
  assert.equal(questionName, "q1", "question name #3");
  assert.equal(name, "val1-Comment", "name #3");
  assert.equal(value, "comment1", "value #3");
});
QUnit.test("maxSelectedChoices & getItemClass, bug#8159", (assert) => {
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
  assert.ok(q1.visibleChoices[0].enabled, "Item1 enabled #1");
  assert.notOk(q1.visibleChoices[1].enabled, "Item2 enabled #2");

  assert.notOk(q1.getItemClass(q1.visibleChoices[0]).indexOf(disableStyle) >= 0, "Item1 disabled #1");
  assert.ok(q1.getItemClass(q1.visibleChoices[1]).indexOf(disableStyle) >= 0, "Item2 disabled #2");
  assert.notOk(q1.getItemClass(q1.visibleChoices[2]).indexOf(disableStyle) >= 0, "Item3 disabled #3");

  assert.notOk(q1.getItemClass(q1.visibleChoices[0]).indexOf(readOnlyStyle) >= 0, "Item1 read-only #1");
  assert.ok(q1.getItemClass(q1.visibleChoices[1]).indexOf(readOnlyStyle) >= 0, "Item2 read-only #2");
  assert.notOk(q1.getItemClass(q1.visibleChoices[2]).indexOf(readOnlyStyle) >= 0, "Item3 read-only #3");
});
QUnit.test("radiogroup.getConditionJson, bug#8226", (assert) => {
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
  assert.deepEqual(q1.getConditionJson(), res, "q1");
  res.name = "q2";
  assert.deepEqual(q2.getConditionJson(), res, "q2");
});
QUnit.test("dropdown.clearValue(true) for showCommentArea & showOtherItem, bug#8226", (assert) => {
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

  assert.equal(q1.value, undefined, "q1.value");
  assert.equal(q1.comment, "abc", "q1.comment");
  assert.equal(q2.value, undefined, "q2.value");
  assert.notOk(q2.comment, "q2.comment");
  assert.equal(q3.value, undefined, "q3.value");
  assert.equal(q3.comment, "abc", "q3.comment");
  assert.equal(q4.value, undefined, "q4.value");
  assert.notOk(q4.comment, "q4.comment");
});
QUnit.test("storeOthersAsComment & entering comment equals to the value in the choice, bug#9619", (assert) => {
  const survey = new SurveyModel({
    elements: [
      { type: "radiogroup", name: "q1", choices: ["red", "yellow", "green"], "showOtherItem": true },
      { type: "checkbox", name: "q2", choices: ["red", "yellow", "green"], "showOtherItem": true }
    ],
    storeOthersAsComment: false
  });
  const q1 = <QuestionRadiogroupModel>survey.getQuestionByName("q1");
  q1.value = "other";
  assert.equal(q1.isOtherSelected, true, "q1, isOther is selected");
  q1.otherValue = "red";
  assert.equal(q1.value, "red", "q1, value is red");
  assert.equal(q1.selectedItem.value, "red", "q1, Make the red item seleted");
  assert.equal(q1.isOtherSelected, false, "q1, isOther is not selected");
  const q2 = <QuestionCheckboxModel>survey.getQuestionByName("q2");
  q2.value = ["green", "other"];
  assert.equal(q2.isOtherSelected, true, "q2, isOther is selected, #1");
  q2.otherValue = "red";
  assert.deepEqual(q2.value, ["green", "red"], "q2, Make the red item seleted, #1");
  assert.equal(q2.isOtherSelected, false, "q2, isOther is not selected, #1");
  q2.value = ["green", "other"];
  assert.equal(q2.isOtherSelected, true, "q2, isOther is selected, #2");
  q2.otherValue = "green";
  assert.deepEqual(q2.value, ["green"], "q2, Make the red item seleted, #2");
  assert.equal(q2.isOtherSelected, false, "q2, isOther is not selected, #2");
});
QUnit.test("valuePropertyName & complete trigger, bug#8434", (assert) => {
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
  assert.equal(survey.calcIsCompleteButtonVisible(), false, "#1");
  q.renderedValue = ["none"];
  assert.equal(survey.calcIsCompleteButtonVisible(), true, "#2");
  q.renderedValue = [1];
  assert.equal(survey.calcIsCompleteButtonVisible(), false, "#3");
  q.renderedValue = ["none"];
  assert.equal(survey.calcIsCompleteButtonVisible(), true, "#4");
});
QUnit.test("Unselect none item, bug#8438", (assert) => {
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
  assert.deepEqual(q.value, ["none"], "#1");
  q.clickItemHandler(q.noneItem, false);
  assert.equal(q.isEmpty(), true, "#2");
  q.clickItemHandler(q.noneItem, true);
  assert.deepEqual(q.value, ["none"], "#3");
});

QUnit.test("Add condition custom property", function (assert) {
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
  assert.equal(item3.getPropertyValue("customVal"), 0, "#1");
  q.value = [1, 2, 3];
  assert.equal(item3.getPropertyValue("customVal"), 3, "#2");
  q.value = [2];
  assert.equal(item3.getPropertyValue("customVal"), 1, "#3");

  Serializer.removeProperty("itemvalue", "customExp");
});
QUnit.test("question checkbox add a custom property into choicesByUrl, Bug#8783", (assert) => {
  Serializer.addProperty("choicesByUrl", "jsonpath");
  const survey = new SurveyModel({
    elements: [
      { type: "checkbox", name: "q1",
        choicesByUrl: { valueName: "name", jsonpath: "mypath" }
      }
    ]
  });
  const q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
  assert.equal(q1.choicesByUrl.valueName, "name", "valueName");
  assert.equal(q1.choicesByUrl["jsonpath"], "mypath", "load jsonpath");
  q1.choicesByUrl["jsonpath"] = "newpath";
  assert.deepEqual(q1.toJSON(), { name: "q1", choicesByUrl: { valueName: "name", jsonpath: "newpath" } }, "#2");
  Serializer.removeProperty("choicesByUrl", "jsonpath");
});
QUnit.test("Clear action in locale & survey.locale change, Bug#9113", (assert) => {
  const survey = new SurveyModel();
  survey.css = survey.css = { root: "sd-root-modern" };
  survey.fromJSON({
    elements: [{ type: "radiogroup", name: "q1", allowClear: true }]
  });
  const q1 = <QuestionRadiogroupModel>survey.getQuestionByName("q1");
  assert.ok(q1.getTitleToolbar());
  assert.equal(q1.titleActions.length, 1, "one action");
  const item = q1.titleActions[0];
  assert.equal(item.locTitle.localizationName, "clearCaption", "locName");
  assert.equal(item.locTitle.locale, "", "locale #1");
  survey.locale = "de";
  assert.equal(item.locTitle.locale, "de", "locale #2");
});
QUnit.test("ItemValue tooltip, #9269", (assert) => {
  const item = new ItemValue(1);
  assert.equal(item.getTooltip(), "1", "#1");
  item.text = "abc";
  assert.equal(item.getTooltip(), "abc", "#2");
  item.tooltip = "edf";
  assert.equal(item.getTooltip(), "edf", "#3");
});

QUnit.test("Check QuestionSelectBase Columns Arragement", function (assert) {
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
  assert.deepEqual(
    columns,
    [["Item1", "Item2", "Item3", "Item4"], ["Item5", "Item6", "Item7", "Item8"], ["Item9", "Item10"]],
    "check itemFlowDirection column"
  );

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
  assert.deepEqual(
    columns,
    [["Item1", "Item2"], ["Item3"], ["Item4"]],
    "check itemFlowDirection column (2)"
  );
});
QUnit.test("Dropdown question show selected item incorrectly if choices set after the question value is set, Bug#9791", (assert) => {
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
  assert.equal(q1.value, "val2", "q1.value is correct");
  assert.equal(q1.isOtherSelected, false, "q1.isOtherSelected is false");
  assert.equal(q1.selectedItem?.value, "val2", "q1.selectedItem is correct");
});
QUnit.test("Checkbox question show selected item incorrectly if choices set after the question value is set, Bug#9791", (assert) => {
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
  assert.deepEqual(q1.value, ["val2", "val4"], "q1.value is correct");
  assert.equal(q1.isOtherSelected, false, "q1.isOtherSelected is false");
  assert.equal(q1.selectedChoices.length, 2, "q1.selectedChoices.length is correct");
});
QUnit.test("Dropdown question and choiceitem type", (assert) => {
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
  assert.equal(q1.choices[0].getType(), "choiceitem", "choiceitem type for choices[0]");
  assert.equal(q1.choices[2].getType(), "choiceitem", "choiceitem type for choices[2]");
  assert.equal(q1.otherItem.getType(), "choiceitem", "choiceitem type for otherItem");
});
QUnit.test("Radiogroup question and choices has comment", (assert) => {
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
  assert.equal(q1.comment, "", "comment is empty by default");
  assert.equal(q1.choices[0].showCommentArea, false, "choices[0].showCommentArea");
  assert.equal(q1.choices[1].showCommentArea, true, "choices[1].showCommentArea");
  assert.equal(q1.otherItem.showCommentArea, true, "choices[1].showCommentArea");
  assert.equal(q1.isCommentShowing(q1.choices[0]), false, "isCommentShowing for choices[0], #1");
  assert.equal(q1.isCommentShowing(q1.choices[1]), false, "isCommentShowing for choices[1], #1");
  assert.equal(q1.isCommentShowing(q1.otherItem), false, "isCommentShowing for otherItem, #1");
  assert.equal(q1.choices[0].isCommentShowing, false, "isCommentShowing for choices[0], #1");
  assert.equal(q1.choices[1].isCommentShowing, false, "isCommentShowing for choices[1], #1");
  q1.clickItemHandler(q1.otherItem);
  assert.equal(q1.isCommentShowing(q1.choices[1]), false, "isCommentShowing for choices[1], #2");
  assert.equal(q1.isCommentShowing(q1.otherItem), true, "isCommentShowing for otherItem, #2");
  assert.equal(q1.otherItem.isCommentShowing, true, "isCommentShowing for otherItem, #2");
  q1.clickItemHandler(q1.choices[1]);
  assert.equal(q1.isCommentShowing(q1.choices[1]), true, "isCommentShowing for choices[1], #3");
  assert.equal(q1.choices[1].isCommentShowing, true, "isCommentShowing for choices[1], #3");
  assert.equal(q1.isCommentShowing(q1.otherItem), false, "isCommentShowing for otherItem, #3");
  assert.equal(q1.otherItem.isCommentShowing, false, "isCommentShowing for otherItem, #3");
  q1.setCommentValue(q1.choices[0], "test comment, #1");
  assert.notOk(q1.comment, "comment is empty if we set comment for choices[0], #1");
  assert.equal(q1.renderedValue, 2, "renderedValue, #1");
  assert.equal(q1.isCommentShowing(q1.choices[1]), true, "comment is showing, #1");
  q1.setCommentValue(q1.choices[1], "test comment");
  assert.notOk(q1.comment, "comment is not used for choices[1], #2");
  assert.equal(q1.getCommentValue(q1.choices[0]), "", "getCommentValue for choices[0], #2");
  assert.equal(q1.getCommentValue(q1.choices[1]), "test comment", "getCommentValue for choices[1], #2");
  assert.equal(q1.getCommentValue(q1.otherItem), "", "getCommentValue for otherItem, #2");
  q1.setCommentValue(q1.otherItem, "test comment 2");
  assert.equal(q1.getCommentValue(q1.choices[1]), "test comment", "getCommentValue for choices[1], #3");
  assert.equal(q1.getCommentValue(q1.otherItem), "", "getCommentValue for otherItem, #3");
  q1.clickItemHandler(q1.otherItem);
  assert.equal(q1.getCommentValue(q1.choices[1]), "", "getCommentValue for choices[1], #4");
  assert.equal(q1.getCommentValue(q1.otherItem), "", "getCommentValue for otherItem, #4");
  q1.setCommentValue(q1.otherItem, "test comment 3");
  assert.equal(q1.getCommentValue(q1.choices[1]), "", "getCommentValue for choices[1], #5");
  assert.equal(q1.getCommentValue(q1.otherItem), "test comment 3", "getCommentValue for otherItem, #5");
});
QUnit.test("Radiogroup/dropdown questions and choices has comment: do not remove comment on complete", (assert) => {
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
  assert.deepEqual(survey.data, { q1: { value: 2, comment: "test comment1" }, q2: { value: 2, comment: "test comment2" } }, "survey.data after complete");
});
QUnit.test("Radiogroup question, choices has comment and defaultValue", (assert) => {
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
  assert.equal(q1.value, "other", "q1.value is 'other'");
  assert.equal(q1.isOtherSelected, true, "q1.isOtherSelected is true");
  assert.equal(q1.isCommentShowing(q1.otherItem), true, "isCommentShowing for otherItem, #1");
  assert.equal(q1.otherItem.isCommentShowing, true, "isCommentShowing for otherItem, #1");
  assert.equal(q1.renderedValue, "other", "q1.renderedValue is 'other'");
});
function testCheckboxQuestionWithSeveralCommentChoices(q1: QuestionCheckboxModel, assert): void {
  assert.equal(q1.choices[0].showCommentArea, false, "choices[0].showCommentArea");
  assert.equal(q1.choices[1].showCommentArea, true, "choices[1].showCommentArea");
  assert.equal(q1.choices[2].showCommentArea, true, "choices[2].showCommentArea");
  assert.equal(q1.otherItem.showCommentArea, true, "choices[1].showCommentArea");
  assert.equal(q1.isCommentShowing(q1.choices[0]), false, "isCommentShowing for choices[0], #1");
  assert.equal(q1.isCommentShowing(q1.choices[1]), false, "isCommentShowing for choices[1], #1");
  assert.equal(q1.isCommentShowing(q1.otherItem), false, "isCommentShowing for otherItem, #1");
  q1.clickItemHandler(q1.otherItem, true);
  assert.equal(q1.isCommentShowing(q1.choices[1]), false, "isCommentShowing for choices[1], #2");
  assert.equal(q1.isCommentShowing(q1.otherItem), true, "isCommentShowing for otherItem, #2");
  q1.clickItemHandler(q1.choices[1], true);
  assert.equal(q1.isCommentShowing(q1.choices[1]), true, "isCommentShowing for choices[1], #3");
  assert.equal(q1.isCommentShowing(q1.otherItem), true, "isCommentShowing for otherItem, #3");
  q1.setCommentValue(q1.choices[1], "test comment, #1");
  q1.setCommentValue(q1.choices[2], "test comment, #2");
  q1.setCommentValue(q1.otherItem, "test comment, #other");
  assert.equal(q1.getCommentValue(q1.choices[0]), "", "getCommentValue for choices[0], #4");
  assert.equal(q1.getCommentValue(q1.choices[1]), "test comment, #1", "getCommentValue for choices[1], #4");
  assert.equal(q1.getCommentValue(q1.choices[2]), "", "getCommentValue for choices[2], #4");
  assert.equal(q1.getCommentValue(q1.otherItem), "test comment, #other", "getCommentValue for otherItem, #4");
  q1.clickItemHandler(q1.choices[2], true);
  q1.setCommentValue(q1.choices[2], "test comment, #2");
  assert.equal(q1.getCommentValue(q1.choices[0]), "", "getCommentValue for choices[0], #5");
  assert.equal(q1.getCommentValue(q1.choices[1]), "test comment, #1", "getCommentValue for choices[1], #5");
  assert.equal(q1.getCommentValue(q1.choices[2]), "test comment, #2", "getCommentValue for choices[2], #5");
  assert.equal(q1.getCommentValue(q1.otherItem), "test comment, #other", "getCommentValue for otherItem, #5");
  q1.clickItemHandler(q1.otherItem, false);
  q1.clickItemHandler(q1.choices[0], false);
  q1.clickItemHandler(q1.choices[1], false);
  assert.equal(q1.getCommentValue(q1.choices[0]), "", "getCommentValue for choices[0], #6");
  assert.equal(q1.getCommentValue(q1.choices[1]), "", "getCommentValue for choices[1], #6");
  assert.equal(q1.getCommentValue(q1.choices[2]), "test comment, #2", "getCommentValue for choices[2], #6");
  assert.equal(q1.getCommentValue(q1.otherItem), "", "getCommentValue for otherItem, #6");
}
QUnit.test("checbox question and choices has comment", (assert) => {
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
  testCheckboxQuestionWithSeveralCommentChoices(q1, assert);
});
QUnit.test("checbox question and choices has comment and storeOthersAsComment = false", (assert) => {
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
  testCheckboxQuestionWithSeveralCommentChoices(q1, assert);
});
QUnit.test("checbox question and choices has comment vs renderedValue", (assert) => {
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
  assert.equal(q1.getCommentValue(q1.choices[1]), "test comment", "getCommentValue for choices[1], #1");
  assert.notOk(q1.comment, "comment is not set for choices[1], #1");
});
QUnit.test("checbox question and choices has comment: clear comment on unselecting choice", (assert) => {
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
  assert.equal(q1.getCommentValue(q1.choices[1]), "test comment", "getCommentValue for choices[1], #1");
  const propName = "other_" + q1.choices[1].uniqueId;
  assert.equal(q1.getPropertyValue(propName), "test comment", "comment property value, #1");
  q1.renderedValue = [1];
  assert.equal(q1.getCommentValue(q1.choices[1]), "", "getCommentValue for choices[1], #2");
  assert.equal(q1.getPropertyValue(propName), undefined, "comment property value, #2");
  assert.equal(textArea1.getTextValue(), "", "No value in text area");
  q1.renderedValue = [1, 2];
  q1.setCommentValue(q1.choices[1], "test comment");
  assert.equal(q1.getCommentValue(q1.choices[1]), "test comment", "getCommentValue for choices[1], #3");
  q1.clickItemHandler(q1.noneItem, true);
  assert.equal(q1.getCommentValue(q1.choices[1]), "", "getCommentValue for choices[1], #4");
});
QUnit.test("checbox question and choices has comment with other value", (assert) => {
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
  assert.equal(q1.getCommentValue(q1.choices[1]), "test comment", "getCommentValue for choices[1], #1");
  assert.equal(q1.comment, "test comment", "comment is set for choices[1], #1");
  q1.comment = "test comment 2";
  assert.equal(q1.getCommentValue(q1.choices[1]), "test comment 2", "getCommentValue for choices[1], #2");
});
QUnit.test("checkbox vs multiple comment choices - question.value", (assert) => {
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
  assert.equal(q1.getValuePropertyName(), "value", "getValuePropertyName");
  q1.renderedValue = [1, 2, "other"];
  assert.deepEqual(q1.value, [{ value: 1 }, { value: 2 }, { value: "other" }], "q1.value, #1");
  q1.setCommentValue(q1.choices[1], "choices comment1");
  q1.setCommentValue(q1.otherItem, "other comment1");
  assert.deepEqual(q1.value, [{ value: 1 }, { value: 2, comment: "choices comment1" }, { value: "other comment1" }], "q1.value, #2");
  q1.value = [{ value: 1 }, { value: 3, comment: "choice comment3" }, { value: "other comment2" }];
  assert.deepEqual(q1.renderedValue, [1, 3, "other"], "q1.renderedValue, #3");
  assert.deepEqual(q1.value, [{ value: 1 }, { value: 3, comment: "choice comment3" }, { value: "other comment2" }], "q1.value, #3");
  assert.equal(q1.getCommentValue(q1.choices[0]), "", "getCommentValue for choices[0], #3");
  assert.equal(q1.getCommentValue(q1.choices[1]), "", "getCommentValue for choices[1], #3");
  assert.equal(q1.getCommentValue(q1.choices[2]), "choice comment3", "getCommentValue for choices[2], #3");
  assert.equal(q1.getCommentValue(q1.otherItem), "other comment2", "getCommentValue for otherItem, #3");
});
QUnit.test("checkbox vs multiple comment choices - question.value - set incorrect value", (assert) => {
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
  assert.equal(q1.getValuePropertyName(), "value", "getValuePropertyName");
  q1.value = [1, 2, "other"];
  assert.deepEqual(q1.value, [{ value: 1 }, { value: 2 }, { value: "other" }], "q1.value, #1");
  assert.deepEqual(q1.renderedValue, [1, 2, "other"], "q1.renderedValue, #1");
});
QUnit.test("Radiogroup question and choices has comment, storeOthersAsComment: false", (assert) => {
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
    assert.equal(q.getStoreOthersAsComment(), res, "getStoreOthersAsComment() #" + no.toString());
  };
  checkFunc("q1", false, 1);
  checkFunc("q2", false, 2);
  checkFunc("q3", true, 3);
  checkFunc("q4", false, 4);
});
QUnit.test("storeOthersAsComment: false, add dynamic question vs survey.data, Bug#10327", (assert) => {
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
  assert.equal(q1.value, 1, "q1 is correct");
  assert.equal(q2.value, 2, "q2 is correct");
  assert.equal(q3.value, 3, "q3 is correct");
  assert.equal(q2.selectedItem.value, 2, "q2 selectedItem.value is correct");
  assert.equal(q2.renderedValue, 2, "q2 renderedValue is correct");
  assert.equal(q2.isItemSelected(q2.choices[1]), true, "q2 isItemSelected(1) is correct");
  assert.equal(q2.isOtherSelected, false, "q2 isOtherSelected is correct");
});
QUnit.test("Create multiple choice item for checkbox", (assert) => {
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
  assert.equal(q.choices[0].getType(), "checkboxitem", "choice 0 is checkboxitem");
  assert.equal(q.choices[2].getType(), "checkboxitem", "choice 2 is checkboxitem");
  assert.equal(q.selectAllItem.getType(), "checkboxitem", "selectAllItem is checkboxitem");
  assert.equal(q.noneItem.getType(), "checkboxitem", "noneItem is checkboxitem");
  assert.equal(q.otherItem.getType(), "checkboxitem", "otherItem is checkboxitem");
  assert.equal(q.refuseItem.getType(), "checkboxitem", "refuseItem is checkboxitem");
  assert.equal(q.dontKnowItem.getType(), "checkboxitem", "dontKnowItem is checkboxitem");
  assert.equal(q.selectAllItem.isExclusive, false, "selectAllItem => isExclusive");
  assert.equal(q.noneItem.isExclusive, true, "noneItem => isExclusive");
  assert.equal(q.otherItem.isExclusive, false, "otherItem  => isExclusive");
  assert.equal(q.refuseItem.isExclusive, true, "refuseItem => isExclusive");
  assert.equal(q.dontKnowItem.isExclusive, true, "dontKnowItem => isExclusive");
});
QUnit.test("checkbox vs selectAll and isExclusive", (assert) => {
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
  assert.deepEqual(q.value, ["apple", "banana", "orange"], "#1");
  assert.equal(q.isAllSelected, true, "#3, all is selected");
  q.clickItemHandler(q.choices[2], true);
  assert.deepEqual(q.value, ["none2"], "#4");
  assert.equal(q.isAllSelected, false, "#5, all is not selected");
  q.clickItemHandler(q.selectAllItem, true);
  assert.deepEqual(q.value, ["apple", "banana", "orange"], "#6");
  q.clickItemHandler(q.noneItem, true);
  assert.deepEqual(q.value, ["none"], "#7");
  q.clickItemHandler(q.choices[2], true);
  assert.deepEqual(q.value, ["none2"], "#8");
  q.clickItemHandler(q.choices[0], true);
  assert.deepEqual(q.value, ["apple"], "#10");

  q.renderedValue = ["apple", "none2"];
  assert.deepEqual(q.value, ["none2"], "#11");
  q.renderedValue = ["none2", "none"];
  assert.deepEqual(q.value, ["none"], "#12");
});
QUnit.test("Focus element on selecting showCommentArea element", (assert) => {
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
  assert.deepEqual(els, [otherId], "q1.focus #1");
  q1.selectItem(q1.otherItem, false);
  assert.deepEqual(els, [otherId], "q1.focus #2");
  q1.selectItem(q1.choices[0], true);
  assert.deepEqual(els, [otherId, choice1Id], "q1.focus #3");
  q1.selectItem(q1.choices[0], false);
  q1.selectItem(q1.choices[1], true);
  assert.deepEqual(els, [otherId, choice1Id], "q1.focus #4");
  q1.selectItem(q1.choices[2], true);
  assert.deepEqual(els, [otherId, choice1Id, choice3Id], "q1.focus #5");

  const q2 = <QuestionRadiogroupModel>survey.getQuestionByName("q2");
  otherId = q2.otherItem.uniqueId.toString();
  choice1Id = q2.choices[0].uniqueId.toString();
  choice3Id = q2.choices[2].uniqueId.toString();
  els.length = 0;
  q2.selectItem(q2.otherItem);
  assert.deepEqual(els, [otherId], "q2.focus #1");
  q2.selectItem(q2.choices[0]);
  assert.deepEqual(els, [otherId, choice1Id], "q2.focus #2");
  q2.selectItem(q2.choices[1]);
  assert.deepEqual(els, [otherId, choice1Id], "q2.focus #3");
  q2.selectItem(q2.choices[2]);
  assert.deepEqual(els, [otherId, choice1Id, choice3Id], "q2.focus #4");

  els.length = 0;
  q1.autoOtherMode = true;
  q2.autoOtherMode = true;
  q1.selectItem(q1.otherItem, true);
  q2.selectItem(q2.otherItem);
  assert.deepEqual(els, [], "autoOtherMode, focus is not called");
  SurveyElement.FocusElement = oldFunc;
});
QUnit.test("Radiogroup/dropdown showCommentArea validation", (assert) => {
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
  assert.equal(q1.validate(), true, "q1 validation, #1");
  assert.equal(q2.validate(), true, "q1 validation, #1");
  q1.value = 1;
  q2.value = 1;
  assert.equal(q1.validate(), false, "q1 validation, #2");
  assert.equal(q2.validate(), false, "q2 validation, #2");
  q1.setCommentValue(q1.choices[0], "test comment");
  q2.setCommentValue(q1.choices[0], "test comment");
  assert.equal(q1.validate(), true, "q1 validation, #3");
  assert.equal(q2.validate(), true, "q2 validation, #3");
  q1.value = 2;
  q2.value = 2;
  assert.equal(q1.validate(), true, "q1 validation, #4");
  assert.equal(q2.validate(), true, "q2 validation, #4");
  q1.value = 3;
  q2.value = 3;
  assert.equal(q1.validate(), true, "q1 validation, #5");
  assert.equal(q2.validate(), true, "q2 validation, #5");
  q1.setCommentValue(q1.choices[2], "test comment");
  q2.setCommentValue(q1.choices[2], "test comment");
  assert.equal(q1.validate(), true, "q1 validation, #6");
  assert.equal(q2.validate(), true, "q2 validation, #6");
  assert.notOk(q1.otherValue, "q1 otherValue, #6");
  assert.notOk(q2.otherValue, "q2 otherValue, #6");
  q1.renderedValue = "other";
  q2.renderedValue = "other";
  assert.notOk(q1.otherValue, "q1 otherValue, #7");
  assert.notOk(q2.otherValue, "q2 otherValue, #7");
  assert.equal(q1.validate(), false, "q1 validation, #7");
  assert.equal(q2.validate(), false, "q2 validation, #7");
  q1.otherValue = "test comment";
  q2.otherValue = "test comment";
  assert.equal(q1.validate(), true, "q1 validation, #8");
  assert.equal(q2.validate(), true, "q2 validation, #8");
});
QUnit.test("Checkbox showCommentArea validation", (assert) => {
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
  assert.equal(q1.validate(), true, "q1 validation, #1");
  q1.clickItemHandler(q1.choices[0], true);
  assert.equal(q1.validate(), false, "q1 validation, #2");
  q1.setCommentValue(q1.choices[0], "test comment");
  assert.equal(q1.validate(), true, "q1 validation, #3");
  q1.clickItemHandler(q1.choices[1], true);
  assert.equal(q1.validate(), true, "q1 validation, #4");
  q1.clickItemHandler(q1.choices[2], true);
  assert.equal(q1.validate(), true, "q1 validation, #5");
  q1.setCommentValue(q1.choices[2], "test comment");
  assert.equal(q1.validate(), true, "q1 validation, #6");
  q1.clickItemHandler(q1.otherItem, true);
  assert.equal(q1.validate(), false, "q1 validation, #7");
  q1.setCommentValue(q1.otherItem, "test comment");
  assert.equal(q1.validate(), true, "q1 validation, #8");
});
QUnit.test("Radiogroup/dropdown showCommentArea supportAutoAdvance", (assert) => {
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
  assert.equal(q1.supportAutoAdvance(), true, "q1 supportAutoAdvance, #1");
  assert.equal(q2.supportAutoAdvance(), true, "q2 supportAutoAdvance, #1");
  q1.value = 1;
  q2.value = 1;
  q1.onMouseDown();
  assert.equal(q1.supportAutoAdvance(), false, "q1 supportAutoAdvance, #2");
  assert.equal(q2.supportAutoAdvance(), false, "q2 supportAutoAdvance, #2");
  q1.value = 2;
  q2.value = 2;
  q1.onMouseDown();
  assert.equal(q1.supportAutoAdvance(), true, "q1 supportAutoAdvance, #3");
  assert.equal(q2.supportAutoAdvance(), true, "q2 supportAutoAdvance, #3");
  q1.value = "other";
  q2.value = "other";
  q1.onMouseDown();
  assert.equal(q1.supportAutoAdvance(), false, "q1 supportAutoAdvance, #4");
  assert.equal(q2.supportAutoAdvance(), false, "q2 supportAutoAdvance, #4");
});
QUnit.test("checkbox/radiogroup showCommentArea & isCommentRequired", (assert) => {
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
  assert.equal(q1.renderedValue, 1, "q1 renderedValue, #1");
  q2.renderedValue = [1, 2];
  assert.equal(q1.validate(), false, "q1 validate, #1");
  assert.equal(q2.validate(), false, "q2 validate, #1");
  q1.renderedValue = 3;
  q2.renderedValue = [2, 3];
  assert.equal(q1.validate(), true, "q1 validate, #2");
  assert.equal(q2.validate(), true, "q2 validate, #2");
  q2.setCommentValue(q2.choices[2], "");
  assert.deepEqual(q2.value, [{ value: 2 }, { value: 3 }], "q2.value #1");
  q1.setCommentValue(q2.choices[2], "test comment1");
  q2.setCommentValue(q2.choices[2], "test comment2");
  assert.equal(q2.validate(), true, "q2 validate, #3");
  assert.deepEqual(q1.value, { value: 3, comment: "test comment1" }, "q1.value #2");
  assert.deepEqual(q2.value, [{ value: 2 }, { value: 3, comment: "test comment2" }], "q2.value #2");
});
QUnit.test("radiogroup showCommentArea & renderedValue/value", (assert) => {
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
  assert.equal(q1.renderedValue, 1, "q1.renderedValue #1");
  q1.setCommentValue(q1.choices[0], "test comment1");
  assert.equal(q1.renderedValue, 1, "q1.renderedValue #2");
  assert.deepEqual(q1.value, { value: 1, comment: "test comment1" }, "q1.value #2");
  q1.renderedValue = 3;
  assert.equal(q1.value, 3, "q1.value #3");
  q1.value = { value: 1, comment: "test comment2" };
  assert.equal(q1.renderedValue, 1, "q1.renderedValue #3");
  assert.equal(q1.getCommentValue(q1.choices[0]), "test comment2", "q1.getCommentValue #4");
});
QUnit.test("isCommentRequired serialization", (assert) => {
  const q = new QuestionRadiogroupModel("q1");
  q.choices = [{ value: 1 }];
  const choice = q.choices[0];
  assert.equal(choice.isCommentRequired, false, "isCommentRequired is false by default");
  assert.equal(choice.toJSON().isCommentRequired, undefined, "isCommentRequired is undefined by default in JSON");
  choice.isCommentRequired = true;
  assert.equal(choice.toJSON().isCommentRequired, true, "isCommentRequired is true after setting it");
});
QUnit.test("commentPlaceholder serialization", (assert) => {
  const survey = new SurveyModel({
    elements: [{ name: "q1", type: "radiogroup", choices: [1] }] });
  const q = survey.getQuestionByName("q1");
  assert.deepEqual(q.toJSON(), { name: "q1", choices: [1] }, "serialization without commentPlaceholder");
  q.choices[0].commentPlaceholder = "val1";
  assert.equal(q.choices[0].locCommentPlaceholder.text, "val1", "locCommentPlaceholder.text is set");
  assert.deepEqual(q.toJSON(), { name: "q1", choices: [{ value: 1, commentPlaceholder: "val1" }] }, "serialization vs commentPlaceholder");
  q.fromJSON({ name: "q1", type: "radiogroup", choices: [{ value: 1, commentPlaceholder: { default: "en-val", de: "de-val" } }] });
  assert.equal(q.choices[0].locCommentPlaceholder.text, "en-val", "locCommentPlaceholder.text for locale 'default'");
  survey.locale = "de";
  assert.equal(q.choices[0].locCommentPlaceholder.text, "de-val", "locCommentPlaceholder.text for locale 'de'");
  survey.locale = "fr";
  assert.equal(q.choices[0].locCommentPlaceholder.text, "en-val", "locCommentPlaceholder.text for locale 'fr #1'");
  q.choices[0].locCommentPlaceholder.text = "fr-val";
  assert.equal(q.choices[0].locCommentPlaceholder.text, "fr-val", "locCommentPlaceholder.text for locale 'fr #2'");
  assert.deepEqual(q.toJSON(), { name: "q1", choices: [{ value: 1, commentPlaceholder: { "default": "en-val", "de": "de-val", fr: "fr-val" } }] }, "serialization vs commentPlaceholder&locales");
  q.choices[0].locCommentPlaceholder.clear();
  assert.deepEqual(q.toJSON(), { name: "q1", choices: [1] }, "serialization without commentPlaceholder #2");
});
QUnit.test("checbox question and choices has comment - custom placeholder", (assert) => {
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
  assert.equal(q1.choices[1].commentPlaceholder, "Please add comment", "commentPlaceholder for choices[1], #1");
  const textArea1 = q1.getCommentTextAreaModel(q1.choices[0]);
  const textArea2 = q1.getCommentTextAreaModel(q1.choices[1]);
  assert.equal(textArea1.placeholder, "Some comment for Item 1", "textArea1 placeholder");
  assert.equal(textArea2.placeholder, "Please add comment", "textArea2 placeholders");
});
QUnit.test("checbox question and choices has comment - default value", (assert) => {
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
  assert.deepEqual(q1.renderedValue, [1, 2], "q1.renderedValue");
  assert.equal(q1.getCommentValue(q1.choices[0]), "abc", "getCommentValue for choices[0], #1");
  assert.equal(q1.getCommentValue(q1.choices[1]), "edf", "getCommentValue for choices[1], #1");
});
QUnit.test("checbox question and choices has comment - set value", (assert) => {
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
  assert.deepEqual(q1.renderedValue, [1, 2], "q1.renderedValue");
  assert.equal(q1.getCommentValue(q1.choices[0]), "abc", "getCommentValue for choices[0], #1");
  assert.equal(q1.getCommentValue(q1.choices[1]), "edf", "getCommentValue for choices[1], #1");
});
QUnit.test("radiogroup question and choices has comment - default value", (assert) => {
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
  assert.deepEqual(q1.renderedValue, 1, "q1.renderedValue");
  assert.equal(q1.getCommentValue(q1.choices[0]), "abc", "getCommentValue for choices[0], #1");
});
QUnit.test("checkbox vs dataItems and isExclusive, Bug10002", (assert) => {
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
  assert.equal(q.dataChoices.length, 4, "dataChoices length");
  assert.equal(q.dataChoices[2].value, "none2", "none2 is here");
});
QUnit.test("radiogroup question showOtherItem - lost focus on empty", (assert) => {
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
  assert.equal(textArea.getTextValue(), "", "text area is empty #1");
  const event: any = { target: { value: "" } };
  textArea.onTextAreaBlur(event);
  assert.strictEqual(event.target.value, "", "event.target.value is empty");
  assert.equal(textArea.getTextValue(), "", "text area is empty #2");
});
QUnit.test("showOtherItem & textUpdateMode = 'onTyping' , Bug#10402", (assert) => {
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
  assert.equal(q1.otherValue, "abc ", "q1.otherValue #1");
  assert.equal(survey.getComment("q1"), "abc ", "survey.data #1");
  q1.getCommentTextAreaModel(q1.otherItem).onTextAreaChange({ target: { value: "abc xy " } });
  assert.equal(q1.otherValue, "abc xy", "q1.otherValue #2");
});
QUnit.test("radiogroup & checkbox questions and choices has comment - display value, Bug#10193", (assert) => {
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
  assert.equal(q1.displayValue, "Item 1", "q1.displayValue, #1");
  assert.equal(q2.displayValue, "Item 1", "q2.displayValue, #2");
});
QUnit.test("checkbox choices vs showComment & isExclusive - display value, Bug#10236", (assert) => {
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
  assert.deepEqual(q1.renderedValue, ["item1"], "q1.renderedValue, #1");
  assert.deepEqual(q1.value, [{ value: "item1" }], "q1.value, #1");
  const textArea = q1.getCommentTextAreaModel(q1.choices[0]);
  textArea.onTextAreaBlur({ target: { value: "" } });
  assert.deepEqual(q1.renderedValue, ["item1"], "q1.renderedValue, #2");
  assert.deepEqual(q1.value, [{ value: "item1" }], "q1.value, #2");
  textArea.onTextAreaBlur({ target: { value: "abc" } });
  assert.deepEqual(q1.renderedValue, ["item1"], "q1.renderedValue, #3");
  assert.deepEqual(q1.value, [{ value: "item1", comment: "abc" }], "q1.value, #3");
});
QUnit.test("checkbox choices vs showComment & selection, Bug#10243", (assert) => {
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
  assert.deepEqual(q1.value, [{ value: "item1", comment: "abc" }, "item2"], "q1.value, #1");
  assert.deepEqual(q1.renderedValue, ["item1", "item2"], "q1.renderedValue, #1");
  assert.equal(q1.getCommentTextAreaModel(q1.choices[0]).getTextValue(), "abc", "comment text area value, #1");
});
QUnit.test("radiogroup choices vs showComment & showOther & question showComment , Bug#10272", (assert) => {
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
  assert.equal(q1.value, "abc", "q1.value #1");
  assert.equal(q1.comment, "edf", "q1.comment #1");
  q1.value = "abc2";
  assert.equal(q1.value, "abc2", "q1.value #2");
  assert.equal(q1.comment, "edf", "q1.comment #2");
  assert.deepEqual(survey.data, { q1: "abc2", "q1-Comment": "edf" }, "survey.data #1");
  q1.clickItemHandler(q1.choices[0]);
  q1.getCommentTextAreaModel(q1.choices[0]).onTextAreaBlur({ target: { value: "xyz" } });
  assert.deepEqual(q1.value, { value: "item1", comment: "xyz" }, "q1.value #3");
  assert.equal(q1.comment, "edf", "q1.comment #3");
  assert.deepEqual(survey.data, { q1: { value: "item1", comment: "xyz" }, "q1-Comment": "edf" }, "survey.data #2");
});
QUnit.test("getComment function, Issue#10378", (assert) => {
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
  assert.equal(survey.getValue("exp1"), "comment1_1", "q1, item1");
  assert.equal(survey.getValue("exp2"), "comment1_2", "q1, item2");
  assert.equal(survey.getValue("exp3"), null, "q1, item3");
  assert.equal(survey.getValue("exp4"), null, "q1, item4");
  assert.equal(survey.getValue("exp5"), null, "q1, other");
  assert.equal(survey.getValue("exp6"), null, "q2, item1");
  assert.equal(survey.getValue("exp7"), null, "q2, item4");
  assert.equal(survey.getValue("exp8"), "comment2", "q2, other");
  assert.equal(survey.getValue("exp9"), "comment3", "q3, comment");
  assert.equal(survey.getValue("exp10"), null, "q4, other");
});
QUnit.test("choice item & elements , Issue#10384", (assert) => {
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
  assert.equal(item1.hasElements, false, "There is no elements in item1");
  assert.notOk(item1["panelValue"], "item1, panelValue is null");
  const item2 = q1.choices[1];
  assert.equal(item2.hasElements, true, "There are elements in item2");
  assert.ok(item2["panelValue"], "item2, panelValue is not null");
  assert.equal(item2.panel.getSurvey().title, "ttt", "item2, panel.survey is not null");
  assert.equal(item2.panel.elements.length, 1, "item2, panel has one element");
  assert.equal(item2.panel.elements[0].name, "q1_1", "item2, panel has element q1_1");
  assert.equal(item2.panel.elements[0].survey?.title, "ttt", "item2, panel has element q1_1 with survey");
  assert.equal(item2.panel.elements[0].parent.getType(), "panel", "item2, panel has element q1_1 of parent panel");
  const item3 = q1.choices[2];
  item3.panel.addNewQuestion("text", "q1_3");
  assert.ok(item3.panel.getSurvey(), "item3, panel.survey is not null");
  assert.deepEqual(q1.toJSON(), { name: "q1", choices: [
    "item1",
    { value: "item2", elements: [{ type: "text", name: "q1_1" }] },
    { value: "item3", elements: [{ type: "text", name: "q1_3" }] }
  ] }, "toJSON is correct");
  assert.notOk(item1["panelValue"], "item1, panelValue is null after serialization");
});
QUnit.test("choice item & supportElements , Issue#10384", (assert) => {
  const q1 = new QuestionCheckboxModel("q1");
  q1.choices = ["item1"];
  assert.equal(q1.choices[0].supportElements, true, "checkbox: item supportElements");
  const q2 = new QuestionRadiogroupModel("q2");
  q2.choices = ["item1"];
  assert.equal(q2.choices[0].supportElements, true, "radiogroup: item1 supportElements");
  const q3 = new QuestionDropdownModel("q3");
  q3.choices = ["item1"];
  assert.equal(q3.choices[0].supportElements, false, "dropdown: item supportElements");
});
QUnit.test("choice item & isPanelShowing, Issue#10384", (assert) => {
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
  assert.equal(item1.isPanelShowing, false, "item1: isPanelShowing false");
  assert.equal(item2.isPanelShowing, false, "item2: isPanelShowing false");
  assert.equal(item3.isPanelShowing, false, "item3: isPanelShowing false");
  q1.clickItemHandler(item1, true);
  assert.equal(item1.isPanelShowing, false, "item1: isPanelShowing false #2");
  assert.equal(item2.isPanelShowing, false, "item2: isPanelShowing false #2");
  q1.clickItemHandler(item2, true);
  assert.equal(item1.isPanelShowing, false, "item1: isPanelShowing false #3");
  assert.equal(item2.isPanelShowing, true, "item2: isPanelShowing true #1");
  q1.clickItemHandler(item2, false);
  assert.equal(item1.isPanelShowing, false, "item1: isPanelShowing false #5");
});

QUnit.test("choice item elements & getAllQuestions, Issue#10384", (assert) => {
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
  assert.equal(qs.length, 2, "There are two questions: q1 and q1_1, #1");
  assert.equal(qs[0].name, "q1", "the first question is q1");
  assert.equal(qs[1].name, "q1_1", "the second question is q1_1");
  survey.setDesignMode(true);
  qs = survey.getAllQuestions(false, true, true);
  assert.equal(qs.length, 2, "There are two questions: q1 and q1_1, #2");
  survey.setDesignMode(false);
  qs = survey.getAllQuestions(true, true, true);
  assert.equal(qs.length, 1, "There is one question: q1");
  q1.clickItemHandler(q1.choices[1], true);
  qs = survey.getAllQuestions(true, true, true);
  assert.equal(qs.length, 2, "There are two questions: q1 and q1_1, #3");
});
QUnit.test("choice item elements & getElementsInDesign, Issue#10384", (assert) => {
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
  assert.equal(q1.choices.length, 3, "There are three choices");
  let els = q1.getElementsInDesign(true);
  assert.equal(els.length, 2, "There are two elements: q1, #1");
  assert.equal(els[0].getType(), "panel", "the element is panel, #1");
  els = q1.getElementsInDesign(false);
  assert.equal(els.length, 2, "There are two elements, #2");
  assert.equal(els[0].name, "q1_1", "the element is q1_1, #2");
});
QUnit.test("choice item & elements, survey.onQuestionCreated/Added & getQuestionByName Issue#10384", (assert) => {
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
  assert.equal(q1_1?.name, "q1_1", "getQuestionByName works correctly");
  assert.equal(q1_1?.page.name, "page1", "The question is on the correct page");
  assert.equal(questionCreated.length, 2, "There are two questions created");
  assert.equal(questionCreated[0], "q1", "the first question is q1");
  assert.equal(questionCreated[1], "q1_1", "the second question is q1_1");
  assert.equal(questionAdded.length, 2, "There are two questions added");
  assert.equal(questionAdded[0], "q1", "the first question is q1");
  assert.equal(questionAdded[1], "q1_1", "the second question is q1_1");
});
QUnit.test("choice item elements & item.panel.visibleRows, Issue#10384", (assert) => {
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
  assert.equal(panel1.wasRendered, false, "the panel was not rendered");
  q1.clickItemHandler(q1.choices[0], true);
  assert.equal(panel1.wasRendered, true, "the panel was rendered");
  assert.equal(panel1.visibleRows.length, 1, "There is one visible row");
  assert.equal(panel1.visibleRows[0].elements.length, 1, "There is one element in the visible row");
  const panel2 = q1.choices[1].panel;
  assert.equal(panel2.visibleRows.length, 0, "There is no visible row in the panel2");
  assert.equal(panel2.wasRendered, false, "the panel2 was not rendered");
  q1.clickItemHandler(q1.choices[1], true);
  assert.equal(panel2.wasRendered, true, "the panel2 was rendered");
  assert.equal(panel2.visibleRows.length, 1, "There is one visible row in the panel2");
  assert.equal(panel2.visibleRows[0].elements.length, 1, "There is one element in the visible row in the panel2");
});
QUnit.test("choice item elements & getElementByName, Issue#10384", (assert) => {
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
  assert.equal(panel1.getElementByName("q1_1")?.name, "q1_1", "getElementByName works correctly");
  const page = survey.pages[0];
  assert.equal(page.getElementByName("q1_1")?.name, "q1_1", "page.getElementByName works correctly");
  const name = "choicePanel" + panel1.uniqueId;
  assert.equal(panel1.name, name, "panel1.name is correct");
  assert.equal(page.getElementByName(name)?.name, name, "page.getElementByName works correctly for panel1");
});
QUnit.test("choice item elements & nested elements, Issue#10384", (assert) => {
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
  assert.equal(panel2.wasRendered, false, "the panel2 was not rendered");
  q1.clickItemHandler(q1.choices[1], true);
  assert.equal(panel2.wasRendered, true, "the panel2 was rendered");
  const q1_2 = panel2.getQuestionByName("q1_2");
  assert.ok(q1_2, "q1_2 is here");
  assert.equal(q1_2.getType(), "checkbox", "q1_2 is a checkbox");
  assert.equal(q1_2.choices.length, 2, "q1_2 has two choices");
  assert.equal(q1_2.visibleChoices.length, 2, "q1_2 has two visible choices");
  assert.equal(q1_2.renderedChoices.length, 2, "q1_2 has two rendered choices");
  assert.equal(q1_2.wasRendered, true, "q1_2 was rendered");
});
QUnit.test("choice item elements & validation, Issue#10384", (assert) => {
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
  assert.equal(q1.validate(true), true, "q1 is valid, #1");
  q1.clickItemHandler(q1.choices[0], true);
  assert.equal(q1.validate(true), false, "q1 is not valid, q1_1 is required, #2");
  assert.equal(q1_1.errors.length, 1, "q1_1 errors #2");
  assert.equal(q1_2.errors.length, 0, "q1_2 errors #2");
  q1_1.value = "abc";
  assert.equal(q1.validate(true), true, "q1 is valid, #3");
  assert.equal(q1_1.errors.length, 0, "q1_1 errors #3");
  q1.clickItemHandler(q1.choices[1], true);
  assert.equal(q1.validate(true), false, "q1 is not valid, q1_2 is required, #4");
  assert.equal(q1_1.errors.length, 0, "q1_1 errors #4");
  assert.equal(q1_2.errors.length, 1, "q1_2 errors #4");
  q1_2.value = "edf";
  assert.equal(q1.validate(true), true, "q1 is valid, #5");
  assert.equal(q1_2.errors.length, 0, "q1_2 errors #5");
});
QUnit.test("choice item elements & validation, Issue#10384", (assert) => {
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
  assert.equal(q1_2.isVisible, false, "q1_2 visibility, #1");
  assert.equal(q1_4.isVisible, false, "q1_4 visibility, #1");
  q1_1.value = "abc";
  assert.equal(q1_2.isVisible, true, "q1_2 visibility, #2");
  q1_2.value = "edf";
  assert.equal(q1_4.isVisible, false, "q1_4 visibility, #2");
  survey.setValue("q2", "xyz");
  assert.equal(q1_4.isVisible, true, "q1_4 visibility, #3");
});
QUnit.test("choice item elements & localization, Issue#10384", (assert) => {
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
  assert.deepEqual(survey.getUsedLocales(), ["en", "de"], "There is one non-default locale");
  const q1_1 = survey.getQuestionByName("q1_1");
  const q1_2 = survey.getQuestionByName("q1_2");
  const q1_2_1 = survey.getQuestionByName("q1_2_1");
  q1.clickItemHandler(q1.choices[0], true);
  survey.locale = "de";
  assert.equal(q1_1.locTitle.textOrHtml, "q1_1_t_de", "q1_1 title in de, #1");
  assert.equal(q1_2.locTitle.textOrHtml, "q1_2_t_de", "q1_2 title in de, #1");
  assert.equal(q1_2_1.locTitle.textOrHtml, "q1_2_1_t_de", "q1_2_1 title in de, #1");
  q1.clickItemHandler(q1.choices[1], true);
  assert.equal(q1_1.locTitle.textOrHtml, "q1_1_t_de", "q1_1 title in de, #2");
  assert.equal(q1_2.locTitle.textOrHtml, "q1_2_t_de", "q1_2 title in de, #2");
  q1_2.clickItemHandler(q1_2.choices[0], true);
  assert.equal(q1_2_1.locTitle.textOrHtml, "q1_2_1_t_de", "q1_2_1 title in de, #2");
  survey.locale = "";
  assert.equal(q1_1.locTitle.textOrHtml, "q1_1_t", "q1_1 title in default locale");
  assert.equal(q1_2.locTitle.textOrHtml, "q1_2_t", "q1_2 title in default locale");
});
QUnit.test("choice item elements & nested/withFrame styles, Issue#10384", (assert) => {
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
  assert.equal(panel1.cssClasses.panel.nested, "p-nested", "panel nested class is here");
  assert.equal(panel1.cssClasses.panel.withFrame, "p-frame", "panel withFrame class is here");
  const panelCss = panel1.getContainerCss();
  assert.equal(panelCss.indexOf("p-frame") > -1, false, "panelCss has p-frame, #1");
  assert.equal(panelCss.indexOf("p-nested") > -1, true, "panelCss has p-nested, #1");

  assert.equal(q1_1.cssClasses.nested, "q-nested", "question nested class is here");
  assert.equal(q1_1.cssClasses.withFrame, "q-frame", "question withFrame class is here");
  const q1_1Css = q1_1.getRootCss();
  assert.equal(q1_1Css.indexOf("q-frame") > -1, false, "q1_1Css has q-frame, #1");
  assert.equal(q1_1Css.indexOf("q-nested") > -1, true, "q1_1Css has q-nested, #1");
});
QUnit.test("choice item & clearInvisible values, Issue#10384", (assert) => {
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
  assert.equal(q1_1.value, "abc", "q1_1 value is set");
  assert.equal(q1_2.value, "edf", "q1_2 value is set");
  assert.equal(q1_1.value, "abc", "q1_1 value is not cleared by default");
  assert.deepEqual(survey.data, { q1: ["item2"], "q1_1": "abc", "q1_2": "edf" }, "survey.data #1");
  survey.doComplete();
  assert.notOk(q1_1.value, "q1_1 value is cleared");
  assert.equal(q1_2.value, "edf", "q1_2 value is not cleared");
  assert.deepEqual(survey.data, { q1: ["item2"], "q1_2": "edf" }, "survey.data #2");
});
QUnit.test("choice item elements & clearInvisible values in nested panels, Issue#10384", (assert) => {
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
  assert.deepEqual(survey.data, {}, "survey.data is empty");
});
QUnit.test("choice item elements  vs nested panels & clearInvisible is 'onHiddenContainer', Issue#10530", (assert) => {
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
  assert.deepEqual(survey.data, {}, "survey.data is empty");
});
QUnit.test("choice item & dispose, Issue#10384", (assert) => {
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
  assert.ok(item1.isPanelCreated, "item1 panel is here");
  assert.ok(item2.isPanelCreated, "item2 panel is here");
  assert.notOk(item3.isPanelCreated, "item3 panel is not here");
  q1.dispose();
  assert.equal(item1.panel.isDisposed, true, "item1 panel is disposed");
  assert.equal(item2.panel.isDisposed, true, "item2 panel is disposed");
  assert.notOk(item3.isPanelCreated, "item3 panel is not here");
});
QUnit.test("choice item elements & survey.data, Issue#10384, Bug#10506", (assert) => {
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
  assert.deepEqual(q1.value, ["item1", "item2"], "q1.value is correct");
  assert.equal(q2.value, "item1", "q2.value is correct");
  assert.equal(q2_1.value, "abc", "q2_1.value is correct");
  assert.equal(q1_2.value, "edf", "q1_2.value is correct");
  const panel1 = q1.choices[0].panel;
  assert.equal(panel1.wasRendered, true, "panel1 is was rendered");
  assert.equal(panel1.rows.length, 1, "panel1 has one row");
  const panel2 = q2.choices[0].panel;
  assert.equal(panel2.wasRendered, true, "panel2 is was rendered");
  assert.equal(panel2.rows.length, 1, "panel2 has one row");
});
QUnit.test("choice item elements & defaultValue, Issue#10506", (assert) => {
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
  assert.deepEqual(q1.value, ["item1", "item2"], "q1.value is correct");
  assert.equal(q2.value, "item1", "q2.value is correct");
  assert.equal(q2_1.value, "abc", "q2_1.value is correct");
  assert.equal(q1_2.value, "edf", "q1_2.value is correct");
  const panel1 = q1.choices[0].panel;
  assert.equal(panel1.wasRendered, true, "panel1 is was rendered");
  assert.equal(panel1.rows.length, 1, "panel1 has one row");
  const panel2 = q2.choices[0].panel;
  assert.equal(panel2.wasRendered, true, "panel2 is was rendered");
  assert.equal(panel2.rows.length, 1, "panel2 has one row");
});
QUnit.test("choice item elements & item.expandPanelAtDesign, Issue#10384", (assert) => {
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
  assert.equal(counter, 1, "onExpandPanelAtDesign should be called once");
  choiceItem.onExpandPanelAtDesign.fire(choiceItem, {});
  assert.equal(counter, 2, "onExpandPanelAtDesign should be called twice");
});
