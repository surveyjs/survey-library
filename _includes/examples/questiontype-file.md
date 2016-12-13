---
layout: example
propertiesFile: exampleproperties/file.html
title: File uploading (type:'file')
---
{% capture survey_setup %}
var survey = new Survey.Survey({% include surveys/questiontype-file.json %});
{% endcapture %}

{% include live-example-code.html %}