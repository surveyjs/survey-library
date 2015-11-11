---
layout: example
title: Product Feedback survey
---
{% capture survey_setup %}
var survey = new Survey.Survey({% include surveys/real-productfeedback.json %});

{% endcapture %}

{% include live-example-code.html %}