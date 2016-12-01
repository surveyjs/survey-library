import {frameworks, url} from "../settings";
import {Selector, ClientFunction} from 'testcafe';
const assert = require('assert');
const getSurveyResult = ClientFunction(() => window.SurveyResult);
const title = `matrixdynamic`;

frameworks.forEach( (framework) => {
    fixture `${framework} ${title}`

        .page `${url}${framework}`

        .beforeEach( async t => {
            await t
                .typeText(`#testName`, title)
                .click(`body`);
        });

    test(`choose empty`, async t => {
        const getPosition = ClientFunction(() =>
            document.documentElement.innerHTML.indexOf('Please answer the question'));
        let position, positionOld;
        let surveyResult;
        const baseSelectorFunc = function (strings, ...values) {
            return `tbody > tr:nth-child(${values[0]}) > td:nth-child(${values[1]})`;
        };

        await t
            .click(`input[value=Complete]`);

        position = await getPosition();
        positionOld = position;
        assert.notEqual(position, -1);

        surveyResult = await getSurveyResult();
        assert.equal(typeof surveyResult, `undefined`);

        await t
            .click(`${baseSelectorFunc`${1}${1}`} select`)
            .click(`${baseSelectorFunc`${1}${1}`} select option[value="Science: Physical Science"]`)
            .click(`input[value=Complete]`);

        position = await getPosition();
        assert.notEqual(position, -1);
        assert.notEqual(position, positionOld);

        surveyResult = await getSurveyResult();
        assert.equal(typeof surveyResult, `undefined`);
    });

    test(`choose several values`, async t => {
        let surveyResult, i;
        const baseSelectorFunc = function (strings, ...values) {
            return `tbody > tr:nth-child(${values[0]}) > td:nth-child(${values[1]})`;
        };
        const fillTheRow = async function(rowNumber) {
            await t
                .click(`${baseSelectorFunc`${rowNumber}${1}`} select`)
                .click(`${baseSelectorFunc`${rowNumber}${1}`} select option[value="Science: Physical Science"]`);

            for (i = 2; i < 13; i++) { // answer radios
                await t
                    .click(`${baseSelectorFunc`${rowNumber}${i}`} div:nth-child(1) label input`);
            }

            await t // answer comments
                .typeText(`${baseSelectorFunc`${rowNumber}${13}`} textarea`, `Wombats`)
                .typeText(`${baseSelectorFunc`${rowNumber}${14}`} textarea`, `Wombats`)
                .typeText(`${baseSelectorFunc`${rowNumber}${15}`} textarea`, `Wombats`);
        };

        await fillTheRow(1);
        await fillTheRow(2);

        await t
            .click(`input[value=Complete]`);

        surveyResult = await getSurveyResult();
        assert.deepEqual(surveyResult, {
            "frameworksRate":[
                {
                    "frusturation":"Wombats",
                    "likeTheBest":"Wombats",
                    "improvements":"Wombats",
                    "explains":"1",
                    "interesting":"1",
                    "effective":"1",
                    "knowledge":"1",
                    "recognition":"1",
                    "inform":"1",
                    "opinion":"1",
                    "respect":"1",
                    "cooperation":"1",
                    "parents":"1",
                    "selfthinking":"1",
                    "subject":"Science: Physical Science"
                },
                {
                    "frusturation":"Wombats",
                    "likeTheBest":"Wombats",
                    "improvements":"Wombats",
                    "explains":"1",
                    "interesting":"1",
                    "effective":"1",
                    "knowledge":"1",
                    "recognition":"1",
                    "inform":"1",
                    "opinion":"1",
                    "respect":"1",
                    "cooperation":"1",
                    "parents":"1",
                    "selfthinking":"1",
                    "subject":"Science: Physical Science"
                }
            ]
        });
    });

    test(`remove row`, async t => {
        const getRowCount = ClientFunction(() =>
            document.querySelectorAll(`tbody > tr`).length);
        let oldCount = await getRowCount();
        let newCount;
        let surveyResult;
        const baseSelectorFunc = function (strings, ...values) {
            return `tbody > tr:nth-child(${values[0]}) > td:nth-child(${values[1]})`;
        };

        await t
            .click(`${baseSelectorFunc`${1}${1}`} select`)
            .click(`${baseSelectorFunc`${1}${1}`} select option[value="Science: Physical Science"]`)
            .click(`${baseSelectorFunc`${2}${1}`} select`)
            .click(`${baseSelectorFunc`${2}${1}`} select option[value="Science: Chemistry"]`)
            .click(`${baseSelectorFunc`${2}${16}`} input[type=button][value=Remove]`);

        newCount = await getRowCount();
        assert(newCount === oldCount - 1);

        await t
            .click(`input[value=Complete]`);

        surveyResult = await getSurveyResult();
        assert.deepEqual(surveyResult, {
            "frameworksRate":[
                {
                    "subject":"Science: Physical Science"
                }
            ]}
        );
    });

    test(`add row`, async t => {
        const getRowCount = ClientFunction(() =>
            document.querySelectorAll(`tbody > tr`).length);
        let oldCount = await getRowCount();
        let newCount;
        let surveyResult;
        const baseSelectorFunc = function (strings, ...values) {
            return `tbody > tr:nth-child(${values[0]}) > td:nth-child(${values[1]})`;
        };

        await t
            .click(`input[type=button][value="Add Subject"]`)
            .click(`${baseSelectorFunc`${1}${1}`} select`)
            .click(`${baseSelectorFunc`${1}${1}`} select option[value="Science: Physical Science"]`)
            .click(`${baseSelectorFunc`${2}${1}`} select`)
            .click(`${baseSelectorFunc`${2}${1}`} select option[value="Science: Chemistry"]`)
            .click(`${baseSelectorFunc`${3}${1}`} select`)
            .click(`${baseSelectorFunc`${3}${1}`} select option[value="Math: Algebra"]`);

        newCount = await getRowCount();
        assert(newCount === oldCount + 1);

        await t
            .click(`input[value=Complete]`);

        surveyResult = await getSurveyResult();
        assert.deepEqual(surveyResult, {
            "frameworksRate":[
                {
                    "subject":"Science: Physical Science"
                },
                {
                    "subject":"Science: Chemistry"
                },
                {
                    "subject":"Math: Algebra"
                }
            ]}
        );
    });
});