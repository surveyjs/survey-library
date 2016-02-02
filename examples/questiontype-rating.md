---
layout: example
propertiesFile: exampleproperties/rating.html
title: Rating (type:'rating')
---
{% capture survey_setup %}
var survey = new Survey.Survey({% include surveys/questiontype-rating.json %});
{% endcapture %}

{% include live-example-code.html %}
