---
layout: example
title: Presentation Demo
usedxchart: true
---

<input type="button" value="Set some values" onclick="changeSurveyData()" />

<div id="chartContainer" style="width:500px;height:500px"></div>

{% capture survey_setup %}
var survey = new Survey.Survey(
{
    surveyId: '5af48e08-a0a5-44a5-83f4-1c90e8e98de1'
});

survey.data = {name: "Andrew Telnov"};

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
    $("#chartContainer").dxPieChart({
        dataSource: chartDataSource,
        series: {
            argumentField: 'name',
            valueField: 'value'
        }
    });
}


function changeSurveyData() {
    survey.setValue('langs', ['Java', 'C#']); 
    survey.setValue('email', 'andrewt@devexpress.com');
}


{% endcapture %}
{% include live-example-code.html %}
