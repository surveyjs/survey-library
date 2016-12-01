import {frameworks, url} from "../settings";
import {Selector, ClientFunction} from 'testcafe';
const assert = require('assert');
const getSurveyResult = ClientFunction(() => window.SurveyResult);
const title = `questionsInOneLine`;

frameworks.forEach( (framework) => {
    fixture `${framework} ${title}`

        .page `${url}${framework}`

        .beforeEach( async t => {
            await t
                .typeText(`#testName`, title)
                .click(`body`);
        });

    test(`check one line`, async t => {
        const isOneLine = ClientFunction(() =>
            document.querySelectorAll("div > h5:last-of-type")[2].parentNode.style.width === "50%" &&
            document.querySelectorAll("div > h5:last-of-type")[3].parentNode.style.width === "50%"
        );

        assert(await isOneLine());
    });

    test(`change title location`, async t => {
        const isInputAboveHeader = ClientFunction(() => {
            var h5 = document.querySelectorAll('h5:last-of-type')[2],
                input = h5.parentNode.querySelector('input');
            return h5.getBoundingClientRect().top > input.getBoundingClientRect().top;
        });

        const isHeaderAboveInput = ClientFunction(() => {
            var h5 = document.querySelectorAll('h5:first-of-type')[2],
                input = h5.parentNode.querySelector('input');
            return h5.getBoundingClientRect().top < input.getBoundingClientRect().top;
        });

        assert(await isInputAboveHeader());

        await t
            .click(`#change_title_location`);

        assert(await isHeaderAboveInput());
    });
});