---
layout: example
propertiesFile: exampleproperties/processtext.html
title: Pre-process question and page titles, and html properties. 
---
{% capture survey_setup %}
var survey = new Survey.Survey({
    pages: [ 
        {
            title: "This is the page {pageno} of {pagecount}.", 
            questions: [
            {type: "text", name: "name", title: "Please type your name:", isRequired: true},
            {type: "text", name: "email", title: "Please type your e-mail", isRequired: true, validators: [{type:"email"}]}]
        },
        {
            title: "This is the page {pageno} of {pagecount}.", 
            questions: [
            {type: "comment", name: "comment", title: "Please tell us what is on your mind:"}]
        }
],
completedHtml: "<p><h4>Thank you for sharing this information with us.</h4></p><p>Your name is: <b>{name}</b></p><p>Your email is: <b>{email}</b></p><p>This is what is on your mind:</p><p>{comment}</p>"
});
{% endcapture %}

{% include live-example-code.html %}
