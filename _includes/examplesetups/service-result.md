{% if page.usereact %}
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
ReactDOM.render(<Survey.Survey model={survey} onSendResult={surveySendResult} onGetResult={surveyGetResult} />, document.getElementById("surveyElement"));
{% endcapture %}
{% include live-example-code.html %}

{% elsif page.useknockout%}
<div id="chartContainer" style="width:500px;height:0px"></div>
<p> The current survey results could be accessible via the direct link. <a href="http://dxsurvey.com/Results/Survey/5af48e08-a0a5-44a5-83f4-1c90e8e98de1" target="_blank">See Survey Results</a></p>            


{% capture survey_setup %}
var survey = new Survey.Model({
        surveyId: '5af48e08-a0a5-44a5-83f4-1c90e8e98de1',
        surveyPostId: '3ce10f8b-2d8a-4ca2-a110-2994b9e697a1'
});

survey.onSendResult.add(function(s, options) {
    if(options.success) {
        s.getResult('a15eee7a-9418-4eb4-9671-2009c8ff6b24', 'langs');
    }
});
survey.onGetResult.add(function(s, options) {
    if(options.success) {
        showChart(options.dataList);
    }
});
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

{% endcapture %}
{% include live-example-code.html %}

{% elsif page.useangular%}
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
function onAngularComponentInit() {
    Survey.SurveyNG.render("surveyElement", {
        model:survey,
        onSendResult: surveySendResult,
        onGetResult: surveyGetResult
    });
}
{% include examplesetups/angular-example-component.md %}
{% endcapture %}
{% include live-example-code.html %}
{% elsif page.usejquery%}
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
$("#surveyElement").Survey({
    model: survey,
    onSendResult: surveySendResult,
    onGetResult: surveyGetResult
});
{% endcapture %}
{% include live-example-code.html %}
{% endif %}