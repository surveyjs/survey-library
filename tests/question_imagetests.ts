import { QuestionImageModel } from "../src/question_image";
import { SurveyModel } from "../src/survey";

QUnit.test("Check image rendered mode", function (assert) {
  const question = new QuestionImageModel("q1");
  assert.equal(question.contentMode, "auto");
  assert.equal(question.renderedMode, "image");
  question.contentMode = "video";
  assert.equal(question.renderedMode, "video");
  question.contentMode = "youtube";
  assert.equal(question.renderedMode, "youtube");
  question.contentMode = "image";
  assert.equal(question.renderedMode, "image");
  question.contentMode = "video";
  assert.equal(question.renderedMode, "video");
  question.contentMode = "auto";
  assert.equal(question.renderedMode, "image");
});
QUnit.test("Check video rendered mode onSurveyLoading", function (assert) {
  const survey = new SurveyModel({
    elements: [
      {
        type: "image",
        name: "q",
        contentMode: "video"
      }
    ]
  });
  const question = <QuestionImageModel>survey.getAllQuestions()[0];
  assert.equal(question.renderedMode, "video");
});
QUnit.test("Check youtube video rendered mode", function (assert) {
  const question = new QuestionImageModel("q1");
  question.imageLink = "https://www.youtube.com/embed/tgbNymZ7vqY";
  assert.equal(question.renderedMode, "youtube");
  question.imageLink = "abcd";
  assert.equal(question.renderedMode, "image");
  question.imageLink = "https://youtu.be/tgbNymZ7vqY";
  assert.equal(question.renderedMode, "youtube");
});
QUnit.test("Check NOT youtube video rendered mode", function (assert) {
  const question = new QuestionImageModel("q1");
  question.imageLink = "videoUrl.mov";
  assert.equal(question.renderedMode, "video");
  question.imageLink = "abcd";
  assert.equal(question.renderedMode, "image");
  question.imageLink = "videoUrl.avi";
  assert.equal(question.renderedMode, "video");
});