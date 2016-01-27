---
layout: example
title: One choice - dropdown (type:'dropdown')
---
{% include demo-selectbase-properties.html %}
{% capture survey_setup %}
var survey = new Survey.Survey({% include surveys/questiontype-dropdown.json %});
{% endcapture %}

{% include live-example-code.html %}
{% include demo-selectbase-choices.html %}