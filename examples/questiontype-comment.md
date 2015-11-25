---
layout: example
title: Comment (type:'comment')
---
<p>
    Rows: <select onChange="survey.getQuestionByName('suggestions').rows = parseInt(this.value); survey.render();">
        <option value='1'>1</option>
        <option value='2'>2</option>
        <option value='3' selected="true">3</option>
        <option value='4'>4</option>
        <option value='5'>5</option>
        <option value='6'>6</option>
        <option value='7'>7</option>
        <option value='8'>8</option>
        <option value='9'>9</option>
        <option value='10'>10</option>
    </select> default is 3.
    <pre class="brush:js">survey.getQuestionByName('suggestions').rows = yourvalue; survey.render();"</pre>
</p>
<p>
    Cols: <select onChange="survey.getQuestionByName('suggestions').cols = parseInt(this.value); survey.render();">
        <option value='10'>10</option>
        <option value='25'>25</option>
        <option value='50' selected="true">50</option>
        <option value='75'>75</option>
        <option value='100'>100</option>
    </select> default is 50.
    <pre class="brush:js">survey.getQuestionByName('suggestions').cols = yourvalue; survey.render();"</pre>
</p>
{% capture survey_setup %}
var survey = new Survey.Survey({% include surveys/questiontype-comment.json %});
{% endcapture %}

{% include live-example-code.html %}
