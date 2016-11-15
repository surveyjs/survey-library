import {frameworks, url} from "../settings";
import {Selector, ClientFunction} from 'testcafe';
const assert = require('assert');
const getSurveyResult = ClientFunction(() => window.SurveyResult);
const title = `preprocessTitlesAndHtml`;

frameworks.forEach( (framework) => {
    fixture `${framework} ${title}`

        .page `${url}${framework}`

        .beforeEach( async t => {
            await t
                .typeText(`#testName`, title)
                .pressKey(`enter`);
        });

    test(`check title and html`, async t => {
        const getFirstTitle = Selector(() =>
            document.querySelectorAll("h5"), { text: "A) Please type your name (*):", visibilityCheck: true, timeout: 1000});
        const getSecondTitle = Selector(() =>
            document.querySelectorAll("h5"), { text: "B) Please type your e-mail (*):", visibilityCheck: true, timeout: 1000});
        const getThirdTitle = Selector(() =>
            document.querySelectorAll("h5"), { text: "C) wombat, please tell us what is on your mind :", visibilityCheck: true, timeout: 1000});
        const getcompletedHtml = ClientFunction(() =>
            document.documentElement.innerHTML.indexOf(
                "<p></p><h4>Thank you for sharing this information with us.</h4><p></p><p>Your name is: <b>wombat</b></p>" +
                "<p>Your email is: <b>wombat@mail.mail</b></p><p>This is what is on your mind:</p><p>fresh grasses</p>"));

        await t
            .hover(getFirstTitle)
            .hover(getSecondTitle);

        await t
            .typeText(`h4 + div input[type=text]`, `wombat`)
            .typeText(`h4 + div + div input[type=text]`, `wombat@mail.mail`)
            .click(`input[value="Next"]`);

        await t
            .hover(getThirdTitle)
            .typeText(`textarea`, `fresh grasses`)
            .click(`input[value="Complete"]`);

        assert.notEqual(await getcompletedHtml(), -1);
    });
});