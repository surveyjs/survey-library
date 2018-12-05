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
              rateValues: [{ value: "1", text: "A" }, "B", "C", "D"]
            }
          ]
        }
      ]
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
    { questions: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }] },
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
    if (options.value == "aaa") {
      options.question.value = "bbb";
    }
  });
  q["koValue"]("aaa");
  assert.equal(q.value, "bbb", "value is 'bbb'");
  assert.equal(q["koValue"](), "bbb", "koValue() is 'bbb'");
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
  q["koValue"]([1, 2, 3]);
  assert.deepEqual(q.value, [2, 3], "value is [2, 3]");
  assert.deepEqual(q["koValue"](), [2, 3], "value is [2, 3]");
});
