// import {
//   frameworks,
//   url,
//   setOptions,
//   initSurvey,
//   getSurveyResult
// } from "../helper";
// import { Selector, ClientFunction } from "testcafe";
// const assert = require("assert");
// const title = `saveSurveyResult`;

// const json = {
//   surveyId: "0edf84f9-14f7-4944-a857-e327e1dceebb",
//   surveyPostId: "8c03f02b-0b55-4cda-96b8-d1bf7c87b05d"
// };
/* TODO
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
            .navigateTo(url + framework);

        await initSurvey(framework, json);

        await t
            .click(`input[type=checkbox]`)
            .click(`input[value=Complete]`)
            .wait(3000)
            .navigateTo(`https://dxsurvey.com/Home/SurveyResults/0edf84f9-14f7-4944-a857-e327e1dceebb`);

        assert.equal(oldCount + 1, await getResultsCount());
    });
});
*/
