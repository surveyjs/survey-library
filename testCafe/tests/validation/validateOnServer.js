import {frameworks, url} from "../settings";
import {Selector, ClientFunction} from 'testcafe';
const assert = require('assert');
const getSurveyResult = ClientFunction(() => window.SurveyResult);
const title = `validateOnServer`;

frameworks.forEach( (framework) => {
    fixture `${framework} ${title}`

        .page `${url}${framework}`

        .beforeEach( async t => {
            await t
                .typeText(`#testName`, title)
                .click(`body`);
        });

    test(`check validation`, async t => {
        const getErrorSpan = Selector(() =>
            document.querySelectorAll("div"), {
            text: "The country name 'wombatland' is not in this list: http://services.groupkt.com/country/get/all",
            visibilityCheck: true,
            timeout: 1000
        });
        let surveyResult;

        await t
            .click(`#add_server_validation`)
            .typeText(`input[type="text"]`, `wombatland`)
            .click(`input[value="Complete"]`)
            .hover(getErrorSpan)
            .click(`#add_server_validation`)
            .typeText(`input[type="text"]`, `Romania`, {replace: true})
            .click(`input[value="Complete"]`);

        surveyResult = await getSurveyResult();
        assert.deepEqual(surveyResult, {
            country: "Romania"
        });
    });
});