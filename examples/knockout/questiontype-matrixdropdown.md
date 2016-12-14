---
layout: example
title: Matrix with multiple choices (type:'matrixdropdown')
---
{% capture survey_setup %}
var survey = new Survey.Survey({% include surveys/questiontype-matrixdropdown.json %});
{% endcapture %}

{% include live-example-code.html %}
