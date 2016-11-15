import {frameworks, url} from "../settings";
import {Selector, ClientFunction} from 'testcafe';
const assert = require('assert');
const getSurveyResult = ClientFunction(() => window.SurveyResult);
const title = `matrix`;

frameworks.forEach( (framework) => {
    fixture `${framework} ${title}`

        .page `${url}${framework}`

        .beforeEach( async t => {
            await t
                .typeText(`#testName`, title)
                .pressKey(`enter`);
        });

    test(`choose value`, async t => {
        let surveyResult;

        await t
            .click(`input[name="Quality_easy to use"][value="5"]`)
            .click(`input[value=Complete]`);

        surveyResult = await getSurveyResult();
        assert.equal(surveyResult.Quality[`easy to use`], `5`);
    });

    test(`choose several values`, async t => {
        let surveyResult;

        await t
            .click(`input[name="Quality_does what it claims"][value="4"]`)
            .click(`input[name="Quality_easy to use"][value="5"]`)
            .click(`input[value=Complete]`);

        surveyResult = await getSurveyResult();
        assert.deepEqual(surveyResult.Quality, {
            "does what it claims": "4",
            "easy to use": "5"
        });
    });

    test(`require answer for all rows`, async t => {
        let surveyResult;
        const getPosition = ClientFunction(() =>
            document.documentElement.innerHTML.indexOf('Please answer questions in all rows'));
        let position;

        await t
            .click(`#is_all_row_required`)
            .click(`input[value=Complete]`);

        position = await getPosition();
        assert.notEqual(position, -1);

        surveyResult = await getSurveyResult();
        assert.equal(typeof surveyResult, `undefined`);

        await t
            .click(`input[name="Quality_affordable"][value="3"]`)
            .click(`input[name="Quality_does what it claims"][value="4"]`)
            .click(`input[name="Quality_better then others"][value="2"]`)
            .click(`input[name="Quality_easy to use"][value="5"]`)
            .click(`input[value=Complete]`);

        surveyResult = await getSurveyResult();
        assert.deepEqual(surveyResult.Quality, {
            "affordable": "3",
            "does what it claims": "4",
            "better then others": "2",
            "easy to use": "5"
        });
    });
});