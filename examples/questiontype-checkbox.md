---
layout: example
hasColumnCount: true
title: One choise - checkbox (type:'checkbox')
---
{% include demo-selectbase-properties.html %}
{% capture survey_setup %}
var survey = new Survey.Survey({% include surveys/questiontype-checkbox.json %});
{% endcapture %}

{% include live-example-code.html %}
{% include demo-selectbase-choices.html %}