import {frameworks, url, initSurvey, getSurveyResult} from "../settings";
import {Selector, ClientFunction} from 'testcafe';
const assert = require('assert');
const title = `comment`;

export const setOptions = ClientFunction((questionName, modValue) => {
    var mergeOptions = function (obj1, obj2) {
        for (var attrname in obj2) {
            obj1[attrname] = obj2[attrname];
        }
    };
    var q = survey.getQuestionByName(questionName || 'car');
    mergeOptions(q, modValue);
    survey.render();
});

var json = {
    questions: [{
        type: "comment",
        name: "suggestions",
        title: "What would make you more satisfied with the Product?"
    }]
};
var survey;

frameworks.forEach( (framework) => {
    fixture `${framework} ${title}`

        .page `${url}${framework}`

        .beforeEach( async t => {
            await initSurvey(json);
        });

    test(`fill textarea`, async t => {
        let surveyResult;

        await t
            .typeText(`textarea`, `puppies`)
            .pressKey(`enter`)
            .typeText(`textarea`, `money`)
            .click(`input[value=Complete]`);

        surveyResult = await getSurveyResult();
        assert.deepEqual(surveyResult, {
            "suggestions":"puppies\nmoney"
        });
    });

    if (framework.indexOf("bootstrap") === -1) {
        test(`change rows count`, async t => {
            const getComment = Selector(() =>
                document.querySelector(`textarea[rows="2"]`), {visibilityCheck: true});

            await setOptions('suggestions', { rows: 2 });
            await t.hover(getComment);
        });

        test(`change cols count`, async t => {
            const getWidth = ClientFunction(() =>
                document.querySelector('textarea').clientWidth);
            let oldWidth;
            let newWidth;

            oldWidth = await getWidth();

            await setOptions('suggestions', { cols: 25 });

            newWidth = await getWidth();

            assert(oldWidth > newWidth);
        });
    }
});