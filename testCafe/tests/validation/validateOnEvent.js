import {frameworks, url} from "../settings";
import {Selector, ClientFunction} from 'testcafe';
const assert = require('assert');
const getSurveyResult = ClientFunction(() => window.SurveyResult);
const title = `validateOnEvent`;

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
            .click(`#add_validate_event_listener`)
            .typeText(await getTextInputByIndex(0), `wombat`)
            .typeText(await getTextInputByIndex(1), `wombat`)
            .typeText(await getTextarea(), `01234567890123456789`)
            .click(`input[value="Complete"]`)
            .hover(getError(`The 'least amount' should be a numeric.`, 0))
            .hover(getError(`Please type the word 'computer'.`, 0));

        await t
            .typeText(await getTextInputByIndex(0), `10`, {replace: true})
            .click(`input[value="Complete"]`)
            .hover(getError(`The 'most amount' should be a numeric.`, 0));

        await t
            .typeText(await getTextInputByIndex(1), `10000`, {replace: true})
            .typeText(await getTextarea(), `0123456789computer0123456789`)
            .click(`input[value="Complete"]`);

        surveyResult = await getSurveyResult();
        assert.deepEqual(surveyResult, {
            "pricelimit":{
                "leastamount":"10",
                "mostamount":"10000"
            },
            "firstcomputer":"012345678901234567890123456789computer0123456789"
        });
    });
});