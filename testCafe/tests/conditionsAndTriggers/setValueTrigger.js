import {frameworks, url} from "../settings";
import {Selector, ClientFunction} from 'testcafe';
const assert = require('assert');
const getSurveyResult = ClientFunction(() => window.SurveyResult);
const title = `setValueTrigger`;

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
            document.documentElement.innerHTML.indexOf('Jon Snow'));
        let surveyResult;

        await t
            .click(`input[value="Yes"]`)
            .click(`input[value="Complete"]`);

        assert.notEqual(await getPosition());

        surveyResult = await getSurveyResult();
        assert.deepEqual(surveyResult, {
            "copy":"Yes",
            "name":"Jon Snow",
            "email":"jon.snow@nightwatch.com"
        });
    });
});