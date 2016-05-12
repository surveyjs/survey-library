---
layout: example
title: SetValue Trigger - on changing the question, change values of other questions.
---
{% capture survey_setup %}
var survey = new Survey.Survey({% include surveys/trigger-setvalue.json %});
{% endcapture %}
{% include live-example-code.html %}
