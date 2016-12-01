import {frameworks, url} from "../settings";
import {Selector, ClientFunction} from 'testcafe';
const assert = require('assert');
const getSurveyResult = ClientFunction(() => window.SurveyResult);
const title = `visibleTrigger`;

frameworks.forEach( (framework) => {
    fixture `${framework} ${title}`

        .page `${url}${framework}`

        .beforeEach( async t => {
            await t
                .typeText(`#testName`, title)
                .click(`body`);
        });

    test(`check visibility`, async t => {
        let surveyResult;

        await t
            .click(`input[value="Hot hatch"]`)
            .hover(`input[value="Honda Civic Type R"]`)
            .hover(`input[value="Fiat 500 Abarth"]`)
            .click(`input[value="Pony car"]`)
            .click(`input[value="Dodge Challenger"]`)
            .click(`input[value="Complete"]`);

        surveyResult = await getSurveyResult();
        assert.deepEqual(surveyResult, {
            "type": "Pony car",
            "Pony car": "Dodge Challenger"
        });
    });
});