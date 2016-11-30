import {frameworks, url} from "../settings";
import {Selector, ClientFunction} from 'testcafe';
const assert = require('assert');
const getSurveyResult = ClientFunction(() => window.SurveyResult);
const title = `file`;

frameworks.forEach( (framework) => {
    fixture `${framework} ${title}`

        .page `${url}${framework}`

        .beforeEach( async t => {
            await t
                .typeText(`#testName`, title)
                .click(`body`);
        });

    test(`choose file`, async t => {
        const getFileName = ClientFunction(() =>
            document.querySelector('input[type=file]').files[0].name);
        let surveyResult;
        let fileName;

        await t
            .setFilesToUpload(`input[type=file]`, `../resources/stub.txt`);
        fileName = await getFileName();
        assert.equal(fileName, `stub.txt`);

        await t
            .click(`input[value=Complete]`);

        surveyResult = await getSurveyResult();
        assert.deepEqual(surveyResult, {
            "image": "data:text/plain;base64,V29tYmF0"
        });
    });

    test(`choose image`, async t => {
        let surveyResult;

        await t
            .setFilesToUpload(`input[type=file]`, `../resources/small_Dashka.jpg`)
            .hover(`img`)
            .click(`input[value=Complete]`);

        surveyResult = await getSurveyResult();
        assert(surveyResult.image.indexOf('image/jpeg') !== -1);
    });

    test(`without preview`, async t => {
        let surveyResult;
        const getImageExistance =  ClientFunction(() =>
            !document.querySelector('img') || document.querySelector('img').style.display === 'none');

        await t
            .click(`#do_not_show_image_preview`)
            .setFilesToUpload(`input[type=file]`, `../resources/small_Dashka.jpg`);

        assert(await getImageExistance());

        await t.
            click(`input[value=Complete]`);

        surveyResult = await getSurveyResult();
        assert(surveyResult.image.indexOf('image/jpeg') !== -1);
    });

    test(`file not in data`, async t => {
        let surveyResult;

        await t
            .click(`#do_not_store_file_in_data`)
            .setFilesToUpload(`input[type=file]`, `../resources/stub.txt`)
            .click(`input[value=Complete]`);

        surveyResult = await getSurveyResult();
        assert.deepEqual(surveyResult, {});
    });

    test(`change preview height width`, async t => {
        const getWidth =  ClientFunction(() =>
            document.querySelector('img').width);
        const getHeight =  ClientFunction(() =>
            document.querySelector('img').height);

        await t
            .setFilesToUpload(`input[type=file]`, `../resources/small_Dashka.jpg`)
            .click(`#change_image_preview_height_width`);

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
    //
    //     await t
    //         .setFilesToUpload(`input[type=file]`, `../resources/big_Dashka.jpg`);
    //     assert.notEqual(await getPosition(), -1);
    //
    //     await t
    //         .click('#change_file_max_size')
    //         .setFilesToUpload(`input[type=file]`, `../resources/small_Dashka.jpg`)
    //         .setFilesToUpload(`input[type=file]`, `../resources/big_Dashka.jpg`);
    //
    //     assert.equal(await getPosition(), -1);
    //     assert(await getImageExistance());
    //
    //     await t
    //         .click(`input[value=Complete]`);
    //
    //     surveyResult = await getSurveyResult();
    //     assert(surveyResult.image.indexOf('image/jpeg') !== -1);
    // });
});