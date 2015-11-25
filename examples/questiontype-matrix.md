---
layout: example
title: Matrix (type:'matrix')
---
{% capture survey_setup %}
var survey = new Survey.Survey({% include surveys/questiontype-matrix.json %});
{% endcapture %}

{% include live-example-code.html %}
