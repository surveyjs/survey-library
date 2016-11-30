import {frameworks, url} from "../settings";
import {Selector, ClientFunction} from 'testcafe';
const assert = require('assert');
const getSurveyResult = ClientFunction(() => window.SurveyResult);
const title = `customNavigation`;

frameworks.forEach( (framework) => {
    fixture `${framework} ${title}`

        .page `${url}${framework}`

        .beforeEach( async t => {
            await t
                .typeText(`#testName`, title)
                .click(`body`);
        });

    test(`set custom navigation`, async t => {
        const getPrevDsplay = ClientFunction(() =>
            document.querySelector('#surveyPrev').style.display);
        const getNextDsplay = ClientFunction(() =>
            document.querySelector('#surveyNext').style.display);
        const getCompleteDsplay = ClientFunction(() =>
            document.querySelector('#surveyComplete').style.display);
        const getProgressBarDsplay = ClientFunction(() =>
            document.querySelector('#surveyProgress').style.display);
        const getProgressText = ClientFunction(() =>
            document.querySelector('#surveyProgress').innerHTML);
        let surveyResult;

        await t
            .click(`#set_custom_navigation`);

        assert.equal(await getPrevDsplay(), "none");
        assert.notEqual(await getNextDsplay(), "none");
        assert.equal(await getCompleteDsplay(), "none");
        assert.notEqual(await getProgressBarDsplay(), "none");
        assert.equal(await getProgressText(), "Page 1 of 3.");

        await t
            .click(`input[type=checkbox]`)
            .click(`#surveyNext`);

        assert.notEqual(await getPrevDsplay(), "none");
        assert.notEqual(await getNextDsplay(), "none");
        assert.equal(await getCompleteDsplay(), "none");
        assert.notEqual(await getProgressBarDsplay(), "none");
        assert.equal(await getProgressText(), "Page 2 of 3.");

        await t
            .click(`input[type=checkbox]`)
            .click(`#surveyNext`);

        assert.notEqual(await getPrevDsplay(), "none");
        assert.equal(await getNextDsplay(), "none");
        assert.notEqual(await getCompleteDsplay(), "none");
        assert.notEqual(await getProgressBarDsplay(), "none");
        assert.equal(await getProgressText(), "Page 3 of 3.");

        await t
            .click(`#surveyPrev`);

        assert.notEqual(await getPrevDsplay(), "none");
        assert.notEqual(await getNextDsplay(), "none");
        assert.equal(await getCompleteDsplay(), "none");
        assert.notEqual(await getProgressBarDsplay(), "none");
        assert.equal(await getProgressText(), "Page 2 of 3.");

        await t
            .click(`#surveyNext`)
            .click(`#surveyComplete`);

        surveyResult = await getSurveyResult();
        assert.deepEqual(surveyResult, {
            "opSystem": ["Windows"],
            "langs": ["Javascript"]
        });
    });

    test(`change prev next complete text`, async t => {
        await t
            .click(`#change_prev_next_complete_text`)
            .click(`input[type=checkbox]`)
            .click(`input[value="forward"]`)
            .click(`input[type=checkbox]`)
            .click(`input[value="forward"]`)
            .click(`input[value="back"]`)
            .click(`input[value="forward"]`)
            .click(`input[value="done"]`);
    });

    test(`hide standard nav`, async t => {
        const getPrev = Selector(() =>
            document.querySelector(`input[value=Prev]`), {visibilityCheck: true, timeout: 1000});
        const getNext = Selector(() =>
            document.querySelector(`input[value=Next]`), {visibilityCheck: true, timeout: 1000});
        const getComplete = Selector(() =>
            document.querySelector(`input[value=Complete]`), {visibilityCheck: true, timeout: 1000});

        await t
            .click(`input[type=checkbox]`)
            .click(getNext)
            .click(`#hide_standard_nav`);

        assert.equal(await getPrev(), null);
        assert.equal(await getNext(), null);

        await t
            .click(`#set_custom_navigation`)
            .click(`input[type=checkbox]`)
            .click(`#surveyNext`);

        assert.equal(await getComplete(), null);
    });
});