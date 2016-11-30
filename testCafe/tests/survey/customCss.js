import {frameworks, url} from "../settings";
import {Selector, ClientFunction} from 'testcafe';
const assert = require('assert');
const getSurveyResult = ClientFunction(() => window.SurveyResult);
const title = `customCss`;

frameworks.forEach( (framework) => {
    fixture `${framework} ${title}`

        .page `${url}${framework}`

        .beforeEach( async t => {
            await t
                .typeText(`#testName`, title)
                .click(`body`);
        });

    test(`check custom class`, async t => {
        const isCustomClassExist = ClientFunction(() =>
            document.querySelector(`input[value="Complete"]`).classList.contains(`btn-lg`));
        assert(await isCustomClassExist());
    });
});