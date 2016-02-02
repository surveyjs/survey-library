---
layout: example
propertiesFile: exampleproperties/options.html
title: Use properties to set up your survey
---
{% capture survey_setup %}
var survey = new Survey.Survey({% include surveys/survey-severalpages.json %});
{% endcapture %}

{% include live-example-code.html %}
