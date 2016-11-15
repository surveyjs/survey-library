import {frameworks, url} from "../settings";
import {Selector, ClientFunction} from 'testcafe';
const assert = require('assert');
const getSurveyResult = ClientFunction(() => window.SurveyResult);
const title = `multipletext`;

frameworks.forEach( (framework) => {
    fixture `${framework} ${title}`

        .page `${url}${framework}`

        .beforeEach( async t => {
            await t
                .typeText(`#testName`, title)
                .pressKey(`enter`);
        });

    test(`fill text fields`, async t => {
        let surveyResult;

        await t
            .typeText(`tr > td:nth-child(2) input`, `All my money`)
            .typeText(`tr > td:nth-child(4) input`, `Zero`)
            .click(`input[value=Complete]`);

        surveyResult = await getSurveyResult();

        assert.deepEqual(surveyResult, {
            "pricelimit": {
                "mostamount": "All my money",
                "leastamount":"Zero"
            }
        });
    });
});