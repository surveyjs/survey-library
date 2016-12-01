import {frameworks, url} from "../settings";
import {Selector, ClientFunction} from 'testcafe';
const assert = require('assert');
const getSurveyResult = ClientFunction(() => window.SurveyResult);
const title = `workWithData`;

frameworks.forEach( (framework) => {
    fixture `${framework} ${title}`

        .page `${url}${framework}`

        .beforeEach( async t => {
            await t
                .typeText(`#testName`, title)
                .click(`body`);
        });

    test(`set data`, async t => {
        let surveyResult;

        await t
            .click(`#set_data`)
            .click(`input[value=Complete]`);

        surveyResult = await getSurveyResult();
        assert.deepEqual(surveyResult, {
            "name":"John Doe",
            "email":"johndoe@nobody.com",
            "car":["Ford"]
        });
    });

    test(`add value changed listener`, async t => {
        const getPositionName = ClientFunction(() =>
            document.documentElement.innerHTML.indexOf("John Doe"));
        const getPositionCar = ClientFunction(() =>
            document.documentElement.innerHTML.indexOf("None"));


        await t
            .click(`#add_value_changed_listener`)
            .typeText(`div input`, `John Doe`)
            .click(`div input[type=checkbox]`);
        
        assert.notEqual(await getPositionName(), -1);
        assert.notEqual(await getPositionCar(), -1);
    });

    test(`set values`, async t => {
        let surveyResult;

        await t
            .click(`#set_values`)
            .click(`input[value=Complete]`);

        surveyResult = await getSurveyResult();
        assert.deepEqual(surveyResult, {
            "name":"Wombat",
            "email":"wo@mbat.com",
            "car":["BMW", "Ford"]
        });
    });

    test(`get value`, async t => {
        const getPositionCar = ClientFunction(() =>
            document.documentElement.innerHTML.indexOf("BMW"));
        
        await t
            .click(`#set_values`)
            .click(`#get_value`);

        assert.notEqual(await getPositionCar(), -1);
    });
});