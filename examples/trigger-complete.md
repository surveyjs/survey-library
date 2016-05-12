---
layout: example
propertiesFile: exampleproperties/completetrigger.html
title: Complete Trigger - finishes the survey.
---
{% capture survey_setup %}
var survey = new Survey.Survey({% include surveys/trigger-complete.json %});
{% endcapture %}
{% include live-example-code.html %}
