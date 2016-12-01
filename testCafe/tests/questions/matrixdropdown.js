import {frameworks, url} from "../settings";
import {Selector, ClientFunction} from 'testcafe';
const assert = require('assert');
const getSurveyResult = ClientFunction(() => window.SurveyResult);
const title = `matrixdropdown`;

frameworks.forEach( (framework) => {
    fixture `${framework} ${title}`

        .page `${url}${framework}`

        .beforeEach( async t => {
            await t
                .typeText(`#testName`, title)
                .click(`body`);
        });

    test(`choose several values`, async t => {
        let surveyResult;
        const baseSelectorFunc = function (strings, ...values) {
            return `tbody > tr:nth-child(${values[0]}) > td:nth-child(${values[1]})`;
        };

        // answer for row 1
        await t
            .click(`${baseSelectorFunc`${1}${2}`} input[value=Yes]`)
            .click(`${baseSelectorFunc`${1}${3}`} select`)
            .click(`${baseSelectorFunc`${1}${3}`} select option[value="2"]`)
            .click(`${baseSelectorFunc`${1}${4}`} div:nth-child(3) label input`)
            .typeText(`${baseSelectorFunc`${1}${5}`} input`, `why hello world so hard`)
            .click(`${baseSelectorFunc`${1}${6}`} select`)
            .click(`${baseSelectorFunc`${1}${6}`} select option[value="Excelent"]`);

        // answer for row 3
        await t
            .click(`${baseSelectorFunc`${3}${2}`} input[value=No]`)
            .click(`${baseSelectorFunc`${3}${3}`} select`)
            .click(`${baseSelectorFunc`${3}${3}`} select option[value="5"]`)
            .click(`${baseSelectorFunc`${3}${4}`} div:nth-child(1) label input`)
            .click(`${baseSelectorFunc`${3}${4}`} div:nth-child(4) label input`)
            .typeText(`${baseSelectorFunc`${3}${5}`} input`, `it is not 2016`)
            .click(`${baseSelectorFunc`${3}${6}`} select`)
            .click(`${baseSelectorFunc`${3}${6}`} select option[value="Good"]`);

        await t
            .click(`input[value=Complete]`);

        surveyResult = await getSurveyResult();
        assert.deepEqual(surveyResult, {
            "frameworksRate":{
                "angularv1":{
                    "using":"Yes",
                    "knowledge":"why hello world so hard",
                    "rate":"Excelent",
                    "strength":["Fast"],
                    "experience":"2"
                },
                "knockoutjs":{
                    "knowledge":"it is not 2016",
                    "rate":"Good",
                    "strength":["Easy","Powerfull"],
                    "experience":"5",
                    "using":"No"
                }
            }
        });
    });
});