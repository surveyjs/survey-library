import {frameworks, url} from "../settings";
import {Selector, ClientFunction} from 'testcafe';
const assert = require('assert');
const getSurveyResult = ClientFunction(() => window.SurveyResult);
const title = `text`;

frameworks.forEach( (framework) => {
    fixture `${framework} ${title}`

        .page `${url}${framework}`

        .beforeEach( async t => {
            await t
                .typeText(`#testName`, title)
                .pressKey(`enter`);
        });

    test(`fill text field`, async t => {
        let surveyResult;

        await t
            .typeText(`div input`, `stub@gmail.com`)
            .click(`input[value=Complete]`);

        surveyResult = await getSurveyResult();
        assert.deepEqual(surveyResult, {
            "email":"stub@gmail.com"
        });
    });

    if (framework.indexOf("bootstrap") === -1) {
        test(`change size`, async t => {
            const getWidth = ClientFunction(() =>
                document.querySelector('div input').clientWidth);
            let oldWidth;
            let newWidth;

            oldWidth = await getWidth();

            await t
                .click(`#change_size_to_10`);

            newWidth = await getWidth();

            assert(oldWidth > newWidth);
        });
    }
});