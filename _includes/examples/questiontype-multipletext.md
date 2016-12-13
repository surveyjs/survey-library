---
layout: example
title: Multiple Text (type:'multipletext')
---
{% capture survey_setup %}
var survey = new Survey.Survey({% include surveys/questiontype-multipletext.json %});
{% endcapture %}

{% include live-example-code.html %}
