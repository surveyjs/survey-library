import { QuestionImageModel } from "../src/question_image";
import { SurveyModel } from "../src/survey";

import { describe, test, expect } from "vitest";
test("Check image rendered mode", () => {
  const question = new QuestionImageModel("q1");
  expect(question.contentMode).toBe("auto");
  expect(question.renderedMode).toBe("image");
  question.contentMode = "video";
  expect(question.renderedMode).toBe("video");
  question.contentMode = "youtube";
  expect(question.renderedMode).toBe("youtube");
  question.contentMode = "image";
  expect(question.renderedMode).toBe("image");
  question.contentMode = "video";
  expect(question.renderedMode).toBe("video");
  question.contentMode = "auto";
  expect(question.renderedMode).toBe("image");
});
test("Check video rendered mode onSurveyLoading", () => {
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
  expect(question.renderedMode).toBe("video");
});
test("Check youtube video rendered mode", () => {
  const question = new QuestionImageModel("q1");
  question.imageLink = "https://www.youtube.com/embed/tgbNymZ7vqY";
  expect(question.renderedMode).toBe("youtube");
  question.imageLink = "https://youtube.com/embed/tgbNymZ7vqY";
  expect(question.renderedMode).toBe("youtube");
  question.imageLink = "m.youtube.com/embed/tgbNymZ7vqY";
  expect(question.renderedMode).toBe("youtube");
  question.imageLink = "youtube.com/embed/tgbNymZ7vqY";
  expect(question.renderedMode).toBe("youtube");
  question.imageLink = "youtu.be/tgbNymZ7vqY";
  expect(question.renderedMode).toBe("youtube");
  question.imageLink = "youtu.bee/tgbNymZ7vqY";
  expect(question.renderedMode).toBe("image");
  question.imageLink = "javascript:(alert('youtu.be'))";
  expect(question.renderedMode).toBe("image");
  question.imageLink = "abcd";
  expect(question.renderedMode).toBe("image");
  question.imageLink = "https://youtu.be/tgbNymZ7vqY";
  expect(question.renderedMode).toBe("youtube");
});
test("Check NOT youtube video rendered mode", () => {
  const question = new QuestionImageModel("q1");
  question.imageLink = "videoUrl.mov";
  expect(question.renderedMode).toBe("video");
  question.imageLink = "abcd";
  expect(question.renderedMode).toBe("image");
  question.imageLink = "videoUrl.avi";
  expect(question.renderedMode).toBe("video");
});
test("Check youtube video imagelink", () => {
  const question = new QuestionImageModel("q1");
  question.contentMode = "youtube";
  question.imageLink = "https://www.youtube.com/embed/tgbNymZ7vqY";
  expect(question.locImageLink.renderedHtml).toBe("https://www.youtube.com/embed/tgbNymZ7vqY");
  question.imageLink = "javascript:alert('a')";
  expect(question.locImageLink.renderedHtml).toBe("");
  question.imageLink = "https://youtu.be/tgbNymZ7vqY";
  expect(question.locImageLink.renderedHtml).toBe("https://www.youtube.com/embed/tgbNymZ7vqY");
  question.imageLink = "javascript:alert('youtube.com')";
  expect(question.locImageLink.renderedHtml).toBe("");
  question.imageLink = "youtube.com.org";
  expect(question.locImageLink.renderedHtml).toBe("");

  question.contentMode = "image";
  question.imageLink = "videoUrl.mov";
  expect(question.locImageLink.renderedHtml).toBe("videoUrl.mov");
});

test("Image adaptive mode", () => {
  const json = {
    elements: [
      {
        type: "image",
        name: "q1"
      },
    ],
  };
  const survey = new SurveyModel(json);
  const question: QuestionImageModel = <any>survey.getQuestionByName("q1");

  question.cssClasses.image = "css_image";
  question.cssClasses.adaptive = "css_adaptive";
  expect(question.getImageCss()).toBe("css_image css_adaptive");

  question.imageWidth = "201";
  question.imageHeight = "150";
  expect(question.getImageCss()).toBe("css_image");

  question.imageWidth = "200";
  question.imageHeight = "151";
  expect(question.getImageCss()).toBe("css_image");

  question.imageWidth = "201";
  question.imageHeight = "151";
  expect(question.getImageCss()).toBe("css_image");

  question.imageWidth = "200";
  question.imageHeight = "150";
  expect(question.getImageCss()).toBe("css_image css_adaptive");
});
test("Image question correct youtube url", () => {
  let question = new QuestionImageModel("q1");
  question.imageLink = "https://youtu.be/-5CdAup0o-I";
  expect(question.locImageLink.renderedHtml).toBe("https://www.youtube.com/embed/-5CdAup0o-I");
  question.imageLink = "https://www.youtube.com/watch?v=-5CdAup0o-I2";
  expect(question.locImageLink.renderedHtml).toBe("https://www.youtube.com/embed/-5CdAup0o-I2");
  const json = {
    elements: [
      {
        type: "image",
        name: "q1",
        imageLink: "https://www.youtube.com/watch?v=-5CdAup0o-I3"
      },
    ],
  };
  const survey = new SurveyModel(json);
  question = <any>survey.getQuestionByName("q1");
  expect(question.locImageLink.renderedHtml).toBe("https://www.youtube.com/embed/-5CdAup0o-I3");
});

test("Image question: check image size css values", () => {
  const json = {
    elements: [
      {
        type: "image",
        name: "q1",
        imageWidth: 200,
        imageHeight: 400
      },
    ],
  };
  const survey = new SurveyModel(json);
  const question = <QuestionImageModel>survey.getAllQuestions()[0];
  expect(question.renderedHeight).toBe(400);
  expect(question.renderedWidth).toBe(200);

  expect(question.renderedStyleHeight).toBe(undefined);
  expect(question.renderedStyleWidth).toBe(undefined);

  question.imageHeight = "500px";
  question.imageWidth = "300px";
  expect(question.renderedHeight).toBe(500);
  expect(question.renderedWidth).toBe(300);

  expect(question.renderedStyleHeight).toBe(undefined);
  expect(question.renderedStyleWidth).toBe(undefined);

  question.imageHeight = "50%";
  question.imageWidth = "100%";
  expect(question.renderedHeight).toBe(undefined);
  expect(question.renderedWidth).toBe(undefined);

  expect(question.renderedStyleHeight).toBe("50%");
  expect(question.renderedStyleWidth).toBe("100%");

  question.imageHeight = "250";
  question.imageWidth = "400";
  expect(question.renderedHeight).toBe(250);
  expect(question.renderedWidth).toBe(400);

  expect(question.renderedStyleHeight).toBe(undefined);
  expect(question.renderedStyleWidth).toBe(undefined);

});