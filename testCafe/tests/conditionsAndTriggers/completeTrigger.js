import {frameworks, url} from "../settings";
import {Selector, ClientFunction} from 'testcafe';
const assert = require('assert');
const getSurveyResult = ClientFunction(() => window.SurveyResult);
const title = `completeTrigger`;

frameworks.forEach( (framework) => {
    fixture `${framework} ${title}`

        .page `${url}${framework}`

        .beforeEach( async t => {
            await t
                .typeText(`#testName`, title)
                .click(`body`);
        });

    test(`check visibility`, async t => {
        const getPosition = ClientFunction((index) =>
            document.documentElement.innerHTML.indexOf('4. Do you want to finish the survey?'));
        let surveyResult;

        assert.equal(await getPosition(), -1);

        await t
            .click(`input[value="No"]`)
            .click(`input[value="Next"]`)
            .click(`input[value="Yes"]`)
            .click(`input[value="Next"]`);

        surveyResult = await getSurveyResult();
        assert.deepEqual(surveyResult, {"exit1":"No", "exit2":"Yes"});
    });
});