import { SurveyTemplateText } from "../../src/knockout/templateText";

export default QUnit.module("Template Text");

class SurveyTemplateTextTest extends SurveyTemplateText {
  constructor(public template: string) {
    super();
  }
  protected get text(): string {
    return this.template;
  }
  protected set text(value: string) {
    this.template = value;
  }
}

QUnit.test("Replace the page", function(assert) {
  var template = new SurveyTemplateTextTest(
    '<script type="text/ html" id="survey-page">Test1</script>'
  );
  template.replaceText("MyTest", "page");
  assert.equal(
    template.template,
    '<script type="text/ html" id="survey-page">MyTest</script>',
    "the template page replaced correctly"
  );
});
QUnit.test("Replace the question", function(assert) {
  var template = new SurveyTemplateTextTest(
    '<script type="text/ html" id="survey-question">Test1</script>'
  );
  template.replaceText("MyTest", "question");
  assert.equal(
    template.template,
    '<script type="text/ html" id="survey-question">MyTest</script>',
    "the template question replaced correctly"
  );
});
QUnit.test("Replace the rating question", function(assert) {
  var template = new SurveyTemplateTextTest(
    '<script type="text/ html" id="survey-question-rating">Test1</script>'
  );
  template.replaceText("MyTest", "question", "rating");
  assert.equal(
    template.template,
    '<script type="text/ html" id="survey-question-rating">MyTest</script>',
    "the template question replaced correctly"
  );
});
