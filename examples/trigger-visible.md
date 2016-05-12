---
layout: example
propertiesFile: exampleproperties/visibletrigger.html
title: Visible Trigger - Show/Hide question(s) on survey running.
---
{% capture survey_setup %}
var survey = new Survey.Survey({% include surveys/trigger-visible.json %});
{% endcapture %}
{% include live-example-code.html %}
