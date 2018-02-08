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
      showPreview: true,
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
    const getFileName = ClientFunction(
      () => document.querySelector("input[type=file]").files[0].name
    );
    let surveyResult;
    let fileName;

    await t.setFilesToUpload(`input[type=file]`, `../resources/stub.txt`);
    fileName = await getFileName();
    assert.equal(fileName, `stub.txt`);

    await t.click(`input[value=Complete]`);

    surveyResult = await getSurveyResult();
    assert.deepEqual(surveyResult, {
      image: ["data:text/plain;base64,V29tYmF0"]
    });
  });

  test(`choose image`, async t => {
    let surveyResult;

    await t
      .setFilesToUpload(`input[type=file]`, `../resources/small_Dashka.jpg`)
      .hover(`img`)
      .click(`input[value=Complete]`);

    surveyResult = await getSurveyResult();
    assert(surveyResult.image[0].indexOf("image/jpeg") !== -1);
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
    assert(surveyResult.image[0].indexOf("image/jpeg") !== -1);
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
