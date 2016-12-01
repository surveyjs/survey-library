import {frameworks, url} from "../settings";
import {ClientFunction} from 'testcafe';
const assert = require('assert');
const getSurveyResult = ClientFunction(() => window.SurveyResult);
const title = `dropdown_restfull`;

frameworks.forEach( (framework) => {
    fixture `${framework} ${title}`
        
        .page `${url}${framework}`

        .beforeEach( async t => {
            await t
                .typeText(`#testName`, title)
                .click(`body`);
        });

    test(`choose empty`, async t => {
        const getPosition = ClientFunction(() =>
            document.documentElement.innerHTML.indexOf('Please answer the question'));
        let position;
        let surveyResult;

        await t
            .wait(1000)
            .click(`input[value=Complete]`);

        position = await getPosition();
        assert.notEqual(position, -1);

        surveyResult = await getSurveyResult();
        assert.equal(typeof surveyResult, `undefined`);
    });

    test(`choose value`, async t => {
        let surveyResult;

        await t
            .wait(1000)
            .click(`select`)
            .click(`option[value=Cuba]`)
            .click(`input[value=Complete]`);

        surveyResult = await getSurveyResult();
        assert.equal(surveyResult.country, 'Cuba');
    });

    test(`change "value" in the returned json`, async t => {
        const getPosition = ClientFunction(() =>
            document.documentElement.innerHTML.indexOf('Cuba'));
        let position;
        let surveyResult;

        await t
            .wait(1000)
            .click('#change_value');

        position = await getPosition();
        assert.notEqual(position, -1);

        await t
            .click(`select`)
            .click(`option[value=CU]`)
            .click(`input[value=Complete]`);

        surveyResult = await getSurveyResult();
        assert.equal(surveyResult.country, 'CU');
    });
});