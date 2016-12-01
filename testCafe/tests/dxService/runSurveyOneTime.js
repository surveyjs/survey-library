import {frameworks, url} from "../settings";
import {Selector, ClientFunction} from 'testcafe';
import uuid from 'node-uuid';
const assert = require('assert');
const getSurveyResult = ClientFunction(() => window.SurveyResult);
const title = `runSurveyOneTime`;

frameworks.forEach( (framework) => {
    fixture `${framework} ${title}`

        .page `${url}${framework}`

        .beforeEach( async t => {
            await t
                .typeText(`#testName`, title)
                .click(`body`);
        });

    test(`check one time run`, async t => {
        const getResultTextArea = Selector(() => document.querySelector('textarea'));
        const getSurveyMsg = ClientFunction(() =>  document.getElementById('surveyMsg').innerHTML);
        let clientID = uuid.v1();
        let resultTextArea;

        await t
            .typeText(`#clientId`, clientID)
            .click(`#btnStartSurvey`)
            .click(`form div:nth-child(1) label input`)
            .click(`input[value=Next]`)
            .click(`form div:nth-child(1) label input`)
            .click(`input[value=Next]`)
            .click(`input[value=Complete]`);

        resultTextArea = await getResultTextArea();
        assert.equal(resultTextArea.value,
            `clientId:${clientID}. The results are:{"opSystem":["Windows"],"langs":["Javascript"]}\n`);

        await t
            .click(`#btnStartSurvey`);

        assert.equal(await getSurveyMsg(), "You have already run the survey!")
    });

    test(`send results before moving on the next page`, async t => {
        const getResultTextArea = Selector(() => document.querySelector('textarea'));
        let clientID = uuid.v1();
        let resultTextArea;

        await t
            .click(`#sendResultOnPageNext`)
            .typeText(`#clientId`, clientID)
            .click(`#btnStartSurvey`)
            .click(`form div:nth-child(1) label input`)
            .click(`input[value=Next]`);

        resultTextArea = await getResultTextArea();
        assert.equal(resultTextArea.value,
            `clientId:${clientID}. The results are:{"opSystem":["Windows"]}\n`);
    });
});