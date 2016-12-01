import {frameworks, url} from "../settings";
import {Selector, ClientFunction} from 'testcafe';
const assert = require('assert');
const getSurveyResult = ClientFunction(() => window.SurveyResult);
const title = `rating`;

frameworks.forEach( (framework) => {
    fixture `${framework} ${title}`

        .page `${url}${framework}`

        .beforeEach( async t => {
            await t
                .typeText(`#testName`, title)
                .click(`body`);
        });

    test(`description exists`, async t => {
        const getPositionMin = ClientFunction(() => document.documentElement.innerHTML.indexOf('Not Satisfied'));
        const getPositionMax = ClientFunction(() => document.documentElement.innerHTML.indexOf('Completely satisfied'));
        const positionMin = await getPositionMin();
        const positionMax = await getPositionMax();

        assert.notEqual(positionMin, -1);
        assert.notEqual(positionMax, -1);
    });

    test(`choose value`, async t => {
        const label3 = Selector((index) =>
            document.querySelectorAll('label'), {text: "3", visibilityCheck: true, timeout: 1000});
        let surveyResult;

        await t
            .click(label3)
            .click(`input[value=Complete]`);

        surveyResult = await getSurveyResult();

        assert.deepEqual(surveyResult, {
            "satisfaction":"3"
        });
    });
});