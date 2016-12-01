import {frameworks, url} from "../settings";
import {Selector, ClientFunction} from 'testcafe';
const assert = require('assert');
const getSurveyResult = ClientFunction(() => window.SurveyResult);
const title = `getSurveyResult`;

frameworks.forEach( (framework) => {
    fixture `${framework} ${title}`

        .page `${url}${framework}`

        .beforeEach( async t => {
            await t
                .typeText(`#testName`, title)
                .click(`body`);
        });

    test(`correct get result`, async t => {
        await t
            .click(`form div:nth-child(20) label input`)
            .click(`#add_onGetResult_listener`)
            .click(`input[value="Complete"]`)
            .hover(`svg`);
    });
});