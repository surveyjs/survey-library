import {frameworks, url, setOptions, initSurvey, getSurveyResult} from "../settings";
import {Selector, ClientFunction} from 'testcafe';
const assert = require('assert');
const title = `html`;

const json = {
            questions: [{
                    type: "html",
                    name: "info",
                    html: "<table><body><row><td><img src='http://surveyjs.org/images/26178-20160417.jpg' width='100px' /></td><td style='padding:20px'>You may put here any html code. For example images, <b>text</b> or <a href='http://surveyjs.org/builder/index.html'  target='_blank'>links</a></td></row></body></table>"
            }]
        };

frameworks.forEach( (framework) => {
    fixture `${framework} ${title}`

        .page `${url}${framework}`

        .beforeEach( async t => {
            await initSurvey(framework, json);
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

        await setOptions('info', { html: "<h1>Wombat</h1>" });

        assert.notEqual(await getPosition(), -1);
    });
});
