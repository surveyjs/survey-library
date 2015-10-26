---
layout: example
title: Load survey json from the dxSurvey Service
---
{% capture survey_setup %}
var survey = new dxSurvey.Survey(
    { 
        surveyId: 'b2b56b2c-ad9e-4951-8f0e-c246d6b6a52a'
    });
{% endcapture %}
{% include live-example-code.html %}