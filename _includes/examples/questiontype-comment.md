---
layout: example
propertiesFile: exampleproperties/comment.html
title: Comment (type:'comment') 
---
{% capture survey_setup %}
var survey = new Survey.Survey({% include surveys/questiontype-comment.json %});
{% endcapture %}

{% include live-example-code.html %}
