import {frameworks, url} from "../settings";
import {Selector, ClientFunction} from 'testcafe';
const assert = require('assert');
const getSurveyResult = ClientFunction(() => window.SurveyResult);
const title = `options`;

frameworks.forEach( (framework) => {
    fixture `${framework} ${title}`

        .page `${url}${framework}`

        .beforeEach( async t => {
            await t
                .typeText(`#testName`, title)
                .click(`body`);
        });

    test(`change question required text`, async t => {
        const getPosition = ClientFunction(() => document.documentElement.innerHTML.indexOf("😱"));

        await t
            .click(`#change_question_required_text`);

        assert.notEqual(await getPosition(), -1);
    });

    test(`set question numbers on page`, async t => {
        const getPosition = ClientFunction(() =>
            document.documentElement.innerHTML.indexOf("1. * Plese select from the list"));

        await t
            .click(`input[type=checkbox]`)
            .click(`input[value="Next"]`)
            .click(`#set_question_numbers_on_page`);

        assert.notEqual(await getPosition(), -1);
    });

    test(`set question numbers off`, async t => {
        const getPosition = ClientFunction(() =>
            document.documentElement.innerHTML.indexOf("1. * Plese select from the list"));

        await t
            .click(`#set_question_numbers_off`);

        assert.equal(await getPosition(), -1);
    });

    test(`hide survey title`, async t => {
        const getTitle = Selector(() =>
            document.querySelectorAll("h3"), { text: "Software developer survey.", visibilityCheck: true, timeout: 1000});

        await t
            .click(`#hide_survey_title`);

        assert.equal(await getTitle(), null);
    });

    test(`hide page title`, async t => {
        const getTitle = Selector(() =>
            document.querySelectorAll("h4"), {
                text: "What operating system do you use?",
                visibilityCheck: true,
                timeout: 1000
            });

        await t
            .click(`#hide_page_title`);

        assert.equal(await getTitle(), null);
    });

    test(`show page numbers`, async t => {
        const getPositionPage1 = ClientFunction(() =>
            document.documentElement.innerHTML.indexOf("1. What operating system do you use?"));
        const getPositionPage2 = ClientFunction(() =>
            document.documentElement.innerHTML.indexOf("2. What language(s) are you currently using?"));

        await t
            .click(`#show_page_numbers`);
        assert.notEqual(await getPositionPage1(), -1);

        await t
            .click(`input[type=checkbox]`)
            .click(`input[value="Next"]`);
        assert.notEqual(await getPositionPage2(), -1);
    });


    test(`no progress bar`, async t => {
        const getProgressBar = Selector(() =>
            document.querySelectorAll("span"), { text: "Page 1 of 3", visibilityCheck: true, timeout: 1000});
        assert.equal(await getProgressBar(), null);
    });

    test(`show top progress bar`, async t => {
        const getProgressBar = Selector(() =>
            document.querySelectorAll("div"), { text: "Page 1 of 3", visibilityCheck: true});
        const isFirstSpanProgress = ClientFunction(() =>
            document.querySelectorAll("span")[0].innerHTML.indexOf("Page 1 of 3") !== -1
        );

        await t
            .click(`#show_top_progress_bar`);

        assert.notEqual(await getProgressBar(), null);
        assert(await isFirstSpanProgress());
    });

    test(`show bottom progress bar`, async t => {
        const getProgressBar = Selector(() =>
            document.querySelectorAll("div"), { text: "Page 1 of 3", visibilityCheck: true});
        const isLastSpanProgress = ClientFunction(() => {
            var spans = document.querySelectorAll("span");
            return spans[spans.length - 1].innerHTML.indexOf("Page 1 of 3") !== -1;
        });

        await t
            .click(`#show_bottom_progress_bar`);

        assert.notEqual(await getProgressBar(), null);
        assert(await isLastSpanProgress());
    });

    test(`check progress bar page 2`, async t => {
        const getProgressBar = Selector(() =>
            document.querySelectorAll("div"), { text: "Page 2 of 3", visibilityCheck: true});

        await t
            .click(`#show_top_progress_bar`)
            .click(`input[type=checkbox]`)
            .click(`input[value="Next"]`);

        assert.notEqual(await getProgressBar(), null);
    });

    test(`set completed html`, async t => {
        const getPosition = ClientFunction(() =>
            document.documentElement.innerHTML.indexOf("Wombat"));

        await t
            .click(`#set_completed_html`)
            .click(`input[type=checkbox]`)
            .click(`input[value="Next"]`)
            .click(`input[type=checkbox]`)
            .click(`input[value="Next"]`)
            .click(`input[value="Complete"]`);

        assert.notEqual(await getPosition(), -1);
    });

    test(`check previous`, async t => {
        const getPosition = ClientFunction(() =>
            document.documentElement.innerHTML.indexOf("What operating system do you use?"));

        await t
            .click(`input[type=checkbox]`)
            .click(`input[value="Next"]`)
            .click(`input[type=checkbox]`)
            .click(`input[value="Next"]`)
            .click(`input[value="Previous"]`)
            .click(`input[value="Previous"]`);

        assert.notEqual(await getPosition(), -1);
    });
});