---
layout: example
hasColumnCount: true
title: One choise - radio group (type:'radiogroup')
---
{% include demo-selectbase-properties.html %}
{% capture survey_setup %}
var survey = new Survey.Survey({% include surveys/questiontype-radiogroup.json %});
{% endcapture %}

{% include live-example-code.html %}
{% include demo-selectbase-choices.html %}