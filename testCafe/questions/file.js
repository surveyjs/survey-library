import { frameworks, url, setOptions, initSurvey, getSurveyResult, url_test, getQuestionValue, getQuestionJson, getData } from "../helper";
import { ClientFunction, fixture, Selector, test } from "testcafe";
const title = "file";

const json = {
  questions: [
    {
      type: "file",
      title: "Please upload your photo",
      name: "image",
      storeDataAsText: true,
      allowMultiple: true,
      showPreview: true,
      needConfirmRemoveFile: true,
      imageWidth: 150,
      maxSize: 102400
    }
  ]
};

function onOpenFileChooserHandler(s, o) {
  var files = [];
  for (var i = 0; i < o.input.files.length; i++) {
    files.push(o.input.files[i]);
  }
  o.callback(files);
}

frameworks.forEach(framework => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async t => {
      await initSurvey(framework, json, { onOpenFileChooser: onOpenFileChooserHandler });
    }
  );

  test("choose file", async t => {
    let surveyResult;

    await t.setFilesToUpload("input[type=file]", "../resources/stub.txt");
    await t.click("input[type=file] + div label");
    await t.click("input[value=Complete]");

    surveyResult = await getSurveyResult();
    await t.expect(surveyResult).eql({
      image: [
        {
          name: "stub.txt",
          type: "text/plain",
          content: "data:text/plain;base64,V29tYmF0"
        }
      ]
    });
  });

  test("choose file keyboard click", async t => {
    let surveyResult;

    await ClientFunction(() => {
      document.querySelector("label[aria-label=\"Select File\"]").click = () => { window.chooseFileClickedTest = "yes"; };
    })();
    await t.pressKey("tab");
    await t.pressKey("enter");

    surveyResult = await getSurveyResult();
    await t.expect(ClientFunction(() => {
      var a = window.chooseFileClickedTest;
      window.chooseFileClickedTest = undefined;
      return a;
    })()).eql("yes");
  });

  test("choose multiple files", async t => {
    let surveyResult;

    await t.setFilesToUpload("input[type=file]", ["../resources/stub.txt", "../resources/small_Dashka.jpg"]);
    await t.click("input[type=file] + div label");

    await t.click("input[value=Complete]");

    surveyResult = await getSurveyResult();
    await t
      .expect(surveyResult.image.length).eql(2)
      .expect(surveyResult.image[0].name).eql("stub.txt")
      .expect(surveyResult.image[1].name).eql("small_Dashka.jpg");
  });
  test("check clean button", async t => {
    await ClientFunction(() => {
      window.survey.getAllQuestions()[0].needConfirmRemoveFile = false;
    })();
    await t.setFilesToUpload("input[type=file]", ["../resources/stub.txt", "../resources/small_Dashka.jpg"]);
    await t.click("input[type=file] + div label");
    const cleanButtonSelector = Selector("button").withText("Clear");
    await t.click(cleanButtonSelector);
    await t.expect(cleanButtonSelector.exists).notOk();
  });

  test("choose image", async t => {
    let surveyResult;

    await t
      .setFilesToUpload("input[type=file]", "../resources/small_Dashka.jpg");
    await t.click("input[type=file] + div label");
    await t
      .hover("img")
      .click("input[value=Complete]");

    surveyResult = await getSurveyResult();
    await t.expect(surveyResult.image[0].content.indexOf("image/jpeg")).notEql(-1);
  });

  test("without preview", async t => {
    await setOptions("image", { showPreview: false });
    await t.setFilesToUpload(
      "input[type=file]",
      "../resources/small_Dashka.jpg"
    );
    await t.click("input[type=file] + div label");

    await t.expect(Selector("img").exists).notOk();

    await t.click("input[value=Complete]");

    const surveyResult = await getSurveyResult();
    await t.expect(surveyResult.image[0].content.indexOf("image/jpeg")).notEql(-1);
  });

  test("file not in data", async t => {
    let surveyResult;

    await setOptions("image", { storeDataAsText: false });
    await t
      .setFilesToUpload("input[type=file]", "../resources/stub.txt")
      .click("input[type=file] + div label")
      .click("input[value=Complete]");

    surveyResult = await getSurveyResult();
    await t.expect(surveyResult).eql({});
  });
  test("change preview height width", async t => {
    await t.setFilesToUpload(
      "input[type=file]",
      "../resources/small_Dashka.jpg"
    );
    await t.click("input[type=file] + div label");

    await setOptions("image", {
      imageHeight: "50px",
      imageWidth: "50px"
    });

    await t
      .expect(Selector("img").getStyleProperty("width")).eql("50px")
      .expect(Selector("img").getStyleProperty("height")).eql("50px");
  });
  test("confirm remove file", async t => {
    await t.setFilesToUpload(
      "input[type=file]",
      "../resources/small_Dashka.jpg"
    );

    await t
      .click("input[type=file] + div label")
      .click(".sv_q_file_remove_button")
      .click(".sv-popup--confirm .sd-btn");

    let data = await getData();
    await t.expect(data["image"][0].name).eql("small_Dashka.jpg")

      .click(".sv_q_file_remove_button")
      .click(".sv-popup--confirm .sd-btn--danger");

    data = await getData();
    await t.expect(data["image"]).eql(undefined);

    // await t
    //   .setNativeDialogHandler(() => {
    //     return false;
    //   })
    //   .click(".sv_q_file_remove");
    // await t
    //   .setNativeDialogHandler(() => {
    //     return false;
    //   })
    //   .click(".sv_q_file_remove_button");
    // const history = await t.getNativeDialogHistory();
    // await t
    //   .expect(history[1].type)
    //   .eql("confirm")
    //   .expect(history[1].text)
    //   .eql("Are you sure that you want to remove this file: small_Dashka.jpg?")
    //   .expect(history[0].type)
    //   .eql("confirm")
    //   .expect(history[0].text)
    //   .eql("Are you sure that you want to remove all files?");
  });
  // TODO testcafe waiting forever...
  // test(`change file max size`, async t => {
  //     const getPosition = ClientFunction(() =>
  //         document.documentElement.innerHTML.indexOf('The file size should not exceed 100 KB'));
  //     const getImageExistance = ClientFunction(() =>
  //         !!document.querySelector('img'));
  //     let surveyResult;

  //     await t
  //         .setFilesToUpload(`input[type=file]`, `../resources/big_Dashka.jpg`);
  //     assert.notEqual(await getPosition(), -1);

  //     await setOptions('image', { maxSize: 0 });
  //     await t
  //         .setFilesToUpload(`input[type=file]`, `../resources/small_Dashka.jpg`)
  //         .setFilesToUpload(`input[type=file]`, `../resources/big_Dashka.jpg`);

  //     assert.equal(await getPosition(), -1);
  //     assert(await getImageExistance());

  //     await t
  //         .click(`input[value=Complete]`);

  //     surveyResult = await getSurveyResult();
  //     assert(surveyResult.image.indexOf('image/jpeg') !== -1);
  // });
});

frameworks.forEach(framework => {
  fixture`${framework} ${title}`.page`${url_test}defaultV2/${framework}`.beforeEach(
    async t => {
      await initSurvey(framework, {
        elements: [
          {
            type: "file",
            title: "Please upload your photo",
            name: "image",
            storeDataAsText: true,
            allowMultiple: true,
          }
        ]
      }, { onOpenFileChooser: onOpenFileChooserHandler });
    }
  );

  test("Check file navigator appear on smaller screen", async t => {
    await t.resizeWindow(1920, 1080);
    const fileNavigatorSelector = Selector(".sd-file .sv-action-bar");
    await t
      .setFilesToUpload("input[type=file]", ["../resources/stub.txt", "../resources/small_Dashka.jpg", "../resources/big_Dashka.jpg"])
      .click("input[type=file] + div label")
      .expect(fileNavigatorSelector.exists)
      .notOk()
      .resizeWindow(620, 1080)
      .expect(fileNavigatorSelector.exists)
      .ok()
      .expect(fileNavigatorSelector.find(".sv-action-bar-item__title").withText("1 of 2").exists).ok()
      .resizeWindow(1920, 1080)
      .expect(fileNavigatorSelector.exists).notOk();
  });
  test("check file question has correct root element", async t => {
    const testRootElement = ClientFunction(() => {
      const rootElement = survey.getAllQuestions()[0].rootElement;
      return rootElement && rootElement.tagName == "DIV" && rootElement.classList.contains("sd-file");
    });
    await t
      .resizeWindow(1920, 1080)
      .expect(testRootElement())
      .ok();
  });
});