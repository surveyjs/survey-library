<div id="chartContainer" style="width:500px;height:0px"></div>
<p> The current survey results could be accessible via the direct link. <a href="http://dxsurvey.com/Results/Survey/5af48e08-a0a5-44a5-83f4-1c90e8e98de1" target="_blank">See Survey Results</a></p>

{% capture survey_setup %}
var survey = new Survey.Model({
        surveyId: '5af48e08-a0a5-44a5-83f4-1c90e8e98de1',
        surveyPostId: '3ce10f8b-2d8a-4ca2-a110-2994b9e697a1'
});

var surveySendResult = function(s, options) {
    if(options.success) {
        s.getResult('a15eee7a-9418-4eb4-9671-2009c8ff6b24', 'langs');
    }
};
var surveyGetResult = function(s, options) {
    if(options.success) {
        showChart(options.dataList);
    }
};
function showChart(chartDataSource) {
    document.getElementById("chartContainer").style.height = "500px";
    $("#chartContainer").dxPieChart({
        dataSource: chartDataSource,
        series: {
            argumentField: 'name',
            valueField: 'value'
        }
    });
}

{% if page.usereact %}
ReactDOM.render(<Survey.Survey model={survey} onSendResult={surveySendResult} onGetResult={surveyGetResult} />, document.getElementById("surveyElement"));

{% elsif page.useknockout%}
survey.onSendResult.add(surveySendResult);
survey.onGetResult.add(surveyGetResult);

{% elsif page.useangular%}
function onAngularComponentInit() {
    Survey.SurveyNG.render("surveyElement", {
        model:survey,
        onSendResult: surveySendResult,
        onGetResult: surveyGetResult
    });
}
{% include examplesetups/angular-example-component.md %}

{% elsif page.usejquery%}
$("#surveyElement").Survey({
    model: survey,
    onSendResult: surveySendResult,
    onGetResult: surveyGetResult
});

{% elsif page.usevue %}
survey.onSendResult.add(surveySendResult);
survey.onGetResult.add(surveyGetResult);
var app = new Vue({ el: '#surveyElement', data: { survey: survey } });

{% endif %}
{% endcapture %}

{% include live-example-code.html %}
