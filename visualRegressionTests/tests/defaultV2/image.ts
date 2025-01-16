import { Selector, ClientFunction } from "testcafe";
import { url, frameworks, initSurvey, wrapVisualTest, takeElementScreenshot } from "../../helper";
import { imageSource } from "../../constants";

const title = "Image Screenshot";

fixture`${title}`.page`${url}`.beforeEach(async (t) => {

});

frameworks.forEach(framework => {
  fixture`${framework} ${title}`
    .page`${url}${framework}`;
  test("Check image question", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        showQuestionNumbers: "on",
        widthMode: "responsive",
        questions: [
          {
            type: "image",
            name: "image_question",
            imageWidth: "1024px",
            imageHeight: "465px",
            minWidth: "1024px",
            maxWidth: "1024px",
            width: "1024px",
            imageLink: imageSource
          },
        ]
      });
      const questionRoot = Selector(".sd-question--image");
      await takeElementScreenshot("image-question.png", questionRoot, t, comparer);
    });
  });
  test("Check image in-row question", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(800, 600);
      await initSurvey(framework, {
        showQuestionNumbers: "on",
        questions: [
          {
            type: "image",
            name: "image_question",
            imageWidth: "200px",
            imageHeight: "100px",
            imageLink: imageSource
          },
          {
            type: "image",
            name: "image_question",
            imageWidth: "200px",
            imageHeight: "100px",
            imageLink: imageSource,
            startWithNewLine: false
          },
        ]
      });
      const questionRoot = Selector(".sd-row");
      await takeElementScreenshot("image-question-row.png", questionRoot, t, comparer);
    });
  });
  test("Check image loading is broken", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(800, 600);
      await initSurvey(framework, {
        showQuestionNumbers: "on",
        questions: [
          {
            "type": "image",
            "name": "noimage",
            "imageLink": "https://surveyjs.io/Cos/image-picker/panda.jpg"
          }
        ]
      });
      const questionRoot = Selector(".sd-question--image");
      await takeElementScreenshot("image-not-load.png", questionRoot, t, comparer);
    });
  });
  test("Check image question responsive width when image is located in row with multiple elements", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(800, 600);
      await initSurvey(framework, {
        showQuestionNumbers: "on",
        "questions": [
          {
            "type": "text",
            "name": "q1",
          },
          {
            "type": "image",
            "name": "q2",
            "imageLink": "http://localhost:8080/testCafe/resources/small_Dashka.jpg",
            "startWithNewLine": false
          }
        ]
      });
      const questionRoot = Selector(".sd-row");
      await takeElementScreenshot("image-in-row.png", questionRoot, t, comparer);
    });
  });
});