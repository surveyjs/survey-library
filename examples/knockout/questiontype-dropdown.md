---
layout: example
propertiesFile: exampleproperties/selectbase.html
title: One choice - dropdown (type:'dropdown')
---
{% capture survey_setup %}
var survey = new Survey.Survey({% include surveys/questiontype-dropdown.json %});
{% endcapture %}

{% include live-example-code.html %}
{% include demo-selectbase-choices.html %}