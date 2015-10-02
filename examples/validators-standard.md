---
layout: example
title: Standard validators
---
{% capture survey_setup %}
var survey = new dxSurvey.Survey({% include surveys/validators-standard.json %});
{% endcapture %}

{% include live-example-code.html %}