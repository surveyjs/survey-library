import {
  frameworks,
  url,
  setOptions,
  initSurvey,
  getSurveyResult
} from "../settings";
import { Selector, ClientFunction } from "testcafe";
const assert = require("assert");
const title = `file`;

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

frameworks.forEach(framework => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async t => {
      await initSurvey(framework, json);
    }
  );

  test(`choose file`, async t => {
    let surveyResult;

    await t.setFilesToUpload(`input[type=file]`, `../resources/stub.txt`);

    await t.click(`input[value=Complete]`);

    surveyResult = await getSurveyResult();
    assert.deepEqual(surveyResult, {
      image: [
        {
          name: "stub.txt",
          type: "text/plain",
          content: "data:text/plain;base64,V29tYmF0"
        }
      ]
    });
  });

  test(`choose multiple files`, async t => {
    let surveyResult;

    await t.setFilesToUpload(`input[type=file]`, `../resources/stub.txt`);
    await t.setFilesToUpload(
      `input[type=file]`,
      `../resources/small_Dashka.jpg`
    );

    await t.click(`input[value=Complete]`);

    surveyResult = await getSurveyResult();
    assert.equal(surveyResult.image.length, 2);
    assert.equal(surveyResult.image[0].name, "stub.txt");
    assert.equal(surveyResult.image[1].name, "small_Dashka.jpg");
  });

  test(`choose image`, async t => {
    let surveyResult;

    await t
      .setFilesToUpload(`input[type=file]`, `../resources/small_Dashka.jpg`)
      .hover(`img`)
      .click(`input[value=Complete]`);

    surveyResult = await getSurveyResult();
    assert(surveyResult.image[0].content.indexOf("image/jpeg") !== -1);
  });

  test(`without preview`, async t => {
    let surveyResult;
    const getImageExistance = ClientFunction(
      () =>
        !document.querySelector("img") ||
        document.querySelector("img").style.display === "none"
    );

    await setOptions("image", { showPreview: false });
    await t.setFilesToUpload(
      `input[type=file]`,
      `../resources/small_Dashka.jpg`
    );

    assert(await getImageExistance());

    await t.click(`input[value=Complete]`);

    surveyResult = await getSurveyResult();
    assert(surveyResult.image[0].content.indexOf("image/jpeg") !== -1);
  });

  test(`file not in data`, async t => {
    let surveyResult;

    await setOptions("image", { storeDataAsText: false });
    await t
      .setFilesToUpload(`input[type=file]`, `../resources/stub.txt`)
      .click(`input[value=Complete]`);

    surveyResult = await getSurveyResult();
    assert.deepEqual(surveyResult, {});
  });
  test(`change preview height width`, async t => {
    const getWidth = ClientFunction(() => document.querySelector("img").width);
    const getHeight = ClientFunction(
      () => document.querySelector("img").height
    );

    await t.setFilesToUpload(
      `input[type=file]`,
      `../resources/small_Dashka.jpg`
    );

    await setOptions("image", {
      imageHeight: 50,
      imageWidth: 50
    });

    assert.equal(await getWidth(), 50);
    assert.equal(await getHeight(), 50);
  });
  test(`confirm remove file`, async t => {
    await t.setFilesToUpload(
      `input[type=file]`,
      `../resources/small_Dashka.jpg`
    );
    await t
      .setNativeDialogHandler(() => {
        return false;
      })
      .click(".sv_q_file_remove");
    await t
      .setNativeDialogHandler(() => {
        return false;
      })
      .click(".sv_q_file_remove_button");
    const history = await t.getNativeDialogHistory();
    await t
      .expect(history[1].type)
      .eql("confirm")
      .expect(history[1].text)
      .eql("Are you sure that you want to remove this file: small_Dashka.jpg?")
      .expect(history[0].type)
      .eql("confirm")
      .expect(history[0].text)
      .eql("Are you sure that you want to remove all files?");
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
