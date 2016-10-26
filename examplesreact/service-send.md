---
layout: example
usereact: true
title: Save survey result into the dxSurvey Service
---
<p> The current survey results could be accessible via the direct link. <a href="http://dxsurvey.com/Results/Survey/5af48e08-a0a5-44a5-83f4-1c90e8e98de1" target="_blank">See Survey Results</a></p>
{% capture survey_setup %}
var survey = new Survey.ReactSurveyModel( { 
        surveyId: '5af48e08-a0a5-44a5-83f4-1c90e8e98de1',
        surveyPostId: '3ce10f8b-2d8a-4ca2-a110-2994b9e697a1'
    });
ReactDOM.render(<Survey.Survey model={survey} />, document.getElementById("surveyElement"));    
{% endcapture %}
{% include live-example-code.html %}