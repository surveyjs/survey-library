---
layout: example
title: Text (type:'text')
propertiesFile: exampleproperties/questiontext.html
---
{% capture survey_setup %}
var survey = new Survey.Survey({% include surveys/questiontype-text.json %});
{% endcapture %}

{% include live-example-code.html %}
