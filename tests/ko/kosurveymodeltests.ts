import { JsonObject } from "../../src/jsonobject";
import { QuestionRating } from "../../src/knockout/koquestion_rating";
import { Survey } from "../../src/knockout/kosurvey";
import { Page } from "../../src/knockout/kopage";
import { QuestionText } from "../../src/knockout/koquestion_text";
import { QuestionCheckbox } from "../../src/knockout/koquestion_checkbox";

export default QUnit.module("koTests");

QUnit.test("Serialize two pages", function(assert) {
  var survey = new Survey();
  survey.addNewPage("Page 1");
  survey.addNewPage("Page 2");
  assert.ok(survey.pages[0].rows, "creates the koPage class");
  var jsObj = new JsonObject().toJsonObject(survey);
  assert.equal(
    JSON.stringify(jsObj),
    '{"pages":[{"name":"Page 1"},{"name":"Page 2"}]}',
    "serialize two pages"
  );
});
QUnit.test("Deserialize two pages", function(assert) {
  var survey = new Survey();
  new JsonObject().toObject(
    { pages: [{ name: "Page1" }, { name: "Page2" }] },
    survey
  );
  assert.equal(survey.pages.length, 2, "Two pages from json");
  assert.ok(survey.pages[0].rows, "creates the koPage class");
});
QUnit.test("Deserialize rate widget, custom rateValues", function(assert) {
  var survey = new Survey();
  new JsonObject().toObject(
    {
      pages: [
        {
          questions: [
            {
              type: "rating",
              name: "question7",
              rateValues: [{ value: "1", text: "A" }, "B", "C", "D"],
            },
          ],
        },
      ],
    },
    survey
  );
  var question = <QuestionRating>survey.pages[0].questions[0];
  assert.equal(
    question.visibleRateValues[1].value,
    "B",
    "correctly deserialized"
  );
});

QUnit.test("Create rows", function(assert) {
  var survey = new Survey();
  new JsonObject().toObject(
    {
      questions: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2" },
      ],
    },
    survey
  );
  var page = <Page>survey.currentPage;
  assert.equal(page.rows.length, 2, "There are two rows");
});

QUnit.test("Change value onValueChanged", function(assert) {
  var survey = new Survey();
  var page = survey.addNewPage("p1");
  var q = <QuestionText>page.addNewQuestion("text", "q1");
  survey.onValueChanged.add(function(sender, options) {
    if (options.value === "aaa") {
      options.question.value = "bbb";
    }
  });
  q.value = "aaa";
  assert.equal(q.value, "bbb", "value is 'bbb'");
  assert.equal(q.value, "bbb", "value is 'bbb'");
});
QUnit.test("Change checkbox value onValueChanged, Bug#881", function(assert) {
  var survey = new Survey();
  var page = survey.addNewPage("p1");
  var q = <QuestionCheckbox>page.addNewQuestion("checkbox", "q1");
  q.choices = [1, 2, 3, 4, 5];
  survey.onValueChanged.add(function(sender, options) {
    if (options.value && options.value.length > 2) {
      options.value.shift();
      options.question.value = options.value;
    }
  });
  q.value = [1, 2, 3];
  assert.deepEqual(q.value, [2, 3], "value is [2, 3]");
  assert.deepEqual(q.value, [2, 3], "value is [2, 3]");
});

QUnit.test(
  "Checkbox hasNone, bug https://surveyjs.answerdesk.io/ticket/details/T1593",
  function(assert) {
    var json = {
      elements: [
        {
          type: "checkbox",
          name: "q1",
          hasNone: true,
          choices: [1, 2, 3, 4, 5],
        },
      ],
    };
    var survey = new Survey(json);
    var q = <QuestionCheckbox>survey.getQuestionByName("q1");
    q.koValue([1, 2]);
    assert.deepEqual(q.value, [1, 2], "values");
    assert.deepEqual(q.koValue(), [1, 2], "ko values");
    q.koValue([1, 2, "none"]);
    assert.deepEqual(q.value, ["none"], "we keep only none");
    assert.deepEqual(q.koValue(), ["none"], "ko values is none");
    q.koValue([1, "none"]);
    assert.deepEqual(q.value, [1], "none should gone");
    assert.deepEqual(q.koValue(), [1], "ko values none should gone");
    q.koValue([1, "none"]);
    assert.deepEqual(q.value, ["none"], "we keep only none");
    assert.deepEqual(q.koValue(), ["none"], "ko values keeps none");
  }
);
QUnit.test(
  "Checkbox hasNone, bug https://surveyjs.answerdesk.io/ticket/details/T1593 (from model)",
  function(assert) {
    var json = {
      elements: [
        {
          type: "checkbox",
          name: "q1",
          hasNone: true,
          choices: [1, 2, 3, 4, 5],
        },
      ],
    };
    var survey = new Survey(json);
    var q = <QuestionCheckbox>survey.getQuestionByName("q1");
    q.value = [1, 2];
    assert.deepEqual(q.value, [1, 2], "values");
    assert.deepEqual(q.koValue(), [1, 2], "ko values");
    q.value = [1, 2, "none"];
    assert.deepEqual(q.value, ["none"], "we keep only none");
    assert.deepEqual(q.koValue(), ["none"], "ko values is none");
    q.value = [1, "none"];
    assert.deepEqual(q.value, [1], "none should gone");
    assert.deepEqual(q.koValue(), [1], "ko values none should gone");
    q.value = [1, "none"];
    assert.deepEqual(q.value, ["none"], "we keep only none");
    assert.deepEqual(q.koValue(), ["none"], "ko values keeps none");
  }
);
QUnit.test("checkbox and valuePropertyName", (assert) => {
  const survey = new Survey({
    elements: [
      {
        type: "checkbox",
        name: "q1",
        choices: ["apple", "banana", "orange"],
      }
    ]
  });
  const q = <QuestionCheckbox>survey.getQuestionByName("q1");
  q.valuePropertyName = "fruit";
  q.koValue(["apple"]);
  assert.deepEqual(q.value, [{ fruit: "apple" }], "#1");
  assert.deepEqual(q.koValue(), ["apple"], "#2");
  assert.equal(q.isItemSelected(q.choices[0]), true, "#2.1");
  assert.equal(q.isItemSelected(q.choices[1]), false, "#2.2");
  assert.equal(q.isItemSelected(q.choices[2]), false, "#2.3");
  q.value = [{ fruit: "apple" }, { fruit: "orange" }];
  assert.deepEqual(q.koValue(), ["apple", "orange"], "#3");
  assert.deepEqual(survey.data, { q1: [{ fruit: "apple" }, { fruit: "orange" }] }, "convert to data correctly, #4");
  assert.equal(q.isItemSelected(q.choices[0]), true, "#3.1");
  assert.equal(q.isItemSelected(q.choices[1]), false, "#3.2");
  assert.equal(q.isItemSelected(q.choices[2]), true, "#3.3");
  survey.doComplete();
  assert.deepEqual(survey.data, { q1: [{ fruit: "apple" }, { fruit: "orange" }] }, "survey.data is correct on complete, #5");
});
QUnit.test(
  "Do not change currentPage on calculating expressions, Bug T3455",
  function(assert) {
    var survey = new Survey({
      pages: [
        {
          name: "page1",
          elements: [
            {
              type: "html",
              name: "question5",
              html: "Page 1",
            },
            {
              type: "radiogroup",
              name: "question1",
              title: "What do you want to do?",
              choices: [
                {
                  value: "item1",
                  text: "Goto Page 3",
                },
                {
                  value: "item2",
                  text: "Goto Page 2 (Hide Page 1)",
                },
              ],
            },
          ],
          visibleIf: "{question1} <> 'item2'",
        },
        {
          name: "page2",
          elements: [
            {
              type: "html",
              name: "question2",
              html: "Page 2",
            },
          ],
          visibleIf: "{question1} = 'item2'",
        },
        {
          name: "page3",
          elements: [
            {
              type: "html",
              name: "question3",
              html: "Page 3",
            },
          ],
        },
      ],
    });
    assert.equal(survey.currentPage.name, "page1", "The first page is showing");
    survey.getQuestionByName("question1").value = "item2";
    assert.equal(
      survey.currentPage.name,
      "page2",
      "Show the second page and make it current"
    );
  }
);
