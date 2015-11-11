---
layout: example
title: Standard validators
---
{% capture survey_setup %}
var survey = new Survey.Survey({% include surveys/validators-standard.json %});
{% endcapture %}

{% include live-example-code.html %}