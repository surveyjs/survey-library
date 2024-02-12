import { frameworks, url, setOptions, initSurvey, getSurveyResult, url_test } from "../helper";
import { ClientFunction, fixture, Selector, test } from "testcafe";
// eslint-disable-next-line no-undef
const assert = require("assert");
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
    assert.equal(surveyResult.image.length, 2);
    assert.equal(surveyResult.image[0].name, "stub.txt");
    assert.equal(surveyResult.image[1].name, "small_Dashka.jpg");
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
    assert(surveyResult.image[0].content.indexOf("image/jpeg") !== -1);
  });

  test("without preview", async t => {
    let surveyResult;
    const getImageExistance = ClientFunction(
      () =>
        !document.querySelector("img") ||
        document.querySelector("img").style.display === "none"
    );

    await setOptions("image", { showPreview: false });
    await t.setFilesToUpload(
      "input[type=file]",
      "../resources/small_Dashka.jpg"
    );
    await t.click("input[type=file] + div label");

    assert(await getImageExistance());

    await t.click("input[value=Complete]");

    surveyResult = await getSurveyResult();
    assert(surveyResult.image[0].content.indexOf("image/jpeg") !== -1);
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
    const getWidth = ClientFunction(() => document.querySelector("img").width);
    const getHeight = ClientFunction(
      () => document.querySelector("img").height
    );

    await t.setFilesToUpload(
      "input[type=file]",
      "../resources/small_Dashka.jpg"
    );
    await t.click("input[type=file] + div label");

    await setOptions("image", {
      imageHeight: "50px",
      imageWidth: "50px"
    });

    assert.equal(await getWidth(), 50);
    assert.equal(await getHeight(), 50);
  });
  test("confirm remove file", async t => {
    await t.setFilesToUpload(
      "input[type=file]",
      "../resources/small_Dashka.jpg"
    );
    await t.click("input[type=file] + div label");

    const getFileName = ClientFunction(() => window["survey"].getAllQuestions()[0].value[0].name);
    const checkValue = ClientFunction(() => window["survey"].getAllQuestions()[0].value.length === 0);
    await t.click(".sv_q_file_remove_button").click(".sv-popup--confirm-delete .sd-btn");
    assert.equal(await getFileName(), "small_Dashka.jpg");
    await t.click(".sv_q_file_remove_button").click(".sv-popup--confirm-delete .sd-btn--danger");
    assert.equal(await checkValue(), true);

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
});