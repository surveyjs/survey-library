import { Survey } from "../../src/knockout/kosurvey";
import { QuestionText } from "../../src/knockout/koquestion_text";
import { QuestionDropdown } from "../../src/knockout/koquestion_dropdown";
import { QuestionCheckbox } from "../../src/knockout/koquestion_checkbox";
import { QuestionRadiogroup } from "../../src/knockout/koquestion_radiogroup";
import { Question } from "../../src/question";
import { QuestionMatrix } from "../../src/knockout/koquestion_matrix";
import { QuestionMatrixDropdown } from "../../src/knockout/koquestion_matrixdropdown";
import { QuestionPanelDynamic } from "../../src/knockout/koquestion_paneldynamic";
import { MatrixDropdownColumn } from "../../src/question_matrixdropdowncolumn";
import { QuestionMultipleText, MultipleTextItem } from "../../src/knockout/koquestion_multipletext";
import { Page, Panel, QuestionRow } from "../../src/knockout/kopage";
import { CustomWidgetCollection } from "../../src/questionCustomWidgets";
import { koTemplate } from "../../src/knockout/templateText";
import { QuestionMatrixDynamic } from "../../src/knockout/koquestion_matrixdynamic";
import { surveyLocalization } from "../../src/surveyStrings";
import { QuestionRating } from "../../src/knockout/koquestion_rating";
import { QuestionImagePicker } from "../../src/knockout/koquestion_imagepicker";
import { ImageItemValue } from "../../src/question_imagepicker";
import { ProgressButtonsViewModel } from "../../src/knockout/components/progress/buttons";
import { JsonObject, Serializer } from "../../src/jsonobject";
import { SurveyTimer } from "../../src/surveytimer";
import { QuestionBoolean } from "../../src/knockout/koquestion_boolean";
import * as ko from "knockout";
import { ItemValue } from "../../src/itemvalue";
import { StylesManager } from "../../src/stylesmanager";
import { settings } from "../../src/settings";
import { ProgressButtons } from "../../src/progress-buttons";

export default QUnit.module("koTests");

settings.autoAdvanceDelay = 0;

QUnit.test("koOtherVisible for one choice items", function (assert) {
  var survey = new Survey();
  var question = new QuestionCheckbox("q");
  question.hasOther = true;
  question.setSurveyImpl(survey);
  assert.equal(question.isOtherSelected, false, "Initially is not visible");
  question.value = question.otherItem.value;
  assert.equal(
    question.isOtherSelected,
    true,
    "Other visible is true after selecting it"
  );
});
QUnit.test("Create koValue as observable array for checkbox", function (assert) {
  var question = new QuestionCheckbox("q");
  question.koValue.push("test1");
  question.koValue.push("test2");
  assert.deepEqual(
    question.koValue(),
    ["test1", "test2"],
    "koValue is observable array"
  );
  assert.deepEqual(
    question.value,
    ["test1", "test2"],
    "value is set correctly."
  );
});
QUnit.test("Default value for checkbox", function (assert) {
  var survey = new Survey();
  survey.addNewPage("p1");
  var question = new QuestionCheckbox("q");
  survey.pages[0].addQuestion(question);
  assert.deepEqual(
    question.value,
    [],
    "the koValue by default should be empty array"
  );
});
QUnit.test("koOtherVisible for multi choice items", function (assert) {
  var survey = new Survey();
  var question = new QuestionCheckbox("q");
  question.hasOther = true;
  question.setSurveyImpl(survey);
  assert.equal(question.isOtherSelected, false, "Initially is not visible");
  question.koValue.push("test1");
  question.koValue.push(question.otherItem.value);
  assert.equal(
    question.isOtherSelected,
    true,
    "Other visible is true after selecting it"
  );
  question.koValue.pop();
  assert.equal(
    question.isOtherSelected,
    false,
    "Other visible is true after selecting it"
  );
});
QUnit.test(
  "Update koValue on changing data in Survey or Question.value ",
  function (assert) {
    var survey = new Survey();
    survey.setValue("textQuestion", "initialValue");
    var page = survey.addNewPage("my page");
    var question = <Question>page.addNewQuestion("text", "textQuestion");
    assert.equal(question.value, "initialValue", "get initial value");
    question.value = "setFromValue";
    assert.equal(question.value, "setFromValue", "set from question value");
    survey.setValue("textQuestion", "setFromSurvey");
    assert.equal(question.value, "setFromSurvey", "set from survey");
  }
);
QUnit.test(
  "Update koValue on changing data in Survey or Question.value for Multiple Answer Question ",
  function (assert) {
    var survey = new Survey();
    survey.setValue("checkboxQuestion", "initialValue");
    var page = survey.addNewPage("my page");
    var question = <Question>(
      page.addNewQuestion("checkbox", "checkboxQuestion")
    );
    assert.deepEqual(question.value, ["initialValue"], "get initial value");
    question.value = "setFromValue";
    assert.deepEqual(
      question.value,
      ["setFromValue"],
      "set from question value"
    );
    survey.setValue("checkboxQuestion", "setFromSurvey");
    assert.deepEqual(question.value, ["setFromSurvey"], "set from survey");
  }
);
QUnit.test("Question Matrix: koValue in MatrixValue", function (assert) {
  var matrix = new QuestionMatrix("q1");
  matrix.rows = ["row1", "row2"];
  matrix.columns = ["col1", "col2"];
  matrix.value = { row1: "col2" };
  var visibleRows = matrix.visibleRows;
  assert.equal(visibleRows[0].value, "col2", "set the correct value");
  visibleRows[0].value = "col1";
  visibleRows[1].value = "col2";
  assert.deepEqual(
    matrix.value,
    { row1: "col1", row2: "col2" },
    "the matrix value changed correctly"
  );
});
QUnit.test("Question Matrix: update koVisibleColumns on assign", function (
  assert
) {
  var matrix = new QuestionMatrix("q1");
  matrix.rows = ["row1", "row2"];
  matrix.columns = ["col1", "col2"];
  assert.equal(matrix.koVisibleColumns().length, 2, "initial columns");
  matrix.columns = ["col1", "col2", "col3"];
  assert.equal(matrix.koVisibleColumns().length, 3, "new columns");
  assert.equal(
    matrix.koVisibleColumns()[2].value,
    "col3",
    "new column value ok"
  );
});
QUnit.test(
  "Question Matrix: change matrix value after visibleRows generation",
  function (assert) {
    var matrix = new QuestionMatrix("q1");
    matrix.rows = ["row1", "row2"];
    matrix.columns = ["col1", "col2"];
    var visibleRows = matrix.visibleRows;
    matrix.value = { row1: "col2" };
    assert.equal(visibleRows[0].value, "col2", "set the correct value");
    assert.equal(
      matrix.koVisibleRows()[0].value,
      "col2",
      "set the correct value in ko"
    );
  }
);

QUnit.test(
  "Question Matrix: columnsVisibleIf, rowsVisibleIf, Bug #2012",
  function (assert) {
    var survey = new Survey();
    var page = survey.addNewPage("page1");
    var matrix = new QuestionMatrix("q1");
    matrix.rows = ["row1", "row2", "row3"];
    matrix.columns = ["col1", "col2", "col3"];
    matrix.rowsVisibleIf = "{rowValue} contains {item}";
    matrix.columnsVisibleIf = "{colValue} contains {item}";
    page.addQuestion(matrix);
    assert.equal(
      matrix.koVisibleColumns().length,
      0,
      "There is no visible columns initially"
    );
    assert.equal(
      matrix.koVisibleRows().length,
      0,
      "There is no visible rows initially"
    );
    survey.setValue("rowValue", ["row1"]);
    assert.equal(
      matrix.koVisibleColumns().length,
      0,
      "rowValue: 'row1', colValue: '', visibleColumns"
    );
    assert.equal(
      matrix.koVisibleRows().length,
      1,
      "rowValue: 'row1', colValue: '', visibleRows"
    );
    survey.setValue("colValue", ["col1"]);
    assert.equal(
      matrix.koVisibleColumns().length,
      1,
      "rowValue: 'row1', colValue: 'col1', visibleColumns"
    );
    assert.equal(
      matrix.koVisibleRows().length,
      1,
      "rowValue: 'row1', colValue: 'col1', visibleRows"
    );
  }
);

QUnit.test(
  "Question MatrixDropdown: change matrix value after visibleRows generation",
  function (assert) {
    var matrix = new QuestionMatrixDropdown("q1");
    matrix.rows = ["row1", "row2", "row3"];
    matrix.columns.push(new MatrixDropdownColumn("column1"));
    matrix.columns.push(new MatrixDropdownColumn("column2"));
    matrix.choices = [1, 2, 3];
    matrix.columns[1]["choices"] = [4, 5];
    var visibleRows = matrix.visibleRows;
    matrix.value = { row2: { column1: 2 } };
    assert.equal(visibleRows[1].cells[0].question.value, 2, "value was set");
  }
);

QUnit.test("Matrixdynamic checkbox column does not work, Bug#1031", function (
  assert
) {
  var survey = new Survey({
    questions: [
      {
        type: "matrixdynamic",
        name: "q1",
        columns: [
          {
            name: "col1",
            cellType: "checkbox",
            colCount: 1,
            choices: ["1", "2", "3"],
          },
        ],
        rowCount: 1,
      },
    ],
  });
  var question: QuestionMatrixDynamic = <any>survey.getQuestionByName("q1");
  var rows = question.visibleRows;
  rows[0].cells[0].question.koValue(["1"]);
  rows[0].cells[0].question.koValue(["1", "2"]);
  assert.deepEqual(
    survey.data,
    { q1: [{ col1: ["1", "2"] }] },
    "The value set correctly"
  );
});

QUnit.test("Question MultipleText: koValue in TextItem", function (assert) {
  var mQuestion = new QuestionMultipleText("q1");
  mQuestion.items.push(new MultipleTextItem("i1"));
  mQuestion.items.push(new MultipleTextItem("i2"));
  mQuestion.value = { i1: 10 };
  assert.equal(
    mQuestion.items[0].value,
    10,
    "set the correct value to item.koValue from question"
  );
  mQuestion.items[0].value = 20;
  assert.equal(
    mQuestion.items[0].value,
    20,
    "set the correct value to item.koValue from question item"
  );
  assert.deepEqual(
    mQuestion.value,
    { i1: 20 },
    "set the correct value to question.Value from question item"
  );
  mQuestion.value = null;
  assert.equal(mQuestion.items[0].value, null, "empty the value");
});
QUnit.test("koElements", function (assert) {
  var survey = new Survey();
  var page = survey.addNewPage("page1");
  page.addNewQuestion("text", "q1");
  page.addNewPanel("panel1");
  assert.equal(page.rows.length, 2, "There are two rows");
  assert.equal(page.rows[0].elements.length, 1, "One element in the first row");
  assert.equal(
    page.rows[1].elements.length,
    1,
    "One element in the second row"
  );
  assert.equal(
    page.rows[0].elements.length,
    1,
    "One element in the first row, ko"
  );
  assert.equal(
    page.rows[1].elements.length,
    1,
    "One element in the second row, ko"
  );
});
QUnit.test("Set notification on setting survey data", function (assert) {
  var survey = new Survey();
  var page = survey.addNewPage("page1");
  var question = page.addNewQuestion("text", "q1");
  question.value = "value1";
  survey.data = { q1: "value2" };
  assert.equal(survey.getValue("q1"), "value2", "survey data for q1");
  assert.equal(question.value, "value2", "knockout value is updated.");
});
QUnit.test("On make survey data empy for Multiple text question", function (
  assert
) {
  var survey = new Survey();
  var page = survey.addNewPage("page1");
  var question = new QuestionMultipleText("q1");
  page.addQuestion(question);
  question.items.push(new MultipleTextItem("i1"));
  question.items.push(new MultipleTextItem("i2"));
  question.value = { i1: 10 };
  survey.data = null;
  assert.equal(question.items[0].value, null, "Make the data empty");
});
QUnit.test("isVisible property", function (assert) {
  var survey = new Survey();
  var page = survey.addNewPage("page1");
  var question = page.addNewQuestion("text", "q1");
  assert.equal(question.isVisible, true, "it is true by default");
  question.visible = false;
  assert.equal(question.isVisible, false, "it is false now");
});
QUnit.test("comment property", function (assert) {
  var survey = new Survey();
  survey.data = { q: "other", "q-Comment": "aaaa" };
  var page = survey.addNewPage("page1");
  var question = new QuestionDropdown("q");
  page.addQuestion(question);
  question.choices = ["A", "B", "C", "D"];
  question.hasOther = true;
  assert.equal(question.comment, "aaaa", "Set ko Comment");
});
QUnit.test("Load title correctly from JSON", function (assert) {
  var survey = new Survey({ questions: [{ type: "text", name: "question1" }] });
  assert.equal(
    survey.pages[0].questions[0]["locTitle"]["koRenderedHtml"](),
    "question1",
    "title is getting from name"
  );
});
QUnit.test("errors should be empty after prevPage bug#151", function (assert) {
  var survey = new Survey();
  survey.goNextPageAutomatic = true;
  var page = survey.addNewPage("page1");
  var question = <QuestionDropdown>page.addNewQuestion("dropdown", "q1");
  question.choices = [1, 2, 3];
  question.isRequired = true;
  page = survey.addNewPage("page2");
  page.addNewQuestion("text", "q2");

  var errorCount = 0;
  ko.computed(() => {
    errorCount = question.errors.length;
  });

  survey.nextPage();
  assert.equal(errorCount, 1, "The question is not filled out.");
  (<Question>survey.pages[0].questions[0]).value = 1;
  assert.equal(errorCount, 0, "The question has not errors");
  assert.equal(survey.currentPage.name, "page2", "Go to the next page");
  survey.prevPage();
  assert.equal(errorCount, 0, "The question has not errors");
});

QUnit.test("add customwidget item", function (assert) {
  CustomWidgetCollection.Instance.clear();
  CustomWidgetCollection.Instance.addCustomWidget({
    name: "first",
    htmlTemplate: "<input type='text' />",
    isFit: (question) => {
      return false;
    },
  });
  assert.equal(
    CustomWidgetCollection.Instance.widgets.length,
    1,
    "one widget is added"
  );
  assert.ok(koTemplate, "ko template is exists");
  assert.ok(koTemplate.indexOf("survey-widget-first") > -1, "text was added");
  CustomWidgetCollection.Instance.clear();
});

QUnit.test("Localization, choices.locText.koRenderedHtml, #349", function (
  assert
) {
  var survey = new Survey();
  var page = survey.addNewPage("page");
  var q1 = <QuestionCheckbox>page.addNewQuestion("checkbox", "q1");
  q1.choices = [{ value: 1, text: { default: "text1", de: "text_de" } }];
  assert.equal(
    q1.visibleChoices[0].text,
    "text1",
    "default locale, text property is 'text1'"
  );
  assert.equal(
    q1.visibleChoices[0].locText["koRenderedHtml"](),
    "text1",
    "default locale, locText.koRenderedHtml() is 'text1'"
  );
  survey.locale = "de";
  assert.equal(
    q1.visibleChoices[0].text,
    "text_de",
    "default locale, text property is 'text_de'"
  );
  assert.equal(
    q1.visibleChoices[0].locText["koRenderedHtml"](),
    "text_de",
    "default locale, locText.koRenderedHtml() is 'text_de'"
  );
  survey.locale = "";
});

QUnit.test("Localization, otherItem", function (assert) {
  var survey = new Survey();
  var page = survey.addNewPage("page");
  var q1 = <QuestionCheckbox>page.addNewQuestion("checkbox", "q1");
  q1.choices = [1, 2];
  q1.hasOther = true;
  var defaultText = q1.visibleChoices[2].locText["koRenderedHtml"]();
  assert.equal(
    q1.visibleChoices[2].locText["koRenderedHtml"](),
    surveyLocalization.getString("otherItemText"),
    "use default locale"
  );
  survey.locale = "de";
  assert.notEqual(
    q1.visibleChoices[2].locText["koRenderedHtml"](),
    defaultText,
    "use another locale locale"
  );
  survey.locale = "";
});

QUnit.test("otherItem, set text, editor: #90", function (assert) {
  var survey = new Survey({
    questions: [
      {
        type: "checkbox",
        name: "q1",
        choices: [1, 2],
        hasOther: true,
        otherText: "my other",
      },
    ],
  });
  var q1 = <QuestionCheckbox>survey.pages[0].questions[0];
  assert.equal(q1.name, "q1", "question load correctly");
  assert.equal(q1.visibleChoices[2].text, "my other", "use otherText");
});

QUnit.test("Update page.title correctly with numbers", function (assert) {
  var survey = new Survey();
  survey.addPage(createPageWithQuestion("page1"));
  survey.addPage(createPageWithQuestion("page2"));
  survey.pages[0].title = "title 1";
  survey.pages[1].title = "title 2";
  survey.showPageNumbers = true;
  survey.currentPageNo = 1;
  assert.equal(
    survey.currentPage.locTitle["koRenderedHtml"](),
    "2. title 2",
    "It shows page as second"
  );
  survey.pages[0].visible = false;
  assert.equal(
    survey.currentPage.locTitle["koRenderedHtml"](),
    "1. title 2",
    "It shows page as first"
  );
});

QUnit.test(
  "Survey display mode should set isReadOnly to true for questions",
  function (assert) {
    var survey = new Survey();
    var page = new Page("page1");
    survey.addPage(page);
    var question = new QuestionText("q1");
    page.addQuestion(question);
    var readOnlyChangedCounter = 0;
    ko.computed(() => {
      var val = question.isReadOnly;
      readOnlyChangedCounter++;
    });
    assert.equal(
      question.isReadOnly,
      false,
      "by default question is not readonly"
    );
    assert.equal(
      readOnlyChangedCounter,
      1,
      "readOnlyChangedCounter - nothing chanhed"
    );
    survey.mode = "display";
    assert.equal(
      question.isReadOnly,
      true,
      "survey in display mode, question is readonly"
    );
    assert.equal(
      readOnlyChangedCounter,
      2,
      "readOnlyChangedCounter - mode changed 1"
    );
    survey.mode = "edit";
    assert.equal(
      question.isReadOnly,
      false,
      "survey in edit mode, question is not readonly"
    );
    assert.equal(
      readOnlyChangedCounter,
      3,
      "readOnlyChangedCounter - mode changed 2"
    );
  }
);

QUnit.test(
  "Matrixdynamic adjust rowCount on setting the survey.data with another locale",
  function (assert) {
    var survey = new Survey();
    survey.addNewPage("p1");
    var question = new QuestionMatrixDynamic("q1");
    question.rowCount = 0;
    question.columns.push(new MatrixDropdownColumn("column1"));
    question.columns.push(new MatrixDropdownColumn("column2"));
    survey.pages[0].addQuestion(question);
    question.visibleRows; // cache visibleRows
    survey.data = { q1: [{}, { column1: 2 }, {}] };
    assert.equal(question.rowCount, 3, "It should be 3 rowCount");
  }
);

QUnit.test("Text preprocessing variable and value. Fix the bug#461", function (
  assert
) {
  var survey = new Survey();
  survey.addNewPage("p1");
  survey.setValue("val1", "");
  survey.setVariable("var1", "");
  var question = new QuestionText("q1");
  survey.pages[0].addQuestion(question);
  assert.equal(survey.currentPage.name, "p1", "The current page is p1");
  question.title = "{var1}{val1}";
  assert.equal(
    question.locTitle["koRenderedHtml"](),
    "{val1}",
    "The title is empty by default"
  );
  survey.setValue("val1", "[val1]");
  assert.equal(
    question.locTitle["koRenderedHtml"](),
    "[val1]",
    "The val1 is set"
  );
  survey.setVariable("var1", "[var1]");
  assert.equal(
    question.locTitle["koRenderedHtml"](),
    "[var1][val1]",
    "The var1 and val1 are set"
  );
});

QUnit.test("Load Panel from Json + visibleIf + startWithNewLine", function (
  assert
) {
  var json = {
    questions: [
      {
        type: "panel",
        name: "panel",
        elements: [
          { type: "text", name: "q1" },
          {
            type: "text",
            name: "q2",
            visibleIf: "{q1}=a",
            startWithNewLine: false,
          },
        ],
      },
    ],
  };
  var survey = new Survey(json);
  var panel = survey.getAllPanels()[0];
  var rows = (<Panel>panel).rows;
  var row = rows[0];

  assert.ok(row, "row is created");
  assert.equal(rows.length, 1, "There are 1 row in the panel");
  assert.equal(
    survey.getQuestionByName("q2").isVisible,
    false,
    "The question is invisible"
  );
});

QUnit.test("Load Panel from Json + isSinglePage", function (assert) {
  var json = {
    isSinglePage: true,
    pages: [
      {
        name: "page1",
        elements: [{ type: "text", name: "q1" }],
      },
      {
        name: "page2",
        elements: [{ type: "text", name: "q2" }],
      },
    ],
  };
  var survey = new Survey(json);
  var page = survey.pages[0];
  var rows = (<Page>page).rows;
  var row = rows[1];

  assert.ok(row, "the second row is created");
  assert.equal(row.elements.length, 1, "There is one element here");
  assert.equal(row.visible, true, "Row is visible");
  var q = row.elements[0];
  assert.equal(q.isVisible, true, "The question is visible");
});

QUnit.test("Load PanelDynamic from Json", function (assert) {
  var json = {
    questions: [
      {
        type: "paneldynamic",
        name: "q",
        panelCount: 3,
        templateElements: [
          { type: "text", name: "q1" },
          { type: "text", name: "q2" },
        ],
      },
    ],
  };
  var survey = new Survey(json);
  var question = <QuestionPanelDynamic>survey.getAllQuestions()[0];
  assert.ok(question, "paneldynamic question is loaded");
  assert.equal(
    question.template.elements.length,
    2,
    "template elements are loaded correctly"
  );
  assert.equal(
    question.template.elements[1].name,
    "q2",
    "the name of the second question is 'q2'"
  );
  assert.equal(question.panelCount, 3, "panelCount loaded correctly");
  assert.equal(question.panels.length, 3, "There are 3 panels now");
  var panel = question.panels[0];
  assert.equal(panel.isVisible, true, "Panel is visible");
  assert.equal(panel.rows.length, 2, "Two questions - two rows");
  var row = <QuestionRow>panel.rows[0];
  assert.ok(row, "the first row is created");
  assert.equal(row.elements.length, 1, "there is one question in the row");
  assert.equal(row.elements[0].visible, true, "question is visible");
  panel.questions[0].value = "val1";
  assert.deepEqual(
    question.value,
    [{ q1: "val1" }, {}, {}],
    "Set the value correctly"
  );

  question.value = [
    { q1: "item1_1", q2: "item1_2" },
    { q1: "item2_1", q2: "item2_2" },
    {},
  ];
  assert.equal(
    <Question>panel.questions[0].value,
    "item1_1",
    "knockout question in panel get notification"
  );
  question.removePanel(0);
  assert.equal(question.panels.length, 2, "2 panels, panels has been updated");
});

QUnit.test("Load PanelDynamic from Json, nested panel", function (assert) {
  var json = {
    questions: [
      {
        type: "paneldynamic",
        name: "q",
        panelCount: 3,
        templateElements: [
          { type: "text", name: "q1" },
          {
            type: "panel",
            name: "np1",
            elements: [{ type: "text", name: "q2" }],
          },
        ],
      },
    ],
  };
  var survey = new Survey(json);
  var question = <QuestionPanelDynamic>survey.getAllQuestions()[0];
  assert.ok(question, "paneldynamic question is loaded");
  assert.equal(
    question.template.elements.length,
    2,
    "template elements are loaded correctly"
  );
  assert.equal(
    question.template.elements[1].name,
    "np1",
    "the name of the second element is 'pn1'"
  );
  assert.equal(question.panelCount, 3, "panelCount loaded correctly");
  assert.equal(question.panels.length, 3, "There are 3 panels now");
  var panel = question.panels[0];
  assert.equal(
    panel.elements.length,
    2,
    "panel elements are created correctly"
  );
  var nestedPanel = <Panel>panel.elements[1];
  assert.equal(
    nestedPanel.name,
    "np1",
    "copied panel: the name of the second element is 'pn1'"
  );

  assert.equal(
    nestedPanel.elements.length,
    1,
    "there is one element in the nested panel"
  );
  assert.equal(panel.isVisible, true, "Panel is visible");
  assert.equal(nestedPanel.isVisible, true, "Nested panel is visible");
  assert.equal(panel.rows.length, 2, "Two elements - two rows");
  var row1 = <QuestionRow>panel.rows[0];
  var row2 = <QuestionRow>panel.rows[1];
  assert.ok(row1, "the first row is created");
  assert.equal(row1.elements.length, 1, "there is one element in the row");
  assert.equal(row1.elements[0].visible, true, "element is visible");
  assert.ok(row2, "the second row is created");
  assert.equal(row2.elements.length, 1, "there is one element in the row");
  assert.equal(row2.elements[0].visible, true, "element is visible");
  assert.equal(
    nestedPanel.rows.length,
    1,
    "One element - one row in nested panel"
  );
  var rowN1 = <QuestionRow>nestedPanel.rows[0];
  assert.ok(row1, "the nested row is created");
  assert.equal(
    row1.elements.length,
    1,
    "there is one element in the nested row"
  );
  assert.equal(
    row1.elements[0].visible,
    true,
    "element is visible in nested row is visible"
  );
});

QUnit.test("PanelDynamic and koRenderedHtml on text processing", function (
  assert
) {
  var json = {
    questions: [
      {
        type: "paneldynamic",
        name: "q",
        panelCount: 3,
        templateElements: [
          { type: "text", name: "q1" },
          {
            type: "panel",
            name: "np1",
            title: "{panel.q1}",
            elements: [{ type: "text", name: "q2", title: "{panel.q1}" }],
          },
        ],
      },
    ],
  };
  var survey = new Survey(json);
  survey.locStrsChanged();
  var question = <QuestionPanelDynamic>survey.getAllQuestions()[0];
  var panel = <Panel>question.panels[0];
  var pLocTitle = (<Panel>panel.elements[1]).locTitle;
  var qLocTitle = (<Question>panel.questions[1]).locTitle;
  assert.equal(
    qLocTitle["koRenderedHtml"](),
    "q2",
    "q2 title show q2 name by default"
  );
  assert.equal(pLocTitle["koRenderedHtml"](), "", "np1 title is empty");
  panel.getQuestionByName("q1").value = "val1";
  assert.equal(qLocTitle["koRenderedHtml"](), "val1", "q2 title is q1.value");
  assert.equal(pLocTitle["koRenderedHtml"](), "val1", "np1 title is q1.value");
});

QUnit.test("loc strings changed only once on data assignment", function (
  assert
) {
  var json = {
    questions: [
      { type: "text", name: "q1", title: "Question 1" },
      { type: "text", name: "q2", title: "{q1}" },
    ],
  };
  var survey = new Survey(json);

  let callCount = 0;
  let calls = "";

  survey.onTextMarkdown.add(function (survey, options) {
    callCount++;
    calls += "->" + options.element.name + "." + options.name;
  });
  callCount = 0;
  calls = "";
  survey.data = {
    q1: "initial",
  };
  assert.equal(
    calls,
    "->q1.title->q2.title",
    "strings recalculated one time for each string"
  );
  assert.equal(callCount, 2, "strings recalculated 2 times");
  var q1 = survey.getQuestionByName("q1");
  var q2 = survey.getQuestionByName("q2");
  q1.value = "initial";
  assert.equal(
    q2.locTitle["koRenderedHtml"](),
    "initial",
    "calculate the string correctly, ko"
  );
  assert.equal(
    q2.locTitle.renderedHtml,
    "initial",
    "calculate the string correctly, model"
  );
});

QUnit.test("koSurvey matrix.rowsVisibleIf", function (assert) {
  var survey = new Survey();
  var page = survey.addNewPage("p1");
  var qCars = new QuestionCheckbox("cars");
  qCars.choices = ["Audi", "BMW", "Mercedes", "Volkswagen"];
  page.addElement(qCars);
  var qBestCar = new QuestionMatrix("bestCar");
  qBestCar.columns = ["col1"];
  qBestCar.rows = ["Audi", "BMW", "Mercedes", "Volkswagen"];
  qBestCar.rowsVisibleIf = "{cars} contains {item}";
  page.addElement(qBestCar);
  assert.equal(qBestCar.koVisibleRows().length, 0, "cars are not selected yet");
  qCars.value = ["BMW"];
  assert.equal(qBestCar.koVisibleRows().length, 1, "BMW is selected");
  qCars.value = ["Audi", "BMW", "Mercedes"];
  assert.equal(qBestCar.koVisibleRows().length, 3, "3 cars are selected");
  qBestCar.rowsVisibleIf = "";
  assert.equal(qBestCar.koVisibleRows().length, 4, "there is no filter");
});

export class DesignerSurveyTester extends Survey {
  constructor(
    jsonObj: any = null,
    renderedElement: any = null
  ) {
    super(jsonObj, renderedElement);
  }
  protected onBeforeCreating() {
    super.onBeforeCreating();
    this.setDesignMode(true);
  }
}

QUnit.test(
  "Questions are not rendered in Panel inside Dynamic Panel in Editor, editor bug #216",
  function (assert) {
    var survey = new DesignerSurveyTester({
      pages: [
        {
          name: "page1",
          elements: [
            {
              type: "paneldynamic",
              name: "question1",
              templateElements: [
                {
                  type: "panel",
                  elements: [
                    {
                      type: "text",
                      name: "question2",
                    },
                  ],
                  name: "panel1",
                },
              ],
            },
          ],
        },
      ],
    });
    var dynamicPanel = <QuestionPanelDynamic>(
      survey.getQuestionByName("question1")
    );
    assert.ok(dynamicPanel, "Dynamic panel is here");
    assert.equal(
      dynamicPanel.panels.length,
      1,
      "At design-time there should be one panel"
    );
    var templatePanel = dynamicPanel.panels[0];
    assert.ok(templatePanel, "template panel is here");
    var panel = <Panel>templatePanel.elements[0];
    assert.ok(panel, "panel is here");
    assert.equal(panel.elements.length, 1, "There is one element in the panel");
    var rows = panel.rows;
    assert.ok(rows, "panel rows are here");
    assert.equal(rows.length, 1, "There is one element in the rows");
    var row1 = rows[0];
    assert.equal(row1.elements.length, 1, "there is one element in the row");
    assert.equal(row1.elements[0].visible, true, "element is visible");
    assert.equal(row1.elements[0].name, "question2", "It is our question");
  }
);

QUnit.test(
  "Add invisible question in Panel from JSON in Editor, editor bug #218",
  function (assert) {
    var survey = new DesignerSurveyTester();
    var page = survey.addNewPage("page1");
    var json = {
      type: "panel",
      elements: [
        {
          type: "text",
          name: "question2",
          visible: false,
        },
      ],
      name: "panel1",
    };
    var newElement = Serializer.createClass("panel");
    new JsonObject().toObject(json, newElement);
    page.addElement(newElement);

    var panel = <Panel>survey.pages[0].elements[0];
    assert.ok(panel, "panel is here");
    assert.equal(panel.elements.length, 1, "There is one element in the panel");
    var rows = panel.rows;
    assert.ok(rows, "panel rows are here");
    assert.equal(rows.length, 1, "There is one element in the rows");
    var row1 = rows[0];
    assert.equal(row1.elements.length, 1, "there is one element in the row");
    assert.equal(row1.elements[0].isVisible, true, "element is visible");
    assert.equal(row1.elements[0].name, "question2", "It is our question");
  }
);

QUnit.test(
  "Load rating from JSON, bug# https://github.com/surveyjs/editor/issues/171",
  function (assert) {
    var json = {
      questions: [
        { type: "rating", name: "q", rateMax: 8, rateMin: 2, rateStep: 2 },
      ],
    };
    var survey = new Survey(json);

    var question = <QuestionRating>survey.getAllQuestions()[0];
    assert.equal(
      question["renderedRateItems"].length,
      4,
      "There are 4 items: 2, 4, 6, 8"
    );
  }
);
QUnit.test("Default value doesn't set in PanelDynamic , bug#910", function (
  assert
) {
  var json = {
    questions: [
      {
        type: "paneldynamic",
        name: "pdynamic",
        templateElements: [
          {
            type: "text",
            name: "q1",
            defaultValue: "value1",
          },
          {
            type: "dropdown",
            name: "q2",
            defaultValue: "item2",
            choices: ["item1", "item2", "item3"],
          },
        ],
        panelCount: 1,
      },
    ],
  };
  var survey = new Survey(json);
  var panel = <QuestionPanelDynamic>survey.getQuestionByName("pdynamic");
  var q1 = <Question>panel.panels[0].questions[0];
  var q2 = <Question>panel.panels[0].questions[1];
  assert.equal(q1.value, "value1", "The default value set to q1.value");
  assert.equal(q2.value, "item2", "The default value set to q2.value");
});

QUnit.test(
  "Survey.isSinglePage = true, the last page doesn't added, bug#1009",
  function (assert) {
    var json = {
      pages: [
        {
          name: "page1",
          elements: [
            {
              name: "text1",
              type: "text",
            },
          ],
        },
        {
          name: "page2",
          elements: [
            {
              name: "text2",
              type: "text",
            },
          ],
        },
        {
          name: "page3",
          elements: [
            {
              name: "text3",
              type: "text",
            },
          ],
        },
      ],
    };
    var survey = new Survey(json);
    survey.isSinglePage = true;
    assert.equal(
      survey.currentPage.questions.length,
      3,
      "There are 3 elements on the single page"
    );
    assert.equal(
      survey.currentPage.rows.length,
      3,
      "There are 3 rows on the page"
    );
    assert.equal(
      survey.currentPage.rows[2].visible,
      true,
      "The last row is visible"
    );
  }
);

QUnit.test("Survey Localization - radiogroup.otheItem, Bug#1045", function (
  assert
) {
  var json = {
    questions: [
      {
        type: "radiogroup",
        name: "q1",
        hasOther: true,
        choices: [1, 2],
        otherText: {
          default: "Other",
          es: "Otro",
        },
      },
    ],
  };

  var survey = new Survey(json);
  var q1 = <QuestionRadiogroup>survey.getQuestionByName("q1");

  assert.equal(
    q1.visibleChoices[2].locText["koRenderedHtml"](),
    "Other",
    "By default it is Other"
  );
  survey.locale = "es";
  assert.equal(
    q1.visibleChoices[2].locText["koRenderedHtml"](),
    "Otro",
    "Otro for Spanish"
  );
  survey.locale = "";
  assert.equal(
    q1.visibleChoices[2].locText["koRenderedHtml"](),
    "Other",
    "It is default again"
  );
  survey.locale = "es";
  assert.equal(
    q1.visibleChoices[2].locText["koRenderedHtml"](),
    "Otro",
    "It is Spanish again"
  );
  survey.locale = "";
});

QUnit.test(
  "PanelDynamic and MatrixDynamic, survey in readonly mode, Bug#1051",
  function (assert) {
    var json = {
      questions: [
        {
          type: "paneldynamic",
          name: "panel",
          panelCount: 2,
          templateElements: [
            {
              type: "text",
              name: "q1",
            },
          ],
        },
        {
          type: "matrixdynamic",
          name: "matrix",
          rowCount: 2,
          columns: [
            {
              name: "col1",
            },
          ],
        },
        {
          type: "text",
          name: "q2",
        },
      ],
    };
    var survey = new Survey(json);
    var panel = <QuestionPanelDynamic>survey.getQuestionByName("panel");
    var matrix = <QuestionMatrixDynamic>survey.getQuestionByName("matrix");
    var rows = matrix.visibleRows;
    var question = <QuestionText>survey.getQuestionByName("q2");
    assert.equal(
      panel.panels[0].questions[0].isReadOnly,
      false,
      "The question is not readonly in panel dynamic"
    );
    assert.equal(
      rows[0].cells[0].question.isReadOnly,
      false,
      "The question is not readonly in matrix dynamic"
    );
    survey.mode = "display";
    assert.equal(
      question.isReadOnly,
      true,
      "The standard question is readonly"
    );
    assert.equal(
      panel.panels[0].questions[0].isReadOnly,
      true,
      "The question in dynamic panel should be readonly"
    );
    assert.equal(
      rows[0].cells[0].question.isReadOnly,
      true,
      "The question is readonly in matrix dynamic"
    );
  }
);

function createPageWithQuestion(name: string): Page {
  var page = new Page(name);
  page.addNewQuestion("text", "q1");
  return page;
}

QUnit.test("koquestion inside panel vidibleif", function (assert) {
  var json = {
    pages: [
      {
        name: "page1",
        elements: [
          {
            type: "dropdown",
            name: "question1",
            choices: ["item1", "item2", "item3"],
          },
          {
            type: "checkbox",
            name: "question2",
            choices: ["item1", "item2", "item3"],
          },
          {
            type: "panel",
            name: "panel1",
            elements: [
              {
                type: "rating",
                name: "question3",
                visibleIf: "{question2} contain 'item2'",
              },
            ],
            visibleIf: "{question1} equal 'item1'",
            state: "collapsed",
          },
        ],
      },
    ],
  };
  var survey = new Survey(json);

  var q1 = <Question>survey.getQuestionByName("question1");
  var q2 = <Question>survey.getQuestionByName("question2");
  var q3 = <Question>survey.getQuestionByName("question3");
  var p1 = <Panel>survey.getPanelByName("panel1");

  q1.value = "item1";
  assert.notOk(p1.isVisible);
  assert.notOk(q3.isVisible);
  assert.ok(p1.visible);
  assert.notOk(q3.visible);
  assert.notOk(p1.isVisible);
  assert.notOk(q3.isVisible);

  q2.value = ["item2"];
  assert.ok(p1.isVisible);
  assert.ok(q3.isVisible);
  assert.ok(p1.visible);
  assert.ok(q3.visible);
  assert.ok(p1.isVisible);
  assert.ok(q3.isVisible);
});

QUnit.test(
  "multipletext item is not readonly when survey is readonly, bug #1177",
  function (assert) {
    var json = {
      mode: "display",
      elements: [
        {
          type: "multipletext",
          name: "question1",
          items: [
            {
              name: "text1",
            },
          ],
        },
      ],
    };
    var survey = new Survey(json);
    var q = <QuestionMultipleText>survey.getQuestionByName("question1");
    assert.equal(q.items[0].editor.isReadOnly, true, "It should be readonly");
    survey.mode = "edit";
    assert.equal(q.items[0].editor.isReadOnly, false, "It is editable now");
  }
);

QUnit.test("Dynamic Panel bug with localization, bug #1184", function (assert) {
  var json = {
    locale: "de",
    elements: [
      {
        type: "paneldynamic",
        name: "question102",
        templateElements: [
          {
            type: "radiogroup",
            name: "question91",
            title: {
              de: "Wählen Sie eine Option",
            },
            choices: [
              {
                value: "Option 1/2",
                text: "Option 1/2",
              },
              {
                value: "Option 3",
                text: "Option 3",
              },
              {
                value: "Option 4",
                text: "Option 4",
              },
            ],
          },
        ],
        templateTitle: "Panel #{panelIndex}",
        panelCount: 2,
      },
    ],
  };
  var survey = new Survey(json);
  survey.isSinglePage = true;
  var q = <QuestionPanelDynamic>survey.getQuestionByName("question102");
  var panelJsonOriginal = {
    elements: [
      {
        type: "radiogroup",
        name: "question91",
        title: {
          de: "Wählen Sie eine Option",
        },
        choices: ["Option 1/2", "Option 3", "Option 4"]
      },
    ],
  };
  var qJson = q.template.toJSON();
  delete qJson["title"];
  assert.deepEqual(
    qJson,
    panelJsonOriginal,
    "Dynamic Panel template restored correctly"
  );

  qJson = q.panels[0].toJSON();
  delete qJson["title"];
  assert.deepEqual(
    qJson,
    panelJsonOriginal,
    "Dynamic Panel, first Panel  restored correctly"
  );

  var locQ = <Question>q.panels[0].questions[0];
  assert.equal(locQ.getLocale(), "de", "locale is 'de'");

  assert.equal(
    locQ.locTitle.renderedHtml,
    "Wählen Sie eine Option",
    "German text is rendered"
  );
  assert.equal(
    locQ.locTitle["koRenderedHtml"](),
    "Wählen Sie eine Option",
    "German text is rendered in koRenderedHtml"
  );
});

QUnit.test(
  "exception during changing multiSelect for imagepicker, bug https://github.com/surveyjs/editor/issues/374",
  function (assert) {
    StylesManager.applyTheme("default");
    var survey = new Survey();
    var page = survey.addNewPage("p");
    var q = new QuestionImagePicker("question1");
    page.addQuestion(q);
    q.endLoadingFromJson();
    var containsStyles = (str: string) =>
      str.indexOf("sv_q_imgsel sv_q_imagepicker_inline") > -1;
    assert.equal(containsStyles(q.getItemClass({})), true, "No exception");
    q.multiSelect = true;
    assert.equal(containsStyles(q.getItemClass({})), true, "No exception");
  }
);

QUnit.test("Could not assign value into mutlipletext question, #1229", function (
  assert
) {
  var survey = new Survey();
  var page = survey.addNewPage("page1");
  var question = new QuestionMultipleText("q1");
  question.addItem("item1");
  question.addItem("item2");
  page.addQuestion(question);
  survey.data = { q1: { item1: "val1", item2: "val2" } };
  assert.equal(
    question.items[0].editor.value,
    "val1",
    "val1 is set to the question item"
  );
  assert.equal(
    question.items[1].editor.value,
    "val2",
    "val1 is set to the question item"
  );
});

QUnit.test(
  "Changing isRequired doesn't update title for questions in dynamic panel, Bug in Editor #385",
  function (assert) {
    var survey = new Survey();
    var page = survey.addNewPage("page1");
    var question = new QuestionPanelDynamic("q1");
    var tmpQuestion = <Question>question.template.addNewQuestion("text", "q2");
    page.addElement(question);
    question.panelCount = 2;
    var pnlQuestion = <Question>question.panels[0].questions[0];
    assert.equal(
      pnlQuestion.locTitle["koRenderedHtml"](),
      "q2",
      "The default value"
    );
    tmpQuestion.title = "q22";
    assert.equal(
      pnlQuestion.locTitle["koRenderedHtml"](),
      "q22",
      "The default value"
    );
    tmpQuestion.isRequired = true;
    assert.equal(
      pnlQuestion.locTitle["koRenderedHtml"](),
      "q22",
      "The default value"
    );
    assert.equal(pnlQuestion.requiredText, "*", "The requiredText value");
  }
);

QUnit.test(
  "panel.visibleIf doesn't work if it is a single panel on the page, #1329",
  function (assert) {
    var json = {
      pages: [
        {
          name: "page1",
          elements: [
            {
              type: "radiogroup",
              name: "question1",
              choices: ["item1", "item2", "item3"],
            },
          ],
        },
        {
          name: "page2",
          elements: [
            {
              type: "panel",
              name: "panel1",
              elements: [
                {
                  type: "radiogroup",
                  name: "question2",
                  choices: ["item1", "item2", "item3"],
                },
              ],
              visibleIf: "{question1} = 'item1'",
            },
          ],
        },
      ],
    };
    var survey = new Survey(json);
    assert.equal(survey.isLastPage, true, "There is one visible page");
    survey.setValue("question1", "item1");
    assert.equal(survey.isLastPage, false, "There are two visible pages");
    survey.setValue("question1", "item2");
    assert.equal(
      survey.isLastPage,
      true,
      "There is one visible page again"
    );
  }
);

/*
QUnit.test("Expression with two columns doesn't work, bug#1199", function(
  assert
) {
  var json = {
    elements: [
      {
        type: "matrixdropdown",
        name: "q1",
        columns: [
          {
            name: "bldg",
            title: "Building",
            cellType: "text"
          },
          {
            name: "cont",
            title: "Contents",
            cellType: "text"
          },
          {
            name: "tot",
            title: "Total",
            cellType: "expression",
            expression: "{row.bldg} + {row.cont}"
          }
        ],
        cellType: "text",
        rows: [
          {
            value: "B",
            text: "Budgeted"
          },
          {
            value: "A",
            text: "Actual"
          }
        ]
      }
    ]
  };
  var survey = new Survey(json);
  survey.setValue("q1", { B: { bldg: 4, cont: 6 } });
  //var rows = question.visibleRows;
  var val = survey.getValue("q1");
  assert.equal(val.B.tot, 10, "Expression equals 10");
});
*/

QUnit.test("Loc string text preprocessing update on change value", function (
  assert
) {
  var json = {
    pages: [
      {
        questions: [
          {
            type: "text",
            name: "name",
          },
        ],
      },
      {
        questions: [
          {
            type: "comment",
            name: "comment",
            title: "{name}, text",
          },
        ],
      },
    ],
  };

  var survey = new Survey(json);
  var commentQuestion = <Question>survey.getQuestionByName("comment");

  survey.setValue("name", "a");
  survey.nextPage();

  assert.equal(
    commentQuestion.locTitle["koRenderedHtml"](),
    "a, text",
    "The first value"
  );

  survey.setValue("name", "b");
  assert.equal(
    commentQuestion.locTitle["koRenderedHtml"](),
    "b, text",
    "The first value"
  );
});
QUnit.test("question.paddingLeft and question.paddingRight", function (assert) {
  var survey = new Survey({
    elements: [{ type: "panel", name: "p1" }],
  });
  var panel = <Panel>survey.getPanelByName("p1");
  assert.equal(panel.paddingLeft, "", "left is empty");
  assert.equal(panel.paddingRight, "", "right is empty");
  panel.innerIndent = 1;
  panel.rightIndent = 2;
  panel.indent = 3;
  assert.equal(panel.innerPaddingLeft, "20px", "inner left is not empty");
  assert.equal(panel.paddingRight, "40px", "right is not empty");
  assert.equal(panel.paddingLeft, "60px", "left is not empty");
});
QUnit.test("panel and question paddings form json", function (assert) {
  var survey = new Survey({
    elements: [
      {
        type: "panel",
        name: "p1",
        innerIndent: 2,
        indent: 3,
      },
      { type: "text", name: "q1", indent: 1 },
    ],
  });
  var panel = <Panel>survey.getPanelByName("p1");
  var question = <Question>survey.getQuestionByName("q1");
  assert.equal(panel.paddingLeft, "60px", "panel left is 60px");
  assert.equal(panel.innerPaddingLeft, "40px", "panel inner left is 40px");
  assert.equal(question.paddingLeft, "20px", "question left is 20px");
});
QUnit.test("Questions are randomized", function (assert) {
  var survey = new Survey({
    elements: [
      {
        type: "text",
        name: "question1",
      },
      {
        type: "text",
        name: "question2",
      },
      {
        type: "text",
        name: "question3",
      },
    ],
    questionsOrder: "random",
  });
  var page = survey.pages[0];
  assert.equal(page.areQuestionsRandomized, true, "Questions are randomized");
  assert.equal(page.rows.length, 3, "There are 3 rows");
});
function doTimer(count: number) {
  for (var i = 0; i < count; i++) {
    SurveyTimer.instance.doTimer();
  }
}
QUnit.test(
  "Complete pages by timer and questionsOrder = 'random', Bug#1406, Bug#1482",
  function (assert) {
    var survey = new Survey({
      pages: [
        {
          name: "startPage",
          elements: [{ type: "text", name: "startQuestion" }],
        },
        {
          name: "page1",
          elements: [
            { type: "text", name: "q1" },
            { type: "text", name: "q2" },
          ],
        },
        {
          name: "page2",
          elements: [
            { type: "text", name: "q3" },
            { type: "text", name: "q4" },
          ],
          maxTimeToFinish: 5,
        },
      ],
      firstPageIsStarted: true,
      maxTimeToFinishPage: 10,
      questionsOrder: "random",
      showTimerPanel: "top",
    });
    assert.equal(survey.startedPage.name, "startPage", "The start page");
    assert.equal(
      survey.startedPage.rows.length,
      1,
      "One row in the started page"
    );
    survey.start();
    assert.equal(survey.state, "running", "The state is running");
    assert.equal(survey.currentPage.name, "page1", "The first page");
    doTimer(5);
    assert.equal(survey.state, "running", "The state is still running");
    assert.equal(survey.currentPage.name, "page1", "The first page");
    doTimer(5);
    assert.equal(survey.state, "running", "The state is still running");
    assert.equal(survey.currentPage.name, "page2", "The second first page");
    doTimer(5);
    assert.equal(survey.state, "completed", "The survey is completed");
  }
);

QUnit.test("https://github.com/surveyjs/surveyjs/issues/1501", function (
  assert
) {
  var survey = new Survey();
  var page = survey.addNewPage("page");
  var q1 = <QuestionCheckbox>page.addNewQuestion("checkbox", "q1");
  q1.choices = [1, 2];
  q1.hasOther = true;
  q1.storeOthersAsComment = false;
  var counter = 0;

  ko.computed(() => {
    var v = q1.isOtherSelected;
    counter++;
  });

  q1.value = "other";

  assert.equal(counter, 2, "computed has been triggered");
});

QUnit.test(
  "Some custom CSS not working - https://github.com/surveyjs/survey-library/issues/2122",
  function (assert) {
    StylesManager.applyTheme("default");
    var survey = new Survey({
      questions: [
        {
          name: "q1",
          type: "text",
        },
        {
          type: "paneldynamic",
          name: "p1",
          templateElements: [
            {
              name: "name",
              type: "text",
            },
          ],
          panelCount: 2,
        },
      ],
    });
    var q1 = survey.getQuestionByName("q1");
    var p1 = survey.getQuestionByName("p1");
    var myCss = {
      question: {
        title: "sq-title-red",
      },
    };

    assert.equal(q1.cssTitle, "sv_q_title", "Original CSS classes");
    assert.equal(
      p1.panels[0].elements[0].cssTitle,
      "sv_q_title",
      "Original CSS classes for questions in dynamic panel"
    );
    survey.updateSurvey({ css: myCss });
    assert.equal(q1.cssTitle, "sq-title-red", "CSS classes have been updated");
    assert.equal(
      p1.panels[0].elements[0].cssTitle,
      "sq-title-red",
      "CSS classes for questions in dynamic panel"
    );
  }
);

QUnit.test(
  "Other item selected and not checked - https://github.com/surveyjs/survey-library/issues/2200",
  function (assert) {
    StylesManager.applyTheme("default");
    var q1 = new QuestionRadiogroup("q1");
    q1.fromJSON({
      type: "radiogroup",
      name: "q1",
      hasOther: true,
      storeOthersAsComment: false,
      choices: [1, 2],
    });
    q1["copyCssClasses"] = (classes) => {
      classes.item = "item";
      classes.itemChecked = "checked";
    };

    assert.notOk(q1.isOtherSelected);
    assert.equal(
      q1.getItemClass(q1.otherItem),
      "item sv-q-col-1",
      "other is not selected"
    );

    q1.value = "some text";
    assert.ok(q1.isOtherSelected);
    assert.equal(
      q1.getItemClass(q1.otherItem),
      "item sv-q-col-1 checked",
      "other is selected"
    );
  }
);

QUnit.test("survey.firstPageIsStarted=true + multiple-language", function (
  assert
) {
  var json = {
    firstPageIsStarted: true,
    pages: [
      {
        elements: [
          {
            type: "text",
            name: "q1",
            title: { default: "q1-en", de: "q1-de" },
          },
        ],
      },
      {
        elements: [
          {
            type: "text",
            name: "q2",
            title: { default: "q2-en", de: "q2-de" },
          },
        ],
      },
    ],
  };
  var survey = new Survey(json);
  var q1 = survey.getQuestionByName("q1");
  var q2 = survey.getQuestionByName("q2");
  assert.equal(q1.locTitle["koRenderedHtml"](), "q1-en", "en locale, q1");
  assert.equal(q2.locTitle["koRenderedHtml"](), "q2-en", "en locale, q2");
  var prevLocale = survey.locale;
  survey.locale = "de";
  assert.equal(q1.locTitle["koRenderedHtml"](), "q1-de", "de locale, q1");
  survey.locale = prevLocale;
  survey.start();
  survey.locale = "de";
  assert.equal(q2.locTitle["koRenderedHtml"](), "q2-de", "de locale, q2");
  survey.locale = prevLocale;
});

QUnit.test("survey.firstPageIsStarted=true + multiple-language", function (
  assert
) {
  var survey = new Survey({
    locale: "de",
    pages: [
      {
        name: "startedPage",
        elements: [
          {
            type: "text",
            name: "question10",
          },
          {
            type: "text",
            name: "question11",
            startWithNewLine: false,
          },
        ],
      },
      {
        elements: [
          { type: "text", name: "question1" }
        ]
      }
    ],
    firstPageIsStarted: true,
  });
  assert.equal(survey.startedPage.name, "startedPage", "Loaded fine");
});

QUnit.test("ProgressButtonsViewModel component scroll button", function (
  assert
) {
  let json: any = {
    pages: [
      {
        name: "page1",
        elements: [
          {
            type: "text",
            name: "question1",
          },
        ],
      },
      {
        name: "page2",
        elements: [
          {
            type: "text",
            name: "question2",
          },
        ],
      },
      {
        name: "page3",
        elements: [
          {
            type: "text",
            name: "question3",
          },
        ],
      },
    ],
  };
  StylesManager.applyTheme("default");
  let survey: Survey = new Survey(json);
  let progress: ProgressButtonsViewModel = new ProgressButtonsViewModel(
    new ProgressButtons(survey as any),
    {
      querySelector: function () {
        return undefined;
      },
      querySelectorAll: function () {
        return [] as any;
      },
    } as any, "center", survey
  );
  progress.dispose();
  assert.equal(
    progress.getScrollButtonCss(true),
    survey.css.progressButtonsImageButtonLeft +
    " " +
    survey.css.progressButtonsImageButtonHidden,
    "1) Scroll button left style is hidden"
  );
  assert.equal(
    progress.getScrollButtonCss(false),
    survey.css.progressButtonsImageButtonRight +
    " " +
    survey.css.progressButtonsImageButtonHidden,
    "1) Scroll button right style is hidden"
  );

  progress["hasScroller"](true);
  assert.equal(
    progress.getScrollButtonCss(true),
    survey.css.progressButtonsImageButtonLeft,
    "2) Scroll button left style is visible"
  );
  assert.equal(
    progress.getScrollButtonCss(false),
    survey.css.progressButtonsImageButtonRight,
    "2) Scroll button right style is visible"
  );
});

QUnit.test("QuestionCheckbox otherItem KO text", function (assert) {
  var survey = new Survey();
  survey.locale = "";
  survey.addNewPage();
  var q2 = new QuestionCheckbox("q2");
  q2.choices = ["item1", "item2", "item3"];
  survey.pages[0].addQuestion(q2);
  assert.equal(
    q2.otherItem.locText.renderedHtml,
    "Other (describe)",
    "other item default text"
  );
  assert.equal(
    q2.otherItem.locText["koRenderedHtml"](),
    "Other (describe)",
    "other item default text KO"
  );
});

QUnit.test("QuestionCheckbox otherItem KO text design time", function (assert) {
  var survey = new Survey();
  survey.locale = "";
  survey.setDesignMode(true);
  survey.addNewPage();
  var q2 = new QuestionCheckbox("q2");
  q2.choices = ["item1", "item2", "item3"];
  survey.pages[0].addQuestion(q2);
  assert.equal(
    q2.otherItem.locText.renderedHtml,
    "Other (describe)",
    "other item default text"
  );
  assert.equal(
    q2.otherItem.locText["koRenderedHtml"](),
    "Other (describe)",
    "other item default text KO"
  );
});

QUnit.test("Question KO title changed on name", function (assert) {
  var survey = new Survey();
  survey.locale = "";
  survey.addNewPage();
  var q2 = new QuestionCheckbox("q2");
  survey.pages[0].addQuestion(q2);
  assert.equal(q2.locTitle.renderedHtml, "q2", "question default title");
  assert.equal(
    q2.locTitle["koRenderedHtml"](),
    "q2",
    "question default title KO"
  );
  q2.name = "q3";
  assert.equal(q2.locTitle.renderedHtml, "q3", "question changed title");
  assert.equal(
    q2.locTitle["koRenderedHtml"](),
    "q3",
    "question changed title KO"
  );
});
QUnit.test(
  "Text processing in rows and columns, rendered table, Bug#2829",
  function (assert) {
    var survey = new Survey({
      elements: [
        {
          type: "text",
          name: "q1",
          defaultValue: "value1",
        },
        {
          type: "matrixdropdown",
          name: "matrix",
          columns: [{ name: "col1", title: "Col:{q1}" }],
          rows: [{ value: "row1", text: "Row:{q1}" }],
        },
      ],
    });
    var matrix = <QuestionMatrixDropdown>survey.getQuestionByName("matrix");
    assert.equal(
      matrix.renderedTable.headerRow.cells.length,
      2,
      "Row column + column"
    );
    assert.equal(
      matrix.renderedTable.headerRow.cells.length,
      2,
      "Row column + column"
    );

    assert.equal(
      matrix.renderedTable.headerRow.cells[1].locTitle["koRenderedHtml"](),
      "Col:value1",
      "column text"
    );
    assert.equal(
      matrix.renderedTable.rows[1].cells[0].locTitle["koRenderedHtml"](),
      "Row:value1",
      "row text"
    );
    survey.setValue("q1", "val2");
    assert.equal(
      matrix.renderedTable.headerRow.cells[1].locTitle["koRenderedHtml"](),
      "Col:val2",
      "column text, #2"
    );
    assert.equal(
      matrix.renderedTable.rows[1].cells[0].locTitle["koRenderedHtml"](),
      "Row:val2",
      "row text, #2"
    );
  }
);
QUnit.test(
  "check imageLink in imagePicker items on changing location, Bug#3287",
  function (assert) {
    const survey = new Survey({
      elements: [
        {
          "type": "imagepicker",
          "name": "q1",
          "choices": [
            {
              "value": "1",
              "imageLink": {
                "default": "link-en",
                "de": "link-de"
              }
            }
          ],
        }
      ]
    });
    const question = <QuestionImagePicker>survey.getQuestionByName("q1");
    const item = <ImageItemValue>question.choices[0];
    assert.equal(item.locImageLink["koRenderedHtml"](), "link-en", "locale en");
    survey.locale = "de";
    assert.equal(item.locImageLink["koRenderedHtml"](), "link-de", "locale de");
    survey.locale = "";
  }
);

QUnit.test("Change title koRenderedHtml on changing name", function (assert) {
  var survey = new Survey({
    elements: [
      {
        type: "text",
        name: "q1",
      },
    ],
  });
  var question = <Question>survey.getQuestionByName("q1");
  assert.equal(
    question.locTitle["koRenderedHtml"](),
    "q1",
    "The default value is here"
  );
  question.name = "q2";
  assert.equal(
    question.locTitle["koRenderedHtml"](),
    "q2",
    "The  value is changed"
  );
});
QUnit.test("Survey Markdown, Bug:#2831", function (assert) {
  var survey = new Survey({
    elements: [{ type: "text", name: "q1", title: "Hellomarkdown" }],
  });
  survey.onTextMarkdown.add(function (survey, options) {
    if (options.text.indexOf("markdown") > -1)
      options.html = options.text.replace("markdown", "!");
  });
  var q1 = survey.getQuestionByName("q1");
  assert.equal(
    q1.locTitle["koRenderedHtml"](),
    "Hello!",
    "Process markdown correctly"
  );
});
QUnit.test("Call loc str changed onGetQuestionTitle, Bug#3080", function (
  assert
) {
  var survey = new Survey({
    showQuestionNumbers: "off",
    elements: [{ type: "text", name: "q1", title: "Question1" }],
  });
  var q1 = survey.getQuestionByName("q1");
  assert.equal(
    q1.locTitle["koRenderedHtml"](),
    "Question1",
    "Process markdown correctly"
  );
  survey.onGetQuestionTitle.add((survey, options) => {
    options.title = options.title + "!";
  });
  assert.equal(
    q1.locTitle["koRenderedHtml"](),
    "Question1!",
    "Process onGetQuestionTitle correctly"
  );
});
QUnit.test("loc strings changed on data assignment", function (assert) {
  var json = {
    questions: [
      { type: "text", name: "q1", title: "Question 1" },
      { type: "text", name: "q2", title: "{q1}" },
    ],
  };
  var survey = new Survey();
  survey.fromJSON(json);
  survey.currentPage = survey.pages[0];
  survey.data = {
    q1: "initial",
  };
  var q2 = survey.getQuestionByName("q2");
  assert.equal(
    q2.locTitle["koRenderedHtml"](),
    "initial",
    "calculate the string correctly, ko"
  );
  assert.equal(
    q2.locTitle.renderedHtml,
    "initial",
    "calculate the string correctly, model"
  );
});
QUnit.test(
  "Create correct Panel object when creating in code, Bug#2866",
  function (assert) {
    StylesManager.applyTheme("default");
    var survey = new Survey();
    var page = survey.addNewPage("page1");
    var panel = <Panel>page.addNewPanel("panel1");
    var nestedPanel = <Panel>panel.addNewPanel("panel2");

    //Dynamic panel question
    var dynamicPanel = <QuestionPanelDynamic>(
      page.addNewQuestion("paneldynamic", "q1")
    );
    dynamicPanel.panelCount = 2;
    //Detail panel in matrix dynamic
    var matrix = <QuestionMatrixDynamic>(
      page.addNewQuestion("matrixdynamic", "q2")
    );
    var column = matrix.addColumn("col1");
    column.cellType = "text";
    matrix.detailPanel.addNewQuestion("text", "q3");
    matrix.detailPanelMode = "underRow";
    assert.equal(
      matrix.visibleRows[0].hasPanel,
      true,
      "The panel has been created"
    );
    matrix.visibleRows[0].showDetailPanel();
  }
);
QUnit.test(
  "start page and boolean question, check that locLabelTrue/False set correctly, Bug#2947",
  function (assert) {
    var survey = new Survey({
      firstPageIsStarted: true,
      pages: [
        {
          name: "Start Page",
          questions: [
            {
              type: "html",
              html: "1",
            },
          ],
        },
        {
          name: "First Page",
          questions: [
            {
              type: "boolean",
              name: "q1",
            },
          ],
        },
      ],
    });
    survey.start();
    var q = <QuestionBoolean>survey.getQuestionByName("q1");
    assert.equal(
      (<any>q.locLabelFalse).koRenderedHtml(),
      "No",
      "label false set correctly"
    );
    assert.equal(
      (<any>q.locLabelTrue).koRenderedHtml(),
      "Yes",
      "label true set correctly"
    );
  }
);
QUnit.test(
  "MatrixDynamic, test renderedTable column locString on adding new column",
  function (assert) {
    var survey = new Survey({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          columns: [{ name: "col1" }],
        },
      ],
    });
    var matrix: any = <any>survey.getQuestionByName("matrix");
    assert.equal(
      matrix.renderedTable.headerRow.cells.length,
      1 + 1,
      "We have one column and delete row"
    );
    assert.equal(
      matrix.renderedTable.headerRow.cells[0].locTitle.koRenderedHtml(),
      "col1",
      "Title rendered from JSON"
    );
    matrix.addColumn("col2");
    assert.equal(
      matrix.renderedTable.headerRow.cells[1].locTitle.koRenderedHtml(),
      "col2",
      "Title rendered from addColumn"
    );
    matrix.columns.push(new MatrixDropdownColumn("col3"));
    assert.equal(
      matrix.renderedTable.headerRow.cells[2].locTitle.koRenderedHtml(),
      "col3",
      "Title rendered from columns.push"
    );
  }
);
QUnit.test(
  "MatrixDynamic, test renderedTable column locString for checkbox question",
  function (assert) {
    var survey = new Survey({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          columns: [{ name: "col1", cellType: "checkbox" }],
        },
      ],
    });
    var matrix: any = <any>survey.getQuestionByName("matrix");
    var templateColum = matrix.columns[0].templateQuestion;
    templateColum.choices.push(new ItemValue("item1"));
    templateColum.choices.push(new ItemValue("item2"));
    var question = matrix.renderedTable.rows[0].cells[0].question;
    assert.equal(question.visibleChoices.length, 2, "There are two items");
    assert.equal(
      question.visibleChoices[0].locText.koRenderedHtml(),
      "item1",
      "text is corrert after push, item1"
    );
    assert.equal(
      question.visibleChoices[1].locText.koRenderedHtml(),
      "item2",
      "text is corrert after push, item2"
    );
    templateColum.choices.push(new ItemValue("item3"));
    question = matrix.renderedTable.rows[0].cells[0].question;
    assert.equal(question.visibleChoices.length, 3, "There are 3 items");
    assert.equal(
      question.visibleChoices[0].locText.koRenderedHtml(),
      "item1",
      "text is corrert after push, item1, #2"
    );
    assert.equal(
      question.visibleChoices[2].locText.koRenderedHtml(),
      "item3",
      "text is corrert after push, item3, #2"
    );
  }
);
QUnit.test(
  "MatrixDynamic, test renderedTable column locString after changing default cell Type",
  function (assert) {
    var survey = new Survey({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          columns: [{ name: "col1" }],
        },
      ],
    });
    var matrix: any = <any>survey.getQuestionByName("matrix");
    assert.equal(
      matrix.renderedTable.headerRow.cells.length,
      1 + 1,
      "We have one column and delete row"
    );
    assert.equal(
      matrix.renderedTable.headerRow.cells[0].locTitle.koRenderedHtml(),
      "col1",
      "Title rendered from JSON"
    );
    matrix.cellType = "checkbox";
    assert.equal(
      matrix.renderedTable.headerRow.cells[0].locTitle.koRenderedHtml(),
      "col1",
      "Title rendered from JSON"
    );
  }
);
QUnit.test("Error on running triggers", function (assert) {
  var survey = new Survey({
    elements: [
      {
        type: "text",
        name: "q1",
      },
      {
        type: "matrixdynamic",
        name: "matrix",
        visibleIf: "{q1} = 'yes'",
        columns: [
          {
            name: "col1",
            cellType: "text",
          },
        ],
        rowCount: 1,
      },
      {
        type: "radiogroup",
        name: "radio",
        choices: [
          {
            value: "yes",
            text: "Yes",
          },
          {
            value: "no",
            text: "No",
          },
        ],
      },
    ],
    triggers: [
      {
        type: "setvalue",
        expression: "{matrix[0].col1} notcontains 'x'",
        setToName: "radio",
        setValue: "no",
      },
    ],
  });
  survey.runTriggers();
  assert.equal(survey.getValue("radio"), undefined, "There is not value");
  survey.setValue("matrix", [{ col1: "v" }]);
  assert.equal(survey.getValue("radio"), "no", "Set value on trigger");
});
QUnit.test("pageNext/pagePrev... Text and koRenderedHtml", function (assert) {
  var survey = new Survey({
    elements: [
      {
        type: "text",
        name: "q1",
      },
    ],
  });
  const completeAction = (<any>survey).navigationBar.getActionById("sv-nav-complete");
  assert.equal(completeAction.title, "Complete");
  (<any>survey).completeText = "Finish";
  assert.equal(completeAction.title, "Finish");
});
QUnit.test("Initial Text Processing in panel title and ko", function (assert) {
  var survey = new Survey({
    elements: [
      {
        type: "paneldynamic",
        name: "panel",
        panelCount: 1,
        templateTitle: "title:{panel.q1}",
        templateElements: [
          {
            type: "text",
            name: "q1",
            title: "{panel.q2}",
          },
        ],
      },
    ],
  });
  var panel = <QuestionPanelDynamic>survey.getQuestionByName("panel");
  var q1 = panel.panels[0].getQuestionByName("q1");
  assert.equal(
    panel.panels[0].locTitle.renderedHtml,
    "title:",
    "initial text processing"
  );
  assert.equal(
    panel.panels[0].locTitle["koRenderedHtml"](),
    "title:",
    "initial text processing, ko"
  );
  q1.value = "q1-title";
  assert.equal(
    panel.panels[0].locTitle.renderedHtml,
    "title:q1-title",
    "Text processing on setting value"
  );
  assert.equal(
    panel.panels[0].locTitle["koRenderedHtml"](),
    "title:q1-title",
    "Text processing on setting value"
  );
});
QUnit.test("PanelDynamic and koRenderedHtml on text processing", function (
  assert
) {
  var json = {
    pages: [
      {
        navigationTitle: { default: "title1 en", de: "title1 de" },
        elements: [{ type: "text", name: "question1" }]
      },
      {
        navigationTitle: { default: "title2 en", de: "title2 de" },
        elements: [{ type: "text", name: "question1" }]
      }
    ]
  };
  var survey = new Survey(json);
  const page1 = survey.pages[0];
  const page2 = survey.pages[1];
  assert.equal(page1.locNavigationTitle["koRenderedHtml"](), "title1 en", "en - title1");
  assert.equal(page2.locNavigationTitle["koRenderedHtml"](), "title2 en", "en - title2");
  survey.locale = "de";
  assert.equal(page1.locNavigationTitle.text, "title1 de", "de text - title1");
  assert.equal(page2.locNavigationTitle.text, "title2 de", "de text - title2");
  assert.equal(page1.locNavigationTitle["koRenderedHtml"](), "title1 de", "de - title1");
  assert.equal(page2.locNavigationTitle["koRenderedHtml"](), "title2 de", "de - title2");
  survey.locale = "";
});
QUnit.test("koRenderedHtml: check onProcessHtml event", function (
  assert
) {
  const json = {
    "pages": [
      {
        "elements": [
          {
            "type": "html",
            "name": "question3",
            "html": "initial_html"
          }
        ]
      }
    ]
  };
  const survey = new Survey(json);
  survey.onProcessHtml.add((_, options) => {
    options.html = "processed_html";
  });
  const q = survey.getAllQuestions()[0];
  assert.equal(q.locHtml.koRenderedHtml(), "processed_html", "#onProcessHtml doesn't work with koRenderedHtml");
});
QUnit.test("Use variables as default values in expression", function (assert) {
  const survey = new Survey({
    elements: [
      {
        type: "text",
        name: "q2",
        title: "myB = {myB}",
        defaultValueExpression: "{myB}",
      },
      {
        type: "text",
        name: "q1",
        title: "myA = {myA}",
        defaultValueExpression: "{myA}",
      },

      {
        type: "text",
        name: "q3",
        title: "myC = {myC}",
        defaultValueExpression: "{myC}",
      },
    ]
  });
  const q1 = survey.getQuestionByName("q1");
  const q2 = survey.getQuestionByName("q2");
  const q3 = survey.getQuestionByName("q3");
  survey.setValue("myA", "AAA");
  survey.setValue("myB", "BBB");
  survey.setValue("myC", "CCC");
  assert.equal(q1.koValue(), "AAA", "q1.value");
  assert.equal(q2.koValue(), "BBB", "q2.value");
  assert.equal(q3.koValue(), "CCC", "q3.value");
});

QUnit.test("Check imagepicker's koGetItemClass method (designMode, multiSelect) - #6286", function (assert) {
  const survey: any = new Survey({
    elements: [
      {
        type: "imagepicker",
        name: "q1",
        choices: [
          {
            imageLink: "test_image",
            value: "test"
          }
        ]
      }
    ]
  });
  const q = survey.getQuestionByName("q1");
  survey.setDesignMode(true);
  survey.css = {
    imagepicker: {
      item: "",
      itemInline: "",
      itemChecked: "checked"
    }
  };
  const computed = ko.computed(() => {
    return q.koGetItemClass(q.choices[0]);
  });
  assert.equal(computed(), "");
  q.multiSelect = true;
  let log = "";
  computed.subscribe((value) => {
    log += `->${value}`;
  });
  q.defaultValue = ["test"];
  assert.equal(log, "->checked");
  q.defaultValue = [];
  assert.equal(log, "->checked->");
  q.defaultValue = ["->checked->->checked"];
});

QUnit.test("questionsOnPageMode change from questionPerPage to standard leads to empty page content", function (assert) {
  var json = {
    questionsOnPageMode: "questionPerPage",
    pages: [
      {
        name: "page1",
        elements: [
          {
            type: "radiogroup",
            name: "question1",
            choices: ["Item 1", "Item 2", "Item 3"]
          },
          {
            type: "radiogroup",
            name: "question2",
            choices: ["Item 1", "Item 2", "Item 3"]
          }
        ]
      },
      {
        name: "page2",
        elements: [
          {
            type: "radiogroup",
            name: "question3",
            choices: ["Item 1", "Item 2", "Item 3"]
          }
        ]
      }
    ]
  };
  const survey = new Survey(json);
  assert.equal(survey.pages[0].rows.length, 1, "one question");
  survey.questionsOnPageMode = "standard";
  assert.equal(survey.pages.length, 2, "There are two pages");
  assert.equal(survey.pages[0].elements.length, 2, "There are two questions on the first page");
  assert.equal(survey.pages[0].rows.length, 2, "two rows on the firts page");
});

QUnit.test("koProcessedCompletedHtml reacts on completedHtml changed", function (assert) {
  var json = {
    pages: [
      {
        name: "page1",
        elements: [
          {
            type: "radiogroup",
            name: "question1",
            choices: ["Item 1", "Item 2", "Item 3"]
          },
        ]
      },
    ]
  };
  const survey = new Survey(json) as any;
  assert.equal(survey.koProcessedCompletedHtml(), "<h3>Thank you for completing the survey</h3>", "empty");
  survey.doComplete();
  assert.equal(survey.koProcessedCompletedHtml(), "<h3>Thank you for completing the survey</h3>", "after complete");
  survey.completedHtml = "Changed text";
  assert.equal(survey.koProcessedCompletedHtml(), "Changed text", "Changed text");
});