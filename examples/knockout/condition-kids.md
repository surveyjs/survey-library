---
layout: example
title: Write an expression in "visibleIf" to show/hide your question(s) 
---
{% capture survey_setup %}
var survey = new Survey.Survey({% include surveys/condition-kids.json %});
{% endcapture %}

{% include live-example-code.html %}