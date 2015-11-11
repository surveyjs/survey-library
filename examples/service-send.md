---
layout: example
title: Save survey result into the dxSurvey Service
---
{% capture survey_setup %}
var survey = new Survey.Survey(
    { 
        surveyId: 'b2b56b2c-ad9e-4951-8f0e-c246d6b6a52a',
        surveyPostId: 'c731a4dc-292e-4cf1-9645-7467bbd9fd6b'
    });
{% endcapture %}
{% include live-example-code.html %}