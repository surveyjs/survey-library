---
layout: example
title: Load survey json from the dxSurvey Service
---
{% capture survey_setup %}
var survey = new Survey.Survey(
    { 
        surveyId: '5af48e08-a0a5-44a5-83f4-1c90e8e98de1'
    });
{% endcapture %}
{% include live-example-code.html %}