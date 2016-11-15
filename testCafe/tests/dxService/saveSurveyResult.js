import {frameworks, url} from "../settings";
import {Selector, ClientFunction} from 'testcafe';
const assert = require('assert');
const getSurveyResult = ClientFunction(() => window.SurveyResult);
const title = `saveSurveyResult`;

frameworks.forEach( (framework) => {
    fixture `${framework} ${title}`
        .page `https://dxsurvey.com/Home/SurveyResults/0edf84f9-14f7-4944-a857-e327e1dceebb`;

    test(`correct loading`, async t => {
        const getResultsCount = ClientFunction(() =>
            +document.querySelectorAll("dd")[2].textContent.trim());
        let oldCount;

        await t
            .typeText(`#Email`, `kurmanov.work@gmail.com`)
            .typeText(`#Password`, `Aa123456`)
            .click(`input[value="Log in"]`);

        oldCount = await getResultsCount();

        await t
            .navigateTo(url + framework)
            .typeText(`#testName`, title)
            .pressKey(`enter`)
            .click(`input[type=checkbox]`)
            .click(`input[value=Complete]`)
            .navigateTo(`https://dxsurvey.com/Home/SurveyResults/0edf84f9-14f7-4944-a857-e327e1dceebb`);

        assert.equal(oldCount + 1, await getResultsCount());
    });
});