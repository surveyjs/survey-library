import {frameworks, url} from "../settings";
import {Selector, ClientFunction} from 'testcafe';
const assert = require('assert');
const getSurveyResult = ClientFunction(() => window.SurveyResult);
const title = `customValidators`;

frameworks.forEach( (framework) => {
    fixture `${framework} ${title}`

        .page `${url}${framework}`

        .beforeEach( async t => {
            await t
                .typeText(`#testName`, title)
                .click(`body`);
        });

    test(`check validation`, async t => {
        const getError1Div = Selector(() =>
            document.querySelectorAll("div"), { text: "Please answer the question.", visibilityCheck: true, timeout: 1000});
        const getError2Div = Selector(() =>
            document.querySelectorAll("div"), { text: "You text should contains 'survey' word.", visibilityCheck: true, timeout: 1000});
        let surveyResult;

        await t
            .click(`input[value="Complete"]`);

        assert(await getError1Div());

        await t
            .typeText(`textarea`, `wombat`)
            .click(`input[value="Complete"]`);

        assert(await getError2Div());

        await t
            .typeText(`textarea`, ` survey`)
            .click(`input[value="Complete"]`);


        surveyResult = await getSurveyResult();
        assert.deepEqual(surveyResult, {"memo":"wombat survey"});
    });
});