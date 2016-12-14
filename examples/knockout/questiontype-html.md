---
layout: example
propertiesFile: exampleproperties/html.html
title: Use html elements inside your survey (type:'html')
---
{% capture survey_setup %}
var survey = new Survey.Survey({% include surveys/questiontype-html.json %});
{% endcapture %}

{% include live-example-code.html %}