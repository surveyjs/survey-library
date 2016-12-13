---
layout: example
title: Change the template for checkbox and radiogroup questions. Use bootstrap buttons group.
---
{% capture survey_setup %}
var survey = new Survey.Survey({% include surveys/survey-about.json %});

new Survey.SurveyTemplateText().replaceText('{% include templates/question-radiogroup.html %}', "question", "radiogroup");
new Survey.SurveyTemplateText().replaceText('{% include templates/question-checkbox.html %}', "question", "checkbox");

{% endcapture %}

{% include live-example-code.html %}
