import Vue from "vue";
import { VueSurveyModel } from "../../src/vue/surveyModel";
import { Checkbox } from "../../src/vue/checkbox.vue";
export { OtherChoice } from "../../src/vue/otherChoice.vue";
import { QuestionCheckboxModel } from "../../src/question_checkbox";

export default QUnit.module("vueTests");

var surveyJSON = {
  pages: [
    {
      name: "page1",
      questions: [
        {
          name: "question1",
          type: "checkbox",
          hasOther: true,
          choices: [
            { value: "1", text: "first item" },
            { value: "2", text: "second item" },
            { value: "3", text: "third item" }
          ]
        }
      ]
    },
    {
      name: "page2",
      questions: [
        {
          name: "question2",
          type: "checkbox",
          choices: [
            { value: "1", text: "item1" },
            { value: "2", text: "item2" },
            { value: "3", text: "item3" }
          ]
        }
      ]
    }
  ]
};

QUnit.test("Survey.Checkbox initialization and values", assert => {
  var survey = new VueSurveyModel(surveyJSON);
  survey.data = { question1: ["second item"] };
  var question: QuestionCheckboxModel = <any>survey.pages[0].rows[0]
    .questions[0];

  assert.deepEqual(question.value, ["second item"]);

  const vm = new Checkbox();
  vm.question = question;
  vm.$mount();

  assert.deepEqual(question.value, ["second item"]);
  assert.deepEqual(vm.value, ["second item"]);

  vm.value = ["second item", "other"];
  assert.deepEqual(question.value, ["second item", "other"]);
});

QUnit.test("Survey.Checkbox question changed", assert => {
  var survey = new VueSurveyModel(surveyJSON);
  survey.data = { question1: ["second item"], question2: ["item1"] };
  var question1: QuestionCheckboxModel = <any>survey.pages[0].rows[0]
    .questions[0];
  var question2: QuestionCheckboxModel = <any>survey.pages[1].rows[0]
    .questions[0];

  const vm = new Checkbox();
  vm.question = question1;
  vm.$mount();

  assert.deepEqual(vm.value, ["second item"]);
  vm.question = question2;
  Vue.nextTick(() => {
    assert.deepEqual(vm.value, ["item1"]);
  });
});

QUnit.test("Survey.Checkbox question value in model has been changed", function(
  assert
) {
  var survey = new VueSurveyModel(surveyJSON);
  survey.data = { question1: ["second item"] };
  var question: QuestionCheckboxModel = <any>survey.pages[0].rows[0]
    .questions[0];

  const vm = new Checkbox();
  vm.question = question;
  vm.$mount();

  assert.deepEqual(vm.value, ["second item"]);

  question.value = ["third item", "other"];
  Vue.nextTick(() => {
    assert.deepEqual(vm.value, ["third item", "other"]);
  });
});
