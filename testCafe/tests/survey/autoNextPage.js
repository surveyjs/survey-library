import {frameworks, url} from "../settings";
import {Selector, ClientFunction} from 'testcafe';
const assert = require('assert');
const getSurveyResult = ClientFunction(() => window.SurveyResult);
const title = `autoNextPage`;

frameworks.forEach( (framework) => {
    fixture `${framework} ${title}`

        .page `${url}${framework}`

        .beforeEach( async t => {
            await t
                .typeText(`#testName`, title)
                .click(`body`);
        });

    test(`check auto next page`, async t => {
        const getProgressTextPosition = ClientFunction((index) =>
            document.documentElement.innerHTML.indexOf("Page " + index + " of 3"));
        let surveyResult;

        assert.notEqual(await getProgressTextPosition(1), -1);

        await t
            .click(`input[type=radio]`);

        assert.notEqual(await getProgressTextPosition(2), -1);

        await t
            .click(`input[type=radio]`);

        assert.notEqual(await getProgressTextPosition(3), -1);

        await t
            .click(`input[type=radio]`);

        surveyResult = await getSurveyResult();
        assert.deepEqual(surveyResult, {
            "civilwar": "1750-1800",
            "libertyordeath": "John Hancock",
            "magnacarta": "The foundation of the British parliamentary system"
        });
    });
});