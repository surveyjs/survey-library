import {frameworks, url, setOptions, initSurvey, getSurveyResult} from "../settings";
import {Selector, ClientFunction} from 'testcafe';
const setupSurvey = ClientFunction(() => {
    document.querySelector('#surveyElement').insertAdjacentHTML(
        'afterend',
        '<div id="chartContainer"></div>'
    );

    window.survey.onSendResult.add(function(s, options) {
        if(options.success) {
            s.getResult('a15eee7a-9418-4eb4-9671-2009c8ff6b24', 'langs');
        }
    });
    window.survey.onGetResult.add(function(s, options) {
        if(options.success) {
            showChart(options.dataList);
        }
    });
    window.showChart = function(chartDataSource) {
        document.getElementById("chartContainer").style.height = "500px";
        $("#chartContainer").dxPieChart({
            dataSource: chartDataSource,
            series: {
                argumentField: 'name',
                valueField: 'value'
            }
        });
    }
});
const assert = require('assert');
const title = `getSurveyResult`;

const json = {
    surveyId: '5af48e08-a0a5-44a5-83f4-1c90e8e98de1',
    surveyPostId: '3ce10f8b-2d8a-4ca2-a110-2994b9e697a1'
};


frameworks.forEach( (framework) => {
    fixture `${framework} ${title}`

        .page `${url}${framework}`

        .beforeEach( async t => {
            await initSurvey(framework, json);
        });

    test(`correct get result`, async t => {
        await setupSurvey();
        await t
            .click(`div:nth-child(20) label input`)
            .click(`input[value="Complete"]`)
            .hover(`svg`);
    });
});
