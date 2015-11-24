---
layout: example
title: Use properties to set up your survey
---
<p>
Question Required Text: <input type="text" value="* " onChange="survey.requiredText = this.value; survey.render();"/> default is "* ".
<pre class="brush:js">survey.requiredText = yourValue; survey.render();</pre>
</p>
<p>
Show Question Numbers: <select onChange="survey.showQuestionNumbers = this.value; survey.render();">
    <option value="on" selected="true">on</option>
    <option value="onPage">onPage</option>
    <option value="off">off</option>
</select> default is 'on'. 'onPage' - set question numbers inside one page.
<pre class="brush:js">survey.showQuestionNumbers = yourValue; survey.render();</pre>
</p>
<p>
Show Title: <input type="checkbox" checked="true" onChange="survey.showTitle = this.checked; survey.render();"/> default is true.
<pre class="brush:js">survey.showTitle = yourValue; survey.render();</pre>
</p>
Show Page Titles: <input type="checkbox" checked="true" onChange="survey.showPageTitles = this.checked; survey.render();"/> default is true.
<pre class="brush:js">survey.showPageTitles = yourValue; survey.render();</pre>
<p>
Show Page Numbers: <input type="checkbox" onChange="survey.showPageNumbers = this.checked; survey.render();"/> default is false.
<pre class="brush:js">survey.showPageNumbers = yourValue; survey.render();</pre>
</p>
{% capture survey_setup %}
var survey = new Survey.Survey({ 
    title: "Software developer survey.",
    pages: [
        { title: "What operating system do you use?",
            questions: [
                {type:"checkbox", name:"opSystem", title: "OS", hasOther: true, isRequired: true, 
                    choices:["Windows", "Linux", "Macintosh OSX"]}
            ]  
        },
        {   title: "What language(s) are you currently using?",
            questions: [
            {type:"checkbox", name:"langs",title:"Plese select from the list",
                 colCount: 4, isRequired: true,
                choices:["Javascript", "Java", "Python", "CSS", "PHP", "Ruby", "C++", "C", 
                    "Shell", "C#", "Objective-C", "R", "VimL", "Go", "Perl", "CoffeeScript", 
                    "TeX", "Swift", "Scala", "Emacs List", "Haskell", "Lua", "Clojure", 
                    "Matlab", "Arduino", "Makefile", "Groovy", "Puppet", "Rust", "PowerShell"]
            }
        ]},        
        { title: "Please enter your name and e-mail",
            questions: [ 
            {type: "text", name: "name", title: "Name:"}, 
            {type: "text", name: "email", title: "Your e-mail"}]
        }]
});
{% endcapture %}

{% include live-example-code.html %}
