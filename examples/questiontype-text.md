---
layout: example
propertiesFile: exampleproperties/text.html
title: Text (type:'text')
---
{% capture survey_setup %}
var survey = new Survey.Survey({% include surveys/questiontype-text.json %});
{% endcapture %}

{% include live-example-code.html %}
