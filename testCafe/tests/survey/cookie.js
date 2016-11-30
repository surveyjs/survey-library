import {frameworks, url} from "../settings";
import {Selector, ClientFunction} from 'testcafe';
const assert = require('assert');
const getSurveyResult = ClientFunction(() => window.SurveyResult);
const title = `cookie`;

frameworks.forEach( (framework) => {
    fixture `${framework} ${title}`

        .page `${url}${framework}`

        .beforeEach( async t => {
            await t
                .typeText(`#testName`, title)
                .click(`body`);
        });

    test(`check works and delete`, async t => {
        const getPosition = ClientFunction(() =>
            document.documentElement.innerHTML.indexOf('Thank You for Completing the Survey!'));

        await t
            .click(`input[type=checkbox]`)
            .click(`input[value=Complete]`);

        await t
            .typeText(`#testName`, `text`, {replace: true})
            .pressKey(`enter`)
            .typeText(`#testName`, title, {replace: true})
            .pressKey(`enter`);

        assert.notEqual(await getPosition(), -1);

        await t
            .click(`#delete_cookie`)
            .hover(`input[type=checkbox]`);

        assert.equal(await getPosition(), -1);
    });
});