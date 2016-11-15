import {frameworks, url} from "../settings";
import {Selector, ClientFunction} from 'testcafe';
const assert = require('assert');
const getSurveyResult = ClientFunction(() => window.SurveyResult);
const title = `comment`;

frameworks.forEach( (framework) => {
    fixture `${framework} ${title}`

        .page `${url}${framework}`

        .beforeEach( async t => {
            await t
                .typeText(`#testName`, title)
                .pressKey(`enter`);
        });

    test(`fill textarea`, async t => {
        let surveyResult;

        await t
            .typeText(`textarea`, `puppies`)
            .pressKey(`enter`)
            .typeText(`textarea`, `money`)
            .click(`input[value=Complete]`);

        surveyResult = await getSurveyResult();
        assert.deepEqual(surveyResult, {
            "suggestions":"puppies\nmoney"
        });
    });

    if (framework.indexOf("bootstrap") === -1) {
        test(`change rows count`, async t => {
            const getHeight = ClientFunction(() =>
            document.querySelector('textarea').clientHeight - 4); // 4 - it is paddings top and bottom (2 + 2)
            let oldHeight;
            let newHeight;

            oldHeight = await getHeight();

            await t
                .click(`#change_rows_to_2`);

            newHeight = await getHeight();

            assert.equal(oldHeight, newHeight*2);
        });

        test(`change cols count`, async t => {
            const getWidth = ClientFunction(() =>
                document.querySelector('textarea').clientWidth);
            let oldWidth;
            let newWidth;

            oldWidth = await getWidth();

            await t
                .click(`#change_cols_to_25`);

            newWidth = await getWidth();

            assert(oldWidth > newWidth);
        });
    }
});