---
layout: example
title: Rating (type:'rating')
---
<p>
    Minimum Rate Description: <input type="text" value="Not Satisfied" onchange="survey.getQuestionByName('satisfaction').mininumRateDescription = this.value; survey.render();"></> default is empty.
    <pre class="brush:js">survey.getQuestionByName('satisfaction').mininumRateDescription = yourvalue; survey.render();"</pre>
</p>
<p>
    Maximum Rate Description: <input type="text" value="Completely satisfied" onchange="survey.getQuestionByName('satisfaction').maximumRateDescription = this.value; survey.render();"></> default is empty.
    <pre class="brush:js">survey.getQuestionByName('satisfaction').maximumRateDescription = yourvalue; survey.render();"</pre>
</p>
<p>
    Rate values: <select onChange="survey.getQuestionByName('satisfaction').rateValues = JSON.parse(this.value); survey.render();">
        <option value='[]' selected="true">Empty</option>
        <option value='[1, 2, 3]'>[1, 2, 3]</option>
        <option value='[{"value": 1, "text": "Bad"}, {"value": 2, "text": "Average"}, {"value": 1, "text": "Good"}]'>[{value: 1, text: "Bad"}, {value: 2, text: "Average"}, {value: 1, text: "Good"}]</option>
    </select> default is empty.
    <pre class="brush:js">survey.getQuestionByName('satisfaction').rateValues = yourvalue; survey.render();"</pre>
</p>

{% capture survey_setup %}
var survey = new Survey.Survey({% include surveys/questiontype-rating.json %});
{% endcapture %}

{% include live-example-code.html %}
