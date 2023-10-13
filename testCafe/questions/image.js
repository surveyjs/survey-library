import { Selector, fixture, test } from "testcafe";
import { frameworks, url, initSurvey, getSurveyResult, getQuestionValue, getQuestionJson, checkSurveyWithEmptyQuestion } from "../helper";
const title = "image";

const json = {
  questions: [
    {
      type: "image",
      name: "image",
      imageLink: "https://surveyjs.io/Content/Images/examples/image-picker/lion.jpg"
    },
    {
      type: "image",
      name: "video",
      imageLink: "https://surveyjs.io/Content/Images/examples/image-picker/lion.avi"
    },
    {
      type: "image",
      name: "youtube",
      imageLink: "https://www.youtube.com/embed/tgbNymZ7vqY"
    }
  ]
};

frameworks.forEach(framework => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async t => {
      await initSurvey(framework, json);
    }
  );

  function SelectorByNumber(questionNumber) {
    return Selector(".sv_body .sv_row")
      .nth(questionNumber)
      .find(".sv_qstn")
      .find(".sv_q_image");
  }

  test("Check image question layout", async t => {
    await t
      .expect(SelectorByNumber(0).child("img").exists).ok()
      .expect(SelectorByNumber(1).child("video").exists).ok()
      .expect(SelectorByNumber(2).child("iframe").exists).ok();

  });
});