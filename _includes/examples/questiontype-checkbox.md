---
layout: example
hasColumnCount: true
propertiesFile: exampleproperties/selectbase.html
title: One choice - checkbox (type:'checkbox')
---
{% capture survey_setup %}
var survey = new Survey.Survey({% include surveys/questiontype-checkbox.json %});
{% endcapture %}

{% include live-example-code.html %}
{% include demo-selectbase-choices.html %}