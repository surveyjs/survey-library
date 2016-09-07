---
layout: example
propertiesFile: exampleproperties/startwithnewline.html
title: Show several questions in one line/row. 
---
{% capture survey_setup %}
var survey = new Survey.Survey({% include surveys/survey-startwithnewline.json %});
{% endcapture %}

{% include live-example-code.html %}