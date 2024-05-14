/* eslint-disable indent */
import { Selector, ClientFunction } from "testcafe";
import { url, frameworks, initSurvey, url_test, wrapVisualTest, takeElementScreenshot, resetFocusToBody } from "../../helper";

const title = "File Screenshot";

fixture`${title}`.page`${url}`.beforeEach(async (t) => {

});

const applyTheme = ClientFunction(theme => {
  (<any>window).Survey.StylesManager.applyTheme(theme);
});

const theme = "defaultV2";
const json = {
  showQuestionNumbers: "off",
  width: "900px",
  questions: [{
    type: "file",
    title: "Upload everything what you’d like to.",
    name: "file_question",
    minWidth: "704px",
    width: "704px",
    maxWidth: "704px",
  }]
};
function onOpenFileChooserHandler(s, o) {
  var files = [];
  for (var i = 0; i < o.input.files.length; i++) {
    files.push(o.input.files[i]);
  }
  o.callback(files);
}

frameworks.forEach(framework => {
  fixture`${framework} ${title} ${theme}`
    .page`${url_test}${theme}/${framework}`.beforeEach(async t => {
      await applyTheme(theme);
      await initSurvey(framework, json, { onOpenFileChooser: onOpenFileChooserHandler });
      await ClientFunction(() => {
        document.body.focus();
      })();
    });

  test("Check file question", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await t.setFilesToUpload(Selector(".sd-file input"), ["files/SingleImage.jpg"]);
      await t.click(".sd-file input[type=file] + div label");

      const questionRoot = Selector(".sd-question");
      await takeElementScreenshot("file-question-single-image.png", questionRoot, t, comparer);
      await t.setFilesToUpload(Selector(".sd-file input"), ["files/Flamingo.png"]);
      await t.click(".sd-file input[type=file] + div label");
      await takeElementScreenshot("file-question-single-file-small-image.png", questionRoot, t, comparer);
      await t.setFilesToUpload(Selector(".sd-file input"), ["files/Portfolio.pdf"]);
      await t.click(".sd-file input[type=file] + div label");
      await takeElementScreenshot("file-question-single-file.png", questionRoot, t, comparer);
      await ClientFunction(() => {
        const question = (window as any).survey.getQuestionByName("file_question");
        question.allowMultiple = true;
        question.clear();
      })();
      await t.setFilesToUpload(Selector(".sd-file input"), ["files/Badger.png", "files/Bird.png", "files/Read Me.txt", "files/Flamingo.png"]);
      await t.click(".sd-file input[type=file] + div label");
      await takeElementScreenshot("file-question-multiple.png", questionRoot, t, comparer);
      await t
        .setFilesToUpload(Selector(".sd-file input"), ["files/SingleImage.jpg"])
        .click(".sd-file input[type=file] + div label")
        .click(Selector(".sd-file #prevPage"));
      await takeElementScreenshot("file-question-multiple-navigator.png", questionRoot, t, comparer);
    });
  });

  test("Check file question icon size", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      const questionRoot = Selector(".sd-question");
      await t.setFilesToUpload(Selector(".sd-file input"), ["files/Portfolio.pdf"]);
      await t.click(".sd-file input[type=file] + div label");
      await ClientFunction(() => {
        (<any>window).survey.headerView = "advanced";
        (<any>window).survey.applyTheme({
          cssVariables: {
            "--sjs-base-unit": "16px"
          },
          header: {
          }
        });
      })();
      await takeElementScreenshot("file-question-single-file-scaled.png", questionRoot, t, comparer);
    });
  });

  test("Check file question with imageWidth/height", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await ClientFunction(() => {
        const question = (window as any).survey.getQuestionByName("file_question");
        question.imageWidth = "100px";
        question.imageHeight = "100px";
      })();
      await t.setFilesToUpload(Selector(".sd-file input"), ["files/SingleImage.jpg"]);
      await t.click(".sd-file input[type=file] + div label");
      const questionRoot = Selector(".sd-question");
      await takeElementScreenshot("file-question-single-small-image.png", questionRoot, t, comparer);

      await ClientFunction(() => {
        const question = (window as any).survey.getQuestionByName("file_question");
        question.imageWidth = "1920px";
        question.imageHeight = "1080px";
      })();
      await takeElementScreenshot("file-question-single-big-image.png", questionRoot, t, comparer);

      await ClientFunction(() => {
        const question = (window as any).survey.getQuestionByName("file_question");
        question.allowMultiple = true;
        question.imageWidth = "50px";
        question.imageHeight = "50px";
        question.clear();
      })();
      await t.setFilesToUpload(Selector(".sd-file input"), ["files/Badger.png", "files/Bird.png", "files/Flamingo.png"]);
      await t.click(".sd-file input[type=file] + div label");
      await takeElementScreenshot("file-question-multiple-small-images.png", questionRoot, t, comparer);

      await ClientFunction(() => {
        const question = (window as any).survey.getQuestionByName("file_question");
        question.allowMultiple = true;
        question.imageWidth = "1920px";
        question.imageHeight = "1080px";
      })();
      await takeElementScreenshot("file-question-multiple-big-images.png", questionRoot, t, comparer);
    });
  });

  test("Check file question - long names", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await ClientFunction(() => {
        const question = (window as any).survey.getQuestionByName("file_question");
        question.allowMultiple = true;
        question.value = [
          {
            "name": "item2_very_long_name_that_i_could_not_even_imagine_for_that_moment_and_to_be_honest_it_will_be_really_the_longest_file_name_in_the_world_really_really_lond_i_believe.pdf",
            "type": "application/x-zip-compressed",
            "content": "#item1.zip"
          }];
      })();

      const questionRoot = Selector(".sd-question");
      await takeElementScreenshot("file-question-long-name.png", questionRoot, t, comparer);
    });
  });

  test("Check file question - long names large font", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await ClientFunction(() => {
        const question = (window as any).survey.getQuestionByName("file_question");
        question.allowMultiple = true;

        (<any>window).survey.applyTheme({
          cssVariables: {
            "--sjs-font-size": "20px"
          }
        });

        question.value = [
          {
            "name": "item2_very_long_name_that_i_could_not_even_imagine_for_that_moment_and_to_be_honest_it_will_be_really_the_longest_file_name_in_the_world_really_really_lond_i_believe.pdf",
            "type": "application/x-zip-compressed",
            "content": "#item1.zip"
          }];
      })();

      const questionRoot = Selector(".sd-question");
      await takeElementScreenshot("file-question-long-name-font.png", questionRoot, t, comparer);
    });
  });
  test("Check file question mobile mode", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      await ClientFunction(() => {
        (window as any).survey.width = undefined;
        (window as any).survey.resizeObserver.disconnect();
        (window as any).survey.setIsMobile(false);
        (window as any).survey.getAllQuestions()[0].resizeObserver.disconnect();
        (window as any).survey.getAllQuestions()[0].processResponsiveness = () => { };
        (window as any).survey.getAllQuestions()[0].pageSize = 1;
        (window as any).survey.getAllQuestions()[0].setIsMobile(true);
      })();
      await t.setFilesToUpload(Selector(".sd-file input"), ["files/SingleImage.jpg"]);
      await t.click(".sd-file input[type=file] + div label");
      const questionRoot = Selector(".sd-question");
      await ClientFunction(() => {
        const question = (window as any).survey.getQuestionByName("file_question");
        question.allowMultiple = true;
        question.clear();
      })();
      await t.setFilesToUpload(Selector(".sd-file input"), ["files/Badger.png", "files/Bird.png", "files/Read Me.txt", "files/Flamingo.png"]);
      await t.click(".sd-file input[type=file] + div label");
      await ClientFunction(() => {
        const question = (window as any).survey.getQuestionByName("file_question");
        question.indexToShow = 0;
        question.fileIndexAction.title = question.getFileIndexCaption();
      })();
      await takeElementScreenshot("file-question-multiple-mobile.png", questionRoot, t, comparer);

      await t.click(Selector(".sd-file #nextPage"));
      await takeElementScreenshot("file-question-multiple-mobile-next.png", questionRoot, t, comparer);
      await t.click(Selector(".sd-file #prevPage"));
      await t.click(Selector(".sd-file #prevPage"));
      await takeElementScreenshot("file-question-multiple-mobile-prev.png", questionRoot, t, comparer);
    });
  });
  test("Check file question uploading", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1920, 1080);
      const questionRoot = Selector(".sd-question");
      await ClientFunction(() => {
        const question = (window as any).survey.getQuestionByName("file_question");
        question.isUploading = true;
      })();
      await ClientFunction(() => {
        (<HTMLElement>document.querySelector(".sd-loading-indicator .sv-svg-icon")).style.animation = "none";
      })();
      await takeElementScreenshot("file-uploading.png", questionRoot, t, comparer);
    });
  });
});
frameworks.forEach(framework => {
  fixture`${framework} ${title} ${theme}`
    .page`${url_test}${theme}/${framework}`.beforeEach(async t => {
    });
  test("Check file question placeholder mobile", async t => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(600, 1000);
      await initSurvey(framework, {
        showQuestionNumbers: "off",
        questions: [{
          type: "file",
          title: "Upload everything what you’d like to.",
          name: "file_question",
        }, { onOpenFileChooser: onOpenFileChooserHandler }]
      });
      await resetFocusToBody();
      const questionRoot = Selector(".sd-question");
      await takeElementScreenshot("file-question-placeholder-mobile.png", questionRoot, t, comparer);
    });
  });

  test("Check file question different width", async t => {
    await wrapVisualTest(t, async (t, comparer) => {
      await initSurvey(framework, {
        widthMode: "responsive",
        questions: [
          {
            type: "file",
            name: "q1",
            minWidth: "616px",
            maxWidth: "616px"
          },
          {
            type: "file",
            name: "q2",
            minWidth: "300px",
            maxWidth: "300px",
            startWithNewLine: false
          },
          {
            type: "file",
            name: "q3",
            minWidth: "200px",
            maxWidth: "200px",
            startWithNewLine: false
          }
        ]
      }, { onOpenFileChooser: onOpenFileChooserHandler });
      await t.resizeWindow(1920, 1080);
      await resetFocusToBody();
      const questionRoot = Selector(".sd-question");
      const button = Selector("button").withText("Photo");
      await ClientFunction(() => {
        (window as any).survey.getAllQuestions()[0].setPropertyValue("currentMode", "file-camera");
        (window as any).survey.getAllQuestions()[1].setPropertyValue("currentMode", "file-camera");
        (window as any).survey.getAllQuestions()[2].setPropertyValue("currentMode", "file-camera");
      })();
      await t.hover(button.nth(0));
      await t.wait(100);
      await takeElementScreenshot("file-question-placeholder-normal.png", questionRoot.nth(0), t, comparer);
      await t.hover(button.nth(1));
      await t.wait(100);
      await takeElementScreenshot("file-question-placeholder-medium.png", questionRoot.nth(1), t, comparer);
      await t.hover(button.nth(2));
      await t.wait(100);
      await takeElementScreenshot("file-question-placeholder-small.png", questionRoot.nth(2), t, comparer);
    });
  });

});

frameworks.forEach(framework => {
  fixture`${framework} ${title} ${theme}`
    .page`${url_test}${theme}/${framework}`.beforeEach(async t => {
    });
  test("Check file question camera", async t => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1980, 1000);
      await initSurvey(framework, {
        showQuestionNumbers: "off",
        widthMode: "900px",
        questions: [{
          type: "file",
          title: "Question With Camera",
          allowMultiple: true,
          minWidth: "704px",
          width: "704px",
          maxWidth: "704px",
          name: "file_question",
        }]
      }, { onOpenFileChooser: onOpenFileChooserHandler });
      await resetFocusToBody();
      const questionRoot = Selector(".sd-question");
      await ClientFunction(() => { (window as any).survey.getAllQuestions()[0].setPropertyValue("currentMode", "camera"); })();
      await takeElementScreenshot("file-question-camera-mode.png", questionRoot, t, comparer);
      await ClientFunction(() => { (window as any).survey.getAllQuestions()[0].setPropertyValue("currentMode", "file-camera"); })();
      await takeElementScreenshot("file-question-both-mode.png", questionRoot, t, comparer);
      await ClientFunction(() => { (window as any).survey.getAllQuestions()[0].setPropertyValue("isPlayingVideo", true); })();
      await takeElementScreenshot("file-question-video.png", questionRoot, t, comparer);
      await ClientFunction(() => { (window as any).survey.getAllQuestions()[0].setPropertyValue("isPlayingVideo", false); })();
      await t.setFilesToUpload(Selector(".sd-file input"), ["files/Read Me.txt"]);
      await t.click(".sd-file input[type=file] + div label");
      await takeElementScreenshot("file-question-both-mode-answered.png", questionRoot, t, comparer);
    });
  });
});

