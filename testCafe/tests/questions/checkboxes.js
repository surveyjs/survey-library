import {frameworks, url} from "../settings";
import {Selector, ClientFunction} from 'testcafe';
const assert = require('assert');
const getSurveyResult = ClientFunction(() => window.SurveyResult);
const title = `checkboxes`;

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
        let position;
        let surveyResult;

        await t
            .click(`input[value=Complete]`);

        position = await getPosition();
        assert.notEqual(position, -1);

        surveyResult = await getSurveyResult();
        assert.equal(typeof surveyResult, `undefined`);
    });

    test(`choose value`, async t => {
        let surveyResult;

        await t
            .click(`form div:nth-child(5) label input`)
            .click(`input[value=Complete]`);

        surveyResult = await getSurveyResult();
        assert.equal(surveyResult.car, 'Nissan');
    });

    test(`choose several values`, async t => {
        let surveyResult;

        await t
            .click(`form div:nth-child(8) label input`)
            .click(`form div:nth-child(5) label input`)
            .click(`input[value=Complete]`);

        surveyResult = await getSurveyResult();
        assert.deepEqual(surveyResult.car, ['BMW', 'Nissan']);
    });

    test(`change column count`, async t => {
        const getStyleWidth = ClientFunction(() => document.querySelector(`form div`).style.width);
        let styleWidth = await getStyleWidth();
        assert.equal(styleWidth, '25%');

        await t
            .click(`#column_count_to_1`);
        styleWidth = await getStyleWidth();
        assert.equal(styleWidth, '100%');

        await t
            .click(`#column_count_to_2`);
        styleWidth = await getStyleWidth();
        assert.equal(styleWidth, '50%');
    });

    test(`change choices order`, async t => {
        const getChoicesCount = ClientFunction(() => document.querySelectorAll(`form div`).length);
        const getFirst = Selector('form > div', { index: 0});
        const getSecond = Selector('form > div', { index: 1});
        let rnd_count = 0;
        let first, second, first_2;
        let choicesCount = await getChoicesCount();

        // asc
        await t
            .click(`#order_asc`);
        first = await getFirst();
        second = await getSecond();

        assert.equal(first.textContent.trim(), 'Audi');
        assert.equal(second.textContent.trim(), 'BMW');

        // desc
        await t
            .click(`#order_desc`);
        first = await getFirst();
        second = await getSecond();
        assert.equal(first.textContent.trim(), 'Volkswagen');
        assert.equal(second.textContent.trim(), 'Vauxhall');

        // rnd
        if (choicesCount === 1) {
            assert(false, `need to more than one choices`);
        }

        for (let i = 0; i < 15; i++) {
            await t
                .click(`#order_asc`)
                .click(`#order_random`);
            first_2 = await getFirst();

            if (first.textContent.trim() !== first_2.textContent.trim()) {
                rnd_count++;
            }

            first = first_2;

            if (rnd_count >= 4) {
                break;
            }
        }

        assert(rnd_count >=4 ); // beacuse of 'none', 'asc', 'desc' and if 4 it is really rnd
    });

    test(`check integrity`, async t => {
        let i;
        const getChoicesCount = ClientFunction(() =>
            document.querySelectorAll('form input[type=checkbox]').length);
        const getChoicesExistence = ClientFunction(() => {
            var choices = ["None", "Ford", "Vauxhall", "Volkswagen", "Nissan", "Audi", "Mercedes-Benz", "BMW", "Peugeot",
                "Toyota", "Citroen"];
            var result;
            for (var i = 0; i < choices.length; i++) {
                if (document.documentElement.innerHTML.indexOf(choices[i]) === -1) return false;
            }
            return true;
        });
        let choicesCount, choicesExistence;
        let checkIntegrity = async () => {
            choicesCount = await getChoicesCount();
            assert.equal(choicesCount, 11);
            choicesExistence = await getChoicesExistence();
            assert(choicesExistence);
        };

        await t
            .click(`#order_asc`);
        await checkIntegrity();

        await t
            .click(`#order_desc`);
        await checkIntegrity();

        await t
            .click(`#order_random`);
        await checkIntegrity();
    });

    test(`show "other" choice`, async t => {
        const getPosition = ClientFunction(() => document.documentElement.innerHTML.indexOf('Other'));
        let position;

        await t
            .click(`#show_other`);
        position = await getPosition();
        assert.notEqual(position, -1);
    });

    test(`check "other" choice doesn't change order`, async t => {
        const getOtherChoice = Selector(() =>
            document.querySelectorAll(`form > div`)[11]);
        let otherChoice;

        await t
            .click(`#show_other`)
            .click(`#order_desc`);

        otherChoice = await getOtherChoice();
        assert.equal(otherChoice.textContent.trim(), 'Other');
    });

    test(`choose other`, async t => {
        const getOtherInput = Selector(() =>
            document.querySelectorAll("form div:nth-child(12) input")[1]);
        let surveyResult;

        await t
            .click(`#show_other`)
            .click(`form div:nth-child(12) label input`)
            .typeText(getOtherInput, 'Zaporozec')
            .click(`input[value=Complete]`);

        surveyResult = await getSurveyResult();
        assert.equal(surveyResult.car, 'other');
        assert.equal(surveyResult['car-Comment'], 'Zaporozec');
    });
});