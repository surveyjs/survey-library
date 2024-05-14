import { Selector, ClientFunction } from "testcafe";
import { url, frameworks, initSurvey, url_test, resetFocusToBody, wrapVisualTest, takeElementScreenshot } from "../../helper";
import { imageSource } from "../../constants";

const title = "Image Screenshot";

fixture`${title}`.page`${url}`.beforeEach(async (t) => {

});

const applyTheme = ClientFunction(theme => {
  (<any>window).Survey.StylesManager.applyTheme(theme);
});

const theme = "defaultV2";

frameworks.forEach(framework => {
  fixture`${framework} ${title} ${theme}`.page`${url_test}${theme}/${framework}`.beforeEach(async t => {
    await applyTheme(theme);
  });
  test("Check imagepicker checked item", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1500);
      await initSurvey(framework, {
        showQuestionNumbers: "off",
        widthMode: "static",
        questions: [
          {
            type: "imagepicker",
            name: "choosepicture",
            title: "Imagepicker",
            defaultValue: "lion",
            choices: [{
              value: "lion",
              imageLink: "https://surveyjs.io/Content/Images/examples/image-picker/lion.jpg"
            },
            {
              value: "giraffe",
              imageLink: "https://surveyjs.io/Content/Images/examples/image-picker/giraffe.jpg"
            },
            {
              value: "panda",
              imageLink: "https://surveyjs.io/Content/Images/examples/image-picker/panda.jpg"
            },
            {
              value: "camel",
              imageLink: "https://surveyjs.io/Content/Images/examples/image-picker/camel.jpg"
            },
            ]
          }
        ]
      });
      await resetFocusToBody();
      await t.wait(1000);
      await takeElementScreenshot("imagepicker-checked-item.png", Selector(".sd-question"), t, comparer);
    });
  });
  test("Check responsive imagepicker", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1500);
      await initSurvey(framework, {
        showQuestionNumbers: "off",
        widthMode: "responsive",
        questions: [
          {
            type: "imagepicker",
            name: "choosepicture",
            title: "Imagepicker",
            choices: [{
              value: "lion",
              imageLink: "https://surveyjs.io/Content/Images/examples/image-picker/lion.jpg"
            },
            {
              value: "giraffe",
              imageLink: "https://surveyjs.io/Content/Images/examples/image-picker/giraffe.jpg"
            },
            {
              value: "panda",
              imageLink: "https://surveyjs.io/Content/Images/examples/image-picker/panda.jpg"
            },
            {
              value: "camel",
              imageLink: "https://surveyjs.io/Content/Images/examples/image-picker/camel.jpg"
            },
            ]
          }
        ]
      });
      await resetFocusToBody();
      await t.wait(1000);
      await takeElementScreenshot("imagepicker-responsive-max.png", Selector(".sd-question"), t, comparer);
      await t.resizeWindow(700, 1500);
      await takeElementScreenshot("imagepicker-responsive-medium.png", Selector(".sd-question"), t, comparer);
      await t.resizeWindow(500, 1500);
      await takeElementScreenshot("imagepicker-responsive-min.png", Selector(".sd-question"), t, comparer);
    });
  });

  test("Check image picker responsive, colCount !== 0", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1500);
      await initSurvey(framework, {
        showQuestionNumbers: "off",
        widthMode: "responsive",
        questions: [
          {
            type: "imagepicker",
            name: "choosepicture",
            title: "Imagepicker",
            colCount: 3,
            choices: [{
              value: "lion",
              imageLink: "https://surveyjs.io/Content/Images/examples/image-picker/lion.jpg"
            },
            {
              value: "giraffe",
              imageLink: "https://surveyjs.io/Content/Images/examples/image-picker/giraffe.jpg"
            },
            {
              value: "panda",
              imageLink: "https://surveyjs.io/Content/Images/examples/image-picker/panda.jpg"
            },
            {
              value: "camel",
              imageLink: "https://surveyjs.io/Content/Images/examples/image-picker/camel.jpg"
            },
            ]
          }
        ]
      });
      await resetFocusToBody();
      await t.wait(1000);
      await takeElementScreenshot("imagepicker-responsive-col-count-3.png", Selector(".sd-question"), t, comparer);
      await ClientFunction(() => { (<any>window).survey.getAllQuestions()[0].colCount = 1; })();
      await takeElementScreenshot("imagepicker-responsive-col-count-1.png", Selector(".sd-question"), t, comparer);
    });
  });

  test("Check image picker question", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        "elements": [
          {
            "type": "imagepicker",
            "name": "question2",
            "choices": [
              {
                "value": "lion",
                "imageLink": imageSource
              },
              "item1"
            ],
            imageWidth: 200,
            imageHeight: 150,
            "imageFit": "cover"
          }
        ]
      });
      const questionRoot = Selector(".sd-imagepicker");
      await takeElementScreenshot("imagepicker-question.png", questionRoot, t, comparer);
    });
  });
  test("Check image picker loading is broken", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(800, 600);
      await initSurvey(framework, {
        questions: [
          {
            "type": "imagepicker",
            "name": "question1",
            "choices": [
              {
                "value": "Image 1",
                "imageLink": "https://surveyjs.io/Content/Images/examples/image-picker/lion.jpg"
              },
              {
                "value": "Image 2",
              },
              {
                "value": "Image 3",
                "imageLink": "https://surveyjs.io/Cos/image-picker/panda.jpg"
              },
              {
                "value": "Image 4",
                "imageLink": "https://surveyjs.io/Content/Images/examples/image-picker/camel.jpg"
              }
            ]
          }
        ]
      });
      const questionRoot = Selector(".sd-imagepicker");
      await takeElementScreenshot("imagepicker-not-load.png", questionRoot, t, comparer);
    });
  });
  test("Check image picker columns and long label text", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, {
        "logoPosition": "right",
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "imagepicker",
                "name": "best_picture",
                "title": "Which movie do you believe should have won the Academy Award for Best Picture?",
                "hideNumber": true,
                "choices": [
                  {
                    "value": "movie_1",
                    "text": "The Holdovers",
                    "imageLink": "https://surveyjs.io/Content/Images/examples/image-picker/panda.jpg"
                  },
                  {
                    "value": "movie_2",
                    "text": "American Fiction",
                    "imageLink": "https://surveyjs.io/Content/Images/examples/image-picker/panda.jpg"
                  },
                  {
                    "value": "movie_3",
                    "text": "Oppenheimer",
                    "enableIf": "{trailer-follow-up} = 3",
                    "imageLink": "https://surveyjs.io/Content/Images/examples/image-picker/panda.jpg"
                  },
                  {
                    "value": "movie_4",
                    "text": "Barbie",
                    "imageLink": "https://surveyjs.io/Content/Images/examples/image-picker/panda.jpg"
                  },
                  {
                    "value": "movie_5",
                    "text": "Poor Things",
                    "imageLink": "https://surveyjs.io/Content/Images/examples/image-picker/panda.jpg"
                  },
                  {
                    "value": "movie_6",
                    "text": "Past Lives",
                    "imageLink": "https://surveyjs.io/Content/Images/examples/image-picker/panda.jpg"
                  },
                  {
                    "value": "movie_7",
                    "text": "Killers of the Flower Moon",
                    "imageLink": "https://surveyjs.io/Content/Images/examples/image-picker/panda.jpg"
                  },
                  {
                    "value": "movie_8",
                    "text": "Maestro",
                    "imageLink": "https://surveyjs.io/Content/Images/examples/image-picker/panda.jpg"
                  },
                  {
                    "value": "movie_9",
                    "text": "Anatomy of a Fall",
                    "imageLink": "https://surveyjs.io/Content/Images/examples/image-picker/panda.jpg"
                  },
                  {
                    "value": "movie_10",
                    "text": "The Zone of Interest",
                    "imageLink": "https://surveyjs.io/Content/Images/examples/image-picker/panda.jpg"
                  }
                ],
                "colCount": 5,
                "imageHeight": 220,
                "imageWidth": 220,
                "showLabel": true,
                "multiSelect": true
              },
            ]
          }
        ],
        "showQuestionNumbers": "off",
        "width": "1000",
        "widthMode": "static"
      });
      const questionRoot = Selector(".sd-imagepicker");
      await takeElementScreenshot("imagepicker-question-columns-long-label.png", questionRoot, t, comparer);
    });
  });
});
