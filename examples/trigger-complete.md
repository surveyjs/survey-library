---
layout: example
propertiesFile: exampleproperties/completetrigger.html
title: Complete Trigger - finishes the survey.
---
{% capture survey_setup %}
var survey = new Survey.Survey({
        triggers: [{ type: "complete", name: "exit1", operator: "equal", value: "Yes" },
            { type: "complete", name: "exit2", operator: "equal", value: "Yes" }],
        pages: [
        { title: "What operating system do you use?",
            questions: [
                {type:"checkbox", name:"opSystem", title: "OS", hasOther: true, 
                    choices:["Windows", "Linux", "Macintosh OSX"]},
                {type:"radiogroup", name:"exit1", title:"Do you want to finish the survey?", choices: ["Yes", "No"], colCount: 0}
            ]  
        },
        {   title: "What language(s) are you currently using?",
            questions: [
            {type:"checkbox", name:"langs",title:"Plese select from the list",
                 colCount: 4,
                choices:["Javascript", "Java", "Python", "CSS", "PHP", "Ruby", "C++", "C", 
                    "Shell", "C#", "Objective-C", "R", "VimL", "Go", "Perl", "CoffeeScript", 
                    "TeX", "Swift", "Scala", "Emacs List", "Haskell", "Lua", "Clojure", 
                    "Matlab", "Arduino", "Makefile", "Groovy", "Puppet", "Rust", "PowerShell"]
            },
            {type:"radiogroup", name:"exit2", title:"Do you want to finish the survey?", choices: ["Yes", "No"], colCount: 0}
        ]},        
        { title: "Please enter your name and e-mail",
            questions: [ 
            {type: "text", name: "name", title: "Name:"}, 
            {type: "text", name: "email", title: "Your e-mail"}]
        }]});
{% endcapture %}
{% include live-example-code.html %}
