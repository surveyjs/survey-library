import {frameworks, url} from "../settings";
import {Selector, ClientFunction} from 'testcafe';
const assert = require('assert');
const getSurveyResult = ClientFunction(() => window.SurveyResult);
const title = `html`;

frameworks.forEach( (framework) => {
    fixture `${framework} ${title}`

        .page `${url}${framework}`

        .beforeEach( async t => {
            await t
                .typeText(`#testName`, title)
                .click(`body`);
        });

    test(`check html elements`, async t => {
        const getImageExistance = ClientFunction(() =>
            !!document.querySelector('table img[src="http://surveyjs.org/images/26178-20160417.jpg"]'));
        const getBoldExistance = ClientFunction(() => !!document.querySelector('table b'));
        const getLinkExistance = ClientFunction(() =>
            !!document.querySelector('table a[href="http://surveyjs.org/builder/index.html"]'));

        assert(await getImageExistance());
        assert(await getBoldExistance());
        assert(await getLinkExistance());
    });

    test(`change html`, async t => {
        const getPosition = ClientFunction(() =>
            document.documentElement.innerHTML.indexOf('Wombat'));

        await t
            .click(`#change_html`);

        assert.notEqual(await getPosition(), -1);
    });
});