---
layout: example
hasColumnCount: true
propertiesFile: exampleproperties/selectbase.html 
title: One choice - radio group (type:'radiogroup')
---
{% capture survey_setup %}
var survey = new Survey.Survey({% include surveys/questiontype-radiogroup.json %});
{% endcapture %}

{% include live-example-code.html %}
{% include demo-selectbase-choices.html %}