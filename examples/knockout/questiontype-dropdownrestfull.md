---
layout: example
propertiesFile: exampleproperties/choicesrestfull.html
title: One choice - dropdown (type:'dropdown'). Get the choices from a restfull service.
---
{% capture survey_setup %}
var survey = new Survey.Survey({% include surveys/questiontype-dropdownrestfull.json %});
{% endcapture %}

{% include live-example-code.html %}