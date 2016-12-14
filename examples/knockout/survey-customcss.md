---
layout: example
title: Custom css
---
{% capture survey_setup %}
var survey = new Survey.Survey({% include surveys/questiontype-matrix.json %});
survey.css = {
        matrix: {root: "table table-striped"},
        navigationButton: "button btn-lg"   
   };
{% endcapture %}

{% include live-example-code.html %}
<div>
    <p />
    <p>Set the css property to override the required css class(s).</p>
    <p>
    Currently you may override the following css classes:
    </p>
    <textarea id="surveyClasses" style="width:100%" rows="20"></textarea>
</div>
<script type="text/javascript">
    document.getElementById('surveyClasses').value = JSON.stringify(survey.css, null, '\t');
</script>