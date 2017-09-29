function init() {
    Survey.Survey.cssType = "bootstrap";
    Survey.defaultBootstrapCss.navigationButton = "btn btn-green";
    
    window.survey = new Survey.Model({ showQuestionNumbers: "off",
         questions: [
        { type: "radiogroup", name: "one", title: "Title 1", isRequired: true, choices:["Yes", "No"] },
        { type: "checkbox", name: "two", title: "Title 2", choices:["One", "Two"] },
        { type: "radiogroup", name: "three", title: "Title 3", choices:["Yes", "No"] },
        { type: "checkbox", name: "four", title: "Title 4", choices:["One", "Two"] },
    ]});
    survey.onComplete.add(function(result) {
        document.querySelector('#surveyResult').innerHTML = "result: " + JSON.stringify(result.data);
    });
    
    survey.onUpdateQuestionCssClasses.add(function(survey, options) {
      var classes = options.cssClasses
      
      classes.root = "sq-root";
      classes.title = "sq-title";
      classes.item = "sq-item";
      classes.label = "sq-label";
      
      if (options.question.isRequired) {
        classes.title = "sq-title sq-title-required";
        classes.root = "sq-root sq-root-required";
      }
      
      if (options.question.getType() === "checkbox") {
        classes.root = "sq-root sq-root-cb";
      }
    });
    
    
    $("#surveyElement").Survey({ 
        model: survey 
    });
    
    

}

if(!window["%hammerhead%"]) {
    init();
}
