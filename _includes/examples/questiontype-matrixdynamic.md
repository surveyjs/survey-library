---
layout: example
title: Matrix with dynamic rows (type:'matrixdynamic')
---
{% capture survey_setup %}
var survey = new Survey.Survey({% include surveys/questiontype-matrixdynamic.json %});
{% endcapture %}

{% include live-example-code.html %}
