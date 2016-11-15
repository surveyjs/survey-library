import {frameworks, url} from "../settings";
import {Selector, ClientFunction} from 'testcafe';
const assert = require('assert');
const getSurveyResult = ClientFunction(() => window.SurveyResult);
const title = `changeRendering`;

frameworks.forEach( (framework) => {
    fixture `${framework} ${title}`

        .page `${url}${framework}`

        .beforeEach( async t => {
            await t
                .typeText(`#testName`, title)
                .pressKey(`enter`);
        });

    test(`check new elements rendering`, async t => {
        const getBtn = Selector(index => document.querySelectorAll('.btn-group .btn')[index - 1]);
        let surveyResult;

        await t
            .click(`#custom_rendering`);

        await t
            .click(getBtn(1))
            .hover(getBtn(2))
            .hover(getBtn(3))
            .hover(getBtn(4))
            .hover(getBtn(5));

        await t
            .click(getBtn(3))
            .click(`input[value=Next]`);

        await t
            .click(getBtn(2))
            .click(`input[value=Next]`)
            .click(`input[value=Complete]`);

        surveyResult = await getSurveyResult();
        assert.deepEqual(surveyResult, {
            "frameworkUsing":"Yes",
            "framework":["Bootstrap"],
            "mvvmUsing":"No"
        });
    });
});