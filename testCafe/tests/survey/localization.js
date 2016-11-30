import {frameworks, url, styles} from "../settings";
import {Selector, ClientFunction} from 'testcafe';
const assert = require('assert');
const getSurveyResult = ClientFunction(() => window.SurveyResult);
const title = `localization`;

frameworks.forEach( (framework) => {
    fixture `${framework} ${title}`

        .page `${url}${framework}`

        .beforeEach( async t => {
            await t
                .typeText(`#testName`, title)
                .click(`body`);
        });

    test(`next`, async t => {
        await t
            .click(`#ru`)
            .hover(`input[value=Далее]`)
            .click(`#en`)
            .hover(`input[value=Next]`)
            .click(`#de`)
            .hover(`input[value=Weiter]`)
            .click(`#fi`)
            .hover(`input[value=Seuraava]`)
            .click(`#fr`)
            .hover(`input[value=Suivant]`);
    });
});