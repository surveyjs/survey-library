import {frameworks, url} from "../settings";
import {Selector, ClientFunction} from 'testcafe';
const assert = require('assert');
const getSurveyResult = ClientFunction(() => window.SurveyResult);
const title = `standardValidators`;

frameworks.forEach( (framework) => {
    fixture `${framework} ${title}`

        .page `${url}${framework}`

        .beforeEach( async t => {
            await t
                .typeText(`#testName`, title)
                .pressKey(`enter`);
        });

    test(`check validation`, async t => {
        const getError = Selector((text, index) => {
            var nodes = [];
            document.querySelectorAll("*").forEach(function(node) {
                if (node.innerHTML === text) nodes.push(node);
            });

            return nodes[index]
        });

        const getTextInputByIndex = Selector((index) =>
            document.querySelectorAll('div input[type=text]')[index]);
        const getTextarea = Selector(() =>
            document.querySelector('textarea'));
        let surveyResult;

        await t
            .click(`input[value="Complete"]`)
            .hover(getError(`Please answer the question.`, 0))
            .hover(getError(`Please answer the question.`, 1))
            .hover(getError(`Please answer the question.`, 2));

        await t
            .typeText(await getTextInputByIndex(0), `wombat`)
            .click(`input[value="Complete"]`)
            .hover(getError(`Please enter a valid e-mail.`, 0))
            .hover(getError(`Please answer the question.`, 0))
            .hover(getError(`Please answer the question.`, 1));

        await t
            .typeText(await getTextInputByIndex(0), `wombat@mail.mail`, {replace: true})
            .typeText(await getTextInputByIndex(1), `wombat`)
            .click(`input[value="Complete"]`)
            .hover(getError(`The value should be a numeric.`, 0))
            .hover(getError(`Please answer the question.`, 0));

        await t
            .typeText(await getTextInputByIndex(1), `0`, {replace: true})
            .typeText(await getTextInputByIndex(2), `10000`)
            .click(`input[value="Complete"]`)
            .hover(getError(`The 'The least amount you have ever paid for a computer' should be equal or more than 10 and equal or less than 10000`, 0))
            .hover(getError(`Please answer the question.`, 0));

        await t
            .typeText(await getTextInputByIndex(1), `10`, {replace: true})
            .typeText(await getTextarea(), `0123456789`)
            .click(`input[value="Complete"]`)
            .hover(getError(`Please enter at least 20 symbols.`, 0));

        await t
            .typeText(await getTextarea(), `01234567890123456789`, {replace: true})
            .click(`input[value="Complete"]`);

        surveyResult = await getSurveyResult();
        assert.deepEqual(surveyResult, {
            "email":"wombat@mail.mail",
            "firstcomputer":"01234567890123456789",
            "pricelimit":{
                "leastamount":10,
                "mostamount":10000
            }
        });
    });
});