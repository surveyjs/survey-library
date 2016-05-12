---
layout: example
propertiesFile: exampleproperties/processtext.html
title: Pre-process question and page titles, and html properties. 
---
{% capture survey_setup %}
var survey = new Survey.Survey({% include surveys/survey-processtext.json %});
{% endcapture %}

{% include live-example-code.html %}
