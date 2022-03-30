import { Selector, ClientFunction } from "testcafe";
import { createScreenshotsComparer } from "devextreme-screenshot-comparer";
import { url, screenshotComparerOptions, frameworks, initSurvey, url_test, explicitErrorHandler } from "../../helper";

const title = "File Screenshot";

fixture`${title}`.page`${url}`.beforeEach(async (t) => {

});

const applyTheme = ClientFunction(theme => {
  (<any>window).Survey.StylesManager.applyTheme(theme);
});

const theme = "defaultV2";
const json = {
  showQuestionNumbers: "off",
  questions: [{
    type: "file",
    title: "Upload everything what you’d like to.",
    name: "file_question",
    width: "704px"
  }]
};

frameworks.forEach(framework => {
  fixture`${framework} ${title} ${theme}`
    .page`${url_test}${theme}/${framework}.html`.beforeEach(async t => {
    await explicitErrorHandler();
    await applyTheme(theme);
    await initSurvey(framework, json);
  });
  test("Check file question", async (t) => {
    await t.resizeWindow(1920, 1080);
    await t.setFilesToUpload(Selector(".sd-file input"), ["files/SingleImage.jpg"]);
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const questionRoot = Selector(".sd-question");
    await takeScreenshot("file-question-single-image.png", questionRoot, screenshotComparerOptions);
    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
    await t.setFilesToUpload(Selector(".sd-file input"), ["files/Portfolio.pdf"]);
    await takeScreenshot("file-question-single-file.png", questionRoot, screenshotComparerOptions);
    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
    await ClientFunction(()=>{
      const question = (window as any).survey.getQuestionByName("file_question");
      question.allowMultiple = true;
      question.clear();
    })();
    await t.setFilesToUpload(Selector(".sd-file input"), ["files/Badger.png", "files/Bird.png", "files/Read Me.txt", "files/Flamingo.png"]);
    await takeScreenshot("file-question-multiple.png", questionRoot, screenshotComparerOptions);
    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
  test("Check file question - long names", async (t) => {
    await t.resizeWindow(1920, 1080);
    await ClientFunction(()=>{
      const question = (window as any).survey.getQuestionByName("file_question");
      question.allowMultiple = true;
      question.value = [
        {
          "name": "files/item2_very_long_name_that_i_could_not_even_imagine_for_that_moment_and_to_be_honest_it_will_be_really_the_longest_file_name_in_the_world_really_really_lond_i_believe.pdf",
          "type": "application/x-zip-compressed",
          "content": "#item1.zip"
        }];
    })();
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const questionRoot = Selector(".sd-question");
    await takeScreenshot("file-question-long-name.png", questionRoot, screenshotComparerOptions);
    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
  test("Check file question mobile mode", async (t) => {
    await t.resizeWindow(1920, 1080);
    await ClientFunction(()=>{
      (window as any).survey.resizeObserver.disconnect();
      (window as any).survey.setIsMobile(false);
      (window as any).survey.getAllQuestions()[0].isMobile = true;
    })();
    await t.setFilesToUpload(Selector(".sd-file input"), ["files/SingleImage.jpg"]);
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const questionRoot = Selector(".sd-question");
    await ClientFunction(()=>{
      const question = (window as any).survey.getQuestionByName("file_question");
      question.allowMultiple = true;
      question.clear();
    })();
    await t.setFilesToUpload(Selector(".sd-file input"), ["files/Badger.png", "files/Bird.png", "files/Read Me.txt", "files/Flamingo.png"]);
    await takeScreenshot("file-question-multiple-mobile.png", questionRoot, screenshotComparerOptions);
    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());

    await t.click(Selector(".sd-file #nextPage"));
    await takeScreenshot("file-question-multiple-mobile-next.png", questionRoot, screenshotComparerOptions);
    await t.click(Selector(".sd-file #prevPage"));
    await t.click(Selector(".sd-file #prevPage"));
    await takeScreenshot("file-question-multiple-mobile-prev.png", questionRoot, screenshotComparerOptions);
  });
});
