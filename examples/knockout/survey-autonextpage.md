---
layout: example
title: Go to the next page automatically
propertiesFile: exampleproperties/autonextpage.html
---
{% capture survey_setup %}
var survey = new Survey.Survey({% include surveys/survey-autonextpage.json %});
{% endcapture %}
{% include live-example-code.html %}