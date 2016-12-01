import {frameworks, url} from "../settings";
import {Selector, ClientFunction} from 'testcafe';
const assert = require('assert');
const getSurveyResult = ClientFunction(() => window.SurveyResult);
const title = `visibleIf`;

frameworks.forEach( (framework) => {
    fixture `${framework} ${title}`

        .page `${url}${framework}`

        .beforeEach( async t => {
            await t
                .typeText(`#testName`, title)
                .click(`body`);
        });

    test(`check visibility`, async t => {
        const getHeader = Selector(() =>
            document.querySelectorAll(`h5`), { text: '* How many kids do you have' });
        const getSecondOption = Selector((index) =>
            document.querySelectorAll('option')[8]);
        const getSelectByIndex = Selector((index) =>
            document.querySelectorAll('select')[index], {visibilityCheck: true, timeout: 1000});
        let surveyResult;

        await t
            .click(`input[type=radio]`)
            .click(`select`)
            .click(`option[value="5"]`)
            .hover(getHeader)
            .hover(getSelectByIndex(5));

        await t
            .click(`select`)
            .click(`option[value="1"]`);

        assert.equal(await getSelectByIndex(5), null);

        await t
            .click(getSelectByIndex(1))
            .click(await getSecondOption())
            .click(`input[value="Complete"]`);

        surveyResult = await getSurveyResult();
        assert.deepEqual(surveyResult, {
            "haveKids":"Yes",
            "kid1Age":"2",
            "kids":"1"
        });
    });
});